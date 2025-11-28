import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import CrearUsuario from './pages/CrearUsuario';
import CrearProducto from './pages/CrearProducto';
import RegistrarEntrada from './pages/RegistrarEntrada';
import RegistrarSalida from './pages/RegistrarSalida';
import AjustarStock from './pages/AjustarStock';
import EditarProducto from './pages/EditarProducto';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Ruta pública */}
          <Route path="/login" element={<Login />} />
          
          {/* Rutas protegidas */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          
          <Route path="/usuarios/crear" element={
            <ProtectedRoute>
              <CrearUsuario />
            </ProtectedRoute>
          } />

          <Route path="/productos/crear" element={
            <ProtectedRoute>
              <CrearProducto />
            </ProtectedRoute>
          } />
          
          <Route path="/movimientos/entrada" element={
            <ProtectedRoute>
              <RegistrarEntrada />
            </ProtectedRoute>
          } />
          
          <Route path="/movimientos/salida" element={
            <ProtectedRoute>
              <RegistrarSalida />
            </ProtectedRoute>
          } />
          
          <Route path="/movimientos/ajustar" element={
            <ProtectedRoute>
              <AjustarStock />
            </ProtectedRoute>
          } />
          
          <Route path="/productos/editar" element={
            <ProtectedRoute>
              <EditarProducto />
            </ProtectedRoute>
          } />
          
          {/* Redirección por defecto */}
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
