import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTransactions } from '../api';
import { getUserInfo } from '../utils/auth';
import Toast from '../components/Toast';

const Transactions = () => {
  const navigate = useNavigate();
  const userInfo = getUserInfo();
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const [toast, setToast] = useState(null);

  useEffect(() => {
    fetchTransactions();
  }, []);

  useEffect(() => {
    filterTransactions();
  }, [filter, transactions]);

  const fetchTransactions = async () => {
    try {
      const data = await getTransactions(userInfo.accountNumber);
      setTransactions(data);
    } catch (error) {
      setToast({ message: 'Failed to fetch transactions', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const filterTransactions = () => {
    if (filter === 'ALL') {
      setFilteredTransactions(transactions);
    } else {
      setFilteredTransactions(transactions.filter(tx => tx.type === filter));
    }
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading">Loading transactions...</div>
      </div>
    );
  }

  const filters = ['ALL', 'DEPOSIT', 'WITHDRAW', 'TRANSFER_IN', 'TRANSFER_OUT'];

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
            <h1>Transaction History</h1>
            <p style={{ color: '#666' }}>{filteredTransactions.length} transactions found</p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
          {filters.map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`btn ${filter === type ? 'btn-primary' : 'btn-secondary'}`}
            >
              {type.replace('_', ' ')}
            </button>
          ))}
          </div>

    {filteredTransactions.length === 0 ? (
      <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
        <div style={{ fontSize: '48px', marginBottom: '10px' }}>📝</div>
        <p>No transactions found</p>
      </div>
    ) : (
      <div>
        {filteredTransactions.map((tx) => (
          <div key={tx.id} className="transaction-item">
            <div className="transaction-type">
              <div className={`transaction-icon ${tx.type.includes('DEPOSIT') || tx.type.includes('TRANSFER_IN') ? 'deposit' : 'withdraw'}`}>
                {tx.type.includes('DEPOSIT') || tx.type.includes('TRANSFER_IN') ? '↓' : '↑'}
              </div>
              <div className="transaction-details">
                <h4>{tx.description || tx.type.replace('_', ' ')}</h4>
                <p>{new Date(tx.transactionTime).toLocaleString()}</p>
                {tx.relatedAccount && (
                  <p style={{ fontSize: '11px', color: '#999' }}>Account: {tx.relatedAccount}</p>
                )}
              </div>
            </div>
            <div className={`transaction-amount ${tx.type.includes('DEPOSIT') || tx.type.includes('TRANSFER_IN') ? 'positive' : 'negative'}`}>
              <div className="amount">
                {tx.type.includes('DEPOSIT') || tx.type.includes('TRANSFER_IN') ? '+' : '-'}₹{parseFloat(tx.amount).toFixed(2)}
              </div>
              <div className="balance">Balance: ₹{parseFloat(tx.balanceAfter).toFixed(2)}</div>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
</div>
);
};
export default Transactions;