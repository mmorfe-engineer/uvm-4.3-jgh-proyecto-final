# MANUAL DE USUARIO
## Sistema de Encuestas Formativas — Cátedra Libre Dr. José Gregorio Hernández

**Institución:** Universidad Valle del Momboy (UVM)  
**Facultad:** Ingeniería  
**Asignatura:** FrontEndIVIVFI2026C — Taller Front End  
**Profesor:** Anggelo Huz  
**Actividad:** E-Actividad 4.3 — Proyecto Final (ENTREGA)  
**Versión:** 1.0.0  

---

### Integrantes
- **Martin Morfe.°.** (C.I. 8.263.711) — `mmorfe-engineer`  
- **Martin Alejandro Morfe Carballo** (C.I. 30.539.018) — `morfemartin`  

---

## 1. Introducción al Sistema

El **Sistema de Encuestas Formativas de la Cátedra Libre Dr. José Gregorio Hernández** es una plataforma web desarrollada para facilitar el diálogo constructivo, la consulta académica y la vinculación con la comunidad sobre temas cruciales de bioética, salud integral y solidaridad activa.

El sistema contempla tres perfiles de interacción:
1. **Visitante:** Navegación libre por la plataforma, consulta de encuestas publicadas y envío de solicitudes a través del formulario de contacto.
2. **Participante Registrado:** Estudiante, docente o miembro comunitario que inicia sesión para responder encuestas y registrar su participación formativa.
3. **Administrador Académico:** Coordinador autorizado con credenciales para diseñar nuevos instrumentos, publicar o cerrar encuestas, y gestionar solicitudes de vinculación comunitaria.

---

## 2. Acceso y Puesta en Marcha Local

Para interactuar con la plataforma en su entorno local:
1. Abra su terminal y asegúrese de que el motor de base de datos y los servidores estén activos:
   ```bash
   npm run dev:db        # Terminal 1: Inicia MongoDB local persistente (puerto 27017)
   npm run seed:admin    # Terminal 2 (una sola vez): Crea las credenciales demo
   npm run dev           # Inicia backend (:5000) y frontend (:3000)
   ```
2. Abra su navegador web (Google Chrome o Mozilla Firefox) e ingrese a la dirección:
   **`http://localhost:3000`**

---

## 3. Navegación Principal y Página de Inicio (Home)

Al cargar la aplicación, el usuario es recibido con la identidad institucional de la Cátedra Libre Dr. José Gregorio Hernández:
- **Barra de Navegación Superior:** Proporciona accesos directos a *Inicio*, *Encuestas*, *Contacto*, el indicador de estado en vivo de la base de datos (punto verde) y el botón de *Iniciar Sesión*.
- **Banner Principal (Hero):** Presenta el propósito formativo del sistema y botones de acceso rápido para explorar encuestas o enviar una solicitud.
- **Ejes Formativos:** Resumen de las áreas de estudio (Bioética y Salud, Valores Ciudadanos, Formación UVM).
- **Métricas del Sistema:** Contador de encuestas activas, estado de persistencia NoSQL (MongoDB) y control de seguridad RBAC.

---

## 4. Consulta de Encuestas Formativas (Surveys)

Al pulsar sobre la opción **Encuestas** en la barra superior:
1. La aplicación realiza una petición asíncrona a la API (`GET /api/surveys`) para consultar las encuestas disponibles.
2. El usuario puede filtrar por área temática utilizando los botones de filtro rápido:
   - *Todos*
   - *Bioética y Salud*
   - *Valores Ciudadanos*
   - *Salud y Asistencia*
3. Cada tarjeta de encuesta muestra:
   - Título del instrumento formativo.
   - Etiqueta de temática y estado (Publicada).
   - Resumen del objetivo.
   - Cantidad de preguntas configuradas y fecha de publicación.
4. Para inspeccionar el contenido de una encuesta, haga clic en el botón **"Ver Contenido de la Encuesta"**.

---

## 5. Detalle de Encuesta y Participación

En la vista de detalle de la encuesta seleccionada:
- Se muestra la información exhaustiva: autoría, fecha, descripción y la lista completa de preguntas.
- **Tipos de Preguntas:**
  - *Selección Única:* Presenta las opciones disponibles para que el participante elija una alternativa.
  - *Texto Corto:* Campo abierto para comentarios o sugerencias formativas breves.
