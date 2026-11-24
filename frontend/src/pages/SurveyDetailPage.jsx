import React from 'react';

export default function SurveyDetailPage({ survey, onBack, user, onOpenAuth }) {
  if (!survey) return null;

  return (
    <div className="anim-fade-in" style={{ padding: '2.5rem 0' }}>
      <div className="container" style={{ maxWidth: 840 }}>
        <button className="btn btn-secondary btn-sm" onClick={onBack} style={{ marginBottom: '1.5rem' }}>
          ← Volver al Listado
        </button>

        <div className="card" style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <span className="badge badge-topic">{survey.topic}</span>
            <span className="badge badge-published">Estado: {survey.status}</span>
          </div>

          <h1 style={{ fontSize: '1.8rem', marginBottom: '0.75rem' }}>{survey.title}</h1>
          <p style={{ color: 'var(--color-texto-muted)', fontSize: '1.05rem', lineHeight: 1.6, marginBottom: '1.25rem' }}>
            {survey.description}
          </p>

          <div
            style={{
              fontSize: '0.85rem',
              color: 'var(--color-texto-muted)',
              display: 'flex',
              gap: '1.5rem',
              borderTop: '1px solid var(--color-borde)',
              paddingTop: '0.8rem',
            }}
          >
            <span>👤 Creada por: {survey.createdBy?.name || 'Administrador UVM'}</span>
            <span>📅 Publicada: {new Date(survey.publishedAt || survey.createdAt).toLocaleDateString()}</span>
          </div>
        </div>

        {/* Listado de Preguntas */}
        <div style={{ marginBottom: '2.5rem' }}>
          <h3 style={{ marginBottom: '1.25rem' }}>Preguntas del Instrumento Formativo ({survey.questions?.length || 0})</h3>

          {survey.questions && survey.questions.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {survey.questions.map((q, idx) => (
                <div key={q.id || idx} className="card" style={{ padding: '1.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span style={{ fontWeight: 700, color: 'var(--color-petroleo)' }}>Pregunta #{idx + 1}</span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--color-texto-muted)' }}>
                      {q.type === 'single_choice' ? 'Selección Única' : 'Texto Corto'} {q.required && '• Obligatoria'}
                    </span>
                  </div>

                  <p style={{ fontSize: '1rem', fontWeight: 500, marginBottom: '1rem' }}>{q.text}</p>

                  {q.type === 'single_choice' && q.options && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {q.options.map((opt, optIdx) => (
                        <div
                          key={optIdx}
                          style={{
                            padding: '0.6rem 0.9rem',
                            background: '#ffffff',
                            border: '1px solid var(--color-borde)',
                            borderRadius: 'var(--radius-sm)',
                            fontSize: '0.9rem',
                          }}
                        >
                          ○ {opt}
                        </div>
                      ))}
                    </div>
                  )}

                  {q.type === 'short_text' && (
                    <input
                      type="text"
                      className="form-input"
                      disabled
                      placeholder="Espacio para respuesta de texto del participante..."
                      style={{ background: '#f5f5f5', cursor: 'not-allowed' }}
                    />
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: 'var(--color-texto-muted)' }}>No hay preguntas configuradas en esta encuesta.</p>
          )}
        </div>

        {/* Bloque de Información de Reserva de Participación */}
        <div
          style={{
            background: 'var(--color-panel)',
            border: '2px dashed var(--color-dorado-dark)',
            borderRadius: 'var(--radius-md)',
            padding: '1.5rem',
            textAlign: 'center',
          }}
        >
          <h4>Módulo de Envío de Respuestas</h4>
          <p style={{ color: 'var(--color-texto-muted)', fontSize: '0.9rem', margin: '0.5rem auto 1rem auto', maxWidth: 600 }}>
            El registro interactivo de respuestas de participantes, validación de opciones y prevención de duplicados forma parte del <strong>Módulo de Participación y Descubrimiento</strong> (Reserva técnica de <code>morfemartin</code>, Hitos 5 y 6).
          </p>
          {!user && (
            <button className="btn btn-secondary btn-sm" onClick={() => onOpenAuth('login')}>
              Iniciar sesión para consultar perfiles de acceso
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
