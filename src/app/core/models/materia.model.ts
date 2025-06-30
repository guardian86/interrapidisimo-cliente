// DTOs basados en el esquema exacto del WebAPI

// MateriaDto del WebAPI
export interface MateriaDto {
  id: number;
  nombre: string;
  codigo: string;
  descripcion: string;
  creditos: number;
  isActive: boolean;
  profesoresDisponibles: ProfesorDisponibleDto[];
}

// MateriaListDto del WebAPI
export interface MateriaListDto {
  id: number;
  nombre: string;
  codigo: string;
  creditos: number;
  isActive: boolean;
}

// MateriasDisponiblesParaEstudianteDto del WebAPI
export interface MateriasDisponiblesParaEstudianteDto {
  materiaId: number;
  nombreMateria: string;
  codigoMateria: string;
  creditosMateria: number;
  profesoresDisponibles: ProfesorDisponibleDto[];
}

// ProfesorDisponibleDto del WebAPI (compartido entre materias y profesores)
export interface ProfesorDisponibleDto {
  profesorId: number;
  nombreCompleto: string;
  especialidad: string;
}

// MateriaCreateDto del WebAPI
export interface MateriaCreateDto {
  nombre: string;
  codigo: string;
  descripcion: string;
  creditos: number;
}

// MateriaUpdateDto del WebAPI
export interface MateriaUpdateDto {
  nombre: string;
  codigo: string;
  descripcion: string;
  creditos: number;
}

// Alias para compatibilidad hacia atrás
export interface Materia extends MateriaDto {}
export interface CreateMateriaDto extends MateriaCreateDto {}
export interface UpdateMateriaDto extends MateriaUpdateDto {}
export interface MateriaDetailDto extends MateriaDto {}
export interface ProfesorMateriaDto extends ProfesorDisponibleDto {}
export interface EstudianteMateriaDto {
  id: number;
  estudianteId: number;
  nombreEstudiante: string;
  fechaInscripcion: string;
  activo: boolean;
}
