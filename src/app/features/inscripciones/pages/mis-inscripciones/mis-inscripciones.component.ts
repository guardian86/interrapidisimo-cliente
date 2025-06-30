import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { EstudianteService } from '../../../../core/services/estudiante.service';
import { InscripcionService } from '../../../../core/services/inscripcion.service';
import { EstudianteListDto } from '../../../../core/models/estudiante.model';
import { InscripcionDetailDto } from '../../../../core/models/inscripcion.model';

@Component({
  selector: 'app-mis-inscripciones',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatChipsModule,
    MatDividerModule
  ],
  templateUrl: './mis-inscripciones.component.html',
  styleUrls: ['./mis-inscripciones.component.scss']
})
export class MisInscripcionesComponent implements OnInit {
  // Forms
  estudianteForm: FormGroup;
  
  // Data
  estudiantes = signal<EstudianteListDto[]>([]);
  inscripciones = signal<InscripcionDetailDto[]>([]);
  
  // State
  loading = signal(false);
  loadingInscripciones = signal(false);
  estudianteSeleccionado = signal<number | null>(null);
  
  // Table configuration
  displayedColumns: string[] = ['materia', 'codigo', 'creditos', 'profesor', 'especialidad', 'acciones'];

  constructor(
    private formBuilder: FormBuilder,
    private estudianteService: EstudianteService,
    private inscripcionService: InscripcionService,
    private snackBar: MatSnackBar
  ) {
    this.estudianteForm = this.formBuilder.group({
      estudianteId: ['']
    });
  }

  ngOnInit(): void {
    this.loadEstudiantes();
    
    // Escuchar cambios en la selección de estudiante
    this.estudianteForm.get('estudianteId')?.valueChanges.subscribe(estudianteId => {
      if (estudianteId) {
        this.estudianteSeleccionado.set(estudianteId);
        this.loadInscripciones(estudianteId);
      } else {
        this.estudianteSeleccionado.set(null);
        this.inscripciones.set([]);
      }
    });
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

  loadInscripciones(estudianteId: number): void {
    this.loadingInscripciones.set(true);
    this.inscripcionService.getInscripcionesByEstudiante(estudianteId).subscribe({
      next: (response: any) => {
        if (response && response.success && response.data) {
          const inscripciones = Array.isArray(response.data) ? response.data : response.data.data || [];
          this.inscripciones.set(inscripciones);
        }
        this.loadingInscripciones.set(false);
      },
      error: (error) => {
        console.error('Error loading inscripciones:', error);
        this.loadingInscripciones.set(false);
        this.snackBar.open('Error al cargar inscripciones', 'Cerrar', {
          duration: 4000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  getTotalCreditos(): number {
    return this.inscripciones().reduce((total, inscripcion) => 
      total + (inscripcion.creditos || 0), 0);
  }

  getEstudianteNombre(estudianteId: number): string {
    const estudiante = this.estudiantes().find(e => e.id === estudianteId);
    return estudiante ? estudiante.nombreCompleto : 'Estudiante no encontrado';
  }

  onEliminarInscripcion(inscripcion: InscripcionDetailDto): void {
    if (confirm(`¿Estás seguro de que deseas eliminar la inscripción a "${inscripcion.nombreMateria}"?`)) {
      this.inscripcionService.deleteInscripcionByParams(inscripcion.estudianteId, inscripcion.materiaId, inscripcion.profesorId).subscribe({
        next: () => {
          this.snackBar.open('Inscripción eliminada exitosamente', 'Cerrar', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
          // Recargar inscripciones
          if (this.estudianteSeleccionado()) {
            this.loadInscripciones(this.estudianteSeleccionado()!);
          }
        },
        error: (error: any) => {
          console.error('Error al eliminar inscripción:', error);
          this.snackBar.open('Error al eliminar inscripción', 'Cerrar', {
            duration: 4000,
            panelClass: ['error-snackbar']
          });
        }
      });
    }
  }
}
