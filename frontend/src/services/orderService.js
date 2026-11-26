import { apiRequest } from './api.js'

export function getMyOrders(token) {
  return apiRequest('/api/orders/mine', { token })
}

export function getAllOrders(token) {
  return apiRequest('/api/orders', { token })
}

export function getAdminTest(token) {
  return apiRequest('/api/admin/test', { token })
}
