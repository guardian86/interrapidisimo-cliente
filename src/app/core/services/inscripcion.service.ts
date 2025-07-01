import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { 
  InscripcionCreateDto,
  InscripcionResponseDto,
  MateriasDisponiblesParaEstudianteDto,
  ProfesorDisponibleDto,
  ResumenInscripcionEstudiante,
  ResumenInscripcionAPI
} from '../models/inscripcion.model';
import { API_ENDPOINTS } from '../settings/app.config';

@Injectable({
  providedIn: 'root'
})
export class InscripcionService {

  constructor(private http: HttpClient) {}

  /**
   * Crea una nueva inscripción
   */
  createInscripcion(inscripcion: InscripcionCreateDto): Observable<InscripcionResponseDto> {
    return this.http.post<InscripcionResponseDto>(API_ENDPOINTS.INSCRIPCIONES, inscripcion);
  }

  /**
   * Obtiene las materias disponibles para inscripción de un estudiante
   */
  getMateriasDisponibles(estudianteId: number): Observable<MateriasDisponiblesParaEstudianteDto[]> {
    return this.http.get<MateriasDisponiblesParaEstudianteDto[]>(`${API_ENDPOINTS.MATERIAS}/disponibles/${estudianteId}`);
  }

  /**
   * Elimina una inscripción por parámetros específicos (según Swagger: DELETE /api/Inscripciones/{estudianteId}/{materiaId}/{profesorId})
   */
  deleteInscripcionByParams(estudianteId: number, materiaId: number, profesorId: number): Observable<void> {
    return this.http.delete<void>(`${API_ENDPOINTS.INSCRIPCIONES}/${estudianteId}/${materiaId}/${profesorId}`);
  }

  /**
   * Valida si un estudiante puede inscribirse en una materia con un profesor específico
   * Según Swagger: GET /api/Inscripciones/validar/{estudianteId}/{materiaId}/{profesorId}
   */
  validarInscripcion(estudianteId: number, materiaId: number, profesorId: number): Observable<any> {
    return this.http.get<any>(`${API_ENDPOINTS.INSCRIPCIONES_VALIDAR}/${estudianteId}/${materiaId}/${profesorId}`);
  }

  /**
   * Obtiene las inscripciones de un estudiante específico
   */
  getInscripcionesByEstudiante(estudianteId: number): Observable<any[]> {
    return this.http.get<any[]>(`${API_ENDPOINTS.INSCRIPCIONES_BY_ESTUDIANTE}/${estudianteId}`);
  }

  /**
   * Obtiene el resumen de inscripciones de un estudiante (estructura real del API)
   */
  getResumenInscripcionAPI(estudianteId: number): Observable<ResumenInscripcionAPI> {
    return this.http.get<ResumenInscripcionAPI>(`${API_ENDPOINTS.INSCRIPCIONES_RESUMEN}/${estudianteId}`);
  }

  /**
   * Obtiene el resumen de inscripciones de un estudiante (mantener compatibilidad)
   */
  getResumenInscripcion(estudianteId: number): Observable<ResumenInscripcionEstudiante> {
    return this.http.get<ResumenInscripcionEstudiante>(`${API_ENDPOINTS.INSCRIPCIONES_RESUMEN}/${estudianteId}`);
  }

  /**
   * Obtiene los compañeros de clase de un estudiante en una materia específica
   */
  getCompanerosByMateria(estudianteId: number, materiaId: number): Observable<any[]> {
    return this.http.get<any[]>(`${API_ENDPOINTS.ESTUDIANTES}/${estudianteId}/companeros/materia/${materiaId}`);
  }
}
