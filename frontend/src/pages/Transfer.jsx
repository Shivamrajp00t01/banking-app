import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { transferAmount, getAccount } from '../api';
import { getUserInfo } from '../utils/auth';
import Toast from '../components/Toast';
import Modal from '../components/Modal';

const Transfer = () => {
  const navigate = useNavigate();
  const userInfo = getUserInfo();
  const [amount, setAmount] = useState('');
  const [toAccount, setToAccount] = useState('');
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

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

  const handleTransfer = async (e) => {
    e.preventDefault();
    
    const transferAmount = parseFloat(amount);
    
    if (transferAmount <= 0) {
      setToast({ message: 'Please enter a valid amount', type: 'error' });
      return;
    }

    if (transferAmount > balance) {
      setToast({ message: 'Insufficient balance', type: 'error' });
      return;
    }

    if (toAccount === userInfo.accountNumber) {
      setToast({ message: 'Cannot transfer to the same account', type: 'error' });
      return;
    }

    setShowConfirmModal(true);
  };

  const confirmTransfer = async () => {
    setLoading(true);
    setShowConfirmModal(false);

    try {
      await transferAmount(userInfo.accountNumber, toAccount, amount);
      setToast({ message: 'Transfer successful!', type: 'success' });
      setAmount('');
      setToAccount('');
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (error) {
      setToast({ message: error.message || 'Transfer failed', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

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
            <div style={{ fontSize: '48px', marginBottom: '10px' }}>🔄</div>
            <h1>Transfer Money</h1>
            <p style={{ color: '#666' }}>Available Balance: ₹{balance.toFixed(2)}</p>
          </div>

          <form onSubmit={handleTransfer}>
            <div className="form-group">
              <label className="form-label">To Account Number</label>
              <input
                type="text"
                required
                value={toAccount}
                onChange={(e) => setToAccount(e.target.value)}
                className="form-control"
                placeholder="Enter recipient account number"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Transfer Amount (₹)</label>
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

            {parseFloat(amount) > balance && (
              <div className="alert alert-danger">
                Insufficient balance! You can transfer up to ₹{balance.toFixed(2)}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !amount || !toAccount || parseFloat(amount) <= 0 || parseFloat(amount) > balance}
              className="btn btn-primary"
              style={{ width: '100%', padding: '15px', fontSize: '16px' }}
            >
              {loading ? 'Processing...' : `Transfer ₹${amount || '0.00'}`}
            </button>
          </form>
        </div>
      </div>

      <Modal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        title="Confirm Transfer"
      >
        <div>
          <p style={{ marginBottom: '15px' }}>Are you sure you want to transfer?</p>
          <div style={{ backgroundColor: '#f8f9fa', padding: '15px', borderRadius: '4px', marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <strong>To Account:</strong>
              <span>{toAccount}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <strong>Amount:</strong>
              <span>₹{amount}</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={() => setShowConfirmModal(false)}
              className="btn btn-secondary"
              style={{ flex: 1 }}
            >
              Cancel
            </button>
            <button
              onClick={confirmTransfer}
              className="btn btn-primary"
              style={{ flex: 1 }}
              disabled={loading}
            >
              {loading ? 'Processing...' : 'Confirm Transfer'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Transfer;