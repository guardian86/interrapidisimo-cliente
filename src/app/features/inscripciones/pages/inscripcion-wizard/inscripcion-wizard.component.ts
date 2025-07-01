import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatStepperModule } from '@angular/material/stepper';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { EstudianteService } from '../../../../core/services/estudiante.service';
import { MateriaService } from '../../../../core/services/materia.service';
import { InscripcionService } from '../../../../core/services/inscripcion.service';
import { EstudianteDto, EstudianteListDto } from '../../../../core/models/estudiante.model';
import { MateriasDisponiblesParaEstudianteDto, ProfesorDisponibleDto, InscripcionResponseDto } from '../../../../core/models/inscripcion.model';
import { APP_CONFIG } from '../../../../core/settings/app.config';

@Component({
  selector: 'app-inscripcion-wizard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MatStepperModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatCheckboxModule,
    MatChipsModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatDividerModule,
    MatSnackBarModule,
    MatDialogModule
  ],
  templateUrl: './inscripcion-wizard.component.html',
  styleUrls: ['./inscripcion-wizard.component.scss']
})
export class InscripcionWizardComponent implements OnInit {
  // Forms
  estudianteForm: FormGroup;
  materiasForm: FormGroup;
  
  // Data
  estudiantes = signal<EstudianteListDto[]>([]);
  materiasDisponibles = signal<MateriasDisponiblesParaEstudianteDto[]>([]);
  inscripcionesSeleccionadas = signal<{materia: MateriasDisponiblesParaEstudianteDto, profesorId: number}[]>([]);
  
  // State
  loading = signal(false);
  loadingMaterias = signal(false);
  inscribiendo = signal(false);
  estudianteSeleccionado = signal<number | null>(null);
  
  // Validation tracking
  creditosActuales = signal(0);
  profesoresSeleccionados = signal<Set<number>>(new Set());
  
  // Configuration
  readonly MAX_CREDITOS = APP_CONFIG.MAX_CREDITOS;
  readonly MAX_MATERIAS = APP_CONFIG.MAX_MATERIAS;

  constructor(
    private formBuilder: FormBuilder,
    private estudianteService: EstudianteService,
    private materiaService: MateriaService,
    private inscripcionService: InscripcionService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private router: Router
  ) {
    this.estudianteForm = this.formBuilder.group({
      estudianteId: ['', [Validators.required]]
    });
    
    this.materiasForm = this.formBuilder.group({
      materias: [[], [Validators.required, Validators.minLength(1), Validators.maxLength(this.MAX_MATERIAS)]]
    });
  }

  ngOnInit(): void {
    this.loadEstudiantes();
    
    // escuchar cambios en la selección de estudiante
    this.estudianteForm.get('estudianteId')?.valueChanges.subscribe(estudianteId => {
      if (estudianteId) {
        this.estudianteSeleccionado.set(estudianteId);
        this.loadMateriasDisponibles();
        this.resetSelecciones();
      }
    });
  }

