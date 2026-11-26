/**
 * frontend/src/services/api.js
 * Cliente HTTP unificado para el consumo de la API RESTful Express.
 * Cumple con la política de fidelidad funcional: NO realiza fallbacks encubiertos.
 * Conserva y propaga estrictamente los códigos de estado HTTP (400, 401, 403, 404, 409, 500).
 */

const API_BASE = '/api';

/**
 * Detecta si la aplicación se está ejecutando en el visor estático de GitHub Pages.
 */
export const isStaticDemo =
  typeof window !== 'undefined' && window.location.hostname.includes('github.io');

/**
 * Datos canónicos institucionales para la visualización demostrativa en GitHub Pages.
 * Permiten que evaluadores y visitantes examinen los 4 ejes y las consultas formativas
 * sin necesidad de tener el backend Node.js y MongoDB corriendo en local.
 */
const CANONICAL_DEMO_SURVEYS = [
  {
    _id: '674000000000000000000001',
    title: 'Diagnóstico de Necesidades Formativas en Bioética y Humanismo',
    description: 'Consulta para identificar intereses temáticos, modalidades de estudio preferidas y obstáculos para la participación en programas formativos de la Cátedra.',
    objective: 'Identificar intereses temáticos, prioridades formativas, modalidades de estudio preferidas y principales obstáculos para la participación en las actividades de la Cátedra.',
    targetAudience: 'Estudiantes de pregrado, posgrado y profesionales de la región.',
    topic: 'Formación y Bioética',
    status: 'published',
    publishedAt: '2026-11-20T10:00:00.000Z',
    createdBy: { name: 'Administrador JGH (Académico)', email: 'admin@uvm.edu.ve' },
    questions: [
      {
        id: 'q_a1',
        text: '¿En cuál de las siguientes áreas temáticas considera prioritario profundizar su formación ética?',
        type: 'single_choice',
        required: true,
        options: [
          'Bioética clínica y dignidad del paciente',
          'Ética profesional en la toma de decisiones complejas',
          'Historia y fundamentación de la medicina humanista',
          'Liderazgo cívico y compromiso comunitario',
        ],
      },
      {
        id: 'q_a2',
        text: '¿Qué modalidad formativa se adapta mejor a sus compromisos cotidianos?',
        type: 'single_choice',
        required: true,
        options: [
          'Talleres intensivos presenciales de fin de semana',
          'Módulos híbridos con sesiones virtuales y encuentros mensuales',
          'Seminarios 100% asíncronos en plataforma virtual',
          'Foros de debate y mesas redondas vespertinas',
        ],
      },
      {
        id: 'q_a3',
        text: '¿Cuál identifica como el principal obstáculo para participar activamente en programas formativos extracurriculares?',
        type: 'single_choice',
        required: true,
        options: [
          'Coincidencia con carga horaria académica o laboral',
          'Limitaciones de conectividad y acceso a recursos digitales',
          'Distancia geográfica o dificultades de transporte',
          'Desconocimiento previo de la programación académica',
        ],
      },
      {
        id: 'q_a4',
        text: '¿Considera útil que las actividades formativas de la Cátedra ofrezcan certificación académica avalada por la UVM?',
        type: 'single_choice',
        required: true,
        options: [
          'Fundamental para el perfil curricular',
          'Deseable aunque no determinante',
          'Indiferente frente a la calidad del contenido',
          'No es relevante para mi interés',
        ],
      },
      {
        id: 'q_a5',
        text: '¿Con qué frecuencia desearía participar en ciclos de conferencias y discusión formativa?',
        type: 'single_choice',
        required: true,
        options: ['Mensual', 'Quincenal', 'Trimestral', 'Únicamente en jornadas especiales'],
      },
      {
        id: 'q_a6',
        text: 'Nivel de conocimiento actual sobre las obras científicas publicadas por el Dr. José Gregorio Hernández:',
        type: 'single_choice',
        required: true,
        options: [
          'Conocimiento amplio y detallado',
          'Conocimiento básico de sus líneas generales',
          'He escuchado menciones pero no conozco los textos',
          'Desconocía que hubiese publicado obras científicas',
        ],
      },
      {
        id: 'q_a7',
        text: 'Sugiera un tema o problemática contemporánea que desearía que fuese abordado en futuros seminarios:',
        type: 'short_text',
        required: false,
        options: [],
      },
    ],
  },
  {
    _id: '674000000000000000000002',
    title: 'Evaluación de Actividades Académicas y Calidad Formativa',
    description: 'Instrumento para evaluar la pertinencia, claridad pedagógica, aprendizaje percibido y oportunidades de mejora en los eventos formativos de la Cátedra.',
    objective: 'Evaluar pertinencia, claridad, metodología, aprendizaje percibido y oportunidades de mejora para la programación académica de la Cátedra.',
    targetAudience: 'Participantes en conferencias, jornadas y diplomados organizados por la Cátedra.',
    topic: 'Evaluación Académica',
    status: 'published',
    publishedAt: '2026-11-21T14:30:00.000Z',
    createdBy: { name: 'Administrador JGH (Académico)', email: 'admin@uvm.edu.ve' },
    questions: [
      {
        id: 'q_b1',
        text: '¿En qué medida los contenidos expuestos respondieron a los objetivos anunciados de la actividad?',
        type: 'single_choice',
        required: true,
        options: [
          'Superaron plenamente los objetivos planteados',
          'Cumplieron adecuadamente con los objetivos',
          'Cumplieron de forma parcial',
          'No respondieron a lo anunciado',
        ],
      },
      {
        id: 'q_b2',
        text: '¿Cómo califica la claridad expositiva y el rigor pedagógico de los facilitadores?',
        type: 'single_choice',
        required: true,
        options: [
          'Excelente dominio y pedagogía',
          'Bueno y comprensible',
          'Aceptable pero susceptible de mejora',
          'Deficiente en metodología',
        ],
      },
      {
        id: 'q_b3',
        text: '¿Considera que el material bibliográfico y los recursos de apoyo fueron oportunos y de calidad académica?',
        type: 'single_choice',
        required: true,
        options: [
          'Muy pertinentes y actualizados',
          'Adecuados para el nivel formativo',
          'Básicos o insuficientes',
          'No se suministraron recursos de apoyo',
        ],
      },
      {
        id: 'q_b4',
        text: '¿En qué grado considera que la actividad contribuyó a su crecimiento ético y profesional?',
        type: 'single_choice',
        required: true,
        options: [
          'Impacto significativo y transformador',
          'Aporte positivo moderado',
          'Aporte puntual sin mayor impacto',
          'Sin impacto apreciable',
        ],
      },
      {
        id: 'q_b5',
        text: '¿La metodología empleada fomentó la reflexión crítica y la participación dialogada?',
        type: 'single_choice',
        required: true,
        options: [
          'Ampliamente participativa y reflexiva',
          'Participación moderada con espacio para preguntas',
          'Predominó el formato unidireccional',
          'No hubo espacio para intervención del participante',
        ],
      },
      {
        id: 'q_b6',
        text: '¿Recomendaría esta experiencia formativa a otros colegas o estudiantes de su área?',
        type: 'single_choice',
        required: true,
        options: ['Definitivamente sí', 'Probablemente sí', 'Dudoso', 'No la recomendaría'],
      },
      {
        id: 'q_b7',
        text: 'Describa la principal fortaleza o propuesta de mejora que observó en la organización de la actividad:',
        type: 'short_text',
        required: false,
        options: [],
      },
    ],
  },
  {
    _id: '674000000000000000000003',
    title: 'Vinculación Social y Voluntariado Comunitario Universitario',
    description: 'Consulta comunitaria para identificar intereses de servicio, disponibilidad horaria, experiencias previas y áreas prioritarias de colaboración social.',
    objective: 'Identificar intereses, disponibilidad, experiencias y áreas potenciales de colaboración social comunitaria en el estado Trujillo.',
    targetAudience: 'Estudiantes, egresados, docentes y aliados comunitarios de la UVM.',
    topic: 'Vinculación Comunitaria',
    status: 'published',
    publishedAt: '2026-11-22T09:15:00.000Z',
    createdBy: { name: 'Administrador JGH (Académico)', email: 'admin@uvm.edu.ve' },
    questions: [
      {
        id: 'q_c1',
        text: '¿Ha participado en iniciativas de vinculación social promovidas por instituciones universitarias?',
        type: 'single_choice',
        required: true,
        options: [
          'Sí, de forma continua en diversas actividades',
          'Sí, exclusivamente durante el cumplimiento del servicio comunitario',
          'He participado de forma independiente en mi comunidad',
          'Aún no he tenido experiencia en proyectos de vinculación',
        ],
      },
      {
        id: 'q_c2',
        text: '¿En cuál de las siguientes áreas considera que su aporte voluntario tendría mayor impacto comunitario?',
        type: 'single_choice',
        required: true,
        options: [
          'Alfabetización digital, redes y soporte técnico comunal',
          'Promoción y prevención en salud integral y primeros auxilios',
          'Refuerzo pedagógico y animación cultural para niños y jóvenes',
          'Asesoría administrativa, jurídica y contable básica',
        ],
      },
      {
        id: 'q_c3',
        text: '¿Cuántas horas mensuales podría dedicar con regularidad a actividades de vinculación comunitaria?',
        type: 'single_choice',
        required: true,
        options: [
          'Más de 10 horas mensuales',
          'Entre 5 y 10 horas mensuales',
          'Menos de 5 horas mensuales',
          'Sin disponibilidad regular actualmente',
        ],
      },
      {
        id: 'q_c4',
        text: '¿Cuál formato de vinculación social considera más provechoso y sostenible para la comunidad?',
        type: 'single_choice',
        required: true,
        options: [
          'Acompañamiento periódico y sostenido a comunidades específicas',
          'Jornadas puntuales intensivas de fin de semana',
          'Diagnósticos técnicos y transferencia de capacidades a líderes locales',
          'Alianzas interinstitucionales con centros asistenciales',
        ],
      },
      {
        id: 'q_c5',
        text: 'Disposición para colaborar en la planificación logística o coordinación de brigadas comunitarias:',
        type: 'single_choice',
        required: true,
        options: [
          'Alta disposición para asumir roles de coordinación',
          'Disposición como colaborador operativo en campo',
          'Disposición exclusivamente para apoyo digital o remoto',
          'No puedo asumir responsabilidades de coordinación',
        ],
      },
      {
        id: 'q_c6',
        text: '¿Considera que el ideario de solidaridad del Dr. José Gregorio Hernández inspira un modelo de servicio transformador?',
        type: 'single_choice',
        required: true,
        options: [
          'Plenamente, constituye un referente ético de vocación',
          'Sí, aporta valor al compromiso cívico universitario',
          'Es un referente respetable aunque secundario',
          'No tengo criterio formado al respecto',
        ],
      },
      {
        id: 'q_c7',
        text: 'Proponga una comunidad o sector vulnerable del estado Trujillo que considere prioritario para una jornada comunitaria:',
        type: 'short_text',
        required: false,
        options: [],
      },
    ],
  },
  {
    _id: '674000000000000000000004',
    title: 'Ética en la Investigación Científica y Publicaciones Académicas',
    description: 'Diagnóstico institucional sobre integridad científica, autoría responsable, consentimiento ético y difusión del conocimiento en la comunidad universitaria.',
    objective: 'Relevar buenas prácticas, retos éticos y necesidades de capacitación metodológica en investigación biomédica y social en la UVM.',
    targetAudience: 'Docentes investigadores, tesistas de pregrado/posgrado y comités de bioética.',
    topic: 'Formación y Bioética',
    status: 'published',
    publishedAt: '2026-11-23T11:00:00.000Z',
    createdBy: { name: 'Administrador JGH (Académico)', email: 'admin@uvm.edu.ve' },
    questions: [
      {
        id: 'q_d1',
        text: '¿Conoce los protocolos institucionales de revisión ética vigentes para proyectos de investigación?',
        type: 'single_choice',
        required: true,
        options: [
          'Conocimiento detallado y aplicación en proyectos',
          'Conozco la normativa general pero no el trámite exacto',
          'Información insuficiente o desactualizada',
          'Desconocía la existencia de comités éticos locales',
        ],
      },
      {
        id: 'q_d2',
        text: '¿Qué aspecto ético considera más desafiante en el desarrollo de investigaciones con seres humanos o comunidades?',
        type: 'single_choice',
        required: true,
        options: [
          'Elaboración y comprensión real del consentimiento informado',
          'Confidencialidad y custodia segura de datos sensibles',
          'Retribución y beneficio tangible para la comunidad investigada',
          'Conflictos de interés e imparcialidad académica',
        ],
      },
      {
        id: 'q_d3',
        text: '¿Considera formativo instituir talleres de redacción científica con enfoque en autoría responsable e integridad?',
        type: 'single_choice',
        required: true,
        options: [
          'Prioritario e indispensable',
          'Conveniente para semilleros de investigación',
          'Opcional para asignaturas avanzadas',
          'No lo considero prioritario',
        ],
      },
      {
        id: 'q_d4',
        text: 'Sugerencias para fomentar la vocación investigativa con sentido humano en la Universidad:',
        type: 'short_text',
        required: false,
        options: [],
      },
    ],
  },
];

