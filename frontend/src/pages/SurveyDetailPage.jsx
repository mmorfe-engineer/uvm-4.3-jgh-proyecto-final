import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import {
  ArrowLeft,
  Calendar,
  User,
  Target,
  Users,
  CheckCircle2,
  FileText,
  HelpCircle,
  BarChart2,
  Send,
  AlertCircle,
  Info,
  RefreshCw,
} from 'lucide-react';

export default function SurveyDetailPage({ survey, onBack, user, onOpenAuth }) {
  const [activeTab, setActiveTab] = useState('participate');
  const [hasResponded, setHasResponded] = useState(false);
  const [checkingResponse, setCheckingResponse] = useState(false);
  const [answers, setAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(null);
  const [resultsData, setResultsData] = useState(null);
  const [resultsLoading, setResultsLoading] = useState(false);
  const [resultsError, setResultsError] = useState(null);

  // Comprobar si el participante autenticado ya respondió este instrumento
  useEffect(() => {
    let isMounted = true;
    const checkStatus = async () => {
      if (!user || !survey?._id) {
        setHasResponded(false);
        return;
      }
      setCheckingResponse(true);
      try {
        const res = await api.checkSurveyResponse(survey._id);
        if (isMounted) {
          const responded = Boolean(res.hasResponded);
          setHasResponded(responded);
          if (responded) {
            setActiveTab('results');
          }
        }
      } catch (err) {
        console.error('Error al verificar estado de respuesta:', err);
      } finally {
        if (isMounted) setCheckingResponse(false);
      }
    };

    checkStatus();
    return () => {
      isMounted = false;
    };
  }, [user, survey?._id]);

  // Cargar agregación de resultados reales
  const fetchResults = async () => {
    if (!survey?._id) return;
    setResultsLoading(true);
    setResultsError(null);
    try {
      const data = await api.getSurveyResults(survey._id);
      setResultsData(data);
    } catch (err) {
      setResultsError(err.message || 'Error al obtener los resultados agregados.');
    } finally {
      setResultsLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'results') {
      fetchResults();
    }
  }, [activeTab, survey?._id]);

  if (!survey) return null;

  const handleAnswerChange = (questionId, value) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
    if (submitError) setSubmitError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      onOpenAuth('login');
      return;
    }

    setSubmitError(null);
    setSubmitSuccess(null);

    // Validación de obligatoriedad en cliente
    for (const q of (survey.questions || [])) {
      if (q.required) {
        const val = answers[q.id];
        if (val === undefined || val === null || (typeof val === 'string' && val.trim() === '')) {
          setSubmitError(`La pregunta "${q.text}" es obligatoria y debe ser respondida.`);
          return;
        }
      }
    }

    const answersPayload = Object.entries(answers)
      .filter(([_, val]) => val !== undefined && val !== null && String(val).trim() !== '')
      .map(([questionId, value]) => ({ questionId, value }));

    if (answersPayload.length === 0) {
      setSubmitError('Debe responder al menos una pregunta antes de enviar el instrumento.');
      return;
    }

    setSubmitting(true);
    try {
      await api.submitResponse(survey._id, answersPayload);
      setSubmitSuccess('¡Participación registrada con éxito! Tu respuesta se ha persistido en la base de datos.');
      setHasResponded(true);
      fetchResults();
      setTimeout(() => {
        setActiveTab('results');
      }, 1200);
    } catch (err) {
      if (err.status === 409) {
        setHasResponded(true);
        setSubmitError('Ya has participado en esta encuesta formativa. Cada participante puede responder una sola vez.');
      } else {
        setSubmitError(err.message || 'Error al enviar las respuestas al servidor.');
      }
    } finally {
      setSubmitting(false);
    }
  };

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

        {/* Pestañas de Interacción: Participación vs Resultados */}
        <div
          style={{
            display: 'flex',
            borderBottom: '2px solid var(--color-borde)',
            marginBottom: '1.75rem',
            gap: '0.5rem',
          }}
        >
          <button
            type="button"
            className={`btn ${activeTab === 'participate' ? 'btn-primary' : 'btn-secondary'}`}
            style={{
              borderBottomLeftRadius: 0,
              borderBottomRightRadius: 0,
              borderBottom: activeTab === 'participate' ? '2px solid var(--color-dorado)' : 'none',
              padding: '0.65rem 1.25rem',
            }}
            onClick={() => setActiveTab('participate')}
          >
            <FileText size={16} />
            Responder Instrumento
          </button>
          <button
            type="button"
            className={`btn ${activeTab === 'results' ? 'btn-primary' : 'btn-secondary'}`}
            style={{
              borderBottomLeftRadius: 0,
              borderBottomRightRadius: 0,
              borderBottom: activeTab === 'results' ? '2px solid var(--color-dorado)' : 'none',
              padding: '0.65rem 1.25rem',
            }}
            onClick={() => setActiveTab('results')}
          >
            <BarChart2 size={16} />
            Resultados de la Consulta
          </button>
        </div>

        {/* ======================================================== */}
        {/* PESTAÑA 1: FORMULARIO DE PARTICIPACIÓN                   */}
        {/* ======================================================== */}
        {activeTab === 'participate' && (
          <div className="anim-fade-in">
            {/* Aviso para participantes ya registrados */}
            {hasResponded && (
              <div className="alert alert-success" style={{ marginBottom: '1.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <CheckCircle2 size={20} />
                  <span>
                    Ya has participado en este instrumento formativo. Tu respuesta está registrada de manera única e inmutable en la base de datos.
                  </span>
                </div>
                <button className="btn btn-secondary btn-sm" onClick={() => setActiveTab('results')}>
                  <BarChart2 size={14} /> Ver Resultados
                </button>
              </div>
            )}

            {/* Aviso para usuarios no autenticados */}
            {!user && (
              <div
                className="card"
                style={{
                  marginBottom: '1.75rem',
                  padding: '1.5rem',
                  background: 'var(--color-fondo)',
                  border: '1px solid var(--color-dorado)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '1rem',
                }}
              >
                <div>
                  <h3 style={{ fontSize: '1.05rem', color: 'var(--color-petroleo)', margin: '0 0 0.25rem 0' }}>
                    Identificación Académica Requerida
                  </h3>
                  <p style={{ color: 'var(--color-texto-muted)', fontSize: '0.88rem', margin: 0 }}>
                    Para participar e impedir respuestas duplicadas, debes iniciar sesión con tu cuenta universitaria.
                  </p>
                </div>
                <button className="btn btn-primary btn-sm" onClick={() => onOpenAuth('login')}>
                  <User size={14} /> Iniciar Sesión Universitaria
                </button>
              </div>
            )}

            {/* Feedback de envío */}
            {submitSuccess && (
              <div className="alert alert-success anim-fade-in" style={{ marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <CheckCircle2 size={18} />
                  <span>{submitSuccess}</span>
                </div>
              </div>
            )}

            {submitError && (
              <div className="alert alert-error anim-fade-in" style={{ marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <AlertCircle size={18} />
                  <span>{submitError}</span>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2rem' }}>
                {(survey.questions || []).map((q, idx) => (
                  <div key={q.id || idx} className="card" style={{ padding: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
                      <span style={{ fontWeight: 700, color: 'var(--color-petroleo)', fontSize: '0.9rem' }}>
                        Ítem #{idx + 1}
                      </span>
                      <span style={{ fontSize: '0.78rem', color: 'var(--color-texto-muted)' }}>
                        {q.type === 'single_choice' ? 'Selección Simple' : 'Respuesta Breve'}{' '}
                        {q.required && <strong style={{ color: 'var(--color-alerta)' }}>• Obligatoria</strong>}
                      </span>
                    </div>

                    <p style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--color-texto)', marginBottom: '1.25rem', lineHeight: 1.45 }}>
                      {q.text}
                    </p>

                    {/* Preguntas de Selección Simple */}
                    {q.type === 'single_choice' && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                        {(q.options || []).map((opt, optIdx) => {
                          const isSelected = answers[q.id] === opt;
                          return (
                            <label
                              key={optIdx}
                              style={{
                                padding: '0.85rem 1.1rem',
                                background: isSelected ? 'rgba(16, 61, 69, 0.05)' : '#ffffff',
                                border: isSelected ? '1.5px solid var(--color-petroleo)' : '1px solid var(--color-borde)',
                                borderRadius: 'var(--radius-sm)',
                                fontSize: '0.92rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem',
                                color: 'var(--color-texto)',
                                cursor: hasResponded || !user ? 'default' : 'pointer',
                                transition: 'all var(--trans-fast)',
                              }}
                            >
                              <input
                                type="radio"
                                name={`question_${q.id}`}
                                value={opt}
                                checked={isSelected}
                                disabled={hasResponded || !user || submitting}
                                onChange={() => handleAnswerChange(q.id, opt)}
                                style={{ accentColor: 'var(--color-petroleo)', width: 16, height: 16, cursor: 'pointer' }}
                              />
                              <span style={{ fontWeight: isSelected ? 600 : 400 }}>{opt}</span>
                            </label>
                          );
                        })}
                      </div>
                    )}

                    {/* Preguntas de Respuesta Breve */}
                    {q.type === 'short_text' && (
                      <div>
                        <textarea
                          rows={3}
                          className="form-textarea"
                          placeholder={
                            hasResponded || !user
                              ? 'Espacio de respuesta cualitativa formativa.'
                              : 'Escriba aquí su aporte o reflexión para la Cátedra...'
                          }
                          value={answers[q.id] || ''}
                          disabled={hasResponded || !user || submitting}
                          onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                          style={{ resize: 'vertical' }}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Botón de Enviar Respuestas */}
              {!hasResponded && (
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', alignItems: 'center' }}>
                  {!user && (
                    <span style={{ fontSize: '0.88rem', color: 'var(--color-texto-muted)' }}>
                      Inicia sesión para habilitar el envío de tus respuestas
                    </span>
                  )}
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={submitting || checkingResponse || !user}
                    style={{ minWidth: 200 }}
                  >
                    {submitting ? (
                      <>
                        <span className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} />
                        Registrando en base de datos...
                      </>
                    ) : (
                      <>
                        <Send size={15} />
                        Enviar Respuestas
                      </>
                    )}
                  </button>
                </div>
              )}
            </form>
          </div>
        )}

        {/* ======================================================== */}
        {/* PESTAÑA 2: RESULTADOS Y AGREGACIÓN DESCRIPTIVA REAL       */}
        {/* ======================================================== */}
        {activeTab === 'results' && (
          <div className="anim-fade-in">
            {/* Estado de Carga */}
            {resultsLoading && (
              <div style={{ textAlign: 'center', padding: '4rem 0' }}>
                <span className="spinner" style={{ width: 34, height: 34, borderWidth: 4 }} />
                <p style={{ marginTop: '1rem', color: 'var(--color-texto-muted)' }}>
                  Calculando agregación descriptiva en tiempo real sobre respuestas registradas...
                </p>
              </div>
            )}

            {/* Error de Carga */}
            {resultsError && !resultsLoading && (
              <div className="alert alert-error anim-fade-in" style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <AlertCircle size={20} />
                  <span>{resultsError}</span>
                </div>
                <button className="btn btn-secondary btn-sm" onClick={fetchResults}>
                  <RefreshCw size={14} /> Reintentar
                </button>
              </div>
            )}

            {/* Invariante de Fidelidad: Estado Cero Explícito cuando N = 0 */}
            {!resultsLoading && !resultsError && resultsData && resultsData.totalResponses === 0 && (
              <div className="card" style={{ textAlign: 'center', padding: '3.5rem 2rem' }}>
                <div style={{ marginBottom: '1rem' }}>
                  <BarChart2 size={44} color="var(--color-texto-muted)" />
                </div>
                <h3 style={{ fontSize: '1.3rem', color: 'var(--color-petroleo)', marginBottom: '0.5rem' }}>
                  Sin respuestas registradas aún en el sistema
                </h3>
                <p style={{ color: 'var(--color-texto-muted)', marginTop: '0.5rem', maxWidth: 500, marginInline: 'auto', lineHeight: 1.5 }}>
                  Sea el primer participante en responder este instrumento formativo. Los datos estadísticos y porcentajes
                  se calcularán automáticamente a partir de respuestas reales almacenadas en la base de datos MongoDB.
                </p>
                {!hasResponded && (
                  <button
                    className="btn btn-primary"
                    style={{ marginTop: '1.5rem' }}
                    onClick={() => setActiveTab('participate')}
                  >
                    <FileText size={15} /> Responder Este Instrumento
                  </button>
                )}
              </div>
            )}

            {/* Resultados Reales Agregados cuando N > 0 */}
            {!resultsLoading && !resultsError && resultsData && resultsData.totalResponses > 0 && (
              <div>
                {/* Métricas Generales */}
                <div
                  className="card"
                  style={{
                    background: 'var(--color-petroleo)',
                    color: '#ffffff',
                    marginBottom: '1.75rem',
                    padding: '1.25rem 1.75rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '1rem',
                  }}
                >
                  <div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--color-dorado)', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.5px' }}>
                      Muestra Estadística Registrada
                    </div>
                    <div style={{ fontSize: '1.75rem', fontWeight: 700, fontFamily: 'var(--font-serif)', marginTop: '0.2rem' }}>
                      {resultsData.totalResponses} {resultsData.totalResponses === 1 ? 'Participante' : 'Participantes'}
                    </div>
                  </div>

                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={fetchResults}
                    style={{
                      background: 'rgba(255, 255, 255, 0.15)',
                      color: '#ffffff',
                      borderColor: 'rgba(255, 255, 255, 0.3)',
                    }}
                    title="Actualizar datos agregados"
                  >
                    <RefreshCw size={14} /> Actualizar Resultados
                  </button>
                </div>

                {/* Desglose por Pregunta */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  {(resultsData.questions || []).map((q, qIdx) => (
                    <div key={q.questionId || qIdx} className="card" style={{ padding: '1.5rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
                        <span style={{ fontWeight: 700, color: 'var(--color-petroleo)', fontSize: '0.9rem' }}>
                          Ítem #{qIdx + 1}
                        </span>
                        <span style={{ fontSize: '0.78rem', color: 'var(--color-texto-muted)' }}>
                          {q.type === 'single_choice' ? 'Selección Simple' : 'Respuesta Breve'}
                        </span>
                      </div>

                      <p style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--color-texto)', marginBottom: '1.25rem', lineHeight: 1.45 }}>
                        {q.text}
                      </p>

                      {/* Agregación de Selección Simple */}
                      {q.type === 'single_choice' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                          {(q.options || []).map((opt, optIdx) => {
                            const count = q.counts ? q.counts[opt] || 0 : 0;
                            const percentage = q.percentages ? q.percentages[opt] || 0 : 0;

                            return (
                              <div key={optIdx} style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                                  <span style={{ fontWeight: 500, color: 'var(--color-texto)' }}>{opt}</span>
                                  <span style={{ color: 'var(--color-texto-muted)', fontSize: '0.85rem' }}>
                                    <strong>{count}</strong> ({percentage}%)
                                  </span>
                                </div>
                                <div
                                  style={{
                                    height: 10,
                                    width: '100%',
                                    background: 'var(--color-borde)',
                                    borderRadius: 5,
                                    overflow: 'hidden',
                                  }}
                                >
                                  <div
                                    style={{
                                      width: `${percentage}%`,
                                      height: '100%',
                                      background: 'var(--color-petroleo)',
                                      borderRadius: 5,
                                      transition: 'width 0.4s ease',
                                    }}
                                  />
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {/* Agregación de Texto Breve */}
                      {q.type === 'short_text' && (
                        <div
                          style={{
                            background: 'var(--color-fondo)',
                            border: '1px solid var(--color-borde)',
                            borderRadius: 'var(--radius-sm)',
                            padding: '1rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.6rem',
                            fontSize: '0.9rem',
                            color: 'var(--color-texto)',
                          }}
                        >
                          <Info size={16} color="var(--color-petroleo)" style={{ flexShrink: 0 }} />
                          <span>
                            Total de aportes reflexivos recibidos para este ítem: <strong>{q.answeredCount || 0}</strong>
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Cierre Institucional */}
        <div
          style={{
            borderTop: '1px solid var(--color-borde)',
            paddingTop: '1.5rem',
            marginTop: '2.5rem',
            textAlign: 'center',
            color: 'var(--color-texto-muted)',
            fontSize: '0.82rem',
          }}
        >
          Cátedra Libre Dr. José Gregorio Hernández · Módulo de Participación, Unicidad y Métricas Formativas · UVM 2026
        </div>
      </div>
    </div>
  );
}
