import { Routes } from '@angular/router';

export const INSCRIPCIONES_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'nueva',
    pathMatch: 'full'
  },
  {
    path: 'nueva',
    loadComponent: () => import('./pages/inscripcion-wizard/inscripcion-wizard.component')
      .then(m => m.InscripcionWizardComponent),
    title: 'Nueva Inscripción'
  },
  {
    path: 'mis-inscripciones',
    loadComponent: () => import('./pages/mis-inscripciones/mis-inscripciones.component')
      .then(m => m.MisInscripcionesComponent),
    title: 'Mis Inscripciones'
  },
  {
    path: 'estudiante/:id',
    loadComponent: () => import('./pages/inscripciones-estudiante/inscripciones-estudiante.component')
      .then(m => m.InscripcionesEstudianteComponent),
    title: 'Inscripciones del Estudiante'
  }
];