  loadEstudiantes(): void {
    this.loading.set(true);
    this.estudianteService.getEstudiantes().subscribe({
      next: (estudiantes: EstudianteListDto[]) => {
        this.estudiantes.set(estudiantes);
        console.log('Estudiantes cargados:', estudiantes.length);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading estudiantes:', error);
        this.loading.set(false);
        this.snackBar.open('Error al cargar estudiantes', 'Cerrar', {
          duration: 4000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  loadMateriasDisponibles(): void {
    const estudianteId = this.estudianteSeleccionado();
    if (!estudianteId) return;

    this.loadingMaterias.set(true);
    
    this.inscripcionService.getMateriasDisponibles(estudianteId).subscribe({
      next: (materiasDisponibles: MateriasDisponiblesParaEstudianteDto[]) => {
        this.materiasDisponibles.set(materiasDisponibles);
        console.log('Materias disponibles cargadas:', materiasDisponibles.length);
        this.loadingMaterias.set(false);
      },
      error: (error: any) => {
        console.error('Error loading materias disponibles:', error);
        this.loadingMaterias.set(false);
        this.snackBar.open('Error al cargar materias disponibles', 'Cerrar', {
          duration: 4000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  onMateriaToggle(materia: MateriasDisponiblesParaEstudianteDto, profesorId: number, checked: boolean): void {
    const inscripcionesActuales = this.inscripcionesSeleccionadas();
    
    if (checked) {
      // validar límite de materias
      if (inscripcionesActuales.length >= this.MAX_MATERIAS) {
        this.snackBar.open(`Solo puedes seleccionar máximo ${this.MAX_MATERIAS} materias`, 'Cerrar', {
          duration: 3000,
          panelClass: ['warning-snackbar']
        });
        return;
      }
      
      // validar límite de créditos
      const nuevosCreditos = this.creditosActuales() + materia.creditosMateria;
      if (nuevosCreditos > this.MAX_CREDITOS) {
        this.snackBar.open(`Excederías el límite de ${this.MAX_CREDITOS} créditos`, 'Cerrar', {
          duration: 3000,
          panelClass: ['warning-snackbar']
        });
        return;
      }
      
      // validar profesor único
      if (this.profesoresSeleccionados().has(profesorId)) {
        const profesor = materia.profesoresDisponibles.find(p => p.profesorId === profesorId);
        const profesorNombre = profesor ? profesor.nombreCompleto : 'este profesor';
        this.snackBar.open(`No puedes tener clases con ${profesorNombre} en múltiples materias`, 'Cerrar', {
          duration: 3000,
          panelClass: ['warning-snackbar']
        });
        return;
      }
      
      // agregar inscripción
      this.inscripcionesSeleccionadas.set([...inscripcionesActuales, { materia, profesorId }]);
      this.creditosActuales.set(nuevosCreditos);
      
      const profesores = new Set(this.profesoresSeleccionados());
      profesores.add(profesorId);
      this.profesoresSeleccionados.set(profesores);
    } else {
      // remover inscripción
      const nuevasInscripciones = inscripcionesActuales.filter(i => 
        !(i.materia.materiaId === materia.materiaId && i.profesorId === profesorId)
      );
      this.inscripcionesSeleccionadas.set(nuevasInscripciones);
      this.creditosActuales.set(this.creditosActuales() - materia.creditosMateria);
      
      const profesores = new Set(this.profesoresSeleccionados());
      profesores.delete(profesorId);
      this.profesoresSeleccionados.set(profesores);
    }
    
    // actualizar form
    this.materiasForm.patchValue({
      materias: this.inscripcionesSeleccionadas().map(i => ({ 
        materiaId: i.materia.materiaId, 
        profesorId: i.profesorId 
      }))
    });
  }

  isInscripcionSelected(materia: MateriasDisponiblesParaEstudianteDto, profesorId: number): boolean {
    return this.inscripcionesSeleccionadas().some(i => 
      i.materia.materiaId === materia.materiaId && i.profesorId === profesorId
    );
  }

  isInscripcionDisabled(materia: MateriasDisponiblesParaEstudianteDto, profesorId: number): boolean {
    if (this.isInscripcionSelected(materia, profesorId)) return false;
    
    // Disabled si alcanzó límite de materias
    if (this.inscripcionesSeleccionadas().length >= this.MAX_MATERIAS) return true;
    
    // Disabled si excedería créditos
    if (this.creditosActuales() + materia.creditosMateria > this.MAX_CREDITOS) return true;
    
    // Disabled si ya tiene ese profesor
    if (this.profesoresSeleccionados().has(profesorId)) return true;
    
    return false;
  }

  getProgresoCreditosPercentage(): number {
    return (this.creditosActuales() / this.MAX_CREDITOS) * 100;
  }

  getProgresoMateriasPercentage(): number {
    return (this.inscripcionesSeleccionadas().length / this.MAX_MATERIAS) * 100;
  }

  getProfesorNombre(materia: MateriasDisponiblesParaEstudianteDto, profesorId: number): string {
    const profesor = materia.profesoresDisponibles.find(p => p.profesorId === profesorId);
    return profesor ? profesor.nombreCompleto : 'Profesor no encontrado';
  }

  resetSelecciones(): void {
    this.inscripcionesSeleccionadas.set([]);
    this.creditosActuales.set(0);
    this.profesoresSeleccionados.set(new Set());
    this.materiasForm.patchValue({
      materias: []
    });
  }

  onSubmitInscripcion(): void {
    if (!this.estudianteForm.valid || !this.materiasForm.valid) {
      this.snackBar.open('Completa todos los pasos del wizard', 'Cerrar', {
        duration: 3000,
        panelClass: ['warning-snackbar']
      });
      return;
    }

    if (this.inscripcionesSeleccionadas().length === 0) {
      this.snackBar.open('Selecciona al menos una materia', 'Cerrar', {
        duration: 3000,
        panelClass: ['warning-snackbar']
      });
      return;
    }

    this.inscribiendo.set(true);
    

    const estudianteId = this.estudianteForm.value.estudianteId;
    const inscripciones = this.inscripcionesSeleccionadas();
    
    this.procesarInscripciones(estudianteId, inscripciones, 0);
  }

  private procesarInscripciones(estudianteId: number, inscripciones: any[], index: number): void {
    if (index >= inscripciones.length) {
      // todas las inscripciones completadas
      this.inscribiendo.set(false);
      this.snackBar.open('Todas las inscripciones fueron procesadas exitosamente', 'Cerrar', {
        duration: 3000,
        panelClass: ['success-snackbar']
      });
      this.router.navigate(['/estudiantes']);
      return;
    }

    const inscripcion = inscripciones[index];
    const inscripcionData = {
      estudianteId: estudianteId,
      materiaId: inscripcion.materia.materiaId,
      profesorId: inscripcion.profesorId
    };

    this.inscripcionService.createInscripcion(inscripcionData).subscribe({
      next: (response: InscripcionResponseDto) => {
        console.log('Respuesta de inscripción:', response);
        if (response && response.exitoso) {
          // procesar siguiente inscripción
          this.procesarInscripciones(estudianteId, inscripciones, index + 1);
        } else {
          this.snackBar.open(`Error en inscripción ${index + 1}: ${response?.mensaje || 'Error desconocido'}`, 'Cerrar', {
            duration: 4000,
            panelClass: ['error-snackbar']
          });
          this.inscribiendo.set(false);
        }
      },
      error: (error) => {
        console.error(`Error en inscripción ${index + 1}:`, error);
        this.snackBar.open(`Error al procesar inscripción ${index + 1}`, 'Cerrar', {
          duration: 4000,
          panelClass: ['error-snackbar']
        });
        this.inscribiendo.set(false);
      }
    });
  }

  resetWizard(): void {
    this.estudianteForm.reset();
    this.materiasForm.reset();
    this.resetSelecciones();
    this.estudianteSeleccionado.set(null);
  }
}
