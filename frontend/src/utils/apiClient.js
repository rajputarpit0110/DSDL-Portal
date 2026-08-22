const BASE_URL = 'http://localhost:8000/api';

async function request(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  const config = {
    ...options,
    headers,
    credentials: 'include' // Important for HTTP-only cookies
  };

  let isFormData = false;
  if (config.body instanceof FormData) {
    isFormData = true;
    delete config.headers['Content-Type']; // Let browser set multipart boundary
  } else if (config.body && typeof config.body === 'object') {
    config.body = JSON.stringify(config.body);
  }

  const response = await fetch(url, config);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'An error occurred');
  }

  // Our backend uses a standard ApiResponse format
  // { statusCode: 200, message: "Success", data: {...}, success: true }
  // We can return the nested data directly for easier usage
  return data.data;
}

export const apiClient = {
  get: (endpoint, options) => request(endpoint, { method: 'GET', ...options }),
  post: (endpoint, body, options) => request(endpoint, { method: 'POST', body, ...options }),
  put: (endpoint, body, options) => request(endpoint, { method: 'PUT', body, ...options }),
  patch: (endpoint, body, options) => request(endpoint, { method: 'PATCH', body, ...options }),
  delete: (endpoint, options) => request(endpoint, { method: 'DELETE', ...options }),
  upload: (endpoint, formData, options) => request(endpoint, { method: 'POST', body: formData, ...options }),
};
