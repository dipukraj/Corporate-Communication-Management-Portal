import { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Departments from './pages/Departments';
import UploadContent from './pages/UploadContent';
import Magazine from './pages/Magazine';
import Gallery from './pages/Gallery';
import Profile from './pages/Profile';
import ActivityLogs from './pages/ActivityLogs';

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 768);

  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="app-layout">
      <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={closeSidebar} />
      )}
      <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />
      <main className={`main-content ${sidebarOpen ? 'sidebar-open' : ''}`}>{children}</main>
    </div>
  );
};

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="loading">Loading CMS Portal...</div>;
  }

  return (
    <Routes>
      <Route
        path="/"
        element={<Navigate to={user ? '/dashboard' : '/login'} replace />}
      />

      <Route
        path="/login"
        element={user ? <Navigate to="/dashboard" replace /> : <Login />}
      />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Layout>
              <Dashboard />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/users"
        element={
          <ProtectedRoute>
            <Layout>
              <Users />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/departments"
        element={
          <ProtectedRoute>
            <Layout>
              <Departments />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/upload"
        element={
          <ProtectedRoute>
            <Layout>
              <UploadContent />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/magazine"
        element={
          <ProtectedRoute>
            <Layout>
              <Magazine />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/gallery"
        element={
          <ProtectedRoute>
            <Layout>
              <Gallery />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Layout>
              <Profile />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/activity-logs"
        element={
          <ProtectedRoute>
            <Layout>
              <ActivityLogs />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to={user ? '/dashboard' : '/login'} replace />} />
    </Routes>
  );
}

export default App;
