import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatListModule } from '@angular/material/list';
import { MatChipsModule } from '@angular/material/chips';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTabsModule } from '@angular/material/tabs';
import { InscripcionService } from '../../../../core/services/inscripcion.service';
import { EstudianteService } from '../../../../core/services/student.service';
import { EstudianteDto, EstudianteListDto } from '../../../../core/models/estudiante.model';
import { ResumenInscripcionEstudiante } from '../../../../core/models/inscripcion.model';

@Component({
  selector: 'app-estudiantes-companeros',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatListModule,
    MatChipsModule,
    MatExpansionModule,
    MatTabsModule
  ],
  templateUrl: './estudiantes-companeros.component.html',
  styleUrls: ['./estudiantes-companeros.component.scss']
})
export class EstudiantesCompanerosComponent implements OnInit {
  estudiante = signal<EstudianteDto | null>(null);
  resumenInscripcion = signal<ResumenInscripcionEstudiante | null>(null);
  todosLosEstudiantes = signal<EstudianteListDto[]>([]);
  loading = signal(false);
  estudianteId: number = 0;

  constructor(
    private route: ActivatedRoute,
    private inscripcionService: InscripcionService,
    private estudianteService: EstudianteService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.estudianteId = +params['id'];
      if (this.estudianteId) {
        this.loadEstudianteData();
        this.loadResumenInscripcion();
        this.loadTodosLosEstudiantes();
      }
    });
  }

  loadResumenInscripcion(): void {
    this.loading.set(true);
    
    this.inscripcionService.getResumenInscripcionEstudiante(this.estudianteId).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.resumenInscripcion.set(response.data);
        }
        this.loading.set(false);
      },
      error: (error: any) => {
        console.error('Error loading enrollment summary:', error);
        this.snackBar.open('Error al cargar resumen de inscripciones', 'Cerrar', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'bottom',
          panelClass: ['error-snackbar']
        });
        this.loading.set(false);
      }
    });
  }

  loadEstudianteData(): void {
    this.estudianteService.getEstudianteById(this.estudianteId).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.estudiante.set(response.data);
        }
      },
      error: (error: any) => {
        console.error('Error loading student:', error);
        this.snackBar.open('Error al cargar información del estudiante', 'Cerrar', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'bottom',
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  loadTodosLosEstudiantes(): void {
    this.loading.set(true);
    
    this.estudianteService.getEstudiantes().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          // Filtrar para no incluir al estudiante actual
          const otrosEstudiantes = response.data.filter(est => est.id !== this.estudianteId);
          this.todosLosEstudiantes.set(otrosEstudiantes);
        }
        this.loading.set(false);
      },
      error: (error: any) => {
        console.error('Error loading all students:', error);
        this.snackBar.open('Error al cargar lista de estudiantes', 'Cerrar', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'bottom',
          panelClass: ['error-snackbar']
        });
        this.loading.set(false);
      }
    });
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-CO');
  }

  getTotalMaterias(): number {
    return this.resumenInscripcion()?.inscripciones?.length || 0;
  }

  getTotalCreditos(): number {
    return this.resumenInscripcion()?.totalCreditos || 0;
  }

  getTotalCompaneros(): number {
    const resumen = this.resumenInscripcion();
    if (!resumen?.companeros) return 0;
    
    return resumen.companeros.reduce((total, materiaInfo) => 
      total + materiaInfo.companeros.length, 0
    );
  }

  getUniqueCompaneros(): any[] {
    const resumen = this.resumenInscripcion();
    if (!resumen?.companeros) return [];
    
    const companerosMap = new Map<number, any>();
    
    resumen.companeros.forEach(materiaInfo => {
      materiaInfo.companeros.forEach(companero => {
        if (!companerosMap.has(companero.estudianteId)) {
          companerosMap.set(companero.estudianteId, {
            estudianteId: companero.estudianteId,
            nombreEstudiante: companero.nombreEstudiante,
            materias: [materiaInfo.nombreMateria]
          });
        } else {
          companerosMap.get(companero.estudianteId)?.materias.push(materiaInfo.nombreMateria);
        }
      });
    });
    
    return Array.from(companerosMap.values());
  }

  getSharedSubjects(companeroId: number): string[] {
    const resumen = this.resumenInscripcion();
    if (!resumen?.companeros) return [];
    
    const sharedSubjects: string[] = [];
    
    resumen.companeros.forEach(materiaInfo => {
      const isInThisSubject = materiaInfo.companeros.some(
        companero => companero.estudianteId === companeroId
      );
      if (isInThisSubject) {
        sharedSubjects.push(materiaInfo.nombreMateria);
      }
    });
    
    return sharedSubjects;
  }
}
