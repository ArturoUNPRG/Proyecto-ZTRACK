
# Informe de Uso de IA - Proyecto ZTRACK

[cite_start]Este informe detalla el uso de herramientas de Inteligencia Artificial (IA) asistida durante el desarrollo de la prueba técnica para **ZGROUP**[cite: 13, 47].

## [cite_start]1. Áreas donde se utilizó IA [cite: 48]

* [cite_start]**Arquitectura de Software:** Se utilizó la IA para proponer una estructura de carpetas profesional en FastAPI siguiendo el patrón de diseño de esquemas, rutas y servicios[cite: 61, 62, 63, 64].
* [cite_start]**Modelado de Datos (Pydantic):** La IA asistió en la creación de validaciones robustas para los modelos de `Student` y `Exam`, asegurando que las notas estén en el rango de 0 a 20 y que los campos obligatorios cumplan con los requisitos mínimos[cite: 29, 30].
* [cite_start]**Visualización de Datos:** Se solicitó apoyo para la configuración técnica de la librería **Recharts** en el frontend, específicamente para implementar gráficos de Radar y Tendencia que permitan visualizar el desempeño del alumno[cite: 56].
* [cite_start]**Depuración (Debugging):** La IA fue fundamental para identificar errores de lógica y conectividad, como el manejo de estados nulos al sincronizar el frontend con el backend.

## [cite_start]2. Trabajo realizado manualmente [cite: 49]

* **Lógica de Persistencia en Frontend:** Implementación de la lógica para recargar la lista de estudiantes si el estado global se reinicia (F5), garantizando que la aplicación no se bloquee al perder el estado de Zustand.
* [cite_start]**Personalización de Interfaz (Tailwind):** Diseño estético adaptado a la identidad visual de **ZTRACK** y optimización de componentes para asegurar una experiencia fluida en dispositivos móviles[cite: 40, 43].
* [cite_start]**Integración con Axios:** Configuración manual de los servicios de API, interceptores y el manejo de estados de carga (`isLoading`) para mejorar la retroalimentación al usuario[cite: 41, 44].

## [cite_start]3. Errores o limitaciones de la IA detectados [cite: 50]

* **Contexto del Backend:** La IA sugirió utilizar métodos de consulta individual (`GET /api/students/{id}`) que no estaban habilitados inicialmente en el servidor, lo que resultó en errores de tipo `405 Method Not Allowed`.
* **Sincronía de Hooks:** En el desarrollo con React, la IA omitió en ocasiones dependencias necesarias en el array de `useEffect`, lo que requirió correcciones manuales para evitar advertencias del linter y bucles infinitos.

## [cite_start]4. Mejora implementada sugerida por la IA [cite: 51]

* **Validación de tipos en Pydantic:** Se implementó el uso de `Field(..., ge=0, le=20)` en el esquema de exámenes. [cite_start]Esta validación asegura que el backend rechace cualquier nota fuera del rango académico permitido antes de que llegue a la base de datos, cumpliendo con los requisitos de manejo de excepciones y validaciones estándar[cite: 27, 29].

---
**Desarrollado por:** Arturo Becerra  
[cite_start]**Postulación:** Programador Junior - ZGROUP [cite: 2]
