import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { EstudianteService } from '../../../../core/services/estudiante.service';
import { EstudianteCreateDto } from '../../../../core/models/estudiante.model';

@Component({
  selector: 'app-estudiantes-crear',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  templateUrl: './estudiantes-crear.component.html',
  styleUrls: ['./estudiantes-crear.component.scss']
})
export class EstudiantesCrearComponent {
  estudianteForm: FormGroup;
  loading = signal(false);

  constructor(
    private formBuilder: FormBuilder,
    private estudianteService: EstudianteService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    this.estudianteForm = this.formBuilder.group({
      nombre: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      apellido: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(100)]],
      telefono: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/), Validators.maxLength(15)]],
      fechaNacimiento: ['', [Validators.required]],
      documento: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(20)]]
    });
  }

  onSubmit(): void {
    console.log('=== SUBMITTING FORM ===');
    console.log('Form valid:', this.estudianteForm.valid);
    console.log('Form value:', this.estudianteForm.value);
    console.log('Form errors:', this.getFormErrors());
    
    if (this.estudianteForm.valid) {
      this.loading.set(true);
      const formValue = this.estudianteForm.value;
      
      // Formatear fecha correctamente
      let fechaNacimiento = formValue.fechaNacimiento;
      if (fechaNacimiento instanceof Date) {
        fechaNacimiento = fechaNacimiento.toISOString().split('T')[0]; // YYYY-MM-DD format
      } else if (typeof fechaNacimiento === 'string') {
        fechaNacimiento = new Date(fechaNacimiento).toISOString().split('T')[0];
      }

      const estudianteData: EstudianteCreateDto = {
        nombre: formValue.nombre,
        apellido: formValue.apellido,
        email: formValue.email,
        telefono: formValue.telefono,
        fechaNacimiento: fechaNacimiento,
        documento: formValue.documento
      };

      console.log('Sending data to API:', estudianteData);

      this.estudianteService.createEstudiante(estudianteData).subscribe({
        next: (response) => {
          console.log('API Response:', response);
          
          if (response && response.id) {
            this.snackBar.open('Estudiante creado exitosamente', 'Cerrar', {
              duration: 3000,
              horizontalPosition: 'right',
              verticalPosition: 'bottom',
              panelClass: ['success-snackbar']
            });
            this.router.navigate(['/estudiantes']);
          } else {
            this.snackBar.open('Error al crear estudiante: respuesta inesperada del servidor', 'Cerrar', {
              duration: 4000,
              horizontalPosition: 'right',
              verticalPosition: 'bottom',
              panelClass: ['error-snackbar']
            });
          }
          this.loading.set(false);
        },
        error: (error) => {
          console.error('API Error details:', error);
          console.error('Error status:', error.status);
          console.error('Error message:', error.message);
          console.error('Error body:', error.error);
          
          let errorMessage = 'Error al crear estudiante. ';
          if (error.status === 0) {
            errorMessage += 'No se puede conectar al servidor. Verifique que el WebAPI esté funcionando en http://localhost:5099';
          } else if (error.status === 400) {
            errorMessage += 'Datos inválidos: ' + (error.error?.message || 'Verifique los campos');
          } else if (error.status === 500) {
            errorMessage += 'Error interno del servidor';
          } else {
            errorMessage += `Error ${error.status}: ${error.message}`;
          }
          
          this.snackBar.open(errorMessage, 'Cerrar', {
            duration: 6000,
            horizontalPosition: 'right',
            verticalPosition: 'bottom',
            panelClass: ['error-snackbar']
          });
          this.loading.set(false);
        }
      });
    } else {
      console.log('Form is invalid, marking all fields as touched');
      this.markFormGroupTouched();
    }
  }

  onCancel(): void {
    this.router.navigate(['/estudiantes']);
  }

  private markFormGroupTouched(): void {
    Object.keys(this.estudianteForm.controls).forEach(key => {
      const control = this.estudianteForm.get(key);
      control?.markAsTouched();
    });
  }

  getErrorMessage(fieldName: string): string {
    const control = this.estudianteForm.get(fieldName);
    if (control?.hasError('required')) {
      return `${this.getFieldDisplayName(fieldName)} es requerido`;
    }
    if (control?.hasError('email')) {
      return 'Email no es válido';
    }
    if (control?.hasError('minlength')) {
      const minLength = control.errors?.['minlength'].requiredLength;
      return `${this.getFieldDisplayName(fieldName)} debe tener al menos ${minLength} caracteres`;
    }
    if (control?.hasError('maxlength')) {
      const maxLength = control.errors?.['maxlength'].requiredLength;
      return `${this.getFieldDisplayName(fieldName)} no puede exceder ${maxLength} caracteres`;
    }
    if (control?.hasError('pattern')) {
      return 'Teléfono debe tener 10 dígitos';
    }
    return '';
  }

  private getFieldDisplayName(fieldName: string): string {
    const displayNames: { [key: string]: string } = {
      nombre: 'Nombre',
      apellido: 'Apellido',
      email: 'Email',
      telefono: 'Teléfono',
      fechaNacimiento: 'Fecha de nacimiento',
      documento: 'Documento'
    };
    return displayNames[fieldName] || fieldName;
  }

  private getFormErrors(): any {
    let formErrors: any = {};
    Object.keys(this.estudianteForm.controls).forEach(key => {
      const controlErrors = this.estudianteForm.get(key)?.errors;
      if (controlErrors) {
        formErrors[key] = controlErrors;
      }
    });
    return formErrors;
  }
}
