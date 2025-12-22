// import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import { getAccount, getTransactions } from '../api';
// import { getUserInfo } from '../utils/auth';
// import Toast from '../components/Toast';

// const Dashboard = () => {
//   const [account, setAccount] = useState(null);
//   const [transactions, setTransactions] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [toast, setToast] = useState(null);
//   const userInfo = getUserInfo();

//   useEffect(() => {
//     fetchAccountData();
//   }, []);

//   const fetchAccountData = async () => {
//     try {
//       const [accountRes, transactionsRes] = await Promise.all([
//         getAccount(userInfo.accountNumber),
//         getTransactions(userInfo.accountNumber)
//       ]);

//       setAccount(accountRes);
//       setTransactions(transactionsRes.slice(0, 5)); // Last 5 transactions
//     } catch (error) {
//       setToast({ message: 'Failed to fetch account data', type: 'error' });
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="container">
//         <div className="loading">Loading your account...</div>
//       </div>
//     );
//   }

//   const quickActions = [
//     { name: 'Deposit', icon: '💰', path: '/deposit', color: '#28a745' },
//     { name: 'Withdraw', icon: '💸', path: '/withdraw', color: '#dc3545' },
//     { name: 'Transfer', icon: '🔄', path: '/transfer', color: '#007bff' },
//     { name: 'Transactions', icon: '📝', path: '/transactions', color: '#6f42c1' },
//   ];

//   return (
//     <div className="container">
//       {toast && (
//         <Toast
//           message={toast.message}
//           type={toast.type}
//           onClose={() => setToast(null)}
//         />
//       )}

//       <div className="page-header">
//         <h1>Welcome back, {userInfo.customerName}! 👋</h1>
//         <p>Here's your account overview</p>
//       </div>

//       <div className="dashboard-grid">
//         <div className="stats-card">
//           <h3>Current Balance</h3>
//           <div className="amount">₹{account?.balance?.toFixed(2)}</div>
//           <div className="account-info">
//             <div>Account: {account?.accountNumber}</div>
//             <div>Type: {account?.type || 'SAVINGS'}</div>
//           </div>
//         </div>

//         <div className="card">
//           <h3 style={{ marginBottom: '15px' }}>Account Information</h3>
//           <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
//             <div>
//               <small style={{ color: '#666' }}>Customer Name</small>
//               <div style={{ fontWeight: '500' }}>
//                 {account?.customer?.name || userInfo.customerName}
//               </div>
//             </div>
//             <div>
//               <small style={{ color: '#666' }}>Account Number</small>
//               <div style={{ fontWeight: '500' }}>{account?.accountNumber}</div>
//             </div>
//             <div>
//               <small style={{ color: '#666' }}>Account Type</small>
//               <div style={{ fontWeight: '500' }}>{account?.type || 'SAVINGS'}</div>
//             </div>
//           </div>
//         </div>

//         <div className="card">
//           <h3 style={{ marginBottom: '15px' }}>Quick Stats</h3>
//           <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
//             <div style={{ display: 'flex', justifyContent: 'space-between' }}>
//               <span style={{ color: '#666' }}>Total Transactions</span>
//               <span style={{ fontWeight: '600' }}>{transactions.length}</span>
//             </div>
//             <div style={{ display: 'flex', justifyContent: 'space-between' }}>
//               <span style={{ color: '#666' }}>Account Status</span>
//               <span className="badge badge-success">Active</span>
//             </div>
//             <Link to="/transactions" className="btn btn-primary" style={{ marginTop: '10px', textAlign: 'center' }}>
//               View All Transactions
//             </Link>
//           </div>
//         </div>
//       </div>

//       <div className="quick-actions">
//         {quickActions.map((action) => (
//           <Link
//             key={action.name}
//             to={action.path}
//             className="action-card"
//           >
//             <div className="icon">{action.icon}</div>
//             <h3>{action.name}</h3>
//           </Link>
//         ))}
//       </div>

