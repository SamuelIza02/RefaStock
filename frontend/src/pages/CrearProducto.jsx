import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import api from '../api/axiosConfig';

const CrearProducto = () => {
  const [formData, setFormData] = useState({
    tipoProducto: { idTipo: '' },
    estado: 'Activo',
    stockActual: 0,
    stockMinimo: 0,
    vehiculoCompatible: ''
  });
  
  const [tiposProducto, setTiposProducto] = useState([]);
  const [mostrarNuevoTipo, setMostrarNuevoTipo] = useState(false);
  const [nuevoTipo, setNuevoTipo] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const navigate = useNavigate();

  // Cargar tipos de producto al montar el componente
  useEffect(() => {
    const cargarTipos = async () => {
      try {
        const response = await api.get('/tipos-producto');
        setTiposProducto(response.data);
        if (response.data.length > 0) {
          setFormData(prev => ({
            ...prev,
            tipoProducto: { idTipo: response.data[0].idTipo }
          }));
        }
      } catch (err) {
        setError('Error al cargar tipos de producto');
      }
    };
    cargarTipos();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'idTipo') {
      if (value === 'nuevo') {
        setMostrarNuevoTipo(true);
        setFormData({ ...formData, tipoProducto: { idTipo: '' } });
      } else {
        setMostrarNuevoTipo(false);
        setFormData({ ...formData, tipoProducto: { idTipo: parseInt(value) } });
      }
    } else if (name === 'stockActual' || name === 'stockMinimo') {
      setFormData({ ...formData, [name]: parseInt(value) || 0 });
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
      // Si se está creando un nuevo tipo
      if (mostrarNuevoTipo && nuevoTipo.trim()) {
        // Verificar si el tipo ya existe
        const tipoExistente = tiposProducto.find(
          t => t.nombre.toLowerCase() === nuevoTipo.trim().toLowerCase()
        );
        
        if (tipoExistente) {
          formData.tipoProducto.idTipo = tipoExistente.idTipo;
        } else {
          const tipoResponse = await api.post('/tipos-producto', { nombre: nuevoTipo });
          formData.tipoProducto.idTipo = tipoResponse.data.idTipo;
        }
      }
      
      await api.post('/productos', formData);
      setSuccess('Producto creado exitosamente');
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al crear producto');
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
                <h2 className="card-title">Registrar Producto</h2>
                
                <form onSubmit={handleSubmit}>
                  <div className="alert alert-info">
                    <small>El SKU se generará automáticamente según el tipo de producto</small>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Tipo de Producto</label>
                    <select
                      name="idTipo"
                      className="form-select"
                      value={mostrarNuevoTipo ? 'nuevo' : formData.tipoProducto.idTipo}
                      onChange={handleChange}
                      required={!mostrarNuevoTipo}
                    >
                      <option value="">Seleccione un tipo</option>
                      {tiposProducto.map(tipo => (
                        <option key={tipo.idTipo} value={tipo.idTipo}>
                          {tipo.nombre}
                        </option>
                      ))}
                      <option value="nuevo">+ Agregar nuevo tipo</option>
                    </select>
                  </div>

                  {mostrarNuevoTipo && (
                    <div className="mb-3">
                      <label className="form-label">Nombre del Nuevo Tipo</label>
                      <input
                        type="text"
                        className="form-control"
                        value={nuevoTipo}
                        onChange={(e) => setNuevoTipo(e.target.value)}
                        placeholder="Ej: Frenos, Motor, Suspensión"
                        required
                      />
                    </div>
                  )}

                  <div className="mb-3">
                    <label className="form-label">Estado</label>
                    <select
                      name="estado"
                      className="form-select"
                      value={formData.estado}
                      onChange={handleChange}
                      required
                    >
                      <option value="Activo">Activo</option>
                      <option value="Inactivo">Inactivo</option>
                      <option value="Descontinuado">Descontinuado</option>
                    </select>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Vehículo Compatible (Opcional)</label>
                    <input
                      type="text"
                      name="vehiculoCompatible"
                      className="form-control"
                      value={formData.vehiculoCompatible}
                      onChange={handleChange}
                      placeholder="Ej: Toyota Corolla 2015-2020"
                    />
                  </div>

                  {error && <div className="alert alert-danger">{error}</div>}
                  {success && <div className="alert alert-success">{success}</div>}

                  <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? 'Creando...' : 'Crear Producto'}
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

export default CrearProducto;
