import React from 'react';

export default function Navbar({ currentView, setCurrentView, user, onLogout, onOpenAuth, health }) {
  return (
    <header className="site-header">
      <div className="container nav-container">
        <div className="brand" style={{ cursor: 'pointer' }} onClick={() => setCurrentView('home')}>
          <span>🏛️</span>
          <div>
            <div style={{ lineHeight: 1.1 }}>Cátedra Dr. JGH</div>
            <div style={{ fontSize: '0.75rem', fontWeight: 400, opacity: 0.9 }}>
              Universidad Valle del Momboy
            </div>
          </div>
          <span className="brand-badge">E4.3</span>
        </div>

        <nav>
          <ul className="nav-menu">
            <li>
              <button
                className={`nav-link ${currentView === 'home' ? 'active' : ''}`}
                onClick={() => setCurrentView('home')}
              >
                Inicio
              </button>
            </li>
            <li>
              <button
                className={`nav-link ${currentView === 'surveys' ? 'active' : ''}`}
                onClick={() => setCurrentView('surveys')}
              >
                Encuestas
              </button>
            </li>
            <li>
              <button
                className={`nav-link ${currentView === 'contact' ? 'active' : ''}`}
                onClick={() => setCurrentView('contact')}
              >
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
                  ⚙️ Administración
                </button>
              </li>
            )}

            {/* Estado de conexión de la API */}
            <li title={health ? `API Activa - MongoDB ${health.database}` : 'Verificando API...'}>
              <span
                style={{
                  display: 'inline-block',
                  width: 9,
                  height: 9,
                  borderRadius: '50%',
                  background: health && health.status === 'ok' ? '#4CAF50' : '#FF9800',
                  boxShadow: '0 0 6px currentColor',
                }}
              />
            </li>

            {/* Auth Buttons */}
            {user ? (
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <div className="user-badge">
                  <span>👤 {user.name}</span>
                  <span className={`role-tag ${user.role}`}>{user.role}</span>
                </div>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={onLogout}
                  style={{ background: 'transparent', color: '#ffffff', borderColor: 'rgba(255,255,255,0.4)' }}
                >
                  Salir
                </button>
              </li>
            ) : (
              <li>
                <button className="btn btn-dorado btn-sm" onClick={() => onOpenAuth('login')}>
                  Iniciar Sesión
                </button>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
}
