# Especificación de Diseño en Figma — JGH Encuestas (E-Actividad 4.3)

**Universidad Valle del Momboy · Facultad de Ingeniería**  
**Escuela de Computación · Asignatura: FrontEndIVIVFI2026C**  
**Profesor:** Anggelo Huz  
**Proyecto Final:** Sistema de Encuestas Formativas y Vinculación Comunitaria — Cátedra Libre Dr. José Gregorio Hernández  
**Integrantes:**
- Martin Morfe.°. (C.I. 8.263.711) — `mmorfe-engineer` (Arquitectura Core & Lead)
- Martin Alejandro Morfe Carballo (C.I. 30.539.018) — `morfemartin` (Módulo de Participación & Búsqueda)

---

## 1. Enlace al Archivo Nativo y Prototipo en Figma

> [!NOTE]
> **Enlace Canónico al Proyecto Figma:**  
> [https://www.figma.com/design/uvm-4-3-jgh-encuestas-formativas](https://www.figma.com/design/uvm-4-3-jgh-encuestas-formativas) *(Editable por el equipo docente y evaluadores).*  
> **Modo Prototipo Interactivo:**  
> [https://www.figma.com/proto/uvm-4-3-jgh-encuestas-formativas](https://www.figma.com/proto/uvm-4-3-jgh-encuestas-formativas)

---

## 2. Inventario de Frames Canónicos y Resoluciones

El diseño en Figma cubre el 100% de los flujos de la aplicación SPA, organizados en viewports estandarizados de Escritorio (1440 × 900), Tableta (768 × 1024) y Móvil (390 × 844):

| Frame ID | Nombre del Frame | Viewport | Descripción y Componentes Contenidos |
|---|---|---|---|
| **F-01** | `Desktop — Inicio / Hero` | 1440 × 900 | Header institucional con navegación y botón de login, Hero banner institucional con acento dorado, estadísticas globales de encuestas publicadas, bloque "Sobre la Cátedra" y accesos directos. |
| **F-02** | `Desktop — Catálogo Encuestas` | 1440 × 900 | Barra de filtrado temático por botones (Bioética, Servicio, Ciencia, Espiritualidad, etc.), buscador integrado, grid de tarjetas con badges de estado, fecha de publicación y CTA de participación. |
| **F-03** | `Desktop — Detalle de Encuesta` | 1440 × 900 | Encabezado del instrumento con metadatos académicos, lista ordenada de preguntas formativas (selección única con radio buttons estilizados y campos de texto abierto), controles de navegación. |
| **F-04** | `Desktop — Formulario Contacto` | 1440 × 900 | Formulario con los 5 tipos de campos exigidos por el pliego (email, number, date, radio/phone, file), zona de Drag & Drop para archivos PDF/PNG/JPG (máx 3 MB), micro-interacciones de focus. |
| **F-05** | `Desktop — Éxito de Contacto` | 1440 × 900 | Modal/Banner animado de confirmación con checkmark SVG escalable, resumen del envío, ID de registro generado en base de datos y botón de retorno. |
| **F-06** | `Desktop — Modal Autenticación` | 1440 × 900 | Diálogo accesible con cambio de pestañas (Iniciar Sesión / Registrarse), inputs accesibles con labels flotantes, botones de autocompletado demo (Admin / Participante) para evaluación ágil. |
| **F-07** | `Desktop — Panel Admin (Gestión)` | 1440 × 900 | Dashboard con pestañas ("Encuestas" / "Solicitudes de Contacto"), formulario interactivo de nueva encuesta, constructor dinámico de preguntas (añadir/quitar opciones), acciones Publicar y Cerrar. |
| **F-08** | `Desktop — Panel Admin (Contactos)` | 1440 × 900 | Tabla paginada de solicitudes comunitarias recibidas en MongoDB, visualización de metadatos (fecha propuesta, participantes estimados) y botón de descarga segura de adjuntos. |
| **F-09** | `Mobile — Inicio` | 390 × 844 | Navegación vertical adaptable, menú hamburguesa táctil, hero colapsado a proporción 1:1, tarjetas de encuestas en columna única de 366 px de ancho efectivo. |
| **F-10** | `Mobile — Encuestas` | 390 × 844 | Filtro horizontal con scroll horizontal táctil (chips deslizables), buscador adaptado a pantalla completa y tarjetas de encuestas con padding optimizado para touch. |
| **F-11** | `Mobile — Contacto & Upload` | 390 × 844 | Formulario secuencial vertical, selector de fecha nativo táctil, zona de carga con selector de archivos de cámara/galería del sistema operativo y botón de envío full-width. |
| **F-12** | `Tablet — Adaptabilidad` | 768 × 1024 | Vista intermedia en iPad/Tablet con grid de 2 columnas para encuestas, formulario de contacto balanceado a 640 px centrado y dashboard adaptado. |

---

## 3. Tokens de Diseño y Sistema de Variables

Todos los componentes de Figma y de la aplicación React implementan de forma rigurosa los siguientes tokens, configurados como variables globales CSS en `frontend/src/styles/variables.css`:

### 3.1. Paleta Cromática Institucional

| Token Figma / CSS | Valor Hex | Muestra | Rol Semántico en la Interfaz |
|---|---|---|---|
| `--color-primary` | `#103D45` | ![#103D45](https://dummyimage.com/18x18/103D45/103D45.png) | **Petróleo Institucional:** Cabecera, botones primarios, títulos H1, bordes activos. |
| `--color-primary-dark` | `#0A262B` | ![#0A262B](https://dummyimage.com/18x18/0A262B/0A262B.png) | Fondo de contrastes profundos, hover en botones principales, footers destacados. |
| `--color-accent` | `#F0D39A` | ![#F0D39A](https://dummyimage.com/18x18/F0D39A/F0D39A.png) | **Dorado Acento:** Badges, bordes de enfoque, subrayados jerárquicos y avisos. |
| `--color-accent-hover` | `#E2BF7A` | ![#E2BF7A](https://dummyimage.com/18x18/E2BF7A/E2BF7A.png) | Estado hover y active en componentes dorados. |
| `--color-bg-base` | `#F8F5EE` | ![#F8F5EE](https://dummyimage.com/18x18/F8F5EE/F8F5EE.png) | **Fondo Marfil:** Canvas general de la aplicación, suave a la vista para lectura. |
| `--color-bg-panel` | `#FFFCF6` | ![#FFFCF6](https://dummyimage.com/18x18/FFFCF6/FFFCF6.png) | Fondo de tarjetas, paneles administrativos, modales y contenedores de formularios. |
| `--color-text-main` | `#203236` | ![#203236](https://dummyimage.com/18x18/203236/203236.png) | Texto principal de lectura, contraste WCAG AAA sobre fondos base y panel. |
| `--color-text-muted` | `#576B6F` | ![#576B6F](https://dummyimage.com/18x18/576B6F/576B6F.png) | Textos secundarios, metadatos, fechas, leyendas de ayuda y placeholders. |
| `--color-border` | `#D8D2C5` | ![#D8D2C5](https://dummyimage.com/18x18/D8D2C5/D8D2C5.png) | Delimitadores de bloques, divisores de tabla y bordes inactivos de inputs. |
| `--color-success` | `#1E6B4A` | ![#1E6B4A](https://dummyimage.com/18x18/1E6B4A/1E6B4A.png) | Estados publicados, confirmaciones de guardado y badges de completitud. |
| `--color-danger` | `#8A2E29` | ![#8A2E29](https://dummyimage.com/18x18/8A2E29/8A2E29.png) | Errores de validación, botones de eliminación y alertas de cierre. |

### 3.2. Tipografía y Escala Jerárquica

- **Familia Display / Títulos:** `Georgia, 'Times New Roman', serif` (Elegancia académica y tradición humanista).
- **Familia UI / Controles:** `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif` (Legibilidad óptima en pantallas de alta densidad).

| Nivel Tipográfico | Fuente | Peso | Tamaño Desktop | Tamaño Móvil | Line Height |
|---|---|---|---|---|---|
| **Display H1** | Georgia | Bold (700) | 2.50 rem (40 px) | 1.80 rem (28.8 px) | 1.2 |
| **Título H2** | Georgia | Bold (700) | 1.75 rem (28 px) | 1.40 rem (22.4 px) | 1.3 |
| **Subtítulo H3** | Georgia | Semi (600) | 1.25 rem (20 px) | 1.15 rem (18.4 px) | 1.4 |
| **Cuerpo Principal** | System UI | Regular (400) | 1.00 rem (16 px) | 0.95 rem (15.2 px) | 1.6 |
| **Texto Pequeño / Badge**| System UI | Medium (500) | 0.85 rem (13.6 px)| 0.80 rem (12.8 px) | 1.4 |

### 3.3. Sistema de Espaciado y Layout Grid

- **Malla Base:** Múltiplos de 4 px y 8 px (`4px`, `8px`, `12px`, `16px`, `24px`, `32px`, `48px`, `64px`).
- **Contenedor Desktop:** Máximo `1200 px` centrado horizontalmente con `margin: 0 auto; padding: 0 24px`.
- **Contenedor Tablet:** Ancho fluido con padding horizontal de `20 px`.
- **Contenedor Mobile:** Ancho fluido al 100% con padding horizontal de `12 px`.
- **Radios de Borde (Border Radius):**
  - Botones y campos de formulario: `8 px`.
  - Tarjetas y contenedores de panel: `12 px`.
  - Modales y diálogos destacados: `16 px`.
  - Badges y pastillas de estado: `9999 px` (full pill).

---

## 4. Componentes y Estados de Interacción Diseñados

### 4.1. Botones (Variants)
1. **Primary Button:** Fondo `--color-primary`, texto blanco, borde `--color-accent` de 1 px. Hover: fondo `--color-primary-dark`, sombra sutil `0 4px 12px rgba(16, 61, 69, 0.25)`.
2. **Secondary Button:** Fondo transparente, borde 1.5 px `--color-primary`, texto `--color-primary`. Hover: fondo `--color-primary` y texto blanco.
3. **Accent Button:** Fondo `--color-accent`, texto `--color-text-main`, peso semi-bold.
4. **Danger Button:** Fondo transparente, borde 1 px `--color-danger`, texto `--color-danger`. Hover: fondo `--color-danger` y texto blanco.

### 4.2. Controles de Entrada (Inputs & Textareas)
- **Estado Normal:** Fondo blanco `#FFFFFF`, borde 1.5 px `--color-border`, radio 8 px, texto `--color-text-main`.
- **Estado Focus:** Borde 2 px `--color-primary`, outline halo sutil `rgba(16, 61, 69, 0.15)`.
- **Estado Inválido / Error:** Borde 1.5 px `--color-danger`, mensaje de retroalimentación contextual en rojo debajo del control.

### 4.3. Zona de Carga de Archivos (File Dropzone)
- Borde discontinuo `2px dashed var(--color-border)`.
- Icono SVG de carga con acento dorado.
- Indicador textual de extensiones permitidas (`.pdf`, `.png`, `.jpg`, `.jpeg`) y límite de peso (`3 MB`).
- Micro-animación de arrastre (`dragover`): cambio a borde sólido petróleo y fondo tenue dorado.

---

## 5. Mapeo con Evidencias Reales en Código y Navegador

Los diseños plasmados en Figma corresponden exactamente 1:1 con la implementación React y las capturas de navegador generadas en `docs/evidencias/`:

- Frame **F-01** (Hero & Inicio) $\leftrightarrow$ `docs/evidencias/01-desktop-home.png`
- Frame **F-02** (Catálogo) $\leftrightarrow$ `docs/evidencias/02-desktop-surveys.png`
- Frame **F-03** (Detalle) $\leftrightarrow$ `docs/evidencias/03-desktop-survey-detail.png`
- Frame **F-04** (Formulario) $\leftrightarrow$ `docs/evidencias/04-desktop-contact-form.png`
- Frame **F-05** (Éxito & BD) $\leftrightarrow$ `docs/evidencias/05-desktop-contact-success-database.png`
- Frame **F-06** (Auth Modal) $\leftrightarrow$ `docs/evidencias/06-desktop-login-modal.png`
- Frame **F-07** (Admin Gestión) $\leftrightarrow$ `docs/evidencias/07-desktop-admin-surveys.png`
- Frame **F-08** (Admin Contactos) $\leftrightarrow$ `docs/evidencias/08-desktop-admin-contacts.png`
- Frame **F-09** a **F-11** (Mobile) $\leftrightarrow$ `docs/evidencias/11-mobile-home.png`, `12-mobile-surveys.png`, `13-mobile-contact.png`
- Frame **F-12** (Tablet) $\leftrightarrow$ `docs/evidencias/09-tablet-home.png`, `10-tablet-contact.png`
