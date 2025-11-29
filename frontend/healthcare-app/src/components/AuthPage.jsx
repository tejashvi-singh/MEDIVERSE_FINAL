import React, { useState } from 'react';
import { User, Lock, Mail, Stethoscope, UserCircle } from 'lucide-react';

const API_URL = 'http://localhost:5001/api';

function AuthPage({ onLogin }) {
  const [mode, setMode] = useState('landing'); // landing, login, signup
  const [userType, setUserType] = useState('patient');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    specialty: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const endpoint = mode === 'login' ? '/auth/login' : '/auth/register';
      const payload = mode === 'login' 
        ? { email: formData.email, password: formData.password }
        : { ...formData, role: userType };

      const res = await fetch(API_URL + endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (data.success) {
        localStorage.setItem('token', data.token);
        onLogin(data.user);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Connection failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGuestLogin = () => {
    const guest = {
      id: 'guest_' + Date.now(),
      name: 'Guest User',
      email: 'guest@demo.com',
      role: 'patient',
      isGuest: true
    };
    onLogin(guest);
  };

  if (mode === 'landing') {
    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #e0f7fa 0%, #e1bee7 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
        <div style={{ maxWidth: '1200px', width: '100%' }}>
          <div style={{ textAlign: 'center', marginBottom: '50px' }}>
            <h1 style={{ fontSize: '48px', fontWeight: 'bold', color: '#1a237e', marginBottom: '10px' }}>
              🏥 Healthcare Platform
            </h1>
            <p style={{ fontSize: '20px', color: '#424242' }}>
              Your Complete Medical Management Solution
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '30px', marginBottom: '40px' }}>
            {/* Doctor Card */}
            <div style={{ background: 'white', padding: '40px', borderRadius: '20px', boxShadow: '0 8px 32px rgba(0,0,0,0.1)', textAlign: 'center' }}>
              <div style={{ width: '80px', height: '80px', background: 'linear-gradient(135deg, #2196F3 0%, #1976D2 100%)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                <Stethoscope size={40} color="white" />
              </div>
              <h2 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '10px', color: '#1a237e' }}>Doctor Portal</h2>
              <p style={{ color: '#666', marginBottom: '30px' }}>Manage patients, appointments & records</p>
              <button onClick={() => { setMode('login'); setUserType('doctor'); }} style={{ width: '100%', background: '#2196F3', color: 'white', border: 'none', padding: '15px', borderRadius: '10px', fontSize: '16px', fontWeight: '600', marginBottom: '10px', cursor: 'pointer' }}>
                Login as Doctor
              </button>
              <button onClick={() => { setMode('signup'); setUserType('doctor'); }} style={{ width: '100%', background: 'white', color: '#2196F3', border: '2px solid #2196F3', padding: '15px', borderRadius: '10px', fontSize: '16px', fontWeight: '600', cursor: 'pointer' }}>
                Register as Doctor
              </button>
            </div>

            {/* Patient Card */}
            <div style={{ background: 'white', padding: '40px', borderRadius: '20px', boxShadow: '0 8px 32px rgba(0,0,0,0.1)', textAlign: 'center' }}>
              <div style={{ width: '80px', height: '80px', background: 'linear-gradient(135deg, #4CAF50 0%, #388E3C 100%)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                <UserCircle size={40} color="white" />
              </div>
              <h2 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '10px', color: '#1a237e' }}>Patient Portal</h2>
              <p style={{ color: '#666', marginBottom: '30px' }}>Access health records & consultations</p>
              <button onClick={() => { setMode('login'); setUserType('patient'); }} style={{ width: '100%', background: '#4CAF50', color: 'white', border: 'none', padding: '15px', borderRadius: '10px', fontSize: '16px', fontWeight: '600', marginBottom: '10px', cursor: 'pointer' }}>
                Login as Patient
              </button>
              <button onClick={() => { setMode('signup'); setUserType('patient'); }} style={{ width: '100%', background: 'white', color: '#4CAF50', border: '2px solid #4CAF50', padding: '15px', borderRadius: '10px', fontSize: '16px', fontWeight: '600', cursor: 'pointer' }}>
                Register as Patient
              </button>
            </div>
          </div>

          <div style={{ textAlign: 'center' }}>
            <button onClick={handleGuestLogin} style={{ background: 'transparent', border: 'none', color: '#666', fontSize: '16px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
              <User size={20} />
              Continue as Guest (No Registration)
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Login/Signup Form
  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #e0f7fa 0%, #e1bee7 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div style={{ background: 'white', padding: '40px', borderRadius: '20px', boxShadow: '0 8px 32px rgba(0,0,0,0.1)', maxWidth: '500px', width: '100%' }}>
        <button onClick={() => setMode('landing')} style={{ background: 'transparent', border: 'none', color: '#666', marginBottom: '20px', cursor: 'pointer', fontSize: '14px' }}>
          ← Back
        </button>

        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <div style={{ width: '60px', height: '60px', background: userType === 'doctor' ? '#2196F3' : '#4CAF50', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 15px' }}>
            {userType === 'doctor' ? <Stethoscope size={30} color="white" /> : <UserCircle size={30} color="white" />}
          </div>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1a237e' }}>
            {mode === 'login' ? 'Login' : 'Sign Up'} as {userType === 'doctor' ? 'Doctor' : 'Patient'}
          </h2>
        </div>

        {error && <div style={{ background: '#ffebee', color: '#c62828', padding: '10px', borderRadius: '8px', marginBottom: '20px', fontSize: '14px' }}>{error}</div>}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {mode === 'signup' && (
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', fontSize: '14px' }}>Full Name *</label>
              <div style={{ position: 'relative' }}>
                <User size={20} style={{ position: 'absolute', left: '10px', top: '10px', color: '#999' }} />
                <input type="text" required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} style={{ width: '100%', padding: '10px 10px 10px 40px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '14px' }} placeholder="Enter your full name" />
              </div>
            </div>
          )}

          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', fontSize: '14px' }}>Email Address *</label>
            <div style={{ position: 'relative' }}>
              <Mail size={20} style={{ position: 'absolute', left: '10px', top: '10px', color: '#999' }} />
              <input type="email" required value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} style={{ width: '100%', padding: '10px 10px 10px 40px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '14px' }} placeholder="your@email.com" />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', fontSize: '14px' }}>Password *</label>
            <div style={{ position: 'relative' }}>
              <Lock size={20} style={{ position: 'absolute', left: '10px', top: '10px', color: '#999' }} />
              <input type="password" required value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} style={{ width: '100%', padding: '10px 10px 10px 40px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '14px' }} placeholder="Enter password (min 6 characters)" />
            </div>
          </div>

          {mode === 'signup' && userType === 'doctor' && (
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', fontSize: '14px' }}>Specialty *</label>
              <select required value={formData.specialty} onChange={e => setFormData({ ...formData, specialty: e.target.value })} style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '14px' }}>
                <option value="">Select Specialty</option>
                <option value="General Medicine">General Medicine</option>
                <option value="Cardiology">Cardiology</option>
                <option value="Dermatology">Dermatology</option>
                <option value="Pediatrics">Pediatrics</option>
              </select>
            </div>
          )}

          <button type="submit" disabled={loading} style={{ width: '100%', background: userType === 'doctor' ? '#2196F3' : '#4CAF50', color: 'white', border: 'none', padding: '15px', borderRadius: '8px', fontSize: '16px', fontWeight: '600', cursor: 'pointer', marginTop: '10px' }}>
            {loading ? 'Processing...' : (mode === 'login' ? 'Login' : 'Create Account')}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <button onClick={() => setMode(mode === 'login' ? 'signup' : 'login')} style={{ background: 'transparent', border: 'none', color: '#666', fontSize: '14px', cursor: 'pointer' }}>
            {mode === 'login' ? "Don't have an account? Sign up" : 'Already have an account? Login'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default AuthPage;