- **Módulo de Respuestas:** El registro interactivo de respuestas de los participantes se gestiona a través del módulo de participación (reserva técnica de `morfemartin`).

---

## 6. Formulario de Contacto y Solicitudes Formativas

El formulario de contacto permite coordinar talleres, conferencias o jornadas médicas con la Cátedra Libre. Cumple estrictamente con los 5 tipos de campos normativos:

### Pasos para Enviar una Solicitud:
1. Ingrese a la pestaña **Contacto**.
2. Complete los campos requeridos:
   - **Nombre Completo:** Identificación personal o de la institución solicitante.
   - **Correo Electrónico (email):** Dirección válida para recibir respuesta.
   - **Teléfono de Contacto (phone):** Número telefónico con código de área o país.
   - **Fecha Propuesta (date):** Seleccione en el calendario la fecha sugerida para la actividad.
   - **Participantes Estimados (number):** Indique un número entero de asistentes previstos (ej. 50).
   - **Tipo de Solicitud (radio button):** Seleccione entre *Cátedra / Conferencia Académica*, *Jornada Comunitaria / Asistencial* o *Alianza Institucional / Taller*.
   - **Adjunto Documental (file):** *(Opcional)* Haga clic en la zona de carga para adjuntar un aval institucional o documento justificativo en formato PDF, PNG o JPG (máximo 3 MB).
   - **Descripción Detallada (textarea):** Redacte los objetivos y requerimientos de la actividad.
3. Haga clic en **"Enviar Solicitud de Contacto"**.
4. La interfaz desplegará un spinner de carga mientras se valida la información y se almacena en MongoDB. Al finalizar, aparecerá un banner verde de confirmación con el identificador único (`submissionId`) asignado a su solicitud.

---

## 7. Autenticación de Usuarios (Registro y Login)

### Iniciar Sesión:
1. Haga clic en el botón **"Iniciar Sesión"** en la esquina superior derecha.
2. Ingrese su correo electrónico y contraseña.
3. *Atajo para evaluación académica:* El modal dispone de botones de autocompletado rápido:
   - **Autocompletar Admin:** Carga `admin@uvm.edu.ve` / `Admin123!*`.
   - **Autocompletar Participante:** Carga `participante@uvm.edu.ve` / `Participante123!*`.
4. Haga clic en **"Ingresar al Sistema"**. Al autenticarse, la barra superior mostrará su nombre y un badge con su rol (`admin` o `participant`).

### Registro de Nuevos Participantes:
1. En el modal de autenticación, pulse el enlace *"Regístrate aquí"*.
2. Ingrese su nombre completo, correo institucional y contraseña (mínimo 6 caracteres).
3. Al registrarse, se creará su cuenta con rol `participant` y se iniciará su sesión automáticamente.

---

## 8. Panel de Control Administrativo (Solo Administradores)

Cuando un usuario con rol `admin` inicia sesión, se habilita en el menú superior la opción **⚙️ Administración**.

### Funciones del Administrador:
1. **Listado de Encuestas:** Tabla con todas las encuestas creadas (borradores, publicadas y cerradas). El administrador puede:
   - *Publicar* una encuesta en borrador (el sistema valida automáticamente que contenga al menos una pregunta).
   - *Cerrar* una encuesta que haya concluido su periodo de consulta.
   - *Republicar* una encuesta cerrada.
2. **Crear Nueva Encuesta:**
   - Asigne título, área temática y descripción.
   - Añada preguntas interactivamente mediante el botón *➕ Agregar Pregunta*.
   - Configure el tipo de pregunta (`Selección Única` o `Texto Corto`), agregue opciones y marque la casilla de obligatoriedad.
   - Guarde la encuesta en estado borrador para su posterior revisión y publicación.
3. **Bandeja de Contactos y Solicitudes Recibidas:**
   - Visualice en tiempo real todas las solicitudes de contacto enviadas por los usuarios.
   - Consulte los detalles de participantes, fecha y mensaje.
   - Si la solicitud incluye un archivo adjunto, haga clic en el enlace `📎 NombreArchivo` para descargarlo de forma segura desde el almacenamiento protegido del servidor.

---

## 9. Cierre de Sesión

Para cerrar su sesión de forma segura:
1. Haga clic en el botón **"Salir"** ubicado junto a su nombre en la barra de navegación.
2. El servidor destruirá su sesión en MongoDB e invalidará la cookie HttpOnly en el navegador, retornándole a la vista pública.
