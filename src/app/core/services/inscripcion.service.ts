import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { 
  EstudianteMateriaProfesor, 
  CreateInscripcionDto, 
  ResumenInscripcionEstudiante,
  ValidacionInscripcion 
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
  createInscripcion(inscripcion: CreateInscripcionDto): Observable<ApiResponse<EstudianteMateriaProfesor>> {
    return this.http.post<ApiResponse<EstudianteMateriaProfesor>>(API_ENDPOINTS.INSCRIPCIONES, inscripcion);
  }

  /**
   * Obtiene todas las inscripciones de un estudiante
   */
  getInscripcionesByEstudiante(estudianteId: number): Observable<ApiResponse<EstudianteMateriaProfesor[]>> {
    return this.http.get<ApiResponse<EstudianteMateriaProfesor[]>>(`${API_ENDPOINTS.INSCRIPCIONES}/estudiante/${estudianteId}`);
  }

  /**
   * Obtiene el resumen completo de inscripciones de un estudiante incluyendo compañeros
   */
  getResumenEstudiante(estudianteId: number): Observable<ApiResponse<ResumenInscripcionEstudiante>> {
    return this.http.get<ApiResponse<ResumenInscripcionEstudiante>>(`${API_ENDPOINTS.INSCRIPCIONES}/estudiante/${estudianteId}/resumen`);
  }

  /**
   * Valida si un estudiante puede inscribirse a una materia con un profesor específico
   */
  validarInscripcion(estudianteId: number, materiaId: number, profesorId: number): Observable<ApiResponse<ValidacionInscripcion>> {
    return this.http.get<ApiResponse<ValidacionInscripcion>>(
      `${API_ENDPOINTS.INSCRIPCIONES}/validar/${estudianteId}/${materiaId}/${profesorId}`
    );
  }

  /**
   * Elimina una inscripción
   */
  deleteInscripcion(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${API_ENDPOINTS.INSCRIPCIONES}/${id}`);
  }

  /**
   * Obtiene todos los estudiantes inscritos en una materia específica
   */
  getEstudiantesByMateria(materiaId: number): Observable<ApiResponse<any[]>> {
    return this.http.get<ApiResponse<any[]>>(`${API_ENDPOINTS.INSCRIPCIONES}/materia/${materiaId}/estudiantes`);
  }

  /**
   * Obtiene todas las inscripciones (para administradores)
   */
  getAllInscripciones(): Observable<ApiResponse<EstudianteMateriaProfesor[]>> {
    return this.http.get<ApiResponse<EstudianteMateriaProfesor[]>>(API_ENDPOINTS.INSCRIPCIONES);
  }
}
