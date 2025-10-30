import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Sidebar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="bg-white vh-100 p-3" style={{ width: '250px', position: 'fixed' }}>
      {/* Header del Sidebar */}
      <div className="mb-4">
        <h4 className="text-center">RefaStock</h4>
      </div>

      {/* Información del usuario */}
      <div className="mb-4">
        <p className="mb-1"><strong>Usuario:</strong></p>
        <p className="text-muted">{user?.username}</p>
        <p className="mb-1"><strong>Rol:</strong></p>
        <p className="text-muted">{user?.rol?.nombre}</p>
      </div>

      {/* Menú de opciones del Sprint 1 */}
      <div className="mb-4">
        <ul className="list-unstyled">
          <li className="mb-2">
            <Link to="/dashboard" className="text-black text-decoration-none d-block p-2 rounded hover-bg">
              Inicio
            </Link>
          </li>
          <li className="mb-2">
            <Link to="/usuarios/crear" className="text-black text-decoration-none d-block p-2 rounded hover-bg">
              Crear Usuario
            </Link>
          </li>
          <li className="mb-2">
            <Link to="/productos/crear" className="text-black text-decoration-none d-block p-2 rounded hover-bg">
              Crear Producto
            </Link>
          </li>
          <li className="mb-2">
            <Link to="/movimientos/entrada" className="text-black text-decoration-none d-block p-2 rounded hover-bg">
              Registrar Entrada
            </Link>
          </li>
        </ul>
      </div>

      {/* Botón de logout al final */}
      <div className="position-absolute bottom-0 start-0 w-100 p-3">
        <button 
          onClick={handleLogout}
          className="btn btn-danger w-100"
        >
          Cerrar Sesión
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
