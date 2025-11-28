import React, { useState, useEffect } from "react";
import { User, Calendar, FileText, Users, Activity, Plus, Search, Bell, Settings, LogOut, MessageCircle, X, Check, XCircle, Clock } from "lucide-react";
import AIChatbot from "./AIChatbot";
import { appointmentAPI, patientAPI, recordAPI } from "../services/api";
import { SPECIALTIES, BLOOD_TYPES } from "../utils/constants";

function DoctorDashboard({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState("overview");
  const [showChatbot, setShowChatbot] = useState(false);
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [showAddPatient, setShowAddPatient] = useState(false);
  const [showAddRecord, setShowAddRecord] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const [newPatient, setNewPatient] = useState({
    name: '',
    age: '',
    email: '',
    phone: '',
    condition: '',
    bloodType: '',
    allergies: ''
  });

  const [newRecord, setNewRecord] = useState({
    patientId: '',
    recordType: 'diagnosis',
    title: '',
    description: '',
    diagnosis: '',
    treatment: '',
    medications: [],
    vitals: {
      bloodPressure: '',
      heartRate: '',
      temperature: '',
      weight: ''
    }
  });

  useEffect(() => {
    loadDoctorData();
  }, []);

  const loadDoctorData = async () => {
    try {
      setLoading(true);
      
      // Load appointments from API
      const appointmentsRes = await appointmentAPI.getMyAppointments();
      if (appointmentsRes.data.success) {
        setAppointments(appointmentsRes.data.appointments);
      }

      // Load patients from API
      const patientsRes = await patientAPI.getMyPatients();
      if (patientsRes.data.success) {
        setPatients(patientsRes.data.patients);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAppointmentAction = async (appointmentId, action) => {
    try {
      const status = action === 'accept' ? 'confirmed' : 'cancelled';
      const response = await appointmentAPI.updateStatus(appointmentId, { status });
      
      if (response.data.success) {
        setAppointments(appointments.map(apt => 
          apt._id === appointmentId ? response.data.appointment : apt
        ));
        
        alert(`Appointment ${action === 'accept' ? 'accepted' : 'rejected'} successfully!`);
      }
    } catch (error) {
      console.error('Error updating appointment:', error);
      alert('Failed to update appointment');
    }
  };

  const handleAddPatient = async (e) => {
    e.preventDefault();
    try {
      // In a real implementation, you'd call an API to create the patient
      const patient = {
        id: Date.now(),
        ...newPatient,
        doctorId: user.id,
        addedDate: new Date().toISOString(),
        lastVisit: new Date().toLocaleDateString()
      };
      
      setPatients([patient, ...patients]);
      setShowAddPatient(false);
      setNewPatient({ name: '', age: '', email: '', phone: '', condition: '', bloodType: '', allergies: '' });
      
      alert('Patient added successfully!');
    } catch (error) {
      console.error('Error adding patient:', error);
      alert('Failed to add patient');
    }
  };

  const handleCreateRecord = async (e) => {
    e.preventDefault();
    try {
      const response = await recordAPI.create(newRecord);
      
      if (response.data.success) {
        alert('Medical record created successfully!');
        setShowAddRecord(false);
        setNewRecord({
          patientId: '',
          recordType: 'diagnosis',
          title: '',
          description: '',
          diagnosis: '',
          treatment: '',
          medications: [],
          vitals: { bloodPressure: '', heartRate: '', temperature: '', weight: '' }
        });
      }
    } catch (error) {
      console.error('Error creating record:', error);
      alert('Failed to create medical record');
    }
  };

  const filteredPatients = patients.filter(p => 
    p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.condition?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const todayAppointments = appointments.filter(apt => {
    const today = new Date().toLocaleDateString();
    return new Date(apt.date).toLocaleDateString() === today;
  });

  const pendingAppointments = appointments.filter(apt => apt.status === 'pending');
  const confirmedAppointments = appointments.filter(apt => apt.status === 'confirmed');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white border-b px-6 py-4 shadow-sm sticky top-0 z-30">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              🏥 HealthCare Pro
            </h1>
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
              Doctor Portal
            </span>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setShowChatbot(true)} 
              className="p-2 hover:bg-blue-50 rounded-lg text-blue-600 relative"
            >
              <MessageCircle className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
            </button>
            <div className="relative">
              <Bell className="h-5 w-5 text-gray-600 cursor-pointer" />
              {pendingAppointments.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {pendingAppointments.length}
                </span>
              )}
            </div>
            <Settings className="h-5 w-5 text-gray-600 cursor-pointer" />
            <div className="flex items-center gap-3 border-l pl-4">
              <div className="text-right">
                <p className="font-medium text-sm">{user.name}</p>
                <p className="text-xs text-gray-500">{user.specialty}</p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <button onClick={onLogout} className="text-gray-600 hover:text-red-600 transition-colors">
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
                { id: 'appointments', label: 'Appointments', icon: Calendar },
                { id: 'patients', label: 'Patients', icon: Users },
                { id: 'records', label: 'Records', icon: FileText },
              ].map(item => {
                const Icon = item.icon;
                return (
                  <button 
                    key={item.id} 
                    onClick={() => setActiveTab(item.id)} 
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all ${
                      activeTab === item.id 
                        ? 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 font-medium shadow-sm' 
                        : 'hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    {item.label}
                    {item.id === 'appointments' && pendingAppointments.length > 0 && (
                      <span className="ml-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                        {pendingAppointments.length}
                      </span>
                    )}
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
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-blue-700 text-sm font-medium">Today's Appointments</p>
                        <p className="text-3xl font-bold text-blue-900 mt-2">{todayAppointments.length}</p>
                        <p className="text-xs text-blue-600 mt-1">
                          {confirmedAppointments.filter(apt => 
                            new Date(apt.date).toLocaleDateString() === new Date().toLocaleDateString()
                          ).length} confirmed
                        </p>
                      </div>
                      <Calendar className="h-10 w-10 text-blue-600 opacity-80" />
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border border-green-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-green-700 text-sm font-medium">Total Patients</p>
                        <p className="text-3xl font-bold text-green-900 mt-2">{patients.length}</p>
                        <p className="text-xs text-green-600 mt-1">Active patients</p>
                      </div>
                      <Users className="h-10 w-10 text-green-600 opacity-80" />
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-xl border border-orange-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-orange-700 text-sm font-medium">Pending Requests</p>
                        <p className="text-3xl font-bold text-orange-900 mt-2">{pendingAppointments.length}</p>
                        <p className="text-xs text-orange-600 mt-1">Awaiting response</p>
                      </div>
                      <Clock className="h-10 w-10 text-orange-600 opacity-80" />
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-purple-700 text-sm font-medium">Total Appointments</p>
                        <p className="text-3xl font-bold text-purple-900 mt-2">{appointments.length}</p>
                        <p className="text-xs text-purple-600 mt-1">All time</p>
                      </div>
                      <Activity className="h-10 w-10 text-purple-600 opacity-80" />
                    </div>
                  </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Pending Requests */}
                  <div className="bg-white rounded-xl border shadow-sm">
                    <div className="p-6 border-b">
                      <h3 className="text-lg font-semibold text-gray-900">Pending Appointment Requests</h3>
                      <p className="text-sm text-gray-500 mt-1">Review and respond to patient requests</p>
                    </div>
                    <div className="p-6 max-h-96 overflow-y-auto">
                      {pendingAppointments.length > 0 ? (
                        <div className="space-y-3">
                          {pendingAppointments.map(apt => (
                            <div key={apt._id} className="p-4 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg border border-orange-200">
                              <div className="flex justify-between items-start mb-3">
                                <div>
                                  <p className="font-semibold text-gray-900">{apt.patientName}</p>
                                  <p className="text-sm text-gray-600">{apt.specialty}</p>
                                  <p className="text-xs text-gray-500 mt-1">
                                    📅 {new Date(apt.date).toLocaleDateString()} at {apt.time}
                                  </p>
                                </div>
                                <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full font-medium">
                                  Pending
                                </span>
                              </div>
                              {apt.reason && (
                                <p className="text-sm text-gray-700 mb-3 p-2 bg-white rounded">
                                  <span className="font-medium">Reason:</span> {apt.reason}
                                </p>
                              )}
                              {apt.symptoms && apt.symptoms.length > 0 && (
                                <p className="text-sm text-gray-600 mb-3">
                                  <span className="font-medium">Symptoms:</span> {apt.symptoms.join(', ')}
                                </p>
                              )}
                              <div className="flex gap-2 mt-3">
                                <button
                                  onClick={() => handleAppointmentAction(apt._id, 'accept')}
                                  className="flex-1 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg flex items-center justify-center gap-2 text-sm font-medium"
                                >
                                  <Check className="w-4 h-4" />
                                  Accept
                                </button>
                                <button
                                  onClick={() => handleAppointmentAction(apt._id, 'reject')}
                                  className="flex-1 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg flex items-center justify-center gap-2 text-sm font-medium"
                                >
                                  <XCircle className="w-4 h-4" />
                                  Reject
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <Clock className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                          <p className="text-gray-500">No pending requests</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Today's Schedule */}
                  <div className="bg-white rounded-xl border shadow-sm">
                    <div className="p-6 border-b">
                      <h3 className="text-lg font-semibold text-gray-900">Today's Schedule</h3>
                      <p className="text-sm text-gray-500 mt-1">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
                    </div>
                    <div className="p-6 max-h-96 overflow-y-auto">
                      {todayAppointments.length > 0 ? (
                        <div className="space-y-3">
                          {todayAppointments.map(apt => (
                            <div key={apt._id} className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                              <div className="flex justify-between items-start">
                                <div className="flex-1">
                                  <p className="font-semibold text-gray-900">{apt.patientName}</p>
                                  <p className="text-sm text-gray-600">{apt.specialty}</p>
                                  <p className="text-xs text-gray-500 mt-1">🕐 {apt.time}</p>
                                </div>
                                <span className={`px-3 py-1 text-xs rounded-full font-medium ${
                                  apt.status === 'confirmed' ? 'bg-green-100 text-green-800' : 
                                  apt.status === 'completed' ? 'bg-blue-100 text-blue-800' : 
                                  'bg-yellow-100 text-yellow-800'
                                }`}>
                                  {apt.status}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                          <p className="text-gray-500">No appointments today</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Recent Patients */}
                <div className="bg-white rounded-xl border shadow-sm">
                  <div className="p-6 border-b flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-semibold">Recent Patients</h3>
                      <p className="text-sm text-gray-500 mt-1">Quickly access patient information</p>
                    </div>
                    <button 
                      onClick={() => setShowAddPatient(true)} 
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium"
                    >
                      <Plus className="w-4 h-4" />
                      Add Patient
                    </button>
                  </div>
                  <div className="p-6">
                    {patients.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {patients.slice(0, 6).map(patient => (
                          <div key={patient.id} className="p-4 bg-gradient-to-br from-gray-50 to-blue-50 rounded-lg border hover:shadow-md transition-shadow cursor-pointer">
                            <div className="flex items-center gap-3 mb-2">
                              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold">
                                {patient.name?.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <p className="font-semibold text-gray-900">{patient.name}</p>
                                <p className="text-xs text-gray-500">Age: {patient.age}</p>
                              </div>
                            </div>
                            <p className="text-sm text-gray-600">{patient.condition || 'General Checkup'}</p>
                            <p className="text-xs text-gray-400 mt-2">Last visit: {patient.lastVisit}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <Users className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                        <p className="text-gray-500 mb-4">No patients yet</p>
                        <button 
                          onClick={() => setShowAddPatient(true)} 
                          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium"
                        >
                          Add Your First Patient
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Appointments Tab */}
            {activeTab === 'appointments' && (
              <div className="bg-white rounded-xl border shadow-sm">
                <div className="p-6 border-b">
                  <h2 className="text-xl font-semibold">All Appointments</h2>
                  <p className="text-sm text-gray-500 mt-1">Manage and track all patient appointments</p>
                </div>
                <div className="p-6">
                  {loading ? (
                    <div className="text-center py-12">
                      <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                      <p className="text-gray-500">Loading appointments...</p>
                    </div>
                  ) : appointments.length > 0 ? (
                    <div className="space-y-4">
                      {appointments.map(apt => (
                        <div key={apt._id} className="border rounded-xl p-5 hover:shadow-md transition-shadow bg-gradient-to-r from-white to-gray-50">
                          <div className="flex justify-between items-start mb-3">
                            <div className="flex-1">
                              <h4 className="font-semibold text-lg text-gray-900">{apt.patientName}</h4>
                              <p className="text-gray-600">{apt.specialty}</p>
                            </div>
                            <span className={`px-4 py-2 text-sm rounded-full font-medium ${
                              apt.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                              apt.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                              apt.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {apt.status.charAt(0).toUpperCase() + apt.status.slice(1)}
                            </span>
                          </div>
                          <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-3">
                            <p>📅 <span className="font-medium">Date:</span> {new Date(apt.date).toLocaleDateString()}</p>
                            <p>🕐 <span className="font-medium">Time:</span> {apt.time}</p>
                          </div>
                          {apt.reason && (
                            <p className="text-sm text-gray-600 mb-2 p-3 bg-blue-50 rounded-lg">
                              <span className="font-medium">Reason:</span> {apt.reason}
                            </p>
                          )}
                          {apt.status === 'pending' && (
                            <div className="flex gap-2 mt-3">
<button
onClick={() => handleAppointmentAction(apt._id, 'accept')}
className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 font-medium"
>
<Check className="w-4 h-4" />
Accept
</button>
<button
onClick={() => handleAppointmentAction(apt._id, 'reject')}
className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 font-medium"
>
<XCircle className="w-4 h-4" />
Reject
</button>
</div>
)}
</div>
))}
</div>
) : (
<div className="text-center py-16">
<Calendar className="w-20 h-20 mx-auto mb-4 text-gray-300" />
<p className="text-gray-500 text-lg">No appointments scheduled</p>
</div>
)}
</div>
</div>
)}{/* Patients Tab */}
{activeTab === 'patients' && (
  <div className="bg-white rounded-xl border shadow-sm">
    <div className="p-6 border-b">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-xl font-semibold">Patient Management</h2>
          <p className="text-sm text-gray-500 mt-1">View and manage your patients</p>
        </div>
        <button 
          onClick={() => setShowAddPatient(true)} 
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium"
        >
          <Plus className="w-4 h-4" />
          Add Patient
        </button>
      </div>
      <div className="relative">
        <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search patients..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>
    <div className="p-6">
      {filteredPatients.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {filteredPatients.map(patient => (
            <div 
              key={patient.id} 
              className="border rounded-xl p-5 hover:shadow-md transition-shadow bg-gradient-to-r from-white to-blue-50"
            >
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                  {patient.name?.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-semibold text-lg text-gray-900">{patient.name}</h4>
                      <p className="text-sm text-gray-600">
                        {patient.age} years • {patient.bloodType || 'Blood type not specified'}
                      </p>
                    </div>
                    <button
                      onClick={() => setSelectedPatient(patient)}
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
                      View Details
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-3">
                    <div>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Condition:</span> {patient.condition || 'N/A'}
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Email:</span> {patient.email}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Phone:</span> {patient.phone || 'N/A'}
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Last Visit:</span> {patient.lastVisit}
                      </p>
                    </div>
                  </div>
                  {patient.allergies && (
                    <p className="text-sm text-red-600 mt-3 p-2 bg-red-50 rounded">
                      ⚠️ <span className="font-medium">Allergies:</span> {patient.allergies}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <Users className="w-20 h-20 mx-auto mb-4 text-gray-300" />
          <p className="text-gray-500 text-lg mb-4">
            {searchTerm ? 'No patients found' : 'No patients added yet'}
          </p>
          {!searchTerm && (
            <button 
              onClick={() => setShowAddPatient(true)} 
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium"
            >
              Add Your First Patient
            </button>
          )}
        </div>
      )}
    </div>
  </div>
)}

{/* Records Tab */}
{activeTab === 'records' && (
  <div className="bg-white rounded-xl border shadow-sm">
    <div className="p-6 border-b flex justify-between items-center">
      <div>
        <h2 className="text-xl font-semibold">Medical Records</h2>
        <p className="text-sm text-gray-500 mt-1">Create and manage patient medical records</p>
      </div>
      <button
        onClick={() => setShowAddRecord(true)}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium"
      >
        <Plus className="w-4 h-4" />
        Create Record
      </button>
    </div>
    <div className="p-6">
      <div className="text-center py-16">
        <FileText className="w-20 h-20 mx-auto mb-4 text-gray-300" />
        <p className="text-gray-500 text-lg mb-4">Medical records will appear here</p>
        <button
          onClick={() => setShowAddRecord(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium"
        >
          Create Your First Record
        </button>
      </div>
    </div>
  </div>
)}
</main>
</div>
</div>

{/* Add Patient Modal */}
{showAddPatient && (
<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
<div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
<div className="flex justify-between items-center mb-6">
  <h3 className="text-2xl font-bold">Add New Patient</h3>
  <button 
    onClick={() => setShowAddPatient(false)} 
    className="text-gray-500 hover:text-gray-700"
  >
    <X className="w-6 h-6" />
  </button>
</div>

<form onSubmit={handleAddPatient} className="space-y-4">
  <div className="grid grid-cols-2 gap-4">
    <div>
      <label className="block text-sm font-medium mb-1">Full Name *</label>
      <input 
        type="text" 
        required 
        value={newPatient.name} 
        onChange={(e) => setNewPatient({...newPatient, name: e.target.value})} 
        className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500" 
      />
    </div>
    <div>
      <label className="block text-sm font-medium mb-1">Age *</label>
      <input 
        type="number" 
        required 
        value={newPatient.age} 
        onChange={(e) => setNewPatient({...newPatient, age: e.target.value})} 
        className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500" 
      />
    </div>
  </div>
  
  <div className="grid grid-cols-2 gap-4">
    <div>
      <label className="block text-sm font-medium mb-1">Email *</label>
      <input 
        type="email" 
        required 
        value={newPatient.email} 
        onChange={(e) => setNewPatient({...newPatient, email: e.target.value})} 
        className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500" 
      />
    </div>
    <div>
      <label className="block text-sm font-medium mb-1">Phone</label>
      <input 
        type="tel" 
        value={newPatient.phone} 
        onChange={(e) => setNewPatient({...newPatient, phone: e.target.value})} 
        className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500" 
      />
    </div>
  </div>
  
  <div className="grid grid-cols-2 gap-4">
    <div>
      <label className="block text-sm font-medium mb-1">Blood Type</label>
      <select 
        value={newPatient.bloodType} 
        onChange={(e) => setNewPatient({...newPatient, bloodType: e.target.value})} 
        className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
      >
        <option value="">Select</option>
        {BLOOD_TYPES.map(type => (
          <option key={type} value={type}>{type}</option>
        ))}
      </select>
    </div>
    <div>
      <label className="block text-sm font-medium mb-1">Condition/Diagnosis</label>
      <input 
        type="text" 
        value={newPatient.condition} 
        onChange={(e) => setNewPatient({...newPatient, condition: e.target.value})} 
        className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500" 
        placeholder="e.g., Hypertension" 
      />
    </div>
  </div>
  
  <div>
    <label className="block text-sm font-medium mb-1">Allergies</label>
    <input 
      type="text" 
      value={newPatient.allergies} 
      onChange={(e) => setNewPatient({...newPatient, allergies: e.target.value})} 
      className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500" 
      placeholder="e.g., Penicillin, Peanuts" 
    />
  </div>
  
  <div className="flex gap-3 pt-4">
    <button 
      type="button" 
      onClick={() => setShowAddPatient(false)} 
      className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 font-medium"
    >
      Cancel
    </button>
    <button 
      type="submit" 
      className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-medium"
    >
      Add Patient
    </button>
  </div>
</form>
</div>
</div>
)}

{/* Add Medical Record Modal */}
{showAddRecord && (
<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
<div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
<div className="flex justify-between items-center mb-6">
  <h3 className="text-2xl font-bold">Create Medical Record</h3>
  <button 
    onClick={() => setShowAddRecord(false)} 
    className="text-gray-500 hover:text-gray-700"
  >
    <X className="w-6 h-6" />
  </button>
</div>

<form onSubmit={handleCreateRecord} className="space-y-4">
  <div>
    <label className="block text-sm font-medium mb-1">Patient *</label>
    <select
      required
      value={newRecord.patientId}
      onChange={(e) => setNewRecord({...newRecord, patientId: e.target.value})}
      className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
    >
      <option value="">Select Patient</option>
      {patients.map(patient => (
        <option key={patient.id} value={patient.id}>
          {patient.name} - {patient.age} years
        </option>
      ))}
    </select>
  </div>

  <div className="grid grid-cols-2 gap-4">
    <div>
      <label className="block text-sm font-medium mb-1">Record Type *</label>
      <select
        required
        value={newRecord.recordType}
        onChange={(e) => setNewRecord({...newRecord, recordType: e.target.value})}
        className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
      >
        <option value="diagnosis">Diagnosis</option>
        <option value="prescription">Prescription</option>
        <option value="lab-report">Lab Report</option>
        <option value="imaging">Imaging</option>
        <option value="vaccination">Vaccination</option>
      </select>
    </div>
    <div>
      <label className="block text-sm font-medium mb-1">Title *</label>
      <input
        type="text"
        required
        value={newRecord.title}
        onChange={(e) => setNewRecord({...newRecord, title: e.target.value})}
        className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
        placeholder="e.g., Annual Checkup 2024"
      />
    </div>
  </div>

  <div>
    <label className="block text-sm font-medium mb-1">Description</label>
    <textarea
      value={newRecord.description}
      onChange={(e) => setNewRecord({...newRecord, description: e.target.value})}
      rows="3"
      className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
      placeholder="Detailed description of the examination..."
    />
  </div>

  <div>
    <label className="block text-sm font-medium mb-1">Diagnosis</label>
    <textarea
      value={newRecord.diagnosis}
      onChange={(e) => setNewRecord({...newRecord, diagnosis: e.target.value})}
      rows="2"
      className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
      placeholder="Medical diagnosis..."
    />
  </div>

  <div>
    <label className="block text-sm font-medium mb-1">Treatment Plan</label>
    <textarea
      value={newRecord.treatment}
      onChange={(e) => setNewRecord({...newRecord, treatment: e.target.value})}
      rows="2"
      className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
      placeholder="Recommended treatment..."
    />
  </div>

  <div>
    <label className="block text-sm font-medium mb-3">Vital Signs</label>
    <div className="grid grid-cols-2 gap-4">
      <div>
        <label className="block text-xs text-gray-600 mb-1">Blood Pressure</label>
        <input
          type="text"
          value={newRecord.vitals.bloodPressure}
          onChange={(e) => setNewRecord({
            ...newRecord, 
            vitals: {...newRecord.vitals, bloodPressure: e.target.value}
          })}
          className="w-full border rounded-lg px-3 py-2 text-sm"
          placeholder="120/80"
        />
      </div>
      <div>
        <label className="block text-xs text-gray-600 mb-1">Heart Rate (bpm)</label>
        <input
          type="text"
          value={newRecord.vitals.heartRate}
          onChange={(e) => setNewRecord({
            ...newRecord, 
            vitals: {...newRecord.vitals, heartRate: e.target.value}
          })}
          className="w-full border rounded-lg px-3 py-2 text-sm"
          placeholder="72"
        />
      </div>
      <div>
        <label className="block text-xs text-gray-600 mb-1">Temperature (°F)</label>
        <input
          type="text"
          value={newRecord.vitals.temperature}
          onChange={(e) => setNewRecord({
            ...newRecord, 
            vitals: {...newRecord.vitals, temperature: e.target.value}
          })}
          className="w-full border rounded-lg px-3 py-2 text-sm"
          placeholder="98.6"
        />
      </div>
      <div>
        <label className="block text-xs text-gray-600 mb-1">Weight (kg)</label>
        <input
          type="text"
          value={newRecord.vitals.weight}
          onChange={(e) => setNewRecord({
            ...newRecord, 
            vitals: {...newRecord.vitals, weight: e.target.value}
          })}
          className="w-full border rounded-lg px-3 py-2 text-sm"
          placeholder="70"
        />
      </div>
    </div>
  </div>

  <div className="flex gap-3 pt-4">
    <button 
      type="button" 
      onClick={() => setShowAddRecord(false)} 
      className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 font-medium"
    >
      Cancel
    </button>
    <button 
      type="submit" 
      className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-medium"
    >
      Create Record
    </button>
  </div>
</form>
</div>
</div>
)}

<AIChatbot 
isOpen={showChatbot} 
onClose={() => setShowChatbot(false)} 
userRole="doctor" 
/>
</div>
);
}
export default DoctorDashboard;