import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import estilos from '../components/ContactForm.module.css'

const EMAIL_VALIDO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validar({ nombre, email, password, confirmar }) {
  const errores = {}
  const nombreTrim = nombre.trim()

  if (!nombreTrim) {
    errores.nombre = 'Ingresá tu nombre.'
  } else if (nombreTrim.length < 2 || nombreTrim.length > 60) {
    errores.nombre = 'El nombre debe tener entre 2 y 60 caracteres.'
  }

  if (!email.trim()) {
    errores.email = 'Ingresá tu email.'
  } else if (!EMAIL_VALIDO.test(email.trim())) {
    errores.email = 'El formato del email no es válido.'
  }

  if (!password) {
    errores.password = 'Ingresá una contraseña.'
  } else if (password.length < 8 || password.length > 128) {
    errores.password = 'La contraseña debe tener entre 8 y 128 caracteres.'
  }

  if (confirmar !== password) {
    errores.confirmar = 'Las contraseñas no coinciden.'
  }

  return errores
}

export default function RegisterPage() {
  const { register } = useAuth()
  const navigate = useNavigate()

  const [valores, setValores] = useState({
    nombre: '',
    email: '',
    password: '',
    confirmar: '',
  })
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
      await register({
        nombre: valores.nombre.trim(),
        email: valores.email.trim(),
        password: valores.password,
      })
      navigate('/', { replace: true })
    } catch (error) {
      setErrorServidor(error.message)
    } finally {
      setEnviando(false)
    }
  }

  return (
    <section id="contacto" className={estilos.seccion} aria-labelledby="registro-titulo">
      <h1 id="registro-titulo" className={estilos.titulo}>Crear cuenta</h1>
      <p className={estilos.bajada}>
        Registrate para guardar tus pedidos y acceder a tu perfil.
      </p>

      {errorServidor && (
        <p className={`${estilos.error} auth-alert`} role="alert">
          {errorServidor}
        </p>
      )}

      <form className={estilos.formulario} noValidate onSubmit={manejarEnvio}>
        <div className={estilos.campo}>
          <label className={estilos.etiqueta} htmlFor="nombre">Nombre</label>
          <input
            className={`${estilos.entrada} ${errores.nombre ? estilos.entradaInvalida : ''}`}
            type="text"
            id="nombre"
            name="nombre"
            autoComplete="name"
            value={valores.nombre}
            onChange={actualizarCampo}
            aria-invalid={Boolean(errores.nombre)}
          />
          {errores.nombre && <p className={estilos.error} role="alert">{errores.nombre}</p>}
        </div>

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
            autoComplete="new-password"
            value={valores.password}
            onChange={actualizarCampo}
            aria-invalid={Boolean(errores.password)}
          />
          {errores.password && <p className={estilos.error} role="alert">{errores.password}</p>}
        </div>

        <div className={estilos.campo}>
          <label className={estilos.etiqueta} htmlFor="confirmar">Confirmar contraseña</label>
          <input
            className={`${estilos.entrada} ${errores.confirmar ? estilos.entradaInvalida : ''}`}
            type="password"
            id="confirmar"
            name="confirmar"
            autoComplete="new-password"
            value={valores.confirmar}
            onChange={actualizarCampo}
            aria-invalid={Boolean(errores.confirmar)}
          />
          {errores.confirmar && <p className={estilos.error} role="alert">{errores.confirmar}</p>}
        </div>

        <button className={estilos.enviar} type="submit" disabled={enviando}>
          {enviando ? 'Creando cuenta...' : 'Registrarse'}
        </button>
      </form>

      <p className="auth-switch">
        ¿Ya tenés cuenta? <Link to="/login">Iniciá sesión</Link>
      </p>
    </section>
  )
}
