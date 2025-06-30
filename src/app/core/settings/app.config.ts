export const APP_CONFIG = {
  API_URL: 'http://localhost:5099/api',
  APP_NAME: 'Sistema de Registro de Estudiantes - InterRapidísimo',
  VERSION: '1.0.0',
  TIMEOUT: 30000,
  MAX_CREDITOS: 9, // 3 materias x 3 créditos cada una
  MAX_MATERIAS: 3,
  CREDITOS_POR_MATERIA: 3,
  // Configuración para producción con API real
  DEVELOPMENT_MODE: false, // API real funcionando
  USE_MOCK_DATA: false, // Usar datos de la API
  SHOW_API_ERRORS: true // Mostrar errores de API reales
};

export const API_ENDPOINTS = {
  // Endpoints de Estudiantes
  ESTUDIANTES: '/Estudiante',
  ESTUDIANTES_SEARCH: '/Estudiante/buscar',
  
  // Endpoints de Profesores  
  PROFESORES: '/Profesor',
  
  // Endpoints de Materias
  MATERIAS: '/Materia',
  
  // Endpoints de Materias-Profesores
  MATERIAS_PROFESORES: '/MateriaProfesor',
  MATERIAS_PROFESORES_BY_MATERIA: '/MateriaProfesor/materia',
  MATERIAS_PROFESORES_BY_PROFESOR: '/MateriaProfesor/profesor',
  
  // Endpoints de Inscripciones
  INSCRIPCIONES: '/Inscripcion',
  INSCRIPCIONES_BY_ESTUDIANTE: '/Inscripcion/estudiante',
  INSCRIPCIONES_BY_MATERIA: '/Inscripcion/materia',
  INSCRIPCIONES_COMPANEROS: '/Inscripcion/companeros',
  INSCRIPCIONES_VALIDAR: '/Inscripcion/validar'
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
