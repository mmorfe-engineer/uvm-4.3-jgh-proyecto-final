import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import {
  FileText,
  HelpCircle,
  Calendar,
  AlertCircle,
  Filter,
  ArrowRight,
  Target,
  Users,
} from 'lucide-react';

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
      setError(err.message || 'Error al conectar con la API de encuestas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSurveys(selectedTopic);
  }, [selectedTopic]);

  const topics = [
    { label: 'Todos los Ejes', value: '' },
    { label: 'Formación y Bioética', value: 'Formación y Bioética' },
    { label: 'Evaluación Académica', value: 'Evaluación Académica' },
    { label: 'Vinculación Comunitaria', value: 'Vinculación Comunitaria' },
  ];

  return (
    <div className="anim-fade-in" style={{ padding: '2.5rem 0' }}>
      <div className="container">
        {/* Cabecera de la sección */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '2rem',
            flexWrap: 'wrap',
            gap: '1rem',
            borderBottom: '1px solid var(--color-borde)',
            paddingBottom: '1.25rem',
          }}
        >
          <div>
            <h2 style={{ fontSize: '1.85rem', color: 'var(--color-petroleo)', margin: 0 }}>
              Consultas e Instrumentos Formativos
            </h2>
            <p style={{ color: 'var(--color-texto-muted)', marginTop: '0.35rem', fontSize: '0.95rem' }}>
              Instrumentos canónicos diseñados por la Cátedra Libre Dr. José Gregorio Hernández
            </p>
          </div>

          {/* Filtro por Eje Temático */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--color-texto-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <Filter size={14} /> Filtrar:
            </span>
            {topics.map((t) => {
              const isActive = selectedTopic === t.value;
              return (
                <button
                  key={t.value}
                  className={`btn btn-sm ${isActive ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setSelectedTopic(t.value)}
                >
                  {t.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div style={{ textAlign: 'center', padding: '4rem 0' }}>
            <span className="spinner" style={{ width: 34, height: 34, borderWidth: 4 }} />
            <p style={{ marginTop: '1rem', color: 'var(--color-texto-muted)' }}>
              Consultando instrumentos formativos en base de datos...
            </p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="alert alert-error anim-fade-in" style={{ marginBottom: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <AlertCircle size={20} />
              <span>{error}</span>
            </div>
            <button className="btn btn-secondary btn-sm" onClick={() => fetchSurveys(selectedTopic)}>
              Reintentar Consulta
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && surveys.length === 0 && (
          <div className="card" style={{ textAlign: 'center', padding: '3.5rem 2rem' }}>
            <div style={{ marginBottom: '1rem' }}>
              <FileText size={42} color="var(--color-texto-muted)" />
            </div>
            <h3 style={{ fontSize: '1.25rem', color: 'var(--color-petroleo)' }}>
              No se encontraron instrumentos activos
            </h3>
            <p style={{ color: 'var(--color-texto-muted)', marginTop: '0.5rem', maxWidth: 460, marginInline: 'auto' }}>
              Actualmente no existen consultas publicadas para el criterio seleccionado. Los responsables académicos
              pueden gestionar nuevos instrumentos desde el panel de administración.
            </p>
            {selectedTopic && (
              <button
                className="btn btn-secondary btn-sm"
                style={{ marginTop: '1.25rem' }}
                onClick={() => setSelectedTopic('')}
              >
                Restablecer Filtros
              </button>
            )}
          </div>
        )}

        {/* Grid de Encuestas */}
        {!loading && !error && surveys.length > 0 && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '1.75rem',
            }}
          >
            {surveys.map((survey) => (
              <div
                key={survey._id}
                className="card"
                style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '1.5rem' }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.85rem' }}>
                    <span className="badge badge-topic">{survey.topic}</span>
                    <span className="badge badge-published">Consulta Activa</span>
                  </div>

                  <h3 className="card-title" style={{ fontSize: '1.2rem', marginBottom: '0.6rem', color: 'var(--color-petroleo)', lineHeight: 1.35 }}>
                    {survey.title}
                  </h3>

                  <p style={{ color: 'var(--color-texto)', fontSize: '0.9rem', marginBottom: '1rem', lineHeight: 1.5 }}>
                    {survey.description || 'Sin descripción adicional.'}
                  </p>

                  {survey.targetAudience && (
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.4rem', fontSize: '0.82rem', color: 'var(--color-texto-muted)', marginBottom: '0.85rem' }}>
                      <Users size={14} style={{ marginTop: '0.15rem', flexShrink: 0 }} />
                      <span><strong>Destinatarios:</strong> {survey.targetAudience}</span>
                    </div>
                  )}

                  {survey.objective && (
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.4rem', fontSize: '0.82rem', color: 'var(--color-texto-muted)', marginBottom: '1rem' }}>
                      <Target size={14} style={{ marginTop: '0.15rem', flexShrink: 0 }} />
                      <span><strong>Objetivo:</strong> {survey.objective}</span>
                    </div>
                  )}
                </div>

                <div>
                  <div
                    style={{
                      borderTop: '1px solid var(--color-borde)',
                      paddingTop: '0.85rem',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      fontSize: '0.82rem',
                      color: 'var(--color-texto-muted)',
                    }}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <HelpCircle size={14} /> {survey.questions?.length || 0} preguntas
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <Calendar size={14} /> {new Date(survey.publishedAt || survey.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <button
                    className="btn btn-primary"
                    style={{ width: '100%', marginTop: '1rem' }}
                    onClick={() => onSelectSurvey(survey)}
                  >
                    Examinar Instrumento
                    <ArrowRight size={14} />
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
