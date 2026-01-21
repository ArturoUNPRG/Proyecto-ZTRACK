# Informe de Uso de IA - Proyecto ZTRACK

Este informe detalla cómo utilicé herramientas de Inteligencia Artificial para potenciar el desarrollo del proyecto ZTRACK, manteniendo siempre el control sobre la arquitectura y la lógica de negocio.

## 1. Herramientas Utilizadas y Roles
Para este proyecto, integré un flujo de trabajo asistido por IA para optimizar diferentes capas del desarrollo:
* **Gemini:** Utilizado como asistente principal para la generación de lógica en el backend y resolución de dudas sobre la integración de FastAPI con MongoDB.
* **Claude:** Empleado para la refactorización de código, asegurando que la estructura fuera limpia, legible y siguiera las mejores prácticas de programación.
* **DeepSeek:** Utilizado específicamente para el diseño del frontend, ayudándome a estructurar los componentes visuales con Tailwind CSS para lograr una interfaz moderna.

## 2. Áreas de Aplicación Específica
* **Modelado y Validación:** Con ayuda de la IA, definí esquemas de Pydantic utilizando `Field(ge=0, le=20)`. Esto garantiza que el backend rechace automáticamente cualquier nota fuera del rango permitido antes de procesarla.
* **Visualización de Datos:** Implementé gráficos complejos (Radar, Barras y Líneas) mediante la configuración técnica de **Recharts**, permitiendo una lectura clara del rendimiento académico.
* **Depuración de Estado:** Logré resolver problemas críticos de persistencia en el frontend, como la pérdida de datos al presionar F5, implementando una lógica de recuperación en los Hooks de React.

## 3. Decisiones y Trabajo Manual
A pesar del apoyo de la IA, las decisiones arquitectónicas fueron manuales:
* **Estructura del Proyecto:** La organización de carpetas y la separación de responsabilidades fueron definidas por mi persona.
* **Experiencia de Usuario (UX):** La navegación, el flujo de los formularios y los modales de confirmación fueron diseñados para ser intuitivos.
* **Gestión de Errores:** Personalicé las respuestas de error del servidor para que el usuario reciba mensajes claros cuando algo falla.

## 4. Reflexión sobre el proceso
El uso de IA me permitió reducir el tiempo de escritura de código repetitivo (boilerplate), permitiéndome enfocarme en la calidad de la arquitectura.

---
**Postulante:** Arturo Becerra  
**Proyecto:** ZTRACK para ZGROUP