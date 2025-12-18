import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAccounts } from '../api';
import Toast from '../components/Toast';

const Admin = () => {
  const navigate = useNavigate();
  const [accounts, setAccounts] = useState([]);
  const [filteredAccounts, setFilteredAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [toast, setToast] = useState(null);

  useEffect(() => {
    fetchAccounts();
  }, []);

  useEffect(() => {
    filterAccounts();
  }, [searchTerm, accounts]);

  const fetchAccounts = async () => {
    try {
      const data = await getAccounts();
      setAccounts(data);
    } catch (error) {
      setToast({ message: 'Failed to fetch accounts', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const filterAccounts = () => {
    if (!searchTerm) {
      setFilteredAccounts(accounts);
    } else {
      const filtered = accounts.filter(
        acc =>
          (acc.customer?.name || acc.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
          acc.accountNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (acc.customer?.email || '').toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredAccounts(filtered);
    }
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading">Loading accounts...</div>
      </div>
    );
  }

  return (
    <div className="container">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <button 
        onClick={() => navigate(-1)} 
        className="btn btn-secondary"
        style={{ marginBottom: '20px' }}
      >
        ← Back
      </button>

      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '15px' }}>
          <div>
            <h1>All Accounts</h1>
            <p style={{ color: '#666' }}>{filteredAccounts.length} accounts found</p>
          </div>
        </div>

        <div className="form-group" style={{ marginBottom: '20px' }}>
          <input
            type="text"
            placeholder="Search by name, account number, or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-control"
          />
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="table">
            <thead>
              <tr>
                <th>Account Number</th>
                <th>Customer Name</th>
                <th>Email</th>
                <th>Type</th>
                <th>Balance</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              {filteredAccounts.map((account) => (
                <tr key={account.accountNumber}>
                  <td style={{ fontWeight: '600' }}>{account.accountNumber}</td>
                  <td>{account.customer?.name || account.name || 'N/A'}</td>
                  <td>{account.customer?.email || 'N/A'}</td>
                  <td>
                    <span className={`badge ${account.type === 'SAVINGS' ? 'badge-success' : 'badge-info'}`}>
                      {account.type || 'SAVINGS'}
                    </span>
                  </td>
                  <td style={{ fontWeight: '600', color: '#667eea' }}>₹{parseFloat(account.balance).toFixed(2)}</td>
                  <td>{new Date(account.createdAt || Date.now()).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredAccounts.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
            <div style={{ fontSize: '48px', marginBottom: '10px' }}>🔍</div>
            <p>No accounts found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;