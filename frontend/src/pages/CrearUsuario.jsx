import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import api from '../api/axiosConfig';

const CrearUsuario = () => {
  const [formData, setFormData] = useState({
    username: '',
    correo: '',
    passHash: '',
    activo: true,
    rol: { idRol: 1 }
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name === 'idRol') {
      setFormData({ ...formData, rol: { idRol: parseInt(value) } });
    } else if (type === 'checkbox') {
      setFormData({ ...formData, [name]: checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await api.post('/usuarios', formData);
      setSuccess('Usuario creado exitosamente');
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (err) {
      // Extraer el mensaje de error del backend
      let errorMessage = 'Error al crear usuario';
      
      if (err.response?.data) {
        if (typeof err.response.data === 'string') {
          try {
            const parsed = JSON.parse(err.response.data);
            errorMessage = parsed.error || errorMessage;
          } catch {
            errorMessage = err.response.data;
          }
        } else if (err.response.data.error) {
          errorMessage = err.response.data.error;
        } else if (err.response.data.message) {
          errorMessage = err.response.data.message;
        }
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="row justify-content-center">
        <div className="col-md-8">
            <div className="card">
              <div className="card-body">
                <h2 className="card-title">Crear Usuario</h2>
                
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label">Usuario</label>
                    <input
                      type="text"
                      name="username"
                      className="form-control"
                      value={formData.username}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Correo</label>
                    <input
                      type="email"
                      name="correo"
                      className="form-control"
                      value={formData.correo}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Contraseña</label>
                    <input
                      type="password"
                      name="passHash"
                      className="form-control"
                      value={formData.passHash}
                      onChange={handleChange}
                      required
                      minLength={8}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Rol</label>
                    <select
                      name="idRol"
                      className="form-select"
                      value={formData.rol.idRol}
                      onChange={handleChange}
                      required
                    >
                      <option value={1}>Administrador</option>
                      <option value={2}>Supervisor</option>
                      <option value={3}>Empleado</option>
                    </select>
                  </div>

                  <div className="mb-3 form-check">
                    <input
                      type="checkbox"
                      name="activo"
                      className="form-check-input"
                      checked={formData.activo}
                      onChange={handleChange}
                    />
                    <label className="form-check-label">Usuario Activo</label>
                  </div>

                  {error && <div className="alert alert-danger">{error}</div>}
                  {success && <div className="alert alert-success">{success}</div>}

                  <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? 'Creando...' : 'Crear Usuario'}
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-secondary ms-2" 
                    onClick={() => navigate('/dashboard')}
                  >
                    Cancelar
                  </button>
                </form>
              </div>
            </div>
        </div>
      </div>
    </Layout>
  );
};

export default CrearUsuario;
