import { apiRequest } from './api.js'

export function getMyOrders(token) {
  return apiRequest('/api/orders/mine', { token })
}

export function getAllOrders(token) {
  return apiRequest('/api/orders', { token })
}

export function getOrderById(orderId, token) {
  return apiRequest(`/api/orders/${encodeURIComponent(orderId)}`, { token })
}

export function getAdminTest(token) {
  return apiRequest('/api/admin/test', { token })
}

export function createOrder(orderData, token) {
  return apiRequest('/api/orders', {
    method: 'POST',
    body: orderData,
    token,
  })
}

export function updateOrderStatus(orderId, estado, token) {
  return apiRequest(`/api/orders/${encodeURIComponent(orderId)}`, {
    method: 'PUT',
    body: { estado },
    token,
  })
}

export function deleteOrder(orderId, token) {
  return apiRequest(`/api/orders/${encodeURIComponent(orderId)}`, {
    method: 'DELETE',
    token,
  })
}
