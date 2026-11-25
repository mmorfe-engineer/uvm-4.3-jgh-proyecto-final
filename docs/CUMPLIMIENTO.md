# MATRIZ DE CUMPLIMIENTO NORMATIVO · E-ACTIVIDAD 4.3

**Proyecto:** JGH Encuestas — Sistema de Encuestas Formativas  
**Cátedra Libre Dr. José Gregorio Hernández · Universidad Valle del Momboy**  
**Asignatura:** FrontEndIVIVFI2026C — Taller Front End  
**Profesor:** Anggelo Huz  

---

## 1. REQUISITOS TÉCNICOS FUNCIONALES DEL PLIEGO

| Requisito oficial | Implementación técnica | Evidencia verificable | Estado |
|---|---|---|---|
| **Animaciones web** | CSS Transitions, Keyframes en tarjetas, feedbacks visuales, modal dialogs y estados dinámicos respetando `prefers-reduced-motion` | Estilos en `frontend/src/styles/animations.css`, capturas en `docs/evidencias/` | CUMPLE |
| **Cambio dinámico de contenido mediante JS** | Renderizado reactivo con React 19 (JSX), componentes interactivos, actualización de estado en tiempo real para encuestas, resultados y formularios | Componentes en `frontend/src/pages/` y `frontend/src/components/` | CUMPLE |
| **Consumo de información desde BD a través de API Express** | API RESTful en Express conectada a MongoDB mediante Mongoose; clientes asíncronos en frontend con Fetch API | Endpoints `/api/surveys`, `/api/auth`, `/api/contact`, controladores en `backend/src/controllers/` | CUMPLE |
| **Programación asíncrona** | Async/Await en controladores Node.js, Mongoose queries, Fetch API con manejo de promesas y cookies en React | Funciones asíncronas en `backend/src/` y hooks en `frontend/src/` | CUMPLE |
| **UX/UI con loaders y transiciones** | Loaders de estado reactivo durante fetch de encuestas, inicio de sesión, creación y envío de formularios; transiciones suaves de entrada y salida | Componentes de spinner en `ContactPage`, `SurveysPage` y `AuthModal` | CUMPLE |
| **Formulario de contacto con >= 5 campos de tipos requeridos** | Formulario con `email`, `number` (participantes estimados), `date` (fecha propuesta), `phone` (teléfono de contacto), `radio` (tipo de solicitud: institucional, comunitaria, académica), `file` (adjunto PDF/PNG/JPG), `text` y `textarea` | `frontend/src/pages/ContactPage.jsx`, endpoint `POST /api/contact`, captura `05_desktop_contact_success.png` | CUMPLE |
| **Almacenamiento de datos suministrados por usuario** | Persistencia real en colecciones MongoDB (`users`, `surveys`, `contactSubmissions`) comprobada tras reinicio | Verificación en MongoDB persistente (`backend/data/db`), `backend/tests/contact.test.js` | CUMPLE |
| **Validación de información (evitando campos vacíos y no permitidos)** | Doble validación estricta (Frontend en formulario + Backend en middlewares y Multer con MIME sanitization) | Middleware de validación en `backend/src/middleware/upload.js`, suite en `backend/tests/` | CUMPLE |
| **Buscador que filtre datos de la aplicación** | Buscador dinámico reactivo conectado a la API para filtrar encuestas por título y tópico | *(Módulo reservado para `morfemartin` en Handoff HITO 5)* | PENDIENTE (RESERVA) |
| **Página web 100 % funcional** | Integración total frontend, backend, autenticación, base de datos NoSQL y ejecución local reproducible | Núcleo probado (16 tests backend + 1 frontend + Chromium QA) | CUMPLE (NÚCLEO) |

---

## 2. ENTREGABLES GENERALES Y ESPECÍFICOS

| Entregable | Implementación | Evidencia | Estado |
|---|---|---|---|
| **Base de datos NoSQL integrada** | MongoDB + Mongoose con colecciones estructuradas, esquemas e índices | Conexión activa verificable en `/api/health`, persistencia en `backend/data/db` | CUMPLE |
| **Autenticación y autorización** | Sesiones HTTP con cookie `HttpOnly`, contraseñas hash con `bcryptjs`, middleware de roles (`admin`, `participant`) | Pruebas de seguridad 401/403 en `backend/tests/auth.test.js` y `backend/tests/security.test.js` | CUMPLE |
| **Seguridad básica** | Validación de tipos MIME reales, control de tamaños (3MB), prevención traversal, exclusión de contraseñas de respuestas JSON, CORS restringido, cookies seguras | Suite de pruebas de seguridad y auditoría en `backend/tests/security.test.js` | CUMPLE |
| **OpenAPI del backend** | Especificación OpenAPI 3.1 formal documentando todos los endpoints operativos | Archivo `backend/openapi/openapi.json` servido en `/api/openapi.json` | CUMPLE |
| **Diagrama de estructura de BD** | Diagrama de entidades y relaciones NoSQL (colecciones, campos, tipos, índices, referencias y cardinalidades) | `docs/diagramas/DIAGRAMA_BD.md` (Mermaid) | CUMPLE |
| **Manual técnico (>= 8 páginas)** | Documento exhaustivo con arquitectura, BD, API, seguridad, instalación y código | Estructurado en `docs/manuales/` para renderizado tras integración final | EN DESARROLLO |
| **Manual de usuario** | Guía ilustrada con flujos paso a paso para visitante, participante y administrador | Estructurado en `docs/manuales/` con capturas reales | EN DESARROLLO |
| **Wireframes y mockups (Figma)** | Diseño UI completo (escritorio y móvil), paleta institucional, tipografía y componentes | Referencias y especificaciones en `docs/figma/` | EN DESARROLLO |
| **Tablero de asignación de responsables** | Matriz de gobernanza con tareas, trazabilidad a requisitos y frontera reservada para `morfemartin` | `docs/TABLERO.md` y GitHub commits | CUMPLE |
| **Repositorio GitHub con historial de ambos miembros** | Monorepo público `mmorfe-engineer/uvm-4.2-jgh-proyecto-final` con commits de `mmorfe-engineer` y PR preparado para `morfemartin` | Registro Git histórico verificable (HEAD `e3299d94`) | EN DESARROLLO (ESPERA PR) |
| **Demostración local reproducible** | Scripts de orquestación `npm run dev:db`, `npm run seed:admin`, `npm run dev` | Guía de ejecución local en README y verificación | CUMPLE |
| **Presentación académica (12 láminas)** | Diapositivas en PPTX/PDF estructuradas para la sustentación | Preparación en `docs/presentacion/` | EN DESARROLLO |
| **Video explicativo YouTube** | Guion técnico producido, marcas de tiempo, requisitos oficiales (5-15 min, 720p, rostros visibles de ambos miembros) | *Dependencia de grabación humana / enlace YouTube* | PENDIENTE (HUMANA) |
| **Archivo de entrega ZIP** | Empaquetado canónico `8263711_martin_morfe.zip` cumpliendo exclusiones y estructura | Script de empaquetado en `scripts/` | EN DESARROLLO |
