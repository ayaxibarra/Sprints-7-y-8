import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.jsx'
import { CartProvider } from './context/CartContext.jsx'
import Layout from './components/Layout.jsx'
import { GuestRoute, ProtectedRoute } from './components/ProtectedRoute.jsx'
import Home from './components/Home.jsx'
import ProductList from './components/ProductList.jsx'
import ProductDetail from './components/ProductDetail.jsx'
import Cart from './components/Cart.jsx'
import ContactForm from './components/ContactForm.jsx'
import LoginPage from './pages/LoginPage.jsx'
import RegisterPage from './pages/RegisterPage.jsx'
import ProfilePage from './pages/ProfilePage.jsx'
import MyOrdersPage from './pages/MyOrdersPage.jsx'
import AdminPage from './pages/AdminPage.jsx'
import NotFoundPage from './pages/NotFoundPage.jsx'
import './App.css'

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Home />} />
              <Route path="/catalogo" element={<ProductList />} />
              <Route path="/producto/:id" element={<ProductDetail />} />
              <Route path="/carrito" element={<Cart />} />
              <Route path="/contacto" element={<ContactForm />} />
              <Route
                path="/login"
                element={(
                  <GuestRoute>
                    <LoginPage />
                  </GuestRoute>
                )}
              />
              <Route
                path="/register"
                element={(
                  <GuestRoute>
                    <RegisterPage />
                  </GuestRoute>
                )}
              />
              <Route
                path="/perfil"
                element={(
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                )}
              />
              <Route
                path="/mis-pedidos"
                element={(
                  <ProtectedRoute>
                    <MyOrdersPage />
                  </ProtectedRoute>
                )}
              />
              <Route
                path="/admin"
                element={(
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminPage />
                  </ProtectedRoute>
                )}
              />
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  )
}
