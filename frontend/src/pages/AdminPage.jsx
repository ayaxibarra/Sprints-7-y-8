import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import { getAdminTest, getAllOrders } from '../services/orderService.js'
import { formatoPrecio } from '../utils/carrito.js'

export default function AdminPage() {
  const { token } = useAuth()
  const [mensaje, setMensaje] = useState('')
  const [pedidos, setPedidos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false

    Promise.all([getAdminTest(token), getAllOrders(token)])
      .then(([adminData, ordersData]) => {
        if (cancelled) return
        setMensaje(adminData?.message || 'Acceso de administrador confirmado.')
        const lista = Array.isArray(ordersData) ? ordersData : ordersData?.orders || []
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
    <section className="cuenta-page" aria-labelledby="admin-titulo">
      <h1 id="admin-titulo" className="seccion-titulo">Panel de administración</h1>
      {mensaje && <p className="mensaje-exito">{mensaje}</p>}

      {loading && (
        <div className="estado-catalogo" role="status">
          <span className="loader" aria-hidden="true" />
          <p>Cargando panel...</p>
        </div>
      )}

      {error && <p className="estado-error" role="alert">{error}</p>}

      {!loading && !error && (
        <>
          <h2 className="seccion-subtitulo">Pedidos</h2>
          {pedidos.length === 0 ? (
            <p>No hay pedidos registrados.</p>
          ) : (
            <ul className="cart-list">
              {pedidos.map((pedido) => (
                <li key={pedido._id || pedido.id} className="cart-item">
                  <div>
                    <h3>Pedido {pedido._id || pedido.id}</h3>
                    <p>Estado: {pedido.estado}</p>
                    <p>Total: {formatoPrecio(pedido.total)}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </section>
  )
}
