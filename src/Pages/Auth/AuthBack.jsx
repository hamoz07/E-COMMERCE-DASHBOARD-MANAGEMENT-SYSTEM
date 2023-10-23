import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import Cookie from 'cookie-universal'

const AuthBack = () => {
    const cookie = Cookie()
    const token =  cookie.get("user-token")
  return (
    token ? window.history.back() : <Outlet />
  )
}

export default AuthBack
