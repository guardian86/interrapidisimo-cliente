import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatDividerModule,
    MatTooltipModule
  ],
  template: `
    <mat-sidenav-container class="sidenav-container">
      <mat-sidenav #drawer class="sidenav" mode="side" opened>
        <mat-toolbar color="primary">
          <mat-icon>school</mat-icon>
          <span>InterRapidísimo</span>
        </mat-toolbar>
        
        <mat-nav-list>
          <h3 mat-subheader>Gestión de Estudiantes</h3>
          <a mat-list-item routerLink="/estudiantes" routerLinkActive="active">
            <mat-icon matListItemIcon>people</mat-icon>
            <span matListItemTitle>Lista de Estudiantes</span>
          </a>
          <a mat-list-item routerLink="/estudiantes/crear" routerLinkActive="active">
            <mat-icon matListItemIcon>person_add</mat-icon>
            <span matListItemTitle>Nuevo Estudiante</span>
          </a>
          
          <mat-divider></mat-divider>
          
          <h3 mat-subheader>Inscripciones</h3>
          <a mat-list-item routerLink="/estudiantes/inscripciones" routerLinkActive="active">
            <mat-icon matListItemIcon>assignment</mat-icon>
            <span matListItemTitle>Nueva Inscripción</span>
          </a>
          
          <mat-divider></mat-divider>
          
          <h3 mat-subheader>Configuración</h3>
          <a mat-list-item (click)="refreshData()" class="action-item">
            <mat-icon matListItemIcon>refresh</mat-icon>
            <span matListItemTitle>Actualizar Datos</span>
          </a>
        </mat-nav-list>
      </mat-sidenav>
      
      <mat-sidenav-content>
        <mat-toolbar color="primary">
          <button mat-icon-button (click)="drawer.toggle()">
            <mat-icon>menu</mat-icon>
          </button>
          <span>Sistema de Registro de Estudiantes</span>
          <span class="spacer"></span>
        </mat-toolbar>
        
        <main class="main-content">
          <router-outlet></router-outlet>
        </main>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
  styles: [`
    .sidenav-container {
      height: 100vh;
    }
    
    .sidenav {
      width: 280px;
      border-right: 1px solid #e0e0e0;
    }
    
    .main-content {
      padding: 0;
      min-height: calc(100vh - 64px);
    }
    
    .spacer {
      flex: 1 1 auto;
    }
    
    .version {
      font-size: 12px;
      opacity: 0.7;
    }
    
    .active {
      background-color: rgba(25, 118, 210, 0.1);
      color: #1976d2;
    }
    
    h3[mat-subheader] {
      color: #1976d2;
      font-weight: 600;
    }
    .action-item {
      cursor: pointer;
    }
    
    .action-item:hover {
      background-color: rgba(0, 0, 0, 0.04);
    }
  `]
})
export class LayoutComponent {
  refreshData() {
    // Recargar la página actual para actualizar todos los datos
    window.location.reload();
  }
}
