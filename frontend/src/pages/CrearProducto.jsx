import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import axios from '../api/axiosConfig';

const CrearProducto = () => {
  const [formData, setFormData] = useState({
    tipoProducto: { idTipo: '' },
    estado: 'Activo',
    stockActual: 0,
    stockMinimo: 0,
    vehiculoCompatible: ''
  });
  
  const [tiposProducto, setTiposProducto] = useState([]);
  const [productos, setProductos] = useState([]);
  const [mostrarNuevoTipo, setMostrarNuevoTipo] = useState(true);
  const [nuevoTipo, setNuevoTipo] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [warning, setWarning] = useState('');
  
  const navigate = useNavigate();

  // Cargar tipos de producto y productos al montar el componente
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const [tiposResponse, productosResponse] = await Promise.all([
          axios.get('/tipos-producto'),
          axios.get('/productos')
        ]);
        
        setTiposProducto(tiposResponse.data);
        setProductos(productosResponse.data);
        
        // No preseleccionar ningún tipo, mantener en modo "nuevo tipo"
      } catch (err) {
        setError('Error al cargar datos');
      }
    };
    cargarDatos();
  }, []);

  const verificarProductoExistente = (idTipo) => {
    const productosDelTipo = productos.filter(p => p.tipoProducto?.idTipo === idTipo);
    
    if (productosDelTipo.length > 0) {
      const tipoNombre = tiposProducto.find(t => t.idTipo === idTipo)?.nombre;
      const skus = productosDelTipo.map(p => p.sku).join(', ');
      setWarning(`Ya existen ${productosDelTipo.length} producto(s) del tipo "${tipoNombre}"`);
    } else {
      setWarning('');
    }
  };
  
  const verificarNuevoTipo = (nombreTipo) => {
    const tipoExistente = tiposProducto.find(
      t => t.nombre.toLowerCase() === nombreTipo.trim().toLowerCase()
    );
    
    if (tipoExistente) {
      const productosDelTipo = productos.filter(p => p.tipoProducto?.idTipo === tipoExistente.idTipo);
      if (productosDelTipo.length > 0) {
        const skus = productosDelTipo.map(p => p.sku).join(', ');
        setError(`Ya existen ${productosDelTipo.length} producto(s) del tipo "${tipoExistente.nombre}"`);
      } else {
        setError('');
      }
    } else {
      setError('');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'stockActual' || name === 'stockMinimo') {
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
      let productoData = { ...formData };
      
      // Crear producto con el tipo especificado
      if (nuevoTipo.trim()) {
        // Verificar si el tipo ya existe
        const tipoExistente = tiposProducto.find(
          t => t.nombre.toLowerCase() === nuevoTipo.trim().toLowerCase()
        );
        
        if (tipoExistente) {
          // Verificar si ya hay productos de este tipo
          const productosDelTipo = productos.filter(p => p.tipoProducto?.idTipo === tipoExistente.idTipo);
          if (productosDelTipo.length > 0) {
            setError(`Ya existen productos del tipo "${tipoExistente.nombre}". Use un nombre diferente.`);
            return;
          }
          // Si el tipo existe pero no tiene productos, usar el tipo existente
          productoData.tipoProducto = { idTipo: tipoExistente.idTipo };
        } else {
          // Enviar el nombre del tipo para que el backend lo cree
          productoData.tipoProducto = { nombre: nuevoTipo.trim() };
        }
      }
      
      // Crear el producto (el backend manejará la creación del tipo si es necesario)
      await axios.post('/productos', productoData);
      
      setSuccess('Producto creado exitosamente');
      
      // Recargar tipos de producto para actualizar la lista
      const response = await axios.get('/tipos-producto');
      setTiposProducto(response.data);
      
      // Limpiar formulario
      setFormData({
        tipoProducto: { idTipo: '' },
        estado: 'Activo',
        stockActual: 0,
        stockMinimo: 0,
        vehiculoCompatible: ''
      });
      setNuevoTipo('');
      setMostrarNuevoTipo(false);
      
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (err) {
      setError(err.response?.data || err.response?.data?.message || 'Error al crear producto');
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
                    <div className="form-check">
                      <input 
                        className="form-check-input" 
                        type="radio" 
                        name="tipoOption" 
                        id="nuevoTipo" 
                        checked={mostrarNuevoTipo}
                        onChange={() => {
                          setMostrarNuevoTipo(true);
                          setFormData({ ...formData, tipoProducto: { idTipo: '' } });
                          setWarning('');
                        }}
                      />
                      <label className="form-check-label" htmlFor="nuevoTipo">
                        Agregar nuevo tipo de producto
                      </label>
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Nombre del Tipo de Producto</label>
                    <input
                      type="text"
                      className="form-control"
                      value={nuevoTipo}
                      onChange={(e) => {
                        setNuevoTipo(e.target.value);
                        verificarNuevoTipo(e.target.value);
                      }}
                      placeholder="Ej: Amortiguador, Frenos, Motor, Suspensión"
                      required
                    />
                    <div className="form-text">
                      No se permiten tipos duplicados si ya tienen productos
                    </div>
                  </div>

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

                  {warning && <div className="alert alert-warning">{warning}</div>}
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
