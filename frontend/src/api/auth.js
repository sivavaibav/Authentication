const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

async function jsonFetch(path, options) {
  const base = API_BASE_URL.replace(/\/+$/, '');
  const url = path.startsWith('http://') || path.startsWith('https://') ? path : `${base}${path}`;

  const res = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...(options?.headers || {}),
    },
    ...options,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const message = typeof data?.message === 'string' ? data.message : 'Request failed.';
    throw new Error(message);
  }

  return data;
}

function getAuthHeader() {
  const token = localStorage.getItem('authToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function registerUser({ name, email, password }) {
  return jsonFetch('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, password }),
  });
}

export async function loginUser({ email, password }) {
  return jsonFetch('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export async function getUserProfile() {
  return jsonFetch('/api/user/profile', {
    method: 'GET',
    headers: getAuthHeader(),
  });
}

export async function updateUserProfile({ name, phone, bio }) {
  return jsonFetch('/api/user/profile', {
    method: 'PUT',
    headers: getAuthHeader(),
    body: JSON.stringify({ name, phone, bio }),
  });
}

