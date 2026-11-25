import React from 'react';
import portraitSmall from '../assets/jgh-intarsia-384.webp';
import portraitLarge from '../assets/jgh-intarsia-768.webp';
import {
  FileText,
  Mail,
  HeartPulse,
  Users,
  GraduationCap,
  Sparkles,
  ArrowRight,
  ClipboardList,
  CheckCircle2,
  TrendingUp,
  Lightbulb,
} from 'lucide-react';

export default function HomePage({ onNavigate, surveyCount = 0 }) {
  return (
    <div className="anim-fade-in">
      {/* 1. Hero Band Editorial con Herencia Canónica JGH 4.2 */}
      <section className="hero-band" aria-labelledby="hero-title">
        <div className="container intro">
          <div className="hero">
            <p className="eyebrow">Cátedra Libre Dr. José Gregorio Hernández</p>
            <h1 id="hero-title">
              Vida, ciencia<br />y servicio.
            </h1>
            <p>
              Prototipo institucional universitario para el diagnóstico de necesidades formativas, la evaluación de
              actividades académicas y la vinculación social de la Universidad Valle del Momboy.
            </p>

            <div style={{ display: 'flex', gap: '0.85rem', flexWrap: 'wrap' }}>
              <button className="btn btn-primary" onClick={() => onNavigate('surveys')}>
                <FileText size={16} />
                Explorar Consultas
              </button>
              <button className="btn btn-secondary" onClick={() => onNavigate('contact')}>
                <Mail size={16} />
                Proponer Vinculación Comunitaria
              </button>
            </div>

            <section className="about" aria-labelledby="about-title">
              <h2 id="about-title">Sobre la Cátedra Libre</h2>
              <p>
                Espacio académico y humanista para estudiar el legado ético, docente y experimental del Dr. José
                Gregorio Hernández, fomentando la solidaridad activa y la responsabilidad ciudadana en la comunidad
                universitaria.
              </p>
            </section>
          </div>

          <div className="hero-art">
            <img
              src={portraitSmall}
              srcSet={`${portraitSmall} 384w, ${portraitLarge} 768w`}
              sizes="(max-width: 46rem) min(70vw, 18rem), min(36vw, 22rem)"
              alt="Retrato artístico del Dr. José Gregorio Hernández, con sombrero y traje, en técnica intarsia contemporánea."
              width="768"
              height="841"
              fetchPriority="high"
              decoding="async"
            />
            <p className="hero-art-caption">
              Reinterpretación artística digital del Dr. José Gregorio Hernández en estilo intarsia contemporáneo,
              preservada como símbolo visual canónico de la Cátedra UVM.
            </p>
          </div>
        </div>
      </section>

      {/* 2. Propósito y Cadena de Valor Institucional */}
      <section className="container" style={{ paddingBlock: '3.5rem 2rem' }}>
        <div style={{ textAlign: 'center', maxWidth: '750px', marginInline: 'auto', marginBottom: '2.5rem' }}>
          <span className="eyebrow">Cadena Formativa del Prototipo</span>
          <h2 style={{ fontSize: '1.9rem', color: 'var(--color-petroleo)', marginTop: '0.3rem' }}>
            De la Consulta Académica a la Toma de Decisiones
          </h2>
          <p style={{ color: 'var(--color-texto-muted)', marginTop: '0.4rem', fontSize: '1rem' }}>
            El sistema demuestra un flujo universitario completo que vincula a las autoridades académicas con las
            percepciones reales de estudiantes, egresados y comunidades.
          </p>
        </div>

        <div className="chain-grid">
          <div className="chain-card">
            <div className="chain-num">01</div>
            <div className="chain-title">Diagnóstico</div>
            <p className="chain-desc">
              Identificación rigurosa de intereses temáticos, obstáculos de horario y necesidades formativas en bioética
              y humanismo.
            </p>
          </div>

          <div className="chain-card">
            <div className="chain-num">02</div>
            <div className="chain-title">Participación</div>
            <p className="chain-desc">
              Respuestas voluntarias y verificadas mediante autenticación universitaria, con salvaguarda de unicidad y
              protección de datos.
            </p>
          </div>

          <div className="chain-card">
            <div className="chain-num">03</div>
            <div className="chain-title">Interpretación</div>
            <p className="chain-desc">
              Agrupación descriptiva y recuentos porcentuales objetivos para comprender tendencias sin fabricar
              conclusiones automáticas.
            </p>
          </div>

          <div className="chain-card">
            <div className="chain-num">04</div>
            <div className="chain-title">Mejora Continua</div>
            <p className="chain-desc">
              Orientación empírica para coordinar nuevos talleres, ajustar la programación docente y planificar brigadas
              comunitarias.
            </p>
          </div>
        </div>
      </section>

      {/* 3. Guía de Interacción según el Perfil */}
      <section style={{ background: 'var(--color-panel)', borderTop: '1px solid var(--color-borde)', borderBottom: '1px solid var(--color-borde)', paddingBlock: '3rem' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.75rem', color: 'var(--color-petroleo)' }}>
              ¿Cómo interactuar con la plataforma?
            </h2>
            <p style={{ color: 'var(--color-texto-muted)', marginTop: '0.3rem', fontSize: '0.95rem' }}>
              Guía inmediata para visitantes, participantes universitarios y responsables de la Cátedra
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            <div className="card" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <Users size={20} color="var(--color-petroleo)" />
                <h3 style={{ fontSize: '1.15rem', margin: 0 }}>Visitante General</h3>
              </div>
              <p style={{ fontSize: '0.9rem', color: 'var(--color-texto-muted)', lineHeight: 1.5 }}>
                Puede consultar libremente el catálogo de instrumentos formativos publicados, conocer los objetivos de
                investigación y enviar propuestas de vinculación social mediante el formulario de contacto con documento
                adjunto.
              </p>
              <button
                className="btn btn-secondary btn-sm"
                style={{ marginTop: '1rem', width: '100%' }}
                onClick={() => onNavigate('surveys')}
              >
                Ver Consultas Públicas
                <ArrowRight size={14} />
              </button>
            </div>

            <div className="card" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <GraduationCap size={20} color="var(--color-petroleo)" />
                <h3 style={{ fontSize: '1.15rem', margin: 0 }}>Participante UVM</h3>
              </div>
              <p style={{ fontSize: '0.9rem', color: 'var(--color-texto-muted)', lineHeight: 1.5 }}>
                Con su cuenta universitaria registrada, accede a los instrumentos de encuesta, consulta las condiciones
                de participación y registra sus opiniones garantizando una respuesta única por consulta.
              </p>
              <div style={{ marginTop: '1rem', padding: '0.6rem 0.8rem', background: '#f5f5f5', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem', color: 'var(--color-texto-muted)' }}>
                <em>Módulo interactivo de respuestas en reserva para integración del integrante 2 (`morfemartin`).</em>
              </div>
            </div>

            <div className="card" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <ClipboardList size={20} color="var(--color-petroleo)" />
                <h3 style={{ fontSize: '1.15rem', margin: 0 }}>Administrador Académico</h3>
              </div>
              <p style={{ fontSize: '0.9rem', color: 'var(--color-texto-muted)', lineHeight: 1.5 }}>
                Diseña nuevos instrumentos, define objetivos específicos y población destinataria, gestiona preguntas de
                opción múltiple o abiertas, publica consultas y examina solicitudes de vinculación comunitaria.
              </p>
              <button
                className="btn btn-secondary btn-sm"
                style={{ marginTop: '1rem', width: '100%' }}
                onClick={() => onNavigate('admin')}
              >
                Acceder al Panel Académico
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Líneas Temáticas de la Cátedra */}
      <section className="container" style={{ paddingBlock: '3.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <span className="eyebrow">Líneas Temáticas de Investigación</span>
          <h2 style={{ fontSize: '1.75rem', color: 'var(--color-petroleo)', marginTop: '0.3rem' }}>
            Ejes Formativos de la Cátedra Libre
          </h2>
          <p style={{ color: 'var(--color-texto-muted)', marginTop: '0.3rem' }}>
            Las consultas se articulan en torno a tres dimensiones institucionales
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
          <div className="card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <HeartPulse size={24} color="var(--color-petroleo)" />
              <h3 style={{ fontSize: '1.15rem', margin: 0 }}>Bioética y Humanismo</h3>
            </div>
            <p style={{ color: 'var(--color-texto-muted)', fontSize: '0.92rem', lineHeight: 1.6 }}>
              Reflexión sistemática sobre la dignidad humana, la ética del cuidado y la vocación de servicio inspirada
              en el ejercicio profesional y la compasión activa del Dr. José Gregorio Hernández.
            </p>
          </div>

          <div className="card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <Users size={24} color="var(--color-petroleo)" />
              <h3 style={{ fontSize: '1.15rem', margin: 0 }}>Vinculación y Servicio Social</h3>
            </div>
            <p style={{ color: 'var(--color-texto-muted)', fontSize: '0.92rem', lineHeight: 1.6 }}>
              Diagnóstico participativo de necesidades sociales en el estado Trujillo, articulando brigadas universitarias,
              talleres comunitarios y proyectos de impacto con organizaciones locales.
            </p>
          </div>

          <div className="card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <GraduationCap size={24} color="var(--color-petroleo)" />
              <h3 style={{ fontSize: '1.15rem', margin: 0 }}>Calidad y Rigor Académico</h3>
            </div>
            <p style={{ color: 'var(--color-texto-muted)', fontSize: '0.92rem', lineHeight: 1.6 }}>
              Evaluación pedagógica y metodológica de los diplomados, cátedras y foros académicos, asegurando que la
              divulgación científica mantenga excelencia, pertinencia y actualización continua.
            </p>
          </div>
        </div>

        {/* Indicador Real de Base de Datos */}
        <div
          style={{
            marginTop: '2.5rem',
            background: 'var(--color-panel)',
            border: '1px solid var(--color-borde)',
            borderRadius: 'var(--radius-md)',
            padding: '1.25rem 2rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          <div>
            <span style={{ fontSize: '0.85rem', color: 'var(--color-texto-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Estado del Sistema en Base de Datos
            </span>
            <div style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--color-petroleo)', marginTop: '0.2rem' }}>
              {surveyCount} {surveyCount === 1 ? 'Instrumento canónico disponible' : 'Instrumentos canónicos disponibles'} en consulta
            </div>
          </div>

          <button className="btn btn-primary btn-sm" onClick={() => onNavigate('surveys')}>
            Acceder a las Consultas
            <ArrowRight size={14} />
          </button>
        </div>
      </section>
    </div>
  );
}
