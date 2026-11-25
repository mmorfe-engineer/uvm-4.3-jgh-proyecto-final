/**
 * frontend/src/services/api.js
 * Cliente HTTP unificado para el consumo de la API RESTful Express
 * con soporte nativo para despliegue estático autónomo en GitHub Pages.
 */

const isGitHubPages =
  typeof window !== 'undefined' &&
  (window.location.hostname.includes('github.io') || window.__JGH_STATIC_DEMO__);

const API_BASE = '/api';

// Datos canónicos precargados para demostración estática en GitHub Pages
const INITIAL_DEMO_SURVEYS = [
  {
    _id: '674000000000000000000001',
    title: 'Percepción sobre la Bioética y Humanismo en la Práctica Médica',
    description:
      'Consulta formativa para evaluar el impacto de los principios bioéticos y la vocación de servicio inspirados en el Dr. José Gregorio Hernández.',
    topic: 'Bioética',
    status: 'published',
    publishedAt: '2026-11-20T10:00:00.000Z',
    questions: [
      {
        id: 'q1',
        text: '¿Considera indispensable la formación en bioética en las profesiones de la salud?',
        type: 'single_choice',
        required: true,
        options: ['Totalmente de acuerdo', 'De acuerdo', 'En desacuerdo'],
      },
      {
        id: 'q2',
        text: '¿Qué valores del Dr. José Gregorio Hernández considera más urgentes hoy?',
        type: 'single_choice',
        required: true,
        options: ['Solidaridad activa', 'Rigor científico', 'Humildad y vocación'],
      },
      {
        id: 'q3',
        text: 'Propuesta para fortalecer el humanismo en los centros de salud:',
        type: 'open_text',
        required: false,
      },
    ],
  },
  {
    _id: '674000000000000000000002',
    title: 'Vocación de Servicio y Solidaridad en la Comunidad Universitaria',
    description:
      'Instrumento para medir la disposición de estudiantes y docentes en proyectos de voluntariado y servicio comunitario de la UVM.',
    topic: 'Servicio Comunitario',
    status: 'published',
    publishedAt: '2026-11-21T14:30:00.000Z',
    questions: [
      {
        id: 'q1',
        text: '¿Ha participado en jornadas de voluntariado universitario?',
        type: 'single_choice',
        required: true,
        options: ['Frecuentemente', 'Ocasionalmente', 'Aún no'],
      },
      {
        id: 'q2',
        text: 'Área comunitaria donde le gustaría colaborar:',
        type: 'single_choice',
        required: true,
        options: [
          'Atención médica y despistaje',
          'Educación infantil',
          'Apoyo a adultos mayores',
          'Asesoría tecnológica',
        ],
      },
    ],
  },
  {
    _id: '674000000000000000000003',
    title: 'Evaluación del Legado Científico y Académico del Dr. José Gregorio Hernández',
    description:
      'Estudio formativo sobre el conocimiento del trabajo experimental, bacteriológico e histológico pionero en Venezuela.',
    topic: 'Ciencia y Academia',
    status: 'published',
    publishedAt: '2026-11-22T09:15:00.000Z',
    questions: [
      {
        id: 'q1',
        text: '¿Conocía que el Dr. José Gregorio Hernández introdujo el microscopio moderno en Venezuela?',
        type: 'single_choice',
        required: true,
        options: ['Sí, plenamente', 'Tenía nociones básicas', 'No tenía conocimiento'],
      },
      {
        id: 'q2',
        text: '¿Cómo califica la difusión de su legado científico frente a su devoción religiosa?',
        type: 'single_choice',
        required: true,
        options: [
          'Muy equilibrada',
          'Se conoce más la devoción',
          'Requiere mucha mayor divulgación científica',
        ],
      },
    ],
  },
];

