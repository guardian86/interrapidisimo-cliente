import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ProfesorService } from '../../../../core/services/profesor.service';
import { Profesor, ProfesorListDto } from '../../../../core/models/profesor.model';

@Component({
  selector: 'app-profesores-lista',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatSnackBarModule
  ],
  templateUrl: './profesores-lista.component.html',
  styleUrls: ['./profesores-lista.component.scss']
})
export class ProfesoresListaComponent implements OnInit {
  profesores = signal<ProfesorListDto[]>([]);
  loading = signal(false);

  constructor(
    private profesorService: ProfesorService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadProfesores();
  }

  loadProfesores(): void {
    this.loading.set(true);
    
    this.profesorService.getProfesores().subscribe({
      next: (profesores: ProfesorListDto[]) => {
        console.log('Profesores recibidos:', profesores);
        this.profesores.set(profesores);
        console.log('Profesores cargados:', profesores.length);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading profesores:', error);
        this.loading.set(false);
        
        let errorMessage = 'Error al cargar profesores.';
        
        if (error.status === 0) {
          errorMessage = 'No se puede conectar con la API de profesores.';
        } else if (error.status === 404) {
          errorMessage = 'Endpoint de profesores no encontrado.';
        } else if (error.status >= 500) {
          errorMessage = 'Error interno del servidor.';
        }
        
        this.snackBar.open(errorMessage, 'Reintentar', {
          duration: 8000,
          horizontalPosition: 'right',
          verticalPosition: 'bottom',
          panelClass: ['error-snackbar']
        }).onAction().subscribe(() => {
          this.loadProfesores();
        });
        
        this.profesores.set([]);
      }
    });
  }

  getAvatar(nombreCompleto: string): string {
    const nombres = nombreCompleto.split(' ');
    if (nombres.length >= 2) {
      return `${nombres[0].charAt(0)}${nombres[nombres.length - 1].charAt(0)}`.toUpperCase();
    }
    return nombreCompleto.charAt(0).toUpperCase();
  }
}
