# ZTRACK - Sistema de Gestión Académica

ZTRACK es una plataforma integral para la gestión de alumnos y registros académicos, desarrollada para la prueba técnica de **ZGROUP**. 
Este sistema no solo cumple con los requisitos base, sino que incluye funcionalidades nuevas.

## Requerimientos Implementados (Mínimo Solicitado)
* **Backend:** API REST con FastAPI y MongoDB.
* **Frontend:** SPA con React, TypeScript y Tailwind CSS.
* **CRUD Alumnos:** Registro y listado de estudiantes.
* **Gestión de Notas:** Formulario dinámico para asignar calificaciones.
* **Documentación:** Informe detallado de uso de IA (AI_USAGE.md).

## Funcionalidades PLUS
Se implementaron los siguientes extras:
* **Dashboard Estadístico:** Visualización de métricas mediante gráficos de Radar, Barras y Líneas con la librería **Recharts**.
* **Gestión de Estado:** Uso de **Zustand** para un manejo eficiente y global de la información.
* **Mantenimiento Completo:** Implementación de **Edición (PUT)** y **Eliminación (DELETE)** tanto para alumnos como para notas.
* **UX Avanzada:** Sistema de búsqueda en tiempo real, modales de confirmación para acciones críticas y persistencia de datos ante recargas (F5).
* **Validaciones:** Esquemas de Pydantic con restricciones de seguridad para correos, DNIs únicos y rangos de notas (0-20).

## API Endpoints

### Estudiantes
| Método | Endpoint | Descripción |
|----------|----------|-------------|
| **POST** | `/api/students/` | Añade un nuevo estudiante al sistema. |
| **GET** | `/api/students/` | Obtiene la lista completa de estudiantes. |
| **GET** | `/api/students/{id}` | **(PLUS)** Obtiene los detalles de un estudiante específico. |
| **PUT** | `/api/students/{id}` | **(PLUS)** Actualiza la información de un alumno. |
| **DELETE**| `/api/students/{id}` | **(PLUS)** Elimina a un estudiante del registro. |

### Exámenes y Notas
| Método | Endpoint | Descripción |
|----------|----------|-------------|
| **GET** | `/api/exams/{student_id}` | Obtiene el historial y promedio de un alumno. |
| **POST** | `/api/exams/` | Registro de calificaciones con fecha automática. |
| **PUT** | `/api/exams/{id}` | **(PLUS)** Edición de materias o puntajes registrados. |
| **DELETE**| `/api/exams/{id}` | **(PLUS)** Eliminación de registros de notas. |


## 📂 Estructura del Proyecto

### Backend (FastAPI)
* **`app/main.py`**: Punto de entrada de la aplicación y configuración de middleware.
* **`app/routes/`**: Definición de endpoints para `student.py` y `exam.py`.
* **`app/schemas/`**: Modelos de validación Pydantic para la transferencia de datos.
* **`app/db/`**: Configuración de la conexión asíncrona con MongoDB.
* **`Dockerfile` & `requirements.txt`**: Archivos de configuración para entorno y despliegue.

### Frontend (React + TS)
* **`src/pages/`**: Vistas principales (`DashboardAlumnos.tsx` y `NotasAlumnos.tsx`).
* **`src/store/`**: Gestión de estado global con `useAppStore.ts`.
* **`src/services/`**: Configuración de Axios para peticiones al backend (`api.ts`).
* **`src/assets/`**: Recursos estáticos como el logo corporativo.
* **`src/types/`**: Definiciones de interfaces TypeScript para consistencia de datos.

## Instalación y Uso

1. **Docker (Recomendado):**
   ```bash
   docker-compose up --build

---------------------------------------------------------------------
**Postulante:** Arturo Becerra