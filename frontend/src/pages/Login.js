import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../api/auth';
import '../styles/auth.css';

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function onSubmit(e) {
    e.preventDefault();
    setError('');

    setLoading(true);
    try {
      const { token, user } = await loginUser({ email, password });
      localStorage.setItem('authToken', token);
      localStorage.setItem('authUser', JSON.stringify(user));
      setTimeout(() => navigate('/', { replace: true }), 500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-container">
      <div className="floating-1"></div>
      <div className="floating-2"></div>
      
      <div className="auth-card">
        <h2>🔐 Welcome Back</h2>
        <p className="subtitle">Sign in to your account</p>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label htmlFor="email">📧 Email Address</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">🔑 Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>

          <button 
            type="submit" 
            className={`submit-btn ${loading ? 'loading' : ''}`}
            disabled={loading}
          >
            {loading ? 'Signing in...' : '🚀 Sign In'}
          </button>
        </form>

        <p>
          Don't have an account? <Link to="/register">📝 Create one here</Link>
        </p>
      </div>
    </div>
  );
}
