import { apiRequest } from './api.js'

function mapProduct(product) {
  return {
    ...product,
    id: product._id || product.id,
    name: product.nombre || product.name,
    desc: product.descripcion || product.desc,
    price: product.precio ?? product.price,
    img: product.imagenUrl || product.img,
    stock: product.stock,
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
