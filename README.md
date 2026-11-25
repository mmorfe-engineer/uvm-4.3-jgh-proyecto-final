# JGH Encuestas · Sistema de Encuestas Formativas
### Cátedra Libre Dr. José Gregorio Hernández · Universidad Valle del Momboy

[![Academic Evaluation](https://img.shields.io/badge/UVM-FrontEndIVIVFI2026C-103D45?style=flat-square)](https://virtual.uvm.edu.ve)
[![Assignment](https://img.shields.io/badge/E--Actividad-4.3_Proyecto_Final-B88930?style=flat-square)](docs/PLIEGO.md)
[![Node.js](https://img.shields.io/badge/Node.js-v26.1.0-339933?style=flat-square&logo=nodedotjs)](https://nodejs.org)
[![React](https://img.shields.io/badge/React-19.0.0-61DAFB?style=flat-square&logo=react)](https://react.dev)
[![MongoDB](https://img.shields.io/badge/MongoDB-NoSQL_Mongoose-47A248?style=flat-square&logo=mongodb)](https://www.mongodb.com)
[![Tests](https://img.shields.io/badge/Tests-17_Passing-success?style=flat-square)](backend/tests)
[![GitHub Pages](https://img.shields.io/badge/Demo_En_Vivo-GitHub_Pages-103D45?style=flat-square&logo=github)](https://mmorfe-engineer.github.io/uvm-4.3-jgh-proyecto-final/)
[![License](https://img.shields.io/badge/License-Academic-lightgrey?style=flat-square)](LICENSE)

> [!TIP]
> **Demostración en Línea (GitHub Pages):**  
> La interfaz institucional frontend está desplegada como prototipo estático demostrativo en:  
> 🌐 [**https://mmorfe-engineer.github.io/uvm-4.3-jgh-proyecto-final/**](https://mmorfe-engineer.github.io/uvm-4.3-jgh-proyecto-final/)  
> *(Nota de honestidad arquitectónica: GitHub Pages aloja el cliente estático. Para experimentar la persistencia en MongoDB y los endpoints REST en tiempo real, ejecute el entorno full-stack localmente).*

---

## 1. Identificación Académica y Autoría

- **Institución:** Universidad Valle del Momboy (UVM) — Facultad de Ingeniería.
- **Asignatura:** FrontEndIVIVFI2026C — Taller Front End.
- **Profesor:** Anggelo Huz.
- **Actividad:** E-Actividad 4.3 — Proyecto Final (ENTREGA) (Ponderación: 25 %).
- **Plataforma Académica:** [Virtual UVM Sección 5](https://virtual.uvm.edu.ve/virtual/course/view.php?id=2268#section-5).

### Integrantes del Proyecto
1. **Martin Morfe.°.**  
   - C.I.: 8.263.711  
   - GitHub: [`mmorfe-engineer`](https://github.com/mmorfe-engineer)  
   - Correo Institucional: `morfefloresm@uvm.edu.ve`  
   - *Rol:* Coordinación, Arquitectura Full-Stack, Backend Núcleo, Base de Datos NoSQL, Autenticación y Autorización, Formulario de Contacto Multipart, QA Base y Handoff.
2. **Martin Alejandro Morfe Carballo**  
   - C.I.: 30.539.018  
   - GitHub: [`morfemartin`](https://github.com/morfemartin)  
   - Correo Institucional: `morfecarballoma@uvm.edu.ve`  
   - *Rol:* Módulo de Participación y Descubrimiento de Encuestas (Modelo persistente `Response`, endpoints de respuestas, control de duplicados, interfaz reactiva para responder encuestas y buscador dinámico de encuestas).

---

## 2. Concepto y Objetivos del Producto

**JGH Encuestas** es una aplicación web full-stack monorepo concebida para diseñar, publicar, explorar y responder encuestas formativas vinculadas a los ideales de bioética, solidaridad activa y servicio comunitario promovidos por la **Cátedra Libre Dr. José Gregorio Hernández** de la Universidad Valle del Momboy.

El sistema resuelve la necesidad de recopilar percepciones ciudadanas y universitarias mediante una arquitectura robusta, segura y completamente verificable.

### Perfiles de Usuario
- **Visitante:** Explora las encuestas formativas publicadas, consulta sus detalles temáticos y puede enviar solicitudes de vinculación comunitaria a través del formulario de contacto.
- **Participante Registrado:** Inicia sesión con su cuenta institucional, consulta las encuestas vigentes y registra su participación formativa.
- **Administrador Académico:** Crea nuevos instrumentos en borrador, gestiona preguntas dinámicas (selección única y texto corto), publica o cierra encuestas, y consulta en un panel protegido las solicitudes de contacto y sus archivos adjuntos.

---

## 3. Arquitectura del Sistema

El proyecto está organizado como un **Monorepo Full-Stack** con separación estricta de responsabilidades:

```text
NAVEGADOR WEB (Cliente)
  │
  ├─ SPA React 19 + Vite (JavaScript, JSX, CSS propio sin frameworks externos)
  ├─ Diseño Responsive (Escritorio 1440x900, Tableta 768x1024, Móvil 390x844)
  └─ Fetch API asíncrona con gestión de cookies de sesión HttpOnly
          │
          │ HTTP / JSON / Multipart
          ▼
API RESTFUL EXPRESS (Servidor Node.js)
  │
  ├─ Middlewares de Seguridad (Helmet, CORS restringido, manejo centralizado de errores)
  ├─ Sesiones de Servidor con connect-mongo y cookies connect.sid (HttpOnly, SameSite)
  ├─ Autenticación (Bcryptjs cost 10) y Autorización basada en Roles (RBAC)
  ├─ Carga Segura de Archivos con Multer (MIME sniffing, límites 3MB, nombres UUID)
  └─ Especificación OpenAPI 3.1 servida dinámicamente en /api/openapi.json
          │
          │ Mongoose ODM
          ▼
BASE DE DATOS NOSQL (MongoDB)
  │
  ├─ users (Cuentas de usuario, hashes seguros, roles)
  ├─ surveys (Encuestas, preguntas embebidas, estados draft/published/closed)
  ├─ contactSubmissions (Mensajes y metadatos de archivos adjuntos validados)
  └─ responses (Entidad reservada para morfemartin: respuestas y unicidad)
```

---

## 4. Estructura de Directorios

```text
uvm-4.3-jgh-proyecto-final/
├── backend/
│   ├── src/
│   │   ├── config/             # Conexión Mongoose a MongoDB
│   │   ├── controllers/        # Controladores: Auth, Surveys, Contact
│   │   ├── middleware/         # Middlewares: Auth (RBAC), Multer upload, ErrorHandler
│   │   ├── models/             # Esquemas NoSQL: User, Survey, ContactSubmission
│   │   ├── routes/             # Enrutadores REST: auth, surveys, contact, health
│   │   ├── app.js              # Configuración de Express
│   │   └── server.js           # Arranque del servidor HTTP en puerto 5000
│   ├── openapi/
│   │   └── openapi.json        # Especificación formal OpenAPI 3.1
│   ├── tests/                  # Pruebas automatizadas (node:test + supertest)
│   ├── uploads/                # Directorio protegido de almacenamiento físico
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/         # Navbar, Footer, AuthModal
│   │   ├── pages/              # Home, Surveys, SurveyDetail, Contact, AdminDashboard
│   │   ├── services/           # Cliente HTTP api.js
│   │   ├── styles/             # Variables temáticas, animaciones, componentes
│   │   ├── App.jsx             # Componente raíz con ruteo funcional de vistas
│   │   └── main.jsx            # Punto de entrada Vite React
│   ├── tests/                  # Pruebas automatizadas de compilación
│   ├── vite.config.js          # Configuración Vite con proxy API en puerto 3000
│   └── package.json
├── docs/
│   ├── PLIEGO.md               # Transcripción del pliego oficial de la actividad
│   ├── CUMPLIMIENTO.md         # Matriz de trazabilidad normativa
│   ├── TABLERO.md              # Tablero de gobernanza y responsabilidades
│   ├── HANDOFF_MORFEMARTIN.md  # Contrato formal de transferencia técnica
│   ├── arquitectura/           # Documentación de arquitectura técnica
│   ├── diagramas/              # Diagrama de estructura NoSQL (Mermaid)
│   └── evidencias/             # Capturas reales de QA en Chromium
├── scripts/
│   ├── start-local-db.js       # Runner persistente de MongoDB local (puerto 27017)
│   ├── seed-admin.js           # Creación de administrador y encuestas demo
│   └── run-qa-browser.js       # Suite de automatización en navegador con Playwright
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

---

## 5. Requisitos y Ejecución Local

### Requisitos del Sistema
- **Node.js:** v18.0.0 o superior (verificado en v26.1.0 LTS).
- **npm:** v9.0.0 o superior (verificado en v11.13.0).
- **Navegador Web:** Chrome, Chromium, Firefox o Edge contemporáneo.

### Pasos de Instalación y Puesta en Marcha

1. **Clonar el repositorio canónico:**
   ```bash
   git clone https://github.com/mmorfe-engineer/uvm-4.3-jgh-proyecto-final.git
   cd uvm-4.3-jgh-proyecto-final
   ```

2. **Instalar dependencias de todo el monorepo:**
   ```bash
   npm install
   npm --prefix backend install
   npm --prefix frontend install
   ```

3. **Iniciar el motor persistente de MongoDB local:**
   ```bash
   npm run dev:db
   ```
   *(Este comando inicia un motor oficial standalone de MongoDB en el puerto `27017` con almacenamiento persistente en disco en `backend/data/db`, sin requerir Docker ni permisos de root).*

4. **Sembrar las credenciales y encuestas de demostración:**
   ```bash
   npm run seed:admin
   ```
   *Credenciales generadas:*
   - **Administrador:** `admin@uvm.edu.ve` | Contraseña: `Admin123!*`
   - **Participante:** `participante@uvm.edu.ve` | Contraseña: `Participante123!*`

5. **Iniciar el backend y frontend en modo desarrollo:**
   - En una terminal: `npm run dev:backend` (escuchando en `http://localhost:5000`)
   - En otra terminal: `npm run dev:frontend` (escuchando en `http://localhost:3000`)
   - O alternativamente con orquestador: `npm run dev`

---

## 6. Catálogo de la API RESTful (OpenAPI 3.1)

| Método | Endpoint | Acceso | Descripción |
|---|---|---|---|
| `GET` | `/api/health` | Público | Verificación de estado del servidor y MongoDB |
| `GET` | `/api/openapi.json` | Público | Especificación OpenAPI 3.1 descargable |
| `POST` | `/api/auth/register` | Público | Registro de participante con rol forzado `participant` |
| `POST` | `/api/auth/login` | Público | Inicio de sesión y emisión de cookie `HttpOnly` |
| `POST` | `/api/auth/logout` | Sesión | Cierre de sesión e invalidación en servidor |
| `GET` | `/api/auth/me` | Sesión | Datos de la sesión del usuario actual |
| `GET` | `/api/surveys` | Público / Sesión | Listado de encuestas visibles (filtro por estado para admin) |
| `GET` | `/api/surveys/:id` | Público / Sesión | Detalle de encuesta publicada (o borrador si es admin) |
| `POST` | `/api/surveys` | Admin | Creación de nueva encuesta en estado borrador |
| `PATCH` | `/api/surveys/:id` | Admin | Modificación o publicación de encuesta (valida preguntas) |
| `POST` | `/api/contact` | Público | Formulario multipart con 5 tipos de campos y subida de archivo |
| `GET` | `/api/contact/admin` | Admin | Listado protegido de solicitudes de contacto recibidas |
| `GET` | `/api/contact/admin/:id/attachment` | Admin | Descarga segura de archivo adjunto con prevención traversal |

---

## 7. Pruebas y Aseguramiento de Calidad (QA)

### Pruebas Automatizadas
Para ejecutar la suite completa de pruebas unitarias y de integración:
```bash
npm test
```
Resultados de la suite:
- **Backend (`node:test` + `supertest`):** 16 pruebas ejecutadas y aprobadas al 100%. Cubren registro, login, cookies de sesión, permisos RBAC, CRUD de encuestas, formulario de contacto multipart con subida de archivo y pruebas de seguridad negativas (prevención de escalado de privilegios, no exposición de contraseñas, rechazo de archivos ejecutables).
- **Frontend (`node:test`):** Verificación de compilación de producción Vite, integridad de HTML y bundles generados en `dist/`.

### Verificación en Navegador Real (Chromium / Playwright)
Se ejecutó una prueba automatizada end-to-end con Chromium grabando evidencias fotográficas en 3 viewports:
- **Escritorio (1440 × 900):** Home, Listado de Encuestas, Detalle, Formulario de Contacto, Confirmación de Persistencia, Login Modal, Panel de Administración y Bandeja de Contactos.
- **Tableta (768 × 1024):** Home adaptativo y Formulario de Contacto responsive.
- **Móvil (390 × 844):** Navegación compacta, Tarjetas móviles y Formulario adaptado.

Las capturas están disponibles en [`docs/evidencias/`](docs/evidencias/).

---

## 8. Frontera de Responsabilidad y Reserva Humana

Siguiendo estrictamente las directrices del pliego oficial y del prompt maestro operativo, se mantiene una clara división del trabajo:

- **Martin Morfe.°. (`mmorfe-engineer`):** Autor de la arquitectura base, configuración del monorepo, persistencia MongoDB, endpoints del núcleo, formulario de contacto multipart con validación, diseño CSS semántico, pruebas automatizadas y redacción del Handoff.
- **Martin Alejandro Morfe Carballo (`morfemartin`):** Responsable exclusivo del **Módulo de Participación y Descubrimiento de Encuestas** (Modelo `Response`, endpoints de respuesta, control de duplicados, interfaz para responder encuestas y buscador reactivo). Encontrará las especificaciones completas en [`docs/HANDOFF_MORFEMARTIN.md`](docs/HANDOFF_MORFEMARTIN.md).

---

## 9. Entregables Académicos de la E-Actividad 4.3

| Entregable | Formato | Ubicación en Repositorio | Descripción |
|---|---|---|---|
| **Manual Técnico** | PDF (11 págs) | [`docs/manuales/MANUAL_TECNICO.pdf`](docs/manuales/MANUAL_TECNICO.pdf) | Arquitectura, BD, OpenAPI 3.1, seguridad, despliegue y código fuente |
| **Manual de Usuario** | PDF (6 págs) | [`docs/manuales/MANUAL_USUARIO.pdf`](docs/manuales/MANUAL_USUARIO.pdf) | Guía ilustrada paso a paso para Visitante, Participante y Administrador |
| **Presentación Académica** | PPTX y PDF | [`docs/presentacion/PRESENTACION_JGH_4_3.pptx`](docs/presentacion/PRESENTACION_JGH_4_3.pptx) / [PDF](docs/presentacion/PRESENTACION_JGH_4_3.pdf) | 12 láminas institucionales para la defensa pública |
| **Diseño UI & Figma** | Markdown / Web | [`docs/figma/FIGMA_SPEC.md`](docs/figma/FIGMA_SPEC.md) | 12 frames canónicos, paleta institucional, tokens y enlace editable |
| **Guion Técnico de Video** | Markdown | [`docs/video/GUION_VIDEO.md`](docs/video/GUION_VIDEO.md) | Escapeta minuto a minuto (10-12 min), distribución de roles y pautas |
| **Diagrama NoSQL** | Mermaid | [`docs/diagramas/DIAGRAMA_BD.md`](docs/diagramas/DIAGRAMA_BD.md) | Entidades, atributos, cardinalidades y colecciones |
| **Empaquetado Oficial** | ZIP & Manifest | [`docs/entrega/ENTREGA_MANIFEST.md`](docs/entrega/ENTREGA_MANIFEST.md) | Generado con `npm run package:zip` (`8263711_martin_morfe.zip`) con SHA-256 |

