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
import { EstudianteService } from '../../../../core/services/estudiante.service';
import { MateriaService } from '../../../../core/services/materia.service';
import { InscripcionService } from '../../../../core/services/inscripcion.service';
import { EstudianteListDto } from '../../../../core/models/estudiante.model';
import { MateriasDisponiblesParaEstudianteDto, ProfesorDisponibleDto, MateriaListDto } from '../../../../core/models/materia.model';
import { InscripcionCreateDto, InscripcionResponseDto } from '../../../../core/models/inscripcion.model';

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
    
  }

  onEstudianteSelectionChange(estudianteId: number): void {
    if (estudianteId) {
      this.loadMateriasDisponiblesParaEstudiante(estudianteId);
      // Limpiar selecciones previas
      this.selectedMaterias.set([]);
      this.profesoresSeleccionados.set({});
      this.enrollmentForm.patchValue({ materiaIds: [] });
    }
  }

  loadEstudiantes(): void {
    this.estudianteService.getEstudiantes().subscribe({
      next: (estudiantes: EstudianteListDto[]) => {
        this.estudiantes.set(estudiantes);
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



  loadMateriasDisponiblesParaEstudiante(estudianteId: number): void {
    this.loading.set(true);
    
    
    this.materiaService.getMateriasDisponiblesParaEstudiante(estudianteId).subscribe({
      next: (materiasDisponibles: MateriasDisponiblesParaEstudianteDto[]) => {
        console.log('📚 Materias recibidas del API:', materiasDisponibles);
        
        // Validar que las materias tengan datos válidos
        const materiasValidas = materiasDisponibles.filter(materia => 
          materia.materiaId && materia.materiaId > 0 && materia.nombreMateria
        );
        
        if (materiasValidas.length !== materiasDisponibles.length) {
          console.warn('Algunas materias fueron filtradas por datos inválidos');
        }
        
        // Validar que cada materia tenga al menos un profesor disponible
        const materiasConProfesores = materiasValidas.filter(materia => 
          materia.profesoresDisponibles && materia.profesoresDisponibles.length > 0
        );
        
        if (materiasConProfesores.length !== materiasValidas.length) {
          console.warn(`${materiasValidas.length - materiasConProfesores.length} materia(s) sin profesores disponibles fueron excluidas`);
        }
        
        console.log('Materias válidas con profesores:', materiasConProfesores);
        this.materias.set(materiasConProfesores);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading available subjects for student:', error);
        console.error('Error details:', {
          status: error.status,
          message: error.message,
          url: error.url
        });
        
        this.loading.set(false);
        
        let errorMessage = 'Error al cargar materias disponibles para el estudiante';
        if (error.status === 0) {
          errorMessage = 'No se puede conectar al servidor. Verifique que el API esté ejecutándose.';
        } else if (error.status === 404) {
          errorMessage = 'Estudiante no encontrado o endpoint no disponible.';
        } else if (error.error && error.error.message) {
          errorMessage = error.error.message;
        }
        
        this.snackBar.open(errorMessage, 'Cerrar', {
          duration: 5000,
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
    console.log('Materias seleccionadas:', selectedMaterias);
  }

  onSubmit(): void {
    if (this.enrollmentForm.valid) {
      // verificar que todas las materias tengan profesor asignado
      const materiasSeleccionadas = this.selectedMaterias();
      const profesoresSeleccionados = this.profesoresSeleccionados();
      
      console.log('📋 Validando datos de inscripción...');
      console.log('📚 Materias seleccionadas:', materiasSeleccionadas);
      console.log('👨‍🏫 Profesores seleccionados:', profesoresSeleccionados);
      
      const materiasSinProfesor = materiasSeleccionadas.filter(
        materia => !profesoresSeleccionados[materia.materiaId]
      );
      
      if (materiasSinProfesor.length > 0) {
        console.warn('⚠️ Hay materias sin profesor asignado:', materiasSinProfesor);
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
      
      // validar que el estudiante ID sea válido
      if (!formValue.estudianteId || formValue.estudianteId <= 0) {
        console.error('ID de estudiante inválido:', formValue.estudianteId);
        this.handleInscripcionError('ID de estudiante inválido');
        return;
      }
      
      // crear las inscripciones con materia y profesor
      const inscripciones: InscripcionCreateDto[] = materiasSeleccionadas.map(materia => {
        const profesorSeleccionado = profesoresSeleccionados[materia.materiaId];
        
        if (!profesorSeleccionado) {
          throw new Error(`No hay profesor seleccionado para la materia ${materia.nombreMateria}`);
        }
        
        return {
          estudianteId: formValue.estudianteId,
          materiaId: materia.materiaId,
          profesorId: profesorSeleccionado.profesorId
        };
      });

      console.log('📤 Inscripciones validadas, listas para enviar:', inscripciones);

      // procesar inscripciones una por una
      this.processInscripciones(inscripciones, 0);
    } else {
      console.warn('⚠️ Formulario inválido');
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
      
      // resetear el formulario después del éxito
      this.enrollmentForm.reset();
      this.selectedMaterias.set([]);
      this.profesoresSeleccionados.set({});
      this.materias.set([]);
      
      this.router.navigate(['/students']);
      return;
    }

    const inscripcion = inscripciones[index];
    console.log(`Procesando inscripción ${index + 1} de ${inscripciones.length}:`, inscripcion);
    
    this.inscripcionService.createInscripcion(inscripcion).subscribe({
      next: (response: InscripcionResponseDto) => {
        console.log('Respuesta de inscripción:', response);
        if (response.exitoso) {
          
          this.processInscripciones(inscripciones, index + 1);
        } else {
          const mensaje = response.mensaje || 'Error en la inscripción';
          this.handleInscripcionError(mensaje);
        }
      },
      error: (error) => {
        console.error('Error en inscripción:', error);
        let errorMessage = 'Error al realizar la inscripción';
        
        //  diferentes tipos de error
        if (error.error && error.error.message) {
          errorMessage = error.error.message;
        } else if (error.message) {
          errorMessage = error.message;
        } else if (error.status === 400) {
          errorMessage = 'Datos de inscripción inválidos';
        } else if (error.status === 404) {
          errorMessage = 'Estudiante, materia o profesor no encontrado';
        } else if (error.status === 409) {
          errorMessage = 'Conflicto: el estudiante ya está inscrito en esta materia o con este profesor';
        }
        
        this.handleInscripcionError(errorMessage);
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
