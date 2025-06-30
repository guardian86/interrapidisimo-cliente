# 🔧 Configuración para Desarrollo - InterRapidísimo

## ⚡ Solución Rápida para Errores de Conexión

Si estás viendo muchos errores de conexión con la API, aquí están las configuraciones que puedes ajustar:

### 📁 Archivo: `src/app/core/settings/app.config.ts`

```typescript
export const APP_CONFIG = {
  // URL de la API - cambia esto si tu backend está en otro puerto
  API_URL: 'http://localhost:5099/api',
  
  // 🔥 CONFIGURACIONES DE DESARROLLO
  DEVELOPMENT_MODE: true,        // ✅ Modo desarrollo activado
  USE_MOCK_DATA: true,          // ✅ Usar datos de ejemplo
  SHOW_API_ERRORS: false,       // ❌ No mostrar errores de API en pantalla
  
  // Otras configuraciones...
};
```

## 🚀 Estados de Configuración

### 1. **Sin Backend (Actual)** ✅
```typescript
DEVELOPMENT_MODE: true,
USE_MOCK_DATA: true,
SHOW_API_ERRORS: false,
```
- ✅ Sin errores molestos
- ✅ Datos de ejemplo funcionando
- ✅ Interfaz completamente funcional

### 2. **Con Backend Funcionando**
```typescript
DEVELOPMENT_MODE: false,
USE_MOCK_DATA: false,
SHOW_API_ERRORS: true,
```
- ✅ Conexión real con la API
- ✅ Datos reales de la base de datos
- ✅ Notificaciones de errores útiles

### 3. **Debugging/Testing**
```typescript
DEVELOPMENT_MODE: true,
USE_MOCK_DATA: false,
SHOW_API_ERRORS: true,
```
- ✅ Errores visibles para debugging
- ✅ Intentar conectar con API real
- ✅ Fallback a datos de ejemplo si falla

## 🌐 URLs Disponibles

- **Frontend**: http://localhost:4201 (puerto cambiado para evitar conflictos)
- **Backend Esperado**: http://localhost:5099
- **Documentación API**: http://localhost:5099/swagger (cuando esté disponible)

## 📋 Comandos Útiles

```bash
# Iniciar en modo desarrollo
npm start

# Iniciar en puerto específico
ng serve --port 4201

# Build para producción
npm run build

# Ejecutar tests
npm test
```

## 🔄 Cambios Realizados

1. **Interceptor Mejorado**: Ya no muestra errores molestos en modo desarrollo
2. **Datos de Ejemplo**: Se cargan automáticamente cuando no hay conexión
3. **Configuración Flexible**: Puedes cambiar fácilmente entre modos
4. **Menos Reintentos**: Reduce el spam de peticiones fallidas
5. **Mejor Logging**: Errores claros en la consola del navegador

## 🐛 Si Sigues Viendo Errores

1. **Verifica la configuración** en `app.config.ts`
2. **Revisa la consola** del navegador (F12) en lugar de las notificaciones
3. **Cambia el puerto** si hay conflictos: `ng serve --port 4202`
4. **Reinicia el servidor** después de cambiar configuraciones

¡La aplicación ahora debería funcionar sin errores molestos! 🎉
