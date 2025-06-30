import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { EstudianteService } from '../../../../core/services/student.service';
import { CreateEstudianteDto } from '../../../../core/models/estudiante.model';

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
      fechaNacimiento: ['', [Validators.required]]
    });
  }

  onSubmit(): void {
    if (this.estudianteForm.valid) {
      this.loading.set(true);
      const formValue = this.estudianteForm.value;
      const estudianteData: CreateEstudianteDto = {
        ...formValue,
        fechaNacimiento: new Date(formValue.fechaNacimiento).toISOString()
      };

      this.estudianteService.createEstudiante(estudianteData).subscribe({
        next: (response) => {
          if (response.success) {
            this.snackBar.open('Estudiante creado exitosamente', 'Cerrar', {
              duration: 3000,
              horizontalPosition: 'right',
              verticalPosition: 'bottom',
              panelClass: ['success-snackbar']
            });
            this.router.navigate(['/students']);
          } else {
            this.snackBar.open('Error al crear estudiante: ' + (response.message || 'Error desconocido'), 'Cerrar', {
              duration: 4000,
              horizontalPosition: 'right',
              verticalPosition: 'bottom',
              panelClass: ['error-snackbar']
            });
          }
          this.loading.set(false);
        },
        error: (error) => {
          console.error('Error creating student:', error);
          this.snackBar.open('Error al crear estudiante. Verifique los datos e intente nuevamente.', 'Cerrar', {
            duration: 4000,
            horizontalPosition: 'right',
            verticalPosition: 'bottom',
            panelClass: ['error-snackbar']
          });
          this.loading.set(false);
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  onCancel(): void {
    this.router.navigate(['/students']);
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
      fechaNacimiento: 'Fecha de nacimiento'
    };
    return displayNames[fieldName] || fieldName;
  }
}
