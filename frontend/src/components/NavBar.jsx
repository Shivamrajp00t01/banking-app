import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { removeAuthToken, getUserInfo } from '../utils/auth';

const NavBar = ({ setIsAuth }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const userInfo = getUserInfo();

  const handleLogout = () => {
    removeAuthToken();
    setIsAuth(false);
    navigate('/login');
  };

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/deposit', label: 'Deposit', icon: '💰' },
    { path: '/withdraw', label: 'Withdraw', icon: '💸' },
    { path: '/transfer', label: 'Transfer', icon: '🔄' },
    { path: '/transactions', label: 'Transactions', icon: '📝' },
    { path: '/admin', label: 'Admin', icon: '👤' },
  ];

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <Link to="/dashboard" className="navbar-brand">
          🏦 Apana Bank
        </Link>

        <ul className="navbar-menu">
          {navItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`navbar-link ${location.pathname === item.path ? 'active' : ''}`}
              >
                <span>{item.icon}</span> {item.label}
              </Link>
            </li>
          ))}
          
          <li>
            <button onClick={handleLogout} className="btn btn-danger" style={{marginLeft: '10px'}}>
              Logout
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default NavBar;