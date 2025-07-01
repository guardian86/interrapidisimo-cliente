// DTOs basados en el esquema exacto del WebAPI

// InscripcionCreateDto del WebAPI
export interface InscripcionCreateDto {
  estudianteId: number;
  materiaId: number;
  profesorId: number;
}

// InscripcionResponseDto del WebAPI
export interface InscripcionResponseDto {
  estudianteId: number;
  materiaId: number;
  profesorId: number;
  fechaInscripcion: string;
  exitoso: boolean;
  mensaje: string;
}

// MateriasDisponiblesParaEstudianteDto del WebAPI
export interface MateriasDisponiblesParaEstudianteDto {
  materiaId: number;
  nombreMateria: string;
  codigoMateria: string;
  creditosMateria: number;
  profesoresDisponibles: ProfesorDisponibleDto[];
}

// ProfesorDisponibleDto del WebAPI
export interface ProfesorDisponibleDto {
  profesorId: number;
  nombreCompleto: string;
  especialidad: string;
}

// DTOs para respuestas internas de la app (compatibilidad)
export interface InscripcionDto {
  id: number;
  estudianteId: number;
  materiaId: number;
  profesorId: number;
  fechaInscripcion: string;
  estado: string;
}

export interface InscripcionListDto extends InscripcionDto {
  nombreEstudiante?: string;
  nombreMateria?: string;
  nombreProfesor?: string;
}

export interface InscripcionDetailDto extends InscripcionDto {
  nombreEstudiante: string;
  nombreMateria: string;
  codigoMateria: string;
  creditos: number;
  nombreProfesor: string;
}

export interface ValidacionInscripcionDto {
  esValida: boolean;
  mensajes: string[];
  creditosActuales: number;
  creditosMaximos: number;
  profesoresIds: number[];
}

export interface MateriaDisponibleDto {
  id: number;
  nombre: string;
  codigo: string;
  creditos: number;
  descripcion: string;
  profesores: ProfesorDisponibleDto[];
}

// Alias para compatibilidad hacia atrás
export interface CreateInscripcionDto extends InscripcionCreateDto {}
export interface Inscripcion extends InscripcionDto {}
export interface EstudianteMateriaProfesor extends InscripcionDetailDto {}

export interface ResumenInscripcionEstudiante {
  estudianteId: number;
  nombreEstudiante: string;
  totalCreditos: number;
  inscripciones: InscripcionDetailDto[];
  companeros: InfoCompaneros[];
}

export interface InfoCompaneros {
  materiaId: number;
  nombreMateria: string;
  nombreProfesor: string;
  companeros: {
    estudianteId: number;
    nombreEstudiante: string;
  }[];
}


export interface ResumenInscripcionAPI {
  estudianteId: number;
  totalMaterias: number;
  totalCreditos: number;
  materias: {
    materiaId: number;
    nombreMateria: string;
    codigoMateria: string;
    creditos: number;
    profesorId: number;
    nombreProfesor: string;
    fechaInscripcion: string;
    estado: string;
    companerosDeClase: {
      id: number;
      nombreCompleto: string;
    }[];
  }[];
}

export interface ValidacionInscripcion extends ValidacionInscripcionDto {
  errores: string[];
  creditosActuales: number;
  creditosMaximos: number;
  profesoresActuales: number[];
}
