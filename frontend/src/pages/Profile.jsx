import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAccount } from '../api';
import { getUserInfo } from '../utils/auth';
import Toast from '../components/Toast';

const Profile = () => {
  const navigate = useNavigate();
  const userInfo = getUserInfo();
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    fetchAccount();
  }, []);

  const fetchAccount = async () => {
    try {
      const data = await getAccount(userInfo.accountNumber);
      setAccount(data);
    } catch (error) {
      setToast({ message: 'Failed to fetch profile', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading">Loading profile...</div>
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

      <div className="card" style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', height: '120px', borderRadius: '8px 8px 0 0', marginBottom: '60px' }}></div>
        
        <div style={{ display: 'flex', alignItems: 'flex-end', marginTop: '-80px', paddingLeft: '30px', marginBottom: '30px' }}>
          <div style={{
            width: '100px',
            height: '100px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '48px',
            fontWeight: 'bold',
            border: '4px solid white'
          }}>
            {(account?.customer?.name || userInfo.customerName)?.charAt(0).toUpperCase()}
          </div>
          <div style={{ marginLeft: '20px', marginBottom: '10px' }}>
            <h1 style={{ margin: 0, fontSize: '28px' }}>
              {account?.customer?.name || userInfo.customerName}
            </h1>
            <p style={{ margin: '5px 0 0 0', color: '#666' }}>
              {account?.customer?.email || 'customer@apanabank.com'}
            </p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', padding: '0 30px 30px 30px' }}>
          <div style={{ backgroundColor: '#f8f9fa', borderRadius: '8px', padding: '20px' }}>
            <h3 style={{ marginBottom: '15px', color: '#333' }}>Account Information</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <small style={{ color: '#666', display: 'block', marginBottom: '5px' }}>Account Number</small>
                <div style={{ fontWeight: '600', fontSize: '16px' }}>{account?.accountNumber}</div>
              </div>
              <div>
                <small style={{ color: '#666', display: 'block', marginBottom: '5px' }}>Account Type</small>
                <div style={{ fontWeight: '600', fontSize: '16px' }}>{account?.type || 'SAVINGS'}</div>
              </div>
              <div>
                <small style={{ color: '#666', display: 'block', marginBottom: '5px' }}>Current Balance</small>
                <div style={{ fontWeight: '600', fontSize: '24px', color: '#667eea' }}>₹{account?.balance?.toFixed(2)}</div>
              </div>
            </div>
          </div>

          <div style={{ backgroundColor: '#f8f9fa', borderRadius: '8px', padding: '20px' }}>
            <h3 style={{ marginBottom: '15px', color: '#333' }}>Personal Information</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <small style={{ color: '#666', display: 'block', marginBottom: '5px' }}>Full Name</small>
                <div style={{ fontWeight: '600', fontSize: '16px' }}>
                  {account?.customer?.name || userInfo.customerName}
                </div>
              </div>
              <div>
                <small style={{ color: '#666', display: 'block', marginBottom: '5px' }}>Email Address</small>
                <div style={{ fontWeight: '600', fontSize: '16px' }}>
                  {account?.customer?.email || 'customer@apanabank.com'}
                </div>
              </div>
              <div>
                <small style={{ color: '#666', display: 'block', marginBottom: '5px' }}>Member Since</small>
                <div style={{ fontWeight: '600', fontSize: '16px' }}>
                  {new Date(account?.createdAt || Date.now()).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '15px', padding: '0 30px 30px 30px' }}>
          <button 
            className="btn btn-primary"
            style={{ flex: 1 }}
            onClick={() => setToast({ message: 'Feature coming soon!', type: 'warning' })}
          >
            Update Profile
          </button>
          <button 
            className="btn btn-secondary"
            style={{ flex: 1 }}
            onClick={() => setToast({ message: 'Feature coming soon!', type: 'warning' })}
          >
            Change Password
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;