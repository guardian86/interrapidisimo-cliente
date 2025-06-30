import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { 
  ProfesorDto, 
  ProfesorListDto, 
  ProfesorCreateDto, 
  ProfesorUpdateDto,
  ProfesorDisponibleDto,
  MateriaQueDict
} from '../models/profesor.model';
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
  getProfesores(): Observable<ApiResponse<ProfesorListDto[]>> {
    return this.http.get<ApiResponse<ProfesorListDto[]>>(API_ENDPOINTS.PROFESORES);
  }

  /**
   * Obtiene un profesor por ID
   */
  getProfesorById(id: number): Observable<ApiResponse<ProfesorDto>> {
    return this.http.get<ApiResponse<ProfesorDto>>(`${API_ENDPOINTS.PROFESORES}/${id}`);
  }

  /**
   * Obtiene profesores disponibles para una materia
   */
  getProfesoresDisponibles(materiaId: number): Observable<ApiResponse<ProfesorDisponibleDto[]>> {
    return this.http.get<ApiResponse<ProfesorDisponibleDto[]>>(`${API_ENDPOINTS.PROFESORES}/disponibles/${materiaId}`);
  }

  /**
   * Crea un nuevo profesor
   */
  createProfesor(profesor: ProfesorCreateDto): Observable<ApiResponse<ProfesorDto>> {
    return this.http.post<ApiResponse<ProfesorDto>>(API_ENDPOINTS.PROFESORES, profesor);
  }

  /**
   * Actualiza un profesor existente
   */
  updateProfesor(id: number, profesor: ProfesorUpdateDto): Observable<ApiResponse<ProfesorDto>> {
    return this.http.put<ApiResponse<ProfesorDto>>(`${API_ENDPOINTS.PROFESORES}/${id}`, profesor);
  }

  /**
   * Elimina un profesor
   */
  deleteProfesor(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${API_ENDPOINTS.PROFESORES}/${id}`);
  }

  /**
   * Obtiene las materias que dicta un profesor
   */
  getMateriasByProfesor(profesorId: number): Observable<ApiResponse<MateriaQueDict[]>> {
    return this.http.get<ApiResponse<MateriaQueDict[]>>(`${API_ENDPOINTS.MATERIAS_PROFESORES_BY_PROFESOR}/${profesorId}`);
  }
}
