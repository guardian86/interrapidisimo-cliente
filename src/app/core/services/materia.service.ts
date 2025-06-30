import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { 
  MateriaDto, 
  MateriaListDto, 
  MateriaCreateDto, 
  MateriaUpdateDto,
  ProfesorDisponibleDto,
  MateriasDisponiblesParaEstudianteDto
} from '../models/materia.model';
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
  getMaterias(): Observable<ApiResponse<MateriaListDto[]>> {
    return this.http.get<ApiResponse<MateriaListDto[]>>(API_ENDPOINTS.MATERIAS);
  }

  /**
   * Obtiene una materia por ID
   */
  getMateriaById(id: number): Observable<ApiResponse<MateriaDto>> {
    return this.http.get<ApiResponse<MateriaDto>>(`${API_ENDPOINTS.MATERIAS}/${id}`);
  }

  /**
   * Obtiene las materias disponibles para inscripción
   */
  getMateriasDisponibles(): Observable<ApiResponse<MateriasDisponiblesParaEstudianteDto[]>> {
    return this.http.get<ApiResponse<MateriasDisponiblesParaEstudianteDto[]>>(`${API_ENDPOINTS.MATERIAS}/disponibles`);
  }

  /**
   * Crea una nueva materia
   */
  createMateria(materia: MateriaCreateDto): Observable<ApiResponse<MateriaDto>> {
    return this.http.post<ApiResponse<MateriaDto>>(API_ENDPOINTS.MATERIAS, materia);
  }

  /**
   * Actualiza una materia existente
   */
  updateMateria(id: number, materia: MateriaUpdateDto): Observable<ApiResponse<MateriaDto>> {
    return this.http.put<ApiResponse<MateriaDto>>(`${API_ENDPOINTS.MATERIAS}/${id}`, materia);
  }

  /**
   * Elimina una materia
   */
  deleteMateria(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${API_ENDPOINTS.MATERIAS}/${id}`);
  }

  /**
   * Obtiene profesores disponibles para una materia específica
   */
  getProfesoresDisponibles(materiaId: number): Observable<ApiResponse<ProfesorDisponibleDto[]>> {
    return this.http.get<ApiResponse<ProfesorDisponibleDto[]>>(`${API_ENDPOINTS.MATERIAS}/${materiaId}/profesores`);
  }
}
