export const APP_CONFIG = {
  API_URL: 'http://localhost:5099/api',
  APP_NAME: 'Sistema de Registro de Estudiantes - InterRapidísimo',
  VERSION: '1.0.0',
  TIMEOUT: 30000,
  MAX_CREDITOS: 9, // 3 materias x 3 créditos cada una
  MAX_MATERIAS: 3,
  CREDITOS_POR_MATERIA: 3
};

export const API_ENDPOINTS = {
  ESTUDIANTES: '/estudiantes',
  PROFESORES: '/profesores',
  MATERIAS: '/materias',
  INSCRIPCIONES: '/inscripciones',
  MATERIAS_PROFESORES: '/materias-profesores'
};

export const VALIDATION_MESSAGES = {
  REQUIRED: 'Este campo es requerido',
  EMAIL_INVALID: 'El email no tiene un formato válido',
  PHONE_INVALID: 'El teléfono no tiene un formato válido',
  DATE_INVALID: 'La fecha no tiene un formato válido',
  MAX_CREDITOS_EXCEEDED: 'No puedes exceder los 9 créditos máximos',
  MAX_MATERIAS_EXCEEDED: 'Solo puedes inscribirte a máximo 3 materias',
  PROFESOR_DUPLICADO: 'No puedes tener clases con el mismo profesor'
};
