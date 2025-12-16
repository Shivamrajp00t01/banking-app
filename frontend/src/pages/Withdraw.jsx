import React, { useState } from 'react'
import api from '../api'
import { getUserInfo } from '../utils/auth'
import toast from 'react-hot-toast'

const Withdraw = () => {
  const { accountNumber } = getUserInfo()
  const [amount, setAmount] = useState('')

  const submit = async () => {
    await api.post(`/accounts/${accountNumber}/withdraw`, { amount })
    toast.success('Withdrawal successful')
  }

  return (
    <div className="p-8">
      <h2 className="text-2xl mb-4">Withdraw</h2>
      <input className="border p-2 mr-2" value={amount} onChange={e => setAmount(e.target.value)} />
      <button onClick={submit} className="bg-red-600 text-white px-4 py-2">Withdraw</button>
    </div>
  )
}

export default Withdraw
