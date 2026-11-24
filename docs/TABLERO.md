# TABLERO DE ASIGNACIÓN DE RESPONSABILIDADES Y GOBERNANZA · JGH 4.3

**Proyecto:** JGH Encuestas — Sistema de Encuestas Formativas  
**Cátedra Libre Dr. José Gregorio Hernández · Universidad Valle del Momboy**  
**Integrantes:**  
1. **Martin Morfe.°.** (`MARTIN MORFE FLORES`, C.I. 8.263.711, GitHub: `mmorfe-engineer`, Correo: `morfefloresm@uvm.edu.ve`) — *Coordinador, Arquitectura, Backend & Frontend Principal*.  
2. **Martin Alejandro Morfe Carballo** (C.I. 30.539.018, GitHub: `morfemartin`, Correo: `morfecarballoma@uvm.edu.ve`) — *Módulo Reservado: Participación y Descubrimiento de Encuestas*.  

---

## 1. MATRIZ DE TAREAS Y SEGUIMIENTO OPERATIVO

| ID | Requisito asociado | Descripción | Responsable humano | Dependencias | Criterios de aceptación | Evidencia | Estado |
|---|---|---|---|---|---|---|---|
| **INT-01** | Entorno y Aislamiento | Verificación de herramientas, clonación de repo oficial, aislamiento de 4.2 y configuración de continuidad externa | Martin Morfe.°. | Ninguna | Repositorio clonado, git user correcto, repo 4.2 intacto | `git remote -v`, log de terminal | COMPLETADO |
| **INT-02** | Pliego y Gobernanza | Definición de documentos normativos, matriz de cumplimiento y tablero | Martin Morfe.°. | INT-01 | Documentos en `docs/` trazados con el pliego | `docs/PLIEGO.md`, `docs/CUMPLIMIENTO.md`, `docs/TABLERO.md` | COMPLETADO |
| **INT-03** | Arquitectura Full-Stack | Configuración de monorepo, backend Express, frontend Vite+React, scripts de inicio y base de datos persistente | Martin Morfe.°. | INT-01 | `package.json` raíz y paquetes funcionando, runner de base de datos operativo | Logs de arranque y scripts | EN DESARROLLO |
| **INT-04** | Base de Datos NoSQL | Modelos Mongoose para `User`, `Survey`, `ContactSubmission`, índices y validaciones de esquema | Martin Morfe.°. | INT-03 | Modelos conectados con tipos, restricciones y timestamps | `backend/src/models/` | EN DESARROLLO |
| **INT-05** | Autenticación y Autorización | Sistema de sesiones con cookie HttpOnly, hash bcrypt, roles `admin` y `participant`, middleware de autorización | Martin Morfe.°. | INT-04 | Endpoints `/api/auth/register`, `/login`, `/logout`, `/me` y protección 401/403 | Tests unitarios de auth | EN DESARROLLO |
| **INT-06** | Gestión de Encuestas (Admin) | Endpoints y lógica para crear encuestas (borrador), listar encuestas visibles y publicar/cerrar encuestas | Martin Morfe.°. | INT-05 | Solo administradores pueden crear/publicar; visitantes y participantes solo leen publicadas | Tests de endpoints de surveys | EN DESARROLLO |
| **INT-07** | Formulario de Contacto y Upload Seguro | Endpoint `/api/contact` multipart con 5 campos requeridos (email, number, date, radio, file), validación de tipo MIME real y almacenamiento seguro fuera del dir público | Martin Morfe.°. | INT-04 | Persistencia en BD, archivo en `uploads/`, validación de campos vacíos | Tests de upload y validación | EN DESARROLLO |
| **INT-08** | Especificación OpenAPI | Archivo OpenAPI 3.1 con todos los endpoints del núcleo operativo servido en `/api/openapi.json` | Martin Morfe.°. | INT-05, INT-06, INT-07 | Especificación validada y servida dinámicamente | `backend/openapi/openapi.json` | EN DESARROLLO |
| **INT-09** | Frontend: UI Base, Auth & Admin | Interfaz React con estilos propios, paleta institucional, navegación, vistas de login, registro y administración de encuestas | Martin Morfe.°. | INT-05, INT-06 | Interfaz responsive, navegación semántica, loaders y manejo de errores | Pantallas funcionales en navegador | EN DESARROLLO |
| **INT-10** | Frontend: Formulario de Contacto | Vista y componente de contacto con los 5 campos requeridos, validación reactiva, loader y confirmación visual | Martin Morfe.°. | INT-07, INT-09 | Formulario valida campos, envía multipart y muestra confirmación o error | Navegador y persistencia | EN DESARROLLO |
| **INT-11** | QA del Núcleo y Handoff | Pruebas integradas de API y navegador (Chromium) para el núcleo, congelamiento de HEAD y redacción de `HANDOFF_MORFEMARTIN.md` | Martin Morfe.°. | INT-01 a INT-10 | Pruebas pasando, núcleo publicado, handoff completo y sin implementar módulos reservados | Reporte QA y Handoff emitido | EN DESARROLLO |
| **INT-12** | **[RESERVADA]** Modelo Response y Persistencia | Creación de modelo persistente `Response` con referencia a Survey y Participant, restricción de unicidad | Martin Alejandro Morfe Carballo | INT-11 (Handoff) | Esquema Mongoose con índice único `{ surveyId: 1, participantId: 1 }` | `backend/src/models/Response.js` | PENDIENTE (RESERVADA) |
| **INT-13** | **[RESERVADA]** Endpoints de Respuestas | Implementación de `POST /api/surveys/:id/responses`, `GET /api/me/responses`, `GET /api/admin/surveys/:id/responses` con validación estricta | Martin Alejandro Morfe Carballo | INT-12 | Registro de respuesta, prevención de duplicados 409, autorización por rol | Tests unitarios de respuestas | PENDIENTE (RESERVADA) |
| **INT-14** | **[RESERVADA]** UI de Respuesta a Encuestas | Componente e interfaz para que el participante responda preguntas con selección única/texto, validación y feedback | Martin Alejandro Morfe Carballo | INT-13, INT-09 | Interacción fluida, validación de obligatoriedad, confirmación de respuesta | Capturas y pruebas e2e | PENDIENTE (RESERVADA) |
| **INT-15** | **[RESERVADA]** Buscador Dinámico | Buscador interactivo conectado a la API para filtrar encuestas por título y tópico con loaders y estados vacíos | Martin Alejandro Morfe Carballo | INT-06, INT-09 | Filtro en tiempo real con datos de BD, manejo de sin coincidencias | Capturas y pruebas de filtro | PENDIENTE (RESERVADA) |
| **INT-16** | **[RESERVADA]** PR e Integración de Respuestas | Creación de rama, commits auténticos bajo su identidad Git y PR hacia `main` en el repositorio canónico | Martin Alejandro Morfe Carballo | INT-12 a INT-15 | PR verificado, autoría auténtica, merge sin conflictos | Pull Request en GitHub | PENDIENTE (RESERVADA) |
| **INT-17** | QA Global End-to-End | Verificación integral en navegador (Chromium) de todo el ciclo: registro, creación, búsqueda, respuesta, contacto, persistencia | Ambos integrantes | INT-16 | Flujo completo de 25 pasos del pliego ejecutado sin fallas | Reporte QA E2E y capturas | PENDIENTE |
| **INT-18** | Manual Técnico (>= 8 páginas) | Elaboración del manual técnico exhaustivo en Markdown y renderizado a PDF con paginación formal | Martin Morfe.°. | INT-17 | PDF verificado con >= 8 páginas, diagramas, esquemas y código | `docs/manuales/MANUAL_TECNICO.pdf` | PENDIENTE |
| **INT-19** | Manual de Usuario | Elaboración del manual de usuario paso a paso con capturas reales del sistema | Ambos integrantes | INT-17 | PDF ilustrado cubriendo todos los perfiles de usuario | `docs/manuales/MANUAL_USUARIO.pdf` | PENDIENTE |
| **INT-20** | Diseño Figma, Wireframes & Mockups | Creación y organización de wireframes, mockups, sistema de diseño, colores y tipografía | Martin Morfe.°. | INT-17 | Archivo Figma nativo y exportaciones organizadas en `docs/figma/` | Enlace Figma público y assets | PENDIENTE |
| **INT-21** | Presentación Académica (12 láminas) | Diapositivas PPTX/PDF estructuradas para la sustentación del proyecto final | Ambos integrantes | INT-17 | Archivo PPTX y PDF con contenido real del producto | `docs/presentacion/` | PENDIENTE |
| **INT-22** | Video Explicativo YouTube | Guion técnico detallado, checklist y verificación de publicación del video oficial (5-15 min, >=720p, rostros visibles) | Ambos integrantes | INT-21 | URL de YouTube accesible públicamente | Video en YouTube | PENDIENTE |
| **INT-23** | Empaquetado Final ZIP | Verificación de integridad, exclusiones y generación de `8263711_martin_morfe.zip` | Martin Morfe.°. | INT-18 a INT-22 | ZIP íntegro con código, manuales, presentación y notas | Archivo ZIP validado | PENDIENTE |

---

## 2. ESTADO DE LAS COLUMNAS

- **Backlog:** INT-18, INT-19, INT-20, INT-21, INT-22, INT-23.
- **Preparado:** INT-12, INT-13, INT-14, INT-15, INT-16 (Módulo reservado para `morfemartin`, en espera de Handoff).
- **En desarrollo:** INT-03, INT-04, INT-05, INT-06, INT-07, INT-08, INT-09, INT-10, INT-11.
- **En revisión / QA:** Ninguna en este momento.
- **Completado:** INT-01, INT-02.
- **Bloqueado:** Ninguna.
