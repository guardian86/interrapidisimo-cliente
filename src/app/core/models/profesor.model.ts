// DTOs basados en el esquema exacto del WebAPI

// ProfesorDto del WebAPI
export interface ProfesorDto {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  especialidad: string;
  isActive: boolean;
  materiasQueDicta: MateriaQueDict[];
}

// ProfesorListDto del WebAPI
export interface ProfesorListDto {
  id: number;
  nombreCompleto: string;
  especialidad: string;
  numeroMaterias: number;
  isActive: boolean;
}

// ProfesorDisponibleDto del WebAPI (usado en selección de materias)
export interface ProfesorDisponibleDto {
  profesorId: number;
  nombreCompleto: string;
  especialidad: string;
}

// MateriaQueDict (materias que dicta un profesor)
export interface MateriaQueDict {
  materiaId: number;
  nombreMateria: string;
  codigoMateria: string;
  creditos: number;
}

// ProfesorCreateDto del WebAPI
export interface ProfesorCreateDto {
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  especialidad: string;
}

// ProfesorUpdateDto del WebAPI
export interface ProfesorUpdateDto {
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  especialidad: string;
}

// Alias para compatibilidad hacia atrás
export interface Profesor extends ProfesorDto {}
export interface CreateProfesorDto extends ProfesorCreateDto {}
export interface UpdateProfesorDto extends ProfesorUpdateDto {}
export interface ProfesorDetailDto extends ProfesorDto {}
export interface MateriaProfesorDto extends MateriaQueDict {}
