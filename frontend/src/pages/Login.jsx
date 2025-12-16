import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login, createAccount } from '../api/auth'
import { setAuthToken, setUserInfo } from '../utils/auth'
import toast from 'react-hot-toast'

const Login = ({ setIsAuth }) => {
  const navigate = useNavigate()
  const [isLoginMode, setIsLoginMode] = useState(true)
  const [loading, setLoading] = useState(false)

  const [loginData, setLoginData] = useState({
    accountNumber: '',
    password: ''
  })

  const [signupData, setSignupData] = useState({
    customerName: '',
    email: '',
    accountType: 'SAVINGS',
    password: ''
  })

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await login(loginData)
      if (res.success) {
        setAuthToken(res.data.token)
        setUserInfo(res.data)
        setIsAuth(true)
        toast.success('Login successful')
        navigate('/dashboard')
      }
    } catch {
      toast.error('Invalid credentials')
    } finally {
      setLoading(false)
    }
  }

  const handleSignup = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await createAccount(signupData)
      if (res.success) {
        toast.success(`Account Created: ${res.data}`)
        setIsLoginMode(true)
      }
    } catch {
      toast.error('Signup failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-6 text-blue-600">
          Apana Bank
        </h1>

        <div className="flex mb-6">
          <button
            onClick={() => setIsLoginMode(true)}
            className={`flex-1 py-2 ${isLoginMode ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            Login
          </button>
          <button
            onClick={() => setIsLoginMode(false)}
            className={`flex-1 py-2 ${!isLoginMode ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            Sign Up
          </button>
        </div>

        {isLoginMode ? (
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="text"
              placeholder="Account Number"
              value={loginData.accountNumber}
              onChange={(e) =>
                setLoginData({ ...loginData, accountNumber: e.target.value })
              }
              className="w-full p-3 border rounded"
              required
            />

            <input
              type="password"
              placeholder="Password"
              value={loginData.password}
              onChange={(e) =>
                setLoginData({ ...loginData, password: e.target.value })
              }
              className="w-full p-3 border rounded"
              required
            />

            <button className="w-full bg-blue-600 text-white py-3 rounded">
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleSignup} className="space-y-4">
            <input
              type="text"
              placeholder="Full Name"
              value={signupData.customerName}
              onChange={(e) =>
                setSignupData({ ...signupData, customerName: e.target.value })
              }
              className="w-full p-3 border rounded"
              required
            />

            <input
              type="email"
              placeholder="Email"
              value={signupData.email}
              onChange={(e) =>
                setSignupData({ ...signupData, email: e.target.value })
              }
              className="w-full p-3 border rounded"
              required
            />
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
  Account Type
</label>
<select
  value={signupData.accountType}
  onChange={(e) => setSignupData({ ...signupData, accountType: e.target.value })}
  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
>
  <option value="SAVINGS">Savings Account</option>
  <option value="CURRENT">Current Account</option>
</select>


            {/* <select
              value={signupData.accountType}
              onChange={(e) =>
                setSignupData({ ...signupData, accountType: e.target.value })
              }
              className="w-full p-3 border rounded"
            >
              <option value="SAVINGS">Savings</option>
              <option value="CURRENT">Current</option>
            </select> */}

            <input
              type="password"
              placeholder="Password"
              value={signupData.password}
              onChange={(e) =>
                setSignupData({ ...signupData, password: e.target.value })
              }
              className="w-full p-3 border rounded"
              required
            />

            <button className="w-full bg-green-600 text-white py-3 rounded">
              {loading ? 'Creating...' : 'Create Account'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

// export default Login
