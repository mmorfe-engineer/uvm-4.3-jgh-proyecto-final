# MATRIZ DE CUMPLIMIENTO NORMATIVO · E-ACTIVIDAD 4.3

**Proyecto:** JGH Encuestas — Sistema de Encuestas Formativas  
**Cátedra Libre Dr. José Gregorio Hernández · Universidad Valle del Momboy**  
**Asignatura:** FrontEndIVIVFI2026C — Taller Front End  
**Profesor:** Anggelo Huz  

---

## 1. REQUISITOS TÉCNICOS FUNCIONALES DEL PLIEGO

| Requisito oficial | Implementación técnica | Evidencia verificable | Estado |
|---|---|---|---|
| **Animaciones web** | CSS Transitions, Keyframes en tarjetas, feedbacks visuales, modal dialogs y estados dinámicos respetando `prefers-reduced-motion` | Estilos en `frontend/src/styles/animations.css`, validación en navegador | EN DESARROLLO |
| **Cambio dinámico de contenido mediante JS** | Renderizado reactivo con React (JSX), componentes interactivos, actualización de estado en tiempo real para encuestas, resultados y formularios | Componentes en `frontend/src/pages/` y `frontend/src/components/` | EN DESARROLLO |
| **Consumo de información desde BD a través de API Express** | API RESTful en Express conectada a MongoDB mediante Mongoose; clientes asíncronos en frontend con Fetch API | Endpoints `/api/surveys`, `/api/auth`, `/api/contact`, controladores en `backend/src/controllers/` | EN DESARROLLO |
| **Programación asíncrona** | Async/Await en controladores Node.js, Mongoose queries, Fetch API con manejo de promesas y abort controllers en React | Funciones asíncronas en `backend/src/` y hooks en `frontend/src/` | EN DESARROLLO |
| **UX/UI con loaders y transiciones** | Loaders de estado reactivo durante fetch de encuestas, inicio de sesión, creación y envío de formularios; transiciones suaves de entrada y salida | Componentes `Spinner`, `SkeletonCard` y feedback visual en UI | EN DESARROLLO |
| **Formulario de contacto con >= 5 campos de tipos requeridos** | Formulario con `email`, `number` (participantes estimados), `date` (fecha propuesta), `phone` (teléfono de contacto), `radio` (tipo de solicitud: institucional, comunitaria, académica), `file` (adjunto PDF/PNG/JPG), `text` y `textarea` | `frontend/src/pages/ContactPage.jsx` y endpoint `POST /api/contact` | EN DESARROLLO |
| **Almacenamiento de datos suministrados por usuario** | Persistencia real en colecciones MongoDB (`users`, `surveys`, `contactSubmissions`, `responses`) | Comprobación de persistencia tras reinicio del servicio en BD | EN DESARROLLO |
| **Validación de información (evitando campos vacíos y no permitidos)** | Doble validación estricta (Frontend en formulario + Backend en middlewares Joi/Express-validator y Multer con MIME sanitization) | Middleware de validación en `backend/src/middleware/`, pruebas negativas | EN DESARROLLO |
| **Buscador que filtre datos de la aplicación** | Buscador dinámico reactivo conectado a la API para filtrar encuestas por título y tópico | *(Módulo reservado para `morfemartin`)* | PENDIENTE |
| **Página web 100 % funcional** | Integración total frontend, backend, autenticación, base de datos NoSQL y ejecución local reproducible | Demostración local end-to-end y suite de pruebas | EN DESARROLLO |

---

## 2. ENTREGABLES GENERALES Y ESPECÍFICOS

| Entregable | Implementación | Evidencia | Estado |
|---|---|---|---|
| **Base de datos NoSQL integrada** | MongoDB + Mongoose con colecciones estructuradas, esquemas e índices | Conexión activa verificable en `/api/health` | EN DESARROLLO |
| **Autenticación y autorización** | Sesiones HTTP con cookie `HttpOnly`, contraseñas hash con `bcryptjs`, middleware de roles (`admin`, `participant`) | Pruebas de seguridad 401/403 en `backend/tests/auth.test.js` | EN DESARROLLO |
| **Seguridad básica** | Validación de tipos MIME reales, control de tamaños (3MB), prevención traversal, exclusión de contraseñas de respuestas JSON, CORS restringido, cookies seguras | Suite de pruebas de seguridad y auditoría en `backend/tests/` | EN DESARROLLO |
| **OpenAPI del backend** | Especificación OpenAPI 3.1 formal documentando todos los endpoints operativos | Archivo `backend/openapi/openapi.json` servido en `/api/openapi.json` | EN DESARROLLO |
| **Diagrama de estructura de BD** | Diagrama de entidades y relaciones NoSQL (colecciones, campos, tipos, índices, referencias y cardinalidades) | `docs/diagramas/DIAGRAMA_BD.md` (Mermaid) | EN DESARROLLO |
| **Manual técnico (>= 8 páginas)** | Documento exhaustivo con arquitectura, BD, API, seguridad, instalación y código | `docs/manuales/MANUAL_TECNICO.md` y compilación PDF (>= 8 páginas) | EN DESARROLLO |
| **Manual de usuario** | Guía ilustrada con flujos paso a paso para visitante, participante y administrador | `docs/manuales/MANUAL_USUARIO.md` y compilación PDF con capturas reales | EN DESARROLLO |
| **Wireframes y mockups (Figma)** | Diseño UI completo (escritorio y móvil), paleta institucional, tipografía y componentes | Enlace Figma y exportaciones en `docs/figma/` | EN DESARROLLO |
| **Tablero de asignación de responsables** | Matriz de gobernanza con tareas, trazabilidad a requisitos y frontera reservada para `morfemartin` | `docs/TABLERO.md` y GitHub Issues | EN DESARROLLO |
| **Repositorio GitHub con historial de ambos miembros** | Monorepo público `mmorfe-engineer/uvm-4.2-jgh-proyecto-final` con commits de `mmorfe-engineer` y PR de `morfemartin` | Registro Git histórico verificable | EN DESARROLLO |
| **Demostración local reproducible** | Scripts de orquestación `npm run dev`, `npm run dev:db`, `npm run seed:admin` | Guía de ejecución local en README y verificación | EN DESARROLLO |
| **Presentación académica (12 láminas)** | Diapositivas en PPTX/PDF estructuradas para la sustentación | `docs/presentacion/PRESENTACION_JGH_4_3.pptx` | EN DESARROLLO |
| **Video explicativo YouTube** | Guion técnico producido, marcas de tiempo, requisitos oficiales (5-15 min, 720p, rostros visibles de ambos miembros) | *Dependencia de grabación humana / enlace YouTube* | PENDIENTE |
| **Archivo de entrega ZIP** | Empaquetado canónico `8263711_martin_morfe.zip` cumpliendo exclusiones y estructura | Script de empaquetado y verificación de integridad | EN DESARROLLO |
