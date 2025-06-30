// DTOs para respuestas de la API
export interface MateriaProfesorDto {
  id: number;
  materiaId: number;
  profesorId: number;
  activo: boolean;
}

export interface MateriaProfesorListDto {
  id: number;
  materiaId: number;
  profesorId: number;
  activo: boolean;
}

export interface MateriaProfesorDetailDto {
  id: number;
  materiaId: number;
  nombreMateria: string;
  codigoMateria: string;
  creditosMateria: number;
  profesorId: number;
  nombreProfesor: string;
  especializacionProfesor: string;
  activo: boolean;
}

// DTOs para crear y actualizar
export interface CreateMateriaProfesorDto {
  materiaId: number;
  profesorId: number;
}

export interface UpdateMateriaProfesorDto {
  activo: boolean;
}

// Alias para compatibilidad hacia atrás
export interface MateriaProfesor extends MateriaProfesorDto {}

export interface CreateMateriaProfesortDto extends CreateMateriaProfesorDto {}
