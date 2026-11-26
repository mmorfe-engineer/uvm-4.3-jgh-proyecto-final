# Manifiesto Oficial de Entrega Académica — E-Actividad 4.3

**Universidad Valle del Momboy · FrontEndIVIVFI2026C**  
**Proyecto Final:** Sistema de Encuestas Formativas — Cátedra Libre Dr. José Gregorio Hernández  
**Fecha de Generación:** 2026-11-26T13:19:31.683Z  
**Estudiante / Integrante 1:** Martin Morfe.°. (C.I. 8.263.711)  
**Estudiante / Integrante 2:** Martin Alejandro Morfe Carballo (C.I. 30.539.018)  

---

## 1. Datos del Archivo Entregable

| Parámetro | Valor |
|---|---|
| **Nombre de archivo** | `8263711_martin_morfe.zip` |
| **Tamaño en disco** | **5.09 MB** (5.335.971 bytes) |
| **Algoritmo de Integridad** | SHA-256 |
| **Checksum SHA-256** | `371d418c5db4c1725da23da764ecd111c9e414736d819f9ebfc5d225688584b2` |

---

## 2. Validación de Exclusiones

Se comprobó que el archivo empaquetado **NO** incluye:
- Dependencias pesadas (`node_modules/`)
- Historial interno git (`.git/`)
- Credenciales en texto plano (`.env`)
- Archivos de persistencia local temporal (`backend/data/`)
- Cargas de usuario temporales (`backend/uploads/*`)

---

## 3. Instrucciones de Despliegue y Evaluación

Para reproducir y evaluar el proyecto desde el archivo ZIP:
```bash
# 1. Descomprimir
unzip 8263711_martin_morfe.zip -d uvm-4.3-jgh/
cd uvm-4.3-jgh/

# 2. Instalar dependencias
npm run install:all

# 3. Iniciar entorno completo (BD local + Backend + Frontend)
npm run dev

# 4. Poblar datos iniciales (opcional si se desea resetear)
npm run seed

# 5. Ejecutar suite de pruebas automatizadas
npm test
```
