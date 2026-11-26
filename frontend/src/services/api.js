const API_URL = (import.meta.env.VITE_API_URL ?? '').replace(/\/$/, '')

export function getApiUrl(path = '') {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  return `${API_URL}${normalizedPath}`
}

export function getAuthHeaders(token) {
  const headers = {
    'Content-Type': 'application/json',
  }

  if (token) {
    headers.Authorization = 'Bearer ' + token
  }

  return headers
}

function messageFromStatus(status, fallback) {
  if (status === 429) {
    return fallback || 'Demasiados intentos. Intentá nuevamente más tarde.'
  }

  if (status === 401) {
    return fallback || 'Credenciales incorrectas'
  }

  return fallback || 'Ocurrió un error inesperado.'
}

export async function apiRequest(path, { method = 'GET', body, token } = {}) {
  let response

  try {
    response = await fetch(getApiUrl(path), {
      method,
      headers: getAuthHeaders(token),
      body: body !== undefined ? JSON.stringify(body) : undefined,
    })
  } catch (networkError) {
    const error = new Error(
      'No se pudo conectar con el servidor. Revisá tu conexión e intentá de nuevo.'
    )
    error.cause = networkError
    throw error
  }

  let data = null
  const contentType = response.headers.get('content-type') || ''

  if (contentType.includes('application/json')) {
    data = await response.json()
  }

  if (!response.ok) {
    const error = new Error(messageFromStatus(response.status, data?.message))
    error.status = response.status
    error.data = data
    throw error
  }

  return data
}
