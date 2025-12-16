import React, { useEffect, useState } from 'react'
import api from '../api'
import { getUserInfo } from '../utils/auth'

const Transactions = () => {
  const { accountNumber } = getUserInfo()
  const [txs, setTxs] = useState([])

  useEffect(() => {
    api.get(`/accounts/${accountNumber}/transactions`).then(res => {
      setTxs(res.data.data)
    })
  }, [])

  return (
    <div className="p-8">
      <h2 className="text-2xl mb-4">Transactions</h2>
      {txs.map(tx => (
        <div key={tx.id} className="border p-3 mb-2">
          {tx.type} — ₹{tx.amount}
        </div>
      ))}
    </div>
  )
}

export default Transactions
