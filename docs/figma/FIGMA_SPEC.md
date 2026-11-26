# Especificación de Diseño en Figma — JGH Encuestas (E-Actividad 4.3)

**Universidad Valle del Momboy · Facultad de Ingeniería**  
**Escuela de Computación · Asignatura: FrontEndIVIVFI2026C**  
**Profesor:** Anggelo Huz  
**Proyecto Final:** Sistema de Encuestas Formativas y Vinculación Comunitaria — Cátedra Libre Dr. José Gregorio Hernández  
**Integrantes:**
- Martin Morfe.°. (C.I. 8.263.711) — `mmorfe-engineer` (Arquitectura Core & Lead)
- Martin Alejandro Morfe Carballo (C.I. 30.539.018) — `morfemartin` (Módulo de Participación & Búsqueda)

---

## 1. Enlace al Archivo Nativo de Figma y Estado Auténtico

> [!NOTE]
> **Enlace Canónico al Proyecto Figma:**  
> [https://www.figma.com/design/3mp1ds3Wm2zXYDxqEPeuBq](https://www.figma.com/design/3mp1ds3Wm2zXYDxqEPeuBq) (`UVM · JGH 4.3 — Sistema de Encuestas Formativas · UI Final`).  
>
> **Estado Técnico de Auditoría:**  
> - **Archivo Nativo:** Creado y accesible mediante URL verificada en Figma.  
> - **Insumos de Diseño:** 13 wireframes vectoriales SVG importables preparados con dimensiones exactas, identidad cromática canónica y tokens CSS en el paquete canónico `JGH43_FIGMA_PANTALLAS_IMPORTABLES.zip`.  
> - **Modo Prototipo Interactivo:** Pendiente de vinculación física de transiciones en el entorno SaaS de Figma (no se publican enlaces ficticios `/proto/`).  
> - **Importación de Capas al Canvas:** En espera de importación manual de capas debido a las restricciones de cuota y llamadas de la cuenta Starter en entornos automatizados. No se declara cumplimiento ficticio.

---

## 2. Inventario Canónico de Pantallas (13 Frames) y Resoluciones

El diseño cubre la totalidad de los flujos de la aplicación SPA, organizados en viewports estandarizados de Escritorio (1440 × 900), Tableta (768 × 1024) y Móvil (390 × 844), diferenciando con precisión la demostración pública del entorno full-stack local:

| Frame ID | Nombre del Frame | Viewport | Archivo Vectorial | Descripción y Componentes |
|---|---|---|---|---|
| **F01** | `Desktop — Inicio / Hero` | 1440 × 900 | `F01_desktop_inicio.svg` | Cabecera institucional con botón contextual «Información de la demo», Hero banner con retrato intarsia JGH original, bloque de la Cátedra y cadena formativa de 4 eslabones. |
| **F02** | `Desktop — Catálogo Encuestas` | 1440 × 900 | `F02_desktop_catalogo.svg` | Filtros temáticos por eje, buscador dinámico reactivo, tarjetas formativas con metadatos de objetivo y población destinataria. |
| **F03** | `Desktop — Detalle y Participación` | 1440 × 900 | `F03_desktop_detalle_participacion.svg` | Ficha técnica del instrumento, 7 ítems estructurados (selección simple y respuesta breve), nota contextual sobria y botón «Guardar Respuesta de Prueba». |
| **F04** | `Desktop — Contacto y Vinculación` | 1440 × 900 | `F04_desktop_contacto.svg` | Formulario multipart con los 5 campos requeridos (nombre, email, fecha, número de personas, eje temático), área de dropzone para anexos (PDF/PNG/JPG máx 3 MB). |
| **F05** | `Desktop — Autenticación Full-Stack` | 1440 × 900 | `F05_desktop_autenticacion_local.svg` | Diálogo modal operativo en entorno local (`npm run dev`) con pestañas Iniciar Sesión / Registro, campos protegidos y credenciales de prueba. |
| **F06** | `Desktop — Gestión de Encuestas` | 1440 × 900 | `F06_desktop_admin_encuestas.svg` | Panel administrativo protegido por rol `admin`, creador de instrumentos formativos, constructor de preguntas dinámicas y acciones de publicación. |
| **F07** | `Desktop — Contactos Administrativos` | 1440 × 900 | `F07_desktop_admin_contactos.svg` | Bandeja de entrada de solicitudes de vinculación comunitaria recibidas en MongoDB con enlace de descarga segura de adjuntos. |
| **F08** | `Desktop — Resultados Agregados` | 1440 × 900 | `F08_desktop_resultados.svg` | Pestaña de métricas formativas con cálculo de frecuencias ($n_i$) y porcentajes ($p_i\%$) sobre respuestas reales o estado inicial transparente. |
| **F09** | `Desktop — Información Demo Estática` | 1440 × 900 | `F09_desktop_demo_estatica.svg` | Diálogo sobrio de «Acceso a la plataforma» desplegado en GitHub Pages, informando que las consultas son de acceso libre sin solicitar contraseñas. |
| **F10** | `Mobile — Inicio` | 390 × 844 | `F10_mobile_inicio.svg` | Adaptación responsive vertical para smartphones, cabecera compacta, retrato intarsia proporcional y accesos directos táctiles. |
| **F11** | `Mobile — Catálogo de Consultas` | 390 × 844 | `F11_mobile_catalogo.svg` | Filtros horizontales adaptados a touch, buscador full-width y tarjetas en una sola columna. |
| **F12** | `Mobile — Contacto y Vinculación` | 390 × 844 | `F12_mobile_contacto.svg` | Formulario en columna única con inputs de alto contraste y selector táctil de archivos. |
| **F13** | `Tablet — Contacto y Vinculación` | 768 × 1024 | `F13_tablet_contacto.svg` | Vista intermedia para iPad/Tabletas con contenedor centrado balanceado y espaciados optimizados. |

---

## 3. Tokens de Diseño y Sistema de Variables

Todos los componentes de Figma y de la aplicación React implementan de forma rigurosa los tokens definidos en `frontend/src/styles/variables.css`:

### 3.1. Paleta Cromática Institucional

| Token Figma / CSS | Valor Hex | Rol Semántico en la Interfaz |
|---|---|---|
| `--color-primary` | `#103D45` | **Petróleo Institucional:** Cabecera, botones primarios, títulos H1, acentos estructurales. |
| `--color-primary-dark` | `#0A262B` | **Petróleo Profundo:** Fondos de alto contraste, estados hover de botones principales. |
| `--color-accent` | `#F0D39A` | **Dorado Acento:** Badges, bordes de enfoque, subrayados jerárquicos y avisos. |
| `--color-accent-hover` | `#E2BF7A` | Estado hover y active en componentes dorados. |
| `--color-bg-base` | `#F8F5EE` | **Fondo Marfil:** Canvas general de la aplicación, suave a la vista para lectura prolongada. |
| `--color-bg-panel` | `#FFFCF6` | **Panel Marfil Claro:** Fondo de tarjetas, paneles administrativos, modales y formularios. |
| `--color-text-main` | `#203236` | Texto principal de lectura, contraste WCAG AAA sobre fondos base y panel. |
| `--color-text-muted` | `#576B6F` | Textos secundarios, metadatos, fechas, notas contextuales y leyendas de ayuda. |
| `--color-border` | `#D8D2C5` | Delimitadores de bloques, divisores de tabla y bordes inactivos de inputs. |
| `--color-success` | `#1E6B4A` | Indicadores de consultas publicadas y confirmaciones de guardado. |
| `--color-danger` | `#8A2E29` | Errores de validación y alertas críticas (reservado estrictamente para fallos reales). |

### 3.2. Tipografía y Activos Oficiales

- **Títulos y Display:** `Cinzel`, con fallback canónico `Georgia, 'Times New Roman', serif`.
- **Interfaz y Controles:** `Plus Jakarta Sans`, con fallback canónico `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`.
- **Activos Gráficos Oficiales Preservados:**
  - `frontend/src/assets/uvm-logo.webp`: Logotipo institucional de la Universidad Valle del Momboy.
  - `frontend/src/assets/jgh-intarsia-768.webp`: Retrato original en intarsia contemporánea del Dr. José Gregorio Hernández (obra de Martin Morfe), sin recurrir a fotografías genéricas ni emojis.

---

## 4. Mapeo con Evidencias Reales en Código y Navegador

Los 13 frames especificados corresponden de manera directa con las capturas de navegador generadas en `docs/evidencias/` y `docs/evidencias/live_test/`:

| Frame ID | Pantalla | Captura Local (`docs/evidencias/`) | Captura en Vivo (`docs/evidencias/live_test/`) |
|---|---|---|---|
| **F01** | Desktop Inicio | `01_desktop_home.png` | `live_01_home.png` |
| **F02** | Desktop Catálogo | `02_desktop_surveys.png` | `live_02_surveys.png` / `live_03_filtered.png` |
| **F03** | Desktop Detalle / Participación | `03_desktop_survey_detail.png` | `live_04_detail.png` |
| **F04** | Desktop Formulario Contacto | `04_desktop_contact.png` | `live_07_contact.png` |
| **F05** | Desktop Auth Local Full-Stack | `06_desktop_auth_modal.png` | — (Modalidad B local) |
| **F06** | Desktop Admin Encuestas | `07_desktop_admin_dashboard.png` | — (Modalidad B local) |
| **F07** | Desktop Admin Contactos | `08_desktop_admin_contacts.png` | — (Modalidad B local) |
| **F08** | Desktop Resultados | `05_desktop_contact_success.png` (flujo) | `live_05_results.png` |
| **F09** | Desktop Info Demo Estática | — | `live_06_auth_modal.png` |
| **F10** | Mobile Inicio | `11_mobile_home.png` | — |
| **F11** | Mobile Catálogo | `12_mobile_surveys.png` | — |
| **F12** | Mobile Contacto | `13_mobile_contact.png` | — |
| **F13** | Tablet Contacto | `10_tablet_contact.png` | — |

---

## 5. Manifiesto de Integridad Criptográfica de Wireframes Vectoriales

Los 13 archivos vectoriales preparados para importación en Figma se encuentran documentados con sus huellas digitales SHA-256 en el archivo `MANIFIESTO.json` del paquete `JGH43_FIGMA_PANTALLAS_IMPORTABLES.zip`:

| Archivo Vectorial | Tamaño | Checksum SHA-256 |
|---|---|---|
| `F01_desktop_inicio.svg` | 60.6 KB | `1791916b3c41444c5a30cdf484c3b34bd66aa494844fd0492affdc23ef7dec2a` |
| `F02_desktop_catalogo.svg` | 62.8 KB | `4a20908d538faeef56e07f3a986b6757e593f43a59ea221fdb5318b610ec5c22` |
| `F03_desktop_detalle_participacion.svg` | 60.1 KB | `a6d9ffeac10f86ae4e44eda970dfebad0a053e3473f8fd3641e520928d28091e` |
| `F04_desktop_contacto.svg` | 62.0 KB | `fd66ce77f1f614868b35ea29bf48a246353e5cec4b74c3f702016b79fd3133b2` |
| `F05_desktop_autenticacion_local.svg` | 58.8 KB | `3453b37dc129653604860defee824f9e3497e851584bffaf41caa564888c1a94` |
| `F06_desktop_admin_encuestas.svg` | 61.0 KB | `d738a9bcdafb9cba8be98b7c551cbdd432670a706b52c09607e3492a869c0762` |
| `F07_desktop_admin_contactos.svg` | 60.5 KB | `f200b758110870eccf3a97c74e41bb2a0d1a5e315cb7aa16b74f5479d3469464` |
| `F08_desktop_resultados.svg` | 60.2 KB | `3ca6441069b14c5d6bb8d80f9780bb4fa6085438dfcbe415a26f31933ce84336` |
| `F09_desktop_demo_estatica.svg` | 58.0 KB | `3b7d0c0113ed92831f9b2bed089cadbb81ba064be945228743474dab54f0957e` |
| `F10_mobile_inicio.svg` | 58.9 KB | `0d958a80c8a7ea897ab1656c0dadbabdfb78770a79bbc335bc0cfb3a850e9f50` |
| `F11_mobile_catalogo.svg` | 59.6 KB | `46e57a76c07ffc8c7b35ddb6b321ee762f19bc02153020f110b2f8862fd8af9f` |
| `F12_mobile_contacto.svg` | 59.1 KB | `8a5597ec3c43a31465604c346f959a7ae3ba76ae9b21774bdade603c5fd106ad` |
| `F13_tablet_contacto.svg` | 59.8 KB | `083ec2e943cff5d3046f2079db4a1ff4d19fcfc00739e52b68a817fed54d6119` |

