import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/home.css';

function Home() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const features = [
    {
      icon: '🤖',
      title: 'AI Assistant',
      description: 'Get instant answers about government schemes powered by AI',
    },
    {
      icon: '💼',
      title: 'Personalized Schemes',
      description: 'Discover schemes matched to your age, occupation, and location',
    },
    {
      icon: '📋',
      title: 'Document Checklist',
      description: 'Generate smart checklists with required documents for each scheme',
    },
    {
      icon: '🆔',
      title: 'Aadhar Verification',
      description: 'Verify your identity securely for scheme applications',
    },
    {
      icon: '🎤',
      title: 'Voice Support',
      description: 'Interact with AI assistant using voice commands',
    },
    {
      icon: '🔔',
      title: 'Smart Reminders',
      description: 'Get deadline reminders for schemes you are interested in',
    },
  ];

  const benefits = [
    'Find schemes eligibility instantly',
    'Get applications approved faster',
    'Track multiple scheme applications',
    'Get personalized recommendations',
    'Support in English & Hindi',
    'No paperwork, everything digital',
  ];

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content fade-in">
          <h1>SmartGov AI</h1>
          <h2>Your Intelligent Government Services Assistant</h2>
          <p>
            Discover and apply for government schemes effortlessly using AI-powered assistance
          </p>

          <div className="hero-buttons">
            {token ? (
              <>
                <Link to="/schemes" className="btn btn-primary btn-large">
                  Explore Schemes
                </Link>
                <Link to="/chat" className="btn btn-secondary btn-large">
                  Ask AI Assistant
                </Link>
              </>
            ) : (
              <>
                <Link to="/register" className="btn btn-primary btn-large">
                  Get Started Free
                </Link>
                <Link to="/login" className="btn btn-secondary btn-large">
                  Login
                </Link>
              </>
            )}
          </div>
        </div>

        <div className="hero-image slide-in-right">
          <div className="hero-icon">🏛️</div>
        </div>
      </section>

      {/* Welcome Section for Logged In Users */}
      {token && (
        <section className="welcome-section">
          <div className="welcome-card card slide-in-left">
            <span className="welcome-icon">👋</span>
            <h2>Welcome back, {user.first_name || user.username}!</h2>
            <p>
              Your profile is {user.age && user.occupation && user.state ? '✓ Complete' : 'incomplete'}
            </p>
            {!(user.age && user.occupation && user.state) && (
              <Link to="/profile" className="btn btn-primary">
                Complete Profile
              </Link>
            )}
          </div>
        </section>
      )}

      {/* Features Section */}
      <section className="features-section">
        <div className="section-header">
          <h2>How SmartGov AI Helps You</h2>
          <p>Everything you need to discover and apply for government schemes</p>
        </div>

        <div className="features-grid">
          {features.map((feature, index) => (
            <div
              key={index}
              className="feature-card card"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <span className="feature-icon">{feature.icon}</span>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="benefits-section">
        <div className="benefits-container">
          <div className="benefits-content slide-in-left">
            <h2>Why Choose SmartGov AI?</h2>
            <ul className="benefits-list">
              {benefits.map((benefit, index) => (
                <li key={index} className="benefit-item">
                  <span className="benefit-icon">✓</span>
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="benefits-image slide-in-right">
            <div className="benefits-icon">📊</div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works-section">
        <div className="section-header">
          <h2>How It Works</h2>
          <p>Get started in 3 simple steps</p>
        </div>

        <div className="steps-grid">
          <div className="step-card slide-in-up">
            <div className="step-number">1</div>
            <h3>Sign Up</h3>
            <p>Create your account with basic information about yourself</p>
          </div>

          <div className="step-card slide-in-up" style={{ animationDelay: '0.1s' }}>
            <div className="step-number">2</div>
            <h3>Complete Profile</h3>
            <p>Add your details to get personalized scheme recommendations</p>
          </div>

          <div className="step-card slide-in-up" style={{ animationDelay: '0.2s' }}>
            <div className="step-number">3</div>
            <h3>Apply & Track</h3>
            <p>Find schemes, generate checklists, and apply with AI guidance</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content fade-in">
          <h2>Ready to Discover Government Schemes?</h2>
          <p>Join thousands of users finding perfect schemes effortlessly</p>

          {token ? (
            <Link to="/schemes" className="btn btn-primary btn-large">
              Explore Personalized Schemes
            </Link>
          ) : (
            <Link to="/register" className="btn btn-primary btn-large">
              Get Started for Free
            </Link>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <p>&copy; 2024 SmartGov AI. Helping you access government benefits.</p>
          <p>
            Questions?{' '}
            <a href="mailto:support@smartgov.ai" className="footer-link">
              Contact Support
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}

export default Home;
