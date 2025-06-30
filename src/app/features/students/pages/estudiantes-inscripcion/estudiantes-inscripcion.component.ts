import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatListModule } from '@angular/material/list';
import { MatChipsModule } from '@angular/material/chips';
import { MatExpansionModule } from '@angular/material/expansion';
import { EstudianteService } from '../../../../core/services/student.service';
import { MateriaService } from '../../../../core/services/materia.service';
import { InscripcionService } from '../../../../core/services/inscripcion.service';
import { Estudiante } from '../../../../core/models/estudiante.model';
import { Materia } from '../../../../core/models/materia.model';
import { Inscripcion, CreateInscripcionDto } from '../../../../core/models/inscripcion.model';

@Component({
  selector: 'app-estudiantes-inscripcion',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatListModule,
    MatChipsModule,
    MatExpansionModule
  ],
  templateUrl: './estudiantes-inscripcion.component.html',
  styleUrls: ['./estudiantes-inscripcion.component.scss']
})
export class EstudiantesInscripcionComponent implements OnInit {
  enrollmentForm: FormGroup;
  estudiantes = signal<Estudiante[]>([]);
  materias = signal<Materia[]>([]);
  selectedMaterias = signal<Materia[]>([]);
  companeros = signal<{ [materiaId: number]: Estudiante[] }>({});
  loading = signal(false);
  
  readonly MAX_MATERIAS = 3;
  readonly CREDITOS_POR_MATERIA = 3;

  constructor(
    private formBuilder: FormBuilder,
    private estudianteService: EstudianteService,
    private materiaService: MateriaService,
    private inscripcionService: InscripcionService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    this.enrollmentForm = this.formBuilder.group({
      estudianteId: ['', [Validators.required]],
      materiaIds: [[], [Validators.required, this.maxMateriasValidator.bind(this)]]
    });
  }

  ngOnInit(): void {
    this.loadEstudiantes();
    this.loadMaterias();
  }

  loadEstudiantes(): void {
    this.estudianteService.getEstudiantes().subscribe({
      next: (response: any) => {
        if (response.success && response.data) {
          const estudiantes = Array.isArray(response.data) ? response.data : response.data.data || [];
          this.estudiantes.set(estudiantes);
        }
      },
      error: (error) => {
        console.error('Error loading students:', error);
      }
    });
  }

  loadMaterias(): void {
    this.materiaService.getMaterias().subscribe({
      next: (response: any) => {
        if (response.success && response.data) {
          const materias = Array.isArray(response.data) ? response.data : response.data.data || [];
          this.materias.set(materias);
        }
      },
      error: (error) => {
        console.error('Error loading subjects:', error);
      }
    });
  }

  onMateriaSelectionChange(materiaIds: number[]): void {
    if (materiaIds.length > this.MAX_MATERIAS) {
      this.snackBar.open(`Solo puede seleccionar máximo ${this.MAX_MATERIAS} materias`, 'Cerrar', {
        duration: 3000,
        horizontalPosition: 'right',
        verticalPosition: 'bottom',
        panelClass: ['warning-snackbar']
      });
      
      // Mantener solo las primeras 3 materias seleccionadas
      const limitedIds = materiaIds.slice(0, this.MAX_MATERIAS);
      this.enrollmentForm.patchValue({ materiaIds: limitedIds });
      materiaIds = limitedIds;
    }

    const selectedMaterias = this.materias().filter(m => materiaIds.includes(m.id));
    this.selectedMaterias.set(selectedMaterias);
    
    // Validar que no haya el mismo profesor en las materias seleccionadas
    this.validateProfesores(selectedMaterias);
    
    // Cargar compañeros para cada materia seleccionada
    this.loadCompaneros(materiaIds);
  }

  validateProfesores(selectedMaterias: Materia[]): void {
    const profesorIds = selectedMaterias
      .map(m => m.profesorId)
      .filter(id => id !== undefined);
    
    const uniqueProfesores = new Set(profesorIds);
    
    if (profesorIds.length !== uniqueProfesores.size) {
      this.snackBar.open('No puede tener clases con el mismo profesor', 'Cerrar', {
        duration: 4000,
        horizontalPosition: 'right',
        verticalPosition: 'bottom',
        panelClass: ['error-snackbar']
      });
      
      // Limpiar la selección
      this.enrollmentForm.patchValue({ materiaIds: [] });
      this.selectedMaterias.set([]);
    }
  }

