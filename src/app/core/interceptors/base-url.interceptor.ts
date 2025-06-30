import { HttpInterceptorFn } from '@angular/common/http';
import { APP_CONFIG } from '../settings/app.config';

export const baseUrlInterceptor: HttpInterceptorFn = (req, next) => {
  // Solo aplicar el interceptor si la URL no es absoluta
  if (!req.url.startsWith('http')) {
    const apiReq = req.clone({
      url: `${APP_CONFIG.API_URL}${req.url}`
    });
    return next(apiReq);
  }
  
  return next(req);
};
