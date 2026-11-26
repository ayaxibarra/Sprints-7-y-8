import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext.jsx'
import { formatoPrecio } from '../utils/carrito.js'

export default function Cart() {
  const { items, removeItem } = useCart()
  const navigate = useNavigate()
  const total = items.reduce((acc, item) => acc + item.price * item.cantidad, 0)

  return (
    <section aria-labelledby="titulo-carrito">
      <h1 id="titulo-carrito" className="seccion-titulo">Tu carrito</h1>
      {items.length === 0 ? (
        <p>Tu carrito está vacío.</p>
      ) : (
        <>
          <ul className="cart-list">
            {items.map((item) => (
              <li key={item.id} className="cart-item">
                <div>
                  <h2>{item.name}</h2>
                  <p>Cantidad: {item.cantidad}</p>
                  <p>Precio unitario: {formatoPrecio(item.price)}</p>
                  <p>Subtotal: {formatoPrecio(item.price * item.cantidad)}</p>
                </div>
                <button
                  type="button"
                  onClick={() => removeItem(item.id)}
                  aria-label={`Quitar ${item.name} del carrito`}
                >
                  Quitar
                </button>
              </li>
            ))}
          </ul>
          <p className="cart-total">Total: {formatoPrecio(total)}</p>
        </>
      )}
      <button type="button" className="btn-secondary" onClick={() => navigate('/catalogo')}>
        Seguir explorando
      </button>
      <p>Precios ilustrativos en ARS. No se realizan compras reales.</p>
    </section>
  )
}
