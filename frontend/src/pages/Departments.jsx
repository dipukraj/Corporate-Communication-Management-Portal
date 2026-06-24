import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { FiPlus, FiTrash2 } from 'react-icons/fi';
import { departmentAPI } from '../services/apiServices';
import { useAuth } from '../context/AuthContext';

const Departments = () => {
  const { user } = useAuth();
  const [departments, setDepartments] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', description: '' });

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const res = await departmentAPI.getAll();
      setDepartments(res.data.data);
    } catch (error) {
      toast.error('Failed to fetch departments');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (user?.email !== 'admin@cms.com') {
      toast.error('Admin user password required!');
      return;
    }
    try {
      await departmentAPI.create(form);
      toast.success('Department created');
      setForm({ name: '', description: '' });
      setShowForm(false);
      fetchDepartments();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create department');
    }
  };

  const handleDelete = async (id) => {
    if (user?.email !== 'admin@cms.com') {
      toast.error('Admin user password required!');
      return;
    }
    if (!window.confirm('Delete this department?')) return;
    try {
      await departmentAPI.delete(id);
      toast.success('Department deleted');
      fetchDepartments();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Delete failed');
    }
  };

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1>Department Management</h1>
          <p>Manage organizational departments</p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => {
            if (user?.email !== 'admin@cms.com') {
              toast.error('Admin user password required!');
              return;
            }
            setShowForm(!showForm);
          }}
        >
          <FiPlus /> Add Department
        </button>
      </div>

      {showForm && (
        <form className="form-card" onSubmit={handleSubmit} style={{ marginBottom: '24px' }}>
          <div className="form-group">
            <label>Department Name</label>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. PR Department"
              required
            />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Department description"
            />
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button type="submit" className="btn btn-primary">Create Department</button>
            <button type="button" className="btn btn-outline" onClick={() => setShowForm(false)}>Cancel</button>
          </div>
        </form>
      )}

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {departments.map((dept) => (
              <tr key={dept._id}>
                <td>{dept.name}</td>
                <td>{dept.description || '-'}</td>
                <td>{new Date(dept.createdAt).toLocaleDateString()}</td>
                <td>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete(dept._id)}>
                    <FiTrash2 />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Departments;
