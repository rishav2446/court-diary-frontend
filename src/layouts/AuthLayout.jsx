import React from 'react';
import './AuthLayout.css';

const AuthLayout = ({ children }) => {
  return (
    <div className="auth-layout gradient-bg">
      {/* Subtle Mesh Background Overlay */}
      <div className="auth-layout__mesh" aria-hidden="true" />
      
      {/* Brand Watermark / Ambient Lights */}
      <div className="auth-layout__glow auth-layout__glow--1" aria-hidden="true" />
      <div className="auth-layout__glow auth-layout__glow--2" aria-hidden="true" />

      {/* Main Container */}
      <div className="auth-layout__container">
        {/* Left Side: Law Branded Theme Panel */}
        <div className="auth-layout__brand-panel">
          <div className="auth-layout__brand-content animate-slide-left">
            <div className="auth-layout__icon">🏛️</div>
            <h1 className="auth-layout__title display-font">Court Diary</h1>
            <p className="auth-layout__subtitle">
              The premier practice management system for advocates and legal professionals. 
              Organize cases, automate hearing reminders, and manage client files seamlessly.
            </p>
          </div>
          <div className="auth-layout__brand-pattern" aria-hidden="true" />
        </div>

        {/* Right Side: Form Content Panel */}
        <div className="auth-layout__form-panel">
          <div className="auth-layout__form-wrapper">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
