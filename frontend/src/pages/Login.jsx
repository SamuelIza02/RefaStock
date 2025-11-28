import { useState, useContext, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../api/axiosConfig';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const timeoutRef = useRef(null);
  
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    try {
      const response = await api.post('/auth/login', {
        username: username,
        password: password
      });

      const { user, token } = response.data;
      login(user, token);
      navigate('/dashboard');
    } catch (err) {
      let errorMsg = 'Usuario o contraseña incorrectos';
      
      if (err.response?.data) {
        if (typeof err.response.data === 'string') {
          try {
            const parsed = JSON.parse(err.response.data);
            errorMsg = parsed.error || errorMsg;
          } catch {
            errorMsg = err.response.data;
          }
        } else if (err.response.data.error) {
          errorMsg = err.response.data.error;
        }
      }
      
      setError(errorMsg);
      timeoutRef.current = setTimeout(() => {
        setError('');
        timeoutRef.current = null;
      }, 5000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="row justify-content-center" style={{ marginTop: '100px' }}>
        <div className="col-md-4">
          <div className="card shadow">
            <div className="card-body">
              <h2 className="card-title text-center mb-4">RefaStock</h2>
              <h5 className="text-center text-muted mb-4">Inicia sesión para continuar</h5>
              
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Usuario</label>
                  <input
                    type="text"
                    className="form-control"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
                
                <div className="mb-3">
                  <label className="form-label">Contraseña</label>
                  <input
                    type="password"
                    className="form-control"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                {error && <div className="alert alert-danger">{error}</div>}

                <button 
                  type="submit" 
                  disabled={loading}
                  className="btn btn-primary w-100"
                >
                  {loading ? 'Iniciando sesión...' : 'Acceder'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
