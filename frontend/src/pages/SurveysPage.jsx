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
  Search,
  X,
} from 'lucide-react';

export default function SurveysPage({ onSelectSurvey, user }) {
  const [surveys, setSurveys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchSurveys = async (topic = '', search = '') => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getSurveys(topic, search);
      setSurveys(data.surveys || []);
    } catch (err) {
      setError(err.message || 'Error al conectar con la API de encuestas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchSurveys(selectedTopic, searchTerm);
    }, 250);
    return () => clearTimeout(timer);
  }, [selectedTopic, searchTerm]);

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
            marginBottom: '1.75rem',
            borderBottom: '1px solid var(--color-borde)',
            paddingBottom: '1.25rem',
          }}
        >
          <h2 style={{ fontSize: '1.85rem', color: 'var(--color-petroleo)', margin: 0 }}>
            Consultas e Instrumentos Formativos
          </h2>
          <p style={{ color: 'var(--color-texto-muted)', marginTop: '0.35rem', fontSize: '0.95rem' }}>
            Modelos de consulta académica formativa para la Cátedra Libre Dr. José Gregorio Hernández (UVM)
          </p>
        </div>

        {/* Barra de Búsqueda y Filtros Dinámicos */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            marginBottom: '2rem',
            background: 'var(--color-panel)',
            padding: '1.25rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--color-borde)',
          }}
        >
          <div style={{ position: 'relative', width: '100%', maxWidth: 560 }}>
            <Search
              size={18}
              color="var(--color-texto-muted)"
              style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }}
            />
            <input
              type="text"
              className="form-input"
              placeholder="Buscar por título, temática, descripción u objetivo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ paddingLeft: '2.75rem', paddingRight: searchTerm ? '2.5rem' : '1rem' }}
              aria-label="Buscar consultas e instrumentos formativos"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                style={{
                  position: 'absolute',
                  right: '0.75rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '0.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  color: 'var(--color-texto-muted)',
                }}
                title="Limpiar búsqueda"
                aria-label="Limpiar búsqueda"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Filtro por Eje Temático */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--color-texto-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <Filter size={14} /> Eje Temático:
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
            <button className="btn btn-secondary btn-sm" onClick={() => fetchSurveys(selectedTopic, searchTerm)}>
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
              {searchTerm || selectedTopic
                ? 'No se encontraron instrumentos que coincidan con la búsqueda'
                : 'No se encontraron instrumentos activos'}
            </h3>
            <p style={{ color: 'var(--color-texto-muted)', marginTop: '0.5rem', maxWidth: 480, marginInline: 'auto' }}>
              {searchTerm || selectedTopic
                ? 'Intenta modificando los términos de búsqueda o eliminando el filtro temático para explorar todas las consultas.'
                : 'Actualmente no existen consultas publicadas para el criterio seleccionado. Los responsables académicos pueden gestionar nuevos instrumentos desde el panel de administración.'}
            </p>
            {(selectedTopic || searchTerm) && (
              <button
                className="btn btn-secondary btn-sm"
                style={{ marginTop: '1.25rem' }}
                onClick={() => {
                  setSelectedTopic('');
                  setSearchTerm('');
                }}
              >
                Restablecer Búsqueda y Filtros
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
