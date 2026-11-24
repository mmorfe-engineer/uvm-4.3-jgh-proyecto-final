# ARQUITECTURA DEL SISTEMA · JGH 4.3

**Proyecto:** JGH Encuestas — Sistema de Encuestas Formativas  
**Cátedra Libre Dr. José Gregorio Hernández · Universidad Valle del Momboy**  

---

## 1. VISIÓN GENERAL
El sistema está diseñado como un **Monorepo Full-Stack** con desacoplamiento estricto entre frontend y backend, comunicados mediante una API RESTful asíncrona sobre HTTP/JSON y cookies de sesión seguras.

```text
+-----------------------------------------------------------+
|                     NAVEGADOR WEB                         |
|   (SPA React 19 + Vite, UI Responsive, Paleta JGH, CSS)   |
+-----------------------------------------------------------+
                             |
                   Fetch API / HTTP Cookies
                             v
+-----------------------------------------------------------+
|                   BACKEND NODE.JS + EXPRESS               |
|  - Rate limiting & Helmet                                 |
|  - Middleware de Sesiones (express-session + MongoDB)     |
|  - Middleware de Autenticación & Control de Roles         |
|  - Sanitización & Validación de Esquemas                  |
|  - Middleware Multer (Archivos Multipart, validación MIME)|
|  - Controladores REST (/api/auth, /api/surveys, etc.)     |
|  - Especificación OpenAPI 3.1 (/api/openapi.json)         |
+-----------------------------------------------------------+
                             |
                       Mongoose ODM
                             v
+-----------------------------------------------------------+
|                    BASE DE DATOS NOSQL                    |
|             MongoDB Server (Colecciones, Índices)         |
|        - users                                            |
|        - surveys                                          |
|        - contactSubmissions                               |
|        - responses (Reservada para morfemartin)           |
+-----------------------------------------------------------+
```

---

## 2. SEGURIDAD Y CONTROL DE ACCESO
1. **Autenticación Basada en Sesión Segura:**
   - No se almacenan tokens JWT ni contraseñas en `localStorage` (mitigación de ataques XSS).
   - Se utiliza cookie `connect.sid` con flags `HttpOnly`, `SameSite=Lax`, y `Secure` condicional según entorno.
   - Las contraseñas se almacenan procesadas mediante `bcryptjs` con factor de coste (salt rounds) 10.
2. **Autorización Basada en Roles (RBAC):**
   - Perfil `participant`: puede consultar encuestas públicas, responder encuestas autorizadas (módulo reservado), ver sus participaciones y enviar mensajes de contacto.
   - Perfil `admin`: puede crear encuestas, editar encuestas en borrador, publicarlas, cerrarlas, consultar contactos recibidos y descargar adjuntos privados.
3. **Manejo Seguro de Archivos:**
   - Límite de tamaño: 3 MB.
   - Tipos autorizados: PDF (`application/pdf`), PNG (`image/png`), JPEG (`image/jpeg`).
   - Los archivos se almacenan fuera de la raíz pública con nombres generados mediante UUID / timestamp para prevenir directory traversal o ejecución de scripts maliciosos.
