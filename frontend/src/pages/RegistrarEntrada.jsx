import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { AuthContext } from '../context/AuthContext';
import api from '../api/axiosConfig';

const RegistrarEntrada = () => {
  const [formData, setFormData] = useState({
    producto: { idProducto: '' },
    tipoMovimiento: 'Entrada',
    cantidad: 0,
    motivo: '',
    usuario: { idUsuario: '' }
  });
  
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // Cargar productos al montar el componente
  useEffect(() => {
    const cargarProductos = async () => {
      try {
        const response = await api.get('/productos');
        setProductos(response.data);
      } catch (err) {
        setError('Error al cargar productos');
      }
    };
    cargarProductos();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'idProducto') {
      setFormData({ ...formData, producto: { idProducto: parseInt(value) } });
    } else if (name === 'cantidad') {
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
      // Agregar el usuario actual
      formData.usuario.idUsuario = user.idUsuario;
      
      await api.post('/movimientos', formData);
      setSuccess('Entrada registrada exitosamente. Stock actualizado.');
      
      // Limpiar formulario
      setFormData({
        producto: { idProducto: '' },
        tipoMovimiento: 'Entrada',
        cantidad: 0,
        motivo: '',
        usuario: { idUsuario: '' }
      });
      
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al registrar entrada');
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
                <h2 className="card-title">Registrar Entrada de Producto</h2>
                
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label">Producto</label>
                    <select
                      name="idProducto"
                      className="form-select"
                      value={formData.producto.idProducto}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Seleccione un producto</option>
                      {productos.map(producto => (
                        <option key={producto.idProducto} value={producto.idProducto}>
                          {producto.sku} - {producto.tipoProducto?.nombre} (Stock actual: {producto.stockActual})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Cantidad</label>
                    <input
                      type="number"
                      name="cantidad"
                      className="form-control"
                      value={formData.cantidad}
                      onChange={handleChange}
                      required
                      min="1"
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Motivo</label>
                    <textarea
                      name="motivo"
                      className="form-control"
                      value={formData.motivo}
                      onChange={handleChange}
                      placeholder="Ej: Compra a proveedor, Devolución de cliente"
                      rows="3"
                      required
                    />
                  </div>

                  <div className="alert alert-info">
                    <small>
                      <strong>Nota:</strong> El stock se actualizará automáticamente al registrar la entrada.
                      La fecha y hora se registran automáticamente.
                    </small>
                  </div>

                  {error && <div className="alert alert-danger">{error}</div>}
                  {success && <div className="alert alert-success">{success}</div>}

                  <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? 'Registrando...' : 'Registrar Entrada'}
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

export default RegistrarEntrada;
