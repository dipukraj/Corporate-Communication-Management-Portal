import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { FiPlus, FiTrash2, FiDownload } from 'react-icons/fi';
import { magazineAPI, departmentAPI } from '../services/apiServices';
import { useAuth } from '../context/AuthContext';

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const Magazine = () => {
  const { user } = useAuth();
  const [magazines, setMagazines] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({ search: '', department: '', year: '' });
  const [form, setForm] = useState({
    title: '',
    month: 'January',
    year: new Date().getFullYear(),
    department: '',
    description: '',
    pdf: null,
  });

  useEffect(() => {
    fetchMagazines();
    fetchDepartments();
  }, [filters]);

  const fetchMagazines = async () => {
    try {
      const params = {};
      if (filters.search) params.search = filters.search;
      if (filters.department) params.department = filters.department;
      if (filters.year) params.year = filters.year;
      const res = await magazineAPI.getAll(params);
      setMagazines(res.data.data);
    } catch (error) {
      toast.error('Failed to fetch magazines');
    }
  };

  const fetchDepartments = async () => {
    try {
      const res = await departmentAPI.getAll();
      setDepartments(res.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (user?.email !== 'admin@cms.com') {
      toast.error('Admin user password required!');
      return;
    }
    if (!form.pdf) {
      toast.error('Please upload a PDF file');
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('title', form.title);
    formData.append('month', form.month);
    formData.append('year', form.year);
    formData.append('department', form.department);
    formData.append('description', form.description);
    formData.append('pdf', form.pdf);

    try {
      await magazineAPI.create(formData);
      toast.success('Magazine created successfully!');
      setShowForm(false);
      setForm({
        title: '',
        month: 'January',
        year: new Date().getFullYear(),
        department: '',
        description: '',
        pdf: null,
      });
      fetchMagazines();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create magazine');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (user?.email !== 'admin@cms.com') {
      toast.error('Admin user password required!');
      return;
    }
    if (!window.confirm('Delete this magazine?')) return;
    try {
      await magazineAPI.delete(id);
      toast.success('Magazine deleted');
      fetchMagazines();
    } catch (error) {
      toast.error('Delete failed');
    }
  };

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1>Magazine Management</h1>
          <p>Manage e-magazines and publications</p>
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
          <FiPlus /> Create Magazine
        </button>
      </div>

      <div className="gallery-filters">
        <input
          placeholder="Search magazines..."
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
        />
        <select
          value={filters.department}
          onChange={(e) => setFilters({ ...filters, department: e.target.value })}
        >
          <option value="">All Departments</option>
          {departments.map((d) => (
            <option key={d._id} value={d._id}>{d.name}</option>
          ))}
        </select>
        <input
          type="number"
          placeholder="Year"
          value={filters.year}
          onChange={(e) => setFilters({ ...filters, year: e.target.value })}
        />
      </div>

      {showForm && (
        <form className="form-card" onSubmit={handleSubmit} style={{ marginBottom: '24px' }}>
          <h3 style={{ marginBottom: '20px' }}>Create Magazine Entry</h3>
          <div className="form-group">
            <label>Magazine Name</label>
            <input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="e.g. NTPC Magazine"
              required
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Month</label>
              <select value={form.month} onChange={(e) => setForm({ ...form, month: e.target.value })}>
                {months.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Year</label>
              <input
                type="number"
                value={form.year}
                onChange={(e) => setForm({ ...form, year: e.target.value })}
                required
              />
            </div>
          </div>
          <div className="form-group">
            <label>Department</label>
            <select
              value={form.department}
              onChange={(e) => setForm({ ...form, department: e.target.value })}
              required
            >
              <option value="">Select Department</option>
              {departments.map((d) => (
                <option key={d._id} value={d._id}>{d.name}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>PDF Upload</label>
            <input
              type="file"
              accept=".pdf"
              onChange={(e) => setForm({ ...form, pdf: e.target.files[0] })}
              required
            />
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Creating...' : 'Create Magazine'}
            </button>
            <button type="button" className="btn btn-outline" onClick={() => setShowForm(false)}>Cancel</button>
          </div>
        </form>
      )}

      <div className="gallery-grid">
        {magazines.length === 0 ? (
          <div className="empty-state" style={{ gridColumn: '1 / -1' }}>No magazines found</div>
        ) : (
          magazines.map((mag) => (
            <div
              key={mag._id}
              style={{
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-color)',
                borderRadius: '12px',
                padding: '20px',
                boxShadow: 'var(--card-shadow)',
              }}
            >
              <div style={{ fontSize: '2rem', marginBottom: '12px' }}>📖</div>
              <h3 style={{ marginBottom: '8px' }}>{mag.title}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '4px' }}>
                {mag.month} {mag.year}
              </p>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '16px' }}>
                {mag.department?.name}
              </p>
              <div style={{ display: 'flex', gap: '8px' }}>
                <a href={mag.pdfUrl} target="_blank" rel="noreferrer" className="btn btn-primary btn-sm">
                  <FiDownload /> Download
                </a>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete(mag._id)}>
                    <FiTrash2 />
                  </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Magazine;
