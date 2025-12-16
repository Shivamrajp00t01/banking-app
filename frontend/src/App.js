// import React, { useEffect, useState } from "react";
// import {
//   getAccounts,
//   createAccount,
//   depositAmount,
//   withdrawAmount
// } from "./api";

// export default function App() {
//   const [accounts, setAccounts] = useState([]);
//   const [name, setName] = useState("");
//   const [balance, setBalance] = useState("");
//   const [amount, setAmount] = useState("");

//   useEffect(() => {
//     loadAccounts();
//   }, []);

//   const loadAccounts = async () => {
//     const data = await getAccounts();
//     setAccounts(data);
//   };

//   const handleCreate = async (e) => {
//     e.preventDefault();
//     if (!name || !balance) return alert("Fill all fields");

//     await createAccount(name, balance);
//     setName("");
//     setBalance("");
//     loadAccounts();
//   };

//   const handleDeposit = async (id) => {
//     if (!amount) return alert("Enter amount");
//     await depositAmount(id, amount);
//     setAmount("");
//     loadAccounts();
//   };

//   const handleWithdraw = async (id) => {
//     if (!amount) return alert("Enter amount");
//     await withdrawAmount(id, amount);
//     setAmount("");
//     loadAccounts();
//   };

//   return (
//     <div style={{ padding: 30 }}>
//       <h1>🏦 Bank Dashboard</h1>

//       {/* CREATE ACCOUNT */}
//       <h2>Create Account</h2>
//       <form onSubmit={handleCreate}>
//         <input
//           placeholder="Customer Name"
//           value={name}
//           onChange={(e) => setName(e.target.value)}
//         />
//         <input
//           type="number"
//           placeholder="Initial Balance"
//           value={balance}
//           onChange={(e) => setBalance(e.target.value)}
//         />
//         <button>Create</button>
//       </form>

//       <hr />

//       {/* ACCOUNT LIST */}
//       <h2>Accounts</h2>
//       {accounts.map((acc) => (
//         <div
//           key={acc.accountNumber}
//           style={{
//             border: "1px solid #ccc",
//             padding: 10,
//             marginBottom: 10
//           }}
//         >
//           <strong>{acc.name}</strong> <br />
//           Account No: {acc.accountNumber} <br />
//           Balance: ₹{acc.balance}

//           <br /><br />

//           <input
//             type="number"
//             placeholder="Amount"
//             value={amount}
//             onChange={(e) => setAmount(e.target.value)}
//           />

//           <button onClick={() => handleDeposit(acc.accountNumber)}>
//             Deposit
//           </button>

//           <button onClick={() => handleWithdraw(acc.accountNumber)}>
//             Withdraw
//           </button>
//         </div>
//       ))}
//     </div>
//   );
// }




////////////



import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import NavBar from './components/NavBar';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Deposit from './pages/Deposit';
import Withdraw from './pages/Withdraw';
import Transfer from './pages/Transfer';
import Transactions from './pages/Transactions';
import Profile from './pages/Profile';
import Admin from './pages/Admin';
import { isAuthenticated } from './utils/auth';

function App() {
  const [isAuth, setIsAuth] = useState(isAuthenticated());

  const PrivateRoute = ({ children }) => {
    return isAuth ? children : <Navigate to="/login" />;
  };

  return (
    <Router>
      <div className="App">
        {isAuth && <NavBar setIsAuth={setIsAuth} />}

        <Routes>
          <Route 
            path="/login" 
            element={
              isAuth ? <Navigate to="/dashboard" /> : <Login setIsAuth={setIsAuth} />
            } 
          />
          
          <Route 
            path="/dashboard" 
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            } 
          />
          
          <Route 
            path="/deposit" 
            element={
              <PrivateRoute>
                <Deposit />
              </PrivateRoute>
            } 
          />
          
          <Route 
            path="/withdraw" 
            element={
              <PrivateRoute>
                <Withdraw />
              </PrivateRoute>
            } 
          />
          
          <Route 
            path="/transfer" 
            element={
              <PrivateRoute>
                <Transfer />
              </PrivateRoute>
            } 
          />
          
          <Route 
            path="/transactions" 
            element={
              <PrivateRoute>
                <Transactions />
              </PrivateRoute>
            } 
          />
          
          <Route 
            path="/profile" 
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            } 
          />
          
          <Route 
            path="/admin" 
            element={
              <PrivateRoute>
                <Admin />
              </PrivateRoute>
            } 
          />
          
          <Route path="/" element={<Navigate to="/dashboard" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
