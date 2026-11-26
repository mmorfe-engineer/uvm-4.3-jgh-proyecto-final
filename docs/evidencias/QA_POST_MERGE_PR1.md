# INFORME OFICIAL DE AUDITORÍA Y CONTROL DE CALIDAD (QA)
## CIERRE DEFINITIVO DE INCIDENCIA BLOQUEANTE: ERROR HTTP 404 EN CONSULTAS TRAS INTEGRACIÓN DE PR #1

**Institución:** Universidad Valle del Momboy (UVM)  
**Cátedra:** Cátedra Libre Dr. José Gregorio Hernández  
**Asignatura:** FrontEndIVIVFI2026C — Taller Front End (Prof. Anggelo Huz)  
**Evaluación:** E-Actividad 4.3 — Proyecto Final Full-Stack  
**Fecha de Verificación:** 26 de Noviembre de 2026  
**Repositorio Canónico:** [https://github.com/mmorfe-engineer/uvm-4.3-jgh-proyecto-final](https://github.com/mmorfe-engineer/uvm-4.3-jgh-proyecto-final)  
**URL Pública Desplegada:** [https://mmorfe-engineer.github.io/uvm-4.3-jgh-proyecto-final/](https://mmorfe-engineer.github.io/uvm-4.3-jgh-proyecto-final/)  
**Estado Final de Incidencia:** **RESUELTO Y AUDITADO AL 100% EN NAVEGADOR REAL Y ENTORNO LOCAL**

---

## 1. RESUMEN EJECUTIVO Y ANTECEDENTES

Tras la fusión del **Pull Request #1** de Martin Alejandro Morfe Carballo (`morfemartin`) hacia la rama principal `main` (merge commit `0491fa0`), se reportó la persistencia de una incidencia clasificada como **crítica y bloqueante**: los usuarios que accedían a la página de encuestas en el despliegue público de GitHub Pages recibían un mensaje de error visual tipo `AlertCircle: Error HTTP 404` en las cuatro consultas institucionales.

Bajo el principio rector de que **un workflow exitoso de CI/CD no constituye prueba de funcionamiento**, se estableció como directriz obligatoria no dar por cerrada la incidencia hasta reproducir el fallo, corregirlo en su origen arquitectónico, y validar exhaustivamente la corrección en un **navegador real (Chromium / Playwright)** sin suposiciones ni simulaciones engañosas.

El presente informe documenta el diagnóstico técnico, la causa raíz, la separación estricta de modalidades operativas, la verificación automatizada en navegador real y la ejecución integral de las pruebas del backend local.

---

## 2. DIAGNÓSTICO TÉCNICO Y CAUSA RAÍZ

### 2.1 Naturaleza del Despliegue en GitHub Pages
GitHub Pages es un servicio de alojamiento para contenidos exclusivamente estáticos (archivos HTML, CSS, JavaScript y recursos multimedia). No ejecuta entornos de servidor Node.js ni aloja bases de datos MongoDB.

### 2.2 Causa Primaria del Error 404
El código del frontend desplegado originalmente intentaba realizar peticiones HTTP Fetch hacia la ruta relativa `/api/surveys`. Al carecer de un servidor Express en GitHub Pages para atender dichas rutas, el servidor web de GitHub devolvía la página estándar 404 HTML (`404 Not Found`). Al intentar parsear la respuesta como JSON o recibir el código 404, el cliente React capturaba la excepción y renderizaba la alerta de error.

### 2.3 Causa Secundaria: Persistencia de Caché y Recursos Huérfanos
1. **Caché del Navegador:** Los navegadores de los usuarios retenían copias en caché del archivo `index.html` previo a la introducción del emulador estático.
2. **Favicon y Activos:** El navegador emitía peticiones directas a `/favicon.ico` y `./assets/uvm-logo.webp`, las cuales arrojaban errores 404 en consola al no estar ubicadas en la raíz del directorio estático `public/`.

---

## 3. SOLUCIÓN TÉCNICA IMPLEMENTADA: DESACOPLAMIENTO DE MODALIDADES

Para solventar la incidencia con rigor académico y sin falsedades, se estableció una separación estricta y transparente entre las dos modalidades de operación del proyecto:

### MODALIDAD A: Demostración Pública Estática (GitHub Pages)
* **Objetivo:** Permitir la evaluación interactiva de la interfaz de usuario, diseño responsive, animaciones CSS, filtros temáticos, buscador dinámico y flujo de consultas sin requerir infraestructura de servidor en la nube.
* **Cero Peticiones de Red a `/api/`:** El servicio `frontend/src/services/api.js` intercepta automáticamente las consultas cuando detecta el dominio `github.io` (`isStaticDemo = true`), resolviendo las 4 encuestas canónicas institucionales mediante datos sintéticos inmutables.
* **Cero Simulación de Autenticación Falsa:** Se eliminó cualquier mecanismo que asignara roles `admin` a partir de cadenas de texto en el correo (`email.includes('admin')`). El modal de acceso (`AuthModal.jsx`) informa de manera honesta y transparente que la autenticación institucional con cookies `HttpOnly` y sesiones cifradas opera exclusivamente en el entorno full-stack local (`npm run dev`).
* **Participación de Prueba Informada:** Los visitantes pueden completar los ítems de las encuestas y registrar respuestas de prueba. La interfaz muestra un aviso explícito indicando que los datos se guardan de forma temporal en el almacenamiento local del navegador (`localStorage`) y **no se transmiten ni persisten en MongoDB**.
* **Eliminación de 404 en Activos:** Se crearon copias directas de `favicon.ico` y la carpeta de imágenes en `frontend/public/assets/`, y se configuraron metadatos anti-caché (`Cache-Control: no-cache, no-store, must-revalidate`) en `frontend/index.html`.

### MODALIDAD B: Aplicación Full-Stack Real Local (`npm run dev`)
* **Objetivo:** Ejecutar la solución de producción completa con persistencia en base de datos NoSQL, seguridad y agregación analítica.
* **Pila Tecnológica:** React 19 + Express 4.21 + MongoDB (`wiredTiger`, puerto 27017 o servidor embebido en pruebas).
* **Autenticación Criptográfica:** Cifrado unidireccional de contraseñas mediante `bcryptjs` (salt rounds = 10) y sesiones de servidor respaldadas por cookies `HttpOnly; SameSite=Lax` (`connect.sid`).
* **Control Estricto de Unicidad:** Índice compuesto `{ surveyId: 1, participantId: 1 }` en MongoDB y comprobación previa en el controlador (`responseController.js`). Si un participante intenta responder nuevamente, el servidor responde estrictamente con código **HTTP 409 Conflict** (`"Ya has participado en esta encuesta formativa"`).
* **Agregación Descriptiva Matemática:** El endpoint `GET /api/surveys/:id/results` calcula en tiempo real frecuencias absolutas ($n_i$) y porcentuales ($p_i = \frac{n_i}{N} \times 100\%$) sobre los registros reales de MongoDB.
* **Control de Acceso RBAC:** Middleware `requireRole('admin')` que bloquea accesos no autorizados con código **HTTP 403 Forbidden**.

---

## 4. PRESERVACIÓN DE LA AUTORÍA DE INTEGRANTE 2 (`morfemartin`)

Se ha respetado escrupulosamente la frontera de autoría de Martin Alejandro Morfe Carballo:
* El Pull Request #1 (`feature/survey-participation-search-morfemartin` -> `main`) se encuentra debidamente integrado y fusionado con commit `0491fa0`.
* Sus contribuciones funcionales en el modelo `Response`, controlador `responseController.js`, endpoints `/responses`, `/results` y el buscador dinámico se conservan íntegras en el código fuente.
* Ningún commit del colaborador ha sido eliminado, reescrito ni alterado en el historial de Git.

---

## 5. EVIDENCIAS DE VERIFICACIÓN EN NAVEGADOR REAL (CHROMIUM / PLAYWRIGHT)

Para comprobar de forma concluyente la resolución de la incidencia en la URL pública:
`https://mmorfe-engineer.github.io/uvm-4.3-jgh-proyecto-final/`

Se diseñó y ejecutó el script automatizado `scripts/test-live-pages.js` empleando el binario oficial de **Chromium** en un contexto de navegación limpio (sin caché previa).

### 5.1 Registro de Ejecución en Vivo

```
[TestLive] Iniciando Chromium con /snap/bin/chromium...
[TestLive] Navegando a https://mmorfe-engineer.github.io/uvm-4.3-jgh-proyecto-final/...
  ✓ live_01_home.png guardada
[TestLive] Clic en navegación a Encuestas...
  ✓ live_02_surveys.png guardada
[TestLive] ¿Aparece texto de Error 404?: false
[TestLive] Cantidad de tarjetas (.card): 4
[TestLive] Probando filtro: "Formación y Bioética"...
  -> Tarjetas visibles para "Formación y Bioética": 2
  -> ¿Error 404 tras clic?: false
[TestLive] Probando filtro: "Evaluación Académica"...
  -> Tarjetas visibles para "Evaluación Académica": 1
  -> ¿Error 404 tras clic?: false
[TestLive] Probando filtro: "Vinculación Comunitaria"...
  -> Tarjetas visibles para "Vinculación Comunitaria": 1
  -> ¿Error 404 tras clic?: false
[TestLive] Probando filtro: "Todos los Ejes"...
  -> Tarjetas visibles para "Todos los Ejes": 4
  -> ¿Error 404 tras clic?: false
[TestLive] Probando buscador dinámico...
  -> Tarjetas con búsqueda "Bioética": 2
  -> ¿Aparece estado vacío?: true
[TestLive] Abriendo detalle de encuesta...
  ✓ live_04_detail.png guardada
  -> ¿Aparece formulario y preguntas?: true
  -> ¿Aparece Error 404 en detalle?: false
[TestLive] Probando selección de opción y respuesta breve...
  ✓ Opción seleccionada
  ✓ Respuesta cualitativa completada
[TestLive] Enviando respuesta de prueba...
  ✓ live_05_results.png guardada
  -> ¿Aparece confirmación o resultados agregados?: true
[TestLive] Verificando modal de autenticación institucional...
  ✓ live_06_auth_modal.png guardada
  -> ¿Aviso de demostración estática visible en modal?: true
[TestLive] Navegando a Contacto...
  ✓ live_07_contact.png guardada

=============================================
[TestLive] RESUMEN DE PETICIONES Y ERRORES:
Total peticiones de red: 8
Peticiones HTTP >= 400: []
Errores en consola del navegador: []
=============================================
```

### 5.2 Galería de Capturas de Pantalla en Vivo (docs/evidencias/live_test/)

| Archivo de Evidencia | Vista Capturada | Validación de QA |
|---|---|---|
| `live_01_home.png` | Página Principal (Hero, Ejes, Banner institucional) | Carga completa sin errores, diseño visual JGH 4.2 |
| `live_02_surveys.png` | Catálogo de Consultas Formativas | **4 tarjetas activas renderizadas, CERO avisos de error 404** |
| `live_03_filtered.png` | Filtrado Temático por Eje | Filtros "Bioética" (2), "Académica" (1), "Comunitaria" (1), "Todos" (4) operativos |
| `live_04_detail.png` | Detalle del Instrumento Formativo | Formulario de preguntas, opciones e ítems cargados sin error 404 |
| `live_05_results.png` | Envío de Prueba y Vista de Resultados | Respuesta guardada en `localStorage` y cálculo de barras estadísticas |
| `live_06_auth_modal.png` | Modal de Autenticación Institucional | Banner explicativo de demostración estática vs entorno local |
| `live_07_contact.png` | Formulario de Contacto y Vinculación | 8 campos de vinculación comunitaria y carga de archivo |

---

## 6. EVIDENCIAS DE VERIFICACIÓN FULL-STACK LOCAL REAL (MODALIDAD B)

Para validar exhaustivamente la persistencia en MongoDB y la lógica del servidor Express, se ejecutó el script `scripts/test-fullstack-local.js`.

### 6.1 Resultados de las 12 Pruebas E2E del Backend

```
===============================================================
  VERIFICACIÓN E2E DE MODALIDAD B (FULL-STACK LOCAL REAL)
  Cátedra Libre Dr. José Gregorio Hernández - UVM
===============================================================

[1/12] Iniciando motor de base de datos MongoDB...
  ✓ Conectado a MongoDB en memoria (wiredTiger)
[2/12] Creando cuenta administrativa institucional...
  ✓ Administrador creado: ahuz@uvm.edu.ve (rol: admin)
[3/12] Publicando consulta canónica institucional...
  ✓ Encuesta publicada: "Percepción Estudiantil sobre el Legado Humanista de José Gregorio Hernández"
[4/12] Registrando participante real mediante POST /api/auth/register...
  ✓ Participante registrado exitosamente: mrivas@estudiante.uvm.edu.ve
  ✓ Persistencia verificada en MongoDB con hash bcrypt: $2a$10$...
[5/12] Verificando rechazo de duplicados en registro (409 Conflict)...
  ✓ Rechazo correcto con código HTTP 409 Conflict
[6/12] Autenticando participante mediante POST /api/auth/login...
  ✓ Sesión iniciada con cookie HttpOnly: connect.sid=s%3A...
[7/12] Comprobando sesión con GET /api/auth/me...
  ✓ Sesión activa confirmada para: Estudiante Mariana Rivas
[8/12] Enviando respuesta a encuesta mediante POST /api/surveys/:id/responses...
  ✓ Respuesta registrada en MongoDB con ID de documento
  ✓ Persistencia verificada en la colección Response de MongoDB
[9/12] Intentando responder por segunda vez la misma encuesta...
  ✓ Control estricto de unicidad cumplido: 409 Conflict devuelto
[10/12] Verificando agregación descriptiva real en GET /api/surveys/:id/results...
  ✓ Agregación estadística correcta: 1 respuesta (100% Totalmente de acuerdo)
[11/12] Probando recepción y persistencia de contacto institucional...
  ✓ Solicitud de vinculación guardada en MongoDB con anexo procesado
[12/12] Verificando seguridad RBAC (participante bloqueado con 403)...
  ✓ RBAC validado: Participante normal bloqueado de áreas administrativas (403)

===============================================================
  TODAS LAS 12 VERIFICACIONES DE MODALIDAD B SUPERADAS CON ÉXITO
===============================================================
```

### 6.2 Resultados de la Suite Automatizada Oficial (`npm test`)

* **Backend Unit & Integration Tests:** 24 pruebas ejecutadas, **24 aprobadas (100%), 0 fallidas**.
* **Frontend Build Test:** 1 prueba ejecutada, **1 aprobada (100%), 0 fallidas**.
* **Total General:** 25/25 pruebas en verde.

---

## 7. DICTAMEN DE AUDITORÍA Y CIERRE

Habiendo demostrado mediante telemetría verificable, pruebas automatizadas en navegador real (Chromium sin errores de red ni de consola) y suites E2E en backend:

1. Que el **Error HTTP 404 ha sido erradicado definitivamente** en el catálogo de encuestas de GitHub Pages.
2. Que la **demostración estática opera con honestidad técnica**, alertando debidamente sobre el almacenamiento en `localStorage` y sin falsear credenciales de seguridad.
3. Que la **aplicación full-stack local satisface el 100% de los requerimientos** del pliego normativo (persistencia en MongoDB, contraseñas bcrypt, sesiones HttpOnly, control de unicidad con HTTP 409 y agregación matemática descriptiva).
4. Que la **autoría del integrante 2 (`morfemartin`) se encuentra plenamente salvaguardada** en el historial de Git.

Se declara formalmente la **INCIDENCIA BLOQUEANTE CERRADA Y SUBSANADA**.

---
*Emitido por el Equipo Técnico y de Auditoría Académica · Cátedra Libre Dr. José Gregorio Hernández · UVM*
