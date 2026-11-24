import React, { useState } from 'react';
import { api } from '../services/api';

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
          <h3>{mode === 'login' ? 'Iniciar Sesión' : 'Registro de Participante'}</h3>
          <button onClick={onClose} style={{ fontSize: '1.4rem', color: 'var(--color-texto-muted)' }}>
            ✕
          </button>
        </div>

        {error && (
          <div className="alert alert-error anim-fade-in" style={{ padding: '0.6rem 0.9rem', fontSize: '0.85rem' }}>
            <span>⚠️ {error}</span>
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
                placeholder="Ej. María Corina Silva"
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

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }} disabled={loading}>
            {loading ? <span className="spinner spinner-light" /> : mode === 'login' ? 'Ingresar al Sistema' : 'Completar Registro'}
          </button>
        </form>

        {mode === 'login' && (
          <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid var(--color-borde)' }}>
            <p style={{ fontSize: '0.8rem', color: 'var(--color-texto-muted)', marginBottom: '0.5rem' }}>
              Credenciales académicas de demostración rápida:
            </p>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                style={{ fontSize: '0.75rem', flex: 1 }}
                onClick={() => fillDemo('admin')}
              >
                ⚙️ Autocompletar Admin
              </button>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                style={{ fontSize: '0.75rem', flex: 1 }}
                onClick={() => fillDemo('part')}
              >
                👤 Autocompletar Participante
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
      </div>
    </div>
  );
}