/**
 * Manejador de respuestas en modo estático para GitHub Pages.
 * Emula la respuesta de la API Express con persistencia en localStorage.
 */
function handleStaticDemoRequest(endpoint, options = {}) {
  const method = (options.method || 'GET').toUpperCase();

  // Salud del backend
  if (endpoint === '/health') {
    return {
      status: 'demo',
      database: 'demostracion_estatica',
      environment: 'github-pages',
      message: 'Vista demostrativa institucional de la Cátedra JGH (Frontend Activo)',
    };
  }

  // Listado de encuestas y búsqueda dinámica
  if (endpoint.startsWith('/surveys') && method === 'GET') {
    // Si es check de respuesta de una encuesta: /surveys/:id/responses/check
    if (endpoint.includes('/responses/check')) {
      const parts = endpoint.split('/');
      const surveyId = parts[2];
      try {
        const responses = JSON.parse(localStorage.getItem('jgh_demo_responses') || '[]');
        const user = JSON.parse(localStorage.getItem('jgh_demo_user') || 'null');
        const hasResponded = user && responses.some((r) => r.surveyId === surveyId && r.participantEmail === user.email);
        return { hasResponded: Boolean(hasResponded) };
      } catch (_) {
        return { hasResponded: false };
      }
    }

    // Si es consulta de resultados: /surveys/:id/results
    if (endpoint.endsWith('/results')) {
      const parts = endpoint.split('/');
      const surveyId = parts[2];
      const survey = CANONICAL_DEMO_SURVEYS.find((s) => s._id === surveyId) || CANONICAL_DEMO_SURVEYS[0];
      try {
        const responses = JSON.parse(localStorage.getItem('jgh_demo_responses') || '[]')
          .filter((r) => r.surveyId === surveyId);
        const totalResponses = responses.length;

        if (totalResponses === 0) {
          return {
            surveyId: survey._id,
            title: survey.title,
            totalResponses: 0,
            questions: [],
            message: 'Sin respuestas registradas aún en el sistema. Sea el primer participante en responder este instrumento formativo.',
          };
        }

        const questionsSummary = (survey.questions || []).map((q) => {
          const qSummary = { questionId: q.id, text: q.text, type: q.type };
          if (q.type === 'single_choice') {
            const counts = {};
            (q.options || []).forEach((opt) => { counts[opt] = 0; });
            responses.forEach((r) => {
              const ans = (r.answers || []).find((a) => a.questionId === q.id);
              if (ans && ans.value && counts[ans.value] !== undefined) counts[ans.value] += 1;
            });
            const percentages = {};
            Object.keys(counts).forEach((opt) => {
              percentages[opt] = Math.round((counts[opt] / totalResponses) * 100);
            });
            qSummary.options = q.options;
            qSummary.counts = counts;
            qSummary.percentages = percentages;
          } else {
            let textCount = 0;
            responses.forEach((r) => {
              const ans = (r.answers || []).find((a) => a.questionId === q.id);
              if (ans && ans.value && String(ans.value).trim()) textCount += 1;
            });
            qSummary.answeredCount = textCount;
          }
          return qSummary;
        });

        return { surveyId: survey._id, title: survey.title, totalResponses, questions: questionsSummary };
      } catch (_) {
        return { surveyId: survey._id, title: survey.title, totalResponses: 0, questions: [] };
      }
    }

    // Si es detalle de encuesta por ID: /surveys/:id
    const idMatch = endpoint.match(/^\/surveys\/([a-zA-Z0-9_-]+)$/);
    if (idMatch) {
      const surveyId = idMatch[1];
      const survey = CANONICAL_DEMO_SURVEYS.find((s) => s._id === surveyId) || CANONICAL_DEMO_SURVEYS[0];
      return { survey };
    }

    // Listado con filtro de tópico y búsqueda
    const url = new URL('https://dummy.local' + endpoint);
    const topic = url.searchParams.get('topic');
    const search = url.searchParams.get('search');

    let filtered = [...CANONICAL_DEMO_SURVEYS];
    if (topic && topic.trim()) {
      filtered = filtered.filter((s) => s.topic === topic.trim());
    }
    if (search && search.trim()) {
      const term = search.trim().toLowerCase();
      filtered = filtered.filter(
        (s) =>
          (s.title && s.title.toLowerCase().includes(term)) ||
          (s.description && s.description.toLowerCase().includes(term)) ||
          (s.objective && s.objective.toLowerCase().includes(term)) ||
          (s.topic && s.topic.toLowerCase().includes(term))
      );
    }

    return { count: filtered.length, surveys: filtered };
  }

  // Envío de respuesta a encuesta: POST /surveys/:id/responses
  if (endpoint.includes('/responses') && method === 'POST') {
    const parts = endpoint.split('/');
    const surveyId = parts[2];
    const body = JSON.parse(options.body || '{}');
    const user = JSON.parse(localStorage.getItem('jgh_demo_user') || 'null') || {
      name: 'Participante Estudiantil UVM',
      email: 'participante@uvm.edu.ve',
    };

    try {
      const responses = JSON.parse(localStorage.getItem('jgh_demo_responses') || '[]');
      const already = responses.some((r) => r.surveyId === surveyId && r.participantEmail === user.email);
      if (already) {
        const err = new Error('Ya has participado en esta encuesta formativa.');
        err.status = 409;
        throw err;
      }

      responses.push({
        _id: 'resp_demo_' + Date.now(),
        surveyId,
        participantEmail: user.email,
        answers: body.answers || [],
        submittedAt: new Date().toISOString(),
      });
      localStorage.setItem('jgh_demo_responses', JSON.stringify(responses));

      return {
        message: 'Respuesta registrada y persistida exitosamente (Modo Demostración).',
        responseId: 'resp_demo_' + Date.now(),
      };
    } catch (err) {
      if (err.status === 409) throw err;
      return { message: 'Respuesta registrada exitosamente.' };
    }
  }

  // Autenticación en modo estático
  if (endpoint === '/auth/login' && method === 'POST') {
    const body = JSON.parse(options.body || '{}');
    const isAdmin = body.email && body.email.includes('admin');
    const user = {
      _id: 'usr_demo_' + (isAdmin ? 'admin' : 'participant'),
      name: isAdmin ? 'Administrador JGH (Académico)' : 'Participante Estudiantil UVM',
      email: body.email || (isAdmin ? 'admin@uvm.edu.ve' : 'participante@uvm.edu.ve'),
      role: isAdmin ? 'admin' : 'participant',
    };
    try { localStorage.setItem('jgh_demo_user', JSON.stringify(user)); } catch (_) {}
    return { message: 'Inicio de sesión exitoso (Modo Demostración)', user };
  }

  if (endpoint === '/auth/register' && method === 'POST') {
    const body = JSON.parse(options.body || '{}');
    const user = {
      _id: 'usr_demo_' + Date.now(),
      name: body.name || 'Estudiante UVM',
      email: body.email,
      role: 'participant',
    };
    try { localStorage.setItem('jgh_demo_user', JSON.stringify(user)); } catch (_) {}
    return { message: 'Registro exitoso (Modo Demostración)', user };
  }

  if (endpoint === '/auth/me') {
    try {
      const user = JSON.parse(localStorage.getItem('jgh_demo_user') || 'null');
      if (!user) {
        const err = new Error('No autenticado');
        err.status = 401;
        throw err;
      }
      return { user };
    } catch (err) {
      if (err.status === 401) throw err;
      return { user: null };
    }
  }

  if (endpoint === '/auth/logout' && method === 'POST') {
    try { localStorage.removeItem('jgh_demo_user'); } catch (_) {}
    return { message: 'Sesión cerrada exitosamente' };
  }

  // Formulario de Contacto
  if (endpoint === '/contact' && method === 'POST') {
    let subName = 'Solicitante UVM';
    if (options.body instanceof FormData) {
      subName = options.body.get('name') || subName;
    }
    return {
      message: 'Solicitud de vinculación recibida y registrada exitosamente (Modo Demostración).',
      submissionId: 'sub_demo_' + Date.now(),
      submission: { name: subName },
    };
  }

  if (endpoint === '/contact/admin') {
    return { count: 0, submissions: [] };
  }

  return { message: 'OK (Modo Demostración)', endpoint };
}

