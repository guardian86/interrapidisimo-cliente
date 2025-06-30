# 🎯 Plan de Implementación - Cliente Angular para Sistema de Registro de Estudiantes

## 📋 Estado Actual vs Requerimientos

### ✅ **YA IMPLEMENTADO:**
- WebAPI en .NET Core funcionando en `http://localhost:5099`
- CRUD básico de estudiantes (crear, listar, actualizar, eliminar)
- Modelos de datos: Estudiante, Materia, Profesor, Inscripción
- Servicios de comunicación con la API
- Interceptores para manejo de errores

### ❌ **FALTA IMPLEMENTAR:**
1. **Sistema de Créditos** - Máximo 9 créditos (3 materias × 3 créditos)
2. **Módulo de Materias** - Lista de 10 materias disponibles
3. **Módulo de Profesores** - Lista de 5 profesores
4. **Sistema de Inscripciones** - Selección de máximo 3 materias
5. **Validación de Profesores** - No repetir profesor
6. **Vista de Compañeros** - Ver estudiantes por materia
7. **Dashboard Principal** - Resumen del sistema

## 🏗️ Implementación por Fases

### **FASE 1: Mejorar CRUD de Estudiantes** ⏱️ 30 min
**Objetivo:** Completar funcionalidades básicas

#### Tareas:
1. **Mejorar UI del listado de estudiantes**
   - Agregar filtros de búsqueda
   - Mejorar tabla con `mat-table` avanzado
   - Paginación real desde la API
   - Acciones: Ver, Editar, Eliminar

2. **Corregir formulario de crear/editar**
   - Validaciones mejoradas
   - Mejor UX con Material Design
   - Manejo de errores específicos

3. **Agregar funcionalidad de editar estudiante**
   - Componente de edición
   - Navegación entre vistas

#### Archivos a modificar:
```
src/app/features/students/pages/
├── estudiantes-lista/
├── estudiantes-crear/
└── estudiantes-editar/ ← CREAR
```

---

### **FASE 2: Módulo de Materias** ⏱️ 45 min
**Objetivo:** Mostrar las 10 materias disponibles

#### Tareas:
1. **Crear componentes de materias**
   - Lista de materias disponibles
   - Detalle de cada materia (con profesor asignado)
   - Cards con información visual atractiva

2. **Servicio de materias**
   - Consumir endpoints de tu API
   - Cache de datos para mejor performance

#### Estructura:
```
src/app/features/materias/
├── materias.routes.ts
├── pages/
│   ├── materias-lista/
│   └── materia-detalle/
└── components/
    └── materia-card/
```

#### Endpoints de API a consumir:
- `GET /api/materias` - Lista de materias
- `GET /api/materias/{id}` - Detalle de materia
- `GET /api/materias/{id}/profesor` - Profesor de la materia

---

### **FASE 3: Módulo de Profesores** ⏱️ 30 min
**Objetivo:** Mostrar los 5 profesores y sus materias

#### Tareas:
1. **Lista de profesores**
   - Cards de profesores con foto placeholder
   - Especialización y materias que enseña
   - Información de contacto

2. **Detalle de profesor**
   - Materias que enseña
   - Estudiantes inscritos en sus materias

#### Estructura:
```
src/app/features/profesores/
├── profesores.routes.ts
├── pages/
│   ├── profesores-lista/
│   └── profesor-detalle/
└── components/
    └── profesor-card/
```

---

### **FASE 4: Sistema de Inscripciones** ⏱️ 60 min
**Objetivo:** Proceso de inscripción con validaciones

#### Tareas:
1. **Wizard de inscripción**
   - Paso 1: Seleccionar estudiante
   - Paso 2: Seleccionar materias (máximo 3)
   - Paso 3: Validar que no se repita profesor
   - Paso 4: Confirmar inscripción

2. **Validaciones en tiempo real**
   - Contador de créditos (máximo 9)
   - Contador de materias (máximo 3)
   - Verificación de profesor único
   - Mensaje de error si viola restricciones

3. **Componente de carrito de materias**
   - Lista de materias seleccionadas
   - Resumen de créditos
   - Botón para remover materias

