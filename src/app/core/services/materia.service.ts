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
import { API_ENDPOINTS } from '../settings/app.config';

@Injectable({
  providedIn: 'root'
})
export class MateriaService {

  constructor(private http: HttpClient) {}

  /**
   * Obtiene todas las materias
   */
  getMaterias(): Observable<MateriaListDto[]> {
    return this.http.get<MateriaListDto[]>(API_ENDPOINTS.MATERIAS);
  }

  /**
   * Obtiene una materia por ID
   */
  getMateriaById(id: number): Observable<MateriaDto> {
    return this.http.get<MateriaDto>(`${API_ENDPOINTS.MATERIAS}/${id}`);
  }

  /**
   * Obtiene las materias disponibles para un estudiante específico
   */
  getMateriasDisponiblesParaEstudiante(estudianteId: number): Observable<MateriasDisponiblesParaEstudianteDto[]> {
    return this.http.get<MateriasDisponiblesParaEstudianteDto[]>(`${API_ENDPOINTS.MATERIAS}/disponibles/${estudianteId}`);
  }

  /**
   * Crea una nueva materia
   */
  createMateria(materia: MateriaCreateDto): Observable<MateriaDto> {
    return this.http.post<MateriaDto>(API_ENDPOINTS.MATERIAS, materia);
  }

  /**
   * Actualiza una materia existente
   */
  updateMateria(id: number, materia: MateriaUpdateDto): Observable<MateriaDto> {
    return this.http.put<MateriaDto>(`${API_ENDPOINTS.MATERIAS}/${id}`, materia);
  }

  /**
   * Elimina una materia
   */
  deleteMateria(id: number): Observable<void> {
    return this.http.delete<void>(`${API_ENDPOINTS.MATERIAS}/${id}`);
  }

  /**
   * Verifica si una materia existe
   */
  existsMateria(id: number): Observable<boolean> {
    return this.http.get<boolean>(`${API_ENDPOINTS.MATERIAS}/${id}/exists`);
  }
}
