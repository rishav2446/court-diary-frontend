import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  FiGrid, 
  FiBriefcase, 
  FiCalendar, 
  FiUsers, 
  FiFolder, 
  FiSettings, 
  FiLogOut,
  FiChevronLeft,
  FiChevronRight
} from 'react-icons/fi';
import './Sidebar.css';

const Sidebar = ({ isCollapsed, setIsCollapsed, onLogout }) => {
  const menuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: FiGrid },
    { path: '/cases', label: 'Cases', icon: FiBriefcase },
    { path: '/diary', label: 'Hearing Diary', icon: FiCalendar },
    { path: '/clients', label: 'Clients', icon: FiUsers },
    { path: '/documents', label: 'Documents', icon: FiFolder },
    { path: '/settings', label: 'Settings', icon: FiSettings },
  ];

  return (
    <aside className={`sidebar ${isCollapsed ? 'sidebar--collapsed' : ''}`}>
      {/* Sidebar Header */}
      <div className="sidebar__header">
        <div className="sidebar__logo-container">
          <div className="sidebar__logo-mark">🏛️</div>
          {!isCollapsed && <span className="sidebar__logo-text display-font">Court Diary</span>}
        </div>
        <button 
          className="sidebar__toggle" 
          onClick={() => setIsCollapsed(!isCollapsed)}
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? <FiChevronRight size={18} /> : <FiChevronLeft size={18} />}
        </button>
      </div>

      {/* Sidebar Menu */}
      <nav className="sidebar__nav">
        <ul className="sidebar__menu">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.path} className="sidebar__menu-item">
                <NavLink 
                  to={item.path} 
                  className={({ isActive }) => `sidebar__link ${isActive ? 'sidebar__link--active' : ''}`}
                  title={isCollapsed ? item.label : undefined}
                >
                  <span className="sidebar__link-icon"><Icon size={20} /></span>
                  {!isCollapsed && <span className="sidebar__link-label">{item.label}</span>}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Sidebar Footer */}
      <div className="sidebar__footer">
        <button 
          className="sidebar__logout-btn" 
          onClick={onLogout}
          title={isCollapsed ? "Logout" : undefined}
        >
          <span className="sidebar__logout-icon"><FiLogOut size={20} /></span>
          {!isCollapsed && <span className="sidebar__logout-label">Sign Out</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
