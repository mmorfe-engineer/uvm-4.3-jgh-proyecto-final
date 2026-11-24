import React, { useState, useEffect } from 'react';
import { api } from '../services/api';

export default function AdminDashboardPage({ user }) {
  const [activeTab, setActiveTab] = useState('surveys'); // 'surveys' | 'create_survey' | 'contacts'
  const [surveys, setSurveys] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [feedback, setFeedback] = useState(null);

  // Estado para creación de nueva encuesta
  const [newSurvey, setNewSurvey] = useState({
    title: '',
    topic: 'Bioética y Salud',
    description: '',
    questions: [
      {
        id: 'q1',
        text: '',
        type: 'single_choice',
        required: true,
        options: ['Totalmente de acuerdo', 'De acuerdo', 'En desacuerdo'],
      },
    ],
  });

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [surveysData, contactsData] = await Promise.all([
        api.getSurveys(),
        api.getAdminContacts(),
      ]);
      setSurveys(surveysData.surveys || []);
      setContacts(contactsData.contacts || []);
    } catch (err) {
      setError(err.message || 'Error al cargar datos administrativos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Agregar pregunta al formulario
  const addQuestion = () => {
    setNewSurvey({
      ...newSurvey,
      questions: [
        ...newSurvey.questions,
        {
          id: `q_${Date.now()}`,
          text: '',
          type: 'single_choice',
          required: true,
          options: ['Opción 1', 'Opción 2'],
        },
      ],
    });
  };

  // Quitar pregunta
  const removeQuestion = (idx) => {
    const updated = newSurvey.questions.filter((_, i) => i !== idx);
    setNewSurvey({ ...newSurvey, questions: updated });
  };

  // Actualizar pregunta
  const updateQuestion = (idx, field, val) => {
    const updated = [...newSurvey.questions];
    updated[idx][field] = val;
    setNewSurvey({ ...newSurvey, questions: updated });
  };

  // Actualizar opciones de pregunta de selección
  const updateOption = (qIdx, optIdx, val) => {
    const updated = [...newSurvey.questions];
    updated[qIdx].options[optIdx] = val;
    setNewSurvey({ ...newSurvey, questions: updated });
  };

  const addOption = (qIdx) => {
    const updated = [...newSurvey.questions];
    updated[qIdx].options.push(`Opción ${updated[qIdx].options.length + 1}`);
    setNewSurvey({ ...newSurvey, questions: updated });
  };

  const removeOption = (qIdx, optIdx) => {
    const updated = [...newSurvey.questions];
    updated[qIdx].options = updated[qIdx].options.filter((_, i) => i !== optIdx);
    setNewSurvey({ ...newSurvey, questions: updated });
  };

  // Publicar o cerrar encuesta
  const handleUpdateStatus = async (surveyId, newStatus) => {
    setError(null);
    setFeedback(null);
    try {
      await api.updateSurvey(surveyId, { status: newStatus });
      setFeedback(`Encuesta actualizada con éxito al estado '${newStatus}'.`);
      loadData();
    } catch (err) {
      setError(err.message || 'Error al actualizar estado de la encuesta');
    }
  };

  // Enviar creación de nueva encuesta
  const handleCreateSurvey = async (e) => {
    e.preventDefault();
    setError(null);
    setFeedback(null);

    if (!newSurvey.title.trim() || !newSurvey.topic.trim()) {
      setError('El título y el tópico son obligatorios.');
      return;
    }

    if (newSurvey.questions.length === 0 || !newSurvey.questions[0].text.trim()) {
      setError('Debe incluir al menos una pregunta con texto.');
      return;
    }

    try {
      await api.createSurvey(newSurvey);
      setFeedback('¡Encuesta creada con éxito en estado borrador!');
      setNewSurvey({
        title: '',
        topic: 'Bioética y Salud',
        description: '',
        questions: [
          {
            id: 'q1',
            text: '',
            type: 'single_choice',
            required: true,
            options: ['Totalmente de acuerdo', 'De acuerdo', 'En desacuerdo'],
          },
        ],
      });
      setActiveTab('surveys');
      loadData();
    } catch (err) {
      setError(err.message || 'Error al crear la encuesta');
    }
  };

  return (
    <div className="anim-fade-in" style={{ padding: '2.5rem 0' }}>
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div>
            <h2>Panel de Control Administrativo</h2>
            <p style={{ color: 'var(--color-texto-muted)' }}>
              Gestión académica autorizada · Sesión activa: <strong>{user?.name}</strong> (Rol: <code>admin</code>)
            </p>
          </div>
          <button className="btn btn-secondary btn-sm" onClick={loadData}>
            🔄 Actualizar Datos
          </button>
        </div>

        {/* Notificaciones */}
        {feedback && (
          <div className="alert alert-success anim-slide-down">
            <span>✅ {feedback}</span>
            <button className="btn btn-secondary btn-sm" onClick={() => setFeedback(null)}>
              ✕
            </button>
          </div>
        )}
        {error && (
          <div className="alert alert-error anim-fade-in">
            <span>⚠️ {error}</span>
            <button className="btn btn-secondary btn-sm" onClick={() => setError(null)}>
              ✕
            </button>
          </div>
        )}

        {/* Pestañas */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '2px solid var(--color-borde)', paddingBottom: '0.5rem' }}>
          <button
            className={`btn btn-sm ${activeTab === 'surveys' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('surveys')}
          >
            📋 Encuestas Registradas ({surveys.length})
          </button>
          <button
            className={`btn btn-sm ${activeTab === 'create_survey' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('create_survey')}
          >
            ➕ Crear Nueva Encuesta
          </button>
          <button
            className={`btn btn-sm ${activeTab === 'contacts' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('contacts')}
          >
            📬 Solicitudes de Contacto ({contacts.length})
          </button>
        </div>

        {/* Loading Spinner */}
        {loading && (
          <div style={{ textAlign: 'center', padding: '3rem 0' }}>
            <span className="spinner" />
          </div>
        )}

        {/* TAB 1: Encuestas */}
        {!loading && activeTab === 'surveys' && (
          <div className="card">
            <h3 style={{ marginBottom: '1rem' }}>Listado de Encuestas en el Sistema</h3>
            {surveys.length === 0 ? (
              <p style={{ color: 'var(--color-texto-muted)' }}>No hay encuestas registradas.</p>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid var(--color-borde)', color: 'var(--color-petroleo)' }}>
                      <th style={{ padding: '0.75rem 0.5rem' }}>Título</th>
                      <th style={{ padding: '0.75rem 0.5rem' }}>Tópico</th>
                      <th style={{ padding: '0.75rem 0.5rem' }}>Preguntas</th>
                      <th style={{ padding: '0.75rem 0.5rem' }}>Estado</th>
                      <th style={{ padding: '0.75rem 0.5rem' }}>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {surveys.map((s) => (
                      <tr key={s._id} style={{ borderBottom: '1px solid var(--color-borde)' }}>
                        <td style={{ padding: '0.75rem 0.5rem', fontWeight: 600 }}>{s.title}</td>
                        <td style={{ padding: '0.75rem 0.5rem' }}>{s.topic}</td>
                        <td style={{ padding: '0.75rem 0.5rem' }}>{s.questions?.length || 0}</td>
                        <td style={{ padding: '0.75rem 0.5rem' }}>
                          <span className={`badge badge-${s.status}`}>{s.status}</span>
                        </td>
                        <td style={{ padding: '0.75rem 0.5rem' }}>
                          {s.status === 'draft' && (
                            <button
                              className="btn btn-dorado btn-sm"
                              onClick={() => handleUpdateStatus(s._id, 'published')}
                            >
                              Publicar
                            </button>
                          )}
                          {s.status === 'published' && (
                            <button
                              className="btn btn-secondary btn-sm"
                              onClick={() => handleUpdateStatus(s._id, 'closed')}
                            >
                              Cerrar
                            </button>
                          )}
                          {s.status === 'closed' && (
                            <button
                              className="btn btn-secondary btn-sm"
                              onClick={() => handleUpdateStatus(s._id, 'published')}
                            >
                              Republicar
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: Crear Encuesta */}
        {!loading && activeTab === 'create_survey' && (
          <div className="card">
            <h3 style={{ marginBottom: '1.25rem' }}>Diseño de Nueva Encuesta Formativa</h3>
            <form onSubmit={handleCreateSurvey}>
              <div className="form-group">
                <label className="form-label">Título de la Encuesta *</label>
                <input
                  type="text"
                  className="form-input"
                  required
                  placeholder="Ej. Diagnóstico de Necesidades Bioéticas en Trujillo"
                  value={newSurvey.title}
                  onChange={(e) => setNewSurvey({ ...newSurvey, title: e.target.value })}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Área Temática *</label>
                  <select
                    className="form-select"
                    value={newSurvey.topic}
                    onChange={(e) => setNewSurvey({ ...newSurvey, topic: e.target.value })}
                  >
                    <option value="Bioética y Salud">Bioética y Salud</option>
                    <option value="Valores Ciudadanos">Valores Ciudadanos</option>
                    <option value="Educación y Comunidad">Educación y Comunidad</option>
                    <option value="Salud y Asistencia">Salud y Asistencia</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Descripción Breve</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Objetivo principal del instrumento..."
                    value={newSurvey.description}
                    onChange={(e) => setNewSurvey({ ...newSurvey, description: e.target.value })}
                  />
                </div>
              </div>

              {/* Constructor de Preguntas */}
              <div style={{ marginTop: '1.5rem', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h4>Preguntas del Instrumento ({newSurvey.questions.length})</h4>
                  <button type="button" className="btn btn-secondary btn-sm" onClick={addQuestion}>
                    ➕ Agregar Pregunta
                  </button>
                </div>

                {newSurvey.questions.map((q, qIdx) => (
                  <div key={q.id || qIdx} className="card" style={{ padding: '1rem', marginBottom: '1rem', background: '#ffffff' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <span style={{ fontWeight: 600 }}>Pregunta #{qIdx + 1}</span>
                      {newSurvey.questions.length > 1 && (
                        <button
                          type="button"
                          className="btn btn-danger btn-sm"
                          style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem' }}
                          onClick={() => removeQuestion(qIdx)}
                        >
                          Eliminar
                        </button>
                      )}
                    </div>

                    <div className="form-group">
                      <input
                        type="text"
                        className="form-input"
                        required
                        placeholder="Redacte la pregunta..."
                        value={q.text}
                        onChange={(e) => updateQuestion(qIdx, 'text', e.target.value)}
                      />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      <div className="form-group">
                        <label className="form-label" style={{ fontSize: '0.8rem' }}>Tipo de Pregunta</label>
                        <select
                          className="form-select"
                          value={q.type}
                          onChange={(e) => updateQuestion(qIdx, 'type', e.target.value)}
                        >
                          <option value="single_choice">Selección Única (Opciones)</option>
                          <option value="short_text">Texto Corto</option>
                        </select>
                      </div>

                      <div className="form-group" style={{ display: 'flex', alignItems: 'center', marginTop: '1.5rem' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.9rem' }}>
                          <input
                            type="checkbox"
                            checked={q.required}
                            onChange={(e) => updateQuestion(qIdx, 'required', e.target.checked)}
                          />
                          Respuesta Obligatoria
                        </label>
                      </div>
                    </div>

                    {/* Opciones si es single_choice */}
                    {q.type === 'single_choice' && (
                      <div style={{ background: '#faf8f3', padding: '0.8rem', borderRadius: 'var(--radius-sm)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                          <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Opciones de respuesta:</span>
                          <button
                            type="button"
                            className="btn btn-secondary btn-sm"
                            style={{ fontSize: '0.7rem', padding: '0.15rem 0.4rem' }}
                            onClick={() => addOption(qIdx)}
                          >
                            + Opción
                          </button>
                        </div>
                        {q.options.map((opt, optIdx) => (
                          <div key={optIdx} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.35rem' }}>
                            <input
                              type="text"
                              className="form-input"
                              style={{ padding: '0.35rem 0.6rem', fontSize: '0.85rem' }}
                              value={opt}
                              onChange={(e) => updateOption(qIdx, optIdx, e.target.value)}
                            />
                            {q.options.length > 2 && (
                              <button
                                type="button"
                                className="btn btn-danger btn-sm"
                                style={{ padding: '0.2rem 0.5rem' }}
                                onClick={() => removeOption(qIdx, optIdx)}
                              >
                                ✕
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                Guardar Encuesta en Borrador
              </button>
            </form>
          </div>
        )}

        {/* TAB 3: Contactos */}
        {!loading && activeTab === 'contacts' && (
          <div className="card">
            <h3 style={{ marginBottom: '1rem' }}>Solicitudes de Contacto y Archivos Recibidos</h3>
            {contacts.length === 0 ? (
              <p style={{ color: 'var(--color-texto-muted)' }}>No se han recibido solicitudes de contacto aún.</p>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid var(--color-borde)', color: 'var(--color-petroleo)' }}>
                      <th style={{ padding: '0.75rem 0.5rem' }}>Nombre</th>
                      <th style={{ padding: '0.75rem 0.5rem' }}>Correo / Teléfono</th>
                      <th style={{ padding: '0.75rem 0.5rem' }}>Fecha Propuesta</th>
                      <th style={{ padding: '0.75rem 0.5rem' }}>Participantes</th>
                      <th style={{ padding: '0.75rem 0.5rem' }}>Tipo</th>
                      <th style={{ padding: '0.75rem 0.5rem' }}>Mensaje</th>
                      <th style={{ padding: '0.75rem 0.5rem' }}>Adjunto</th>
                    </tr>
                  </thead>
                  <tbody>
                    {contacts.map((c) => (
                      <tr key={c._id} style={{ borderBottom: '1px solid var(--color-borde)' }}>
                        <td style={{ padding: '0.75rem 0.5rem', fontWeight: 600 }}>{c.name}</td>
                        <td style={{ padding: '0.75rem 0.5rem' }}>
                          <div>{c.email}</div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--color-texto-muted)' }}>{c.phone}</div>
                        </td>
                        <td style={{ padding: '0.75rem 0.5rem' }}>
                          {new Date(c.proposedDate).toLocaleDateString()}
                        </td>
                        <td style={{ padding: '0.75rem 0.5rem' }}>{c.estimatedParticipants}</td>
                        <td style={{ padding: '0.75rem 0.5rem' }}>
                          <span className="badge badge-topic">{c.requestType}</span>
                        </td>
                        <td style={{ padding: '0.75rem 0.5rem', maxWidth: 220 }}>
                          <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={c.message}>
                            {c.message}
                          </div>
                        </td>
                        <td style={{ padding: '0.75rem 0.5rem' }}>
                          {c.attachmentMetadata ? (
                            <a
                              href={api.getAttachmentDownloadUrl(c._id)}
                              target="_blank"
                              rel="noreferrer"
                              className="btn btn-secondary btn-sm"
                              style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem' }}
                            >
                              📎 {c.attachmentMetadata.originalName}
                            </a>
                          ) : (
                            <span style={{ color: 'var(--color-texto-muted)', fontSize: '0.8rem' }}>Sin adjunto</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
