import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MateriaService } from '../../../../core/services/materia.service';
import { Materia } from '../../../../core/models/materia.model';

@Component({
  selector: 'app-materias-lista',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatGridListModule,
    MatChipsModule,
    MatSnackBarModule
  ],
  templateUrl: './materias-lista.component.html',
  styleUrls: ['./materias-lista.component.scss']
})
export class MateriasListaComponent implements OnInit {
  materias = signal<Materia[]>([]);
  loading = signal(false);

  constructor(
    private materiaService: MateriaService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadMaterias();
  }

  loadMaterias(): void {
    this.loading.set(true);
    
    this.materiaService.getMaterias().subscribe({
      next: (response: any) => {
        if (response && response.success && response.data) {
          const materias = Array.isArray(response.data) ? response.data : response.data.data || [];
          this.materias.set(materias);
          console.log('Materias cargadas:', materias.length);
        } else if (response && Array.isArray(response)) {
          this.materias.set(response);
        } else {
          console.warn('Respuesta sin datos válidos:', response);
          this.materias.set([]);
        }
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading materias:', error);
        this.loading.set(false);
        
        let errorMessage = 'Error al cargar materias.';
        
        if (error.status === 0) {
          errorMessage = 'No se puede conectar con la API de materias.';
        } else if (error.status === 404) {
          errorMessage = 'Endpoint de materias no encontrado.';
        } else if (error.status >= 500) {
          errorMessage = 'Error interno del servidor.';
        }
        
        this.snackBar.open(errorMessage, 'Reintentar', {
          duration: 8000,
          horizontalPosition: 'right',
          verticalPosition: 'bottom',
          panelClass: ['error-snackbar']
        }).onAction().subscribe(() => {
          this.loadMaterias();
        });
        
        this.materias.set([]);
      }
    });
  }

  getProfesorNombre(materia: Materia): string {
    // Temporalmente retornando valor por defecto - el modelo no tiene profesor embebido
    return 'Ver profesores disponibles';
  }

  getTotalCreditos(): number {
    return this.materias().reduce((total, m) => total + m.creditos, 0);
  }
}
