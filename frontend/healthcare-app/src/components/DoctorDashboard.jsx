import React, { useState, useEffect } from "react";
import { User, Calendar, FileText, Users, Activity, Plus, Search, Bell, Settings, LogOut, MessageCircle, X } from "lucide-react";
import AIChatbot from "./AIChatbot";

function DoctorDashboard({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState("overview");
  const [showChatbot, setShowChatbot] = useState(false);
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [showAddPatient, setShowAddPatient] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [newPatient, setNewPatient] = useState({
    name: '',
    age: '',
    email: '',
    phone: '',
    condition: '',
    bloodType: '',
    allergies: ''
  });

  useEffect(() => {
    loadDoctorData();
  }, [user.id]);

  const loadDoctorData = () => {
    const savedPatients = JSON.parse(localStorage.getItem(`patients_${user.id}`) || '[]');
    const allAppointments = JSON.parse(localStorage.getItem('appointments') || '[]');
    
    // Get all appointments for all patients
    const doctorAppointments = allAppointments.filter(apt => apt.doctorName === user.name);
    
    setPatients(savedPatients);
    setAppointments(doctorAppointments);
  };

  const handleAddPatient = (e) => {
    e.preventDefault();
    const patient = {
      id: Date.now(),
      ...newPatient,
      doctorId: user.id,
      addedDate: new Date().toISOString(),
      lastVisit: new Date().toLocaleDateString()
    };
    
    const updatedPatients = [...patients, patient];
    setPatients(updatedPatients);
    localStorage.setItem(`patients_${user.id}`, JSON.stringify(updatedPatients));
    
    setShowAddPatient(false);
    setNewPatient({ name: '', age: '', email: '', phone: '', condition: '', bloodType: '', allergies: '' });
  };

  const filteredPatients = patients.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.condition?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const todayAppointments = appointments.filter(apt => {
    const today = new Date().toLocaleDateString();
    return new Date(apt.date).toLocaleDateString() === today;
  });

  const pendingAppointments = appointments.filter(apt => apt.status === 'pending');

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b px-6 py-4 shadow-sm">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-blue-600">🏥 Healthcare</h1>
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
              Doctor Portal
            </span>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => setShowChatbot(true)} className="p-2 hover:bg-blue-50 rounded-lg text-blue-600 relative">
              <MessageCircle className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full"></span>
            </button>
            <div className="relative">
              <Bell className="h-5 w-5 text-gray-600 cursor-pointer" />
              {pendingAppointments.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
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
              <span className="text-2xl">{user.avatar}</span>
              <button onClick={onLogout} className="text-gray-600 hover:text-red-600 transition-colors">
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex gap-6">
          <aside className="w-64 bg-white rounded-lg border shadow-sm p-4">
            <nav className="space-y-2">
              {[
                { id: 'overview', label: 'Overview', icon: Activity },
                { id: 'appointments', label: 'Appointments', icon: Calendar },
                { id: 'patients', label: 'Patients', icon: Users },
                { id: 'records', label: 'Records', icon: FileText },
              ].map(item => {
                const Icon = item.icon;
                return (
                  <button key={item.id} onClick={() => setActiveTab(item.id)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${activeTab === item.id ? 'bg-blue-50 text-blue-600 font-medium' : 'hover:bg-gray-50 text-gray-700'}`}>
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
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg border border-blue-200 shadow-sm">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-blue-700 text-sm font-medium">Today's Appointments</p>
                        <p className="text-3xl font-bold text-blue-900">{todayAppointments.length}</p>
                      </div>
                      <Calendar className="h-8 w-8 text-blue-600" />
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg border border-green-200 shadow-sm">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-green-700 text-sm font-medium">Total Patients</p>
                        <p className="text-3xl font-bold text-green-900">{patients.length}</p>
                      </div>
                      <Users className="h-8 w-8 text-green-600" />
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-lg border border-orange-200 shadow-sm">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-orange-700 text-sm font-medium">Pending Requests</p>
                        <p className="text-3xl font-bold text-orange-900">{pendingAppointments.length}</p>
                      </div>
                      <FileText className="h-8 w-8 text-orange-600" />
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-lg border border-purple-200 shadow-sm">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-purple-700 text-sm font-medium">Total Appointments</p>
                        <p className="text-3xl font-bold text-purple-900">{appointments.length}</p>
                      </div>
                      <Activity className="h-8 w-8 text-purple-600" />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-white rounded-lg border shadow-sm p-6">
                    <h3 className="text-lg font-semibold mb-4">Today's Schedule</h3>
                    {todayAppointments.length > 0 ? (
                      todayAppointments.slice(0, 5).map(apt => (
                        <div key={apt.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg mb-2 border">
                          <div>
                            <p className="font-medium">{apt.patientName}</p>
                            <p className="text-sm text-gray-600">{apt.specialty}</p>
                            <p className="text-xs text-gray-500">{apt.time}</p>
                          </div>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            apt.status === 'confirmed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {apt.status}
                          </span>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <Calendar className="w-12 h-12 mx-auto mb-2 opacity-30" />
                        <p>No appointments today</p>
                      </div>
                    )}
                  </div>

                  <div className="bg-white rounded-lg border shadow-sm p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold">Recent Patients</h3>
                      <button onClick={() => setShowAddPatient(true)} className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1">
                        <Plus className="w-4 h-4" />
                        Add Patient
                      </button>
                    </div>
                    {patients.length > 0 ? (
                      patients.slice(0, 5).map(patient => (
                        <div key={patient.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg mb-2 border">
                          <div>
                            <p className="font-medium">{patient.name}</p>
                            <p className="text-sm text-gray-600">{patient.condition || 'General Checkup'}</p>
                          </div>
                          <p className="text-xs text-gray-500">{patient.lastVisit}</p>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <Users className="w-12 h-12 mx-auto mb-2 opacity-30" />
                        <p className="mb-2">No patients yet</p>
                        <button onClick={() => setShowAddPatient(true)} className="text-blue-600 hover:text-blue-700">
                          Add your first patient
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'appointments' && (
              <div className="bg-white rounded-lg border shadow-sm">
                <div className="p-6 border-b">
                  <h2 className="text-xl font-semibold">All Appointments</h2>
                </div>
                <div className="p-6">
                  {appointments.length > 0 ? (
                    appointments.map(apt => (
                      <div key={apt.id} className="border rounded-lg p-4 mb-4 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-semibold text-lg">{apt.patientName}</h4>
                            <p className="text-gray-600">{apt.specialty}</p>
                            <p className="text-sm text-gray-500 mt-1">📅 {apt.date} at {apt.time}</p>
                            {apt.reason && <p className="text-sm text-gray-600 mt-2">Reason: {apt.reason}</p>}
                          </div>
                          <span className={`px-3 py-1 text-sm rounded-full ${
                            apt.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                            apt.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {apt.status}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                      <p className="text-gray-500">No appointments scheduled</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'patients' && (
              <div className="bg-white rounded-lg border shadow-sm">
                <div className="p-6 border-b">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold">Patient Management</h2>
                    <button onClick={() => setShowAddPatient(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2">
                      <Plus className="w-4 h-4" />
                      Add Patient
                    </button>
                  </div>
                  <div className="mt-4">
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
                </div>
                <div className="p-6">
                  {filteredPatients.length > 0 ? (
                    filteredPatients.map(patient => (
                      <div key={patient.id} className="border rounded-lg p-4 mb-4 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h4 className="font-semibold text-lg">{patient.name}</h4>
                            <div className="grid grid-cols-2 gap-4 mt-2">
                              <div>
                                <p className="text-sm text-gray-600">Age: {patient.age}</p>
                                <p className="text-sm text-gray-600">Condition: {patient.condition || 'N/A'}</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-600">Blood Type: {patient.bloodType || 'N/A'}</p>
                                <p className="text-sm text-gray-600">Last Visit: {patient.lastVisit}</p>
                              </div>
                            </div>
                            {patient.allergies && (
                              <p className="text-sm text-red-600 mt-2">⚠️ Allergies: {patient.allergies}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <Users className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                      <p className="text-gray-500 mb-4">
                        {searchTerm ? 'No patients found' : 'No patients added yet'}
                      </p>
                      {!searchTerm && (
                        <button onClick={() => setShowAddPatient(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg">
                          Add Your First Patient
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'records' && (
              <div className="bg-white rounded-lg border shadow-sm p-6">
                <h2 className="text-xl font-semibold mb-4">Medical Records</h2>
                <div className="text-center py-12">
                  <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-gray-500">Records management system coming soon</p>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>

      {showAddPatient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Add New Patient</h3>
              <button onClick={() => setShowAddPatient(false)} className="text-gray-500 hover:text-gray-700">
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleAddPatient} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Full Name *</label>
                  <input type="text" required value={newPatient.name} onChange={(e) => setNewPatient({...newPatient, name: e.target.value})} className="w-full border rounded-lg px-3 py-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Age *</label>
                  <input type="number" required value={newPatient.age} onChange={(e) => setNewPatient({...newPatient, age: e.target.value})} className="w-full border rounded-lg px-3 py-2" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Email *</label>
                  <input type="email" required value={newPatient.email} onChange={(e) => setNewPatient({...newPatient, email: e.target.value})} className="w-full border rounded-lg px-3 py-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Phone</label>
                  <input type="tel" value={newPatient.phone} onChange={(e) => setNewPatient({...newPatient, phone: e.target.value})} className="w-full border rounded-lg px-3 py-2" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Blood Type</label>
                  <select value={newPatient.bloodType} onChange={(e) => setNewPatient({...newPatient, bloodType: e.target.value})} className="w-full border rounded-lg px-3 py-2">
                    <option value="">Select</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Condition/Diagnosis</label>
                  <input type="text" value={newPatient.condition} onChange={(e) => setNewPatient({...newPatient, condition: e.target.value})} className="w-full border rounded-lg px-3 py-2" placeholder="e.g., Hypertension" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Allergies</label>
                <input type="text" value={newPatient.allergies} onChange={(e) => setNewPatient({...newPatient, allergies: e.target.value})} className="w-full border rounded-lg px-3 py-2" placeholder="e.g., Penicillin, Peanuts" />
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setShowAddPatient(false)} className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50">
                  Cancel
                </button>
                <button type="submit" className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
                  Add Patient
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <AIChatbot isOpen={showChatbot} onClose={() => setShowChatbot(false)} userRole="doctor" />
    </div>
  );
}

export default DoctorDashboard;