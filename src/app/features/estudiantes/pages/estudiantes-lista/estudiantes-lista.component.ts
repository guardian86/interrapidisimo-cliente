import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { EstudianteService } from '../../../../core/services/estudiante.service';
import { EstudianteListDto } from '../../../../core/models/estudiante.model';

@Component({
  selector: 'app-estudiantes-lista',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatTableModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatMenuModule,
    MatDividerModule,
    MatChipsModule,
    MatTooltipModule
  ],
  templateUrl: './estudiantes-lista.component.html',
  styleUrls: ['./estudiantes-lista.component.scss']
})
export class EstudiantesListaComponent implements OnInit {
  estudiantes = signal<EstudianteListDto[]>([]);
  loading = signal(false);
  displayedColumns: string[] = ['nombre', 'email', 'creditos', 'estado', 'acciones'];

  constructor(
    private estudianteService: EstudianteService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    console.log('🚀 EstudiantesListaComponent: Iniciando componente...');
    this.loadEstudiantes();
  }

  loadEstudiantes(): void {
    console.log('📋 EstudiantesListaComponent: Iniciando carga de estudiantes...');
    this.loading.set(true);
    
    this.estudianteService.getEstudiantes().subscribe({
      next: (estudiantes: EstudianteListDto[]) => {
        console.log('Estudiantes recibidos:', estudiantes);
        this.estudiantes.set(estudiantes);
        console.log('Estudiantes cargados:', estudiantes.length);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading students:', error);
        this.loading.set(false);
        
        let errorMessage = 'Error al cargar estudiantes. Verifique que la API esté ejecutándose.';
        
        if (error.status === 0) {
          errorMessage = 'No se puede conectar con la API. Verifique que el servidor esté ejecutándose en https://localhost:7130';
        } else if (error.status === 404) {
          errorMessage = 'Endpoint no encontrado. Verifique la configuración de la API.';
        } else if (error.status >= 500) {
          errorMessage = 'Error interno del servidor. Contacte al administrador.';
        }
        
        this.snackBar.open(errorMessage, 'Reintentar', {
          duration: 8000,
          horizontalPosition: 'right',
          verticalPosition: 'bottom',
          panelClass: ['error-snackbar']
        }).onAction().subscribe(() => {
          this.loadEstudiantes();
        });
        
        this.estudiantes.set([]);
      }
    });
  }

  deleteEstudiante(id: number): void {
    if (confirm('¿Está seguro de que desea eliminar este estudiante?')) {
      this.estudianteService.deleteEstudiante(id).subscribe({
        next: () => {
          this.snackBar.open('Estudiante eliminado correctamente', 'Cerrar', {
            duration: 3000,
            horizontalPosition: 'right',
            verticalPosition: 'bottom',
            panelClass: ['success-snackbar']
          });
          this.loadEstudiantes(); // Recargar la lista
        },
        error: (error) => {
          console.error('Error deleting student:', error);
          this.snackBar.open('Error al eliminar estudiante', 'Cerrar', {
            duration: 3000,
            horizontalPosition: 'right',
            verticalPosition: 'bottom',
            panelClass: ['error-snackbar']
          });
        }
      });
    }
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-CO');
  }
}
