import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/home.css';

function Home() {
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem('token');

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero-section">
        <h1 className="hero-title">Welcome to SmartGov AI</h1>
        <p className="hero-subtitle">
          Your intelligent assistant for navigating government schemes and services.
          Get personalized recommendations, instant answers, and simplified access to benefits.
        </p>
        <div className="hero-buttons">
          {isLoggedIn ? (
            <>
              <Link to="/chat" className="hero-button hero-button-primary">
                🤖 Chat with AI Assistant
              </Link>
              <Link to="/schemes" className="hero-button hero-button-secondary">
                📋 Browse Schemes
              </Link>
            </>
          ) : (
            <>
              <Link to="/register" className="hero-button hero-button-primary">
                Get Started Free
              </Link>
              <Link to="/login" className="hero-button hero-button-secondary">
                Login
              </Link>
            </>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="features-header">
          <h2>Powerful Features at Your Fingertips</h2>
          <p>Everything you need to discover and apply for government benefits</p>
        </div>
        <div className="features-grid">
          <Link to={isLoggedIn ? "/chat" : "/login"} className="feature-card">
            <span className="feature-icon">🤖</span>
            <h3 className="feature-title">AI Assistant</h3>
            <p className="feature-description">
              Get instant answers about schemes, eligibility, and application processes in English or Hindi
            </p>
          </Link>

          <Link to={isLoggedIn ? "/schemes" : "/login"} className="feature-card">
            <span className="feature-icon">📋</span>
            <h3 className="feature-title">Personalized Schemes</h3>
            <p className="feature-description">
              Discover government schemes tailored to your profile, occupation, and state
            </p>
          </Link>

          <Link to={isLoggedIn ? "/documents" : "/login"} className="feature-card">
            <span className="feature-icon">📄</span>
            <h3 className="feature-title">Document Manager</h3>
            <p className="feature-description">
              Track required documents for your applications with organized checklists
            </p>
          </Link>

          <Link to={isLoggedIn ? "/profile" : "/login"} className="feature-card">
            <span className="feature-icon">👤</span>
            <h3 className="feature-title">Profile & Tracking</h3>
            <p className="feature-description">
              Manage your information and track your scheme applications in one place
            </p>
          </Link>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works-section">
        <div className="how-it-works-header">
          <h2>How It Works</h2>
          <p>Get started in three simple steps</p>
        </div>
        <div className="steps-container">
          <div className="step">
            <div className="step-number">1</div>
            <h3 className="step-title">Create Your Profile</h3>
            <p className="step-description">
              Sign up and add your details to get personalized scheme recommendations
            </p>
          </div>
          <div className="step">
            <div className="step-number">2</div>
            <h3 className="step-title">Discover Schemes</h3>
            <p className="step-description">
              Browse schemes or ask our AI assistant about eligibility and benefits
            </p>
          </div>
          <div className="step">
            <div className="step-number">3</div>
            <h3 className="step-title">Apply & Track</h3>
            <p className="step-description">
              Get document checklists and track your applications effortlessly
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="stats-grid">
          <div className="stat-item">
            <span className="stat-number">1000+</span>
            <span className="stat-label">Government Schemes</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">AI-Powered</span>
            <span className="stat-label">Smart Recommendations</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">Multi-Language</span>
            <span className="stat-label">English & Hindi Support</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">24/7</span>
            <span className="stat-label">Instant Assistance</span>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
