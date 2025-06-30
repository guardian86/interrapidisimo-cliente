import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
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
import { EstudianteService } from '../../../../core/services/student.service';
import { UpdateEstudianteDto, EstudianteDto } from '../../../../core/models/estudiante.model';

@Component({
  selector: 'app-estudiantes-editar',
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
  templateUrl: './estudiantes-editar.component.html',
  styleUrls: ['./estudiantes-editar.component.scss']
})
export class EstudiantesEditarComponent implements OnInit {
  estudianteForm: FormGroup;
  loading = signal(false);
  estudiante = signal<EstudianteDto | null>(null);
  estudianteId: number;

  constructor(
    private formBuilder: FormBuilder,
    private estudianteService: EstudianteService,
    private snackBar: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.estudianteId = Number(this.route.snapshot.paramMap.get('id'));
    this.estudianteForm = this.formBuilder.group({
      nombre: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      apellido: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(100)]],
      telefono: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/), Validators.maxLength(15)]],
      fechaNacimiento: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.loadEstudiante();
  }

  loadEstudiante(): void {
    this.loading.set(true);
    this.estudianteService.getEstudianteById(this.estudianteId).subscribe({
      next: (response) => {
        if (response && response.success && response.data) {
          const estudiante = response.data;
          this.estudiante.set(estudiante);
          
          // Cargar datos en el formulario
          this.estudianteForm.patchValue({
            nombre: estudiante.nombre,
            apellido: estudiante.apellido,
            email: estudiante.email,
            telefono: estudiante.telefono,
            fechaNacimiento: new Date(estudiante.fechaNacimiento)
          });
        } else {
          this.snackBar.open('No se pudo cargar la información del estudiante', 'Cerrar', {
            duration: 4000,
            panelClass: ['error-snackbar']
          });
          this.router.navigate(['/estudiantes']);
        }
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading student:', error);
        this.snackBar.open('Error al cargar el estudiante', 'Cerrar', {
          duration: 4000,
          panelClass: ['error-snackbar']
        });
        this.loading.set(false);
        this.router.navigate(['/estudiantes']);
      }
    });
  }

  onSubmit(): void {
    if (this.estudianteForm.valid && this.estudiante()) {
      this.loading.set(true);
      const formValue = this.estudianteForm.value;
      const estudianteData: UpdateEstudianteDto = {
        id: this.estudianteId,
        ...formValue,
        fechaNacimiento: new Date(formValue.fechaNacimiento).toISOString()
      };

      this.estudianteService.updateEstudiante(this.estudianteId, estudianteData).subscribe({
        next: (response) => {
          if (response && response.success) {
            this.snackBar.open('Estudiante actualizado exitosamente', 'Cerrar', {
              duration: 3000,
              panelClass: ['success-snackbar']
            });
            this.router.navigate(['/estudiantes']);
          } else {
            this.snackBar.open('Error al actualizar estudiante: ' + (response?.message || 'Error desconocido'), 'Cerrar', {
              duration: 4000,
              panelClass: ['error-snackbar']
            });
          }
          this.loading.set(false);
        },
        error: (error) => {
          console.error('Error updating student:', error);
          this.snackBar.open('Error al actualizar estudiante', 'Cerrar', {
            duration: 4000,
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
      fechaNacimiento: 'Fecha de nacimiento'
    };
    return displayNames[fieldName] || fieldName;
  }
}
