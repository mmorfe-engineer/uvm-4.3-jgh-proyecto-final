import React from 'react';
import {
  ArrowLeft,
  Calendar,
  User,
  Target,
  Users,
  CheckCircle2,
  Lock,
  FileText,
  HelpCircle,
  Clock,
} from 'lucide-react';

export default function SurveyDetailPage({ survey, onBack, user, onOpenAuth }) {
  if (!survey) return null;

  return (
    <div className="anim-fade-in" style={{ padding: '2.5rem 0' }}>
      <div className="container" style={{ maxWidth: 840 }}>
        {/* Navegación de retorno */}
        <button
          className="btn btn-secondary btn-sm"
          onClick={onBack}
          style={{ marginBottom: '1.5rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
        >
          <ArrowLeft size={15} />
          Volver al Catálogo de Consultas
        </button>

        {/* Ficha Técnica del Instrumento */}
        <div className="card" style={{ marginBottom: '2rem', padding: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <span className="badge badge-topic">{survey.topic}</span>
            <span className="badge badge-published" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
              <CheckCircle2 size={13} /> Consulta Activa
            </span>
          </div>

          <h1 style={{ fontSize: '1.9rem', marginBottom: '0.85rem', color: 'var(--color-petroleo)', lineHeight: 1.3 }}>
            {survey.title}
          </h1>

          <p style={{ color: 'var(--color-texto)', fontSize: '1.05rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
            {survey.description}
          </p>

          {/* Metadatos Académicos Institucionales */}
          <div
            style={{
              background: 'var(--color-fondo)',
              border: '1px solid var(--color-borde)',
              borderRadius: 'var(--radius-sm)',
              padding: '1rem',
              marginBottom: '1.25rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.6rem',
              fontSize: '0.9rem',
            }}
          >
            {survey.objective && (
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                <Target size={16} color="var(--color-petroleo)" style={{ marginTop: '0.15rem', flexShrink: 0 }} />
                <span><strong>Objetivo del Instrumento:</strong> {survey.objective}</span>
              </div>
            )}
            {survey.targetAudience && (
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                <Users size={16} color="var(--color-petroleo)" style={{ marginTop: '0.15rem', flexShrink: 0 }} />
                <span><strong>Población Destinataria:</strong> {survey.targetAudience}</span>
              </div>
            )}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
              <HelpCircle size={16} color="var(--color-petroleo)" style={{ marginTop: '0.15rem', flexShrink: 0 }} />
              <span><strong>Extensión del Cuestionario:</strong> {survey.questions?.length || 0} preguntas estructuradas</span>
            </div>
          </div>

          <div
            style={{
              fontSize: '0.82rem',
              color: 'var(--color-texto-muted)',
              display: 'flex',
              gap: '1.5rem',
              borderTop: '1px solid var(--color-borde)',
              paddingTop: '0.85rem',
              flexWrap: 'wrap',
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <User size={13} /> Responsable: {survey.createdBy?.name || 'Administración Cátedra JGH'}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <Calendar size={13} /> Publicada: {new Date(survey.publishedAt || survey.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>

        {/* Estructura de Preguntas del Instrumento */}
        <div style={{ marginBottom: '2.5rem' }}>
          <div style={{ marginBottom: '1.25rem' }}>
            <h2 style={{ fontSize: '1.4rem', color: 'var(--color-petroleo)', margin: 0 }}>
              Cuestionario Académico del Instrumento
            </h2>
            <p style={{ color: 'var(--color-texto-muted)', fontSize: '0.88rem', marginTop: '0.2rem' }}>
              Preguntas configuradas para el levantamiento de percepciones y diagnósticos formativos
            </p>
          </div>

          {survey.questions && survey.questions.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {survey.questions.map((q, idx) => (
                <div key={q.id || idx} className="card" style={{ padding: '1.35rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
                    <span style={{ fontWeight: 700, color: 'var(--color-petroleo)', fontSize: '0.9rem' }}>
                      Ítem #{idx + 1}
                    </span>
                    <span style={{ fontSize: '0.78rem', color: 'var(--color-texto-muted)' }}>
                      {q.type === 'single_choice' ? 'Selección Simple' : 'Respuesta Breve'}{' '}
                      {q.required && '• Obligatoria'}
                    </span>
                  </div>

                  <p style={{ fontSize: '1.02rem', fontWeight: 600, color: 'var(--color-texto)', marginBottom: '1rem', lineHeight: 1.45 }}>
                    {q.text}
                  </p>

                  {q.type === 'single_choice' && q.options && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {q.options.map((opt, optIdx) => (
                        <div
                          key={optIdx}
                          style={{
                            padding: '0.65rem 1rem',
                            background: '#ffffff',
                            border: '1px solid var(--color-borde)',
                            borderRadius: 'var(--radius-sm)',
                            fontSize: '0.9rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.6rem',
                            color: 'var(--color-texto)',
                          }}
                        >
                          <span
                            style={{
                              width: 14,
                              height: 14,
                              borderRadius: '50%',
                              border: '1.5px solid var(--color-petroleo)',
                              display: 'inline-block',
                              flexShrink: 0,
                            }}
                          />
                          <span>{opt}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {q.type === 'short_text' && (
                    <div
                      style={{
                        padding: '0.75rem 1rem',
                        background: '#f9f9f9',
                        border: '1px dashed var(--color-borde)',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '0.88rem',
                        color: 'var(--color-texto-muted)',
                        fontStyle: 'italic',
                      }}
                    >
                      Espacio delimitado para la respuesta de texto reflexivo del participante universitario.
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: 'var(--color-texto-muted)' }}>No hay preguntas configuradas en este instrumento.</p>
          )}
        </div>

        {/* Frontera de Reserva Humana: Módulo de Participación */}
        <aside
          style={{
            background: 'var(--color-panel)',
            border: '2px dashed var(--color-dorado-dark)',
            borderRadius: 'var(--radius-md)',
            padding: '1.75rem',
            textAlign: 'center',
          }}
          aria-labelledby="reservation-title"
        >
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <Lock size={18} color="var(--color-dorado-dark)" />
            <h3 id="reservation-title" style={{ fontSize: '1.15rem', color: 'var(--color-petroleo)', margin: 0 }}>
              Módulo de Registro de Respuestas y Participación
            </h3>
          </div>
          <p style={{ color: 'var(--color-texto)', fontSize: '0.92rem', margin: '0.5rem auto 1rem auto', maxWidth: 640, lineHeight: 1.5 }}>
            Conforme a la división académica de responsabilidades de la E-Actividad 4.3, el mecanismo de envío interactivo,
            la validación de unicidad en base de datos (índice <code>{'{ surveyId, participantId }'}</code>) y la
            prevención de duplicados están reservados exclusivamente para la contribución humana de <strong>Martin Alejandro Morfe Carballo</strong> (<code>morfemartin</code>).
          </p>

          {!user && (
            <button className="btn btn-secondary btn-sm" onClick={() => onOpenAuth('login')}>
              <User size={14} />
              Iniciar Sesión Universitaria
            </button>
          )}
        </aside>
      </div>
    </div>
  );
}
