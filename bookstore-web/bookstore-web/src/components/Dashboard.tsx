import React from "react";
import "./Dashboard.css";

interface DashboardProps {
  user: {
    email: string;
    firstName?: string;
    lastName?: string;
  } | null;
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, onLogout }) => {
  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="header-content">
          <h1>Dashboard</h1>
          <div className="user-info">
            <span className="user-icon">👤</span>
            <span className="user-email">{user?.email || "User"}</span>
            <button className="logout-button" onClick={onLogout} title="Logout">
              🚪
            </button>
          </div>
        </div>
      </header>

      <main className="dashboard-main">
        <div className="welcome-section">
          <h2>Welcome to your Dashboard!</h2>
        </div>

        <div className="info-card">
          <h3>Authentication Successful</h3>
          <p>
            You have successfully logged into the application. All product
            functionality has been removed as requested.
          </p>
        </div>

        <div className="features-section">
          <h3>Available Features:</h3>
          <div className="features-list">
            <div className="feature-item">
              <span className="feature-icon">🔐</span>
              <div className="feature-content">
                <h4>JWT Authentication</h4>
                <p>Secure token-based authentication</p>
              </div>
            </div>
            <div className="feature-item">
              <span className="feature-icon">👤</span>
              <div className="feature-content">
                <h4>User Management</h4>
                <p>User registration and login</p>
              </div>
            </div>
            <div className="feature-item">
              <span className="feature-icon">🔒</span>
              <div className="feature-content">
                <h4>Secure Storage</h4>
                <p>Encrypted token storage</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
