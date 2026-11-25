import React from 'react';
import universityLogo from '../assets/uvm-logo.webp';
import { Home, FileText, Mail, ShieldCheck, User as UserIcon, LogOut, LogIn } from 'lucide-react';
import { isStaticDemo } from '../services/api';

export default function Navbar({ currentView, setCurrentView, user, onLogout, onOpenAuth, health }) {
  const isConnected = health && health.status === 'ok';

  return (
    <header className="site-header">
      <div className="container nav-container">
        {/* Identidad Institucional UVM Canónica (Herencia 4.2) */}
        <div
          className="brand"
          style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.85rem' }}
          onClick={() => setCurrentView('home')}
        >
          <img
            src={universityLogo}
            alt="Escudo Universidad Valle del Momboy"
            width="44"
            height="44"
            style={{ objectFit: 'contain', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }}
          />
          <div>
            <div style={{ lineHeight: 1.15, fontSize: '1.05rem', fontFamily: 'var(--font-serif)', fontWeight: 700 }}>
              Universidad Valle del Momboy
            </div>
            <div style={{ fontSize: '0.76rem', color: 'var(--color-dorado)', fontWeight: 500, letterSpacing: '0.02em' }}>
              Cátedra Libre Dr. José Gregorio Hernández
            </div>
          </div>
          <span className="brand-badge">Prototipo 4.3</span>
        </div>

        {/* Menú de Navegación Profesional */}
        <nav aria-label="Navegación principal">
          <ul className="nav-menu">
            <li>
              <button
                className={`nav-link ${currentView === 'home' ? 'active' : ''}`}
                onClick={() => setCurrentView('home')}
              >
                <Home size={15} style={{ marginRight: '0.35rem', verticalAlign: 'middle' }} />
                Inicio
              </button>
            </li>
            <li>
              <button
                className={`nav-link ${currentView === 'surveys' ? 'active' : ''}`}
                onClick={() => setCurrentView('surveys')}
              >
                <FileText size={15} style={{ marginRight: '0.35rem', verticalAlign: 'middle' }} />
                Encuestas
              </button>
            </li>
            <li>
              <button
                className={`nav-link ${currentView === 'contact' ? 'active' : ''}`}
                onClick={() => setCurrentView('contact')}
              >
                <Mail size={15} style={{ marginRight: '0.35rem', verticalAlign: 'middle' }} />
                Contacto
              </button>
            </li>

            {user && user.role === 'admin' && (
              <li>
                <button
                  className={`nav-link ${currentView === 'admin' ? 'active' : ''}`}
                  onClick={() => setCurrentView('admin')}
                  style={{ color: 'var(--color-dorado)' }}
                >
                  <ShieldCheck size={15} style={{ marginRight: '0.35rem', verticalAlign: 'middle' }} />
                  Administración
                </button>
              </li>
            )}

            {/* Indicador de Estado Real del Backend */}
            <li>
              {isStaticDemo ? (
                <span
                  style={{
                    fontSize: '0.72rem',
                    background: 'rgba(240, 211, 154, 0.2)',
                    color: 'var(--color-dorado)',
                    border: '1px solid rgba(240, 211, 154, 0.4)',
                    padding: '0.2rem 0.5rem',
                    borderRadius: '4px',
                    fontWeight: 600,
                  }}
                  title="Visor estático en GitHub Pages (sin conexión backend)"
                >
                  Demo Estática
                </span>
              ) : (
                <span
                  title={
                    isConnected
                      ? `Backend Express y MongoDB conectados (${health.database || 'activa'})`
                      : 'Servidor API desconectado. Ejecute npm run dev localmente.'
                  }
                  style={{
                    display: 'inline-block',
                    width: 9,
                    height: 9,
                    borderRadius: '50%',
                    background: isConnected ? '#4CAF50' : '#E53935',
                    boxShadow: isConnected ? '0 0 6px #4CAF50' : '0 0 6px #E53935',
                  }}
                />
              )}
            </li>

            {/* Sesión y Accesos */}
            {user ? (
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <div className="user-badge">
                  <UserIcon size={14} color="var(--color-dorado)" />
                  <span>{user.name}</span>
                  <span className={`role-tag ${user.role}`}>{user.role}</span>
                </div>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={onLogout}
                  style={{ background: 'transparent', color: '#ffffff', borderColor: 'rgba(255,255,255,0.4)' }}
                >
                  <LogOut size={13} style={{ marginRight: '0.25rem' }} />
                  Salir
                </button>
              </li>
            ) : (
              <li>
                <button className="btn btn-dorado btn-sm" onClick={() => onOpenAuth('login')}>
                  <LogIn size={14} style={{ marginRight: '0.3rem' }} />
                  Acceso
                </button>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
}