/**
 * Realiza una petición HTTP real hacia la API Express.
 * En la vista demostrativa de GitHub Pages emula la API con datos canónicos sin romper la UI.
 */
async function request(endpoint, options = {}) {
  // En visor estático de GitHub Pages, delegar al manejador demostrativo sin realizar peticiones de red fallidas
  if (isStaticDemo) {
    return handleStaticDemoRequest(endpoint, options);
  }

  const defaultHeaders = {};
  if (!(options.body instanceof FormData)) {
    defaultHeaders['Content-Type'] = 'application/json';
  }

  const config = {
    ...options,
    credentials: 'include', // Necesario para cookies HttpOnly connect.sid
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  let response;
  try {
    response = await fetch(`${API_BASE}${endpoint}`, config);
  } catch (networkError) {
    const error = new Error(
      `No fue posible conectar con el servidor backend Express en ${API_BASE}${endpoint}. Verifique que el servicio esté activo en el puerto 5000.`
    );
    error.status = 0;
    error.isNetworkError = true;
    error.originalError = networkError;
    throw error;
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(data.message || data.error || `Error HTTP ${response.status}`);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

export const api = {
  isStaticDemo,

  // Salud y diagnóstico
  getHealth: () => request('/health'),
  getOpenApiUrl: () =>
    isStaticDemo
      ? 'https://raw.githubusercontent.com/mmorfe-engineer/uvm-4.3-jgh-proyecto-final/main/backend/openapi/openapi.json'
      : `${API_BASE}/openapi.json`,

  // Autenticación real
  login: (email, password) =>
    request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
  register: (name, email, password) =>
    request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    }),
  logout: () => request('/auth/logout', { method: 'POST' }),
  getMe: () => request('/auth/me'),

  // Encuestas reales y búsqueda dinámica
  getSurveys: (topic, search) => {
    const params = new URLSearchParams();
    if (topic) params.append('topic', topic);
    if (search && search.trim()) params.append('search', search.trim());
    const query = params.toString() ? `?${params.toString()}` : '';
    return request(`/surveys${query}`);
  },
  getSurveyById: (id) => request(`/surveys/${id}`),
  createSurvey: (surveyData) =>
    request('/surveys', {
      method: 'POST',
      body: JSON.stringify(surveyData),
    }),
  updateSurvey: (id, updateData) =>
    request(`/surveys/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updateData),
    }),

  // Participación y Respuestas (Reserva morfemartin)
  submitResponse: (surveyId, answers) =>
    request(`/surveys/${surveyId}/responses`, {
      method: 'POST',
      body: JSON.stringify({ answers }),
    }),
  checkSurveyResponse: (surveyId) => request(`/surveys/${surveyId}/responses/check`),
  getSurveyResults: (surveyId) => request(`/surveys/${surveyId}/results`),
  getMyResponses: () => request('/surveys/my/responses'),

  // Contacto Formativo real
  submitContact: (formData) =>
    request('/contact', {
      method: 'POST',
      body: formData, // FormData multipart/form-data
    }),
  getAdminContacts: () => request('/contact/admin'),
  getAttachmentDownloadUrl: (id) => `${API_BASE}/contact/admin/${id}/attachment`,
};
