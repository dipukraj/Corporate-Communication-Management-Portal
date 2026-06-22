import { FiUsers, FiFolder, FiBookOpen, FiImage } from 'react-icons/fi';

const Card = ({ title, value, icon, color }) => {
  const icons = {
    users: <FiUsers />,
    folder: <FiFolder />,
    book: <FiBookOpen />,
    image: <FiImage />,
  };

  return (
    <div className="stat-card">
      <div className="stat-icon" style={{ background: `${color}20`, color }}>
        {icons[icon] || icon}
      </div>
      <div className="stat-info">
        <h3>{value}</h3>
        <p>{title}</p>
      </div>
    </div>
  );
};

export default Card;
