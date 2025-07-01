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
import { EstudianteService } from '../../../../core/services/estudiante.service';
import { EstudianteDto, EstudianteListDto } from '../../../../core/models/estudiante.model';
import { ResumenInscripcionAPI } from '../../../../core/models/inscripcion.model';
import { forkJoin, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

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
  resumenInscripcion = signal<ResumenInscripcionAPI | null>(null);
  materiasConCompaneros = signal<any[]>([]);
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
        this.loadResumenInscripcionConCompaneros();
        this.loadTodosLosEstudiantes();
      }
    });
  }

  loadResumenInscripcionConCompaneros(): void {
    this.loading.set(true);
    
    this.inscripcionService.getResumenInscripcionAPI(this.estudianteId).subscribe({
      next: (resumen: ResumenInscripcionAPI) => {
        this.resumenInscripcion.set(resumen);
        
        // Cargar compañeros para cada materia usando el endpoint individual
        if (resumen.materias && resumen.materias.length > 0) {
          this.loadCompanerosParaTodasLasMaterias(resumen.materias);
        } else {
          this.loading.set(false);
        }
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

  loadCompanerosParaTodasLasMaterias(materias: any[]): void {
    const companerRequests = materias.map(materia => 
      this.inscripcionService.getCompanerosByMateria(this.estudianteId, materia.materiaId).pipe(
        map(companeros => ({
          ...materia,
          companeros: companeros.filter(c => c.id !== this.estudianteId) // Excluir al estudiante actual
        })),
        catchError(error => {
          console.error(`Error loading companions for materia ${materia.materiaId}:`, error);
          return of({
            ...materia,
            companeros: []
          });
        })
      )
    );

    forkJoin(companerRequests).subscribe({
      next: (materiasConCompaneros) => {
        this.materiasConCompaneros.set(materiasConCompaneros);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading companions:', error);
        this.loading.set(false);
      }
    });
  }

  loadEstudianteData(): void {
    this.estudianteService.getEstudianteById(this.estudianteId).subscribe({
      next: (estudiante: EstudianteDto) => {
        this.estudiante.set(estudiante);
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
      next: (estudiantes: EstudianteListDto[]) => {
        // Filtrar para no incluir al estudiante actual
        const otrosEstudiantes = estudiantes.filter((est: EstudianteListDto) => est.id !== this.estudianteId);
        this.todosLosEstudiantes.set(otrosEstudiantes);
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
    return this.resumenInscripcion()?.totalMaterias || 0;
  }

  getTotalCreditos(): number {
    return this.resumenInscripcion()?.totalCreditos || 0;
  }

  getTotalCompaneros(): number {
    const materias = this.materiasConCompaneros();
    if (!materias) return 0;
    
    return materias.reduce((total: number, materia: any) => 
      total + (materia.companeros?.length || 0), 0
    );
  }

  getUniqueCompaneros(): any[] {
    const materias = this.materiasConCompaneros();
    if (!materias || materias.length === 0) return [];
    
    const companerosMap = new Map<number, any>();
    
    materias.forEach((materia: any) => {
      if (materia.companeros && materia.companeros.length > 0) {
        materia.companeros.forEach((companero: any) => {
          if (!companerosMap.has(companero.id)) {
            companerosMap.set(companero.id, {
              estudianteId: companero.id,
              nombreEstudiante: companero.nombreCompleto || `Estudiante ${companero.id}`,
              materias: [materia.nombreMateria]
            });
          } else {
            const existing = companerosMap.get(companero.id);
            if (existing && !existing.materias.includes(materia.nombreMateria)) {
              existing.materias.push(materia.nombreMateria);
            }
          }
        });
      }
    });
    
    return Array.from(companerosMap.values());
  }

  getSharedSubjects(companeroId: number): string[] {
    const materias = this.materiasConCompaneros();
    if (!materias || materias.length === 0) return [];
    
    const sharedSubjects: string[] = [];
    
    materias.forEach((materia: any) => {
      if (materia.companeros && materia.companeros.length > 0) {
        const isInThisSubject = materia.companeros.some(
          (companero: any) => companero.id === companeroId
        );
        if (isInThisSubject) {
          sharedSubjects.push(materia.nombreMateria);
        }
      }
    });
    
    return sharedSubjects;
  }

  getMateriaCompaneros(materiaId: number): any[] {
    const materias = this.materiasConCompaneros();
    if (!materias) return [];
    
    const materia = materias.find((m: any) => m.materiaId === materiaId);
    return materia?.companeros || [];
  }
}
