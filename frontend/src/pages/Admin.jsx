import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api'
import toast from 'react-hot-toast'

const Admin = () => {
  const navigate = useNavigate()
  const [accounts, setAccounts] = useState([])
  const [filteredAccounts, setFilteredAccounts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchAccounts()
  }, [])

  useEffect(() => {
    filterAccounts()
  }, [searchTerm, accounts])

  const fetchAccounts = async () => {
    try {
      const res = await api.get('/accounts')
      if (res.data.success) {
        setAccounts(res.data.data)
      }
    } catch (error) {
      toast.error('Failed to fetch accounts')
    } finally {
      setLoading(false)
    }
  }

  const filterAccounts = () => {
    if (!searchTerm) {
      setFilteredAccounts(accounts)
      return
    }

    const filtered = accounts.filter(acc =>
      acc.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      acc.accountNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      acc.customerEmail?.toLowerCase().includes(searchTerm.toLowerCase())
    )

    setFilteredAccounts(filtered)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="mb-6 text-blue-600 dark:text-blue-400 hover:underline flex items-center"
      >
        ← Back
      </button>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            All Accounts
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {filteredAccounts.length} accounts found
          </p>
        </div>

                {/* Search */}
                <input
                  type="text"
                  placeholder="Search by name, account number, or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
        
                {/* Accounts Table */}
                {filteredAccounts.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500 dark:text-gray-400">No accounts found</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto mt-6">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200 dark:border-gray-700">
                          <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Customer Name</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Account Number</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Email</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Balance</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredAccounts.map((acc) => (
                          <tr key={acc._id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                            <td className="py-3 px-4 text-gray-900 dark:text-white">{acc.customerName}</td>
                            <td className="py-3 px-4 text-gray-900 dark:text-white">{acc.accountNumber}</td>
                            <td className="py-3 px-4 text-gray-900 dark:text-white">{acc.customerEmail}</td>
                            <td className="py-3 px-4 text-gray-900 dark:text-white">₹{acc.balance?.toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )
        }
        
        export default Admin
