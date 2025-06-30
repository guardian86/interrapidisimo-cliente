export interface MateriaProfesor {
  id: number;
  materiaId: number;
  profesorId: number;
  activo: boolean;
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

export interface CreateMateriaProfesortDto {
  materiaId: number;
  profesorId: number;
}

export interface UpdateMateriaProfesorDto {
  id: number;
  materiaId: number;
  profesorId: number;
}