//       <div className="card" style={{ marginTop: '30px' }}>
//         <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
//           <h2>Recent Transactions</h2>
//           <Link to="/transactions" style={{ color: '#667eea', textDecoration: 'none' }}>
//             View All →
//           </Link>
//         </div>

//         {transactions.length === 0 ? (
//           <p style={{ textAlign: 'center', color: '#666', padding: '20px' }}>No transactions yet</p>
//         ) : (
//           <div>
//             {transactions.map((tx) => (
//               <div key={tx.id} className="transaction-item">
//                 <div className="transaction-type">
//                   <div className={`transaction-icon ${tx.type.toLowerCase().includes('deposit') || tx.type.toLowerCase().includes('transfer_in') ? 'deposit' : 'withdraw'}`}>
//                     {tx.type.toLowerCase().includes('deposit') || tx.type.toLowerCase().includes('transfer_in') ? '↓' : '↑'}
//                   </div>
//                   <div className="transaction-details">
//                     <h4>{tx.description || tx.type}</h4>
//                     <p>{new Date(tx.transactionTime).toLocaleString()}</p>
//                   </div>
//                 </div>
//                 <div className={`transaction-amount ${tx.type.toLowerCase().includes('deposit') || tx.type.toLowerCase().includes('transfer_in') ? 'positive' : 'negative'}`}>
//                   <div className="amount">
//                     {tx.type.toLowerCase().includes('deposit') || tx.type.toLowerCase().includes('transfer_in') ? '+' : '-'}₹{tx.amount}
//                   </div>
//                   <div className="balance">Balance: ₹{tx.balanceAfter}</div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Dashboard;



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

      console.log('Account Response:', accountRes); // Debug log
      console.log('User Info:', userInfo); // Debug log

      setAccount(accountRes);
      setTransactions(transactionsRes.slice(0, 5));
    } catch (error) {
      console.error('Error fetching data:', error); // Debug log
      setToast({ message: 'Failed to fetch account data', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
    } catch {
      return 'N/A';
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

  // Inline Styles
  const enhancedCardStyle = {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    padding: '25px',
    borderRadius: '16px',
    boxShadow: '0 10px 30px rgba(102, 126, 234, 0.3)',
    transition: 'all 0.3s ease'
  };

  const cardHeaderStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
    paddingBottom: '15px',
    borderBottom: '1px solid rgba(255, 255, 255, 0.2)'
  };

  const typeBadgeStyle = {
    padding: '6px 15px',
    background: 'rgba(255, 255, 255, 0.2)',
    borderRadius: '15px',
    fontSize: '11px',
    fontWeight: '600',
    textTransform: 'uppercase',
    border: '1px solid rgba(255, 255, 255, 0.3)'
  };

  const balanceDisplayStyle = {
    textAlign: 'center',
    marginBottom: '25px',
    padding: '20px 15px',
    background: 'rgba(255, 255, 255, 0.1)',
    borderRadius: '12px'
  };

  const balanceLabelStyle = {
    fontSize: '12px',
    opacity: 0.9,
    marginBottom: '8px',
    textTransform: 'uppercase',
    letterSpacing: '1px'
  };

  const amountStyle = {
    fontSize: '42px',
    fontWeight: '700',
    margin: '0',
    textShadow: '0 2px 10px rgba(0, 0, 0, 0.2)'
  };

  const accountInfoListStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px'
  };

  const infoItemStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px',
    background: 'rgba(255, 255, 255, 0.1)',
    borderRadius: '8px',
    transition: 'all 0.2s ease',
    border: '1px solid rgba(255, 255, 255, 0.1)'
  };

  const labelStyle = {
    fontSize: '13px',
    opacity: 0.9,
    fontWeight: '500'
  };

  const valueStyle = {
    fontSize: '14px',
    fontWeight: '600',
    textAlign: 'right',
    wordBreak: 'break-word',
    maxWidth: '60%'
  };

  const statusActiveStyle = {
    padding: '4px 12px',
    background: 'rgba(76, 175, 80, 0.3)',
    border: '1px solid rgba(76, 175, 80, 0.6)',
    borderRadius: '10px',
    fontSize: '11px',
    fontWeight: '600'
  };

  // Get account data safely with fallbacks
  const accountNumber = account?.accountNumber || userInfo?.accountNumber || 'N/A';
  const customerName = account?.customer?.name || account?.customerName || userInfo?.customerName || userInfo?.name || 'N/A';
  const customerId = account?.customer?.id || account?.customerId || 'N/A';
  const customerEmail = account?.customer?.email || account?.email || null;
  const accountType = account?.type || account?.accountType || userInfo?.accountType || 'SAVINGS';
  const balance = account?.balance || 0;
  const createdAt = account?.createdAt || account?.customer?.createdAt || null;
  const updatedAt = account?.updatedAt || null;

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
        <h1>Welcome back, {customerName}! 👋</h1>
        <p>Here's your account overview</p>
      </div>

      <div className="dashboard-grid">
        {/* Enhanced Account Details Card */}
        <div className="stats-card" style={enhancedCardStyle}>
          {/* Header */}
          <div style={cardHeaderStyle}>
            <h3 style={{ margin: 0, fontSize: '20px' }}>💳 Account Details</h3>
            <span style={typeBadgeStyle}>{accountType}</span>
          </div>

          {/* Balance Display */}
          <div style={balanceDisplayStyle}>
            <div style={balanceLabelStyle}>Current Balance</div>
            <div style={amountStyle}>₹{Number(balance).toFixed(2)}</div>
          </div>

          {/* All Account Information */}
          <div style={accountInfoListStyle}>
            <div style={infoItemStyle}>
              <span style={labelStyle}>🔢 Account Number</span>
              <span style={valueStyle}>{accountNumber}</span>
            </div>
            
            <div style={infoItemStyle}>
              <span style={labelStyle}>👤 Account Holder</span>
              <span style={valueStyle}>{customerName}</span>
            </div>
            
            <div style={infoItemStyle}>
              <span style={labelStyle}>🆔 Customer ID</span>
              <span style={valueStyle}>{customerId}</span>
            </div>

            {customerEmail && (
              <div style={infoItemStyle}>
                <span style={labelStyle}>📧 Email</span>
                <span style={valueStyle}>{customerEmail}</span>
              </div>
            )}
            
            <div style={infoItemStyle}>
              <span style={labelStyle}>🏦 Account Type</span>
              <span style={valueStyle}>
                {accountType === 'SAVINGS' ? 'Savings Account' : 'Current Account'}
              </span>
            </div>
            
            <div style={infoItemStyle}>
              <span style={labelStyle}>📅 Account Opened</span>
              <span style={valueStyle}>{formatDate(createdAt)}</span>
            </div>

            {updatedAt && (
              <div style={infoItemStyle}>
                <span style={labelStyle}>🔄 Last Updated</span>
                <span style={valueStyle}>{formatDate(updatedAt)}</span>
              </div>
            )}
            
            <div style={infoItemStyle}>
              <span style={labelStyle}>✅ Status</span>
              <span style={valueStyle}>
                <span style={statusActiveStyle}>Active</span>
              </span>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 style={{ marginBottom: '15px' }}>Account Information</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div>
              <small style={{ color: '#666' }}>Customer Name</small>
              <div style={{ fontWeight: '500' }}>{customerName}</div>
            </div>
            <div>
              <small style={{ color: '#666' }}>Account Number</small>
              <div style={{ fontWeight: '500' }}>{accountNumber}</div>
            </div>
            <div>
              <small style={{ color: '#666' }}>Account Type</small>
              <div style={{ fontWeight: '500' }}>{accountType}</div>
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