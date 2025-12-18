import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../api/auth';
import { createAccount } from '../api';
import Toast from '../components/Toast';

const Login = ({ setIsAuth }) => {
  const navigate = useNavigate();
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const [loginData, setLoginData] = useState({
    accountNumber: '',
    password: ''
  });

  const [signupData, setSignupData] = useState({
    customerName: '',
    balance: '1000',
    type: 'SAVINGS',
    password: ''
  });

  const showToast = (message, type) => {
    setToast({ message, type });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(loginData.accountNumber, loginData.password);
      showToast('Login successful!', 'success');
      setIsAuth(true);
      setTimeout(() => navigate('/dashboard'), 1000);
    } catch (error) {
      showToast(error.message || 'Login failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const account = await createAccount(
        signupData.customerName,
        signupData.balance,
        signupData.type,
        signupData.password
      );
      showToast(`Account created! Account Number: ${account.accountNumber}`, 'success');
      setIsLoginMode(true);
      setSignupData({
        customerName: '',
        balance: '1000',
        type: 'SAVINGS',
        password: ''
      });
    } catch (error) {
      showToast(error.message || 'Account creation failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className="login-card">
        <div className="login-header">
          <h1>🏦 Apana Bank</h1>
          <p>Your trusted banking partner</p>
        </div>

        <div className="login-tabs">
          <button
            onClick={() => setIsLoginMode(true)}
            className={`tab-button ${isLoginMode ? 'active' : ''}`}
          >
            Login
          </button>
          <button
            onClick={() => setIsLoginMode(false)}
            className={`tab-button ${!isLoginMode ? 'active' : ''}`}
          >
            Sign Up
          </button>
        </div>

        {isLoginMode ? (
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label className="form-label">Account Number</label>
              <input
                type="text"
                required
                value={loginData.accountNumber}
                onChange={(e) => setLoginData({ ...loginData, accountNumber: e.target.value })}
                className="form-control"
                placeholder="Enter your account number"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                required
                value={loginData.password}
                onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                className="form-control"
                placeholder="Enter your password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{ width: '100%' }}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleSignup}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                required
                value={signupData.customerName}
                onChange={(e) => setSignupData({ ...signupData, customerName: e.target.value })}
                className="form-control"
                placeholder="Enter your full name"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Initial Balance</label>
              <input
                type="number"
                required
                min="100"
                value={signupData.balance}
                onChange={(e) => setSignupData({ ...signupData, balance: e.target.value })}
                className="form-control"
                placeholder="Minimum ₹100"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Account Type</label>
              <select
                value={signupData.type}
                onChange={(e) => setSignupData({ ...signupData, type: e.target.value })}
                className="form-control"
              >
                <option value="SAVINGS">Savings Account</option>
                <option value="CURRENT">Current Account</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                required
                minLength="4"
                value={signupData.password}
                onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                className="form-control"
                placeholder="Create a password (min 4 characters)"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{ width: '100%' }}
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Login;