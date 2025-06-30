import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MateriaProfesor, CreateMateriaProfesorDto, UpdateMateriaProfesorDto } from '../models/materia-profesor.model';
import { ApiResponse } from '../interfaces/api-response.interface';
import { API_ENDPOINTS } from '../settings/app.config';

@Injectable({
  providedIn: 'root'
})
export class MateriaProfesorService {

  constructor(private http: HttpClient) {}

  /**
   * Obtiene todas las relaciones materia-profesor
   */
  getMateriaProfesores(): Observable<ApiResponse<MateriaProfesor[]>> {
    return this.http.get<ApiResponse<MateriaProfesor[]>>(API_ENDPOINTS.MATERIAS_PROFESORES);
  }

  /**
   * Obtiene una relación materia-profesor por ID
   */
  getMateriaProfesorById(id: number): Observable<ApiResponse<MateriaProfesor>> {
    return this.http.get<ApiResponse<MateriaProfesor>>(`${API_ENDPOINTS.MATERIAS_PROFESORES}/${id}`);
  }

  /**
   * Crea una nueva relación materia-profesor
   */
  createMateriaProfesor(materiaProfesor: CreateMateriaProfesorDto): Observable<ApiResponse<MateriaProfesor>> {
    return this.http.post<ApiResponse<MateriaProfesor>>(API_ENDPOINTS.MATERIAS_PROFESORES, materiaProfesor);
  }

  /**
   * Actualiza una relación materia-profesor existente
   */
  updateMateriaProfesor(id: number, materiaProfesor: UpdateMateriaProfesorDto): Observable<ApiResponse<MateriaProfesor>> {
    return this.http.put<ApiResponse<MateriaProfesor>>(`${API_ENDPOINTS.MATERIAS_PROFESORES}/${id}`, materiaProfesor);
  }

  /**
   * Elimina una relación materia-profesor
   */
  deleteMateriaProfesor(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${API_ENDPOINTS.MATERIAS_PROFESORES}/${id}`);
  }

  /**
   * Obtiene profesores que dictan una materia específica
   */
  getProfesoresByMateria(materiaId: number): Observable<ApiResponse<MateriaProfesor[]>> {
    return this.http.get<ApiResponse<MateriaProfesor[]>>(`${API_ENDPOINTS.MATERIAS_PROFESORES_BY_MATERIA}/${materiaId}`);
  }

  /**
   * Obtiene materias que dicta un profesor específico
   */
  getMateriasByProfesor(profesorId: number): Observable<ApiResponse<MateriaProfesor[]>> {
    return this.http.get<ApiResponse<MateriaProfesor[]>>(`${API_ENDPOINTS.MATERIAS_PROFESORES_BY_PROFESOR}/${profesorId}`);
  }
}
