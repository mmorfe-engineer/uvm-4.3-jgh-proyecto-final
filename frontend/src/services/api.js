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
 * Realiza una petición HTTP real hacia la API Express.
 * Lanza un error estructurado si la respuesta no es 2xx o si el servidor está desconectado.
 */
async function request(endpoint, options = {}) {
  // En visor estático de GitHub Pages, bloquear mutaciones que requieran backend real
  if (isStaticDemo) {
    const method = (options.method || 'GET').toUpperCase();
    if (method !== 'GET') {
      const err = new Error(
        'Operación no disponible en la vista demostrativa de GitHub Pages. Requiere backend Express y MongoDB en ejecución local.'
      );
      err.status = 503;
      throw err;
    }

    // Para lecturas en GitHub Pages, si no hay backend, devolver datos sintéticos marcados inequívocamente
    if (endpoint === '/health') {
      return {
        status: 'demo',
        database: 'desconectada',
        environment: 'github-pages-estatico',
        message: 'Vista demostrativa sin servidor backend activo',
      };
    }
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

  // Encuestas reales
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

  // Contacto Formativo real
  submitContact: (formData) =>
    request('/contact', {
      method: 'POST',
      body: formData, // FormData multipart/form-data
    }),
  getAdminContacts: () => request('/contact/admin'),
  getAttachmentDownloadUrl: (id) => `${API_BASE}/contact/admin/${id}/attachment`,
};
