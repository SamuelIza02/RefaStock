import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-dark bg-dark">
      <div className="container-fluid">
        <span className="navbar-brand mb-0 h1">RefaStock</span>
        <div className="d-flex align-items-center">
          <span className="text-white me-3">Usuario: {user?.username}</span>
          <span className="text-white me-3">Rol: {user?.rol?.nombre}</span>
          <button 
            onClick={handleLogout}
            className="btn btn-danger"
          >
            Cerrar Sesión
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
