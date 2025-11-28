import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { AuthContext } from '../context/AuthContext';
import axios from '../api/axiosConfig';

const EditarProducto = () => {
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const [productos, setProductos] = useState([]);
    const [tiposProducto, setTiposProducto] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [busqueda, setBusqueda] = useState('');
    const [productoSeleccionado, setProductoSeleccionado] = useState(null);
    const [datosOriginales, setDatosOriginales] = useState(null);
    const [formData, setFormData] = useState({
        tipoProducto: '',
        estado: '',
        vehiculoCompatible: ''
    });
    const [mostrarNuevoTipo, setMostrarNuevoTipo] = useState(false);
    const [nuevoTipo, setNuevoTipo] = useState('');
    const [editandoTipo, setEditandoTipo] = useState(false);
    const [nombreTipoEditado, setNombreTipoEditado] = useState('');
    const [showConfirmModal, setShowConfirmModal] = useState(false);

    useEffect(() => {
        cargarTiposProducto();
        cargarTodosLosProductos();
    }, []);

    const cargarTiposProducto = async () => {
        try {
            const response = await axios.get('/tipos-producto');
            setTiposProducto(response.data);
        } catch (error) {
            setError('Error al cargar tipos de producto');
        }
    };
    
    const cargarTodosLosProductos = async () => {
        try {
            const response = await axios.get('/productos');
            setProductos(response.data);
        } catch (error) {
            setError('Error al cargar productos');
        }
    };

    const buscarProductos = async () => {
        if (!busqueda.trim()) {
            cargarTodosLosProductos();
            return;
        }

        try {
            const response = await axios.get(`/productos/buscar/${busqueda}`);
            setProductos(response.data);
            if (response.data.length === 0) {
                setError('No se encontraron productos con ese término');
            }
        } catch (error) {
            setError('Error al buscar productos');
        }
    };

    const seleccionarProducto = (producto) => {
        setProductoSeleccionado(producto);
        setDatosOriginales({
            tipoProducto: producto.tipoProducto?.idTipo || '',
            estado: producto.estado || '',
            vehiculoCompatible: producto.vehiculoCompatible || ''
        });
        setFormData({
            tipoProducto: producto.tipoProducto?.idTipo || '',
            estado: producto.estado || '',
            vehiculoCompatible: producto.vehiculoCompatible || ''
        });
        setNombreTipoEditado(producto.tipoProducto?.nombre || '');
        setEditandoTipo(false);
        setError('');
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        
        if (name === 'tipoProducto' && value === 'nuevo') {
            setMostrarNuevoTipo(true);
            setFormData(prev => ({ ...prev, tipoProducto: '' }));
        } else if (name === 'tipoProducto') {
            setMostrarNuevoTipo(false);
            setFormData(prev => ({ ...prev, [name]: value }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
        setError('');
    };

    const hayCambios = () => {
        if (!datosOriginales) return false;
        const cambiosFormulario = JSON.stringify(formData) !== JSON.stringify(datosOriginales);
        const cambiosTipo = editandoTipo && nombreTipoEditado.trim() !== productoSeleccionado?.tipoProducto?.nombre;
        return cambiosFormulario || cambiosTipo;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!hayCambios()) {
            setError('No se han realizado cambios');
            return;
        }

        setShowConfirmModal(true);
    };
    
    const confirmarCambios = async () => {
        setLoading(true);
        setError('');
        setShowConfirmModal(false);

        try {
            let datosActualizados;
            
            // Si se editó el nombre del tipo, actualizar el tipo primero
            if (editandoTipo && nombreTipoEditado.trim() !== productoSeleccionado.tipoProducto?.nombre) {
                await axios.put(`/tipos-producto/${productoSeleccionado.tipoProducto.idTipo}`, {
                    nombre: nombreTipoEditado.trim()
                });
            }
            
            if (mostrarNuevoTipo && nuevoTipo.trim()) {
                // Crear producto con nuevo tipo
                datosActualizados = {
                    tipoProducto: { nombre: nuevoTipo.trim() },
                    estado: formData.estado,
                    vehiculoCompatible: formData.vehiculoCompatible
                };
            } else {
                // Usar tipo existente
                datosActualizados = {
                    tipoProducto: { idTipo: parseInt(formData.tipoProducto) },
                    estado: formData.estado,
                    vehiculoCompatible: formData.vehiculoCompatible
                };
            }

            await axios.put(`/productos/${productoSeleccionado.idProducto}`, datosActualizados);
            
            setSuccess('Producto actualizado exitosamente');
            
            setTimeout(() => {
                navigate('/dashboard');
            }, 2000);
            
        } catch (error) {
            setError(error.response?.data || 'Error al actualizar producto');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout>
            <div className="container-fluid">
                <div className="row justify-content-center">
                    <div className="col-md-10">
                        <div className="card">
                            <div className="card-body">
                                <h2 className="card-title">Editar Producto</h2>
                                {error && (
                                    <div className="alert alert-danger" role="alert">
                                        {error}
                                    </div>
                                )}
                                
                                {success && (
                                    <div className="alert alert-success" role="alert">
                                        {success}
                                    </div>
                                )}

                                {/* Sección de búsqueda */}
                                <div className="row mb-4">
                                    <div className="col-md-8">
                                        <label htmlFor="busqueda" className="form-label">
                                            Buscar producto por SKU o nombre
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="busqueda"
                                            value={busqueda}
                                            onChange={(e) => setBusqueda(e.target.value)}
                                            placeholder="Ej: FRE01, Frenos, etc."
                                        />
                                    </div>
                                    <div className="col-md-4 d-flex align-items-end">
                                        <button
                                            type="button"
                                            className="btn btn-outline-primary w-100"
                                            onClick={buscarProductos}
                                        >
                                            Buscar
                                        </button>
                                    </div>
                                </div>

                                {/* Lista de productos */}
                                {productos.length > 0 && !productoSeleccionado && (
                                    <div className="mb-4">
                                        <h5>{busqueda ? 'Productos encontrados:' : 'Todos los productos:'}</h5>
                                        <div className="table-responsive">
                                            <table className="table table-hover">
                                                <thead>
                                                    <tr>
                                                        <th>SKU</th>
                                                        <th>Tipo</th>
                                                        <th>Estado</th>
                                                        <th>Stock</th>
                                                        <th>Vehículo</th>
                                                        <th>Acción</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {productos.map(producto => (
                                                        <tr key={producto.idProducto}>
                                                            <td><strong>{producto.sku}</strong></td>
                                                            <td>{producto.tipoProducto?.nombre}</td>
                                                            <td>
                                                                <span className={`badge ${producto.estado === 'Activo' ? 'bg-success' : 'bg-secondary'}`}>
                                                                    {producto.estado}
                                                                </span>
                                                            </td>
                                                            <td>{producto.stockActual}</td>
                                                            <td>{producto.vehiculoCompatible || 'N/A'}</td>
                                                            <td>
                                                                <button
                                                                    className="btn btn-sm btn-primary"
                                                                    onClick={() => seleccionarProducto(producto)}
                                                                >
                                                                    Editar
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                )}

                                {/* Formulario de edición */}
                                {productoSeleccionado && (
                                    <div>
                                        <div className="alert alert-info">
                                            <h5>Editando producto: <strong>{productoSeleccionado.sku}</strong></h5>
                                            <p className="mb-0">Stock actual: {productoSeleccionado.stockActual} unidades</p>
                                        </div>

                                        <form onSubmit={handleSubmit}>
                                            <div className="row">
                                                <div className="col-md-6">
                                                    <div className="mb-3">
                                                        <label htmlFor="sku" className="form-label">
                                                            SKU (No modificable)
                                                        </label>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            id="sku"
                                                            value={productoSeleccionado.sku}
                                                            disabled
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="mb-3">
                                                        <label htmlFor="stockActual" className="form-label">
                                                            Stock Actual (Solo información)
                                                        </label>
                                                        <input
                                                            type="number"
                                                            className="form-control"
                                                            id="stockActual"
                                                            value={productoSeleccionado.stockActual}
                                                            disabled
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="row">
                                                <div className="col-md-6">
                                                    <div className="mb-3">
                                                        <label htmlFor="tipoProducto" className="form-label">
                                                            Tipo de Producto
                                                        </label>
                                                        {!editandoTipo ? (
                                                            <div>
                                                                <input
                                                                    type="text"
                                                                    className="form-control"
                                                                    value={productoSeleccionado.tipoProducto?.nombre || ''}
                                                                    disabled
                                                                />
                                                                <div className="mt-2">
                                                                    <button
                                                                        type="button"
                                                                        className="btn btn-sm btn-outline-secondary"
                                                                        onClick={() => setEditandoTipo(true)}
                                                                    >
                                                                        Editar nombre del tipo
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <div>
                                                                <input
                                                                    type="text"
                                                                    className="form-control"
                                                                    id="nombreTipoEditado"
                                                                    value={nombreTipoEditado}
                                                                    onChange={(e) => setNombreTipoEditado(e.target.value)}
                                                                    placeholder="Nuevo nombre del tipo"
                                                                />
                                                                <div className="form-text text-warning mt-1">
                                                                     Esto cambiará el nombre para TODOS los productos de este tipo
                                                                </div>
                                                                <div className="mt-2">
                                                                    <button
                                                                        type="button"
                                                                        className="btn btn-sm btn-secondary me-2"
                                                                        onClick={() => {
                                                                            setEditandoTipo(false);
                                                                            setNombreTipoEditado(productoSeleccionado.tipoProducto?.nombre || '');
                                                                        }}
                                                                    >
                                                                        Cancelar
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="mb-3">
                                                        <label htmlFor="estado" className="form-label">
                                                            Estado *
                                                        </label>
                                                        <select
                                                            className="form-select"
                                                            id="estado"
                                                            name="estado"
                                                            value={formData.estado}
                                                            onChange={handleChange}
                                                            required
                                                        >
                                                            <option value="">Seleccionar estado...</option>
                                                            <option value="Activo">Activo</option>
                                                            <option value="Inactivo">Inactivo</option>
                                                            <option value="Descontinuado">Descontinuado</option>
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="mb-3">
                                                <label htmlFor="vehiculoCompatible" className="form-label">
                                                    Vehículo Compatible
                                                </label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    id="vehiculoCompatible"
                                                    name="vehiculoCompatible"
                                                    value={formData.vehiculoCompatible}
                                                    onChange={handleChange}
                                                    placeholder="Ej: Toyota Corolla 2020-2023"
                                                />
                                            </div>

                                            <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                                                <button
                                                    type="button"
                                                    className="btn btn-secondary me-md-2"
                                                    onClick={() => {
                                                        setProductoSeleccionado(null);
                                                        setProductos([]);
                                                        setBusqueda('');
                                                    }}
                                                >
                                                    Buscar Otro
                                                </button>
                                                <button
                                                    type="button"
                                                    className="btn btn-outline-secondary me-md-2"
                                                    onClick={() => navigate('/dashboard')}
                                                >
                                                    Cancelar
                                                </button>
                                                <button
                                                    type="submit"
                                                    className="btn btn-primary"
                                                    disabled={loading || !hayCambios()}
                                                >
                                                    Guardar Cambios
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Modal de confirmación */}
                {showConfirmModal && (
                    <div className="modal show d-block" tabIndex="-1" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header bg-primary text-white">
                                    <h5 className="modal-title">Confirmar Cambios</h5>
                                </div>
                                <div className="modal-body">
                                    <p><strong>Producto:</strong> {productoSeleccionado?.sku}</p>
                                    
                                    {editandoTipo && nombreTipoEditado.trim() !== productoSeleccionado?.tipoProducto?.nombre && (
                                        <div className="alert alert-warning">
                                            <p><strong>Cambio de tipo de producto:</strong></p>
                                            <p>De: "{productoSeleccionado?.tipoProducto?.nombre}"</p>
                                            <p>A: "{nombreTipoEditado}"</p>
                                            <p><strong>Esto afectará TODOS los productos de este tipo</strong></p>
                                        </div>
                                    )}
                                    
                                    {formData.estado !== datosOriginales?.estado && (
                                        <p><strong>Estado:</strong> {datosOriginales?.estado} → {formData.estado}</p>
                                    )}
                                    
                                    {formData.vehiculoCompatible !== datosOriginales?.vehiculoCompatible && (
                                        <p><strong>Vehículo compatible:</strong> 
                                        {datosOriginales?.vehiculoCompatible || 'N/A'} → {formData.vehiculoCompatible || 'N/A'}</p>
                                    )}
                                    
                                    <hr/>
                                    <p className="text-primary"><strong>¿Confirma los cambios?</strong></p>
                                </div>
                                <div className="modal-footer">
                                    <button 
                                        type="button" 
                                        className="btn btn-secondary"
                                        onClick={() => setShowConfirmModal(false)}
                                    >
                                        Cancelar
                                    </button>
                                    <button 
                                        type="button" 
                                        className="btn btn-primary"
                                        onClick={confirmarCambios}
                                        disabled={loading}
                                    >
                                        {loading ? 'Guardando...' : 'Confirmar Cambios'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default EditarProducto;