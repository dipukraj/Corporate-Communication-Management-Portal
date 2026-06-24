import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { FiUpload } from 'react-icons/fi';
import { contentAPI, departmentAPI } from '../services/apiServices';
import { useAuth } from '../context/AuthContext';

const categories = ['Magazine', 'Poster', 'Banner', 'Certificate', 'Invitation', 'Notice'];

const UploadContent = () => {
  const { user, isDepartmentUser } = useAuth();
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: 'Poster',
    department: '',
    date: new Date().toISOString().split('T')[0],
    status: 'published',
    file: null,
  });

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const res = await departmentAPI.getAll();
      setDepartments(res.data.data);
      if (isDepartmentUser && user?.department) {
        setForm((prev) => ({
          ...prev,
          department: user.department._id || user.department,
        }));
      }
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
    if (!form.file) {
      toast.error('Please select a file');
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('title', form.title);
    formData.append('description', form.description);
    formData.append('category', form.category);
    formData.append('department', form.department);
    formData.append('date', form.date);
    formData.append('status', form.status);
    formData.append('file', form.file);

    try {
      await contentAPI.upload(formData);
      toast.success('Content uploaded successfully!');
      setForm({
        title: '',
        description: '',
        category: 'Poster',
        department: isDepartmentUser ? (user.department._id || user.department) : '',
        date: new Date().toISOString().split('T')[0],
        status: 'published',
        file: null,
      });
      e.target.reset();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1>Upload Content</h1>
        <p>Upload communication materials to the portal</p>
      </div>

      <form className="form-card" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Title</label>
          <input
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="e.g. HR Annual Event Poster"
            required
          />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Brief description of the content"
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Category</label>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Department</label>
            <select
              value={form.department}
              onChange={(e) => setForm({ ...form, department: e.target.value })}
              required
              disabled={isDepartmentUser}
            >
              <option value="">Select Department</option>
              {departments.map((d) => (
                <option key={d._id} value={d._id}>{d.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Date</label>
            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label>Status</label>
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
            >
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label>Upload File</label>
          <input
            type="file"
            accept="image/*,.pdf"
            onChange={(e) => setForm({ ...form, file: e.target.files[0] })}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary" disabled={loading}>
          <FiUpload /> {loading ? 'Uploading...' : 'Upload Content'}
        </button>
      </form>
    </div>
  );
};

export default UploadContent;
