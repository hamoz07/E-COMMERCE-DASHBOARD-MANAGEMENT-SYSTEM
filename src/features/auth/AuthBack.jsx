import { Navigate, Outlet } from 'react-router-dom'
import Cookie from 'cookie-universal'

const AuthBack = () => {
    const cookie = Cookie()
    const token =  cookie.get("user-token")
  return (
    token ? <Navigate to="/dashboard" replace={true} /> : <Outlet />
  )
}

export default AuthBack