#### Estructura:
```
src/app/features/inscripciones/
├── inscripciones.routes.ts
├── pages/
│   ├── inscripcion-wizard/
│   ├── mis-inscripciones/
│   └── inscripciones-lista/
└── components/
    ├── seleccion-materias/
    ├── carrito-materias/
    └── resumen-creditos/
```

#### Endpoints de API:
- `POST /api/inscripciones` - Crear inscripción
- `GET /api/inscripciones/estudiante/{id}` - Mis inscripciones
- `GET /api/inscripciones/validar` - Validar restricciones

---

### **FASE 5: Vista de Compañeros** ⏱️ 45 min
**Objetivo:** Ver estudiantes que comparten clases

#### Tareas:
1. **Lista de compañeros por materia**
   - Por cada materia inscrita, mostrar compañeros
   - Solo mostrar nombre (privacidad)
   - Organizar por materia

2. **Componente de compañeros**
   - Filtro por materia
   - Búsqueda de compañeros
   - Vista tipo red social

#### Estructura:
```
src/app/features/companeros/
├── companeros.routes.ts
├── pages/
│   └── companeros-lista/
└── components/
    ├── companero-card/
    └── filtro-materias/
```

#### Endpoints de API:
- `GET /api/inscripciones/companeros/{estudianteId}` - Mis compañeros
- `GET /api/inscripciones/materia/{materiaId}/estudiantes` - Estudiantes por materia

---

### **FASE 6: Dashboard Principal** ⏱️ 30 min
**Objetivo:** Vista principal con resumen

#### Tareas:
1. **Dashboard con widgets**
   - Resumen de créditos actuales
   - Próximas clases
   - Materias inscritas
   - Profesores de mis materias

2. **Navegación mejorada**
   - Sidenav con todas las secciones
   - Breadcrumbs
   - Menu de usuario

#### Estructura:
```
src/app/features/dashboard/
├── dashboard.routes.ts
├── pages/
│   └── dashboard-principal/
└── components/
    ├── resumen-creditos/
    ├── materias-widget/
    └── profesores-widget/
```

---

## 🎨 Mejoras de UI/UX a Implementar

### **Componentes Material Design:**
- `mat-stepper` - Proceso de inscripción
- `mat-chip` - Materias seleccionadas
- `mat-progress-bar` - Progreso de créditos
- `mat-badge` - Contadores
- `mat-expansion-panel` - Detalles expandibles
- `mat-grid-list` - Grid de materias/profesores
- `mat-sidenav` - Navegación lateral
- `mat-toolbar` - Barra superior

### **Temas y Estilos:**
- Paleta de colores consistente
- Iconografía educativa
- Responsive design
- Dark mode opcional

---

## 📱 Estructura de Navegación Final

```
┌─ Dashboard (Resumen)
├─ Estudiantes
│  ├─ Lista
│  ├─ Crear
│  └─ Editar
├─ Materias
│  ├─ Disponibles
│  └─ Detalle
├─ Profesores
│  ├─ Lista
│  └─ Perfil
├─ Inscripciones
│  ├─ Nueva Inscripción (Wizard)
│  ├─ Mis Inscripciones
│  └─ Historial
└─ Compañeros
   ├─ Por Materia
   └─ Todos
```

---

## 🚀 Cronograma de Desarrollo

| Fase | Tiempo | Prioridad | Dependencias |
|------|--------|-----------|--------------|
| Fase 1 | 30 min | ALTA | Ninguna |
| Fase 2 | 45 min | ALTA | Fase 1 |
| Fase 3 | 30 min | MEDIA | Fase 2 |
| Fase 4 | 60 min | ALTA | Fases 1-3 |
| Fase 5 | 45 min | ALTA | Fase 4 |
| Fase 6 | 30 min | MEDIA | Todas |

**Total: ~4 horas de desarrollo**

---

## ❓ ¿Por cuál fase empezamos?

**Recomiendo empezar por:**
1. **Fase 1** - Mejorar CRUD de estudiantes (base sólida)
2. **Fase 2** - Módulo de materias (para entender la data)
3. **Fase 4** - Sistema de inscripciones (core del negocio)

¿Te parece bien este plan? ¿Por cuál fase quieres empezar?
