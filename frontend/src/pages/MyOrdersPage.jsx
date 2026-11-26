import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { getMyOrders } from '../services/orderService.js'
import { formatoPrecio } from '../utils/carrito.js'

export default function MyOrdersPage() {
  const { token } = useAuth()
  const [pedidos, setPedidos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false

    getMyOrders(token)
      .then((data) => {
        if (cancelled) return
        const lista = Array.isArray(data) ? data : data?.orders || []
        setPedidos(lista)
      })
      .catch((err) => {
        if (!cancelled) setError(err.message)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [token])

  return (
    <section className="cuenta-page" aria-labelledby="pedidos-titulo">
      <h1 id="pedidos-titulo" className="seccion-titulo">Mis pedidos</h1>

      {loading && (
        <div className="estado-catalogo" role="status">
          <span className="loader" aria-hidden="true" />
          <p>Cargando pedidos...</p>
        </div>
      )}

      {error && <p className="estado-error" role="alert">{error}</p>}

      {!loading && !error && pedidos.length === 0 && (
        <p>
          Todavía no tenés pedidos.{' '}
          <Link to="/catalogo">Explorá el catálogo</Link>
        </p>
      )}

      {!loading && !error && pedidos.length > 0 && (
        <ul className="cart-list">
          {pedidos.map((pedido) => (
            <li key={pedido._id || pedido.id} className="cart-item">
              <div>
                <h2>Pedido {pedido._id || pedido.id}</h2>
                <p>Estado: {pedido.estado}</p>
                <p>Total: {formatoPrecio(pedido.total)}</p>
                {pedido.createdAt && (
                  <p>Fecha: {new Date(pedido.createdAt).toLocaleDateString('es-AR')}</p>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
