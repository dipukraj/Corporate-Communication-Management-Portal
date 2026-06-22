import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { dashboardAPI } from '../services/apiServices';

const ActivityLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const res = await dashboardAPI.getActivityLogs();
      setLogs(res.data.data);
    } catch (error) {
      toast.error('Failed to fetch activity logs');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading activity logs...</div>;

  return (
    <div>
      <div className="page-header">
        <h1>Activity Logs</h1>
        <p>Track all system activities and user actions</p>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Action</th>
              <th>Details</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {logs.length === 0 ? (
              <tr>
                <td colSpan="4" style={{ textAlign: 'center', padding: '40px' }}>
                  No activity logs yet
                </td>
              </tr>
            ) : (
              logs.map((log) => (
                <tr key={log._id}>
                  <td>
                    {log.user?.name}
                    <br />
                    <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                      {log.user?.email}
                    </span>
                  </td>
                  <td>
                    <span className="badge badge-editor">{log.action.replace(/_/g, ' ')}</span>
                  </td>
                  <td>{log.details || '-'}</td>
                  <td>{new Date(log.createdAt).toLocaleString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ActivityLogs;
