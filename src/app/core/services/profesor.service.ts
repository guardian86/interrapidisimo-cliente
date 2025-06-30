import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Profesor, CreateProfesorDto, UpdateProfesorDto } from '../models/profesor.model';
import { ApiResponse } from '../interfaces/api-response.interface';
import { API_ENDPOINTS } from '../settings/app.config';

@Injectable({
  providedIn: 'root'
})
export class ProfesorService {

  constructor(private http: HttpClient) {}

  /**
   * Obtiene todos los profesores
   */
  getProfesores(): Observable<ApiResponse<Profesor[]>> {
    return this.http.get<ApiResponse<Profesor[]>>(API_ENDPOINTS.PROFESORES);
  }

  /**
   * Obtiene un profesor por ID
   */
  getProfesorById(id: number): Observable<ApiResponse<Profesor>> {
    return this.http.get<ApiResponse<Profesor>>(`${API_ENDPOINTS.PROFESORES}/${id}`);
  }

  /**
   * Crea un nuevo profesor
   */
  createProfesor(profesor: CreateProfesorDto): Observable<ApiResponse<Profesor>> {
    return this.http.post<ApiResponse<Profesor>>(API_ENDPOINTS.PROFESORES, profesor);
  }

  /**
   * Actualiza un profesor existente
   */
  updateProfesor(id: number, profesor: UpdateProfesorDto): Observable<ApiResponse<Profesor>> {
    return this.http.put<ApiResponse<Profesor>>(`${API_ENDPOINTS.PROFESORES}/${id}`, profesor);
  }

  /**
   * Elimina un profesor
   */
  deleteProfesor(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${API_ENDPOINTS.PROFESORES}/${id}`);
  }

  /**
   * Obtiene profesores activos únicamente
   */
  getProfesoresActivos(): Observable<ApiResponse<Profesor[]>> {
    return this.http.get<ApiResponse<Profesor[]>>(`${API_ENDPOINTS.PROFESORES}/activos`);
  }

  /**
   * Obtiene las materias que dicta un profesor
   */
  getMateriasByProfesor(profesorId: number): Observable<ApiResponse<any[]>> {
    return this.http.get<ApiResponse<any[]>>(`${API_ENDPOINTS.PROFESORES}/${profesorId}/materias`);
  }
}
