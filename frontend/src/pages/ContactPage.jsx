import React, { useState } from 'react';
import { api } from '../services/api';
import { CheckCircle2, AlertTriangle, GraduationCap, Users, Building2, Paperclip, Send } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    proposedDate: '',
    estimatedParticipants: '',
    requestType: 'academica',
    message: '',
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [fileError, setFileError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [successResponse, setSuccessResponse] = useState(null);
  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'El nombre completo es obligatorio.';
    if (!formData.email.trim()) {
      errs.email = 'El correo electrónico es obligatorio.';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      errs.email = 'Por favor ingrese una dirección de correo válida.';
    }
    if (!formData.phone.trim()) {
      errs.phone = 'El teléfono de contacto es obligatorio.';
    } else if (formData.phone.trim().length < 7) {
      errs.phone = 'Ingrese un número telefónico válido (mínimo 7 dígitos).';
    }
    if (!formData.proposedDate) errs.proposedDate = 'La fecha propuesta es obligatoria.';
    if (!formData.estimatedParticipants) {
      errs.estimatedParticipants = 'La cantidad de participantes es obligatoria.';
    } else {
      const n = parseInt(formData.estimatedParticipants, 10);
      if (isNaN(n) || n <= 0) errs.estimatedParticipants = 'Debe ser un número mayor a 0.';
      if (n > 5000) errs.estimatedParticipants = 'El límite máximo es 5,000 participantes.';
    }
    if (!formData.requestType) errs.requestType = 'Debe seleccionar un tipo de solicitud.';
    if (!formData.message.trim()) errs.message = 'El mensaje descriptivo es obligatorio.';

    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFileError(null);

    if (!file) {
      setSelectedFile(null);
      return;
    }

    const allowedTypes = ['application/pdf', 'image/png', 'image/jpeg'];
    if (!allowedTypes.includes(file.type)) {
      setFileError('Tipo de archivo no permitido. Solo se admiten documentos PDF e imágenes PNG o JPEG.');
      setSelectedFile(null);
      return;
    }

    const maxSize = 3 * 1024 * 1024; // 3MB
    if (file.size > maxSize) {
      setFileError('El archivo excede el tamaño máximo permitido de 3 MB.');
      setSelectedFile(null);
      return;
    }

    setSelectedFile(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessResponse(null);

    if (!validate()) {
      return;
    }

    setLoading(true);

    try {
      const payload = new FormData();
      payload.append('name', formData.name);
      payload.append('email', formData.email);
      payload.append('phone', formData.phone);
      payload.append('proposedDate', formData.proposedDate);
      payload.append('estimatedParticipants', formData.estimatedParticipants);
      payload.append('requestType', formData.requestType);
      payload.append('message', formData.message);

      if (selectedFile) {
        payload.append('file', selectedFile);
      }

      const res = await api.submitContact(payload);
      setSuccessResponse(res);
      // Limpiar formulario tras éxito
      setFormData({
        name: '',
        email: '',
        phone: '',
        proposedDate: '',
        estimatedParticipants: '',
        requestType: 'academica',
        message: '',
      });
      setSelectedFile(null);
      setFieldErrors({});
    } catch (err) {
      setError(err.message || 'Error al enviar la solicitud de contacto');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="anim-fade-in" style={{ padding: '2.5rem 0' }}>
      <div className="container" style={{ maxWidth: 760 }}>
        <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
          <h2>Formulario de Contacto y Solicitud Formativa</h2>
          <p style={{ color: 'var(--color-texto-muted)', marginTop: '0.4rem', fontSize: '0.95rem' }}>
            Canal oficial para coordinar jornadas, talleres o mesas de diálogo vinculadas a la Cátedra Libre Dr. José Gregorio Hernández.
          </p>
        </div>

        {/* Mensaje de Éxito */}
        {successResponse && (
          <div className="alert alert-success anim-slide-down" style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
            <CheckCircle2 size={22} style={{ color: 'var(--color-exito)', flexShrink: 0, marginTop: '0.15rem' }} />
            <div style={{ flex: 1 }}>
              <h4 style={{ color: 'var(--color-exito)', marginBottom: '0.3rem' }}>
                Solicitud registrada exitosamente en base de datos
              </h4>
              <p style={{ fontSize: '0.9rem' }}>
                Estimado/a <strong>{successResponse.name}</strong>, su solicitud (ID: <code>{successResponse.submissionId}</code>) ha sido guardada en nuestra base de datos.
                {successResponse.hasAttachment && ' El documento adjunto fue verificado y almacenado de forma segura.'}
              </p>
            </div>
            <button className="btn btn-secondary btn-sm" onClick={() => setSuccessResponse(null)}>
              Cerrar
            </button>
          </div>
        )}

        {/* Mensaje de Error General */}
        {error && (
          <div className="alert alert-error anim-fade-in" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <AlertTriangle size={18} style={{ flexShrink: 0 }} />
            <span style={{ flex: 1 }}>{error}</span>
            <button className="btn btn-secondary btn-sm" onClick={() => setError(null)}>
              Cerrar
            </button>
          </div>
        )}

        <div className="card">
          <form onSubmit={handleSubmit} noValidate>
            {/* Campo 1: Texto (Nombre) */}
            <div className="form-group">
              <label className="form-label" htmlFor="name">
                Nombre Completo o Institución *
              </label>
              <input
                id="name"
                type="text"
                className="form-input"
                placeholder="Ej. Dra. Beatriz Mendoza"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
              {fieldErrors.name && <span className="form-error">{fieldErrors.name}</span>}
            </div>

            {/* Grid 2 Columnas: Email y Teléfono */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              {/* Campo 2: Email */}
              <div className="form-group">
                <label className="form-label" htmlFor="email">
                  Correo Electrónico *
                </label>
                <input
                  id="email"
                  type="email"
                  className="form-input"
                  placeholder="solicitante@ejemplo.edu.ve"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
                {fieldErrors.email && <span className="form-error">{fieldErrors.email}</span>}
              </div>

              {/* Campo 3: Teléfono */}
              <div className="form-group">
                <label className="form-label" htmlFor="phone">
                  Teléfono de Contacto *
                </label>
                <input
                  id="phone"
                  type="tel"
                  className="form-input"
                  placeholder="+58 412 1234567"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
                {fieldErrors.phone && <span className="form-error">{fieldErrors.phone}</span>}
              </div>
            </div>

            {/* Grid 2 Columnas: Fecha y Número */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              {/* Campo 4: Date */}
              <div className="form-group">
                <label className="form-label" htmlFor="proposedDate">
                  Fecha Propuesta de Actividad *
                </label>
                <input
                  id="proposedDate"
                  type="date"
                  className="form-input"
                  value={formData.proposedDate}
                  onChange={(e) => setFormData({ ...formData, proposedDate: e.target.value })}
                />
                {fieldErrors.proposedDate && <span className="form-error">{fieldErrors.proposedDate}</span>}
              </div>

              {/* Campo 5: Number */}
              <div className="form-group">
                <label className="form-label" htmlFor="estimatedParticipants">
                  Cantidad Estimada de Participantes *
                </label>
                <input
                  id="estimatedParticipants"
                  type="number"
                  min="1"
                  max="5000"
                  className="form-input"
                  placeholder="Ej. 60"
                  value={formData.estimatedParticipants}
                  onChange={(e) => setFormData({ ...formData, estimatedParticipants: e.target.value })}
                />
                {fieldErrors.estimatedParticipants && (
                  <span className="form-error">{fieldErrors.estimatedParticipants}</span>
                )}
              </div>
            </div>

            {/* Campo 6: Radio Buttons (Tipo de Solicitud) */}
            <div className="form-group">
              <label className="form-label">Tipo de Solicitud Formativa (Radio) *</label>
              <div className="radio-group">
                <label className="radio-label">
                  <input
                    type="radio"
                    name="requestType"
                    value="academica"
                    checked={formData.requestType === 'academica'}
                    onChange={(e) => setFormData({ ...formData, requestType: e.target.value })}
                  />
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                    <GraduationCap size={16} color="var(--color-petroleo)" /> Cátedra / Conferencia Académica
                  </span>
                </label>
                <label className="radio-label">
                  <input
                    type="radio"
                    name="requestType"
                    value="comunitaria"
                    checked={formData.requestType === 'comunitaria'}
                    onChange={(e) => setFormData({ ...formData, requestType: e.target.value })}
                  />
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Users size={16} color="var(--color-petroleo)" /> Jornada Comunitaria / Asistencial
                  </span>
                </label>
                <label className="radio-label">
                  <input
                    type="radio"
                    name="requestType"
                    value="institucional"
                    checked={formData.requestType === 'institucional'}
                    onChange={(e) => setFormData({ ...formData, requestType: e.target.value })}
                  />
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Building2 size={16} color="var(--color-petroleo)" /> Alianza Institucional / Taller
                  </span>
                </label>
              </div>
              {fieldErrors.requestType && <span className="form-error">{fieldErrors.requestType}</span>}
            </div>

            {/* Campo 7: File Upload */}
            <div className="form-group">
              <label className="form-label" htmlFor="fileUpload">
                Documento o Aval Adjunto (File: PDF, PNG, JPG - Máx 3 MB)
              </label>
              <div className="file-dropzone" onClick={() => document.getElementById('fileUpload').click()}>
                <input
                  id="fileUpload"
                  type="file"
                  style={{ display: 'none' }}
                  accept=".pdf,image/png,image/jpeg"
                  onChange={handleFileChange}
                />
                <Paperclip size={26} color="var(--color-petroleo)" style={{ margin: '0 auto 0.4rem', display: 'block' }} />
                <p style={{ fontSize: '0.9rem', color: 'var(--color-texto)' }}>
                  {selectedFile ? (
                    <strong>Archivo seleccionado: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)</strong>
                  ) : (
                    'Haga clic para seleccionar o adjuntar un archivo justificativo'
                  )}
                </p>
                <span style={{ fontSize: '0.78rem', color: 'var(--color-texto-muted)' }}>
                  Formatos autorizados: PDF, PNG o JPEG (Límite estricto: 3 MB)
                </span>
              </div>
              {selectedFile && (
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  style={{ marginTop: '0.5rem', fontSize: '0.75rem' }}
                  onClick={() => setSelectedFile(null)}
                >
                  Quitar archivo
                </button>
              )}
              {fileError && <span className="form-error">{fileError}</span>}
            </div>

            {/* Campo 8: Textarea */}
            <div className="form-group">
              <label className="form-label" htmlFor="message">
                Descripción Detallada de la Propuesta *
              </label>
              <textarea
                id="message"
                rows="4"
                className="form-textarea"
                placeholder="Indique los objetivos específicos, el público al que va dirigida la actividad y los requerimientos formativos..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              />
              {fieldErrors.message && <span className="form-error">{fieldErrors.message}</span>}
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', padding: '0.85rem', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner spinner-light" />
                  <span>Enviando y persistiendo solicitud en base de datos...</span>
                </>
              ) : (
                <>
                  <Send size={16} />
                  <span>Enviar Solicitud de Contacto</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
