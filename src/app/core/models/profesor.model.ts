export interface Profesor {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  especializacion: string;
  activo: boolean;
}

export interface CreateProfesorDto {
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  especializacion: string;
}

export interface UpdateProfesorDto {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  especializacion: string;
}
