import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { useCart } from '../context/CartContext.jsx'
import { createOrder } from '../services/orderService.js'
import { formatoPrecio } from '../utils/carrito.js'

export default function Cart() {
  const { items, removeItem, updateQuantity, clearCart, total } = useCart()
  const { isAuthenticated, token } = useAuth()
  const navigate = useNavigate()

  const [direccionEnvio, setDireccionEnvio] = useState('')
  const [notas, setNotas] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [confirmedOrder, setConfirmedOrder] = useState(null)

  const handleCheckout = async (e) => {
    e.preventDefault()

    if (!isAuthenticated) {
      navigate('/login')
      return
    }

    setSubmitting(true)
    setError('')

    try {
      const orderData = {
        items: items.map((item) => ({
          product: item.id,
          cantidad: item.cantidad,
        })),
        direccionEnvio: direccionEnvio.trim(),
        notas: notas.trim(),
      }

      const data = await createOrder(orderData, token)
      setConfirmedOrder(data.order)
      clearCart()
      setDireccionEnvio('')
      setNotas('')
    } catch (err) {
      setError(err.message || 'No se pudo finalizar el pedido. Intentá nuevamente.')
    } finally {
      setSubmitting(false)
    }
  }

  if (confirmedOrder) {
    return (
      <section aria-labelledby="titulo-confirmacion" className="checkout-confirmation">
        <h1 id="titulo-confirmacion" className="seccion-titulo">¡Pedido confirmado!</h1>
        <p>Tu compra se registró correctamente en Mueblería Hermanos Jota.</p>
        <p><strong>Número de pedido:</strong> {confirmedOrder._id}</p>
        {confirmedOrder.total !== undefined && (
          <p><strong>Total:</strong> {formatoPrecio(confirmedOrder.total)}</p>
        )}
        <div className="home-acciones">
          <button type="button" className="btn-primary" onClick={() => navigate('/mis-pedidos')}>
            Ver mis pedidos
          </button>
          <button type="button" className="btn-secondary" onClick={() => navigate('/catalogo')}>
            Seguir explorando
          </button>
        </div>
      </section>
    )
  }

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
                  <p>Precio unitario: {formatoPrecio(item.price)}</p>
                  <p>Subtotal: {formatoPrecio(item.price * item.cantidad)}</p>
                </div>

                <div className="cart-item-actions">
                  <div className="cart-qty">
                    <button
                      type="button"
                      className="btn-secondary"
                      onClick={() => updateQuantity(item.id, item.cantidad - 1)}
                      aria-label={`Disminuir cantidad de ${item.name}`}
                    >
                      -
                    </button>
                    <span aria-live="polite">{item.cantidad}</span>
                    <button
                      type="button"
                      className="btn-secondary"
                      onClick={() => updateQuantity(item.id, item.cantidad + 1)}
                      aria-label={`Aumentar cantidad de ${item.name}`}
                    >
                      +
                    </button>
                  </div>

                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => removeItem(item.id)}
                    aria-label={`Quitar ${item.name} del carrito`}
                  >
                    Quitar
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <p className="cart-total">Total: {formatoPrecio(total)}</p>

          <div className="checkout-box">
            <h2 className="seccion-subtitulo">Finalizar compra</h2>

            {!isAuthenticated ? (
              <div>
                <p>Necesitás iniciar sesión para confirmar tu pedido.</p>
                <button
                  type="button"
                  className="btn-primary"
                  onClick={() => navigate('/login')}
                >
                  Iniciar sesión para comprar
                </button>
              </div>
            ) : (
              <form className="checkout-form" onSubmit={handleCheckout}>
                <label>
                  Dirección de envío (opcional)
                  <input
                    type="text"
                    value={direccionEnvio}
                    onChange={(e) => setDireccionEnvio(e.target.value)}
                    maxLength={300}
                    placeholder="Ej: Av. San Juan 2847, CABA"
                    disabled={submitting}
                  />
                </label>

                <label>
                  Notas del pedido (opcional)
                  <textarea
                    rows={3}
                    value={notas}
                    onChange={(e) => setNotas(e.target.value)}
                    placeholder="Ej: Entregar por la tarde"
                    disabled={submitting}
                  />
                </label>

                {error && (
                  <p className="estado-error" role="alert">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  className="btn-primary"
                  disabled={submitting}
                >
                  {submitting ? 'Procesando pedido...' : 'Finalizar compra'}
                </button>
              </form>
            )}
          </div>
        </>
      )}

      <div className="home-acciones" style={{ marginTop: '1.5rem' }}>
        <button type="button" className="btn-secondary" onClick={() => navigate('/catalogo')}>
          Seguir explorando
        </button>
      </div>
    </section>
  )
}