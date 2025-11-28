import React, { useState, useEffect } from "react";
import { User, Calendar, FileText, Activity, Bell, Settings, LogOut, MessageCircle, AlertCircle, Plus, Clock, Search, X } from "lucide-react";
import AIChatbot from "./AIChatbot";
import EmergencyModal from "./EmergencyModal";
import MedicalRecordViewer from "./MedicalRecordViewer";
import { appointmentAPI, doctorAPI, recordAPI } from "../services/api";
import { SPECIALTIES } from "../utils/constants";

function PatientDashboard({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState("overview");
  const [showChatbot, setShowChatbot] = useState(false);
  const [showEmergency, setShowEmergency] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [records, setRecords] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [showBooking, setShowBooking] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [bookingForm, setBookingForm] = useState({
    doctorId: '',
    specialty: '',
    date: '',
    time: '',
    reason: '',
    symptoms: ''
  });
  const [filterSpecialty, setFilterSpecialty] = useState('');
  const [searchDoctor, setSearchDoctor] = useState('');

  useEffect(() => {
    loadUserData();
    loadDoctors();
  }, []);

  const loadUserData = async () => {
    try {
      const [appointmentsRes, recordsRes] = await Promise.all([
        appointmentAPI.getMyAppointments(),
        recordAPI.getMyRecords()
      ]);
      
      if (appointmentsRes.data.success) {
        setAppointments(appointmentsRes.data.appointments);
      }
      
      if (recordsRes.data.success) {
        setRecords(recordsRes.data.records);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const loadDoctors = async () => {
    try {
      const response = await doctorAPI.getAllDoctors({ available: true });
      if (response.data.success) {
        setDoctors(response.data.doctors);
      }
    } catch (error) {
      console.error('Error loading doctors:', error);
    }
  };

  const handleBookAppointment = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const selectedDoctor = doctors.find(d => d._id === bookingForm.doctorId);
      const symptomsArray = bookingForm.symptoms ? bookingForm.symptoms.split(',').map(s => s.trim()) : [];
      
      const response = await appointmentAPI.create({
        doctorId: bookingForm.doctorId,
        date: bookingForm.date,
        time: bookingForm.time,
        reason: bookingForm.reason,
        symptoms: symptomsArray,
        specialty: selectedDoctor?.specialty || bookingForm.specialty
      });

      if (response.data.success) {
        setAppointments([response.data.appointment, ...appointments]);
        setShowBooking(false);
        setBookingForm({ doctorId: '', specialty: '', date: '', time: '', reason: '', symptoms: '' });
        alert('Appointment booked successfully! Waiting for doctor confirmation.');
      }
    } catch (error) {
      console.error('Booking error:', error);
      alert(error.response?.data?.message || 'Failed to book appointment');
    } finally {
      setLoading(false);
    }
  };

  const cancelAppointment = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) return;

    try {
      const response = await appointmentAPI.cancel(id, 'Patient cancelled');
      if (response.data.success) {
        setAppointments(appointments.map(apt => 
          apt._id === id ? response.data.appointment : apt
        ));
        alert('Appointment cancelled successfully');
      }
    } catch (error) {
      console.error('Cancel error:', error);
      alert('Failed to cancel appointment');
    }
  };

  const upcomingAppointments = appointments.filter(apt => 
    apt.status === 'pending' || apt.status === 'confirmed'
  );

  const filteredDoctors = doctors.filter(doc => {
    const matchesSpecialty = !filterSpecialty || doc.specialty === filterSpecialty;
    const matchesSearch = !searchDoctor || 
      doc.userId?.name.toLowerCase().includes(searchDoctor.toLowerCase()) ||
      doc.specialty.toLowerCase().includes(searchDoctor.toLowerCase());
    return matchesSpecialty && matchesSearch;
  });

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-green-100 text-green-800',
      completed: 'bg-blue-100 text-blue-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white border-b px-6 py-4 sticky top-0 z-30 shadow-sm">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              🏥 HealthCare
            </h1>
            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
              Patient Portal
            </span>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setShowChatbot(true)} 
              className="p-2 hover:bg-blue-50 rounded-lg text-blue-600 relative transition-colors"
            >
              <MessageCircle className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
            </button>
            <button 
              onClick={() => setShowEmergency(true)} 
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg flex items-center gap-2 text-sm font-medium transition-colors"
            >
              <AlertCircle className="h-4 w-4 animate-pulse" />
              Emergency
            </button>
            <Bell className="h-5 w-5 text-gray-600 cursor-pointer hover:text-gray-900 transition-colors" />
            <Settings className="h-5 w-5 text-gray-600 cursor-pointer hover:text-gray-900 transition-colors" />
            <div className="flex items-center gap-3 border-l pl-4">
              <div className="text-right">
                <p className="font-medium text-sm">{user.name}</p>
                <p className="text-xs text-gray-500">Patient</p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <button 
                onClick={onLogout} 
                className="text-gray-600 hover:text-red-600 transition-colors"
                title="Logout"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex gap-6">
          {/* Sidebar */}
          <aside className="w-64 bg-white rounded-xl border shadow-sm p-4 sticky top-24 h-fit">
            <nav className="space-y-2">
              {[
                { id: 'overview', label: 'Overview', icon: Activity },
                { id: 'appointments', label: 'My Appointments', icon: Calendar },
                { id: 'doctors', label: 'Find Doctors', icon: User },
                { id: 'records', label: 'Medical Records', icon: FileText },
                { id: 'profile', label: 'My Profile', icon: User },
              ].map(item => {
                const Icon = item.icon;
                return (
                  <button 
                    key={item.id} 
                    onClick={() => setActiveTab(item.id)} 
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all ${
                      activeTab === item.id 
                        ? 'bg-gradient-to-r from-green-50 to-blue-50 text-green-700 font-medium shadow-sm' 
                        : 'hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    {item.label}
                  </button>
                );
              })}
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border border-green-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-green-700 text-sm font-medium">Next Appointment</p>
                        {upcomingAppointments.length > 0 ? (
                          <>
                            <p className="text-lg font-semibold text-green-900 mt-1">
                              {new Date(upcomingAppointments[0].date).toLocaleDateString()}
                            </p>
                            <p className="text-sm text-green-700">{upcomingAppointments[0].doctorName}</p>
                          </>
                        ) : (
                          <p className="text-gray-500 text-sm mt-2">No upcoming appointments</p>
                        )}
                      </div>
                      <Calendar className="h-10 w-10 text-green-600 opacity-80" />
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-blue-700 text-sm font-medium">Total Appointments</p>
                        <p className="text-3xl font-bold text-blue-900 mt-1">{appointments.length}</p>
                      </div>
                      <Clock className="h-10 w-10 text-blue-600 opacity-80" />
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-purple-700 text-sm font-medium">Medical Records</p>
                        <p className="text-3xl font-bold text-purple-900 mt-1">{records.length}</p>
                      </div>
                      <FileText className="h-10 w-10 text-purple-600 opacity-80" />
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-white rounded-xl border shadow-sm p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold">Upcoming Appointments</h3>
                      <button 
                        onClick={() => setShowBooking(true)} 
                        className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1 font-medium"
                      >
                        <Plus className="w-4 h-4" />
                        Book New
                      </button>
                    </div>
                    {upcomingAppointments.length > 0 ? (
                      <div className="space-y-3">
                        {upcomingAppointments.slice(0, 3).map(apt => (
                          <div key={apt._id} className="p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-2">
                              <div className="flex-1">
                                <p className="font-semibold text-gray-900">{apt.doctorName}</p>
                                <p className="text-sm text-gray-600">{apt.specialty}</p>
                                <p className="text-sm text-gray-500 mt-1">
                                  📅 {new Date(apt.date).toLocaleDateString()} at {apt.time}
                                </p>
                              </div>
                              <span className={`px-3 py-1 text-xs rounded-full font-medium ${getStatusColor(apt.status)}`}>
                                {apt.status}
                              </span>
                            </div>
                            {apt.reason && (
                              <p className="text-sm text-gray-600 mt-2">
                                <span className="font-medium">Reason:</span> {apt.reason}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                        <p className="text-gray-500 mb-4">No upcoming appointments</p>
                        <button 
                          onClick={() => setShowBooking(true)} 
                          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                        >
                          Book Your First Appointment
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="bg-white rounded-xl border shadow-sm p-6">
                    <h3 className="text-lg font-semibold mb-4">Health Tips</h3>
                    <div className="space-y-3">
                      <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
                        <p className="font-semibold text-blue-900 mb-1">💧 Stay Hydrated</p>
                        <p className="text-sm text-blue-700">Drink at least 8 glasses of water daily for optimal health</p>
                      </div>
                      <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-100">
                        <p className="font-semibold text-green-900 mb-1">🏃 Exercise Regularly</p>
                        <p className="text-sm text-green-700">30 minutes of physical activity daily keeps you fit</p>
                      </div>
                      <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-100">
                        <p className="font-semibold text-purple-900 mb-1">😴 Get Enough Sleep</p>
                        <p className="text-sm text-purple-700">7-9 hours of quality sleep every night is essential</p>
                      </div>
                      <div className="p-4 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg border border-orange-100">
                        <p className="font-semibold text-orange-900 mb-1">🥗 Balanced Diet</p>
                        <p className="text-sm text-orange-700">Eat a variety of fruits, vegetables, and whole grains</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Appointments Tab */}
            {activeTab === 'appointments' && (
              <div className="bg-white rounded-xl border shadow-sm">
                <div className="p-6 border-b flex justify-between items-center">
                  <div>
                    <h2 className="text-xl font-semibold">My Appointments</h2>
                    <p className="text-sm text-gray-500 mt-1">Manage all your medical appointments</p>
                  </div>
                  <button 
                    onClick={() => setShowBooking(true)} 
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 font-medium transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                    Book Appointment
                  </button>
                </div>
                <div className="p-6">
                  {appointments.length > 0 ? (
                    <div className="space-y-4">
                      {appointments.map(apt => (
                        <div key={apt._id} className="border rounded-xl p-5 hover:shadow-md transition-shadow bg-gradient-to-r from-white to-gray-50">
                          <div className="flex justify-between items-start mb-3">
                            <div className="flex-1">
                              <h4 className="font-semibold text-lg text-gray-900">{apt.doctorName}</h4>
                              <p className="text-gray-600 mt-1">{apt.specialty}</p>
                            </div>
                            <span className={`px-4 py-2 text-sm rounded-full font-medium ${getStatusColor(apt.status)}`}>
                              {apt.status.charAt(0).toUpperCase() + apt.status.slice(1)}
                            </span>
                          </div>
                          <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-3">
                            <p>📅 <span className="font-medium">Date:</span> {new Date(apt.date).toLocaleDateString()}</p>
                            <p>🕐 <span className="font-medium">Time:</span> {apt.time}</p>
                          </div>
                          {apt.reason && (
                            <p className="text-sm text-gray-600 mb-3 p-3 bg-blue-50 rounded-lg">
                              <span className="font-medium">Reason:</span> {apt.reason}
                            </p>
                          )}
                          {apt.symptoms && apt.symptoms.length > 0 && (
                            <p className="text-sm text-gray-600 mb-3 p-3 bg-yellow-50 rounded-lg">
                              <span className="font-medium">Symptoms:</span> {apt.symptoms.join(', ')}
                            </p>
                          )}
                          {apt.status === 'pending' && (
                            <button 
                              onClick={() => cancelAppointment(apt._id)} 
                              className="text-sm text-red-600 hover:text-red-700 font-medium"
                            >
                              Cancel Appointment
                            </button>
                          )}
                          {apt.status === 'completed' && apt.diagnosis && (
                            <div className="mt-3 p-3 bg-green-50 rounded-lg">
                              <p className="text-sm font-medium text-green-900">Diagnosis: {apt.diagnosis}</p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-16">
                      <Calendar className="w-20 h-20 mx-auto mb-4 text-gray-300" />
                      <p className="text-gray-500 text-lg mb-6">No appointments yet</p>
                      <button 
                        onClick={() => setShowBooking(true)} 
                        className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-colors"
                      >
                        Book Your First Appointment
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Find Doctors Tab */}
            {activeTab === 'doctors' && (
              <div className="bg-white rounded-xl border shadow-sm">
                <div className="p-6 border-b">
                  <h2 className="text-xl font-semibold mb-4">Find Doctors</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search by name or specialty..."
                        value={searchDoctor}
                        onChange={(e) => setSearchDoctor(e.target.value)}
                        className="w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <select
                      value={filterSpecialty}
                      onChange={(e) => setFilterSpecialty(e.target.value)}
                      className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">All Specialties</option>
                      {SPECIALTIES.map(spec => (
                        <option key={spec} value={spec}>{spec}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="p-6">
                  {filteredDoctors.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {filteredDoctors.map(doctor => (
                        <div key={doctor._id} className="border rounded-xl p-6 hover:shadow-lg transition-all bg-gradient-to-br from-white to-blue-50">
                          <div className="flex items-start gap-4 mb-4">
                            <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                              {doctor.userId?.name?.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold text-lg">{doctor.userId?.name || 'Dr. Unknown'}</h4>
                              <p className="text-blue-600 font-medium">{doctor.specialty}</p>
                              <div className="flex items-center gap-2 mt-2">
                                <span className="text-yellow-500">⭐</span>
                                <span className="text-sm font-medium">{doctor.rating}/5</span>
                                <span className="text-gray-400">•</span>
                                <span className="text-sm text-gray-600">{doctor.experience || 0} years exp</span>
                              </div>
                            </div>
                          </div>
                          {doctor.bio && (
                            <p className="text-sm text-gray-600 mb-4 line-clamp-2">{doctor.bio}</p>
                          )}
                          <div className="flex items-center justify-between">
                            <span className="text-lg font-semibold text-gray-900">₹{doctor.consultationFee || 500}</span>
                            <button 
                              onClick={() => {
                                setBookingForm({ ...bookingForm, doctorId: doctor._id, specialty: doctor.specialty });
                                setShowBooking(true);
                              }}
                              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                            >
                              Book Now
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <User className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                      <p className="text-gray-500">No doctors found</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Medical Records Tab */}
            {activeTab === 'records' && (
              <div className="bg-white rounded-xl border shadow-sm">
                <div className="p-6 border-b">
                  <h2 className="text-xl font-semibold">Medical Records</h2>
                  <p className="text-sm text-gray-500 mt-1">View your complete medical history</p>
                </div>
                <div className="p-6">
                  {records.length > 0 ? (
                    <div className="space-y-4">
                      {records.map(record => (
                        <div 
                          key={record._id} 
                          className="border rounded-xl p-5 hover:shadow-md transition-shadow cursor-pointer bg-gradient-to-r from-white to-purple-50"
                          onClick={() => setSelectedRecord(record)}
                        >
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h4 className="font-semibold text-lg text-gray-900">{record.title}</h4>
                              <p className="text-sm text-gray-600 mt-1">{record.recordType.replace('-', ' ').toUpperCase()}</p>
                            </div>
                            <span className="px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full font-medium">
                              {new Date(record.recordDate).toLocaleDateString()}
                            </span>
                          </div>
                          {record.diagnosis && (
                            <p className="text-sm text-gray-700 mb-2">
                              <span className="font-medium">Diagnosis:</span> {record.diagnosis}
                            </p>
                          )}
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Doctor:</span> {record.doctorId?.userId?.name || 'Unknown'}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-16">
                      <FileText className="w-20 h-20 mx-auto mb-4 text-gray-300" />
                      <p className="text-gray-500 text-lg">No medical records available</p>
                      <p className="text-sm text-gray-400 mt-2">Your medical records will appear here after consultations</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="bg-white rounded-xl border shadow-sm p-6">
                <h2 className="text-xl font-semibold mb-6">My Profile</h2>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-3xl">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold">{user.name}</h3>
                      <p className="text-gray-600">{user.email}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Full Name</label>
                      <input type="text" value={user.name} readOnly className="w-full border rounded-lg px-3 py-2 bg-gray-50" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Email</label>
                      <input type="email" value={user.email} readOnly className="w-full border rounded-lg px-3 py-2 bg-gray-50" />
                    </div>
                    {user.age && (
                      <div>
                        <label className="block text-sm font-medium mb-1">Age</label>
                        <input type="text" value={user.age} readOnly className="w-full border rounded-lg px-3 py-2 bg-gray-50" />
                      </div>
                    )}
                    {user.phoneNumber && (
                      <div>
                        <label className="block text-sm font-medium mb-1">Phone</label>
                        <input type="text" value={user.phoneNumber} readOnly className="w-full border rounded-lg px-3 py-2 bg-gray-50" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>

   
      
      {/* Booking Modal */}
      {showBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold">Book Appointment</h3>
              <button 
                onClick={() => setShowBooking(false)} 
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleBookAppointment} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Select Doctor *</label>
                <select
                  required
                  value={bookingForm.doctorId}
                  onChange={(e) => {
                    const selectedDoc = doctors.find(d => d._id === e.target.value);
                    setBookingForm({
                      ...bookingForm,
                      doctorId: e.target.value,
                      specialty: selectedDoc?.specialty || ''
                    });
                  }}
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Choose a doctor</option>
                  {doctors.map(doc => (
                    <option key={doc._id} value={doc._id}>
                      {doc.userId?.name} - {doc.specialty} (₹{doc.consultationFee})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Date *</label>
                  <input
                    type="date"
                    required
                    min={new Date().toISOString().split('T')[0]}
                    value={bookingForm.date}
                    onChange={(e) => setBookingForm({ ...bookingForm, date: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Time *</label>
                  <select
                    required
                    value={bookingForm.time}
                    onChange={(e) => setBookingForm({ ...bookingForm, time: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select time</option>
                    {['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', 
                      '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00'].map(time => (
                      <option key={time} value={time}>{time}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Reason for Visit *</label>
                <textarea
                  required
                  value={bookingForm.reason}
                  onChange={(e) => setBookingForm({ ...bookingForm, reason: e.target.value })}
                  rows="3"
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  placeholder="Describe your health concern..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Symptoms (comma-separated)</label>
                <input
                  type="text"
                  value={bookingForm.symptoms}
                  onChange={(e) => setBookingForm({ ...bookingForm, symptoms: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., fever, headache, cough"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowBooking(false)}
                  className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium disabled:opacity-50"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Booking...
                    </span>
                  ) : (
                    'Book Appointment'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Medical Record Viewer Modal */}
      {selectedRecord && (
        <MedicalRecordViewer 
          record={selectedRecord} 
          onClose={() => setSelectedRecord(null)} 
        />
      )}

      {/* AI Chatbot */}
      <AIChatbot 
        isOpen={showChatbot} 
        onClose={() => setShowChatbot(false)} 
        userRole="patient" 
      />

      {/* Emergency Modal */}
      {showEmergency && (
        <EmergencyModal onClose={() => setShowEmergency(false)} />
      )}
    </div>
  );
}

export default PatientDashboard;
        