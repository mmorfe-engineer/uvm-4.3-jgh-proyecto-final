# Manifiesto Oficial de Entrega Académica — E-Actividad 4.3

**Universidad Valle del Momboy · FrontEndIVIVFI2026C**  
**Proyecto Final:** Sistema de Encuestas Formativas — Cátedra Libre Dr. José Gregorio Hernández  
**Fecha de Generación:** 2026-11-26T02:38:37.004Z  
**Estudiante / Integrante 1:** Martin Morfe.°. (C.I. 8.263.711)  
**Estudiante / Integrante 2:** Martin Alejandro Morfe Carballo (C.I. 30.539.018)  

---

## 1. Datos del Archivo Entregable

| Parámetro | Valor |
|---|---|
| **Nombre de archivo** | `8263711_martin_morfe.zip` |
| **Tamaño en disco** | **3.71 MB** (3.886.085 bytes) |
| **Algoritmo de Integridad** | SHA-256 |
| **Checksum SHA-256** | `f60577ac1854ad45d6b989f8ffb838aa2b2feedfc9e9a18cedda195c9f309d45` |

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
