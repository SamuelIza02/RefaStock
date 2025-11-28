import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { AuthContext } from '../context/AuthContext';
import axios from '../api/axiosConfig';

const AjustarStock = () => {
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const [productos, setProductos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [formData, setFormData] = useState({
        producto: '',
        stockReal: '',
        motivo: ''
    });

    useEffect(() => {
        // Verificar que el usuario sea supervisor
        if (user?.rol?.nombre !== 'Supervisor' && user?.rol?.nombre !== 'Administrador') {
            setError('Solo supervisores pueden realizar ajustes de stock');
            return;
        }
        cargarProductos();
    }, [user]);

    const cargarProductos = async () => {
        try {
            const response = await axios.get('/productos/para-entradas');
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

    const getProductoSeleccionado = () => {
        return productos.find(p => p.idProducto === parseInt(formData.producto));
    };

    const calcularDiferencia = () => {
        const producto = getProductoSeleccionado();
        if (!producto || !formData.stockReal) return 0;
        return parseInt(formData.stockReal) - producto.stockActual;
    };

    const getTipoAjuste = () => {
        const diferencia = calcularDiferencia();
        if (diferencia > 0) return 'Ajuste Positivo';
        if (diferencia < 0) return 'Ajuste Negativo';
        return 'Sin cambios';
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        const diferencia = calcularDiferencia();
        if (diferencia === 0) {
            setError('No hay diferencia entre el stock real y el stock del sistema');
            return;
        }

        setShowConfirmModal(true);
    };

    const confirmarAjuste = async () => {
        setLoading(true);
        setError('');
        setShowConfirmModal(false);

        try {
            const ajusteData = {
                idProducto: parseInt(formData.producto),
                stockReal: parseInt(formData.stockReal),
                motivo: formData.motivo,
                idUsuario: user.idUsuario
            };

            const response = await axios.post('/movimientos/ajustes', ajusteData);
            
            const producto = getProductoSeleccionado();
            setSuccess(`Ajuste realizado exitosamente. Nuevo stock: ${formData.stockReal}`);
            setFormData({
                producto: '',
                stockReal: '',
                motivo: ''
            });
            
            setTimeout(() => {
                navigate('/dashboard');
            }, 2000);
            
        } catch (error) {
            setError(error.response?.data || 'Error al realizar ajuste');
        } finally {
            setLoading(false);
        }
    };

    if (user?.rol?.nombre !== 'Supervisor' && user?.rol?.nombre !== 'Administrador') {
        return (
            <Layout>
                <div className="container-fluid">
                    <div className="alert alert-warning">
                        <h4>Acceso Restringido</h4>
                        <p>Solo supervisores y administradores pueden realizar ajustes de stock.</p>
                    </div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="container-fluid">
                <div className="row justify-content-center">
                    <div className="col-md-8">
                        <div className="card">
                            <div className="card-body">
                                <h2 className="card-title">Ajustar Stock de Producto</h2>
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
                                                    (Stock actual: {producto.stockActual})
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {formData.producto && (
                                        <div className="alert alert-info">
                                            <strong>Stock actual en sistema:</strong> {getProductoSeleccionado()?.stockActual} unidades
                                        </div>
                                    )}

                                    <div className="mb-3">
                                        <label htmlFor="stockReal" className="form-label">
                                            Stock real encontrado *
                                        </label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            id="stockReal"
                                            name="stockReal"
                                            value={formData.stockReal}
                                            onChange={handleChange}
                                            min="0"
                                            required
                                        />
                                    </div>

                                    {formData.stockReal && formData.producto && (
                                        <div className={`alert ${calcularDiferencia() > 0 ? 'alert-success' : calcularDiferencia() < 0 ? 'alert-danger' : 'alert-secondary'}`}>
                                            <strong>Diferencia calculada:</strong> {calcularDiferencia()} unidades<br/>
                                            <strong>Tipo de ajuste:</strong> {getTipoAjuste()}<br/>
                                            <strong>Nuevo stock después del ajuste:</strong> {formData.stockReal} unidades
                                        </div>
                                    )}

                                    <div className="mb-3">
                                        <label htmlFor="motivo" className="form-label">
                                            Motivo del ajuste *
                                        </label>
                                        <textarea
                                            className="form-control"
                                            id="motivo"
                                            name="motivo"
                                            value={formData.motivo}
                                            onChange={handleChange}
                                            rows="3"
                                            placeholder="Ej: Inventario físico, Producto dañado, Error de sistema..."
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
                                            className="btn btn-warning"
                                            disabled={loading || calcularDiferencia() === 0}
                                        >
                                            Calcular Ajuste
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Modal de confirmación */}
                {showConfirmModal && (
                    <div className="modal show d-block" tabIndex="-1" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header bg-warning">
                                    <h5 className="modal-title">Confirmar Ajuste de Stock</h5>
                                </div>
                                <div className="modal-body">
                                    <p><strong>Producto:</strong> {getProductoSeleccionado()?.sku} - {getProductoSeleccionado()?.tipoProducto?.nombre}</p>
                                    <p><strong>Stock actual:</strong> {getProductoSeleccionado()?.stockActual} unidades</p>
                                    <p><strong>Stock real:</strong> {formData.stockReal} unidades</p>
                                    <p><strong>Diferencia:</strong> {calcularDiferencia()} unidades</p>
                                    <p><strong>Tipo:</strong> {getTipoAjuste()}</p>
                                    <p><strong>Motivo:</strong> {formData.motivo}</p>
                                    <hr/>
                                    <p className="text-warning"><strong>¿Está seguro de realizar este ajuste?</strong></p>
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
                                        className="btn btn-warning"
                                        onClick={confirmarAjuste}
                                        disabled={loading}
                                    >
                                        {loading ? 'Procesando...' : 'Confirmar Ajuste'}
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

export default AjustarStock;