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

  let response;
  try {
    response = await fetch(url, config);
  } catch (networkError) {
    const err = new Error('Unable to connect to the backend server. Please make sure the backend is running.');
    err.isNetworkError = true;
    throw err;
  }

  let data;
  try {
    data = await response.json();
  } catch {
    data = { message: response.statusText || `Request failed (${response.status})` };
  }

  if (!response.ok) {
    const errorMsg = data?.message || data?.error || `Server responded with status ${response.status}`;
    const err = new Error(errorMsg);
    err.status = response.status;
    err.data = data;
    throw err;
  }

  return data?.data !== undefined ? data.data : data;
}

export const apiClient = {
  get: (endpoint, options) => request(endpoint, { method: 'GET', ...options }),
  post: (endpoint, body, options) => request(endpoint, { method: 'POST', body, ...options }),
  put: (endpoint, body, options) => request(endpoint, { method: 'PUT', body, ...options }),
  patch: (endpoint, body, options) => request(endpoint, { method: 'PATCH', body, ...options }),
  delete: (endpoint, options) => request(endpoint, { method: 'DELETE', ...options }),
  upload: (endpoint, formData, options) => request(endpoint, { method: 'POST', body: formData, ...options }),
};
