import { createContext, useContext, useMemo, useState } from 'react'
import { agregarProducto, calcularTotal, contarUnidades, quitarProducto } from '../utils/carrito.js'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [items, setItems] = useState([])

  const addItem = (producto) => {
    setItems((actual) => agregarProducto(actual, producto))
  }

  const removeItem = (id) => {
    setItems((actual) => quitarProducto(actual, id))
  }

  const clearCart = () => {
    setItems([])
  }

  const value = useMemo(
    () => ({
      items,
      addItem,
      removeItem,
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
