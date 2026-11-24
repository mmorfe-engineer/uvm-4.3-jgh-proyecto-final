import React from 'react';

export default function HomePage({ onNavigate, surveyCount = 0 }) {
  return (
    <div className="anim-fade-in" style={{ padding: '2.5rem 0' }}>
      <div className="container">
        {/* Hero Section */}
        <div
          style={{
            background: 'linear-gradient(135deg, var(--color-petroleo) 0%, var(--color-petroleo-dark) 100%)',
            color: '#ffffff',
            borderRadius: 'var(--radius-lg)',
            padding: '3.5rem 2.5rem',
            marginBottom: '3rem',
            boxShadow: 'var(--shadow-lg)',
            border: '1px solid rgba(240, 211, 154, 0.2)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div style={{ maxWidth: '780px', position: 'relative', zIndex: 2 }}>
            <div
              style={{
                display: 'inline-block',
                background: 'rgba(240, 211, 154, 0.2)',
                color: 'var(--color-dorado)',
                padding: '0.3rem 0.8rem',
                borderRadius: '20px',
                fontSize: '0.82rem',
                fontWeight: 600,
                marginBottom: '1rem',
                textTransform: 'uppercase',
                letterSpacing: '1px',
              }}
            >
              Cátedra Libre Dr. José Gregorio Hernández
            </div>
            <h1
              style={{
                fontSize: '2.5rem',
                color: '#ffffff',
                marginBottom: '1.25rem',
                letterSpacing: '-0.5px',
              }}
            >
              Sistema de Encuestas Formativas y Participación Comunitaria
            </h1>
            <p
              style={{
                fontSize: '1.1rem',
                lineHeight: 1.6,
                color: '#eceff1',
                marginBottom: '2rem',
              }}
            >
              Plataforma académica diseñada para consultar, recolectar y analizar percepciones formativas sobre bioética, solidaridad activa y vocación de servicio ciudadano en la Universidad Valle del Momboy.
            </p>

            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <button
                className="btn btn-dorado"
                onClick={() => onNavigate('surveys')}
                style={{ fontSize: '1rem', padding: '0.8rem 1.6rem' }}
              >
                📋 Explorar Encuestas Disponibles
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => onNavigate('contact')}
                style={{
                  fontSize: '1rem',
                  padding: '0.8rem 1.6rem',
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: '#ffffff',
                  borderColor: 'rgba(255, 255, 255, 0.3)',
                }}
              >
                ✉️ Solicitud de Jornada / Contacto
              </button>
            </div>
          </div>
        </div>

        {/* Ejes Formativos */}
        <div style={{ marginBottom: '3rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h2>Ejes de Formación y Diálogo Académico</h2>
            <p style={{ color: 'var(--color-texto-muted)', marginTop: '0.4rem' }}>
              Consultas orientadas a fortalecer el compromiso ético y social de la comunidad universitaria
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '1.5rem',
            }}
          >
            <div className="card">
              <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>🩺</div>
              <h3 className="card-title">Bioética y Salud Integral</h3>
              <p style={{ color: 'var(--color-texto-muted)', fontSize: '0.92rem' }}>
                Estudios sobre la dignidad humana, la ética médica y la atención prioritaria a sectores vulnerables inspirados en el ejemplo del Dr. JGH.
              </p>
            </div>

            <div className="card">
              <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>🤝</div>
              <h3 className="card-title">Valores Ciudadanos y Servicio</h3>
              <p style={{ color: 'var(--color-texto-muted)', fontSize: '0.92rem' }}>
                Sondeos sobre responsabilidad comunitaria, honestidad profesional y la integración universitaria con las necesidades locales.
              </p>
            </div>

            <div className="card">
              <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>📚</div>
              <h3 className="card-title">Formación Académica UVM</h3>
              <p style={{ color: 'var(--color-texto-muted)', fontSize: '0.92rem' }}>
                Evaluación continua de talleres, cátedras libres y proyectos de aprendizaje en servicio desarrollados en la Universidad Valle del Momboy.
              </p>
            </div>
          </div>
        </div>

        {/* Resumen del Sistema */}
        <div
          style={{
            background: 'var(--color-panel)',
            border: '1px solid var(--color-borde)',
            borderRadius: 'var(--radius-lg)',
            padding: '2rem',
            display: 'flex',
            justifyContent: 'space-around',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1.5rem',
            textAlign: 'center',
          }}
        >
          <div>
            <div style={{ fontSize: '2.2rem', fontWeight: 700, color: 'var(--color-petroleo)' }}>
              {surveyCount}
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--color-texto-muted)', textTransform: 'uppercase' }}>
              Encuestas Activas
            </div>
          </div>
          <div style={{ width: 1, height: 40, background: 'var(--color-borde)' }} />
          <div>
            <div style={{ fontSize: '2.2rem', fontWeight: 700, color: 'var(--color-petroleo)' }}>
              100 %
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--color-texto-muted)', textTransform: 'uppercase' }}>
              Persistencia NoSQL (MongoDB)
            </div>
          </div>
          <div style={{ width: 1, height: 40, background: 'var(--color-borde)' }} />
          <div>
            <div style={{ fontSize: '2.2rem', fontWeight: 700, color: 'var(--color-petroleo)' }}>
              RBAC
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--color-texto-muted)', textTransform: 'uppercase' }}>
              Seguridad Admin / Participante
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
