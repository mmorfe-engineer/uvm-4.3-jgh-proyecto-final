# HANDOFF TÉCNICO · RESERVA MORFEMARTIN
## Módulo de Participación y Descubrimiento de Encuestas

**Proyecto:** JGH Encuestas — Sistema de Encuestas Formativas  
**Cátedra Libre Dr. José Gregorio Hernández · Universidad Valle del Momboy**  
**Fecha de Emisión:** 2026-11-24  
**Emisor:** Martin Morfe.°. (`MARTIN MORFE FLORES <morfefloresm@uvm.edu.ve>`)  
**Receptor:** Martin Alejandro Morfe Carballo (`Martin Alejandro Morfe Carballo <morfecarballoma@uvm.edu.ve>`)  

---

## 1. CONTROL DE REPOSITORIO Y ESTADO BASE

- **Repositorio Canónico:** `https://github.com/mmorfe-engineer/uvm-4.3-jgh-proyecto-final`
- **Rama Base:** `main`
- **HEAD Exacto Publicado:** `e3299d94995fb1455698b1a5774d736a53502e81`
- **Estado del Árbol:** Completamente limpio, pruebas aprobadas (16/16 backend, compilación frontend y QA en Chromium).
- **Identidad Git Autorizada Requerida:**
  ```bash
  git config user.name "Martin Alejandro Morfe Carballo"
  git config user.email "morfecarballoma@uvm.edu.ve"
  ```
- **Cuenta GitHub Autenticada:** `morfemartin`
- **Rama de Contribución Sugerida:**  
  `feature/survey-participation-search-morfemartin`

---

## 2. RESUMEN TÉCNICO DEL NÚCLEO DISPONIBLE

El núcleo arquitectónico full-stack se encuentra 100 % implementado y verificado:
1. **Base de Datos NoSQL (MongoDB):** Motor persistente configurado en `backend/src/config/db.js` y runner local en `scripts/start-local-db.js` persistiendo en `backend/data/db`. Modelos `User`, `Survey` y `ContactSubmission` operativos.
2. **Autenticación y Sesiones:** Sesiones seguras con `connect-mongo`, cookie `HttpOnly` `connect.sid`, passwords procesados con `bcryptjs`. Endpoints `/api/auth/register`, `/api/auth/login`, `/api/auth/logout`, `/api/auth/me`.
3. **Control de Acceso (RBAC):** Middleware `isAuthenticated` y `requireRole('admin')`.
4. **Gestión de Encuestas:** Creación en borrador, listado público de publicadas y publicación con validación de preguntas.
5. **Formulario de Contacto:** Endpoint multipart `/api/contact` con soporte de 5 campos (email, number, date, radio/phone, file), validación MIME y almacenamiento seguro en disco.
6. **Frontend React 19 + Vite:** UI responsive con paleta institucional, navegación semántica, loaders y panel de administración.

---

## 3. TAREAS Y MÓDULOS TÉCNICOS RESERVADOS

El segundo integrante (`morfemartin`) tiene bajo su responsabilidad exclusiva la implementación de los siguientes componentes sustantivos:

### 3.1. Modelo Persistente `Response` (Backend)
- **Ubicación:** `backend/src/models/Response.js`
- **Esquema:**
  ```javascript
  const responseSchema = new mongoose.Schema({
    surveyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Survey',
      required: true,
      index: true,
    },
    participantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    answers: [
      {
        questionId: { type: String, required: true },
        value: { type: mongoose.Schema.Types.Mixed, required: true },
      }
    ],
    submittedAt: {
      type: Date,
      default: Date.now,
    },
  }, { timestamps: true });

  // RESTRICCIÓN OBLIGATORIA DE UNICIDAD: Una sola respuesta por participante por encuesta
  responseSchema.index({ surveyId: 1, participantId: 1 }, { unique: true });
  ```

### 3.2. Endpoints de Respuestas y Controladores (Backend)
- **Ubicación sugerida:** `backend/src/controllers/responseController.js` y `backend/src/routes/responseRoutes.js`.
- **Rutas a implementar:**
  1. `POST /api/surveys/:id/responses`:
     - Acceso: Requiere sesión activa (`isAuthenticated`).
     - Validación: La encuesta debe existir y tener `status === 'published'`. No permitir responder a encuestas en borrador o cerradas.
     - Comprobar que no exista respuesta previa para la tupla `(surveyId, participantId)`. En caso de duplicado, responder con código HTTP `409 Conflict`.
     - Validar que las respuestas coincidan con las preguntas de la encuesta y que las preguntas marcadas como `required: true` contengan un valor válido.
     - Persistir en la colección `responses` y retornar `201 Created`.
  2. `GET /api/me/responses`:
     - Acceso: Requiere sesión activa (`isAuthenticated`).
     - Retorna el listado de encuestas que el usuario autenticado ha respondido.
  3. `GET /api/admin/surveys/:id/responses`:
     - Acceso: Solo administrador (`isAuthenticated`, `requireRole('admin')`).
     - Retorna el resumen o listado de respuestas registradas para la encuesta indicada.

