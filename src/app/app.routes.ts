import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/estudiantes',
    pathMatch: 'full'
  },
  {
    path: 'test-api',
    loadComponent: () => import('./shared/components/api-test.component').then(m => m.ApiTestComponent),
    title: 'Prueba API'
  },
  {
    path: 'estudiantes',
    loadChildren: () => import('./features/estudiantes/estudiantes.routes').then(m => m.ESTUDIANTES_ROUTES),
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
