# InterRapidísimo - Cliente Angular

Sistema de Registro de Estudiantes para InterRapidísimo

## Requisitos Previos

- Node.js (versión 18 o superior)
- Angular CLI (`npm install -g @angular/cli`)
- Backend API ejecutándose en `http://localhost:5099`

## Instalación

1. Instalar dependencias:
```bash
npm install
```

2. Ejecutar la aplicación:
```bash
npm start
```

La aplicación estará disponible en `http://localhost:4200`

## Configuración de la API

La aplicación está configurada para conectarse con la API en `http://localhost:5099`.

### Si no tienes el backend ejecutándose:
- La aplicación mostrará datos de ejemplo para desarrollo
- Verás notificaciones indicando que no se puede conectar con la API
- Todas las funcionalidades de visualización funcionarán con datos mock

### Para conectar con la API real:
1. Asegúrate de que el backend esté ejecutándose en el puerto 5099
2. La URL de la API se puede cambiar en `src/app/core/settings/app.config.ts`

## Funcionalidades

- ✅ Listado de estudiantes
- ✅ Crear nuevo estudiante
- ✅ Editar estudiante existente
- ✅ Eliminar estudiante
- ✅ Manejo de errores y notificaciones
- ✅ Datos de ejemplo cuando no hay conexión con la API

## Estructura del Proyecto

```
src/
├── app/
│   ├── core/           # Servicios, modelos, interceptores
│   ├── features/       # Módulos de funcionalidades
│   │   └── students/   # Gestión de estudiantes
│   └── shared/         # Componentes compartidos
``` 
