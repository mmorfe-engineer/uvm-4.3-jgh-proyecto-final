/**
 * frontend/src/services/api.js
 * Cliente HTTP unificado para el consumo de la API RESTful Express
 */

const API_BASE = '/api';

async function request(endpoint, options = {}) {
  const defaultHeaders = {};
  if (!(options.body instanceof FormData)) {
    defaultHeaders['Content-Type'] = 'application/json';
  }

  const config = {
    ...options,
    credentials: 'include', // Imprescindible para cookies de sesión connect.sid HttpOnly
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  const response = await fetch(`${API_BASE}${endpoint}`, config);
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(data.message || data.error || 'Error en la petición');
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
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
      body: formData, // FormData multipart/form-data
    }),
  getAdminContacts: () => request('/contact/admin'),
  getAttachmentDownloadUrl: (id) => `${API_BASE}/contact/admin/${id}/attachment`,
};
