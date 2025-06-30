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
import { EstudianteListDto } from '../../../../core/models/estudiante.model';
import { MateriasDisponiblesParaEstudianteDto, ProfesorDisponibleDto } from '../../../../core/models/materia.model';
import { InscripcionCreateDto } from '../../../../core/models/inscripcion.model';

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
  estudiantes = signal<EstudianteListDto[]>([]);
  materias = signal<MateriasDisponiblesParaEstudianteDto[]>([]);
  selectedMaterias = signal<MateriasDisponiblesParaEstudianteDto[]>([]);
  profesoresSeleccionados = signal<{ [materiaId: number]: ProfesorDisponibleDto | undefined }>({});
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
    this.loadMateriasDisponibles();
  }

  loadEstudiantes(): void {
    this.estudianteService.getEstudiantes().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.estudiantes.set(response.data);
        }
      },
      error: (error) => {
        console.error('Error loading students:', error);
        this.snackBar.open('Error al cargar estudiantes', 'Cerrar', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'bottom',
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  loadMateriasDisponibles(): void {
    // Para simplificar, cargamos todas las materias disponibles
    // En un escenario real, esto podría depender del estudiante seleccionado
    this.materiaService.getMateriasDisponibles().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.materias.set(response.data);
        }
      },
      error: (error) => {
        console.error('Error loading available subjects:', error);
        this.snackBar.open('Error al cargar materias disponibles', 'Cerrar', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'bottom',
          panelClass: ['error-snackbar']
        });
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

    const selectedMaterias = this.materias().filter(m => materiaIds.includes(m.materiaId));
    this.selectedMaterias.set(selectedMaterias);
    
    // Limpiar profesores seleccionados para materias que ya no están seleccionadas
    const currentProfesores = this.profesoresSeleccionados();
    const updatedProfesores: { [materiaId: number]: ProfesorDisponibleDto } = {};
    
    materiaIds.forEach(materiaId => {
      if (currentProfesores[materiaId]) {
        updatedProfesores[materiaId] = currentProfesores[materiaId];
      }
    });
    
    this.profesoresSeleccionados.set(updatedProfesores);
  }

  onProfesorSelectionChange(materiaId: number, profesorId: number): void {
    const materia = this.materias().find(m => m.materiaId === materiaId);
    const profesor = materia?.profesoresDisponibles.find(p => p.profesorId === profesorId);
    
    if (profesor) {
      // Verificar si el profesor ya está seleccionado en otra materia
      if (this.isProfesorAlreadySelected(profesorId, materiaId)) {
        this.snackBar.open('Este profesor ya está seleccionado para otra materia', 'Cerrar', {
          duration: 4000,
          horizontalPosition: 'right',
          verticalPosition: 'bottom',
          panelClass: ['error-snackbar']
        });
        return;
      }

      const updatedProfesores = { ...this.profesoresSeleccionados() };
      updatedProfesores[materiaId] = profesor;
      this.profesoresSeleccionados.set(updatedProfesores);
    }
  }

  isProfesorAlreadySelected(profesorId: number, excludeMateriaId?: number): boolean {
    const profesoresSeleccionados = this.profesoresSeleccionados();
    
    return Object.entries(profesoresSeleccionados).some(([materiaIdStr, profesor]) => {
      const materiaId = parseInt(materiaIdStr);
      return profesor && profesor.profesorId === profesorId && materiaId !== excludeMateriaId;
    });
  }

  validateProfesores(selectedMaterias: MateriasDisponiblesParaEstudianteDto[]): void {
    // Lógica de validación de profesores se maneja en el backend
    // Por ahora solo guardamos la selección
    console.log('Materias seleccionadas:', selectedMaterias);
  }

  onSubmit(): void {
    if (this.enrollmentForm.valid) {
      // Verificar que todas las materias tengan profesor asignado
      const materiasSeleccionadas = this.selectedMaterias();
      const profesoresSeleccionados = this.profesoresSeleccionados();
      
      const materiasSinProfesor = materiasSeleccionadas.filter(
        materia => !profesoresSeleccionados[materia.materiaId]
      );
      
      if (materiasSinProfesor.length > 0) {
        this.snackBar.open('Debe seleccionar un profesor para cada materia', 'Cerrar', {
          duration: 4000,
          horizontalPosition: 'right',
          verticalPosition: 'bottom',
          panelClass: ['error-snackbar']
        });
        return;
      }

      this.loading.set(true);
      const formValue = this.enrollmentForm.value;
      
      // Crear las inscripciones con materia y profesor
      const inscripciones: InscripcionCreateDto[] = materiasSeleccionadas.map(materia => ({
        estudianteId: formValue.estudianteId,
        materiaId: materia.materiaId,
        profesorId: profesoresSeleccionados[materia.materiaId]!.profesorId
      }));

      // Procesar inscripciones una por una
      this.processInscripciones(inscripciones, 0);
    } else {
      this.markFormGroupTouched();
    }
  }

  private processInscripciones(inscripciones: InscripcionCreateDto[], index: number): void {
    if (index >= inscripciones.length) {
      this.loading.set(false);
      this.snackBar.open('¡Inscripciones realizadas exitosamente!', 'Cerrar', {
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
        if (response.success && response.data?.exitoso) {
          // Continuar con la siguiente inscripción
          this.processInscripciones(inscripciones, index + 1);
        } else {
          const mensaje = response.data?.mensaje || response.message || 'Error en la inscripción';
          this.handleInscripcionError(mensaje);
        }
      },
      error: (error) => {
        console.error('Error en inscripción:', error);
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
    return this.selectedMaterias().length * 3; // 3 créditos por materia
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
