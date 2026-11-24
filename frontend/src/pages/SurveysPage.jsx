import React, { useState, useEffect } from 'react';
import { api } from '../services/api';

export default function SurveysPage({ onSelectSurvey, user }) {
  const [surveys, setSurveys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState('');

  const fetchSurveys = async (topic = '') => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getSurveys(topic);
      setSurveys(data.surveys || []);
    } catch (err) {
      setError(err.message || 'Error al cargar las encuestas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSurveys(selectedTopic);
  }, [selectedTopic]);

  const topics = ['Todos', 'Bioética y Salud', 'Valores Ciudadanos', 'Salud y Asistencia'];

  return (
    <div className="anim-fade-in" style={{ padding: '2.5rem 0' }}>
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h2>Encuestas Formativas Publicadas</h2>
            <p style={{ color: 'var(--color-texto-muted)', marginTop: '0.2rem' }}>
              Consulte las propuestas vigentes de la Cátedra Libre Dr. José Gregorio Hernández
            </p>
          </div>

          {/* Selector de Tópicos */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {topics.map((t) => {
              const val = t === 'Todos' ? '' : t;
              const isActive = selectedTopic === val;
              return (
                <button
                  key={t}
                  className={`btn btn-sm ${isActive ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setSelectedTopic(val)}
                >
                  {t}
                </button>
              );
            })}
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div style={{ textAlign: 'center', padding: '4rem 0' }}>
            <span className="spinner" style={{ width: 32, height: 32, borderWidth: 4 }} />
            <p style={{ marginTop: '1rem', color: 'var(--color-texto-muted)' }}>
              Cargando encuestas formativas desde MongoDB...
            </p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="alert alert-error anim-fade-in">
            <span>⚠️ {error}</span>
            <button className="btn btn-secondary btn-sm" onClick={() => fetchSurveys(selectedTopic)}>
              Reintentar
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && surveys.length === 0 && (
          <div className="card" style={{ textAlign: 'center', padding: '3.5rem 2rem' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>📋</div>
            <h3>No se encontraron encuestas disponibles</h3>
            <p style={{ color: 'var(--color-texto-muted)', marginTop: '0.5rem', maxWidth: 450, margin: '0.5rem auto 1.5rem auto' }}>
              Actualmente no existen encuestas publicadas para el área seleccionada. Los administradores pueden publicar nuevos instrumentos desde su panel.
            </p>
            {selectedTopic && (
              <button className="btn btn-secondary btn-sm" onClick={() => setSelectedTopic('')}>
                Ver todas las encuestas
              </button>
            )}
          </div>
        )}

        {/* Surveys Grid */}
        {!loading && !error && surveys.length > 0 && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '1.5rem',
            }}
          >
            {surveys.map((survey) => (
              <div key={survey._id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                    <span className="badge badge-topic">{survey.topic}</span>
                    <span className="badge badge-published">Publicada</span>
                  </div>

                  <h3 className="card-title" style={{ fontSize: '1.2rem', marginBottom: '0.6rem' }}>
                    {survey.title}
                  </h3>

                  <p style={{ color: 'var(--color-texto-muted)', fontSize: '0.9rem', marginBottom: '1.2rem', lineHeight: 1.5 }}>
                    {survey.description || 'Sin descripción adicional suministrada.'}
                  </p>
                </div>

                <div>
                  <div
                    style={{
                      borderTop: '1px solid var(--color-borde)',
                      paddingTop: '0.9rem',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      fontSize: '0.85rem',
                      color: 'var(--color-texto-muted)',
                    }}
                  >
                    <span>❓ {survey.questions?.length || 0} preguntas</span>
                    <span>📅 {new Date(survey.publishedAt || survey.createdAt).toLocaleDateString()}</span>
                  </div>

                  <button
                    className="btn btn-primary"
                    style={{ width: '100%', marginTop: '0.9rem' }}
                    onClick={() => onSelectSurvey(survey)}
                  >
                    Ver Contenido de la Encuesta
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
