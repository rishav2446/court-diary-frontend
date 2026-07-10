import React, { useState } from 'react';
import { FiLock, FiInfo } from 'react-icons/fi';
import Card from '../Components/ui/Card';
import Button from '../Components/ui/Button';
import Input from '../Components/ui/Input';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import './Settings.css';

const Settings = () => {
  const { user } = useAuth();
  const toast = useToast();
  
  const [name, setName] = useState(user?.username || 'Advocate');
  const [email, setEmail] = useState('advocate@courtledgers.com');
  const [barNumber, setBarNumber] = useState('MAH/5042/2022');
  
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(false);

  const handleSaveProfile = (e) => {
    e.preventDefault();
    toast.success('Practice profile records updated successfully.');
  };

  return (
    <div className="page-container">
      {/* Header */}
      <div className="settings-header">
        <h1 className="display-font" style={{ fontSize: 'var(--text-4xl)', fontWeight: 800 }}>
          System Settings
        </h1>
        <p style={{ color: 'var(--color-text-secondary)', marginTop: 'var(--space-1)' }}>
          Configure user accounts, alerts, credentials, and practice settings.
        </p>
      </div>

      {/* Grid */}
      <div className="settings-grid">
        {/* Left Column: Form Settings Cards */}
        <div className="settings-column flex flex-col gap-6">
          <Card header="Advocate profile information">
            <form onSubmit={handleSaveProfile} className="settings-form flex flex-col gap-4">
              <Input label="Advocate Full Name" value={name} onChange={(e) => setName(e.target.value)} required />
              <Input label="Email Registration Address" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              <Input label="Bar Council ID / License #" value={barNumber} onChange={(e) => setBarNumber(e.target.value)} required />
              <Button type="submit" variant="primary" style={{ alignSelf: 'flex-start', marginTop: 'var(--space-2)' }}>
                Save Profile
              </Button>
            </form>
          </Card>

          <Card header="Hearing alert configurations">
            <div className="settings-alert-list flex flex-col gap-4">
              <div className="alert-setting-item flex justify-between items-center w-full">
                <div>
                  <h4>Email Notifications</h4>
                  <p>Send daily docket summaries and case calendars to my email.</p>
                </div>
                <input 
                  type="checkbox" 
                  checked={emailAlerts} 
                  onChange={(e) => { setEmailAlerts(e.target.checked); toast.success('Email alert options configured.'); }}
                  className="switch-input"
                />
              </div>
              
              <div className="alert-setting-item flex justify-between items-center w-full">
                <div>
                  <h4>SMS Alert Updates</h4>
                  <p>Send text message updates prior to hearing times.</p>
                </div>
                <input 
                  type="checkbox" 
                  checked={smsAlerts} 
                  onChange={(e) => { setSmsAlerts(e.target.checked); toast.success('SMS reminders configured.'); }}
                  className="switch-input"
                />
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column: Security info panels */}
        <div className="settings-column flex flex-col gap-6">
          <Card header="System credentials">
            <form className="settings-form flex flex-col gap-4" onSubmit={(e) => { e.preventDefault(); toast.success('Password update sequence processed.'); }}>
              <Input label="Existing Password" type="password" />
              <Input label="New System Password" type="password" />
              <Button type="submit" variant="secondary" style={{ alignSelf: 'flex-start' }}>Update Password</Button>
            </form>
          </Card>

          <Card header="Support and Legal information">
            <div className="support-info flex flex-col gap-2">
              <span className="info-row"><FiInfo /> Version: 2.1.0-gold</span>
              <span className="info-row"><FiLock /> Encryption: AES-256 Enabled</span>
              <p className="info-text">Court Diary Ledger is a fully compliant legal records database adhering to bar council guidelines.</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Settings;
