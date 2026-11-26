import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { fetchCurrentUser, loginUser, registerUser } from '../services/authService.js'

const AuthContext = createContext(null)

const TOKEN_KEY = 'hermanosjota_token'
const USER_KEY = 'hermanosjota_user'

function readStoredUser() {
  const raw = localStorage.getItem(USER_KEY)
  if (!raw) return null

  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)

  const persistSession = (nextToken, nextUser) => {
    setToken(nextToken)
    setUser(nextUser)
    localStorage.setItem(TOKEN_KEY, nextToken)
    localStorage.setItem(USER_KEY, JSON.stringify(nextUser))
  }

  const clearSession = () => {
    setToken(null)
    setUser(null)
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
  }

  useEffect(() => {
    const storedToken = localStorage.getItem(TOKEN_KEY)
    const storedUser = readStoredUser()

    if (!storedToken) {
      setLoading(false)
      return
    }

    setToken(storedToken)
    if (storedUser) setUser(storedUser)

    fetchCurrentUser(storedToken)
      .then((data) => {
        persistSession(storedToken, data.user)
      })
      .catch(() => {
        clearSession()
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  const login = async ({ email, password }) => {
    const data = await loginUser({ email, password })
    persistSession(data.token, data.user)
    return data
  }

  const register = async ({ nombre, email, password }) => {
    const data = await registerUser({ nombre, email, password })
    persistSession(data.token, data.user)
    return data
  }

  const logout = () => {
    clearSession()
  }

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(token && user),
      loading,
      login,
      register,
      logout,
    }),
    [user, token, loading]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider')
  }

  return context
}
