// frontend/src/components/PatientDashboard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './PatientDashboard.css';

const PatientDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showRecordModal, setShowRecordModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  
  const [bookingForm, setBookingForm] = useState({
    doctorId: '',
    date: '',
    time: '',
    reason: '',
    symptoms: ''
  });

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  useEffect(() => {
    checkAuth();
    fetchData();
  }, []);

  const checkAuth = () => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (!token || !userData) {
      navigate('/login');
      return;
    }
    
    setUser(JSON.parse(userData));
  };

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      const [appointmentsRes, doctorsRes, recordsRes] = await Promise.all([
        axios.get(`${API_URL}/api/appointments/my-appointments`, config),
        axios.get(`${API_URL}/api/users/doctors`, config),
        axios.get(`${API_URL}/api/medical-records/my-records`, config)
      ]);

      setAppointments(appointmentsRes.data.appointments || []);
      setDoctors(doctorsRes.data.doctors || []);
      setMedicalRecords(recordsRes.data.records || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBookingChange = (e) => {
    setBookingForm({
      ...bookingForm,
      [e.target.name]: e.target.value
    });
  };

  const handleBookAppointment = async (e) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_URL}/api/appointments/book`,
        bookingForm,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.data.success) {
        alert('Appointment booked successfully!');
        setShowBookingModal(false);
        setBookingForm({
          doctorId: '',
          date: '',
          time: '',
          reason: '',
          symptoms: ''
        });
        fetchData();
      }
    } catch (error) {
      console.error('Booking error:', error);
      alert(error.response?.data?.message || 'Failed to book appointment');
    }
  };

  const handleCancelAppointment = async (appointmentId) => {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.patch(
        `${API_URL}/api/appointments/${appointmentId}/cancel`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      alert('Appointment cancelled successfully');
      fetchData();
    } catch (error) {
      console.error('Cancel error:', error);
      alert('Failed to cancel appointment');
    }
  };

  const viewMedicalRecord = (record) => {
    setSelectedRecord(record);
    setShowRecordModal(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: '#FFA500',
      confirmed: '#4CAF50',
      cancelled: '#f44336',
      completed: '#2196F3'
    };
    return colors[status] || '#666';
  };

  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="patient-dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-content">
          <div className="logo">
            <h1>🏥 MEDIVERSE</h1>
          </div>
          <div className="user-info">
            <span className="welcome-text">Welcome, {user?.name}</span>
            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="dashboard-content">
        {/* Quick Stats */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">📅</div>
            <div className="stat-info">
              <h3>{appointments.filter(a => a.status === 'pending').length}</h3>
              <p>Pending Appointments</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">✅</div>
            <div className="stat-info">
              <h3>{appointments.filter(a => a.status === 'confirmed').length}</h3>
              <p>Confirmed Appointments</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">📋</div>
            <div className="stat-info">
              <h3>{medicalRecords.length}</h3>
              <p>Medical Records</p>
            </div>
          </div>
          <div className="stat-card action-card">
            <button 
              className="book-appointment-btn"
              onClick={() => setShowBookingModal(true)}
            >
              <span>➕</span>
              Book New Appointment
            </button>
          </div>
        </div>

        {/* Appointments Section */}
        <section className="dashboard-section">
          <h2>My Appointments</h2>
          {appointments.length === 0 ? (
            <div className="empty-state">
              <p>📅 No appointments yet</p>
              <button onClick={() => setShowBookingModal(true)}>
                Book Your First Appointment
              </button>
            </div>
          ) : (
            <div className="appointments-list">
              {appointments.map((appointment) => (
                <div key={appointment._id} className="appointment-card">
                  <div className="appointment-header">
                    <div className="doctor-info">
                      <div className="doctor-avatar">
                        {appointment.doctor?.name?.charAt(0) || 'D'}
                      </div>
                      <div>
                        <h3>Dr. {appointment.doctor?.name || 'Unknown'}</h3>
                        <p className="specialization">
                          {appointment.doctor?.specialization || 'General Physician'}
                        </p>
                      </div>
                    </div>
                    <span 
                      className="status-badge"
                      style={{ backgroundColor: getStatusColor(appointment.status) }}
                    >
                      {appointment.status}
                    </span>
                  </div>
                  <div className="appointment-details">
                    <div className="detail-item">
                      <span className="icon">📅</span>
                      <span>{new Date(appointment.date).toLocaleDateString()}</span>
                    </div>
                    <div className="detail-item">
                      <span className="icon">⏰</span>
                      <span>{appointment.time}</span>
                    </div>
                    <div className="detail-item">
                      <span className="icon">📝</span>
                      <span>{appointment.reason}</span>
                    </div>
                  </div>
                  {appointment.symptoms && (
                    <div className="symptoms-section">
                      <strong>Symptoms:</strong> {appointment.symptoms}
                    </div>
                  )}
                  {appointment.status === 'pending' && (
                    <div className="appointment-actions">
                      <button 
                        className="cancel-btn"
                        onClick={() => handleCancelAppointment(appointment._id)}
                      >
                        Cancel Appointment
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Medical Records Section */}
        <section className="dashboard-section">
          <h2>Medical Records</h2>
          {medicalRecords.length === 0 ? (
            <div className="empty-state">
              <p>📋 No medical records available</p>
            </div>
          ) : (
            <div className="records-grid">
              {medicalRecords.map((record) => (
                <div key={record._id} className="record-card">
                  <div className="record-header">
                    <h4>{record.title || 'Medical Record'}</h4>
                    <span className="record-date">
                      {new Date(record.date).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="record-info">
                    <p><strong>Doctor:</strong> Dr. {record.doctor?.name}</p>
                    <p><strong>Type:</strong> {record.type || 'General'}</p>
                  </div>
                  <button 
                    className="view-record-btn"
                    onClick={() => viewMedicalRecord(record)}
                  >
                    View Details
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Booking Modal */}
      {showBookingModal && (
        <div className="modal-overlay" onClick={() => setShowBookingModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Book Appointment</h2>
              <button 
                className="close-btn"
                onClick={() => setShowBookingModal(false)}
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleBookAppointment} className="booking-form">
              <div className="form-group">
                <label>Select Doctor</label>
                <select
                  name="doctorId"
                  value={bookingForm.doctorId}
                  onChange={handleBookingChange}
                  required
                >
                  <option value="">Choose a doctor</option>
                  {doctors.map((doctor) => (
                    <option key={doctor._id} value={doctor._id}>
                      Dr. {doctor.name} - {doctor.specialization || 'General Physician'}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Date</label>
                  <input
                    type="date"
                    name="date"
                    value={bookingForm.date}
                    onChange={handleBookingChange}
                    min={getMinDate()}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Time</label>
                  <select
                    name="time"
                    value={bookingForm.time}
                    onChange={handleBookingChange}
                    required
                  >
                    <option value="">Select time</option>
                    <option value="09:00 AM">09:00 AM</option>
                    <option value="10:00 AM">10:00 AM</option>
                    <option value="11:00 AM">11:00 AM</option>
                    <option value="12:00 PM">12:00 PM</option>
                    <option value="02:00 PM">02:00 PM</option>
                    <option value="03:00 PM">03:00 PM</option>
                    <option value="04:00 PM">04:00 PM</option>
                    <option value="05:00 PM">05:00 PM</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>Reason for Visit</label>
                <input
                  type="text"
                  name="reason"
                  value={bookingForm.reason}
                  onChange={handleBookingChange}
                  placeholder="e.g., Regular checkup, Consultation"
                  required
                />
              </div>
              <div className="form-group">
                <label>Symptoms (Optional)</label>
                <textarea
                  name="symptoms"
                  value={bookingForm.symptoms}
                  onChange={handleBookingChange}
                  placeholder="Describe your symptoms..."
                  rows="3"
                />
              </div>
              <div className="modal-actions">
                <button type="button" onClick={() => setShowBookingModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="primary-btn">
                  Book Appointment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Medical Record Modal */}
      {showRecordModal && selectedRecord && (
        <div className="modal-overlay" onClick={() => setShowRecordModal(false)}>
          <div className="modal-content large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Medical Record Details</h2>
              <button 
                className="close-btn"
                onClick={() => setShowRecordModal(false)}
              >
                ✕
              </button>
            </div>
            <div className="record-details">
              <div className="detail-row">
                <strong>Date:</strong>
                <span>{new Date(selectedRecord.date).toLocaleDateString()}</span>
              </div>
              <div className="detail-row">
                <strong>Doctor:</strong>
                <span>Dr. {selectedRecord.doctor?.name}</span>
              </div>
              <div className="detail-row">
                <strong>Type:</strong>
                <span>{selectedRecord.type || 'General'}</span>
              </div>
              {selectedRecord.diagnosis && (
                <div className="detail-section">
                  <strong>Diagnosis:</strong>
                  <p>{selectedRecord.diagnosis}</p>
                </div>
              )}
              {selectedRecord.prescription && (
                <div className="detail-section">
                  <strong>Prescription:</strong>
                  <p>{selectedRecord.prescription}</p>
                </div>
              )}
              {selectedRecord.notes && (
                <div className="detail-section">
                  <strong>Notes:</strong>
                  <p>{selectedRecord.notes}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientDashboard;