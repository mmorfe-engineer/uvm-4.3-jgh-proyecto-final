# MANUAL TÉCNICO DE ARQUITECTURA, DESARROLLO Y OPERACIONES
## Sistema de Encuestas Formativas — Cátedra Libre Dr. José Gregorio Hernández

**Institución:** Universidad Valle del Momboy (UVM)  
**Facultad:** Ingeniería  
**Asignatura:** FrontEndIVIVFI2026C — Taller Front End  
**Profesor:** Anggelo Huz  
**Actividad:** E-Actividad 4.3 — Proyecto Final (ENTREGA)  
**Fecha:** Noviembre de 2026  
**Versión Documental:** 1.0.0  

---

### Autores y Responsabilidad Técnica
- **Coordinador y Arquitectura Núcleo:** Martin Morfe.°.  
  - C.I.: 8.263.711 | GitHub: `mmorfe-engineer` | Correo: `morfefloresm@uvm.edu.ve`
- **Módulo de Participación y Descubrimiento:** Martin Alejandro Morfe Carballo  
  - C.I.: 30.539.018 | GitHub: `morfemartin` | Correo: `morfecarballoma@uvm.edu.ve`

---

## 1. Identificación Institucional y Contexto del Proyecto

El presente Manual Técnico describe la arquitectura de software, especificación de componentes, modelo de datos NoSQL, interfaces de programación de aplicaciones (API RESTful), protocolos de seguridad y procedimientos operativos del **Sistema de Encuestas Formativas de la Cátedra Libre Dr. José Gregorio Hernández**.

Desarrollado como proyecto final de la cátedra de Taller Front End en la Universidad Valle del Momboy, este sistema responde a los lineamientos pedagógicos y tecnológicos del pliego oficial de la E-Actividad 4.3. Proporciona una solución digital completa, escalable y mantenible para diseñar, publicar, explorar y responder encuestas académicas y comunitarias, garantizando una rigurosa separación de responsabilidades, seguridad por diseño y persistencia íntegra.

---

## 2. Objetivo y Alcance del Sistema

### 2.1. Objetivo General
Diseñar, implementar y validar una aplicación web full-stack con persistencia NoSQL en MongoDB, API en Node.js/Express y cliente SPA en React 19/Vite, capaz de gestionar instrumentos formativos y solicitudes de vinculación comunitaria bajo estándares de accesibilidad, seguridad y gobernanza colaborativa.

### 2.2. Alcance Funcional
- **Gestión de Instrumentos:** Creación de encuestas por administradores con preguntas de selección única y texto corto; control de ciclo de vida en estados `draft`, `published` y `closed`.
- **Publicación y Filtrado:** Consulta pública restringida exclusivamente a encuestas en estado `published`, categorizadas por ejes temáticos (Bioética, Valores Ciudadanos, Salud y Comunidad).
- **Formulario de Contacto Multipart:** Mecanismo público de recepción de solicitudes institucionales y comunitarias que integra los cinco tipos de datos normativos: correo electrónico (`email`), cantidad de participantes (`number`), fecha propuesta (`date`), tipo de solicitud (`radio`) y adjunto documental (`file`), además de validaciones de sanitización.
- **Autenticación y Autorización:** Control de sesiones mediante cookies seguras `HttpOnly` y diferenciación efectiva entre roles de `admin` y `participant`.
- **Interoperabilidad:** Documentación y entrega de contratos mediante OpenAPI 3.1.

---

## 3. Requisitos del Sistema y Entorno Operativo

### 3.1. Requisitos de Servidor y Desarrollo
- **Sistema Operativo:** Linux (Ubuntu 22.04 LTS o superior, verificado en Ubuntu 26.04 LTS x86_64), macOS 13+ o Windows 11 con WSL2.
- **Node.js:** Versión 18.0.0 LTS o superior (versión verificada en producción: `v26.1.0`).
- **Gestor de Paquetes:** npm `v9.0.0` o superior (verificado en `11.13.0`).
- **Motor de Base de Datos:** MongoDB Community Server v6.0 o superior (o el runner local integrado en `scripts/start-local-db.js` que utiliza MongoDB v7.0.24).
- **Herramientas Complementarias:** Git v2.40+, Chromium (para QA automatizado vía Playwright).

### 3.2. Requisitos de Cliente (Navegador)
- Google Chrome / Chromium v110 o superior.
- Mozilla Firefox v115 o superior.
- Apple Safari v16 o superior.
- Habilitación obligatoria de cookies de primera parte y JavaScript.

---

## 4. Arquitectura Full-Stack Monorepo

El sistema adopta el patrón arquitectónico de **Monorepo Desacoplado**, manteniendo en un único repositorio Git el frontend, backend, scripts de soporte y documentación formal.

```text
+-----------------------------------------------------------------+
|                    NAVEGADOR CLIENTE                            |
|  - React 19 SPA (JSX modular)                                   |
|  - CSS Semántico con variables de tema y animaciones            |
|  - Fetch API asíncrono con credentials: 'include'               |
|  - Gestión de vistas y estados reactivos                        |
+-----------------------------------------------------------------+
                                │
                    HTTP / JSON / Multipart
                    Cookies de sesión HttpOnly
                                ▼
+-----------------------------------------------------------------+
|                   SERVIDOR BACKEND EXPRESS                      |
|  - Helmet (Cabeceras de seguridad HTTP)                         |
|  - CORS con whitelist y soporte de credenciales                 |
|  - Middleware de Sesiones (connect-mongo + express-session)     |
|  - Control de Acceso RBAC (isAuthenticated, requireRole)        |
|  - Middleware Multer (Validación MIME sniffing y tamaño 3MB)    |
|  - Controladores REST: Auth, Surveys, Contact                   |
|  - Manejador centralizado de errores estandarizado              |
|  - Especificación OpenAPI 3.1 (/api/openapi.json)               |
+-----------------------------------------------------------------+
                                │
                         Mongoose ODM
                                ▼
+-----------------------------------------------------------------+
|                  BASE DE DATOS NOSQL MONGODB                    |
|  - Colección users (Índice único email, bcryptjs)               |
|  - Colección surveys (Índices por status y texto)               |
|  - Colección contactSubmissions (Índice temporal)               |
|  - Colección sessions (Almacenamiento de sesiones con TTL)      |
|  - Colección responses (Reservada para morfemartin)             |
+-----------------------------------------------------------------+
```

---

## 5. Estructura de Carpetas del Proyecto

```text
uvm-4.3-jgh-proyecto-final/
├── backend/
│   ├── src/
│   │   ├── config/             # Configuración de base de datos
│   │   │   └── db.js           # Conexión Mongoose a MongoDB
│   │   ├── controllers/        # Lógica de negocio y controladores
│   │   │   ├── authController.js
│   │   │   ├── surveyController.js
│   │   │   └── contactController.js
│   │   ├── middleware/         # Middlewares de interceptación
│   │   │   ├── auth.js         # Autenticación y RBAC
│   │   │   ├── upload.js       # Multer seguro con filtros MIME
│   │   │   └── errorHandler.js # Manejador uniforme de errores HTTP
│   │   ├── models/             # Esquemas de datos NoSQL
│   │   │   ├── User.js
│   │   │   ├── Survey.js
│   │   │   └── ContactSubmission.js
│   │   ├── routes/             # Definición de rutas API
│   │   │   ├── authRoutes.js
│   │   │   ├── surveyRoutes.js
│   │   │   ├── contactRoutes.js
│   │   │   └── healthRoutes.js
│   │   ├── app.js              # Configuración y ensamble de Express
│   │   └── server.js           # Punto de entrada HTTP y listener
│   ├── openapi/
│   │   └── openapi.json        # Especificación OpenAPI 3.1
│   ├── tests/                  # Suite automatizada (Node.js test runner)
│   │   ├── auth.test.js
│   │   ├── surveys.test.js
│   │   ├── contact.test.js
│   │   └── security.test.js
│   ├── uploads/                # Directorio protegido de adjuntos en disco
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/         # Componentes UI reutilizables
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   └── AuthModal.jsx
│   │   ├── pages/              # Vistas completas del sistema
│   │   │   ├── HomePage.jsx
│   │   │   ├── SurveysPage.jsx
│   │   │   ├── SurveyDetailPage.jsx
│   │   │   ├── ContactPage.jsx
│   │   │   └── AdminDashboardPage.jsx
│   │   ├── services/
│   │   │   └── api.js          # Cliente HTTP unificado con Fetch
│   │   ├── styles/             # Hojas de estilo CSS puro
│   │   │   ├── variables.css   # Tokens de color, tipografía y sombras
│   │   │   ├── base.css        # Reseteo y estilos globales
│   │   │   ├── animations.css  # Keyframes y transiciones
│   │   │   └── components.css  # Clases visuales de componentes
│   │   ├── App.jsx             # Enrutador reactivo y estado de sesión
│   │   └── main.jsx            # Entrada DOM de React 19
│   ├── tests/
│   │   └── build.test.js       # Validación de empaquetado de producción
│   ├── index.html
│   ├── vite.config.js          # Configuración Vite con proxy /api -> :5000
│   └── package.json
├── docs/
│   ├── PLIEGO.md               # Pliego académico oficial transcrito
│   ├── CUMPLIMIENTO.md         # Matriz de verificación normativa
│   ├── TABLERO.md              # Tablero de responsabilidades y tareas
│   ├── HANDOFF_MORFEMARTIN.md  # Contrato técnico para el segundo integrante
│   ├── arquitectura/
│   │   └── ARQUITECTURA.md     # Documentación técnica de arquitectura
│   ├── diagramas/
│   │   └── DIAGRAMA_BD.md      # Diagrama ER NoSQL en Mermaid
│   ├── manuales/               # Manual Técnico y Manual de Usuario
│   └── evidencias/             # Capturas de pantalla reales (Desktop/Tablet/Mobile)
├── scripts/
│   ├── start-local-db.js       # Motor standalone persistente de MongoDB
│   ├── seed-admin.js           # Inicializador de credenciales demo
│   └── run-qa-browser.js       # Automatización end-to-end con Chromium
├── .env.example
├── .gitignore
├── package.json                # Orquestador del monorepo
└── README.md
```

---

## 6. Variables de Entorno y Configuración

El archivo `.env.example` ubicado en la raíz del repositorio define los parámetros requeridos para la ejecución:

| Variable | Descripción | Valor por Defecto Local |
|---|---|---|
| `NODE_ENV` | Entorno de ejecución (`development`, `test`, `production`) | `development` |
| `PORT` | Puerto de escucha del servidor backend Express | `5000` |
| `FRONTEND_PORT` | Puerto de servicio del cliente frontend Vite | `3000` |
| `MONGO_URI` | Cadena de conexión estándar para el motor MongoDB | `mongodb://127.0.0.1:27017/jgh_encuestas_dev` |
| `SESSION_SECRET` | Clave criptográfica para firma de cookies de sesión | *(cadena aleatoria de 32+ caracteres)* |
| `CLIENT_ORIGIN` | Origen autorizado para peticiones CORS con credenciales | `http://localhost:3000` |
| `UPLOAD_DIR` | Directorio relativo o absoluto para adjuntos multipart | `./uploads` |
| `MAX_FILE_SIZE_MB` | Límite máximo de tamaño para archivos subidos | `3` |

---

## 7. Modelo de Datos NoSQL y Relaciones

El modelado documental en MongoDB se estructura a través de Mongoose ODM, balanceando integridad relacional mediante referencias y alto rendimiento mediante esquemas embebidos.

### 7.1. Colección `users`
Almacena la identidad de administradores y participantes:
- `_id`: ObjectId autogenerado (Clave Primaria).
- `name`: String, requerido, longitud máxima 100 caracteres.
- `email`: String, requerido, único, normalizado a minúsculas y validado por expresión regular.
- `passwordHash`: String, requerido, factor de coste bcrypt 10. Configurado con `select: false` para que nunca se retorne en consultas JSON ordinarias.
- `role`: String enum (`admin`, `participant`), valor por defecto `participant`.
- `createdAt` / `updatedAt`: Timestamps automáticos.

### 7.2. Colección `surveys`
Almacena los instrumentos formativos:
- `_id`: ObjectId autogenerado.
- `title`: String, requerido, máximo 200 caracteres.
- `description`: String descriptivo del propósito académico.
- `topic`: String enum/texto (p. ej. "Bioética y Salud", "Valores Ciudadanos").
- `status`: String enum (`draft`, `published`, `closed`), por defecto `draft`.
- `questions`: Array de subdocumentos embebidos:
  - `id`: String identificador único de pregunta.
  - `text`: String de redacción de la pregunta.
  - `type`: String enum (`single_choice`, `short_text`).
  - `required`: Boolean indicando obligatoriedad.
  - `options`: Array de strings para opciones de selección única.
- `createdBy`: ObjectId con referencia (`ref: 'User'`) al administrador creador.
- `publishedAt`: Date con fecha de publicación efectiva.
- **Índices:** `{ status: 1, createdAt: -1 }` y `{ title: "text", topic: "text" }`.

### 7.3. Colección `contactSubmissions`
Almacena solicitudes comunitarias y metadatos de archivos adjuntos:
- `name`: String, nombre completo del solicitante.
- `email`: String, correo validado.
- `phone`: String, teléfono de contacto.
- `proposedDate`: Date, fecha sugerida para la actividad.
- `estimatedParticipants`: Number, entero entre 1 y 5000.
- `requestType`: String enum (`academica`, `comunitaria`, `institucional`).
- `message`: String, justificación de hasta 2000 caracteres.
- `attachmentMetadata`: Subdocumento con `originalName`, `filename`, `mimeType`, `sizeBytes` y `storagePath`.

---

## 8. Catálogo Completo de la API RESTful

Todas las rutas operan bajo el prefijo `/api` y responden en formato estándar `application/json`:

```text
POST   /api/auth/register                   Registrar participante
POST   /api/auth/login                      Iniciar sesión (emite connect.sid)
POST   /api/auth/logout                     Cerrar sesión e invalidar cookie
GET    /api/auth/me                         Consultar sesión activa

GET    /api/surveys                         Listar encuestas publicadas
GET    /api/surveys/:id                     Detalle de encuesta
POST   /api/surveys                         Crear encuesta en borrador (Admin)
PATCH  /api/surveys/:id                     Publicar o cerrar encuesta (Admin)

POST   /api/contact                         Enviar formulario multipart con adjunto
GET    /api/contact/admin                   Listar contactos recibidos (Admin)
GET    /api/contact/admin/:id/attachment    Descargar archivo adjunto (Admin)

GET    /api/health                          Estado de salud del API y MongoDB
GET    /api/openapi.json                    Especificación OpenAPI 3.1
```

---

## 9. Seguridad y Control de Acceso (RBAC)

1. **Gestión de Sesiones Seguras:**
   - Se utiliza `express-session` con almacén persistente en MongoDB (`connect-mongo`).
   - La cookie `connect.sid` incorpora las banderas `HttpOnly: true` (inmune a robo por XSS), `SameSite: 'lax'` y `maxAge` de 7 días.
   - Las contraseñas se cifran mediante `bcryptjs` con 10 rondas de salt antes de ser guardadas.
2. **Defensa en Profundidad (RBAC):**
   - El endpoint de registro público `/api/auth/register` fuerza incondicionalmente el rol `participant`, previniendo inyección de privilegios.
   - La cuenta de administrador se genera únicamente mediante un procedimiento local controlado (`scripts/seed-admin.js`).
   - Las rutas de creación, edición y consulta de contactos imponen el middleware `requireRole('admin')`, retornando `403 Forbidden` ante cualquier rol no autorizado.
3. **Carga Segura de Archivos:**
   - La carga multipart (`multer`) valida simultáneamente la extensión y el tipo MIME real (`application/pdf`, `image/png`, `image/jpeg`).
   - Se impone un límite estricto de 3 MB por archivo.
   - El nombre en disco se genera como `${Date.now()}-${uuidv4()}${ext}`, eliminando cualquier vector de directory traversal.
   - La descarga administrativa verifica mediante `path.resolve()` que el archivo resida estrictamente dentro del directorio `backend/uploads`.

