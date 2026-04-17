import { BrowserRouter, Link, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import './styles/auth.css';

import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';

function Home() {
  let user = null;
  try {
    const raw = localStorage.getItem('authUser');
    user = raw ? JSON.parse(raw) : null;
  } catch {
    user = null;
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="home-container">
      <div className="home-card">
        <h2>🎉 Welcome</h2>
        <p>Manage your profile and keep your information up to date.</p>
        <div className="home-link-section">
          <Link to="/login">🔐 Sign In</Link>
          <span> or </span>
          <Link to="/register">📝 Create Account</Link>
        </div>
      </div>
    </div>
  );
}

function Navigation() {
  const location = useLocation();
  let user = null;
  try {
    const raw = localStorage.getItem('authUser');
    user = raw ? JSON.parse(raw) : null;
  } catch {
    user = null;
  }

  // Hide navbar on dashboard if user is authenticated
  if (user && location.pathname === '/dashboard') {
    return null;
  }

  return (
    <nav className="nav-bar">
      <Link to="/">🏠 Home</Link>
      <Link to="/login">🔐 Login</Link>
      <Link to="/register">📝 Register</Link>
    </nav>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Navigation />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
