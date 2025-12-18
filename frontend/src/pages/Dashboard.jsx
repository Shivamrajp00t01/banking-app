import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAccount, getTransactions } from '../api';
import { getUserInfo } from '../utils/auth';
import Toast from '../components/Toast';

const Dashboard = () => {
  const [account, setAccount] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const userInfo = getUserInfo();

  useEffect(() => {
    fetchAccountData();
  }, []);

  const fetchAccountData = async () => {
    try {
      const [accountRes, transactionsRes] = await Promise.all([
        getAccount(userInfo.accountNumber),
        getTransactions(userInfo.accountNumber)
      ]);

      setAccount(accountRes);
      setTransactions(transactionsRes.slice(0, 5)); // Last 5 transactions
    } catch (error) {
      setToast({ message: 'Failed to fetch account data', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading">Loading your account...</div>
      </div>
    );
  }

  const quickActions = [
    { name: 'Deposit', icon: '💰', path: '/deposit', color: '#28a745' },
    { name: 'Withdraw', icon: '💸', path: '/withdraw', color: '#dc3545' },
    { name: 'Transfer', icon: '🔄', path: '/transfer', color: '#007bff' },
    { name: 'Transactions', icon: '📝', path: '/transactions', color: '#6f42c1' },
  ];

  return (
    <div className="container">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className="page-header">
        <h1>Welcome back, {userInfo.customerName}! 👋</h1>
        <p>Here's your account overview</p>
      </div>

      <div className="dashboard-grid">
        <div className="stats-card">
          <h3>Current Balance</h3>
          <div className="amount">₹{account?.balance?.toFixed(2)}</div>
          <div className="account-info">
            <div>Account: {account?.accountNumber}</div>
            <div>Type: {account?.type || 'SAVINGS'}</div>
          </div>
        </div>

        <div className="card">
          <h3 style={{ marginBottom: '15px' }}>Account Information</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div>
              <small style={{ color: '#666' }}>Customer Name</small>
              <div style={{ fontWeight: '500' }}>
                {account?.customer?.name || userInfo.customerName}
              </div>
            </div>
            <div>
              <small style={{ color: '#666' }}>Account Number</small>
              <div style={{ fontWeight: '500' }}>{account?.accountNumber}</div>
            </div>
            <div>
              <small style={{ color: '#666' }}>Account Type</small>
              <div style={{ fontWeight: '500' }}>{account?.type || 'SAVINGS'}</div>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 style={{ marginBottom: '15px' }}>Quick Stats</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#666' }}>Total Transactions</span>
              <span style={{ fontWeight: '600' }}>{transactions.length}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#666' }}>Account Status</span>
              <span className="badge badge-success">Active</span>
            </div>
            <Link to="/transactions" className="btn btn-primary" style={{ marginTop: '10px', textAlign: 'center' }}>
              View All Transactions
            </Link>
          </div>
        </div>
      </div>

      <div className="quick-actions">
        {quickActions.map((action) => (
          <Link
            key={action.name}
            to={action.path}
            className="action-card"
          >
            <div className="icon">{action.icon}</div>
            <h3>{action.name}</h3>
          </Link>
        ))}
      </div>

      <div className="card" style={{ marginTop: '30px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2>Recent Transactions</h2>
          <Link to="/transactions" style={{ color: '#667eea', textDecoration: 'none' }}>
            View All →
          </Link>
        </div>

        {transactions.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#666', padding: '20px' }}>No transactions yet</p>
        ) : (
          <div>
            {transactions.map((tx) => (
              <div key={tx.id} className="transaction-item">
                <div className="transaction-type">
                  <div className={`transaction-icon ${tx.type.toLowerCase().includes('deposit') || tx.type.toLowerCase().includes('transfer_in') ? 'deposit' : 'withdraw'}`}>
                    {tx.type.toLowerCase().includes('deposit') || tx.type.toLowerCase().includes('transfer_in') ? '↓' : '↑'}
                  </div>
                  <div className="transaction-details">
                    <h4>{tx.description || tx.type}</h4>
                    <p>{new Date(tx.transactionTime).toLocaleString()}</p>
                  </div>
                </div>
                <div className={`transaction-amount ${tx.type.toLowerCase().includes('deposit') || tx.type.toLowerCase().includes('transfer_in') ? 'positive' : 'negative'}`}>
                  <div className="amount">
                    {tx.type.toLowerCase().includes('deposit') || tx.type.toLowerCase().includes('transfer_in') ? '+' : '-'}₹{tx.amount}
                  </div>
                  <div className="balance">Balance: ₹{tx.balanceAfter}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;