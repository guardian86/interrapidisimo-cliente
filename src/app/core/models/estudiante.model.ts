// DTOs basados en el esquema exacto del WebAPI

// EstudianteDto del WebAPI
export interface EstudianteDto {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  fechaNacimiento: string;
  documento: string;
  creditosSeleccionados: number;
  isActive: boolean;
  materiasInscritas: MateriaInscritaDto[];
}

// EstudianteListDto del WebAPI
export interface EstudianteListDto {
  id: number;
  nombreCompleto: string;
  email: string;
  creditosSeleccionados: number;
  isActive: boolean;
}

// EstudianteCompaneroDto del WebAPI
export interface EstudianteCompaneroDto {
  id: number;
  nombreCompleto: string;
}

// MateriaInscritaDto del WebAPI
export interface MateriaInscritaDto {
  materiaId: number;
  nombreMateria: string;
  codigoMateria: string;
  creditos: number;
  profesorId: number;
  nombreProfesor: string;
  fechaInscripcion: string;
  estado: string;
  companerosDeClase: EstudianteCompaneroDto[];
}

// EstudianteCreateDto del WebAPI
export interface EstudianteCreateDto {
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  fechaNacimiento: string;
  documento: string;
}

// EstudianteUpdateDto del WebAPI
export interface EstudianteUpdateDto {
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  fechaNacimiento: string;
  documento: string;
}

// Alias para compatibilidad hacia atrás
export interface Estudiante extends EstudianteDto {}
export interface CreateEstudianteDto extends EstudianteCreateDto {}
export interface UpdateEstudianteDto extends EstudianteUpdateDto {}
export interface EstudianteDetailDto extends EstudianteDto {}
export interface CompaneroDto extends EstudianteCompaneroDto {}
