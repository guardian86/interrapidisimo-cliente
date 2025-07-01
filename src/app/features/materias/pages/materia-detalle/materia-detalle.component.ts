import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MateriaService } from '../../../../core/services/materia.service';
import { InscripcionService } from '../../../../core/services/inscripcion.service';
import { Materia } from '../../../../core/models/materia.model';
import { EstudianteMateriaProfesor } from '../../../../core/models/inscripcion.model';

@Component({
  selector: 'app-materia-detalle',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatDividerModule,
    MatSnackBarModule
  ],
  templateUrl: './materia-detalle.component.html',
  styleUrls: ['./materia-detalle.component.scss']
})
export class MateriaDetalleComponent implements OnInit {
  materia = signal<Materia | null>(null);
  estudiantesInscritos = signal<EstudianteMateriaProfesor[]>([]);
  loading = signal(false);
  loadingEstudiantes = signal(false);
  materiaId: number;

  constructor(
    private materiaService: MateriaService,
    private inscripcionService: InscripcionService,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.materiaId = Number(this.route.snapshot.paramMap.get('id'));
  }

  ngOnInit(): void {
    this.loadMateria();
    this.loadEstudiantesInscritos();
  }

  loadMateria(): void {
    this.loading.set(true);
    
    this.materiaService.getMateriaById(this.materiaId).subscribe({
      next: (response: any) => {
        if (response && response.success && response.data) {
          this.materia.set(response.data);
        } else {
          this.snackBar.open('No se pudo cargar la información de la materia', 'Cerrar', {
            duration: 4000,
            panelClass: ['error-snackbar']
          });
          this.router.navigate(['/materias']);
        }
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading materia:', error);
        this.snackBar.open('Error al cargar la materia', 'Cerrar', {
          duration: 4000,
          panelClass: ['error-snackbar']
        });
        this.loading.set(false);
        this.router.navigate(['/materias']);
      }
    });
  }

  loadEstudiantesInscritos(): void {
    this.loadingEstudiantes.set(true);
    
    // Temporalmente comentado - endpoint no disponible aún
    // this.inscripcionService.getEstudiantesByMateria(this.materiaId).subscribe({
    //   next: (response: any) => {
    //     if (response && response.success && response.data) {
    //       this.estudiantesInscritos.set(response.data);
    //     } else {
    //       this.estudiantesInscritos.set([]);
    //     }
    //     this.loadingEstudiantes.set(false);
    //   },
    //   error: (error) => {
    //     console.error('Error loading estudiantes inscritos:', error);
    //     this.snackBar.open('Error al cargar estudiantes inscritos', 'Cerrar', {
    //       duration: 4000,
    //       panelClass: ['error-snackbar']
    //     });
    //     this.estudiantesInscritos.set([]);
    //     this.loadingEstudiantes.set(false);
    //   }
    // });
    
    // simular datos vacíos por ahora
    this.estudiantesInscritos.set([]);
    this.loadingEstudiantes.set(false);
  }

  getProfesorNombre(): string {
    const materia = this.materia();
    // temporalmente retornando valor por defecto - el modelo no tiene profesor embebido
    return 'Profesores disponibles ver en detalle';
  }

  getProfesorEspecializacion(): string {
    const materia = this.materia();
    // temporalmente retornando valor por defecto - el modelo no tiene profesor embebido
    return 'Ver especialidades en lista de profesores';
  }

  goBack(): void {
    this.router.navigate(['/materias']);
  }
}
