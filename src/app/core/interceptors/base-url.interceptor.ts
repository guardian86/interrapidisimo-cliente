import { HttpInterceptorFn } from '@angular/common/http';
import { APP_CONFIG } from '../settings/app.config';

export const baseUrlInterceptor: HttpInterceptorFn = (req, next) => {
  console.log('🔍 Base URL Interceptor - URL original:', req.url);
  console.log('🔧 APP_CONFIG.API_URL:', APP_CONFIG.API_URL);
  
  // Solo aplicar el interceptor si la URL no es absoluta
  if (!req.url.startsWith('http')) {
    const fullUrl = `${APP_CONFIG.API_URL}${req.url}`;
    console.log('🔗 URL completa generada:', fullUrl);
    
    const apiReq = req.clone({
      url: fullUrl
    });
    
    console.log('📤 Enviando request a:', apiReq.url);
    return next(apiReq);
  }
  
  console.log('📤 URL absoluta, enviando sin modificar:', req.url);
  return next(req);
};
