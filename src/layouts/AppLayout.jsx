import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import Sidebar from '../Components/navigation/Sidebar';
import Navbar from '../Components/navigation/Navbar';
import ErrorBoundary from '../Components/ErrorBoundary';
import './AppLayout.css';

const AppLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className={`app-layout ${isCollapsed ? 'app-layout--collapsed' : ''}`}>
      {/* Persistent Sidebar */}
      <Sidebar 
        isCollapsed={isCollapsed} 
        setIsCollapsed={setIsCollapsed} 
        onLogout={logout} 
      />

      <div className="app-layout__wrapper">
        {/* Persistent Navbar */}
        <Navbar user={user} onLogout={logout} />

        {/* Content Area */}
        <main className="app-layout__content">
          <ErrorBoundary>
            {children}
          </ErrorBoundary>
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
