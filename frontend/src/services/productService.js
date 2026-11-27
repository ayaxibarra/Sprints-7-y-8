import { apiRequest } from './api.js'

function mapProduct(product) {
  if (!product) return null
  return {
    ...product,
    id: product._id || product.id,
    name: product.nombre || product.name,
    desc: product.descripcion || product.desc,
    price: product.precio ?? product.price,
    img: product.imagenUrl || product.img,
    stock: product.stock ?? 0,
    nombre: product.nombre || product.name,
    descripcion: product.descripcion || product.desc,
    precio: product.precio ?? product.price,
    imagenUrl: product.imagenUrl || product.img,
  }
}

export async function getProducts() {
  const data = await apiRequest('/api/productos')
  return Array.isArray(data) ? data.map(mapProduct) : []
}

export async function getProductById(id) {
  const data = await apiRequest(`/api/productos/${encodeURIComponent(id)}`)
  return mapProduct(data)
}

export async function createProduct(productData, token) {
  const payload = {
    nombre: productData.nombre ?? productData.name,
    descripcion: productData.descripcion ?? productData.desc ?? '',
    precio: Number(productData.precio ?? productData.price),
    stock: Number(productData.stock ?? 0),
    imagenUrl: productData.imagenUrl ?? productData.img ?? '',
  }
  return apiRequest('/api/productos', {
    method: 'POST',
    body: payload,
    token,
  })
}

export async function updateProduct(id, productData, token) {
  const payload = {
    nombre: productData.nombre ?? productData.name,
    descripcion: productData.descripcion ?? productData.desc ?? '',
    precio: Number(productData.precio ?? productData.price),
    stock: Number(productData.stock ?? 0),
    imagenUrl: productData.imagenUrl ?? productData.img ?? '',
  }
  return apiRequest(`/api/productos/${encodeURIComponent(id)}`, {
    method: 'PUT',
    body: payload,
    token,
  })
}

export async function deleteProduct(id, token) {
  return apiRequest(`/api/productos/${encodeURIComponent(id)}`, {
    method: 'DELETE',
    token,
  })
}
