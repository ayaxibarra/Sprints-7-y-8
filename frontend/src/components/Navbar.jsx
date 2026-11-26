import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { useCart } from '../context/CartContext.jsx'

export function Navbar() {
  const { user, isAuthenticated, logout } = useAuth()
  const { cantidad } = useCart()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/')
  }

  return (
    <header className="site-header">
      <div className="header-container">
        <div className="logo">
          <NavLink to="/" aria-label="Mueblería Hermanos Jota - Inicio">
            <img src="/img/logo.svg" alt="Logo Mueblería Hermanos Jota" className="logo-img" />
          </NavLink>
        </div>
        <nav className="main-nav" aria-label="Menú de navegación principal">
          <ul className="nav-list">
            <li>
              <NavLink to="/" end>Inicio</NavLink>
            </li>
            <li>
              <NavLink to="/catalogo">Catálogo</NavLink>
            </li>
            <li>
              <NavLink to="/contacto">Contacto</NavLink>
            </li>
            {isAuthenticated && (
              <>
                <li>
                  <NavLink to="/perfil">Perfil</NavLink>
                </li>
                <li>
                  <NavLink to="/mis-pedidos">Mis pedidos</NavLink>
                </li>
              </>
            )}
            {user?.role === 'admin' && (
              <li>
                <NavLink to="/admin">Administración</NavLink>
              </li>
            )}
          </ul>
        </nav>
        <div className="header-actions">
          <div className="cart-widget">
            <NavLink to="/carrito" id="cart-link" aria-label="Ver carrito de compras">
              <span className="cart-icon" aria-hidden="true">🛒</span>
              <span id="cart-counter" aria-live="polite">{cantidad}</span>
            </NavLink>
          </div>
          <div className="auth-links">
            {!isAuthenticated && (
              <>
                <NavLink to="/login">Iniciar sesión</NavLink>
                <NavLink to="/register">Registrarse</NavLink>
              </>
            )}
            {isAuthenticated && (
              <>
                <span className="user-greeting">Hola, {user.nombre}</span>
                <button type="button" className="btn-logout" onClick={handleLogout}>
                  Cerrar sesión
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