  loadCompaneros(materiaIds: number[]): void {
    const companerosMap: { [materiaId: number]: Estudiante[] } = {};
    
    materiaIds.forEach(materiaId => {
      this.inscripcionService.getEstudiantesByMateria(materiaId).subscribe({
        next: (response: any) => {
          if (response.success && response.data) {
            const estudiantes = Array.isArray(response.data) ? response.data : response.data.data || [];
            companerosMap[materiaId] = estudiantes;
            this.companeros.set({ ...this.companeros(), ...companerosMap });
          }
        },
        error: (error) => {
          console.error(`Error loading classmates for subject ${materiaId}:`, error);
        }
      });
    });
  }

  onSubmit(): void {
    if (this.enrollmentForm.valid) {
      this.loading.set(true);
      const formValue = this.enrollmentForm.value;
      
      const inscripciones: CreateInscripcionDto[] = formValue.materiaIds.map((materiaId: number) => ({
        estudianteId: formValue.estudianteId,
        materiaId: materiaId
      }));

      // Realizar inscripciones secuencialmente
      this.processInscripciones(inscripciones, 0);
    } else {
      this.markFormGroupTouched();
    }
  }

  private processInscripciones(inscripciones: CreateInscripcionDto[], index: number): void {
    if (index >= inscripciones.length) {
      this.loading.set(false);
      this.snackBar.open('Inscripciones realizadas exitosamente', 'Cerrar', {
        duration: 3000,
        horizontalPosition: 'right',
        verticalPosition: 'bottom',
        panelClass: ['success-snackbar']
      });
      this.router.navigate(['/students']);
      return;
    }

    const inscripcion = inscripciones[index];
    this.inscripcionService.createInscripcion(inscripcion).subscribe({
      next: (response) => {
        if (response.success) {
          this.processInscripciones(inscripciones, index + 1);
        } else {
          this.handleInscripcionError(response.message || 'Error en la inscripción');
        }
      },
      error: (error) => {
        console.error('Error creating enrollment:', error);
        this.handleInscripcionError('Error al realizar la inscripción');
      }
    });
  }

  private handleInscripcionError(message: string): void {
    this.loading.set(false);
    this.snackBar.open(message, 'Cerrar', {
      duration: 4000,
      horizontalPosition: 'right',
      verticalPosition: 'bottom',
      panelClass: ['error-snackbar']
    });
  }

  onCancel(): void {
    this.router.navigate(['/students']);
  }

  private markFormGroupTouched(): void {
    Object.keys(this.enrollmentForm.controls).forEach(key => {
      const control = this.enrollmentForm.get(key);
      control?.markAsTouched();
    });
  }

  private maxMateriasValidator(control: any): { [key: string]: any } | null {
    if (!control.value || control.value.length === 0) {
      return { required: true };
    }
    if (control.value.length > this.MAX_MATERIAS) {
      return { maxMaterias: { max: this.MAX_MATERIAS, actual: control.value.length } };
    }
    return null;
  }

  getTotalCreditos(): number {
    return this.selectedMaterias().length * this.CREDITOS_POR_MATERIA;
  }

  getErrorMessage(fieldName: string): string {
    const control = this.enrollmentForm.get(fieldName);
    if (control?.hasError('required')) {
      return `${this.getFieldDisplayName(fieldName)} es requerido`;
    }
    if (control?.hasError('maxMaterias')) {
      return `Máximo ${this.MAX_MATERIAS} materias permitidas`;
    }
    return '';
  }

  private getFieldDisplayName(fieldName: string): string {
    const displayNames: { [key: string]: string } = {
      estudianteId: 'Estudiante',
      materiaIds: 'Materias'
    };
    return displayNames[fieldName] || fieldName;
  }
}
