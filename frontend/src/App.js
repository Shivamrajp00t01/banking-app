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