---

## 10. Frontend y Experiencia de Usuario (UX/UI)

El frontend está implementado en React 19 y Vite v6, priorizando una interfaz accesible, ligera y libre de librerías pesadas:
- **Diseño Responsive:** Adaptado y verificado en resoluciones de escritorio (1440x900), tableta (768x1024) y móvil (390x844).
- **Animaciones Web:** Transiciones de opacidad y desplazamiento (`@keyframes fadeIn`, `@keyframes slideDown`) gobernadas por variables CSS y compatibles con la directiva de accesibilidad `@media (prefers-reduced-motion: reduce)`.
- **Estados Asíncronos:** Indicadores visuales de carga (`spinner`) durante autenticación, peticiones de encuestas y subida de archivos multipart, complementados con alertas de confirmación animadas.
- **Validación en Cliente:** Retroalimentación inmediata en cada campo del formulario de contacto para evitar envíos vacíos o datos fuera de rango.

---

## 11. Procedimientos de Puesta en Marcha y Verificación

### 11.1. Inicialización en una Sola Terminal
1. Clonar el repositorio canónico:
   ```bash
   git clone https://github.com/mmorfe-engineer/uvm-4.3-jgh-proyecto-final.git
   cd uvm-4.3-jgh-proyecto-final
   ```
2. Instalar dependencias completas:
   ```bash
   npm install && npm --prefix backend install && npm --prefix frontend install
   ```
3. Iniciar el motor local persistente de base de datos:
   ```bash
   npm run dev:db
   ```
4. En otra terminal, sembrar las cuentas y encuestas de demostración:
   ```bash
   npm run seed:admin
   ```
5. Iniciar backend y frontend:
   ```bash
   npm run dev:backend
   npm run dev:frontend
   ```

### 11.2. Ejecución de la Suite de Pruebas
```bash
npm test
```
Ejecuta de manera combinada:
- 16 pruebas unitarias y de integración de backend con base de datos en memoria aislada (`node --test tests/*.test.js`).
- 1 prueba de empaquetado y validación de assets en el frontend.

---

## 12. Trazabilidad de Requisitos y Resolución de Problemas

| Incidencia / Síntoma | Diagnóstico Probable | Acción Correctiva |
|---|---|---|
| `MongoServerSelectionError: connect ECONNREFUSED` | El motor de MongoDB no está ejecutándose en el puerto 27017 | Ejecutar `npm run dev:db` en una terminal separada antes de iniciar el backend |
| `401 Unauthorized` al intentar crear una encuesta | La sesión actual ha expirado o el usuario es un visitante | Iniciar sesión desde el modal superior con las credenciales de administrador |
| `403 Forbidden` al acceder a contactos administrativos | El usuario autenticado posee rol `participant` | Cerrar sesión e ingresar con `admin@uvm.edu.ve` |
| `LIMIT_FILE_SIZE` al enviar contacto | El archivo adjunto supera los 3 MB autorizados | Seleccionar un documento PDF o imagen de menor resolución |
| `INVALID_FILE_TYPE` al subir adjunto | Se intentó subir un formato ejecutable o no autorizado | Suministrar únicamente archivos con extensión `.pdf`, `.png` o `.jpeg` |

---

## 13. Gobernanza y Reserva Técnica de Integración

En estricta observancia de las reglas de autoría del pliego y del Prompt Maestro canónico, el presente repositorio mantiene congelada la contribución del núcleo bajo el commit de `MARTIN MORFE FLORES` y reserva para **Martin Alejandro Morfe Carballo (`morfemartin`)** el desarrollo del **Módulo de Participación y Descubrimiento** (Modelo `Response`, endpoints de respuestas con restricción única y buscador dinámico de encuestas), documentado en detalle en [`docs/HANDOFF_MORFEMARTIN.md`](file:///home/bitcoinpapa/projects/uvm-4.3-jgh-proyecto-final/docs/HANDOFF_MORFEMARTIN.md).
