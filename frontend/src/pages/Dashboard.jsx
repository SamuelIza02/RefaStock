import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import Layout from '../components/Layout';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useContext(AuthContext);

  return (
    <Layout>
      <div className="card shadow-sm">
        <div className="card-body">
          <h1 className="mb-4">Bienvenido, {user?.username}</h1>
          <p className="text-muted">Rol: {user?.rol?.nombre}</p>

          <hr />

          <div className="mt-4">
            <h3>Acceso rapido</h3>

            <div className="row mt-4">
              <div className="col-md-4">
                <div className="card text-center">
                  <div className="card-body">
                    <h5 >
                      <Link to="/usuarios/crear" className="card-title text-decoration-none">
                        Crear Usuario
                      </Link>
                    </h5>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="card text-center">
                  <div className="card-body">
                    <h5 >
                      <Link to="/productos/crear" className="card-title text-decoration-none">
                        Crear Producto
                      </Link>
                    </h5>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="card text-center">
                  <div className="card-body">
                    <h5 >
                      <Link to="/movimientos/entrada" className="card-title text-decoration-none">
                        Registrar Entrada
                      </Link>
                    </h5>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
