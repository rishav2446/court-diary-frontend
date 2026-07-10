import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "../Components/ui/Button";
import "./Landing.css";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-hero">
      <div className="landing-hero__container">
        <div className="landing-hero__content">
          <div className="landing-badge">🏛️ Court Diary</div>
          <h1 className="landing-title">Organize your practice. Never miss a hearing.</h1>
          <p className="landing-subtitle">
            Court Diary helps advocates and legal teams manage cases, clients, and hearing schedules in one
            secure and elegant workspace. Automate reminders, centralize documents, and save time for
            what matters — preparing your case.
          </p>

          <div className="landing-cta">
            <Button variant="primary" onClick={() => navigate('/login')} style={{ minWidth: 160 }}>
              Sign in
            </Button>

            <Button variant="ghost" onClick={() => navigate('/register')} style={{ minWidth: 160 }}>
              Create account
            </Button>
          </div>

          <ul className="landing-features">
            <li>Calendar-driven diary & hearing reminders</li>
            <li>Intuitive case cards and client management</li>
            <li>Secure document management and sharing</li>
          </ul>
        </div>

        <div className="landing-hero__visual" aria-hidden="true">
          <div className="mock-device">
            <div className="mock-device__screen">Your cases at a glance</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
