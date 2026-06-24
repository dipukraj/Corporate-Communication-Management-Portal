import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { FiPlus, FiTrash2, FiEdit2 } from 'react-icons/fi';
import { userAPI, departmentAPI, authAPI } from '../services/apiServices';
import { useAuth } from '../context/AuthContext';

const Users = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'department_user',
    department: '',
  });

  useEffect(() => {
    fetchUsers();
    fetchDepartments();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await userAPI.getAll();
      setUsers(res.data.data);
    } catch (error) {
      toast.error('Failed to fetch users');
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
    if (user?.email !== 'dipuraj@ccms.com') {
      toast.error('Admin user password required!');
      return;
    }
    try {
      if (editUser) {
        await userAPI.update(editUser._id, {
          name: form.name,
          email: form.email,
          role: form.role,
          department: form.department || null,
        });
        toast.success('User updated successfully');
      } else {
        await authAPI.register(form);
        toast.success('User created successfully');
      }
      resetForm();
      fetchUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (user?.email !== 'dipuraj@ccms.com') {
      toast.error('Admin user password required!');
      return;
    }
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await userAPI.delete(id);
      toast.success('User deleted');
      fetchUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Delete failed');
    }
  };

  const handleEdit = (u) => {
    if (user?.email !== 'dipuraj@ccms.com') {
      toast.error('Admin user password required!');
      return;
    }
    setEditUser(u);
    setForm({
      name: u.name,
      email: u.email,
      password: '',
      role: u.role,
      department: u.department?._id || '',
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setForm({ name: '', email: '', password: '', role: 'department_user', department: '' });
    setEditUser(null);
    setShowForm(false);
  };

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1>User Management</h1>
          <p>Manage users and their roles</p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => {
            if (user?.email !== 'dipuraj@ccms.com') {
              toast.error('Admin user password required!');
              return;
            }
            setShowForm(!showForm);
          }}
        >
          <FiPlus /> Add User
        </button>
      </div>

      {showForm && (
        <form className="form-card" onSubmit={handleSubmit} style={{ marginBottom: '24px' }}>
          <h3 style={{ marginBottom: '20px' }}>{editUser ? 'Edit User' : 'Add New User'}</h3>
          <div className="form-row">
            <div className="form-group">
              <label>Name</label>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
            </div>
          </div>
          {!editUser && (
            <div className="form-group">
              <label>Password</label>
              <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required minLength={6} />
            </div>
          )}
          <div className="form-row">
            <div className="form-group">
              <label>Role</label>
              <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
                <option value="admin">Admin</option>
                <option value="editor">Editor</option>
                <option value="department_user">Department User</option>
              </select>
            </div>
            <div className="form-group">
              <label>Department</label>
              <select value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })}>
                <option value="">Select Department</option>
                {departments.map((d) => (
                  <option key={d._id} value={d._id}>{d.name}</option>
                ))}
              </select>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button type="submit" className="btn btn-primary">{editUser ? 'Update' : 'Create'} User</button>
            <button type="button" className="btn btn-outline" onClick={resetForm}>Cancel</button>
          </div>
        </form>
      )}

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Department</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td><span className={`badge badge-${user.role}`}>{user.role.replace('_', ' ')}</span></td>
                <td>{user.department?.name || '-'}</td>
                <td>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button className="btn btn-outline btn-sm" onClick={() => handleEdit(user)}>
                        <FiEdit2 />
                      </button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(user._id)}>
                        <FiTrash2 />
                      </button>
                    </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Users;
