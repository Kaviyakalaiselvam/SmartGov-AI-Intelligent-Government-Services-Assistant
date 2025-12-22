import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import '../styles/auth.css';

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    password_confirm: '',
    first_name: '',
    last_name: '',
    age: '',
    occupation: '',
    state: '',
    phone_number: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await authAPI.register(formData);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      navigate('/home');
    } catch (err) {
      setError(err.response?.data?.username?.[0] || err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => setStep(2);
  const prevStep = () => setStep(1);

  return (
    <div className="auth-container">
      <div className="auth-box fade-in">
        <h1 className="auth-title">SmartGov AI</h1>
        <p className="auth-subtitle">Create Your Account</p>

        <form onSubmit={handleSubmit} className="auth-form">
          {error && <div className="alert alert-error">{error}</div>}

          {step === 1 ? (
            <>
              <div className="form-group">
                <label htmlFor="first_name">First Name</label>
                <input
                  type="text"
                  id="first_name"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  placeholder="First name"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="last_name">Last Name</label>
                <input
                  type="text"
                  id="last_name"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  placeholder="Last name"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="username">Username</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Choose a username"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your.email@example.com"
                  required
                />
              </div>

              <button
                type="button"
                onClick={nextStep}
                className="btn btn-primary btn-full"
              >
                Next →
              </button>
            </>
          ) : (
            <>
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="At least 8 characters"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="password_confirm">Confirm Password</label>
                <input
                  type="password"
                  id="password_confirm"
                  name="password_confirm"
                  value={formData.password_confirm}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="age">Age</label>
                <input
                  type="number"
                  id="age"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  placeholder="Your age"
                  min="18"
                />
              </div>

              <div className="form-group">
                <label htmlFor="occupation">Occupation</label>
                <select
                  id="occupation"
                  name="occupation"
                  value={formData.occupation}
                  onChange={handleChange}
                >
                  <option value="">Select occupation</option>
                  <option value="Student">Student</option>
                  <option value="Employed">Employed</option>
                  <option value="Self-employed">Self-employed</option>
                  <option value="Unemployed">Unemployed</option>
                  <option value="Farmer">Farmer</option>
                  <option value="Retired">Retired</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="state">State</label>
                <input
                  type="text"
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  placeholder="Your state"
                />
              </div>

              <div className="form-group">
                <label htmlFor="phone_number">Phone Number</label>
                <input
                  type="tel"
                  id="phone_number"
                  name="phone_number"
                  value={formData.phone_number}
                  onChange={handleChange}
                  placeholder="10-digit phone number"
                />
              </div>

              <div className="button-group">
                <button
                  type="button"
                  onClick={prevStep}
                  className="btn btn-outline"
                >
                  ← Back
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner small"></span>
                      Registering...
                    </>
                  ) : (
                    'Register'
                  )}
                </button>
              </div>
            </>
          )}
        </form>

        <p className="auth-footer">
          Already have an account?{' '}
          <a href="/login" className="auth-link">
            Login here
          </a>
        </p>
      </div>
    </div>
  );
}

export default Register;
