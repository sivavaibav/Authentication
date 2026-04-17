import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserProfile, updateUserProfile } from '../api/auth';
import '../styles/auth.css';

export default function Dashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    bio: '',
    address: '',
    city: '',
    country: '',
    profession: '',
    dateOfBirth: '',
    gender: '',
    website: '',
  });

  useEffect(() => {
    async function loadProfile() {
      try {
        const profile = await getUserProfile();
        setUser(profile);
        setFormData({
          name: profile.name || '',
          phone: profile.phone || '',
          email: profile.email || '',
          bio: profile.bio || '',
          address: profile.address || '',
          city: profile.city || '',
          country: profile.country || '',
          profession: profile.profession || '',
          dateOfBirth: profile.dateOfBirth || '',
          gender: profile.gender || '',
          website: profile.website || '',
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load profile.');
        setTimeout(() => navigate('/login'), 2000);
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, [navigate]);

  async function handleSave(e) {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.name.trim()) {
      setError('Name is required.');
      return;
    }

    const token = localStorage.getItem('authToken');
    if (!token) {
      setError('Authentication token is missing. Please log in again.');
      setTimeout(() => navigate('/login'), 2000);
      return;
    }

    setSaving(true);
    try {
      console.log('Attempting to update profile with token:', token.substring(0, 20) + '...');
      const updated = await updateUserProfile({
        name: formData.name,
        phone: formData.phone,
        bio: formData.bio,
        address: formData.address,
        city: formData.city,
        country: formData.country,
        profession: formData.profession,
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender,
        website: formData.website,
      });
      
      console.log('Profile update successful:', updated);
      setUser(updated);
      setFormData({
        name: updated.name || '',
        phone: updated.phone || '',
        email: updated.email || '',
        bio: updated.bio || '',
        address: updated.address || '',
        city: updated.city || '',
        country: updated.country || '',
        profession: updated.profession || '',
        dateOfBirth: updated.dateOfBirth || '',
        gender: updated.gender || '',
        website: updated.website || '',
      });
      setEditMode(false);
      setSuccess('✅ Profile updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Profile update error:', err);
      setError(err instanceof Error ? err.message : 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  }

  function handleCancel() {
    setEditMode(false);
    setFormData({
      name: user.name || '',
      phone: user.phone || '',
      email: user.email || '',
      bio: user.bio || '',
      address: user.address || '',
      city: user.city || '',
      country: user.country || '',
      profession: user.profession || '',
      dateOfBirth: user.dateOfBirth || '',
      gender: user.gender || '',
      website: user.website || '',
    });
  }

  function handleLogout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
    navigate('/login', { replace: true });
  }

  if (loading) {
    return (
      <div className="home-container">
        <div className="home-card">
          <h2>⏳ Loading...</h2>
          <p>Please wait while we load your profile.</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="home-container">
        <div className="home-card">
          <h2>❌ Error</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="dashboard-top-bar">
        <h1>📊 My Dashboard</h1>
        <button onClick={handleLogout} className="logout-btn-top">
          🚪 Logout
        </button>
      </div>
      <div className="home-container">
        <div className="dashboard-card">
        <div className="dashboard-header">
          <div className="avatar-section">
            <img src={user.avatar} alt={user.name} className="avatar" />
          </div>
          <div className="header-info">
            <h2>{user.name}</h2>
            <p className="email-badge">📧 {user.email}</p>
            {user.profession && <p className="profession-badge">{user.profession}</p>}
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        {editMode ? (
          <form onSubmit={handleSave} className="edit-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name">👤 Full Name *</label>
                <input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Your full name"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="profession">💼 Profession</label>
                <input
                  id="profession"
                  type="text"
                  value={formData.profession}
                  onChange={(e) => setFormData({ ...formData, profession: e.target.value })}
                  placeholder="e.g., Software Engineer"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="phone">📱 Phone Number</label>
                <input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="Your phone number"
                />
              </div>
              <div className="form-group">
                <label htmlFor="gender">⚧ Gender</label>
                <select
                  id="gender"
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                >
                  <option value="">Select an option</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="dateOfBirth">🎂 Date of Birth</label>
                <input
                  id="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label htmlFor="website">🌐 Website</label>
                <input
                  id="website"
                  type="url"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  placeholder="https://example.com"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="address">📍 Address</label>
                <input
                  id="address"
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Street address"
                />
              </div>
              <div className="form-group">
                <label htmlFor="city">🏙️ City</label>
                <input
                  id="city"
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  placeholder="City"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group full-width">
                <label htmlFor="country">🌍 Country</label>
                <input
                  id="country"
                  type="text"
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  placeholder="Country"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="bio">✍️ Bio</label>
              <textarea
                id="bio"
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                placeholder="Tell us about yourself"
                rows={4}
                className="textarea"
              />
            </div>

            <div className="button-group">
              <button type="submit" className="submit-btn save-btn" disabled={saving}>
                {saving ? '💾 Saving...' : '💾 Save Changes'}
              </button>
              <button type="button" className="cancel-btn" onClick={handleCancel}>
                ✕ Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="profile-view">
            <div className="info-section">
              <h3>📋 Profile Information</h3>
              <div className="info-row">
                <div className="info-item">
                  <label>📧 Email</label>
                  <p>{user.email}</p>
                </div>
                <div className="info-item">
                  <label>📱 Phone</label>
                  <p>{user.phone || '—'}</p>
                </div>
              </div>
              <div className="info-row">
                <div className="info-item">
                  <label>💼 Profession</label>
                  <p>{user.profession || '—'}</p>
                </div>
                <div className="info-item">
                  <label>⚧ Gender</label>
                  <p>{user.gender || '—'}</p>
                </div>
              </div>
              <div className="info-row">
                <div className="info-item">
                  <label>🎂 Date of Birth</label>
                  <p>{user.dateOfBirth || '—'}</p>
                </div>
                <div className="info-item">
                  <label>🌐 Website</label>
                  <p>
                    {user.website ? (
                      <a href={user.website} target="_blank" rel="noopener noreferrer">
                        {user.website}
                      </a>
                    ) : (
                      '—'
                    )}
                  </p>
                </div>
              </div>
              <div className="info-row">
                <div className="info-item">
                  <label>📍 Address</label>
                  <p>{user.address || '—'}</p>
                </div>
                <div className="info-item">
                  <label>🏙️ City</label>
                  <p>{user.city || '—'}</p>
                </div>
              </div>
              <div className="info-row">
                <div className="info-item">
                  <label>🌍 Country</label>
                  <p>{user.country || '—'}</p>
                </div>
                <div className="info-item small">
                  <label>📅 Member Since</label>
                  <p>{new Date(user.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
              {user.bio && (
                <div className="info-item full-width">
                  <label>✍️ Bio</label>
                  <p>{user.bio}</p>
                </div>
              )}
            </div>

            <div className="button-group">
              <button onClick={() => setEditMode(true)} className="submit-btn edit-btn">
                ✏️ Edit Profile
              </button>
              <button onClick={handleLogout} className="logout-btn">
                🚪 Logout
              </button>
            </div>
          </div>
        )}
      </div>
      </div>
    </>
  );
}
