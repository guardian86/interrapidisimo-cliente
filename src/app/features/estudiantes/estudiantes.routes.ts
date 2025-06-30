import { Routes } from '@angular/router';

export const ESTUDIANTES_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/estudiantes-lista/estudiantes-lista.component')
      .then(m => m.EstudiantesListaComponent),
    title: 'Lista de Estudiantes'
  },
  {
    path: 'crear',
    loadComponent: () => import('./pages/estudiantes-crear/estudiantes-crear.component')
      .then(m => m.EstudiantesCrearComponent),
    title: 'Crear Estudiante'
  },
  {
    path: ':id/editar',
    loadComponent: () => import('./pages/estudiantes-editar/estudiantes-editar.component')
      .then(m => m.EstudiantesEditarComponent),
    title: 'Editar Estudiante'
  },
  {
    path: 'inscripciones',
    loadComponent: () => import('./pages/estudiantes-inscripcion/estudiantes-inscripcion.component')
      .then(m => m.EstudiantesInscripcionComponent),
    title: 'Inscripción de Materias'
  },
  {
    path: ':id/inscribir',
    loadComponent: () => import('./pages/estudiantes-inscripcion/estudiantes-inscripcion.component')
      .then(m => m.EstudiantesInscripcionComponent),
    title: 'Inscribir Materias'
  },
  {
    path: ':id/companeros',
    loadComponent: () => import('./pages/estudiantes-companeros/estudiantes-companeros.component')
      .then(m => m.EstudiantesCompanerosComponent),
    title: 'Compañeros de Clase'
  }
];
