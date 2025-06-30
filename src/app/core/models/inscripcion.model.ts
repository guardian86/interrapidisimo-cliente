export interface Inscripcion {
  id: number;
  estudianteId: number;
  materiaId: number;
  profesorId: number;
  fechaInscripcion: string;
  activo: boolean;
}

export interface EstudianteMateriaProfesor {
  id: number;
  estudianteId: number;
  materiaId: number;
  profesorId: number;
  fechaInscripcion: string;
  activo: boolean;
  estudiante?: {
    id: number;
    nombre: string;
    apellido: string;
    email: string;
  };
  materia?: {
    id: number;
    nombre: string;
    codigo: string;
    creditos: number;
  };
  profesor?: {
    id: number;
    nombre: string;
    apellido: string;
    especializacion: string;
  };
}

export interface CreateInscripcionDto {
  estudianteId: number;
  materiaId: number;
}

export interface ResumenInscripcionEstudiante {
  estudianteId: number;
  nombreEstudiante: string;
  totalCreditos: number;
  inscripciones: EstudianteMateriaProfesor[];
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

export interface ValidacionInscripcion {
  esValida: boolean;
  errores: string[];
  creditosActuales: number;
  creditosMaximos: number;
  profesoresActuales: number[];
}
