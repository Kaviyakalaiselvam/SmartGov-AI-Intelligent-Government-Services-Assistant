import React, { useState, useEffect } from 'react';
import { authAPI, aadharAPI, preferencesAPI } from '../services/api';
import '../styles/profile.css';

function UserProfile() {
  const [profileData, setProfileData] = useState(null);
  const [preferences, setPreferences] = useState(null);
  const [aadharStatus, setAadharStatus] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [showAadharModal, setShowAadharModal] = useState(false);
  const [aadharInput, setAadharInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const profileRes = await authAPI.getProfile();
      setProfileData(profileRes.data);
      setFormData(profileRes.data);

      const prefRes = await preferencesAPI.getPreferences();
      setPreferences(prefRes.data);

      const aadharRes = await aadharAPI.getVerificationStatus();
      setAadharStatus(aadharRes.data);
    } catch (err) {
      setError('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveProfile = async () => {
    try {
      setLoading(true);
      const response = await authAPI.updateProfile(formData);
      setProfileData(response.data);
      setSuccess('Profile updated successfully');
      setEditMode(false);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyAadhar = async () => {
    if (!aadharInput.match(/^\d{12}$/)) {
      setError('Please enter a valid 12-digit Aadhar number');
      return;
    }

    try {
      setLoading(true);
      const response = await aadharAPI.verify(aadharInput);
      setAadharStatus(response.data);
      setSuccess('Aadhar verified successfully');
      setShowAadharModal(false);
      setAadharInput('');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Aadhar verification failed');
    } finally {
      setLoading(false);
    }
  };

  const handlePreferencesChange = async (key, value) => {
    try {
      const updatedPrefs = { ...preferences, [key]: value };
      const response = await preferencesAPI.updatePreferences(updatedPrefs);
      setPreferences(response.data);
      setSuccess('Preferences updated');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to update preferences');
    }
  };

  if (loading) {
    return (
      <div className="profile-container">
        <div className="loading-state fade-in">
          <div className="spinner"></div>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="profile-container">
        <div className="empty-state fade-in">
          <span className="empty-icon">⚠️</span>
          <p>Failed to load profile data. Please try again.</p>
          <button onClick={loadProfile} className="btn btn-primary">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-header slide-in-left">
        <h1>👤 My Profile</h1>
        <p>Manage your account and preferences</p>
      </div>

      {error && (
        <div className="alert alert-error">
          {error}
          <button onClick={() => setError('')} className="alert-close">
            ✕
          </button>
        </div>
      )}

      {success && (
        <div className="alert alert-success">
          {success}
          <button onClick={() => setSuccess('')} className="alert-close">
            ✕
          </button>
        </div>
      )}

      <div className="profile-grid">
        {/* Personal Information */}
        <div className="profile-card card animated">
          <div className="card-header">
            <h2>Personal Information</h2>
            <button
              onClick={() => {
                setEditMode(!editMode);
                setFormData(profileData);
              }}
              className="btn btn-secondary btn-small"
            >
              {editMode ? '✓ Save' : '✏️ Edit'}
            </button>
          </div>

          {editMode ? (
            <div className="form-section">
              <div className="form-row">
                <div className="form-group">
                  <label>First Name</label>
                  <input
                    type="text"
                    name="first_name"
                    value={formData.first_name || ''}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label>Last Name</label>
                  <input
                    type="text"
                    name="last_name"
                    value={formData.last_name || ''}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Age</label>
                  <input
                    type="number"
                    name="age"
                    value={formData.age || ''}
                    onChange={handleChange}
                    min="18"
                  />
                </div>
                <div className="form-group">
                  <label>Occupation</label>
                  <select name="occupation" value={formData.occupation || ''} onChange={handleChange}>
                    <option value="">Select occupation</option>
                    <option value="Student">Student</option>
                    <option value="Employed">Employed</option>
                    <option value="Self-employed">Self-employed</option>
                    <option value="Unemployed">Unemployed</option>
                    <option value="Farmer">Farmer</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>State</label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state || ''}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label>Phone</label>
                  <input
                    type="tel"
                    name="phone_number"
                    value={formData.phone_number || ''}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="button-group">
                <button onClick={handleSaveProfile} className="btn btn-primary">
                  Save Changes
                </button>
                <button
                  onClick={() => {
                    setEditMode(false);
                    setFormData(profileData);
                  }}
                  className="btn btn-outline"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="profile-info">
              <div className="info-row">
                <span className="info-label">Name:</span>
                <span className="info-value">
                  {profileData.first_name} {profileData.last_name}
                </span>
              </div>
              <div className="info-row">
                <span className="info-label">Email:</span>
                <span className="info-value">{profileData.email}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Age:</span>
                <span className="info-value">{profileData.age || 'Not provided'}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Occupation:</span>
                <span className="info-value">{profileData.occupation || 'Not provided'}</span>
              </div>
              <div className="info-row">
                <span className="info-label">State:</span>
                <span className="info-value">{profileData.state || 'Not provided'}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Phone:</span>
                <span className="info-value">{profileData.phone_number || 'Not provided'}</span>
              </div>
            </div>
          )}
        </div>

        {/* Aadhar Verification */}
        <div className="profile-card card animated">
          <div className="card-header">
            <h2>🆔 Aadhar Verification</h2>
            {profileData.aadhar_verified && (
              <span className="badge badge-success">✓ Verified</span>
            )}
          </div>

          {profileData.aadhar_verified ? (
            <div className="verification-status">
              <div className="status-check">✓</div>
              <p className="status-text">Your Aadhar has been verified</p>
              {aadharStatus?.masked_aadhar && (
                <p className="masked-aadhar">{aadharStatus.masked_aadhar}</p>
              )}
            </div>
          ) : (
            <div className="verification-pending">
              <p className="status-text">Verify your Aadhar to unlock more benefits</p>
              <button
                onClick={() => setShowAadharModal(true)}
                className="btn btn-primary btn-full"
              >
                Start Verification
              </button>
            </div>
          )}
        </div>

        {/* Preferences */}
        {preferences && (
          <div className="profile-card card animated">
            <div className="card-header">
              <h2>⚙️ Preferences</h2>
            </div>

            <div className="preferences-section">
              <div className="preference-item">
                <label className="preference-label">
                  <span>Language</span>
                  <select
                    value={preferences.language}
                    onChange={(e) => handlePreferencesChange('language', e.target.value)}
                  >
                    <option value="en">English</option>
                    <option value="hi">हिंदी (Hindi)</option>
                  </select>
                </label>
              </div>

              <div className="preference-item">
                <label className="preference-toggle">
                  <input
                    type="checkbox"
                    checked={preferences.enable_notifications}
                    onChange={(e) =>
                      handlePreferencesChange('enable_notifications', e.target.checked)
                    }
                  />
                  <span>Enable Notifications</span>
                </label>
              </div>

              <div className="preference-item">
                <label className="preference-toggle">
                  <input
                    type="checkbox"
                    checked={preferences.enable_voice}
                    onChange={(e) => handlePreferencesChange('enable_voice', e.target.checked)}
                  />
                  <span>Enable Voice Interaction</span>
                </label>
              </div>

              <div className="preference-item">
                <label className="preference-toggle">
                  <input
                    type="checkbox"
                    checked={preferences.enable_email_reminders}
                    onChange={(e) =>
                      handlePreferencesChange('enable_email_reminders', e.target.checked)
                    }
                  />
                  <span>Enable Email Reminders</span>
                </label>
              </div>

              <div className="preference-item">
                <label className="preference-label">
                  <span>Preferred Communication</span>
                  <select
                    value={preferences.preferred_communication}
                    onChange={(e) =>
                      handlePreferencesChange('preferred_communication', e.target.value)
                    }
                  >
                    <option value="email">Email</option>
                    <option value="sms">SMS</option>
                    <option value="both">Both</option>
                  </select>
                </label>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Aadhar Verification Modal */}
      {showAadharModal && (
        <div
          className="modal show"
          onClick={(e) => e.target === e.currentTarget && setShowAadharModal(false)}
        >
          <div className="modal-content slide-in-up">
            <div className="modal-header">
              <h2>Verify Aadhar</h2>
              <button
                onClick={() => setShowAadharModal(false)}
                className="modal-close"
              >
                ✕
              </button>
            </div>

            <div className="modal-body">
              <p className="modal-info">
                Enter your 12-digit Aadhar number to verify your identity
              </p>

              <div className="form-group">
                <label>Aadhar Number</label>
                <input
                  type="text"
                  value={aadharInput}
                  onChange={(e) => setAadharInput(e.target.value.replace(/\D/g, '').slice(0, 12))}
                  placeholder="Enter 12-digit Aadhar number"
                  maxLength="12"
                />
              </div>

              <div className="modal-footer">
                <button
                  onClick={handleVerifyAadhar}
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? 'Verifying...' : 'Verify'}
                </button>
                <button
                  onClick={() => setShowAadharModal(false)}
                  className="btn btn-outline"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserProfile;
