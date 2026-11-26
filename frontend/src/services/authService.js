import { apiRequest } from './api.js'

export function registerUser({ nombre, email, password }) {
  return apiRequest('/api/auth/register', {
    method: 'POST',
    body: { nombre, email, password },
  })
}

export function loginUser({ email, password }) {
  return apiRequest('/api/auth/login', {
    method: 'POST',
    body: { email, password },
  })
}

export function fetchCurrentUser(token) {
  return apiRequest('/api/auth/me', { token })
}
