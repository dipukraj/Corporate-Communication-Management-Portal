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

const GithubIcon = () => (
  <svg className="social-icon-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#ececec">
    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
  </svg>
);

const LinkedinIcon = () => (
  <svg className="social-icon-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#0077b5">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

const GlobeIcon = () => (
  <svg className="social-icon-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#0072ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);

const InstagramIcon = () => (
  <svg className="social-icon-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="url(#instagram-gradient)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <defs>
      <radialGradient id="instagram-gradient" cx="30%" cy="107%" r="130%">
        <stop offset="0%" stopColor="#fdf497" />
        <stop offset="5%" stopColor="#fdf497" />
        <stop offset="45%" stopColor="#fd5949" />
        <stop offset="60%" stopColor="#d6249f" />
        <stop offset="90%" stopColor="#285AEB" />
      </radialGradient>
    </defs>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const GoogleIcon = () => (
  <svg className="social-icon-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
  </svg>
);

const TwitterIcon = () => (
  <svg className="social-icon-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#1da1f2">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
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

  // Shared URLs for social buttons
  const socialLinks = {
    github: 'https://github.com/dipukraj',
    linkedin: 'https://www.linkedin.com/in/dipukraj',
    website: 'https://dipukraj.tech/',
    instagram: 'https://www.instagram.com/r.p.dipu',
    google: 'https://google.com'
  };

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

      {/* Top Profile Header */}
      <div className="profile-header">
        <div className="profile-avatar">DK</div>
        <div className="profile-info">
          <span className="profile-name">DIPU KUMAR RAJ</span>
          <span className="profile-title">Full Stack Developer</span>
        </div>
      </div>

      {/* Main Sliding Auth Container */}
      <div className={`auth-container ${isSignUpActive ? 'right-panel-active' : ''}`} id="auth-container">
        {/* Sign Up Form Container */}
        <div className="form-container sign-up-container">
          <form onSubmit={handleRegisterSubmit}>
            <h2>Register</h2>
            
            <div className="auth-field-wrapper">
              <span className="auth-field-label">Username</span>
              <div className="auth-input-group">
                <input
                  type="text"
                  placeholder="Enter your username"
                  value={regUsername}
                  onChange={(e) => setRegUsername(e.target.value)}
                  required
                />
                <UserIcon />
              </div>
            </div>

            <div className="auth-field-wrapper">
              <span className="auth-field-label">Email</span>
              <div className="auth-input-group">
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  required
                />
                <EnvelopeIcon />
              </div>
            </div>

            <div className="auth-field-wrapper">
              <span className="auth-field-label">Password</span>
              <div className="auth-input-group">
                <input
                  type="password"
                  placeholder="Enter your password"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  required
                />
                <LockIcon />
              </div>
            </div>

            <button type="submit" className="auth-btn" disabled={loading}>
              {loading ? 'Registering...' : 'Register'}
            </button>

            {/* OR Divider */}
            <div className="auth-divider">
              <div className="divider-line"></div>
              <span>OR</span>
              <div className="divider-line"></div>
            </div>

            {/* Social register */}
            <div className="social-login-section">
              <span className="social-login-title">Register with</span>
              <div className="social-buttons-row">
                <a href={socialLinks.github} target="_blank" rel="noopener noreferrer" className="square-social-btn social-btn-github" title="GitHub">
                  <GithubIcon />
                </a>
                <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="square-social-btn social-btn-linkedin" title="LinkedIn">
                  <LinkedinIcon />
                </a>
                <a href={socialLinks.google} target="_blank" rel="noopener noreferrer" className="square-social-btn social-btn-google" title="Google">
                  <GoogleIcon />
                </a>
                <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="square-social-btn social-btn-instagram" title="Instagram">
                  <InstagramIcon />
                </a>
                <a href={socialLinks.website} target="_blank" rel="noopener noreferrer" className="square-social-btn social-btn-website" title="Website">
                  <GlobeIcon />
                </a>
              </div>
            </div>

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

            <div className="auth-field-wrapper">
              <span className="auth-field-label">Username</span>
              <div className="auth-input-group">
                <input
                  type="email"
                  placeholder="Enter your username"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <UserIcon />
              </div>
            </div>

            <div className="auth-field-wrapper">
              <span className="auth-field-label">Password</span>
              <div className="auth-input-group">
                <input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <LockIcon />
              </div>
            </div>

            <button type="submit" className="auth-btn" disabled={loading}>
              {loading ? 'Signing in...' : 'Login'}
            </button>

            {/* OR Divider */}
            <div className="auth-divider">
              <div className="divider-line"></div>
              <span>OR</span>
              <div className="divider-line"></div>
            </div>

            {/* Social login */}
            <div className="social-login-section">
              <span className="social-login-title">Connect with me</span>
              <div className="social-buttons-row">
                <a href={socialLinks.github} target="_blank" rel="noopener noreferrer" className="square-social-btn social-btn-github" title="GitHub">
                  <GithubIcon />
                </a>
                <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="square-social-btn social-btn-linkedin" title="LinkedIn">
                  <LinkedinIcon />
                </a>
                <a href={socialLinks.google} target="_blank" rel="noopener noreferrer" className="square-social-btn social-btn-google" title="Google">
                  <GoogleIcon />
                </a>
                <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="square-social-btn social-btn-instagram" title="Instagram">
                  <InstagramIcon />
                </a>
                <a href={socialLinks.website} target="_blank" rel="noopener noreferrer" className="square-social-btn social-btn-website" title="Website">
                  <GlobeIcon />
                </a>
              </div>
            </div>

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

              {/* Connect Section on Overlay */}
              <div className="overlay-connect-section">
                <span className="overlay-connect-title">Connect with me</span>
                <div className="circular-social-row">
                  <a href={socialLinks.github} target="_blank" rel="noopener noreferrer" className="circular-social-btn social-btn-github" title="GitHub">
                    <GithubIcon />
                  </a>
                  <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="circular-social-btn social-btn-linkedin" title="LinkedIn">
                    <LinkedinIcon />
                  </a>
                  <a href={socialLinks.google} target="_blank" rel="noopener noreferrer" className="circular-social-btn social-btn-google" title="Google">
                    <GoogleIcon />
                  </a>
                  <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="circular-social-btn social-btn-instagram" title="Instagram">
                    <InstagramIcon />
                  </a>
                  <a href={socialLinks.website} target="_blank" rel="noopener noreferrer" className="circular-social-btn social-btn-website" title="Website">
                    <GlobeIcon />
                  </a>
                </div>
              </div>
            </div>

            {/* Right Overlay Panel (shows when Login is active) */}
            <div className="overlay-panel overlay-right">
              <h1>WELCOME BACK!</h1>
              <p>Enter your details and start journey with us</p>
              <button className="ghost-btn" id="signUp" onClick={() => setIsSignUpActive(true)}>
                Sign Up
              </button>

              {/* Connect Section on Overlay */}
              <div className="overlay-connect-section">
                <span className="overlay-connect-title">Connect with me</span>
                <div className="circular-social-row">
                  <a href={socialLinks.github} target="_blank" rel="noopener noreferrer" className="circular-social-btn social-btn-github" title="GitHub">
                    <GithubIcon />
                  </a>
                  <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="circular-social-btn social-btn-linkedin" title="LinkedIn">
                    <LinkedinIcon />
                  </a>
                  <a href={socialLinks.google} target="_blank" rel="noopener noreferrer" className="circular-social-btn social-btn-google" title="Google">
                    <GoogleIcon />
                  </a>
                  <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="circular-social-btn social-btn-instagram" title="Instagram">
                    <InstagramIcon />
                  </a>
                  <a href={socialLinks.website} target="_blank" rel="noopener noreferrer" className="circular-social-btn social-btn-website" title="Website">
                    <GlobeIcon />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="auth-footer">
        <span>© {new Date().getFullYear()} Dipu Kumar Raj. All rights reserved.</span>
        <span className="footer-divider">|</span>
        <a href="#" onClick={(e) => e.preventDefault()} className="footer-link">Privacy Policy</a>
        <span className="footer-divider">|</span>
        <a href="#" onClick={(e) => e.preventDefault()} className="footer-link">Terms of Use</a>
      </div>
    </div>
  );
};

export default Login;
