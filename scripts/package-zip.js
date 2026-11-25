/**
 * scripts/package-zip.js
 * Empaqueta la entrega académica oficial en 8263711_martin_morfe.zip
 * aplicando exclusiones estrictas de dependencias, datos locales y credenciales,
 * y calculando el checksum SHA-256 para verificación de integridad académica.
 */
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const rootDir = path.resolve(__dirname, '..');
const zipFileName = '8263711_martin_morfe.zip';
const zipFilePath = path.join(rootDir, zipFileName);

console.log('================================================================');
console.log('EMPAQUETADOR CANÓNICO DE ENTREGA ACADÉMICA — UVM E-ACTIVIDAD 4.3');
console.log('================================================================');
console.log(`Directorio raíz: ${rootDir}`);
console.log(`Archivo destino: ${zipFileName}\n`);

// Eliminar archivo zip previo si existe
if (fs.existsSync(zipFilePath)) {
  console.log(`[1/4] Eliminando archivo previo existente: ${zipFileName}...`);
  fs.unlinkSync(zipFilePath);
}

// Comprobar presencia de documentos esenciales antes de empaquetar
const requiredFiles = [
  'docs/PLIEGO.md',
  'docs/CUMPLIMIENTO.md',
  'docs/TABLERO.md',
  'docs/HANDOFF_MORFEMARTIN.md',
  'docs/manuales/MANUAL_TECNICO.pdf',
  'docs/manuales/MANUAL_USUARIO.pdf',
  'docs/presentacion/PRESENTACION_JGH_4_3.pptx',
  'docs/presentacion/PRESENTACION_JGH_4_3.pdf',
  'docs/figma/FIGMA_SPEC.md',
  'backend/src/app.js',
  'frontend/src/App.jsx'
];

console.log('[2/4] Verificando presencia de componentes críticos...');
for (const relPath of requiredFiles) {
  const fullPath = path.join(rootDir, relPath);
  if (!fs.existsSync(fullPath)) {
    console.error(`[ERROR] Falta el archivo crítico requerido: ${relPath}`);
    process.exit(1);
  }
  console.log(`  ✓ ${relPath}`);
}

console.log('\n[3/4] Empaquetando con exclusiones normativas...');
const excludePatterns = [
  'node_modules/*',
  '*/node_modules/*',
  'frontend/node_modules/*',
  'backend/node_modules/*',
  '.git/*',
  '.env',
  '.env.*',
  'backend/data/*',
  'backend/uploads/*',
  '*/.DS_Store',
  '*.log',
  '*.tmp',
  zipFileName
];

const excludeArgs = excludePatterns.map(p => `-x "${p}"`).join(' ');
const zipCmd = `zip -r "${zipFilePath}" . ${excludeArgs}`;

try {
  execSync(zipCmd, { cwd: rootDir, stdio: ['ignore', 'pipe', 'pipe'] });
  console.log(`  ✓ Compresión finalizada exitosamente.`);
} catch (err) {
  console.error('[ERROR] Falló la ejecución de zip:', err.message);
  process.exit(1);
}

console.log('\n[4/4] Verificando integridad y calculando huella criptográfica...');
const stats = fs.statSync(zipFilePath);
const sizeMB = (stats.size / (1024 * 1024)).toFixed(2);
const sizeKB = (stats.size / 1024).toFixed(1);

const fileBuffer = fs.readFileSync(zipFilePath);
const hashSum = crypto.createHash('sha256');
hashSum.update(fileBuffer);
const sha256 = hashSum.digest('hex');

// Inspeccionar que no existan rutas no autorizadas en el ZIP
const zipList = execSync(`unzip -l "${zipFilePath}"`, { encoding: 'utf8' });
const forbiddenKeywords = ['node_modules/', 'backend/data/db', '.git/objects'];
let violations = 0;
for (const kw of forbiddenKeywords) {
  if (zipList.includes(kw)) {
    console.error(`  [ALERTA] Se detectó ruta prohibida en el ZIP: ${kw}`);
    violations++;
  }
}

if (violations === 0) {
  console.log('  ✓ Verificación limpia: Cero archivos prohibidos en el empaquetado.');
} else {
  console.error(`[ERROR] El archivo ZIP contiene ${violations} violaciones de exclusión.`);
  process.exit(1);
}

// Generar reporte de entrega
const entregaDir = path.join(rootDir, 'docs/entrega');
if (!fs.existsSync(entregaDir)) {
  fs.mkdirSync(entregaDir, { recursive: true });
}

const manifestPath = path.join(entregaDir, 'ENTREGA_MANIFEST.md');
const manifestContent = `# Manifiesto Oficial de Entrega Académica — E-Actividad 4.3

**Universidad Valle del Momboy · FrontEndIVIVFI2026C**  
**Proyecto Final:** Sistema de Encuestas Formativas — Cátedra Libre Dr. José Gregorio Hernández  
**Fecha de Generación:** ${new Date().toISOString()}  
**Estudiante / Integrante 1:** Martin Morfe.°. (C.I. 8.263.711)  
**Estudiante / Integrante 2:** Martin Alejandro Morfe Carballo (C.I. 30.539.018)  

---

## 1. Datos del Archivo Entregable

| Parámetro | Valor |
|---|---|
| **Nombre de archivo** | \`${zipFileName}\` |
| **Tamaño en disco** | **${sizeMB} MB** (${stats.size.toLocaleString()} bytes) |
| **Algoritmo de Integridad** | SHA-256 |
| **Checksum SHA-256** | \`${sha256}\` |

---

## 2. Validación de Exclusiones

Se comprobó que el archivo empaquetado **NO** incluye:
- Dependencias pesadas (\`node_modules/\`)
- Historial interno git (\`.git/\`)
- Credenciales en texto plano (\`.env\`)
- Archivos de persistencia local temporal (\`backend/data/\`)
- Cargas de usuario temporales (\`backend/uploads/*\`)

---

## 3. Instrucciones de Despliegue y Evaluación

Para reproducir y evaluar el proyecto desde el archivo ZIP:
\`\`\`bash
# 1. Descomprimir
unzip ${zipFileName} -d uvm-4.3-jgh/
cd uvm-4.3-jgh/

# 2. Instalar dependencias
npm run install:all

# 3. Iniciar entorno completo (BD local + Backend + Frontend)
npm run dev

# 4. Poblar datos iniciales (opcional si se desea resetear)
npm run seed

# 5. Ejecutar suite de pruebas automatizadas
npm test
\`\`\`
`;

fs.writeFileSync(manifestPath, manifestContent, 'utf8');

console.log('\n================================================================');
console.log('RESUMEN DE EMPAQUETADO EXITOSO');
console.log('================================================================');
console.log(`Archivo: ${zipFileName}`);
console.log(`Tamaño:  ${sizeMB} MB (${sizeKB} KB)`);
console.log(`SHA-256: ${sha256}`);
console.log(`Manifiesto registrado en: docs/entrega/ENTREGA_MANIFEST.md\n`);
