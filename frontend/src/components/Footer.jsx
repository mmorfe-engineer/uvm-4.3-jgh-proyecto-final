import React from 'react';

export default function Footer({ onOpenOpenApi }) {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-content">
          <div>
            <h4 style={{ color: '#ffffff', marginBottom: '0.4rem' }}>
              Cátedra Libre Dr. José Gregorio Hernández
            </h4>
            <p style={{ maxWidth: 450, fontSize: '0.85rem', lineHeight: 1.5 }}>
              Sistema de Encuestas Formativas · Universidad Valle del Momboy  
              Asignatura: FrontEndIVIVFI2026C — Taller Front End · E-Actividad 4.3 (Proyecto Final)
            </p>
          </div>

          <div>
            <h5 style={{ color: 'var(--color-dorado)', marginBottom: '0.5rem' }}>Integrantes</h5>
            <ul style={{ listStyle: 'none', fontSize: '0.85rem' }}>
              <li>• Martin Morfe.°. (C.I. 8.263.711) — <code>mmorfe-engineer</code></li>
              <li>• Martin Alejandro Morfe Carballo (C.I. 30.539.018) — <code>morfemartin</code></li>
            </ul>
          </div>

          <div>
            <h5 style={{ color: 'var(--color-dorado)', marginBottom: '0.5rem' }}>Enlaces Técnicos</h5>
            <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
              <a
                href="/api/openapi.json"
                target="_blank"
                rel="noreferrer"
                className="btn btn-secondary btn-sm"
                style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}
              >
                📄 OpenAPI JSON
              </a>
              <a
                href="/api/health"
                target="_blank"
                rel="noreferrer"
                className="btn btn-secondary btn-sm"
                style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}
              >
                🏥 Health API
              </a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>
            © 2026 Universidad Valle del Momboy · Entrega académica verificable · Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
