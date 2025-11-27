import React, { useState, useEffect } from "react";
import { User, Calendar, FileText, Activity, Bell, Settings, LogOut, MessageCircle, AlertCircle, Plus, Clock } from "lucide-react";
import AIChatbot from "./AIChatbot";
import EmergencyModal from "./EmergencyModal";

function PatientDashboard({ user, isGuest, onLogout }) {
  const [activeTab, setActiveTab] = useState("overview");
  const [showChatbot, setShowChatbot] = useState(false);
  const [showEmergency, setShowEmergency] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [records, setRecords] = useState([]);
  const [showBooking, setShowBooking] = useState(false);
  const [bookingForm, setBookingForm] = useState({
    doctorName: '',
    specialty: '',
    date: '',
    time: '',
    reason: ''
  });

  useEffect(() => {
    loadUserData();
  }, [user.id]);

  const loadUserData = () => {
    const savedAppointments = JSON.parse(localStorage.getItem(`appointments_${user.id}`) || '[]');
    const savedRecords = JSON.parse(localStorage.getItem(`records_${user.id}`) || '[]');
    setAppointments(savedAppointments);
    setRecords(savedRecords);
  };

  const handleBookAppointment = (e) => {
    e.preventDefault();
    const newAppointment = {
      id: Date.now(),
      ...bookingForm,
      patientName: user.name,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    
    const updatedAppointments = [...appointments, newAppointment];
    setAppointments(updatedAppointments);
    localStorage.setItem(`appointments_${user.id}`, JSON.stringify(updatedAppointments));
    
    setShowBooking(false);
    setBookingForm({ doctorName: '', specialty: '', date: '', time: '', reason: '' });
  };

  const cancelAppointment = (id) => {
    const updatedAppointments = appointments.map(apt => 
      apt.id === id ? { ...apt, status: 'cancelled' } : apt
    );
    setAppointments(updatedAppointments);
    localStorage.setItem(`appointments_${user.id}`, JSON.stringify(updatedAppointments));
  };

  const upcomingAppointments = appointments.filter(apt => 
    apt.status === 'pending' || apt.status === 'confirmed'
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b px-6 py-4">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-blue-600">Healthcare</h1>
            <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
              {isGuest ? 'Guest' : 'Patient'} Portal
            </span>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => setShowChatbot(true)} className="p-2 hover:bg-blue-50 rounded-lg text-blue-600 relative">
              <MessageCircle className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full"></span>
            </button>
            <button onClick={() => setShowEmergency(true)} className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg flex items-center gap-2 text-sm">
              <AlertCircle className="h-4 w-4 animate-pulse" />
              Emergency
            </button>
            <Bell className="h-5 w-5 text-gray-600 cursor-pointer" />
            <Settings className="h-5 w-5 text-gray-600 cursor-pointer" />
            <div className="flex items-center gap-2">
              <div className="text-right">
                <p className="font-medium text-sm">{user.name}</p>
                <p className="text-xs text-gray-500">{isGuest ? 'Guest User' : 'Patient'}</p>
              </div>
              <span className="text-2xl">{user.avatar}</span>
              <button onClick={onLogout} className="text-gray-600 hover:text-red-600">
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex gap-6">
          <aside className="w-64 bg-white rounded-lg border p-4">
            <nav className="space-y-2">
              {[
                { id: 'overview', label: 'Overview', icon: Activity },
                { id: 'appointments', label: 'My Appointments', icon: Calendar },
                { id: 'records', label: 'Medical Records', icon: FileText },
                { id: 'profile', label: 'Profile', icon: User },
              ].map(item => {
                const Icon = item.icon;
                return (
                  <button key={item.id} onClick={() => setActiveTab(item.id)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${activeTab === item.id ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'}`}>
                    <Icon className="h-5 w-5" />
                    {item.label}
                  </button>
                );
              })}
            </nav>
          </aside>

          <main className="flex-1">
            {activeTab === 'overview' && (
              <div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg border border-green-200">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-green-700 text-sm font-medium">Next Appointment</p>
                        {upcomingAppointments.length > 0 ? (
                          <>
                            <p className="text-lg font-semibold text-green-900">{upcomingAppointments[0].date}</p>
                            <p className="text-sm text-green-700">{upcomingAppointments[0].doctorName}</p>
                          </>
                        ) : (
                          <p className="text-gray-500 text-sm mt-2">No upcoming appointments</p>
                        )}
                      </div>
                      <Calendar className="h-8 w-8 text-green-600" />
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg border border-blue-200">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-blue-700 text-sm font-medium">Total Appointments</p>
                        <p className="text-3xl font-bold text-blue-900">{appointments.length}</p>
                      </div>
                      <Clock className="h-8 w-8 text-blue-600" />
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-lg border border-purple-200">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-purple-700 text-sm font-medium">Medical Records</p>
                        <p className="text-3xl font-bold text-purple-900">{records.length}</p>
                      </div>
                      <FileText className="h-8 w-8 text-purple-600" />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-white rounded-lg border p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold">Upcoming Appointments</h3>
                      <button onClick={() => setShowBooking(true)} className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1">
                        <Plus className="w-4 h-4" />
                        Book New
                      </button>
                    </div>
                    {upcomingAppointments.length > 0 ? (
                      upcomingAppointments.slice(0, 3).map(apt => (
                        <div key={apt.id} className="p-3 bg-gray-50 rounded-lg mb-2 border">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium">{apt.doctorName}</p>
                              <p className="text-sm text-gray-600">{apt.specialty}</p>
                              <p className="text-sm text-gray-500">{apt.date} at {apt.time}</p>
                            </div>
                            <span className={`px-2 py-1 text-xs rounded ${apt.status === 'confirmed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                              {apt.status}
                            </span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <Calendar className="w-12 h-12 mx-auto mb-2 opacity-30" />
                        <p>No upcoming appointments</p>
                        <button onClick={() => setShowBooking(true)} className="mt-3 text-blue-600 hover:text-blue-700">
                          Book your first appointment
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="bg-white rounded-lg border p-6">
                    <h3 className="text-lg font-semibold mb-4">Health Tips</h3>
                    <div className="space-y-3">
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <p className="font-medium text-blue-900">💧 Stay Hydrated</p>
                        <p className="text-sm text-blue-700">Drink 8 glasses of water daily</p>
                      </div>
                      <div className="p-3 bg-green-50 rounded-lg">
                        <p className="font-medium text-green-900">🏃 Exercise Regularly</p>
                        <p className="text-sm text-green-700">30 minutes of activity daily</p>
                      </div>
                      <div className="p-3 bg-purple-50 rounded-lg">
                        <p className="font-medium text-purple-900">😴 Get Enough Sleep</p>
                        <p className="text-sm text-purple-700">7-9 hours every night</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'appointments' && (
              <div className="bg-white rounded-lg border">
                <div className="p-6 border-b flex justify-between items-center">
                  <h2 className="text-xl font-semibold">My Appointments</h2>
                  <button onClick={() => setShowBooking(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    Book Appointment
                  </button>
                </div>
                <div className="p-6">
                  {appointments.length > 0 ? (
                    appointments.map(apt => (
                      <div key={apt.id} className="border rounded-lg p-4 mb-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-semibold text-lg">{apt.doctorName}</h4>
                            <p className="text-gray-600">{apt.specialty}</p>
                          </div>
                          <span className={`px-3 py-1 text-sm rounded-full ${
                            apt.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                            apt.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {apt.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 mb-2">📅 {apt.date} at {apt.time}</p>
                        {apt.reason && <p className="text-sm text-gray-600 mb-3">Reason: {apt.reason}</p>}
                        {apt.status === 'pending' && (
                          <button onClick={() => cancelAppointment(apt.id)} className="text-sm text-red-600 hover:text-red-700">
                            Cancel Appointment
                          </button>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                      <p className="text-gray-500 mb-4">No appointments yet</p>
                      <button onClick={() => setShowBooking(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg">
                        Book Your First Appointment
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'records' && (
              <div className="bg-white rounded-lg border p-6">
                <h2 className="text-xl font-semibold mb-4">Medical Records</h2>
                {records.length > 0 ? (
                  records.map(rec => (
                    <div key={rec.id} className="border rounded-lg p-4 mb-4">
                      <h4 className="font-semibold">{rec.title}</h4>
                      <p className="text-gray-600 text-sm">{rec.type}</p>
                      <p className="text-sm text-gray-500">{rec.date}</p>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <p className="text-gray-500">No medical records available</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'profile' && (
              <div className="bg-white rounded-lg border p-6">
                <h2 className="text-xl font-semibold mb-6">Profile Settings</h2>
                <div className="space-y-4">
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
                  {isGuest && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <p className="text-yellow-800 text-sm">
                        You're using a guest account. Sign up to save your data permanently.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </main>
        </div>
      </div>

      {showBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Book Appointment</h3>
            <form onSubmit={handleBookAppointment} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Doctor Name *</label>
                <input type="text" required value={bookingForm.doctorName} onChange={(e) => setBookingForm({...bookingForm, doctorName: e.target.value})} className="w-full border rounded-lg px-3 py-2" placeholder="Dr. John Smith" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Specialty *</label>
                <select required value={bookingForm.specialty} onChange={(e) => setBookingForm({...bookingForm, specialty: e.target.value})} className="w-full border rounded-lg px-3 py-2">
                  <option value="">Select Specialty</option>
                  <option value="General Medicine">General Medicine</option>
                  <option value="Cardiology">Cardiology</option>
                  <option value="Pediatrics">Pediatrics</option>
                  <option value="Orthopedics">Orthopedics</option>
                  <option value="Dermatology">Dermatology</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Date *</label>
                <input type="date" required value={bookingForm.date} onChange={(e) => setBookingForm({...bookingForm, date: e.target.value})} min={new Date().toISOString().split('T')[0]} className="w-full border rounded-lg px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Time *</label>
                <input type="time" required value={bookingForm.time} onChange={(e) => setBookingForm({...bookingForm, time: e.target.value})} className="w-full border rounded-lg px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Reason for Visit</label>
                <textarea value={bookingForm.reason} onChange={(e) => setBookingForm({...bookingForm, reason: e.target.value})} className="w-full border rounded-lg px-3 py-2" rows="3" placeholder="Optional: Describe your symptoms or reason"></textarea>
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={() => setShowBooking(false)} className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50">
                  Cancel
                </button>
                <button type="submit" className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
                  Book Appointment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <AIChatbot isOpen={showChatbot} onClose={() => setShowChatbot(false)} userRole="patient" />
      {showEmergency && <EmergencyModal onClose={() => setShowEmergency(false)} />}
    </div>
  );
}

export default PatientDashboard;