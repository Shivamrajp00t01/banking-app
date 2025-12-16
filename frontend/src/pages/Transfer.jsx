import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api'
import { getUserInfo } from '../utils/auth'
import Modal from '../components/Modal'
import toast from 'react-hot-toast'

const Transfer = () => {
  const navigate = useNavigate()
  const user = getUserInfo()

  const [amount, setAmount] = useState('')
  const [toAccount, setToAccount] = useState('')
  const [balance, setBalance] = useState(0)
  const [otp, setOtp] = useState('')
  const [showOtp, setShowOtp] = useState(false)
  const [otpSent, setOtpSent] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    api.get(`/accounts/${user.accountNumber}`)
      .then(res => setBalance(res.data.data.balance))
  }, [])

  const submitTransfer = async (otpValue = null) => {
    setLoading(true)
    try {
      await api.post(`/accounts/${user.accountNumber}/transfer`, {
        toAccount,
        amount: Number(amount),
        otp: otpValue
      })
      toast.success('Transfer successful')
      navigate('/dashboard')
    } catch {
      toast.error('Transfer failed')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!toAccount || !amount) {
      toast.error('All fields required')
      return
    }

    if (toAccount === user.accountNumber) {
      toast.error('Cannot transfer to same account')
      return
    }

    if (Number(amount) > balance) {
      toast.error('Insufficient balance')
      return
    }

    if (Number(amount) > 10000) {
      setShowOtp(true)
      if (!otpSent) {
        api.post(`/accounts/${user.accountNumber}/otp/request`)
        setOtpSent(true)
        toast.success('OTP sent')
      }
      return
    }

    submitTransfer()
  }

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Transfer Money</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          placeholder="To Account Number"
          value={toAccount}
          onChange={(e) => setToAccount(e.target.value)}
          className="w-full p-3 border rounded"
          required
        />

        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full p-3 border rounded"
          required
        />

        <p className="text-sm text-gray-600">Balance: ₹{balance}</p>

        <button
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded disabled:opacity-50"
        >
          {loading ? 'Processing...' : 'Transfer'}
        </button>
      </form>

      <Modal isOpen={showOtp} onClose={() => setShowOtp(false)} title="OTP Verification">
        <input
          value={otp}
          onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
          maxLength={6}
          placeholder="Enter OTP"
          className="w-full p-3 border rounded text-center text-xl"
        />

        <button
          onClick={() => submitTransfer(otp)}
          disabled={otp.length !== 6 || loading}
          className="w-full mt-4 bg-green-600 text-white py-3 rounded disabled:opacity-50"
        >
          Verify & Transfer
        </button>
      </Modal>
    </div>
  )
}

export default Transfer
