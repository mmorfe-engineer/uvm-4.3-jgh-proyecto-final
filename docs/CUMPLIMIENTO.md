# MATRIZ DE CUMPLIMIENTO NORMATIVO · E-ACTIVIDAD 4.3

**Proyecto:** JGH Encuestas — Sistema de Encuestas Formativas y Vinculación Comunitaria  
**Cátedra Libre Dr. José Gregorio Hernández · Universidad Valle del Momboy**  
**Asignatura:** FrontEndIVIVFI2026C — Taller Front End  
**Profesor:** Anggelo Huz  
**Auditoría de Verdad Documental:** V2 Canónica (2026-11-24)

---

## CONVENCIONES DE ESTADO DE AUDITORÍA

Conforme a la Orden Rectora V2 (Sección 17), se descarta el uso acrítico de etiquetas prematuras. Cada componente se clasifica bajo una de las siguientes cinco categorías verificables:
- **`IMPLEMENTADO Y PROBADO`**: Componente desarrollado, integrado y validado con pruebas automatizadas o evidencias documentadas.
- **`IMPLEMENTADO SIN VERIFICACIÓN SUFICIENTE`**: Código existente pero dependiente de integración externa o validación de extremo a extremo.
- **`PENDIENTE`**: Tarea identificada y no iniciada.
- **`RESERVADO A SEGUNDO INTEGRANTE`**: Frontera arquitectónica asignada exclusivamente a la contribución humana de Martin Alejandro Morfe Carballo (`morfemartin`).
- **`DEPENDENCIA HUMANA EXTERNA`**: Entregables que requieren ejecución física o presencial externa (grabación audiovisual ante cámara o diagramado nativo interactivo en software SaaS de diseño).

---

## 1. REQUISITOS TÉCNICOS FUNCIONALES DEL PLIEGO

| Requisito oficial | Implementación técnica | Evidencia verificable | Estado de Auditoría |
|---|---|---|---|
| **Animaciones web** | CSS Transitions y Keyframes en tarjetas, feedbacks visuales, modal dialogs y transiciones de carga respetando `@media (prefers-reduced-motion)` | Estilos en `frontend/src/styles/animations.css`, capturas en `docs/evidencias/` | `IMPLEMENTADO Y PROBADO` |
| **Cambio dinámico de contenido mediante JS** | Renderizado reactivo con React 19 (JSX), componentes interactivos, navegación SPA dinámica (Inicio, Encuestas, Detalle, Contacto, Administración), filtros temáticos | Componentes en `frontend/src/pages/` y `frontend/src/components/`, capturas `01` a `13` en `docs/evidencias/` | `IMPLEMENTADO Y PROBADO` |
| **Consumo de información desde BD a través de API Express** | API RESTful en Express conectada a MongoDB mediante Mongoose; clientes asíncronos en frontend mediante Fetch API con propagación estricta de errores HTTP (sin fallbacks simulados encubiertos) | Endpoints `/api/surveys`, `/api/auth`, `/api/contact`, `/api/health`, 16 tests de integración pasando en `backend/tests/` | `IMPLEMENTADO Y PROBADO` |
| **Programación asíncrona** | Async/Await en controladores Node.js/Express, Mongoose ODM queries, Fetch API asíncrona en React con gestión de promesas y estado de red honesto | `backend/src/controllers/`, `frontend/src/services/api.js` | `IMPLEMENTADO Y PROBADO` |
| **UX/UI con loaders y transiciones** | Spinners de carga visual durante peticiones asíncronas en `ContactPage`, `SurveysPage`, `AuthModal` y `AdminDashboardPage`, con transiciones suaves | Componentes en `frontend/src/`, capturas fotográficas en `docs/evidencias/` | `IMPLEMENTADO Y PROBADO` |
| **Formulario de contacto con >= 5 campos de tipos requeridos** | Formulario con 8 campos tipados: texto (`name`), `email`, `tel` (`phone`), `date` (`proposedDate`), `number` (`estimatedParticipants`), `radio` (`requestType`), `file` (documento adjunto PDF/PNG/JPG máx 3MB con validación MIME real) y `textarea` (`message`) | `frontend/src/pages/ContactPage.jsx`, endpoint `POST /api/contact`, captura `05_desktop_contact_success.png`, suite `backend/tests/contact.test.js` | `IMPLEMENTADO Y PROBADO` |
| **Almacenamiento de datos suministrados por usuario** | Persistencia real en colecciones MongoDB (`users`, `surveys`, `contactsubmissions`) en almacenamiento persistente de disco (`backend/data/db`), verificada tras reinicio | Suite `backend/tests/contact.test.js`, base de datos persistente local | `IMPLEMENTADO Y PROBADO` |
| **Validación de información (evitando campos vacíos y no permitidos)** | Doble validación estricta: cliente en React + servidor en Express con sanitización y Multer fileFilter rechazando extensiones no permitidas (.exe, scripts) | Middleware en `backend/src/middleware/upload.js`, suite en `backend/tests/contact.test.js` | `IMPLEMENTADO Y PROBADO` |
| **Buscador que filtre datos de la aplicación** | Búsqueda dinámica reactiva con filtrado en tiempo real sobre los instrumentos de base de datos con debounce de 250ms, combinación con filtros temáticos y manejo de estados vacíos | `backend/src/controllers/surveyController.js`, `frontend/src/pages/SurveysPage.jsx`, endpoint `GET /api/surveys?search=...`, suite `backend/tests/responses.test.js` | `IMPLEMENTADO Y PROBADO` |
| **Página web 100 % funcional** | Integración del núcleo full-stack (Express + MongoDB + React 19 + Auth + Encuestas + Contacto + Participación interactiva + Prevención de duplicados con índice único + Resultados descriptivos + Buscador dinámico) | 24 tests de integración backend al 100% + compilación Vite frontend exitosa + 13 capturas en Chromium | `IMPLEMENTADO Y PROBADO` |

