import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/estudiantes',
    pathMatch: 'full'
  },
  {
    path: 'estudiantes',
    loadChildren: () => import('./features/students/students.routes').then(m => m.STUDENTS_ROUTES),
    title: 'Sistema de Registro de Estudiantes'
  },
  {
    path: 'materias',
    loadChildren: () => import('./features/materias/materias.routes').then(m => m.MATERIAS_ROUTES),
    title: 'Materias Disponibles'
  },
  {
    path: 'profesores',
    loadChildren: () => import('./features/profesores/profesores.routes').then(m => m.PROFESORES_ROUTES),
    title: 'Profesores'
  }
];
