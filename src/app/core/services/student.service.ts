import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Estudiante, CreateEstudianteDto, UpdateEstudianteDto } from '../models/estudiante.model';
import { ApiResponse, PaginatedResponse } from '../interfaces/api-response.interface';
import { API_ENDPOINTS } from '../settings/app.config';

@Injectable({
  providedIn: 'root'
})
export class EstudianteService {

  constructor(private http: HttpClient) {}

  /**
   * Obtiene todos los estudiantes
   */
  getEstudiantes(pageNumber: number = 1, pageSize: number = 10): Observable<ApiResponse<PaginatedResponse<Estudiante>>> {
    const params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());

    return this.http.get<ApiResponse<PaginatedResponse<Estudiante>>>(API_ENDPOINTS.ESTUDIANTES, { params });
  }

  /**
   * Obtiene un estudiante por ID
   */
  getEstudianteById(id: number): Observable<ApiResponse<Estudiante>> {
    return this.http.get<ApiResponse<Estudiante>>(`${API_ENDPOINTS.ESTUDIANTES}/${id}`);
  }

  /**
   * Crea un nuevo estudiante
   */
  createEstudiante(estudiante: CreateEstudianteDto): Observable<ApiResponse<Estudiante>> {
    return this.http.post<ApiResponse<Estudiante>>(API_ENDPOINTS.ESTUDIANTES, estudiante);
  }

  /**
   * Actualiza un estudiante existente
   */
  updateEstudiante(id: number, estudiante: UpdateEstudianteDto): Observable<ApiResponse<Estudiante>> {
    return this.http.put<ApiResponse<Estudiante>>(`${API_ENDPOINTS.ESTUDIANTES}/${id}`, estudiante);
  }

  /**
   * Elimina un estudiante
   */
  deleteEstudiante(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${API_ENDPOINTS.ESTUDIANTES}/${id}`);
  }

  /**
   * Busca estudiantes por nombre o email
   */
  searchEstudiantes(searchTerm: string): Observable<ApiResponse<Estudiante[]>> {
    const params = new HttpParams().set('search', searchTerm);
    return this.http.get<ApiResponse<Estudiante[]>>(`${API_ENDPOINTS.ESTUDIANTES}/search`, { params });
  }

  /**
   * Obtiene estudiantes activos únicamente
   */
  getEstudiantesActivos(): Observable<ApiResponse<Estudiante[]>> {
    return this.http.get<ApiResponse<Estudiante[]>>(`${API_ENDPOINTS.ESTUDIANTES}/activos`);
  }
}
