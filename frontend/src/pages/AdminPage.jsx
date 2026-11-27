import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import { getAllOrders, updateOrderStatus } from '../services/orderService.js'
import { createProduct, deleteProduct, getProducts, updateProduct } from '../services/productService.js'
import { formatoPrecio } from '../utils/carrito.js'

const ESTADOS_PEDIDO = ['pendiente', 'pagado', 'enviado', 'entregado', 'cancelado']

const PRODUCTO_INICIAL = {
  nombre: '',
  descripcion: '',
  precio: '',
  stock: '',
  imagenUrl: '',
}

export default function AdminPage() {
  const { token } = useAuth()

  // Pestaña activa: 'pedidos' | 'productos'
  const [tabActiva, setTabActiva] = useState('pedidos')

  // Estado general
  const [loading, setLoading] = useState(true)
  const [errorGlobal, setErrorGlobal] = useState('')
  const [mensajeExito, setMensajeExito] = useState('')

  // ---------- Sección Pedidos ----------
  const [pedidos, setPedidos] = useState([])
  const [filtroEstado, setFiltroEstado] = useState('todos')
  const [actualizandoPedidoId, setActualizandoPedidoId] = useState(null)

  // ---------- Sección Productos ----------
  const [productos, setProductos] = useState([])
  const [busquedaProducto, setBusquedaProducto] = useState('')
  const [modoEdicion, setModoEdicion] = useState(false)
  const [productoEditandoId, setProductoEditandoId] = useState(null)
  const [formProducto, setFormProducto] = useState(PRODUCTO_INICIAL)
  const [erroresForm, setErroresForm] = useState({})
  const [guardandoProducto, setGuardandoProducto] = useState(false)
  const [eliminandoId, setEliminandoId] = useState(null)

  // Carga inicial de datos
  const cargarDatos = async () => {
    setLoading(true)
    setErrorGlobal('')
    try {
      const [ordersData, productsData] = await Promise.all([
        getAllOrders(token),
        getProducts(),
      ])

      const listaPedidos = Array.isArray(ordersData) ? ordersData : ordersData?.orders || []
      setPedidos(listaPedidos)
      setProductos(Array.isArray(productsData) ? productsData : [])
    } catch (err) {
      setErrorGlobal(err.message || 'Error al cargar los datos del panel.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    cargarDatos()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token])

  // Limpiar mensaje de éxito luego de 4 segundos
  useEffect(() => {
    if (!mensajeExito) return
    const timer = setTimeout(() => setMensajeExito(''), 4000)
    return () => clearTimeout(timer)
  }, [mensajeExito])

  // ==========================================
  // Manejadores de Pedidos
  // ==========================================
  const handleCambiarEstadoPedido = async (orderId, nuevoEstado) => {
    setActualizandoPedidoId(orderId)
    setErrorGlobal('')
    try {
      const res = await updateOrderStatus(orderId, nuevoEstado, token)
      setPedidos((prev) =>
        prev.map((p) => (p._id === orderId ? { ...p, estado: res.order?.estado || nuevoEstado } : p))
      )
      setMensajeExito(`Estado del pedido ${orderId} actualizado a "${nuevoEstado}".`)
    } catch (err) {
      setErrorGlobal(err.message || 'Error al actualizar el estado del pedido.')
    } finally {
      setActualizandoPedidoId(null)
    }
  }

  const pedidosFiltrados = useMemo(() => {
    if (filtroEstado === 'todos') return pedidos
    return pedidos.filter((p) => p.estado === filtroEstado)
  }, [pedidos, filtroEstado])

  // ==========================================
  // Manejadores de Productos (CRUD)
  // ==========================================
  const validarFormulario = () => {
    const errs = {}
    const nombre = formProducto.nombre.trim()
    const precio = Number(formProducto.precio)
    const stock = Number(formProducto.stock)

    if (!nombre || nombre.length < 2) {
      errs.nombre = 'El nombre es obligatorio y debe tener al menos 2 caracteres.'
    } else if (nombre.length > 100) {
      errs.nombre = 'El nombre no puede superar 100 caracteres.'
    }

    if (formProducto.precio === '' || isNaN(precio) || precio < 0) {
      errs.precio = 'El precio debe ser un número mayor o igual a 0.'
    }

    if (formProducto.stock === '' || !Number.isInteger(stock) || stock < 0) {
      errs.stock = 'El stock debe ser un número entero mayor o igual a 0.'
    }

    setErroresForm(errs)
    return Object.keys(errs).length === 0
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormProducto((prev) => ({ ...prev, [name]: value }))
    if (erroresForm[name]) {
      setErroresForm((prev) => {
        const next = { ...prev }
        delete next[name]
        return next
      })
    }
  }

  const handleIniciarCreacion = () => {
    setModoEdicion(false)
    setProductoEditandoId(null)
    setFormProducto(PRODUCTO_INICIAL)
    setErroresForm({})
  }

  const handleIniciarEdicion = (p) => {
    setModoEdicion(true)
    setProductoEditandoId(p._id || p.id)
    setFormProducto({
      nombre: p.nombre || p.name || '',
      descripcion: p.descripcion || p.desc || '',
      precio: p.precio ?? p.price ?? '',
      stock: p.stock ?? '',
      imagenUrl: p.imagenUrl || p.img || '',
    })
    setErroresForm({})
    window.scrollTo({ top: 300, behavior: 'smooth' })
  }

  const handleCancelarEdicion = () => {
    handleIniciarCreacion()
  }

  const handleGuardarProducto = async (e) => {
    e.preventDefault()
    if (!validarFormulario()) return

    setGuardandoProducto(true)
    setErrorGlobal('')
    try {
      if (modoEdicion) {
        const res = await updateProduct(productoEditandoId, formProducto, token)
        setMensajeExito(res.mensaje || 'Producto actualizado con éxito.')
      } else {
        const res = await createProduct(formProducto, token)
        setMensajeExito(res.mensaje || 'Producto creado con éxito.')
      }
      handleIniciarCreacion()
      // Recargar lista de productos
      const data = await getProducts()
      setProductos(Array.isArray(data) ? data : [])
    } catch (err) {
      setErrorGlobal(err.message || 'Error al guardar el producto.')
    } finally {
      setGuardandoProducto(false)
    }
  }

  const handleEliminarProducto = async (producto) => {
    const id = producto._id || producto.id
    const nombre = producto.nombre || producto.name || 'este producto'
    const confirmado = window.confirm(`¿Estás seguro de que deseás eliminar el producto "${nombre}"?`)
    if (!confirmado) return

    setEliminandoId(id)
    setErrorGlobal('')
    try {
      const res = await deleteProduct(id, token)
      setMensajeExito(res.mensaje || 'Producto eliminado con éxito.')
      setProductos((prev) => prev.filter((p) => (p._id || p.id) !== id))
    } catch (err) {
      setErrorGlobal(err.message || 'Error al eliminar el producto.')
    } finally {
      setEliminandoId(null)
    }
  }

  const productosFiltrados = useMemo(() => {
    const termino = busquedaProducto.trim().toLowerCase()
    if (!termino) return productos
    return productos.filter((p) => {
      const n = (p.nombre || p.name || '').toLowerCase()
      return n.includes(termino)
    })
  }, [productos, busquedaProducto])

  return (
    <section className="cuenta-page" aria-labelledby="admin-titulo" style={{ maxWidth: '1000px' }}>
      <header style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
        <h1 id="admin-titulo" className="seccion-titulo" style={{ marginBottom: '0.25rem' }}>
          Panel de Administración
        </h1>
        <p style={{ color: '#666', fontSize: '0.95rem' }}>
          Gestión integral de pedidos y catálogo de Mueblería Hermanos Jota.
        </p>
      </header>

      {/* Notificaciones */}
      {mensajeExito && (
        <div
          role="status"
          aria-live="polite"
          style={{
            backgroundColor: '#e8f5e9',
            color: '#2e7d32',
            padding: '0.85rem 1.25rem',
            borderRadius: '6px',
            marginBottom: '1.5rem',
            border: '1px solid #c8e6c9',
            fontWeight: 500,
          }}
        >
          ✓ {mensajeExito}
        </div>
      )}

      {errorGlobal && (
        <div
          role="alert"
          style={{
            backgroundColor: '#ffebee',
            color: '#c62828',
            padding: '0.85rem 1.25rem',
            borderRadius: '6px',
            marginBottom: '1.5rem',
            border: '1px solid #ffcdd2',
            fontWeight: 500,
          }}
        >
          ⚠ {errorGlobal}
        </div>
      )}

      {/* Selector de Pestañas */}
      <nav
        aria-label="Secciones de administración"
        style={{
          display: 'flex',
          gap: '0.75rem',
          borderBottom: '2px solid #e0e0e0',
          marginBottom: '2rem',
        }}
      >
        <button
          type="button"
          onClick={() => setTabActiva('pedidos')}
          style={{
            padding: '0.75rem 1.5rem',
            background: 'none',
            border: 'none',
            borderBottom: tabActiva === 'pedidos' ? '3px solid #a0522d' : '3px solid transparent',
            color: tabActiva === 'pedidos' ? '#a0522d' : '#666',
            fontWeight: tabActiva === 'pedidos' ? 700 : 500,
            cursor: 'pointer',
            fontSize: '1rem',
          }}
        >
          Gestión de Pedidos ({pedidos.length})
        </button>

        <button
          type="button"
          onClick={() => setTabActiva('productos')}
          style={{
            padding: '0.75rem 1.5rem',
            background: 'none',
            border: 'none',
            borderBottom: tabActiva === 'productos' ? '3px solid #a0522d' : '3px solid transparent',
            color: tabActiva === 'productos' ? '#a0522d' : '#666',
            fontWeight: tabActiva === 'productos' ? 700 : 500,
            cursor: 'pointer',
            fontSize: '1rem',
          }}
        >
          Gestión de Productos ({productos.length})
        </button>
      </nav>

      {loading && (
        <div className="estado-catalogo" role="status" style={{ padding: '3rem 0', textAlign: 'center' }}>
          <span className="loader" aria-hidden="true" />
          <p>Cargando información administrativa...</p>
        </div>
      )}

      {!loading && tabActiva === 'pedidos' && (
        <div aria-labelledby="pedidos-seccion">
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '1rem',
              marginBottom: '1.5rem',
            }}
          >
            <h2 id="pedidos-seccion" className="seccion-subtitulo" style={{ margin: 0 }}>
              Pedidos Registrados
            </h2>

            {/* Filtro por estado */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <label htmlFor="filtro-estado" style={{ fontSize: '0.9rem', fontWeight: 600 }}>
                Filtrar por estado:
              </label>
              <select
                id="filtro-estado"
                value={filtroEstado}
                onChange={(e) => setFiltroEstado(e.target.value)}
                style={{
                  padding: '0.4rem 0.75rem',
                  borderRadius: '4px',
                  border: '1px solid #ccc',
                  font: 'inherit',
                }}
              >
                <option value="todos">Todos los estados</option>
                {ESTADOS_PEDIDO.map((est) => (
                  <option key={est} value={est}>
                    {est.charAt(0).toUpperCase() + est.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {pedidosFiltrados.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#666', padding: '2rem 0' }}>
              No hay pedidos que coincidan con el filtro seleccionado.
            </p>
          ) : (
            <div style={{ display: 'grid', gap: '1.25rem' }}>
              {pedidosFiltrados.map((pedido) => (
                <article
                  key={pedido._id || pedido.id}
                  style={{
                    backgroundColor: '#fff',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    padding: '1.25rem',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.04)',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      flexWrap: 'wrap',
                      gap: '1rem',
                      borderBottom: '1px solid #eee',
                      paddingBottom: '0.75rem',
                      marginBottom: '0.75rem',
                    }}
                  >
                    <div>
                      <h3 style={{ margin: '0 0 0.25rem 0', fontSize: '1.1rem', color: '#a0522d' }}>
                        Pedido #{pedido._id}
                      </h3>
                      <p style={{ margin: 0, fontSize: '0.85rem', color: '#666' }}>
                        Fecha:{' '}
                        {pedido.createdAt
                          ? new Date(pedido.createdAt).toLocaleString('es-AR')
                          : 'No especificada'}
                      </p>
                    </div>

                    {/* Selector de estado */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <label htmlFor={`estado-${pedido._id}`} style={{ fontSize: '0.85rem', fontWeight: 600 }}>
                        Estado:
                      </label>
                      <select
                        id={`estado-${pedido._id}`}
                        value={pedido.estado}
                        disabled={actualizandoPedidoId === pedido._id}
                        onChange={(e) => handleCambiarEstadoPedido(pedido._id, e.target.value)}
                        style={{
                          padding: '0.4rem 0.6rem',
                          borderRadius: '4px',
                          border: '1px solid #a0522d',
                          fontWeight: 600,
                          backgroundColor:
                            pedido.estado === 'entregado'
                              ? '#e8f5e9'
                              : pedido.estado === 'cancelado'
                              ? '#ffebee'
                              : '#fff',
                          color:
                            pedido.estado === 'entregado'
                              ? '#2e7d32'
                              : pedido.estado === 'cancelado'
                              ? '#c62828'
                              : '#29231f',
                        }}
                      >
                        {ESTADOS_PEDIDO.map((est) => (
                          <option key={est} value={est}>
                            {est.charAt(0).toUpperCase() + est.slice(1)}
                          </option>
                        ))}
                      </select>
                      {actualizandoPedidoId === pedido._id && (
                        <span style={{ fontSize: '0.8rem', color: '#a0522d' }}>Guardando...</span>
                      )}
                    </div>
                  </div>

                  {/* Datos del Cliente y Envío */}
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                      gap: '0.75rem',
                      fontSize: '0.9rem',
                      marginBottom: '1rem',
                      backgroundColor: '#faf8f5',
                      padding: '0.75rem',
                      borderRadius: '6px',
                    }}
                  >
                    <div>
                      <strong>Cliente:</strong> {pedido.user?.nombre || 'Desconocido'}
                      <br />
                      <strong>Email:</strong> {pedido.user?.email || 'No disponible'}
                    </div>
                    <div>
                      <strong>Dirección:</strong> {pedido.direccionEnvio || 'No especificada'}
                      <br />
                      <strong>Notas:</strong> {pedido.notas || 'Sin notas adicionales'}
                    </div>
                  </div>

                  {/* Items del Pedido */}
                  <div>
                    <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '0.95rem' }}>Productos:</h4>
                    <ul style={{ margin: 0, paddingLeft: '1.25rem', fontSize: '0.9rem', color: '#444' }}>
                      {pedido.items?.map((it, idx) => (
                        <li key={idx} style={{ marginBottom: '0.25rem' }}>
                          <strong>{it.cantidad}x</strong> {it.nombre} — {formatoPrecio(it.precio)} c/u{' '}
                          <span style={{ color: '#888' }}>
                            (Subtotal: {formatoPrecio(it.precio * it.cantidad)})
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div
                    style={{
                      marginTop: '1rem',
                      paddingTop: '0.5rem',
                      borderTop: '1px solid #eee',
                      textAlign: 'right',
                      fontSize: '1.1rem',
                      fontWeight: 700,
                      color: '#a0522d',
                    }}
                  >
                    Total:{' '}
                    <span style={{ color: '#29231f' }}>{formatoPrecio(pedido.total)}</span>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      )}

      {!loading && tabActiva === 'productos' && (
        <div aria-labelledby="productos-seccion">
          {/* Formulario de Alta / Edición */}
          <section
            style={{
              backgroundColor: '#fff',
              border: '1px solid #d4a437',
              borderRadius: '8px',
              padding: '1.5rem',
              marginBottom: '2.5rem',
              boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1rem',
                borderBottom: '1px solid #eee',
                paddingBottom: '0.5rem',
              }}
            >
              <h2 id="productos-seccion" className="seccion-subtitulo" style={{ margin: 0 }}>
                {modoEdicion ? 'Editar Producto' : 'Crear Nuevo Producto'}
              </h2>
              {modoEdicion && (
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={handleCancelarEdicion}
                  style={{ fontSize: '0.85rem' }}
                >
                  Cancelar Edición
                </button>
              )}
            </div>

            <form onSubmit={handleGuardarProducto} style={{ display: 'grid', gap: '1rem' }} noValidate>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                <div>
                  <label htmlFor="nombre" style={{ display: 'block', fontWeight: 600, marginBottom: '0.25rem' }}>
                    Nombre del producto *
                  </label>
                  <input
                    id="nombre"
                    name="nombre"
                    type="text"
                    value={formProducto.nombre}
                    onChange={handleInputChange}
                    placeholder="Ej. Mesa Comedor Pampa"
                    style={{
                      width: '100%',
                      padding: '0.5rem 0.75rem',
                      borderRadius: '4px',
                      border: erroresForm.nombre ? '1px solid #c62828' : '1px solid #ccc',
                      boxSizing: 'border-box',
                    }}
                  />
                  {erroresForm.nombre && (
                    <span style={{ color: '#c62828', fontSize: '0.8rem', marginTop: '0.2rem', display: 'block' }}>
                      {erroresForm.nombre}
                    </span>
                  )}
                </div>

                <div>
                  <label htmlFor="precio" style={{ display: 'block', fontWeight: 600, marginBottom: '0.25rem' }}>
                    Precio ($) *
                  </label>
                  <input
                    id="precio"
                    name="precio"
                    type="number"
                    step="any"
                    value={formProducto.precio}
                    onChange={handleInputChange}
                    placeholder="Ej. 3500"
                    style={{
                      width: '100%',
                      padding: '0.5rem 0.75rem',
                      borderRadius: '4px',
                      border: erroresForm.precio ? '1px solid #c62828' : '1px solid #ccc',
                      boxSizing: 'border-box',
                    }}
                  />
                  {erroresForm.precio && (
                    <span style={{ color: '#c62828', fontSize: '0.8rem', marginTop: '0.2rem', display: 'block' }}>
                      {erroresForm.precio}
                    </span>
                  )}
                </div>

                <div>
                  <label htmlFor="stock" style={{ display: 'block', fontWeight: 600, marginBottom: '0.25rem' }}>
                    Stock disponible *
                  </label>
                  <input
                    id="stock"
                    name="stock"
                    type="number"
                    step="1"
                    value={formProducto.stock}
                    onChange={handleInputChange}
                    placeholder="Ej. 10"
                    style={{
                      width: '100%',
                      padding: '0.5rem 0.75rem',
                      borderRadius: '4px',
                      border: erroresForm.stock ? '1px solid #c62828' : '1px solid #ccc',
                      boxSizing: 'border-box',
                    }}
                  />
                  {erroresForm.stock && (
                    <span style={{ color: '#c62828', fontSize: '0.8rem', marginTop: '0.2rem', display: 'block' }}>
                      {erroresForm.stock}
                    </span>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="imagenUrl" style={{ display: 'block', fontWeight: 600, marginBottom: '0.25rem' }}>
                  URL o Ruta de Imagen
                </label>
                <input
                  id="imagenUrl"
                  name="imagenUrl"
                  type="text"
                  value={formProducto.imagenUrl}
                  onChange={handleInputChange}
                  placeholder="Ej. /img/Mesa Comedor Pampa.png o https://..."
                  style={{
                    width: '100%',
                    padding: '0.5rem 0.75rem',
                    borderRadius: '4px',
                    border: '1px solid #ccc',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div>
                <label htmlFor="descripcion" style={{ display: 'block', fontWeight: 600, marginBottom: '0.25rem' }}>
                  Descripción
                </label>
                <textarea
                  id="descripcion"
                  name="descripcion"
                  rows={3}
                  value={formProducto.descripcion}
                  onChange={handleInputChange}
                  placeholder="Breve reseña del producto, materiales o terminación..."
                  style={{
                    width: '100%',
                    padding: '0.5rem 0.75rem',
                    borderRadius: '4px',
                    border: '1px solid #ccc',
                    font: 'inherit',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                {modoEdicion && (
                  <button type="button" className="btn-secondary" onClick={handleCancelarEdicion}>
                    Descartar
                  </button>
                )}
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={guardandoProducto}
                  style={guardandoProducto ? { opacity: 0.6, cursor: 'not-allowed' } : {}}
                >
                  {guardandoProducto
                    ? 'Guardando...'
                    : modoEdicion
                    ? 'Actualizar Producto'
                    : 'Crear Producto'}
                </button>
              </div>
            </form>
          </section>

          {/* Listado y Buscador de Productos */}
          <div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '1rem',
                marginBottom: '1rem',
              }}
            >
              <h2 className="seccion-subtitulo" style={{ margin: 0 }}>
                Catálogo Actual ({productos.length} productos)
              </h2>

              <div style={{ maxWidth: '300px', width: '100%' }}>
                <input
                  type="search"
                  placeholder="Buscar en catálogo..."
                  aria-label="Buscar producto en panel administrativo"
                  value={busquedaProducto}
                  onChange={(e) => setBusquedaProducto(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.45rem 0.75rem',
                    borderRadius: '4px',
                    border: '1px solid #ccc',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
            </div>

            {productosFiltrados.length === 0 ? (
              <p style={{ textAlign: 'center', color: '#666', padding: '2rem 0' }}>
                No se encontraron productos que coincidan con la búsqueda.
              </p>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table
                  style={{
                    width: '100%',
                    borderCollapse: 'collapse',
                    backgroundColor: '#fff',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.04)',
                    fontSize: '0.9rem',
                  }}
                >
                  <thead>
                    <tr style={{ backgroundColor: '#29231f', color: '#fff', textAlign: 'left' }}>
                      <th style={{ padding: '0.75rem 1rem' }}>Mueble</th>
                      <th style={{ padding: '0.75rem 1rem' }}>Precio</th>
                      <th style={{ padding: '0.75rem 1rem' }}>Stock</th>
                      <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {productosFiltrados.map((prod) => {
                      const id = prod._id || prod.id
                      const nombre = prod.nombre || prod.name
                      const precio = prod.precio ?? prod.price
                      const stock = prod.stock ?? 0
                      const img = prod.imagenUrl || prod.img || '/img/logo.svg'

                      return (
                        <tr key={id} style={{ borderBottom: '1px solid #eee' }}>
                          <td style={{ padding: '0.75rem 1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <img
                              src={img}
                              alt={nombre}
                              style={{ width: '42px', height: '42px', objectFit: 'cover', borderRadius: '4px' }}
                              onError={(e) => {
                                e.currentTarget.src = '/img/logo.svg'
                              }}
                            />
                            <div>
                              <strong>{nombre}</strong>
                              {prod.descripcion && (
                                <p style={{ margin: 0, fontSize: '0.8rem', color: '#777', maxWidth: '300px' }}>
                                  {prod.descripcion.slice(0, 60)}...
                                </p>
                              )}
                            </div>
                          </td>

                          <td style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>
                            {formatoPrecio(precio)}
                          </td>

                          <td style={{ padding: '0.75rem 1rem' }}>
                            <span
                              style={{
                                display: 'inline-block',
                                padding: '0.2rem 0.5rem',
                                borderRadius: '4px',
                                fontSize: '0.8rem',
                                fontWeight: 600,
                                backgroundColor: stock > 0 ? '#e8f5e9' : '#ffebee',
                                color: stock > 0 ? '#2e7d32' : '#c62828',
                              }}
                            >
                              {stock > 0 ? `${stock} u.` : 'Sin stock'}
                            </span>
                          </td>

                          <td style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>
                            <button
                              type="button"
                              className="btn-secondary"
                              onClick={() => handleIniciarEdicion(prod)}
                              style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem', marginRight: '0.5rem' }}
                            >
                              Editar
                            </button>
                            <button
                              type="button"
                              onClick={() => handleEliminarProducto(prod)}
                              disabled={eliminandoId === id}
                              style={{
                                padding: '0.3rem 0.6rem',
                                fontSize: '0.8rem',
                                backgroundColor: '#c62828',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                              }}
                            >
                              {eliminandoId === id ? 'Eliminando...' : 'Eliminar'}
                            </button>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  )
}
