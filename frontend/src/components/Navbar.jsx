import { Link } from 'react-router-dom';
import { FiMenu, FiSun, FiMoon, FiLogOut, FiBell } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const Navbar = ({ onToggleSidebar }) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <nav
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: 'var(--navbar-height)',
        background: 'var(--bg-secondary)',
        borderBottom: '1px solid var(--border-color)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        zIndex: 100,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button
          className="btn btn-outline btn-sm"
          onClick={onToggleSidebar}
          style={{ display: 'none' }}
          id="sidebar-toggle"
        >
          <FiMenu />
        </button>
        <Link to="/dashboard" style={{ fontWeight: 700, fontSize: '1.125rem' }}>
          CMS Portal
        </Link>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <button className="btn btn-outline btn-sm" onClick={toggleTheme} title="Toggle theme">
          {theme === 'light' ? <FiMoon /> : <FiSun />}
        </button>
        <FiBell style={{ color: 'var(--text-secondary)', fontSize: '1.25rem' }} />
        <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
          {user?.name}
          <span className={`badge badge-${user?.role}`} style={{ marginLeft: '8px' }}>
            {user?.role?.replace('_', ' ')}
          </span>
        </span>
        <button className="btn btn-outline btn-sm" onClick={logout} title="Logout">
          <FiLogOut />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
