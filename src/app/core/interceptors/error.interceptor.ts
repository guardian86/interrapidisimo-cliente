import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, retry, timeout } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { APP_CONFIG } from '../settings/app.config';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const snackBar = inject(MatSnackBar);

  return next(req).pipe(
    timeout(APP_CONFIG.TIMEOUT),
    retry({
      count: 2,
      delay: (error, retryCount) => {
        if (error instanceof HttpErrorResponse && 
            (error.status === 0 || error.status >= 500)) {
          return new Promise(resolve => setTimeout(resolve, 1000 * retryCount));
        }
        throw error;
      }
    }),
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'Ha ocurrido un error inesperado';
      
      if (error.status === 0) {
        errorMessage = 'Error de conexión. Verifique que el servidor esté ejecutándose.';
      } else if (error.status === 404) {
        errorMessage = 'Recurso no encontrado';
      } else if (error.status === 400) {
        errorMessage = error.error?.message || 'Solicitud incorrecta';
      } else if (error.status === 500) {
        errorMessage = 'Error interno del servidor';
      } else if (error.error?.message) {
        errorMessage = error.error.message;
      }

      // Mostrar error en snackbar para errores críticos
      if (error.status !== 404) {
        snackBar.open(errorMessage, 'Cerrar', {
          duration: 5000,
          panelClass: ['error-snackbar'],
          horizontalPosition: 'right',
          verticalPosition: 'bottom'
        });
      }

      console.error('HTTP Error:', {
        url: req.url,
        status: error.status,
        message: errorMessage,
        error: error
      });

      return throwError(() => error);
    })
  );
};
