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
import { API_ENDPOINTS } from '../settings/app.config';

@Injectable({
  providedIn: 'root'
})
export class ProfesorService {

  constructor(private http: HttpClient) {}

  /**
   * Obtiene todos los profesores
   */
  getProfesores(): Observable<ProfesorListDto[]> {
    return this.http.get<ProfesorListDto[]>(API_ENDPOINTS.PROFESORES);
  }

  /**
   * Obtiene un profesor por ID
   */
  getProfesorById(id: number): Observable<ProfesorDto> {
    return this.http.get<ProfesorDto>(`${API_ENDPOINTS.PROFESORES}/${id}`);
  }

  /**
   * Crea un nuevo profesor
   */
  createProfesor(profesor: ProfesorCreateDto): Observable<ProfesorDto> {
    return this.http.post<ProfesorDto>(API_ENDPOINTS.PROFESORES, profesor);
  }

  /**
   * Actualiza un profesor existente
   */
  updateProfesor(id: number, profesor: ProfesorUpdateDto): Observable<ProfesorDto> {
    return this.http.put<ProfesorDto>(`${API_ENDPOINTS.PROFESORES}/${id}`, profesor);
  }

  /**
   * Elimina un profesor
   */
  deleteProfesor(id: number): Observable<void> {
    return this.http.delete<void>(`${API_ENDPOINTS.PROFESORES}/${id}`);
  }

  /**
   * Verifica si un profesor existe
   */
  existsProfesor(id: number): Observable<boolean> {
    return this.http.get<boolean>(`${API_ENDPOINTS.PROFESORES}/${id}/exists`);
  }
}
