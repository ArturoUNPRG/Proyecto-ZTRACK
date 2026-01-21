

<!-- Informe de Uso de IA - Proyecto ZTRACK -->

Eso de herramientas de Inteligencia Artificial (IA) asistida durante el desarrollo de la prueba técnica para ZGRUP

1. Áreas donde se utilizó IA

<!-- Arquitectura de Software: -->
Se utilizó la IA para proponer una estructura de carpetas profesional en FastAPI siguiendo el patrón de diseño de esquemas, rutas y servicios.

<!-- Modelado de Datos (Pydantic): -->

La IA asistió en la creación de validaciones robustas para los modelos de `Student` y `Exam`, asegurando que las notas estén en el rango de 0 a 20 y que los campos obligatorios cumplan con los requisitos mínimos.
Visualización de Datos:Se solicitó apoyo para la configuración técnica de la librería Rechartsen el frontend, específicamente para implementar gráficos de Radar y Tendencia que permitan visualizar el desempeño del alumno.
Depuración (Debugging):La IA fue fundamental para identificar errores de lógica y conectividad, como el manejo de estados nulos al sincronizar el frontend con el backend.


<!-- 2. Trabajo realizado manualmente -->

Lógica de Persistencia en Frontend:Implementación de la lógica para recargar la lista de estudiantes si el estado global se reinicia (F5), garantizando que la aplicación no se bloquee al perder el estado de Zustand.
Personalización de Interfaz (Tailwind):Diseño estético adaptado a la identidad visual de ZTRACKy optimización de componentes para asegurar una experiencia fluida en dispositivos móviles.
Integración con Axios:Configuración manual de los servicios de API, interceptores y el manejo de estados de carga (`isLoading`) para mejorar la retroalimentación al usuario.


<!-- 3. Errores o limitaciones de la IA detectados -->

Sincronía de Hooks:En el desarrollo con React, la IA omitió en ocasiones dependencias necesarias en el array de `useEffect`, lo que requirió correcciones manuales para evitar advertencias del linter y bucles infinitos.

<!-- 4. Mejora implementada sugerida por la IA -->
Validación de tipos en Pydantic:Se implementó el uso de `Field(..., ge=0, le=20)` en el esquema de exámenes. Esta validación asegura que el backend rechace cualquier nota fuera del rango académico permitido antes de que llegue a la base de datos, cumpliendo con los requisitos de manejo de excepciones y validaciones estándar.

---------------------------------------------------
Desarrollado por: Arturo Becerra  
Telefono: 922041633
