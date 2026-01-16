import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

import Dashboard from './components/contratante/Dashboard';
import PrestadorDashboard from './components/prestador/PrestadorDashboard';
import ItemForm from './components/prestador/ItemForm';
import ChamadaForm from './components/contratante/ChamadaForm';
import ChamadaDetail from './components/contratante/ChamadaDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './components/admin/AdminDashboard'; // Import Admin

import './App.css';

// Componente para proteger rotas e validar perfil
const PrivateRoute = ({ children, role }) => {
  const { user, loading } = useAuth();

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: '50px' }}>Carregando autenticação...</div>;

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (role) {
    const roles = Array.isArray(role) ? role : [role];
    if (!roles.includes(user.perfil)) {
      // Redireciona para o dashboard correto se tentar acessar rota errada
      const getFallback = (p) => {
        if (p === 'prestador') return '/prestador';
        if (p === 'admin' || p === 'root') return '/admin';
        return '/contratante';
      };
      return <Navigate to={getFallback(user.perfil)} />;
    }
  }

  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app-container">
          <main className="app-content">
            <Routes>
              {/* Rotas Públicas */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Rota raiz redireciona para login */}
              <Route path="/" element={<Navigate to="/login" />} />

              {/* Área do Contratante */}
              <Route
                path="/contratante"
                element={
                  <PrivateRoute role="contratante">
                    <Dashboard />
                  </PrivateRoute>
                }
              />
              <Route
                path="/contratante/chamada/nova"
                element={
                  <PrivateRoute role="contratante">
                    <ChamadaForm />
                  </PrivateRoute>
                }
              />
              <Route
                path="/contratante/chamada/:id"
                element={
                  <PrivateRoute role="contratante">
                    <ChamadaDetail />
                  </PrivateRoute>
                }
              />

              {/* Área do Prestador */}
              <Route
                path="/prestador"
                element={
                  <PrivateRoute role="prestador">
                    <PrestadorDashboard />
                  </PrivateRoute>
                }
              />
              <Route
                path="/prestador/item/novo"
                element={
                  <PrivateRoute role="prestador">
                    <ItemForm />
                  </PrivateRoute>
                }
              />
              <Route
                path="/prestador/item/:id"
                element={
                  <PrivateRoute role="prestador">
                    <ItemForm />
                  </PrivateRoute>
                }
              />
              <Route
                path="/admin"
                element={
                  <PrivateRoute role={['admin', 'root']}>
                    <AdminDashboard />
                  </PrivateRoute>
                }
              />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
