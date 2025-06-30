import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { 
  InscripcionCreateDto,
  InscripcionResponseDto,
  MateriasDisponiblesParaEstudianteDto,
  ProfesorDisponibleDto,
  ResumenInscripcionEstudiante
} from '../models/inscripcion.model';
import { ApiResponse } from '../interfaces/api-response.interface';
import { API_ENDPOINTS } from '../settings/app.config';

@Injectable({
  providedIn: 'root'
})
export class InscripcionService {

  constructor(private http: HttpClient) {}

  /**
   * Crea una nueva inscripción
   */
  createInscripcion(inscripcion: InscripcionCreateDto): Observable<ApiResponse<InscripcionResponseDto>> {
    return this.http.post<ApiResponse<InscripcionResponseDto>>(API_ENDPOINTS.INSCRIPCIONES, inscripcion);
  }

  /**
   * Obtiene las materias disponibles para inscripción de un estudiante
   */
  getMateriasDisponibles(estudianteId: number): Observable<ApiResponse<MateriasDisponiblesParaEstudianteDto[]>> {
    return this.http.get<ApiResponse<MateriasDisponiblesParaEstudianteDto[]>>(`${API_ENDPOINTS.MATERIAS}/disponibles/${estudianteId}`);
  }

  /**
   * Obtiene profesores disponibles para una materia específica
   */
  getProfesoresDisponibles(materiaId: number): Observable<ApiResponse<ProfesorDisponibleDto[]>> {
    return this.http.get<ApiResponse<ProfesorDisponibleDto[]>>(`${API_ENDPOINTS.PROFESORES}/disponibles/${materiaId}`);
  }

  /**
   * Elimina una inscripción
   */
  deleteInscripcion(estudianteId: number, materiaId: number, profesorId: number): Observable<ApiResponse<void>> {
    const params = new HttpParams()
      .set('estudianteId', estudianteId.toString())
      .set('materiaId', materiaId.toString())
      .set('profesorId', profesorId.toString());
    
    return this.http.delete<ApiResponse<void>>(API_ENDPOINTS.INSCRIPCIONES, { params });
  }

  /**
   * Valida si un estudiante puede inscribirse en una materia con un profesor específico
   */
  validarInscripcion(estudianteId: number, materiaId: number, profesorId: number): Observable<ApiResponse<any>> {
    const params = new HttpParams()
      .set('estudianteId', estudianteId.toString())
      .set('materiaId', materiaId.toString())
      .set('profesorId', profesorId.toString());
    
    return this.http.get<ApiResponse<any>>(API_ENDPOINTS.INSCRIPCIONES_VALIDAR, { params });
  }

  /**
   * Obtiene el resumen de inscripciones y compañeros de un estudiante
   */
  getResumenInscripcionEstudiante(estudianteId: number): Observable<ApiResponse<ResumenInscripcionEstudiante>> {
    return this.http.get<ApiResponse<ResumenInscripcionEstudiante>>(`${API_ENDPOINTS.INSCRIPCIONES_COMPANEROS}/${estudianteId}`);
  }

  /**
   * Obtiene las inscripciones de un estudiante específico
   */
  getInscripcionesByEstudiante(estudianteId: number): Observable<ApiResponse<any[]>> {
    return this.http.get<ApiResponse<any[]>>(`${API_ENDPOINTS.INSCRIPCIONES_BY_ESTUDIANTE}/${estudianteId}`);
  }
}
