import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Card from '../components/Card';
import { dashboardAPI, contentAPI } from '../services/apiServices';

const Dashboard = () => {
  const { user, isAdmin, isEditor } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentUploads, setRecentUploads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const statsRes = await dashboardAPI.getStats();
      setStats(statsRes.data.data);
      setRecentUploads(statsRes.data.data.recentUploads);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading dashboard...</div>;

  return (
    <div>
      <div className="page-header">
        <h1>Dashboard</h1>
        <p>Welcome back, {user?.name}!</p>
      </div>

      {stats && (
        <div className="stats-grid">
          <Card title="Total Users" value={stats.totalUsers} icon="users" color="#2563eb" />
          <Card title="Departments" value={stats.totalDepartments} icon="folder" color="#16a34a" />
          <Card title="Uploaded Files" value={stats.totalFiles} icon="image" color="#d97706" />
          <Card title="Magazines" value={stats.totalMagazines} icon="book" color="#9333ea" />
        </div>
      )}

      <div className="table-container">
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-color)' }}>
          <h2 style={{ fontSize: '1.125rem' }}>Recent Uploads</h2>
        </div>
        {recentUploads.length === 0 ? (
          <div className="empty-state">No uploads yet</div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Department</th>
                <th>Uploaded By</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {recentUploads.map((item) => (
                <tr key={item._id}>
                  <td>{item.title}</td>
                  <td>{item.category}</td>
                  <td>{item.department?.name || '-'}</td>
                  <td>{item.uploadedBy?.name || '-'}</td>
                  <td>{new Date(item.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
