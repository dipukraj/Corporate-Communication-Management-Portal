import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { FiEye, FiDownload, FiTrash2 } from 'react-icons/fi';
import { contentAPI, departmentAPI } from '../services/apiServices';
import { useAuth } from '../context/AuthContext';

const Gallery = () => {
  const { isAdmin, isEditor } = useAuth();
  const [content, setContent] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [preview, setPreview] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    department: '',
    category: '',
    year: '',
  });

  const categories = ['Magazine', 'Poster', 'Banner', 'Certificate', 'Invitation', 'Notice'];

  useEffect(() => {
    fetchContent();
    fetchDepartments();
  }, [filters]);

  const fetchContent = async () => {
    try {
      const params = {};
      if (filters.search) params.search = filters.search;
      if (filters.department) params.department = filters.department;
      if (filters.category) params.category = filters.category;
      if (filters.year) params.year = filters.year;
      const res = await contentAPI.getAll(params);
      setContent(res.data.data);
    } catch (error) {
      toast.error('Failed to fetch gallery');
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

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this content?')) return;
    try {
      await contentAPI.delete(id);
      toast.success('Content deleted');
      fetchContent();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Delete failed');
    }
  };

  const isImage = (url) => {
    if (!url) return false;
    return /\.(jpg|jpeg|png|gif|webp)/i.test(url) || url.includes('image');
  };

  return (
    <div>
      <div className="page-header">
        <h1>Media Gallery</h1>
        <p>Browse and manage all uploaded communication materials</p>
      </div>

      <div className="gallery-filters">
        <input
          placeholder="Search: NTPC Magazine..."
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
        <select
          value={filters.category}
          onChange={(e) => setFilters({ ...filters, category: e.target.value })}
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        <input
          type="number"
          placeholder="Year e.g. 2026"
          value={filters.year}
          onChange={(e) => setFilters({ ...filters, year: e.target.value })}
        />
      </div>

      <div className="gallery-grid">
        {content.length === 0 ? (
          <div className="empty-state" style={{ gridColumn: '1 / -1' }}>No content found</div>
        ) : (
          content.map((item) => (
            <div
              key={item._id}
              style={{
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-color)',
                borderRadius: '12px',
                overflow: 'hidden',
                boxShadow: 'var(--card-shadow)',
              }}
            >
              <div
                style={{
                  height: '180px',
                  background: 'var(--bg-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                }}
              >
                {isImage(item.fileUrl) ? (
                  <img
                    src={item.fileUrl}
                    alt={item.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <span style={{ fontSize: '3rem' }}>📄</span>
                )}
              </div>
              <div style={{ padding: '16px' }}>
                <h3 style={{ fontSize: '1rem', marginBottom: '4px' }}>{item.title}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.8125rem', marginBottom: '8px' }}>
                  {item.category} • {item.department?.name}
                </p>
                <span className={`badge badge-${item.status}`}>{item.status}</span>
                <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                  <button className="btn btn-outline btn-sm" onClick={() => setPreview(item)}>
                    <FiEye /> Preview
                  </button>
                  <a href={item.fileUrl} target="_blank" rel="noreferrer" className="btn btn-primary btn-sm">
                    <FiDownload />
                  </a>
                  {(isAdmin || isEditor) && (
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(item._id)}>
                      <FiTrash2 />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {preview && (
        <div className="modal-overlay" onClick={() => setPreview(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2 style={{ marginBottom: '16px' }}>{preview.title}</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '16px' }}>{preview.description}</p>
            {isImage(preview.fileUrl) ? (
              <img src={preview.fileUrl} alt={preview.title} />
            ) : (
              <iframe src={preview.fileUrl} title={preview.title} style={{ width: '100%', height: '400px', border: 'none' }} />
            )}
            <div style={{ marginTop: '16px', display: 'flex', gap: '12px' }}>
              <a href={preview.fileUrl} target="_blank" rel="noreferrer" className="btn btn-primary">
                <FiDownload /> Download
              </a>
              <button className="btn btn-outline" onClick={() => setPreview(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;