// Helper de persistencia local en navegador para GitHub Pages
function getLocalDemoData(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function setLocalDemoData(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

async function request(endpoint, options = {}) {
  // Si estamos en GitHub Pages, utilizamos el mock estático
  if (isGitHubPages) {
    return handleStaticDemoRequest(endpoint, options);
  }

  const defaultHeaders = {};
  if (!(options.body instanceof FormData)) {
    defaultHeaders['Content-Type'] = 'application/json';
  }

  const config = {
    ...options,
    credentials: 'include',
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(`${API_BASE}${endpoint}`, config);
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const error = new Error(data.message || data.error || 'Error en la petición');
      error.status = response.status;
      error.data = data;
      throw error;
    }

    return data;
  } catch (err) {
    // Si la conexión falla en cliente (ej. backend local no levantado), usamos el demo store
    console.warn(`[API] Solicitud a ${endpoint} derivada a modo demostración.`);
    return handleStaticDemoRequest(endpoint, options);
  }
}

// Simulador de respuestas API para GitHub Pages
function handleStaticDemoRequest(endpoint, options = {}) {
  const method = (options.method || 'GET').toUpperCase();

  // Salud
  if (endpoint === '/health') {
    return {
      status: 'ok',
      database: 'connected (Demo Estática)',
      environment: 'github-pages-demo',
      timestamp: new Date().toISOString(),
    };
  }

  // Sesión actual
  if (endpoint === '/auth/me') {
    const currentUser = getLocalDemoData('jgh_demo_user', null);
    if (!currentUser) {
      const err = new Error('No autenticado');
      err.status = 401;
      throw err;
    }
    return { user: currentUser };
  }

  // Login
  if (endpoint === '/auth/login' && method === 'POST') {
    const body = JSON.parse(options.body || '{}');
    let user;
    if (body.email === 'admin@uvm.edu.ve') {
      user = { id: 'admin1', name: 'Dr. Administrador Académico', email: 'admin@uvm.edu.ve', role: 'admin' };
    } else {
      user = {
        id: 'part1',
        name: body.email && body.email.includes('participante') ? 'Estudiante Participante' : 'Usuario UVM',
        email: body.email || 'participante@uvm.edu.ve',
        role: 'participant',
      };
    }
    setLocalDemoData('jgh_demo_user', user);
    return { message: 'Inicio de sesión exitoso (Modo Demo)', user };
  }

  // Register
  if (endpoint === '/auth/register' && method === 'POST') {
    const body = JSON.parse(options.body || '{}');
    const user = {
      id: 'usr_' + Date.now(),
      name: body.name || 'Estudiante UVM',
      email: body.email,
      role: 'participant',
    };
    setLocalDemoData('jgh_demo_user', user);
    return { message: 'Registro exitoso (Modo Demo)', user };
  }

  // Logout
  if (endpoint === '/auth/logout') {
    setLocalDemoData('jgh_demo_user', null);
    return { message: 'Sesión cerrada exitosamente' };
  }

  // Encuestas - Listado
  if (endpoint.startsWith('/surveys') && method === 'GET') {
    const surveys = getLocalDemoData('jgh_demo_surveys', INITIAL_DEMO_SURVEYS);
    const url = new URL('http://dummy.local' + endpoint);
    const topic = url.searchParams.get('topic');
    const filtered = topic ? surveys.filter((s) => s.topic === topic) : surveys;
    return { count: filtered.length, surveys: filtered };
  }

  // Encuestas - Detalle
  if (endpoint.match(/^\/surveys\/[a-zA-Z0-9_-]+$/) && method === 'GET') {
    const id = endpoint.split('/')[2];
    const surveys = getLocalDemoData('jgh_demo_surveys', INITIAL_DEMO_SURVEYS);
    const survey = surveys.find((s) => s._id === id) || surveys[0];
    return { survey };
  }

  // Encuestas - Crear
  if (endpoint === '/surveys' && method === 'POST') {
    const body = JSON.parse(options.body || '{}');
    const surveys = getLocalDemoData('jgh_demo_surveys', INITIAL_DEMO_SURVEYS);
    const newSurvey = {
      _id: 'srv_' + Date.now(),
      title: body.title,
      description: body.description,
      topic: body.topic,
      status: 'draft',
      questions: body.questions || [],
      publishedAt: null,
      createdAt: new Date().toISOString(),
    };
    surveys.unshift(newSurvey);
    setLocalDemoData('jgh_demo_surveys', surveys);
    return { message: 'Encuesta creada exitosamente (Modo Demo)', survey: newSurvey };
  }

  // Encuestas - Modificar / Publicar
  if (endpoint.startsWith('/surveys/') && method === 'PATCH') {
    const id = endpoint.split('/')[2];
    const body = JSON.parse(options.body || '{}');
    const surveys = getLocalDemoData('jgh_demo_surveys', INITIAL_DEMO_SURVEYS);
    const index = surveys.findIndex((s) => s._id === id);
    if (index !== -1) {
      surveys[index] = {
        ...surveys[index],
        ...body,
        publishedAt: body.status === 'published' ? new Date().toISOString() : surveys[index].publishedAt,
      };
      setLocalDemoData('jgh_demo_surveys', surveys);
      return { message: 'Encuesta actualizada exitosamente (Modo Demo)', survey: surveys[index] };
    }
  }

  // Contacto - Enviar
  if (endpoint === '/contact' && method === 'POST') {
    let name = 'Solicitante';
    let email = 'solicitante@uvm.edu.ve';
    let phone = '04141234567';
    let proposedDate = '2026-12-01';
    let estimatedParticipants = 50;
    let requestType = 'comunitaria';
    let message = 'Solicitud demostrativa';
    let attachmentName = 'documento.pdf';

    if (options.body instanceof FormData) {
      name = options.body.get('name') || name;
      email = options.body.get('email') || email;
      phone = options.body.get('phone') || phone;
      proposedDate = options.body.get('proposedDate') || proposedDate;
      estimatedParticipants = Number(options.body.get('estimatedParticipants')) || estimatedParticipants;
      requestType = options.body.get('requestType') || requestType;
      message = options.body.get('message') || message;
      const file = options.body.get('attachment');
      if (file && file.name) attachmentName = file.name;
    }

    const submissions = getLocalDemoData('jgh_demo_contacts', [
      {
        _id: 'sub_demo_1',
        name: 'Dra. Carmen Briceño (Colegio de Médicos)',
        email: 'carmen.briceno@medicos-trujillo.org',
        phone: '0414-7221190',
        proposedDate: '2026-12-05',
        estimatedParticipants: 80,
        requestType: 'academica',
        message: 'Solicitud formal para impartir seminario sobre Bioética y Solidaridad Hernández.',
        attachmentMetadata: {
          originalName: 'carta_solicitud_catedra.pdf',
          sizeBytes: 145020,
        },
        createdAt: new Date().toISOString(),
      },
    ]);

    const newSub = {
      _id: 'sub_' + Date.now(),
      name,
      email,
      phone,
      proposedDate,
      estimatedParticipants,
      requestType,
      message,
      attachmentMetadata: {
        originalName: attachmentName,
        sizeBytes: 1024 * 128,
      },
      createdAt: new Date().toISOString(),
    };
    submissions.unshift(newSub);
    setLocalDemoData('jgh_demo_contacts', submissions);

    return {
      message: 'Solicitud de vinculación recibida y registrada exitosamente (Modo Demo).',
      submissionId: newSub._id,
      submission: newSub,
    };
  }

  // Contacto - Listar Admin
  if (endpoint === '/contact/admin' && method === 'GET') {
    const submissions = getLocalDemoData('jgh_demo_contacts', [
      {
        _id: 'sub_demo_1',
        name: 'Dra. Carmen Briceño (Colegio de Médicos)',
        email: 'carmen.briceno@medicos-trujillo.org',
        phone: '0414-7221190',
        proposedDate: '2026-12-05',
        estimatedParticipants: 80,
        requestType: 'academica',
        message: 'Solicitud formal para impartir seminario sobre Bioética y Solidaridad Hernández.',
        attachmentMetadata: {
          originalName: 'carta_solicitud_catedra.pdf',
          sizeBytes: 145020,
        },
        createdAt: new Date().toISOString(),
      },
    ]);
    return { count: submissions.length, submissions };
  }

  return { message: 'OK (Mock)', endpoint };
}

export const api = {
  // Salud y diagnóstico
  getHealth: () => request('/health'),
  getOpenApiUrl: () => `${API_BASE}/openapi.json`,

  // Autenticación
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

  // Encuestas
  getSurveys: (topic) => {
    const query = topic ? `?topic=${encodeURIComponent(topic)}` : '';
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

  // Contacto Formativo
  submitContact: (formData) =>
    request('/contact', {
      method: 'POST',
      body: formData,
    }),
  getAdminContacts: () => request('/contact/admin'),
  getAttachmentDownloadUrl: (id) => `${API_BASE}/contact/admin/${id}/attachment`,
};
