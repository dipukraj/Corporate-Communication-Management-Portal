import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { API_BASE } from '../config/apiConfig';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [backendOnline, setBackendOnline] = useState(null);
  const [mongoConnected, setMongoConnected] = useState(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get('/api/health', { baseURL: API_BASE, timeout: 5000 })
      .then((res) => {
        setBackendOnline(true);
        setMongoConnected(res.data.mongo === 'connected');
      })
      .catch(() => {
        setBackendOnline(false);
        setMongoConnected(false);
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast.success('Login successful!');
      navigate('/dashboard');
    } catch (error) {
      const isNetworkError = !error.response;
      toast.error(
        isNetworkError
          ? 'Backend server not running. Start MongoDB & backend first (npm run dev in backend folder).'
          : error.response?.data?.message || 'Login failed'
      );
    } finally {
      setLoading(false);
    }
  };

  const isLocalhost =
    window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  const isLiveWithoutBackend =
    !isLocalhost && API_BASE.includes('localhost');

  return (
    <div className="login-page">
      <div className="login-card">
        <h1>CMS Portal</h1>
        <p className="subtitle">Corporate Communication Management System</p>

        {backendOnline === false && isLiveWithoutBackend && (
          <div
            style={{
              background: '#fef2f2',
              border: '1px solid #fecaca',
              color: '#991b1b',
              padding: '12px',
              borderRadius: '8px',
              marginBottom: '20px',
              fontSize: '0.875rem',
            }}
          >
            <strong>Backend deploy nahi hua!</strong>
            <br />
            Netlify sirf frontend host karta hai. Backend <strong>Railway</strong> ya <strong>Render</strong> par deploy karo,
            phir Netlify mein <code>VITE_API_URL</code> set karke site dubara deploy karo.
          </div>
        )}

        {backendOnline === false && !isLiveWithoutBackend && isLocalhost && (
          <div
            style={{
              background: '#fef2f2',
              border: '1px solid #fecaca',
              color: '#991b1b',
              padding: '12px',
              borderRadius: '8px',
              marginBottom: '20px',
              fontSize: '0.875rem',
            }}
          >
            <strong>Backend offline!</strong> PowerShell mein ye chalao:
            <br />
            <code>cd backend</code> → <code>npm run dev</code>
            <br />
            Ya root folder se: <code>npm run dev</code>
          </div>
        )}

        {backendOnline === false && !isLiveWithoutBackend && !isLocalhost && (
          <div
            style={{
              background: '#fef2f2',
              border: '1px solid #fecaca',
              color: '#991b1b',
              padding: '12px',
              borderRadius: '8px',
              marginBottom: '20px',
              fontSize: '0.875rem',
            }}
          >
            <strong>Backend server reach nahi ho raha!</strong>
            <br />
            {API_BASE.includes('railway.app') ? 'Railway' : API_BASE.includes('onrender.com') ? 'Render' : 'Backend hosting dashboard'} par status aur logs check karo.
          </div>
        )}

        {backendOnline === true && mongoConnected === false && (
          <div
            style={{
              background: '#fffbeb',
              border: '1px solid #fde68a',
              color: '#92400e',
              padding: '12px',
              borderRadius: '8px',
              marginBottom: '20px',
              fontSize: '0.875rem',
            }}
          >
            <strong>Backend chal raha hai, MongoDB connect nahi hai!</strong>
            <br />
            Atlas → <strong>Network Access</strong> → <strong>Add IP</strong> →{' '}
            <strong>Allow Access from Anywhere (0.0.0.0/0)</strong>
            <br />
            Phir backend restart: <code>npm run dev</code> → <code>npm run seed</code>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@cms.com"
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              required
            />
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div style={{ marginTop: '24px', fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
          <p><strong>Demo Accounts:</strong></p>
          <p>Admin: admin@cms.com / admin123</p>
          <p>Editor: editor@cms.com / editor123</p>
          <p>HR User: hr@cms.com / hr1234</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
