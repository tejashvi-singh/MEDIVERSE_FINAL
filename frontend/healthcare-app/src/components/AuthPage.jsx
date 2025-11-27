import React, { useState } from 'react'
import { User, Lock, Mail, Stethoscope, UserCircle } from 'lucide-react'

function AuthPage({ onLogin }) {
  const [mode, setMode] = useState('landing') // landing, login, signup
  const [userType, setUserType] = useState('patient')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    specialty: '',
    age: '',
    phone: ''
  })
  const [errors, setErrors] = useState({})

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid'
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }
    
    if (mode === 'signup') {
      if (!formData.name) newErrors.name = 'Name is required'
      if (userType === 'doctor' && !formData.specialty) {
        newErrors.specialty = 'Specialty is required'
      }
      if (userType === 'patient' && !formData.age) {
        newErrors.age = 'Age is required'
      }
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!validateForm()) return

    // Simulate API call
    const user = {
      id: Date.now().toString(),
      email: formData.email,
      name: formData.name || formData.email.split('@')[0],
      role: userType,
      avatar: userType === 'doctor' ? '👨‍⚕️' : '👤',
      ...(userType === 'doctor' && { specialty: formData.specialty || 'General Medicine' }),
      ...(userType === 'patient' && { age: formData.age || 30 })
    }

    // Save to localStorage (mock database)
    const users = JSON.parse(localStorage.getItem('users') || '[]')
    
    if (mode === 'signup') {
      // Check if user exists
      const existingUser = users.find(u => u.email === formData.email)
      if (existingUser) {
        setErrors({ email: 'User already exists' })
        return
      }
      users.push({ ...user, password: formData.password })
      localStorage.setItem('users', JSON.stringify(users))
    } else {
      // Login validation
      const existingUser = users.find(
        u => u.email === formData.email && u.password === formData.password
      )
      if (!existingUser) {
        setErrors({ email: 'Invalid credentials' })
        return
      }
      Object.assign(user, existingUser)
    }

    onLogin(user)
  }

  const handleGuestLogin = () => {
    const guestUser = {
      id: 'guest_' + Date.now(),
      name: 'Guest User',
      email: 'guest@temp.com',
      role: 'patient',
      age: 25,
      avatar: '👤'
    }
    onLogin(guestUser, true)
  }

  if (mode === 'landing') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
        <div className="max-w-5xl w-full">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-gray-900 mb-4">
              🏥 Healthcare Platform
            </h1>
            <p className="text-xl text-gray-600">
              Your Complete Medical Management Solution
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-shadow">
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Stethoscope className="w-10 h-10 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Doctor Portal</h2>
                <p className="text-gray-600 mt-2">Manage patients, appointments & records</p>
              </div>
              <div className="space-y-3">
                <button
                  onClick={() => { setMode('login'); setUserType('doctor') }}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors"
                >
                  Login as Doctor
                </button>
                <button
                  onClick={() => { setMode('signup'); setUserType('doctor') }}
                  className="w-full border-2 border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold py-3 rounded-lg transition-colors"
                >
                  Register as Doctor
                </button>
              </div>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-shadow">
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <UserCircle className="w-10 h-10 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Patient Portal</h2>
                <p className="text-gray-600 mt-2">Access health records & consultations</p>
              </div>
              <div className="space-y-3">
                <button
                  onClick={() => { setMode('login'); setUserType('patient') }}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition-colors"
                >
                  Login as Patient
                </button>
                <button
                  onClick={() => { setMode('signup'); setUserType('patient') }}
                  className="w-full border-2 border-green-600 text-green-600 hover:bg-green-50 font-semibold py-3 rounded-lg transition-colors"
                >
                  Register as Patient
                </button>
              </div>
            </div>
          </div>

          <div className="text-center">
            <button
              onClick={handleGuestLogin}
              className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium"
            >
              <User className="w-5 h-5" />
              Continue as Guest (No Registration)
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full">
        <button
          onClick={() => setMode('landing')}
          className="text-gray-600 hover:text-gray-900 mb-4"
        >
          ← Back
        </button>

        <div className="text-center mb-8">
          <div className={`w-16 h-16 ${userType === 'doctor' ? 'bg-blue-100' : 'bg-green-100'} rounded-full flex items-center justify-center mx-auto mb-4`}>
            {userType === 'doctor' ? (
              <Stethoscope className={`w-8 h-8 ${userType === 'doctor' ? 'text-blue-600' : 'text-green-600'}`} />
            ) : (
              <UserCircle className={`w-8 h-8 ${userType === 'doctor' ? 'text-blue-600' : 'text-green-600'}`} />
            )}
          </div>
          <h2 className="text-2xl font-bold text-gray-900">
            {mode === 'login' ? 'Login' : 'Sign Up'} as {userType === 'doctor' ? 'Doctor' : 'Patient'}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your full name"
                />
              </div>
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address *
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="your@email.com"
              />
            </div>
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password *
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter password"
              />
            </div>
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
          </div>

          {mode === 'signup' && userType === 'doctor' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Specialty *
              </label>
              <select
                value={formData.specialty}
                onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select Specialty</option>
                <option value="General Medicine">General Medicine</option>
                <option value="Cardiology">Cardiology</option>
                <option value="Pediatrics">Pediatrics</option>
                <option value="Orthopedics">Orthopedics</option>
                <option value="Dermatology">Dermatology</option>
              </select>
              {errors.specialty && <p className="text-red-500 text-sm mt-1">{errors.specialty}</p>}
            </div>
          )}

          {mode === 'signup' && userType === 'patient' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Age *
              </label>
              <input
                type="number"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your age"
              />
              {errors.age && <p className="text-red-500 text-sm mt-1">{errors.age}</p>}
            </div>
          )}

          <button
            type="submit"
            className={`w-full ${userType === 'doctor' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-green-600 hover:bg-green-700'} text-white font-semibold py-3 rounded-lg transition-colors`}
          >
            {mode === 'login' ? 'Login' : 'Create Account'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            {mode === 'login' ? "Don't have an account? Sign up" : 'Already have an account? Login'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default AuthPage