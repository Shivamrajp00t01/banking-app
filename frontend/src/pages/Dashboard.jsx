import React, { useEffect, useState } from 'react'
import api from '../api'
import { getUserInfo } from '../utils/auth'

const Dashboard = () => {
  const { accountNumber } = getUserInfo()
  const [account, setAccount] = useState(null)

  useEffect(() => {
    api.get(`/accounts/${accountNumber}`).then(res => {
      setAccount(res.data.data)
    })
  }, [])

  if (!account) return <p className="p-8">Loading...</p>

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Welcome, {account.customerName}</h1>
      <div className="bg-white rounded-lg p-6 shadow">
        <p><b>Account:</b> {account.accountNumber}</p>
        <p><b>Type:</b> {account.type}</p>
        <p className="text-2xl mt-2">₹ {account.balance}</p>
      </div>
    </div>
  )
}

export default Dashboard