---

## 2. ENTREGABLES GENERALES Y ESPECÍFICOS

| Entregable | Implementación | Evidencia | Estado de Auditoría |
|---|---|---|---|
| **Base de datos NoSQL integrada** | MongoDB + Mongoose con colecciones estructuradas, esquemas formales, índices y tipos | Conexión activa verificable en `/api/health`, persistencia en `backend/data/db` | `IMPLEMENTADO Y PROBADO` |
| **Autenticación y autorización** | Sesiones HTTP con cookie `HttpOnly`, contraseñas hash con `bcryptjs`, middleware de control de acceso por roles (`admin`, `participant`) | Pruebas de seguridad 401/403 en `backend/tests/auth.test.js` y `backend/tests/security.test.js` | `IMPLEMENTADO Y PROBADO` |
| **Seguridad básica** | Validación de tipos MIME reales, control estricto de tamaños (3 MB), exclusión de hashes en JSON, CORS restringido, protección de escalada de roles | Suite de seguridad automatizada en `backend/tests/security.test.js` | `IMPLEMENTADO Y PROBADO` |
| **OpenAPI del backend** | Especificación formal OpenAPI 3.1 documentando todos los endpoints operativos, esquemas y códigos HTTP | Archivo `backend/src/docs/openapi.json` servido en `/api/openapi.json` | `IMPLEMENTADO Y PROBADO` |
| **Diagrama de estructura de BD** | Diagrama de entidades y relaciones NoSQL (colecciones, campos, tipos, índices y cardinalidades) | `docs/diagramas/DIAGRAMA_BD.md` (diagrama Mermaid validado) | `IMPLEMENTADO Y PROBADO` |
| **Manual técnico (>= 8 páginas)** | Documento exhaustivo con arquitectura, modelos NoSQL, API REST, seguridad, instalación y código de muestra | Renderizado formal de 11 páginas en `docs/manuales/MANUAL_TECNICO.pdf` | `IMPLEMENTADO Y PROBADO` |
| **Manual de usuario** | Guía ilustrada con flujos paso a paso para visitante, participante y administrador | Renderizado formal de 6 páginas con capturas en `docs/manuales/MANUAL_USUARIO.pdf` | `IMPLEMENTADO Y PROBADO` |
| **Wireframes y mockups (Figma)** | Especificación técnica formal en Markdown documentando los 12 frames canónicos (escritorio, tableta, móvil), componentes, tokens y paleta. El diseño nativo interactivo en la plataforma SaaS de Figma constituye una dependencia humana externa de los estudiantes. | `docs/figma/FIGMA_SPEC.md` | `DEPENDENCIA HUMANA EXTERNA` |
| **Tablero de asignación de responsables** | Matriz de gobernanza con división equitativa de tareas, trazabilidad y frontera reservada para `morfemartin` | `docs/TABLERO.md` y registro Git | `IMPLEMENTADO Y PROBADO` |
| **Repositorio GitHub con historial de ambos miembros** | Monorepo público `mmorfe-engineer/uvm-4.3-jgh-proyecto-final`. Commits auténticos de ambos integrantes (`mmorfe-engineer` y `morfemartin`), rama de contribución `feature/survey-participation-search-morfemartin`, PR #1 integrado y fusionado hacia `main`. | Pull Request #1 en GitHub (`https://github.com/mmorfe-engineer/uvm-4.3-jgh-proyecto-final/pull/1`), historial Git | `IMPLEMENTADO Y PROBADO` |
| **Demostración local reproducible** | Scripts de orquestación `npm run dev:db`, `npm run seed:admin`, `npm run dev`, `npm test` con dependencias locales sin requerir Docker ni root | Instrucciones paso a paso en `README.md` | `IMPLEMENTADO Y PROBADO` |
| **Presentación académica (12 láminas)** | Diapositivas en PPTX y PDF estructuradas para la sustentación académica | `docs/presentacion/PRESENTACION_JGH_4_3.pptx` y `.pdf` | `IMPLEMENTADO Y PROBADO` |
| **Video explicativo YouTube** | Guion técnico detallado con marcas de tiempo, locución y pautas obligatorias (5-15 min, 720p+, rostros visibles de ambos integrantes). La grabación física ante cámara y subida a YouTube constituye una dependencia humana externa de los estudiantes. | `docs/video/GUION_VIDEO.md` | `DEPENDENCIA HUMANA EXTERNA` |
| **Archivo de entrega ZIP** | Empaquetado canónico `8263711_martin_morfe.zip` cumpliendo exclusiones y estructura oficial | Script en `scripts/package-zip.js`, manifiesto SHA-256 en `docs/entrega/ENTREGA_MANIFEST.md` | `IMPLEMENTADO Y PROBADO` |

