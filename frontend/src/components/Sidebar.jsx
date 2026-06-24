import { NavLink } from 'react-router-dom';
import {
  FiHome,
  FiUsers,
  FiUpload,
  FiBookOpen,
  FiImage,
  FiUser,
  FiBriefcase,
  FiActivity,
} from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

const Sidebar = ({ isOpen, onClose }) => {
  const { isAdmin, isEditor, isViewer } = useAuth();

  const linkStyle = ({ isActive }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 20px',
    color: isActive ? '#fff' : 'var(--text-sidebar)',
    background: isActive ? 'var(--accent)' : 'transparent',
    borderRadius: '8px',
    margin: '2px 12px',
    fontSize: '0.9375rem',
    fontWeight: isActive ? 600 : 400,
    transition: 'all 0.2s',
  });

  const handleLinkClick = () => {
    if (window.innerWidth <= 768 && onClose) {
      onClose();
    }
  };

  return (
    <aside
      style={{
        position: 'fixed',
        top: 'var(--navbar-height)',
        left: 0,
        width: '260px',
        height: 'calc(100vh - var(--navbar-height))',
        background: 'var(--bg-sidebar)',
        borderRight: '1px solid var(--border-color)',
        padding: '16px 0',
        overflowY: 'auto',
        transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
        transition: 'transform 0.3s ease',
        zIndex: 99,
      }}
    >
      <NavLink to="/dashboard" style={linkStyle} onClick={handleLinkClick}>
        <FiHome /> Dashboard
      </NavLink>

      <NavLink to="/users" style={linkStyle} onClick={handleLinkClick}>
        <FiUsers /> User Management
      </NavLink>

      <NavLink to="/departments" style={linkStyle} onClick={handleLinkClick}>
        <FiBriefcase /> Departments
      </NavLink>

      <NavLink to="/upload" style={linkStyle} onClick={handleLinkClick}>
        <FiUpload /> Upload Content
      </NavLink>

      <NavLink to="/magazine" style={linkStyle} onClick={handleLinkClick}>
        <FiBookOpen /> Magazines
      </NavLink>

      <NavLink to="/gallery" style={linkStyle} onClick={handleLinkClick}>
        <FiImage /> Media Gallery
      </NavLink>

      <NavLink to="/activity-logs" style={linkStyle} onClick={handleLinkClick}>
        <FiActivity /> Activity Logs
      </NavLink>

      <NavLink to="/profile" style={linkStyle} onClick={handleLinkClick}>
        <FiUser /> Profile
      </NavLink>
    </aside>
  );
};

export default Sidebar;
