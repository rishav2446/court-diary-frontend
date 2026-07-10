import React, { useState } from 'react';
import { FiSearch, FiBell, FiUser, FiLogOut } from 'react-icons/fi';
import './Navbar.css';

const Navbar = ({ user, onLogout }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, text: 'Case #231/2026 hearing in 1 hour', type: 'warning', unread: true },
    { id: 2, text: 'New judgment uploaded for Case #102/2025', type: 'info', unread: true },
  ]);
  const [showNotifications, setShowNotifications] = useState(false);

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <header className="navbar glass">
      {/* Search Bar */}
      <div className="navbar__search">
        <FiSearch className="navbar__search-icon" />
        <input 
          type="text" 
          placeholder="Search cases, hearings, or clients..." 
          className="navbar__search-input"
        />
      </div>

      {/* Actions */}
      <div className="navbar__actions">
        {/* Notification Bell */}
        <div className="navbar__action-item">
          <button 
            className="navbar__icon-btn" 
            onClick={() => setShowNotifications(!showNotifications)}
            aria-label="Toggle notifications"
          >
            <FiBell size={20} />
            {unreadCount > 0 && <span className="navbar__badge">{unreadCount}</span>}
          </button>

          {showNotifications && (
            <div className="navbar__notif-dropdown glass-card animate-fade-in-up">
              <div className="navbar__dropdown-header">
                <h4>Notifications</h4>
                {unreadCount > 0 && (
                  <button 
                    onClick={() => setNotifications(notifications.map(n => ({...n, unread: false})))}
                    className="navbar__mark-read"
                  >
                    Mark all read
                  </button>
                )}
              </div>
              <ul className="navbar__notif-list">
                {notifications.length > 0 ? (
                  notifications.map(n => (
                    <li key={n.id} className={`navbar__notif-item ${n.unread ? 'navbar__notif-item--unread' : ''}`}>
                      <span className={`navbar__notif-dot navbar__notif-dot--${n.type}`} />
                      <p className="navbar__notif-text">{n.text}</p>
                    </li>
                  ))
                ) : (
                  <li className="navbar__notif-empty">No notifications</li>
                )}
              </ul>
            </div>
          )}
        </div>

        {/* User Profile */}
        <div className="navbar__action-item">
          <button 
            className="navbar__profile-btn" 
            onClick={() => setShowDropdown(!showDropdown)}
            aria-label="User menu"
          >
            <div className="navbar__avatar">
              {user?.username ? user.username.slice(0, 2).toUpperCase() : <FiUser />}
            </div>
            <span className="navbar__username">{user?.username || 'Advocate'}</span>
          </button>

          {showDropdown && (
            <div className="navbar__dropdown glass-card animate-fade-in-up">
              <div className="navbar__dropdown-user-info">
                <span className="navbar__dropdown-name">{user?.username || 'Advocate'}</span>
                <span className="navbar__dropdown-role">Legal Counsel</span>
              </div>
              <hr className="navbar__dropdown-divider" />
              <button className="navbar__dropdown-link" onClick={() => { setShowDropdown(false); }}>
                <FiUser className="navbar__dropdown-icon" /> Profile
              </button>
              <button className="navbar__dropdown-link navbar__dropdown-link--danger" onClick={onLogout}>
                <FiLogOut className="navbar__dropdown-icon" /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
