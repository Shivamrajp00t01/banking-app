import React, { useEffect, useState } from 'react'
import api from '../api'
import { getUserInfo } from '../utils/auth'

const Profile = () => {
  const { accountNumber } = getUserInfo()
  const [account, setAccount] = useState(null)

  useEffect(() => {
    api.get(`/accounts/${accountNumber}`).then(res => {
      setAccount(res.data.data)
    })
  }, [])

  if (!account) return null

  return (
    <div className="p-8">
      <h2 className="text-2xl mb-4">Profile</h2>
      <p>Name: {account.customerName}</p>
      <p>Email: {account.customerEmail}</p>
    </div>
  )
}

export default Profile
