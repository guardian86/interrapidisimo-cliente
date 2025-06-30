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
  }
];
