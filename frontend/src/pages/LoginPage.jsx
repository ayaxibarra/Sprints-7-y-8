import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import estilos from '../components/ContactForm.module.css'

const EMAIL_VALIDO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validar({ email, password }) {
  const errores = {}

  if (!email.trim()) {
    errores.email = 'Ingresá tu email.'
  } else if (!EMAIL_VALIDO.test(email.trim())) {
    errores.email = 'El formato del email no es válido.'
  }

  if (!password) {
    errores.password = 'Ingresá tu contraseña.'
  }

  return errores
}

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const destino = location.state?.from || '/'

  const [valores, setValores] = useState({ email: '', password: '' })
  const [errores, setErrores] = useState({})
  const [errorServidor, setErrorServidor] = useState('')
  const [enviando, setEnviando] = useState(false)

  function actualizarCampo(evento) {
    const { name, value } = evento.target
    setValores((actual) => ({ ...actual, [name]: value }))
    setErrores((actual) => {
      if (!actual[name]) return actual
      const siguientes = { ...actual }
      delete siguientes[name]
      return siguientes
    })
    setErrorServidor('')
  }

  async function manejarEnvio(evento) {
    evento.preventDefault()
    const siguientesErrores = validar(valores)

    if (Object.keys(siguientesErrores).length > 0) {
      setErrores(siguientesErrores)
      return
    }

    setEnviando(true)
    setErrorServidor('')

    try {
      await login({
        email: valores.email.trim(),
        password: valores.password,
      })
      navigate(destino, { replace: true })
    } catch (error) {
      setErrorServidor(error.message)
    } finally {
      setEnviando(false)
    }
  }

  return (
    <section id="contacto" className={estilos.seccion} aria-labelledby="login-titulo">
      <h1 id="login-titulo" className={estilos.titulo}>Iniciar sesión</h1>
      <p className={estilos.bajada}>
        Ingresá con tu email y contraseña para ver tus pedidos y finalizar compras.
      </p>

      {errorServidor && (
        <p className={`${estilos.error} auth-alert`} role="alert">
          {errorServidor}
        </p>
      )}

      <form className={estilos.formulario} noValidate onSubmit={manejarEnvio}>
        <div className={estilos.campo}>
          <label className={estilos.etiqueta} htmlFor="email">Email</label>
          <input
            className={`${estilos.entrada} ${errores.email ? estilos.entradaInvalida : ''}`}
            type="email"
            id="email"
            name="email"
            autoComplete="email"
            value={valores.email}
            onChange={actualizarCampo}
            aria-invalid={Boolean(errores.email)}
          />
          {errores.email && <p className={estilos.error} role="alert">{errores.email}</p>}
        </div>

        <div className={estilos.campo}>
          <label className={estilos.etiqueta} htmlFor="password">Contraseña</label>
          <input
            className={`${estilos.entrada} ${errores.password ? estilos.entradaInvalida : ''}`}
            type="password"
            id="password"
            name="password"
            autoComplete="current-password"
            value={valores.password}
            onChange={actualizarCampo}
            aria-invalid={Boolean(errores.password)}
          />
          {errores.password && <p className={estilos.error} role="alert">{errores.password}</p>}
        </div>

        <button className={estilos.enviar} type="submit" disabled={enviando}>
          {enviando ? 'Ingresando...' : 'Iniciar sesión'}
        </button>
      </form>

      <p className="auth-switch">
        ¿No tenés cuenta? <Link to="/register">Registrate</Link>
      </p>
    </section>
  )
}
