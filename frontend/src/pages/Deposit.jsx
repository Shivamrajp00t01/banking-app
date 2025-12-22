import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { depositAmount, getAccount } from '../api';
import { getUserInfo } from '../utils/auth';
import Toast from '../components/Toast';

const Deposit = () => {
  const navigate = useNavigate();
  const userInfo = getUserInfo();
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const handleDeposit = async (e) => {
    e.preventDefault();
    
    if (parseFloat(amount) <= 0) {
      setToast({ message: 'Please enter a valid amount', type: 'error' });
      return;
    }

    setLoading(true);

    try {
      // Debug logs
      console.log('=== DEPOSIT DEBUG ===');
      console.log('Account Number:', userInfo.accountNumber);
      console.log('Amount:', amount);
      console.log('Calling depositAmount...');
      
      await depositAmount(userInfo.accountNumber, amount);
      
      console.log('Deposit successful! Fetching updated account...');
      const account = await getAccount(userInfo.accountNumber);
      console.log('Updated balance:', account.balance);
      
      setToast({ message: `Deposit successful! New balance: ₹${account.balance}`, type: 'success' });
      setAmount('');
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (error) {
      console.error('=== DEPOSIT ERROR ===');
      console.error('Error message:', error.message);
      console.error('Full error:', error);
      setToast({ message: error.message || 'Deposit failed', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const quickAmounts = [500, 1000, 5000, 10000];

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
            <div style={{ fontSize: '48px', marginBottom: '10px' }}>💰</div>
            <h1>Deposit Money</h1>
            <p style={{ color: '#666' }}>Add funds to your account</p>
          </div>

          <form onSubmit={handleDeposit}>
            <div className="form-group">
              <label className="form-label">Deposit Amount (₹)</label>
              <input
                type="number"
                step="0.01"
                min="1"
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="form-control"
                placeholder="Enter amount"
                style={{ fontSize: '18px', padding: '15px' }}
              />
            </div>

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

            <button
              type="submit"
              disabled={loading || !amount || parseFloat(amount) <= 0}
              className="btn btn-success"
              style={{ width: '100%', padding: '15px', fontSize: '16px' }}
            >
              {loading ? 'Processing...' : `Deposit ₹${amount || '0.00'}`}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Deposit;