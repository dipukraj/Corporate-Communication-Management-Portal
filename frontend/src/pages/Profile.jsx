import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { FiUser, FiMail, FiBriefcase, FiShield, FiSun, FiMoon } from 'react-icons/fi';

const Profile = () => {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const infoItems = [
    { icon: <FiUser />, label: 'Name', value: user?.name },
    { icon: <FiMail />, label: 'Email', value: user?.email },
    { icon: <FiShield />, label: 'Role', value: user?.role?.replace('_', ' ') },
    { icon: <FiBriefcase />, label: 'Department', value: user?.department?.name || 'Not assigned' },
  ];

  return (
    <div>
      <div className="page-header">
        <h1>Profile</h1>
        <p>Your account information</p>
      </div>

      <div className="form-card" style={{ maxWidth: '500px' }}>
        <div
          style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: 'var(--accent)',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '2rem',
            fontWeight: 700,
            marginBottom: '24px',
          }}
        >
          {user?.name?.charAt(0)?.toUpperCase()}
        </div>

        {infoItems.map((item) => (
          <div
            key={item.label}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '14px 0',
              borderBottom: '1px solid var(--border-color)',
            }}
          >
            <span style={{ color: 'var(--text-secondary)', fontSize: '1.25rem' }}>{item.icon}</span>
            <div>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>{item.label}</p>
              <p style={{ fontWeight: 500, textTransform: item.label === 'Role' ? 'capitalize' : 'none' }}>
                {item.value}
              </p>
            </div>
          </div>
        ))}

        <div style={{ marginTop: '24px' }}>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>
            Theme Preference
          </p>
          <button className="btn btn-outline" onClick={toggleTheme}>
            {theme === 'light' ? <FiMoon /> : <FiSun />}
            Switch to {theme === 'light' ? 'Dark' : 'Light'} Mode
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
