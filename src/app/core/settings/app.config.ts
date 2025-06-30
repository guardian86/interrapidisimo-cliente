export const APP_CONFIG = {
  API_URL: 'https://localhost:7130/api', // URL directa al WebAPI con HTTPS
  APP_NAME: 'Sistema de Registro de Estudiantes - InterRapidísimo',
  VERSION: '1.0.0',
  TIMEOUT: 30000,
  MAX_CREDITOS: 9, // 3 materias x 3 créditos cada una
  MAX_MATERIAS: 3,
  CREDITOS_POR_MATERIA: 3,
  // Configuración para desarrollo con WebAPI real
  DEVELOPMENT_MODE: true, // Habilitar modo desarrollo
  USE_MOCK_DATA: false, // Usar endpoints reales del WebAPI
  SHOW_API_ERRORS: true // Mostrar errores de API reales
};

export const API_ENDPOINTS = {
  // Endpoints de Estudiantes (según Swagger)
  ESTUDIANTES: '/Estudiantes',
  ESTUDIANTES_SEARCH: '/Estudiantes/buscar',
  ESTUDIANTES_COMPANEROS: '/Estudiantes', // Base para companeros: /{estudianteId}/companeros/materia/{materiaId}
  
  // Endpoints de Profesores (según Swagger)
  PROFESORES: '/Profesores',
  
  // Endpoints de Materias (según Swagger)
  MATERIAS: '/Materias',
  
  // Endpoints de Materias-Profesores
  MATERIAS_PROFESORES: '/MateriaProfesor',
  MATERIAS_PROFESORES_BY_MATERIA: '/MateriaProfesor/materia',
  MATERIAS_PROFESORES_BY_PROFESOR: '/MateriaProfesor/profesor',
  
  // Endpoints de Inscripciones (según Swagger)
  INSCRIPCIONES: '/Inscripciones',
  INSCRIPCIONES_BY_ESTUDIANTE: '/Inscripciones/estudiante',
  INSCRIPCIONES_BY_MATERIA: '/Inscripciones/materia',
  INSCRIPCIONES_COMPANEROS: '/Estudiantes', // Para compañeros se usa el endpoint de estudiantes
  INSCRIPCIONES_VALIDAR: '/Inscripciones/validar',
  INSCRIPCIONES_RESUMEN: '/Inscripciones/resumen'
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
