# Guion Técnico de Video Explicativo — E-Actividad 4.3 (Proyecto Final)

**Universidad Valle del Momboy · Facultad de Ingeniería**  
**Escuela de Computación · Asignatura: FrontEndIVIVFI2026C**  
**Profesor:** Anggelo Huz  
**Proyecto:** Sistema de Encuestas Formativas — Cátedra Libre Dr. José Gregorio Hernández  
**Duración proyectada:** 10 a 12 minutos (Ventana normativa: 5 a 15 minutos)  
**Calidad de video:** 1080p / 720p 60fps con cámara encendida mostrando los rostros de ambos integrantes.

---

## 1. Ficha del Video y Enlace Público

> [!IMPORTANT]
> **Enlace de YouTube:** `https://www.youtube.com/watch?v=PENDIENTE_GRABACION_HUMANA`  
> *(Acción humana pendiente: Una vez grabado y editado por el equipo humano, insertar el enlace definitivo aquí y en el README.md).*

---

## 2. Distribución Equitativa de Voces y Tiempos

- **Participante 1 — Martin Morfe Flores (`mmorfe-engineer` · C.I. 8.263.711):**  
  Apertura institucional, arquitectura full-stack monorepo, backend RESTful en Node.js/Express, persistencia NoSQL en MongoDB, sesiones seguras HttpOnly, formulario de contacto multipart con carga segura de archivos y descarga administrativa. *(~5 minutos)*
- **Participante 2 — Martin Alejandro Morfe Carballo (`morfemartin` · C.I. 30.539.018):**  
  Frontend SPA en React 19, componentes reactivos, variables y estilos CSS sin dependencias pesadas, módulo interactivo de respuesta a encuestas con prevención de duplicados, buscador dinámico en tiempo real y flujo de usuario participante. *(~5 minutos)*
- **Cierre Conjunto:** Conclusiones académicas, matriz de cumplimiento y despedida. *(~1 minuto)*

---

## 3. Escaletay Cronograma Minuto a Minuto

### Minuto 00:00 – 01:15 · Bloque 1: Apertura Institucional y Contexto
- **Cámara:** Pantalla dividida con ambos rostros visibles y diapositiva 1 de la presentación institucional.
- **Voz Martin Morfe Flores:**
  > *"Saludos cordiales, profesor Anggelo Huz y compañeros de la Universidad Valle del Momboy. Somos Martin Morfe Flores y Martin Alejandro Morfe Carballo, estudiantes de la asignatura FrontEndIVIVFI2026C. Presentamos el Proyecto Final correspondiente a la E-Actividad 4.3: 'JGH Encuestas', un sistema web full-stack para encuestas formativas y vinculación comunitaria al servicio de la Cátedra Libre Dr. José Gregorio Hernández."*
- **Voz Martin Alejandro Morfe Carballo:**
  > *"El propósito de este proyecto es integrar de forma armónica una interfaz reactiva moderna con React 19, una API REST desacoplada en Express, persistencia NoSQL real en MongoDB y rigurosos controles de seguridad, validación de datos y trabajo colaborativo verificable."*

---

### Minuto 01:15 – 03:30 · Bloque 2: Arquitectura del Backend, NoSQL y Seguridad
- **Cámara / Pantalla:** Rostro de Martin Morfe Flores en recuadro superior derecho. Compartir VS Code y terminal mostrando `backend/src/app.js` y `backend/src/models/`.
- **Voz Martin Morfe Flores:**
  > *"Comenzamos con la arquitectura del backend. Diseñamos un monorepo modular desacoplado. En el archivo `backend/src/app.js`, configuramos Express con middlewares de seguridad como `helmet`, CORS con credenciales habilitadas y gestión de sesiones basadas en servidor con cookies `HttpOnly` firmadas, evitando cualquier exposición de tokens en el cliente contra ataques XSS."*
  >
  > *"Para la persistencia, utilizamos MongoDB Community y Mongoose ODM. Diseñamos cuatro esquemas documentales fundamentales: `User`, con contraseñas hasheadas mediante `bcryptjs` con 10 rondas de salt y exclusión automática en JSON; `Survey`, con preguntas embebidas y ciclo de vida controlado por estados; `ContactSubmission`, que almacena solicitudes con metadatos estructurados; y `Response`, con un índice único compuesto que impide el voto duplicado."*
  >
  > *"La API está formalmente documentada bajo el estándar OpenAPI 3.1 en `backend/openapi/openapi.json` y servida en vivo en `/api/openapi.json`."*

---

