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
import { EstudianteService } from '../../../../core/services/student.service';
import { MateriaService } from '../../../../core/services/materia.service';
import { InscripcionService } from '../../../../core/services/inscripcion.service';
import { Estudiante } from '../../../../core/models/estudiante.model';
import { Materia } from '../../../../core/models/materia.model';
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
  estudiantes = signal<Estudiante[]>([]);
  materias = signal<Materia[]>([]);
  materiasSeleccionadas = signal<Materia[]>([]);
  
  // State
  loading = signal(false);
  loadingMaterias = signal(false);
  inscribiendo = signal(false);
  
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
    this.loadMaterias();
  }

  loadEstudiantes(): void {
    this.loading.set(true);
    this.estudianteService.getEstudiantes().subscribe({
      next: (response: any) => {
        if (response && response.success && response.data) {
          const estudiantes = Array.isArray(response.data) ? response.data : response.data.data || [];
          this.estudiantes.set(estudiantes);
        }
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

  loadMaterias(): void {
    this.loadingMaterias.set(true);
    this.materiaService.getMaterias().subscribe({
      next: (response: any) => {
        if (response && response.success && response.data) {
          const materias = Array.isArray(response.data) ? response.data : response.data.data || [];
          this.materias.set(materias);
        }
        this.loadingMaterias.set(false);
      },
      error: (error) => {
        console.error('Error loading materias:', error);
        this.loadingMaterias.set(false);
        this.snackBar.open('Error al cargar materias', 'Cerrar', {
          duration: 4000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  onMateriaToggle(materia: Materia, checked: boolean): void {
    const materiasActuales = this.materiasSeleccionadas();
    
    if (checked) {
      // Validar límite de materias
      if (materiasActuales.length >= this.MAX_MATERIAS) {
        this.snackBar.open(`Solo puedes seleccionar máximo ${this.MAX_MATERIAS} materias`, 'Cerrar', {
          duration: 3000,
          panelClass: ['warning-snackbar']
        });
        return;
      }
      
      // Validar límite de créditos
      const nuevosCreditos = this.creditosActuales() + materia.creditos;
      if (nuevosCreditos > this.MAX_CREDITOS) {
        this.snackBar.open(`Excederías el límite de ${this.MAX_CREDITOS} créditos`, 'Cerrar', {
          duration: 3000,
          panelClass: ['warning-snackbar']
        });
        return;
      }
      
      // Validar profesor único
      if (materia.profesorId && this.profesoresSeleccionados().has(materia.profesorId)) {
        const profesorNombre = materia.profesor ? `${materia.profesor.nombre} ${materia.profesor.apellido}` : 'este profesor';
        this.snackBar.open(`No puedes tener clases con ${profesorNombre} en múltiples materias`, 'Cerrar', {
          duration: 3000,
          panelClass: ['warning-snackbar']
        });
        return;
      }
      
      // Agregar materia
      this.materiasSeleccionadas.set([...materiasActuales, materia]);
      this.creditosActuales.set(nuevosCreditos);
      if (materia.profesorId) {
        const profesores = new Set(this.profesoresSeleccionados());
        profesores.add(materia.profesorId);
        this.profesoresSeleccionados.set(profesores);
      }
    } else {
      // Remover materia
      const nuevasMaterias = materiasActuales.filter(m => m.id !== materia.id);
      this.materiasSeleccionadas.set(nuevasMaterias);
      this.creditosActuales.set(this.creditosActuales() - materia.creditos);
      
      if (materia.profesorId) {
        const profesores = new Set(this.profesoresSeleccionados());
        profesores.delete(materia.profesorId);
        this.profesoresSeleccionados.set(profesores);
      }
    }
    
    // Actualizar form
    this.materiasForm.patchValue({
      materias: this.materiasSeleccionadas().map(m => m.id)
    });
  }

  isMateriaSelected(materia: Materia): boolean {
    return this.materiasSeleccionadas().some(m => m.id === materia.id);
  }

  isMateriaDisabled(materia: Materia): boolean {
    if (this.isMateriaSelected(materia)) return false;
    
    // Disabled si alcanzó límite de materias
    if (this.materiasSeleccionadas().length >= this.MAX_MATERIAS) return true;
    
    // Disabled si excedería créditos
    if (this.creditosActuales() + materia.creditos > this.MAX_CREDITOS) return true;
    
    // Disabled si ya tiene ese profesor
    if (materia.profesorId && this.profesoresSeleccionados().has(materia.profesorId)) return true;
    
    return false;
  }

  getProgresoCreditosPercentage(): number {
    return (this.creditosActuales() / this.MAX_CREDITOS) * 100;
  }

  getProgresoMateriasPercentage(): number {
    return (this.materiasSeleccionadas().length / this.MAX_MATERIAS) * 100;
  }

  onSubmitInscripcion(): void {
    if (!this.estudianteForm.valid || !this.materiasForm.valid) {
      this.snackBar.open('Completa todos los pasos del wizard', 'Cerrar', {
        duration: 3000,
        panelClass: ['warning-snackbar']
      });
      return;
    }

    this.inscribiendo.set(true);
    
    const inscripcionData = {
      estudianteId: this.estudianteForm.value.estudianteId,
      materias: this.materiasSeleccionadas().map(materia => ({
        materiaId: materia.id,
        profesorId: materia.profesorId
      }))
    };

    this.inscripcionService.createInscripcion(inscripcionData).subscribe({
      next: (response) => {
        if (response && response.success) {
          this.snackBar.open('Inscripción realizada exitosamente', 'Cerrar', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
          this.router.navigate(['/inscripciones/mis-inscripciones']);
        } else {
          this.snackBar.open('Error en la inscripción: ' + (response?.message || 'Error desconocido'), 'Cerrar', {
            duration: 4000,
            panelClass: ['error-snackbar']
          });
        }
        this.inscribiendo.set(false);
      },
      error: (error) => {
        console.error('Error creating inscripcion:', error);
        this.snackBar.open('Error al procesar la inscripción', 'Cerrar', {
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
    this.materiasSeleccionadas.set([]);
    this.creditosActuales.set(0);
    this.profesoresSeleccionados.set(new Set());
  }
}
