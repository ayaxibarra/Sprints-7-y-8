import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <section className="cuenta-page" style={{ textAlign: 'center', padding: '4rem 1rem' }}>
      <h1 className="seccion-titulo" style={{ fontSize: '4rem', marginBottom: '0.5rem', color: '#a0522d' }}>404</h1>
      <h2 className="seccion-subtitulo" style={{ marginBottom: '1.5rem' }}>Página no encontrada</h2>
      <p style={{ maxWidth: '480px', margin: '0 auto 2rem', color: '#666', lineHeight: 1.6 }}>
        La página que estás buscando no existe o fue trasladada. Podés volver a la página principal o explorar nuestro catálogo de muebles artesanales.
      </p>
      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
        <Link to="/" className="btn-primary" style={{ textDecoration: 'none' }}>
          Ir al Inicio
        </Link>
        <Link to="/catalogo" className="btn-secondary" style={{ textDecoration: 'none' }}>
          Ver Catálogo
        </Link>
      </div>
    </section>
  )
}
