import React, { useEffect, useState } from 'react'
import api from '../api'
import { getUserInfo } from '../utils/auth'

const Analytics = () => {
  const { accountNumber } = getUserInfo()
  const [data, setData] = useState(null)

  useEffect(() => {
    api.get(`/accounts/${accountNumber}/analytics`).then(res => {
      setData(res.data.data)
    })
  }, [])

  if (!data) return <p className="p-8">Loading...</p>

  return (
    <div className="p-8">
      <h2 className="text-2xl mb-4">Analytics</h2>
      <p>Total Deposits: ₹{data.totalDeposits}</p>
      <p>Total Withdrawals: ₹{data.totalWithdrawals}</p>
    </div>
  )
}

export default Analytics
