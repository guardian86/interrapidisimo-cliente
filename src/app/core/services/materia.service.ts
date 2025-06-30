import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Materia, CreateMateriaDto, UpdateMateriaDto } from '../models/materia.model';
import { ApiResponse } from '../interfaces/api-response.interface';
import { API_ENDPOINTS } from '../settings/app.config';

@Injectable({
  providedIn: 'root'
})
export class MateriaService {

  constructor(private http: HttpClient) {}

  /**
   * Obtiene todas las materias
   */
  getMaterias(): Observable<ApiResponse<Materia[]>> {
    return this.http.get<ApiResponse<Materia[]>>(API_ENDPOINTS.MATERIAS);
  }

  /**
   * Obtiene una materia por ID
   */
  getMateriaById(id: number): Observable<ApiResponse<Materia>> {
    return this.http.get<ApiResponse<Materia>>(`${API_ENDPOINTS.MATERIAS}/${id}`);
  }

  /**
   * Crea una nueva materia
   */
  createMateria(materia: CreateMateriaDto): Observable<ApiResponse<Materia>> {
    return this.http.post<ApiResponse<Materia>>(API_ENDPOINTS.MATERIAS, materia);
  }

  /**
   * Actualiza una materia existente
   */
  updateMateria(id: number, materia: UpdateMateriaDto): Observable<ApiResponse<Materia>> {
    return this.http.put<ApiResponse<Materia>>(`${API_ENDPOINTS.MATERIAS}/${id}`, materia);
  }

  /**
   * Elimina una materia
   */
  deleteMateria(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${API_ENDPOINTS.MATERIAS}/${id}`);
  }

  /**
   * Obtiene materias activas únicamente
   */
  getMateriasActivas(): Observable<ApiResponse<Materia[]>> {
    return this.http.get<ApiResponse<Materia[]>>(`${API_ENDPOINTS.MATERIAS}/activas`);
  }

  /**
   * Obtiene las materias disponibles para un estudiante
   */
  getMateriasDisponibles(estudianteId: number): Observable<ApiResponse<any[]>> {
    return this.http.get<ApiResponse<any[]>>(`${API_ENDPOINTS.MATERIAS}/disponibles/${estudianteId}`);
  }
}
