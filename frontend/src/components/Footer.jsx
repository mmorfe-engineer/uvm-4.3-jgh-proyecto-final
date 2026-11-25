import React from 'react';
import { FileCode, Activity } from 'lucide-react';
import { api } from '../services/api';

export default function Footer({ onOpenOpenApi }) {
  const openApiUrl = api.isStaticDemo
    ? 'https://raw.githubusercontent.com/mmorfe-engineer/uvm-4.3-jgh-proyecto-final/main/backend/src/docs/openapi.json'
    : '/api/openapi.json';

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
                href={openApiUrl}
                target="_blank"
                rel="noreferrer"
                className="btn btn-secondary btn-sm"
                style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
              >
                <FileCode size={13} /> OpenAPI JSON
              </a>
              {!api.isStaticDemo ? (
                <a
                  href="/api/health"
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-secondary btn-sm"
                  style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
                >
                  <Activity size={13} /> Health API
                </a>
              ) : (
                <span
                  className="btn btn-secondary btn-sm"
                  style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', display: 'inline-flex', alignItems: 'center', gap: '0.35rem', opacity: 0.7, cursor: 'default' }}
                  title="Disponible al ejecutar backend Node.js local"
                >
                  <Activity size={13} /> Health API (Local)
                </span>
              )}
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
