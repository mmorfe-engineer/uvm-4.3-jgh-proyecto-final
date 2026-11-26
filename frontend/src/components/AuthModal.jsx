import React, { useState } from 'react';
import { api } from '../services/api';
import { X, AlertCircle, KeyRound, UserCheck, LogIn, UserPlus, Info, ShieldCheck } from 'lucide-react';

export default function AuthModal({ initialMode = 'login', onClose, onSuccess }) {
  const [mode, setMode] = useState(initialMode);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      let res;
      if (mode === 'login') {
        res = await api.login(email, password);
      } else {
        res = await api.register(name, email, password);
      }
      onSuccess(res.user);
      onClose();
    } catch (err) {
      setError(err.message || 'Error en la autenticación');
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (role) => {
    if (role === 'admin') {
      setEmail('admin@uvm.edu.ve');
      setPassword('Admin123!*');
    } else {
      setEmail('participante@uvm.edu.ve');
      setPassword('Participante123!*');
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content anim-slide-down" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h3>{api.isStaticDemo ? 'Acceso Institucional' : mode === 'login' ? 'Iniciar Sesión' : 'Registro de Participante'}</h3>
          <button onClick={onClose} style={{ display: 'inline-flex', alignItems: 'center', color: 'var(--color-texto-muted)', border: 'none', background: 'transparent', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        {api.isStaticDemo ? (
          <div>
            <div
              style={{
                background: 'rgba(16, 61, 69, 0.04)',
                border: '1px solid var(--color-borde)',
                borderRadius: 'var(--radius-sm)',
                padding: '1.25rem',
                marginBottom: '1.5rem',
                fontSize: '0.9rem',
                lineHeight: 1.6,
                color: 'var(--color-texto)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <ShieldCheck size={19} color="var(--color-petroleo)" />
                <h4 style={{ margin: 0, fontSize: '0.98rem', color: 'var(--color-petroleo)' }}>
                  Información sobre el Acceso de Usuario
                </h4>
              </div>
              <p style={{ margin: '0 0 0.85rem 0' }}>
                En esta <strong>vista demostrativa pública</strong> no se solicitan contraseñas ni se gestionan credenciales por motivos de seguridad y privacidad. Todas las consultas de demostración están abiertas para su visualización y prueba libre sin necesidad de registro.
              </p>
              <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--color-texto-muted)' }}>
                El sistema de autenticación con sesiones universitarias y roles de administración (creación y publicación de instrumentos) opera en el despliegue local de la aplicación.
              </p>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button
                type="button"
                className="btn btn-primary"
                onClick={onClose}
                style={{ width: '100%', justifyContent: 'center' }}
              >
                Continuar Explorando Consultas
              </button>
            </div>
          </div>
        ) : (
          <>
            {error && (
              <div className="alert alert-error anim-fade-in" style={{ padding: '0.6rem 0.9rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <AlertCircle size={16} style={{ flexShrink: 0 }} />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {mode === 'register' && (
                <div className="form-group">
                  <label className="form-label">Nombre Completo *</label>
                  <input
                    type="text"
                    className="form-input"
                    required
                    placeholder="Ej. Dra. Beatriz Mendoza"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              )}

              <div className="form-group">
                <label className="form-label">Correo Electrónico *</label>
                <input
                  type="email"
                  className="form-input"
                  required
                  placeholder="nombre@uvm.edu.ve"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Contraseña *</label>
                <input
                  type="password"
                  className="form-input"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: '100%', marginTop: '0.5rem', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}
                disabled={loading}
              >
                {loading ? (
                  <span className="spinner spinner-light" />
                ) : mode === 'login' ? (
                  <>
                    <LogIn size={15} />
                    <span>Ingresar al Sistema</span>
                  </>
                ) : (
                  <>
                    <UserPlus size={15} />
                    <span>Completar Registro</span>
                  </>
                )}
              </button>
            </form>

            {mode === 'login' && (
              <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid var(--color-borde)' }}>
                <p style={{ fontSize: '0.8rem', color: 'var(--color-texto-muted)', marginBottom: '0.5rem' }}>
                  Cuentas locales de prueba académica preconfiguradas:
                </p>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    style={{ fontSize: '0.75rem', flex: 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem' }}
                    onClick={() => fillDemo('admin')}
                  >
                    <KeyRound size={13} /> Admin Local
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    style={{ fontSize: '0.75rem', flex: 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem' }}
                    onClick={() => fillDemo('part')}
                  >
                    <UserCheck size={13} /> Participante Local
                  </button>
                </div>
              </div>
            )}

            <div style={{ marginTop: '1.25rem', textAlign: 'center', fontSize: '0.85rem' }}>
              {mode === 'login' ? (
                <p>
                  ¿No posees una cuenta?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setMode('register');
                      setError(null);
                    }}
                    style={{ color: 'var(--color-petroleo)', fontWeight: 600, textDecoration: 'underline' }}
                  >
                    Regístrate aquí
                  </button>
                </p>
              ) : (
                <p>
                  ¿Ya tienes cuenta?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setMode('login');
                      setError(null);
                    }}
                    style={{ color: 'var(--color-petroleo)', fontWeight: 600, textDecoration: 'underline' }}
                  >
                    Inicia sesión
                  </button>
                </p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
