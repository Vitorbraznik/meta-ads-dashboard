import { useState, useEffect } from 'react'
import Head from 'next/head'
import Header from '../components/Header'
import LoginModal from '../components/LoginModal'
import Dashboard from '../components/Dashboard'

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [showLogin, setShowLogin] = useState(false)
  const [user, setUser] = useState(null)

  useEffect(() => {
    checkAuth()
  }, [])

  async function checkAuth() {
    try {
      const res = await fetch('/api/auth/check')
      const data = await res.json()
      if (data.authenticated) {
        setIsAuthenticated(true)
        setUser(data.user)
      } else {
        setShowLogin(true)
      }
    } catch {
      setShowLogin(true)
    } finally {
      setIsLoading(false)
    }
  }

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    setIsAuthenticated(false)
    setUser(null)
    setShowLogin(true)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <Head>
        <title>Meta Ads Dashboard - AF Motors</title>
        <meta name="description" content="Dashboard de campanhas Meta Ads" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header user={user} onLogout={handleLogout} isAuthenticated={isAuthenticated} />

      {showLogin && !isAuthenticated ? (
        <LoginModal onClose={() => {}} />
      ) : (
        <Dashboard />
      )}
    </>
  )
}
