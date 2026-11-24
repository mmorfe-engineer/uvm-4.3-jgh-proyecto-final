/**
 * frontend/tests/build.test.js
 * Verificación automatizada de compilación y empaquetado de assets frontend
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

test('Frontend Build: Verifica existencia de index.html y bundle de producción en dist/', () => {
  const distPath = path.resolve(__dirname, '../dist');
  assert.ok(fs.existsSync(distPath), 'El directorio dist/ debe existir tras la compilación.');

  const htmlPath = path.join(distPath, 'index.html');
  assert.ok(fs.existsSync(htmlPath), 'El archivo dist/index.html debe existir.');

  const htmlContent = fs.readFileSync(htmlPath, 'utf8');
  assert.ok(htmlContent.includes('JGH Encuestas'), 'El HTML debe incluir el título institucional.');
  assert.ok(htmlContent.includes('<div id="root"></div>'), 'El HTML debe contener el elemento raíz #root.');

  const assetsPath = path.join(distPath, 'assets');
  assert.ok(fs.existsSync(assetsPath), 'El directorio dist/assets debe existir.');

  const files = fs.readdirSync(assetsPath);
  const jsBundle = files.find((f) => f.endsWith('.js'));
  const cssBundle = files.find((f) => f.endsWith('.css'));

  assert.ok(jsBundle, 'Debe existir al menos un archivo bundle de JavaScript compilado.');
  assert.ok(cssBundle, 'Debe existir al menos un archivo bundle de estilos CSS compilado.');
});
