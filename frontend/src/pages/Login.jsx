import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { API_BASE } from '../config/apiConfig';

const UserIcon = () => (
  <svg className="input-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
    <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z" clipRule="evenodd" />
  </svg>
);

const EnvelopeIcon = () => (
  <svg className="input-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
    <path d="M1.5 8.67v8.58a3 3 0 0 0 3 3h15a3 3 0 0 0 3-3V8.67l-8.47 5.35a3 3 0 0 1-3.06 0L1.5 8.67Z" />
    <path d="M22.5 6.908V6.75a3 3 0 0 0-3-3h-15a3 3 0 0 0-3 3v.158l9.714 6.137a1.5 1.5 0 0 0 1.572 0L22.5 6.908Z" />
  </svg>
);

const LockIcon = () => (
  <svg className="input-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
    <path fillRule="evenodd" d="M12 1.5a5.25 5.25 0 0 0-5.25 5.25v3a3 3 0 0 0-3 3v6.75a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3v-6.75a3 3 0 0 0-3-3v-3c0-2.9-2.35-5.25-5.25-5.25Zm3.75 8.25v-3a3.75 3.75 0 1 0-7.5 0v3h7.5Z" clipRule="evenodd" />
  </svg>
);

const Login = () => {
  // Login States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Register States
  const [regUsername, setRegUsername] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [backendOnline, setBackendOnline] = useState(null);
  const [mongoConnected, setMongoConnected] = useState(null);
  const [isSignUpActive, setIsSignUpActive] = useState(false);
  
  const { login, signup } = useAuth();
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

  const handleLoginSubmit = async (e) => {
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

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signup(regUsername, regEmail, regPassword);
      toast.success('Registration successful! Welcome to CMS Portal.');
      navigate('/dashboard');
    } catch (error) {
      const isNetworkError = !error.response;
      toast.error(
        isNetworkError
          ? 'Backend server not running. Start MongoDB & backend first.'
          : error.response?.data?.message || 'Registration failed'
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
    <div className="auth-page">
      {/* Floating System Alerts */}
      <div className="system-alerts-container">
        {backendOnline === false && isLiveWithoutBackend && (
          <div className="system-alert alert-error">
            <strong>Backend deploy nahi hua!</strong> Netlify sirf frontend host karta hai. Backend <strong>Railway</strong> ya <strong>Render</strong> par deploy karo, phir Netlify mein <code>VITE_API_URL</code> set karo.
          </div>
        )}

        {backendOnline === false && !isLiveWithoutBackend && isLocalhost && (
          <div className="system-alert alert-error">
            <strong>Backend offline!</strong> PowerShell mein chalao: <code>cd backend</code> → <code>npm run dev</code>
          </div>
        )}

        {backendOnline === false && !isLiveWithoutBackend && !isLocalhost && (
          <div className="system-alert alert-error">
            <strong>Backend server reach nahi ho raha!</strong> {API_BASE.includes('railway.app') ? 'Railway' : 'Render'} status check karo.
          </div>
        )}

        {backendOnline === true && mongoConnected === false && (
          <div className="system-alert alert-warning">
            <strong>MongoDB connect nahi hai!</strong> Atlas Network Access me <strong>0.0.0.0/0</strong> allow karein aur backend restart karein.
          </div>
        )}
      </div>

      {/* Main Sliding Auth Container */}
      <div className={`auth-container ${isSignUpActive ? 'right-panel-active' : ''}`} id="auth-container">
        {/* Sign Up Form Container */}
        <div className="form-container sign-up-container">
          <form onSubmit={handleRegisterSubmit}>
            <h2>Register</h2>
            
            <div className="auth-input-group">
              <input
                type="text"
                placeholder=" "
                value={regUsername}
                onChange={(e) => setRegUsername(e.target.value)}
                required
              />
              <label>Username</label>
              <UserIcon />
            </div>

            <div className="auth-input-group">
              <input
                type="email"
                placeholder=" "
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
                required
              />
              <label>Email</label>
              <EnvelopeIcon />
            </div>

            <div className="auth-input-group">
              <input
                type="password"
                placeholder=" "
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
                required
              />
              <label>Password</label>
              <LockIcon />
            </div>

            <button type="submit" className="auth-btn" disabled={loading}>
              {loading ? 'Registering...' : 'Register'}
            </button>

            <span className="mobile-toggle-text">
              Already have an account?{' '}
              <button type="button" onClick={() => setIsSignUpActive(false)} className="mobile-toggle-btn">
                Sign In
              </button>
            </span>
          </form>
        </div>

        {/* Sign In Form Container */}
        <div className="form-container sign-in-container">
          <form onSubmit={handleLoginSubmit}>
            <h2>Login</h2>

            <div className="auth-input-group">
              <input
                type="email"
                placeholder=" "
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <label>Username</label>
              <UserIcon />
            </div>

            <div className="auth-input-group">
              <input
                type="password"
                placeholder=" "
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <label>Password</label>
              <LockIcon />
            </div>

            <button type="submit" className="auth-btn" disabled={loading}>
              {loading ? 'Signing in...' : 'Login'}
            </button>

            <span className="mobile-toggle-text">
              Don't have an account?{' '}
              <button type="button" onClick={() => setIsSignUpActive(true)} className="mobile-toggle-btn">
                Sign Up
              </button>
            </span>
          </form>
        </div>

        {/* Overlay Container */}
        <div className="overlay-container">
          <div className="overlay">
            {/* Left Overlay Panel (shows when Register is active) */}
            <div className="overlay-panel overlay-left">
              <h1>WELCOME!</h1>
              <p>To keep connected with us please login with your personal info</p>
              <button className="ghost-btn" id="signIn" onClick={() => setIsSignUpActive(false)}>
                Sign In
              </button>
            </div>

            {/* Right Overlay Panel (shows when Login is active) */}
            <div className="overlay-panel overlay-right">
              <h1>WELCOME BACK!</h1>
              <p>Enter your details and start journey with us</p>
              <button className="ghost-btn" id="signUp" onClick={() => setIsSignUpActive(true)}>
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
