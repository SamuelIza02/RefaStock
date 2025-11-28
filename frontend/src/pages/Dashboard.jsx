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
              {user?.rol?.nombre === 'Administrador' && (
                <>
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
                </>
              )}
              {/* Registrar Entrada - Solo Empleado y Supervisor */}
              {(user?.rol?.nombre === 'Empleado' || user?.rol?.nombre === 'Supervisor') && (
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
              )}
              
              {/* Registrar Salida - Solo Empleado y Supervisor */}
              {(user?.rol?.nombre === 'Empleado' || user?.rol?.nombre === 'Supervisor') && (
                <div className="col-md-4">
                  <div className="card text-center">
                    <div className="card-body">
                      <h5 >
                        <Link to="/movimientos/salida" className="card-title text-decoration-none">
                          Registrar Salida
                        </Link>
                      </h5>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Ajustar Stock - Solo Supervisor */}
              {user?.rol?.nombre === 'Supervisor' && (
                <div className="col-md-4">
                  <div className="card text-center">
                    <div className="card-body">
                      <h5 >
                        <Link to="/movimientos/ajustar" className="card-title text-decoration-none">
                          Ajustar Stock
                        </Link>
                      </h5>
                    </div>
                  </div>
                </div>
              )}
              
              {user?.rol?.nombre === 'Administrador' && (
                <div className="col-md-4">
                  <div className="card text-center">
                    <div className="card-body">
                      <h5 >
                        <Link to="/productos/editar" className="card-title text-decoration-none">
                          Editar Producto
                        </Link>
                      </h5>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
