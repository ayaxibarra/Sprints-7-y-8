import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import {
  actualizarCantidad,
  agregarProducto,
  calcularTotal,
  contarUnidades,
  quitarProducto,
} from '../utils/carrito.js'

const CartContext = createContext(null)
const CART_STORAGE_KEY = 'hermanosjota_cart'

function readInitialCart() {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch (error) {
    console.warn('Error al leer el carrito desde localStorage:', error)
    return []
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(readInitialCart)

  // Persistir el estado del carrito ante recargas de página (F5)
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items))
    } catch (error) {
      console.warn('Error al persistir el carrito en localStorage:', error)
    }
  }, [items])

  const addItem = (producto) => {
    setItems((actual) => agregarProducto(actual, producto))
  }

  const removeItem = (id) => {
    setItems((actual) => quitarProducto(actual, id))
  }

  const updateQuantity = (id, nuevaCantidad) => {
    setItems((actual) => actualizarCantidad(actual, id, nuevaCantidad))
  }

  const clearCart = () => {
    setItems([])
    try {
      localStorage.removeItem(CART_STORAGE_KEY)
    } catch {
      // Ignorar en entornos sin localStorage
    }
  }

  const value = useMemo(
    () => ({
      items,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      cantidad: contarUnidades(items),
      total: calcularTotal(items),
    }),
    [items]
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)

  if (!context) {
    throw new Error('useCart debe usarse dentro de un CartProvider')
  }

  return context
}
