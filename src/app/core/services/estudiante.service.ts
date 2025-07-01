import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { 
  EstudianteDto, 
  EstudianteListDto, 
  EstudianteCreateDto, 
  EstudianteUpdateDto,
  EstudianteCompaneroDto
} from '../models/estudiante.model';
import { API_ENDPOINTS } from '../settings/app.config';

@Injectable({
  providedIn: 'root'
})
export class EstudianteService {

  constructor(private http: HttpClient) {}

  /**
   * Obtiene todos los estudiantes
   */
  getEstudiantes(): Observable<EstudianteListDto[]> {
    console.log('🎓 EstudianteService: Obteniendo lista de estudiantes...');
    console.log('🔗 Endpoint:', API_ENDPOINTS.ESTUDIANTES);
    
    return this.http.get<EstudianteListDto[]>(API_ENDPOINTS.ESTUDIANTES).pipe(
      tap(estudiantes => {
        console.log('EstudianteService: Estudiantes recibidos:', estudiantes);
        console.log('EstudianteService: Cantidad de estudiantes:', estudiantes.length);
      }),
      catchError(error => {
        console.error('EstudianteService: Error al obtener estudiantes:', error);
        console.error('Detalles del error:', {
          status: error.status,
          statusText: error.statusText,
          url: error.url,
          message: error.message
        });
        throw error;
      })
    );
  }

  /**
   * Obtiene un estudiante por ID
   */
  getEstudianteById(id: number): Observable<EstudianteDto> {
    return this.http.get<EstudianteDto>(`${API_ENDPOINTS.ESTUDIANTES}/${id}`);
  }

  /**
   * Obtiene los compañeros de un estudiante en una materia específica
   */
  getCompanerosByMateria(estudianteId: number, materiaId: number): Observable<EstudianteCompaneroDto[]> {
    return this.http.get<EstudianteCompaneroDto[]>(`${API_ENDPOINTS.ESTUDIANTES}/${estudianteId}/companeros/materia/${materiaId}`);
  }

  /**
   * Obtiene los compañeros de un estudiante (método genérico - puede necesitar materiaId)
   */
  getCompaneros(estudianteId: number): Observable<EstudianteCompaneroDto[]> {
    return this.http.get<EstudianteCompaneroDto[]>(`${API_ENDPOINTS.ESTUDIANTES}/${estudianteId}/companeros`);
  }

  /**
   * Crea un nuevo estudiante
   */
  createEstudiante(estudiante: EstudianteCreateDto): Observable<EstudianteDto> {
    return this.http.post<EstudianteDto>(API_ENDPOINTS.ESTUDIANTES, estudiante);
  }

  /**
   * Actualiza un estudiante existente
   */
  updateEstudiante(id: number, estudiante: EstudianteUpdateDto): Observable<EstudianteDto> {
    return this.http.put<EstudianteDto>(`${API_ENDPOINTS.ESTUDIANTES}/${id}`, estudiante);
  }

  /**
   * Elimina un estudiante
   */
  deleteEstudiante(id: number): Observable<void> {
    return this.http.delete<void>(`${API_ENDPOINTS.ESTUDIANTES}/${id}`);
  }

  /**
   * Busca estudiantes por nombre
   */
  searchEstudiantes(nombre: string): Observable<EstudianteListDto[]> {
    const params = new HttpParams().set('nombre', nombre);
    return this.http.get<EstudianteListDto[]>(API_ENDPOINTS.ESTUDIANTES_SEARCH, { params });
  }
}