### Minuto 03:30 – 05:45 · Bloque 3: Formulario de Contacto Multipart y Carga Segura
- **Cámara / Pantalla:** Navegador web en `http://localhost:3000/contact` y VS Code en `backend/src/middleware/upload.js`.
- **Voz Martin Morfe Flores:**
  > *"Uno de los requisitos medulares del pliego 4.3 es el formulario de contacto con al menos cinco tipos de campos y carga de archivos. En pantalla podemos observar el formulario implementado en React:"*
  > 1. *"Campo `email`: con validación RFC 5322."*
  > 2. *"Campo `number`: para participantes estimados (1 a 5000). "*
  > 3. *"Campo `date`: para la fecha propuesta de la actividad comunitaria."*
  > 4. *"Campo `radio`: para categorizar el tipo de solicitud (académica, comunitaria, institucional) junto con el teléfono de contacto."*
  > 5. *"Campo `file`: que soporta arrastrar y soltar (Drag & Drop) para adjuntar solicitudes en PDF, PNG o JPG de hasta 3 Megabytes."*
  >
  > *(Acción en pantalla: Llenar el formulario con datos de prueba, adjuntar un PDF real y pulsar 'Enviar Solicitud').*
  >
  > *"Al enviar, se muestra un spinner asíncrono y una microanimación de éxito. En el backend, Multer verifica el tipo MIME real mediante números mágicos, genera un identificador UUID único y almacena el archivo en un directorio privado fuera de la carpeta pública. Demostramos ahora en el panel administrativo cómo el usuario administrador puede inspeccionar la solicitud guardada en MongoDB y descargar el archivo de forma protegida contra path traversal."*

---

### Minuto 05:45 – 08:30 · Bloque 4: Frontend React 19, Componentes y Participación
- **Cámara / Pantalla:** Rostro de Martin Alejandro Morfe Carballo. Compartir navegador en `http://localhost:3000/surveys` y código de `frontend/src/`.
- **Voz Martin Alejandro Morfe Carballo:**
  > *"Pasamos ahora a la interfaz de usuario en el frontend, construida con React 19 y Vite v6. Respetando el mandato de excelencia, no dependemos de bibliotecas de diseño genéricas: creamos una hoja de estilos propia organizada en variables institucionales (`#103D45` petróleo, `#F8F5EE` fondo marfil y `#F0D39A` dorado acento), animaciones fluidas con keyframes y diseño 100% responsive."*
  >
  > *(Acción en pantalla: Navegar por la página de Encuestas, mostrar el filtrado por temas y abrir una encuesta).*
  >
  > *"Aquí observamos el catálogo de encuestas formativas. El usuario puede filtrar por ejes temáticos como Bioética, Vocación de Servicio o Ciencia Médica. Al ingresar a un instrumento formativo, se cargan asíncronamente las preguntas configuradas por los docentes."*
  >
  > *"En el módulo de participación, iniciamos sesión como participante registrado. Seleccionamos las opciones de respuesta y enviamos. La aplicación gestiona la petición POST, valida la obligatoriedad y emite confirmación. Si el participante intenta volver a responder la misma encuesta, la API detecta el conflicto y devuelve un código 409 con una alerta clara en la interfaz, garantizando la integridad estadística del instrumento."*

---

### Minuto 08:30 – 10:15 · Bloque 5: Buscador Dinámico, Calidad y Pruebas Automatizadas
- **Cámara / Pantalla:** Martin Alejandro Morfe Carballo mostrando el buscador en vivo y luego consola ejecutando `npm test`.
- **Voz Martin Alejandro Morfe Carballo:**
  > *"Asimismo, implementamos el buscador reactivo en tiempo real. Conforme el usuario escribe términos clave en la barra de búsqueda, el estado se actualiza y filtra de manera instantánea las encuestas disponibles en la base de datos."*
  >
  > *"En cuanto al aseguramiento de la calidad técnica, el proyecto cuenta con una batería completa de pruebas automatizadas en `npm test`."*
  >
  > *(Acción en pantalla: Ejecutar `npm test` en la terminal).*
  >
  > *"Observamos 16 pruebas aprobadas en el backend que cubren registro, login, control de acceso por roles, persistencia de encuestas, validaciones de seguridad de archivos y prevención de inyección, sumadas a la prueba de compilación del frontend sin errores."*

---

### Minuto 10:15 – 11:30 · Bloque 6: Conclusiones, Repositorio y Cierre
- **Cámara:** Pantalla dividida con ambos integrantes en cámara. Diapositiva 12 de la presentación.
- **Voz Martin Morfe Flores:**
  > *"Para concluir, el repositorio en GitHub `mmorfe-engineer/uvm-4.3-jgh-proyecto-final` evidencia el trabajo coordinado de ambos integrantes con un historial de commits limpio y transparente. Toda la documentación exigida está disponible: Manual Técnico de 11 páginas en PDF, Manual de Usuario con capturas reales, especificación en Figma, diagramas NoSQL y el paquete de entrega `8263711_martin_morfe.zip` verificado con checksum SHA-256."*
- **Voz Martin Alejandro Morfe Carballo:**
  > *"Agradecemos al profesor Anggelo Huz por la guía durante este periodo académico en la Universidad Valle del Momboy. Ha sido una experiencia enriquecedora que consolida nuestras competencias en desarrollo web full-stack, ingeniería de software y bioética aplicada. ¡Muchas gracias!"*
