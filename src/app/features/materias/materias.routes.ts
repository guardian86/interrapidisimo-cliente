import { Routes } from '@angular/router';

export const MATERIAS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/materias-lista/materias-lista.component')
      .then(m => m.MateriasListaComponent),
    title: 'Materias Disponibles'
  }
  // Comentado temporalmente mientras se actualiza el componente
  // {
  //   path: ':id',
  //   loadComponent: () => import('./pages/materia-detalle/materia-detalle.component')
  //     .then(m => m.MateriaDetalleComponent),
  //   title: 'Detalle de Materia'
  // }
];
