import { Link, useNavigate } from 'react-router-dom'
import { removeAuthToken } from '../utils/auth'

const NavBar = ({ setIsAuth }) => {
  const navigate = useNavigate()

  const logout = () => {
    removeAuthToken()
    setIsAuth(false)
    navigate('/login')
  }

  return (
    <nav className="bg-blue-600 text-white p-4 flex gap-4">
      <Link to="/dashboard">Dashboard</Link>
      <Link to="/deposit">Deposit</Link>
      <Link to="/withdraw">Withdraw</Link>
      <Link to="/transactions">Transactions</Link>
      <button onClick={logout}>Logout</button>
    </nav>
  )
}

export default NavBar
