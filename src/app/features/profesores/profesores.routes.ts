import { Routes } from '@angular/router';

export const PROFESORES_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/profesores-lista/profesores-lista.component')
      .then(m => m.ProfesoresListaComponent),
    title: 'Profesores'
  }
  // Comentado temporalmente - componente no creado aún
  // {
  //   path: ':id',
  //   loadComponent: () => import('./pages/profesor-detalle/profesor-detalle.component')
  //     .then(m => m.ProfesorDetalleComponent),
  //   title: 'Detalle del Profesor'
  // }
];
