import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { AuthContext } from '../context/AuthContext';
import axios from '../api/axiosConfig';

const RegistrarSalida = () => {
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const [productos, setProductos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [formData, setFormData] = useState({
        producto: '',
        cantidad: '',
        motivo: ''
    });

    useEffect(() => {
        cargarProductos();
    }, []);

    const cargarProductos = async () => {
        try {
            const response = await axios.get('/productos/para-salidas');
            setProductos(response.data);
        } catch (error) {
            setError('Error al cargar productos');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        setError('');
    };

    const getStockDisponible = () => {
        const producto = productos.find(p => p.idProducto === parseInt(formData.producto));
        return producto ? producto.stockActual : 0;
    };

    const isValidCantidad = () => {
        const cantidad = parseInt(formData.cantidad);
        const stockDisponible = getStockDisponible();
        return cantidad > 0 && cantidad <= stockDisponible;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!isValidCantidad()) {
            setError('Cantidad inválida o superior al stock disponible');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const producto = productos.find(p => p.idProducto === parseInt(formData.producto));
            
            const movimiento = {
                producto: { idProducto: parseInt(formData.producto) },
                tipoMovimiento: 'Salida',
                cantidad: parseInt(formData.cantidad),
                motivo: formData.motivo,
                usuario: { idUsuario: user.idUsuario }
            };

            await axios.post('/movimientos', movimiento);
            
            setSuccess(`Salida registrada exitosamente. Nuevo stock: ${producto.stockActual - parseInt(formData.cantidad)}`);
            setFormData({
                producto: '',
                cantidad: '',
                motivo: ''
            });
            
            setTimeout(() => {
                navigate('/dashboard');
            }, 2000);
            
        } catch (error) {
            setError(error.response?.data || 'Error al registrar salida');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout>
            <div className="container-fluid">
                <div className="row justify-content-center">
                    <div className="col-md-8">
                        <div className="card">
                            
                            
                            <div className="card-body">
                                <h2 className="card-title">Registrar Salida de Producto</h2>
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

                                <form onSubmit={handleSubmit}>
                                    <div className="mb-3">
                                        <label htmlFor="producto" className="form-label">
                                            Producto *
                                        </label>
                                        <select
                                            className="form-select"
                                            id="producto"
                                            name="producto"
                                            value={formData.producto}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="">Seleccionar producto...</option>
                                            {productos.map(producto => (
                                                <option key={producto.idProducto} value={producto.idProducto}>
                                                    {producto.sku} - {producto.tipoProducto?.nombre} 
                                                    (Stock: {producto.stockActual})
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {formData.producto && (
                                        <div className="alert alert-info">
                                            <strong>Stock disponible:</strong> {getStockDisponible()} unidades
                                        </div>
                                    )}

                                    <div className="mb-3">
                                        <label htmlFor="cantidad" className="form-label">
                                            Cantidad *
                                        </label>
                                        <input
                                            type="number"
                                            className={`form-control ${formData.cantidad && !isValidCantidad() ? 'is-invalid' : ''}`}
                                            id="cantidad"
                                            name="cantidad"
                                            value={formData.cantidad}
                                            onChange={handleChange}
                                            min="1"
                                            max={getStockDisponible()}
                                            required
                                        />
                                        {formData.cantidad && !isValidCantidad() && (
                                            <div className="invalid-feedback">
                                                Cantidad debe ser entre 1 y {getStockDisponible()}
                                            </div>
                                        )}
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="motivo" className="form-label">
                                            Motivo de la salida *
                                        </label>
                                        <textarea
                                            className="form-control"
                                            id="motivo"
                                            name="motivo"
                                            value={formData.motivo}
                                            onChange={handleChange}
                                            rows="3"
                                            placeholder="Ej: Venta, Devolución a proveedor, Transferencia..."
                                            required
                                        />
                                    </div>



                                    <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                                        <button
                                            type="button"
                                            className="btn btn-secondary me-md-2"
                                            onClick={() => navigate('/dashboard')}
                                        >
                                            Cancelar
                                        </button>
                                        <button
                                            type="submit"
                                            className="btn btn-danger"
                                            disabled={loading || !isValidCantidad() || !formData.producto}
                                        >
                                            {loading ? 'Registrando...' : 'Registrar Salida'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default RegistrarSalida;