### 3.3. Interfaz de Respuesta a Encuestas (Frontend)
- Componente para responder una encuesta activa:
  - Formulario interactivo que renderice los campos según el tipo de pregunta (`single_choice` con radio buttons o botones accesibles, y `short_text` con inputs).
  - Validación de obligatoriedad en cliente antes de enviar.
  - Loader de estado durante la petición asíncrona.
  - Mensaje de confirmación visual al registrar exitosamente la respuesta.
  - Detección de respuesta previa con deshabilitación o aviso explicativo.

### 3.4. Buscador Dinámico de Encuestas (Frontend & API)
- Barra de búsqueda conectada a la API (`GET /api/surveys?topic=...&search=...` o filtrado dinámico de datos de base de datos):
  - Filtrado en tiempo real por título y temática de encuesta.
  - Manejo de estados de carga, coincidencias encontradas y estado vacío ("No se encontraron encuestas que coincidan con la búsqueda").
  - Navegación accesible por teclado.

### 3.5. Pruebas Automatizadas del Módulo
- Crear `backend/tests/responses.test.js` con pruebas que cubran:
  - Registro exitoso de respuesta por un participante.
  - Rechazo con 409 ante intento de respuesta duplicada.
  - Rechazo con 401 si no hay sesión iniciada.
  - Rechazo si la encuesta está en estado `draft` o `closed`.
  - Consulta administrativa de respuestas.

### 3.6. Contrato de Agregación Descriptiva de Resultados (Backend & Frontend)
- **Endpoint:** `GET /api/surveys/:id/results`
  - Acceso: Público o Participante autenticado.
  - Comportamiento:
    - Agrega los documentos reales de la colección `responses` para la encuesta indicada.
    - Calcula frecuencias absolutas ($n_i$) y porcentajes relativos ($p_i = \frac{n_i}{N} \times 100$) calculados matemáticamente sobre respuestas persistidas en MongoDB.
    - En caso de $N = 0$ (sin respuestas registradas), debe retornar `{ totalResponses: 0, questions: [] }`.
- **Regla Estricta de Verdad Funcional (Prohibición de Simulación Encubierta):**
  - **PROHIBIDO** inventar porcentajes simulados, gráficos ficticios o barras prellenadas que sugieran datos irreales.
  - Si la encuesta tiene 0 respuestas, la interfaz debe mostrar un estado cero explícito y honesto:  
    *"Sin respuestas registradas aún en el sistema. Sea el primer participante en responder este instrumento formativo."*

---

## 4. ARCHIVOS PROTEGIDOS (NO ALTERAR SIN COORDINACIÓN)
- `backend/src/config/db.js`
- `backend/src/middleware/auth.js` (puede importarse libremente)
- `backend/src/middleware/upload.js`
- `scripts/start-local-db.js`
- `scripts/seed-admin.js`

---

## 5. PROCEDIMIENTO DE INTEGRACIÓN Y PULL REQUEST

1. **Configurar el entorno local del segundo integrante:**
   ```bash
   git checkout main
   git pull origin main
   git checkout -b feature/survey-participation-search-morfemartin
   ```
2. **Verificar la identidad Git antes de hacer commits:**
   ```bash
   git config user.name "Martin Alejandro Morfe Carballo"
   git config user.email "morfecarballoma@uvm.edu.ve"
   ```
3. **Desarrollar y probar los componentes reservados:**
   ```bash
   npm test
   ```
4. **Hacer commits auténticos y publicar la rama:**
   ```bash
   git add .
   git commit -m "feat(participation): implementar modelo Response, endpoints de respuesta y buscador dinámico"
   git push -u origin feature/survey-participation-search-morfemartin
   ```
5. **Crear Pull Request en GitHub:**
   - Origen: `feature/survey-participation-search-morfemartin`
   - Destino: `main`
   - Título: `feat: Módulo de Participación y Descubrimiento de Encuestas`
   - Incluir resumen técnico, pruebas ejecutadas y capturas de pantalla de la interfaz desarrollada.

---

## 6. CRITERIOS DE ACEPTACIÓN PARA LA INTEGRACIÓN FINAL
- Todas las pruebas de `backend/tests/` pasan al 100%.
- El participante puede responder encuestas publicadas y no puede responder dos veces la misma encuesta.
- El buscador dinámico filtra fluidamente sobre las encuestas provenientes de MongoDB.
- La identidad Git y autoría de los commits corresponde estrictamente a `Martin Alejandro Morfe Carballo <morfecarballoma@uvm.edu.ve>`.
