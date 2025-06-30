export interface Materia {
  id: number;
  nombre: string;
  codigo: string;
  creditos: number;
  descripcion: string;
  activo: boolean;
  profesorId?: number;
  profesor?: {
    id: number;
    nombre: string;
    apellido: string;
    especializacion: string;
  };
}

export interface CreateMateriaDto {
  nombre: string;
  codigo: string;
  creditos: number;
  descripcion: string;
}

export interface UpdateMateriaDto {
  id: number;
  nombre: string;
  codigo: string;
  creditos: number;
  descripcion: string;
}
