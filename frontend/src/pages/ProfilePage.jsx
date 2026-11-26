import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function ProfilePage() {
  const { user } = useAuth()

  return (
    <section className="cuenta-page" aria-labelledby="perfil-titulo">
      <h1 id="perfil-titulo" className="seccion-titulo">Mi perfil</h1>
      <article className="cuenta-card">
        <p><strong>Nombre:</strong> {user?.nombre}</p>
        <p><strong>Email:</strong> {user?.email}</p>
        <p><strong>Rol:</strong> {user?.role === 'admin' ? 'Administrador' : 'Usuario'}</p>
        <p>
          <Link to="/mis-pedidos" className="btn-secondary">Ver mis pedidos</Link>
        </p>
      </article>
    </section>
  )
}
