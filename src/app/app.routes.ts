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
    path: 'inscripciones',
    loadChildren: () => import('./features/inscripciones/inscripciones.routes').then(m => m.INSCRIPCIONES_ROUTES),
    title: 'Inscripciones'
  }
  // Comentado temporalmente mientras se corrigen errores
  // {
  //   path: 'materias',
  //   loadChildren: () => import('./features/materias/materias.routes').then(m => m.MATERIAS_ROUTES),
  //   title: 'Materias Disponibles'
  // },
  // {
  //   path: 'profesores',
  //   loadChildren: () => import('./features/profesores/profesores.routes').then(m => m.PROFESORES_ROUTES),
  //   title: 'Profesores'
  // }
];
