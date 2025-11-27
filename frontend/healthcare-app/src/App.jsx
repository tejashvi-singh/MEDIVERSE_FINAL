import React, { useState, useEffect } from 'react'
import Dashboard from './components/Dashboard'
import AuthPage from './components/AuthPage'

function App() {
  const [currentUser, setCurrentUser] = useState(null)
  const [isGuest, setIsGuest] = useState(false)

  useEffect(() => {
    // Check for saved session
    const savedUser = localStorage.getItem('currentUser')
    const savedGuest = localStorage.getItem('isGuest')
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser))
    }
    if (savedGuest === 'true') {
      setIsGuest(true)
    }
  }, [])

  const handleLogin = (user, guest = false) => {
    setCurrentUser(user)
    setIsGuest(guest)
    if (!guest) {
      localStorage.setItem('currentUser', JSON.stringify(user))
    } else {
      localStorage.setItem('isGuest', 'true')
    }
  }

  const handleLogout = () => {
    setCurrentUser(null)
    setIsGuest(false)
    localStorage.removeItem('currentUser')
    localStorage.removeItem('isGuest')
  }

  if (!currentUser) {
    return <AuthPage onLogin={handleLogin} />
  }

  return <Dashboard user={currentUser} isGuest={isGuest} onLogout={handleLogout} />
}

export default App