---

## 3. AUDITORÍA POST-MERGE Y CIERRE DE INCIDENCIAS CRÍTICAS

| Incidencia Auditada | Causa Raíz Identificada | Acción Correctiva y Verificación | Estado de Incidencia | Evidencias Documentadas |
|---|---|---|---|---|
| **Error HTTP 404 en Consultas tras Integración de PR #1** | Solicitud `fetch('/api/surveys')` en GitHub Pages donde no existe servidor Express ni runtime Node.js; retención de caché en clientes y recursos no versionados (`favicon.ico`, `uvm-logo.webp`). | Desacoplamiento de modalidades: emulador institucional canónico `handleStaticDemoRequest` en `frontend/src/services/api.js` (cero peticiones `/api/`), eliminación de simulación falsa de admin, almacenamiento de prueba transparente en `localStorage`, copia de activos a `public/`, meta tags anti-caché. Verificación con Chromium sin errores de red ni de consola. | `RESUELTO Y AUDITADO AL 100%` | Informe `docs/evidencias/QA_POST_MERGE_PR1.md`, capturas `live_01` a `live_07` en `docs/evidencias/live_test/`, script `scripts/test-live-pages.js` |
| **Verificación Integral Full-Stack Local (Modalidad B)** | Requerimiento de comprobar persistencia en MongoDB, contraseñas bcrypt, sesiones HttpOnly, control de unicidad con código 409 y agregación matemática real. | Implementación y ejecución del script de integración E2E `scripts/test-fullstack-local.js` (12/12 pruebas superadas) + suite automatizada `npm test` (24/24 backend + 1/1 frontend build = 25/25 pasando). | `IMPLEMENTADO Y PROBADO` | Suite `scripts/test-fullstack-local.js`, reporte `docs/evidencias/QA_POST_MERGE_PR1.md` |

