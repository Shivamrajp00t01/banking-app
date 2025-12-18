import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { withdrawAmount, getAccount } from '../api';
import { getUserInfo } from '../utils/auth';
import Toast from '../components/Toast';

const Withdraw = () => {
  const navigate = useNavigate();
  const userInfo = getUserInfo();
  const [amount, setAmount] = useState('');
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    fetchBalance();
  }, []);

  const fetchBalance = async () => {
    try {
      const account = await getAccount(userInfo.accountNumber);
      setBalance(parseFloat(account.balance));
    } catch (error) {
      setToast({ message: 'Failed to fetch balance', type: 'error' });
    }
  };

  const handleWithdraw = async (e) => {
    e.preventDefault();
    
    const withdrawalAmount = parseFloat(amount);
    
    if (withdrawalAmount <= 0) {
      setToast({ message: 'Please enter a valid amount', type: 'error' });
      return;
    }

    if (withdrawalAmount > balance) {
      setToast({ message: 'Insufficient balance', type: 'error' });
      return;
    }

    setLoading(true);

    try {
      await withdrawAmount(userInfo.accountNumber, amount);
      const account = await getAccount(userInfo.accountNumber);
      setToast({ message: `Withdrawal successful! New balance: ₹${account.balance}`, type: 'success' });
      setAmount('');
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (error) {
      setToast({ message: error.message || 'Withdrawal failed', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const quickAmounts = [500, 1000, 5000, 10000].filter(amt => amt <= balance);

  return (
    <div className="container">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <button 
          onClick={() => navigate(-1)} 
          className="btn btn-secondary"
          style={{ marginBottom: '20px' }}
        >
          ← Back
        </button>

        <div className="card">
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <div style={{ fontSize: '48px', marginBottom: '10px' }}>💸</div>
            <h1>Withdraw Money</h1>
            <p style={{ color: '#666' }}>Available Balance: ₹{balance.toFixed(2)}</p>
          </div>

          <form onSubmit={handleWithdraw}>
            <div className="form-group">
              <label className="form-label">Withdrawal Amount (₹)</label>
              <input
                type="number"
                step="0.01"
                min="1"
                max={balance}
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="form-control"
                placeholder="Enter amount"
                style={{ fontSize: '18px', padding: '15px' }}
              />
            </div>

            {quickAmounts.length > 0 && (
              <div className="card" style={{ backgroundColor: '#f8f9fa', padding: '15px', marginBottom: '20px' }}>
                <label className="form-label">Quick Amounts</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
                  {quickAmounts.map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setAmount(amt.toString())}
                      className="btn btn-secondary"
                    >
                      ₹{amt}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {parseFloat(amount) > balance && (
              <div className="alert alert-danger">
                Insufficient balance! You can withdraw up to ₹{balance.toFixed(2)}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !amount || parseFloat(amount) <= 0 || parseFloat(amount) > balance}
              className="btn btn-danger"
              style={{ width: '100%', padding: '15px', fontSize: '16px' }}
            >
              {loading ? 'Processing...' : `Withdraw ₹${amount || '0.00'}`}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Withdraw;