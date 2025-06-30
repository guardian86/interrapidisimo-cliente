import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, retry, timeout } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { APP_CONFIG } from '../settings/app.config';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const baseStream = next(req).pipe(
    timeout(APP_CONFIG.TIMEOUT)
  );

  // Solo reintentar si no estamos en modo desarrollo
  const streamWithRetry = APP_CONFIG.DEVELOPMENT_MODE 
    ? baseStream 
    : baseStream.pipe(
        retry({
          count: 1,
          delay: (error, retryCount) => {
            if (error instanceof HttpErrorResponse && 
                (error.status === 0 || error.status >= 500)) {
              return new Promise(resolve => setTimeout(resolve, 500));
            }
            throw error;
          }
        })
      );

  return streamWithRetry.pipe(
    catchError((error: HttpErrorResponse) => {
      // En modo desarrollo, solo loggear errores, no mostrar snackbars
      if (APP_CONFIG.DEVELOPMENT_MODE && !APP_CONFIG.SHOW_API_ERRORS) {
        console.warn('API Error (Development Mode):', {
          url: req.url,
          status: error.status,
          message: error.message
        });
        return throwError(() => error);
      }

      let errorMessage = 'Ha ocurrido un error inesperado';
      
      if (error.status === 0) {
        errorMessage = `No se puede conectar con la API. Verifique que el servidor esté ejecutándose en ${APP_CONFIG.API_URL}`;
      } else if (error.status === 404) {
        errorMessage = 'Recurso no encontrado';
      } else if (error.status === 400) {
        errorMessage = error.error?.message || 'Solicitud incorrecta';
      } else if (error.status === 500) {
        errorMessage = 'Error interno del servidor';
      } else if (error.error?.message) {
        errorMessage = error.error.message;
      }

      // Solo mostrar snackbar si está habilitado
      if (APP_CONFIG.SHOW_API_ERRORS && error.status !== 404 && error.status !== 400) {
        // TODO: Implementar notificación de errores sin usar inject en interceptor
        // const snackBar = inject(MatSnackBar);
        // snackBar.open(errorMessage, 'Cerrar', {
        //   duration: 3000,
        //   panelClass: ['error-snackbar'],
        //   horizontalPosition: 'right',
        //   verticalPosition: 'bottom'
        // });
      }

      console.error('HTTP Error:', {
        url: req.url,
        status: error.status,
        message: errorMessage
      });

      return throwError(() => error);
    })
  );
};
