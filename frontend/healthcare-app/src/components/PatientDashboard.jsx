import React, { useState } from "react";
import { User, Calendar, FileText, Activity, Plus, Bell, Settings, LogOut, MessageCircle, AlertCircle } from "lucide-react";
import AIChatbot from "./AIChatbot";
import EmergencyModal from "./EmergencyModal";
import { mockAppointments, mockRecords } from "../data/mockData";

function PatientDashboard({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState("overview");
  const [showChatbot, setShowChatbot] = useState(false);
  const [showEmergency, setShowEmergency] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b px-6 py-4">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-blue-600">Healthcare</h1>
            <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">Patient Portal</span>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => setShowChatbot(true)} className="p-2 hover:bg-blue-50 rounded-lg text-blue-600">
              <MessageCircle className="h-5 w-5" />
            </button>
            <button onClick={() => setShowEmergency(true)} className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg flex items-center gap-1">
              <AlertCircle className="h-5 w-5 animate-pulse" />
              <span className="text-sm">Emergency</span>
            </button>
            <Bell className="h-5 w-5 text-gray-600 cursor-pointer" />
            <Settings className="h-5 w-5 text-gray-600 cursor-pointer" />
            <div className="flex items-center gap-2">
              <div className="text-right">
                <p className="font-medium text-sm">{user.name}</p>
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
                  <button key={item.id} onClick={() => setActiveTab(item.id)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left ${activeTab === item.id ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'}`}>
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
                  <div className="bg-green-50 p-6 rounded-lg border">
                    <p className="text-green-600 text-sm font-medium">Next Appointment</p>
                    <p className="text-lg font-semibold">Sep 10, 10:00 AM</p>
                    <p className="text-sm text-green-700">Dr. Smith</p>
                  </div>
                  <div className="bg-blue-50 p-6 rounded-lg border">
                    <p className="text-blue-600 text-sm font-medium">Medical Records</p>
                    <p className="text-3xl font-bold">12</p>
                  </div>
                  <div className="bg-purple-50 p-6 rounded-lg border">
                    <p className="text-purple-600 text-sm font-medium">Health Score</p>
                    <p className="text-3xl font-bold">85</p>
                    <p className="text-sm">Good</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-white rounded-lg border p-6">
                    <h3 className="text-lg font-semibold mb-4">Upcoming Appointments</h3>
                    {mockAppointments.filter(a => a.patient === "John Doe").map(apt => (
                      <div key={apt.id} className="p-3 bg-gray-50 rounded mb-2">
                        <p className="font-medium">Dr. Smith</p>
                        <p className="text-sm text-gray-600">{apt.date} {apt.time}</p>
                      </div>
                    ))}
                  </div>
                  <div className="bg-white rounded-lg border p-6">
                    <h3 className="text-lg font-semibold mb-4">Recent Records</h3>
                    {mockRecords.slice(0, 3).map(rec => (
                      <div key={rec.id} className="p-3 bg-gray-50 rounded mb-2">
                        <p className="font-medium">{rec.title}</p>
                        <p className="text-sm text-gray-600">{rec.date}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            {activeTab === 'appointments' && (
              <div className="bg-white rounded-lg border p-6">
                <h2 className="text-xl font-semibold mb-4">My Appointments</h2>
                {mockAppointments.filter(a => a.patient === "John Doe").map(apt => (
                  <div key={apt.id} className="border rounded-lg p-4 mb-4">
                    <h4 className="font-semibold">Dr. Smith</h4>
                    <p className="text-gray-600">{apt.type}</p>
                    <p className="text-sm text-gray-500">{apt.date} at {apt.time}</p>
                  </div>
                ))}
              </div>
            )}
            {activeTab === 'records' && (
              <div className="bg-white rounded-lg border p-6">
                <h2 className="text-xl font-semibold mb-4">Medical Records</h2>
                {mockRecords.map(rec => (
                  <div key={rec.id} className="border rounded-lg p-4 mb-4">
                    <h4 className="font-semibold">{rec.title}</h4>
                    <p className="text-gray-600">{rec.type}</p>
                    <p className="text-sm text-gray-500">{rec.date}</p>
                  </div>
                ))}
              </div>
            )}
            {activeTab === 'profile' && (
              <div className="bg-white rounded-lg border p-6">
                <h2 className="text-xl font-semibold mb-4">Profile Settings</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Full Name</label>
                    <input type="text" value={user.name} readOnly className="w-full border rounded-lg px-3 py-2" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Email</label>
                    <input type="email" value={user.email} readOnly className="w-full border rounded-lg px-3 py-2" />
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
      <AIChatbot isOpen={showChatbot} onClose={() => setShowChatbot(false)} userRole="patient" />
      {showEmergency && <EmergencyModal onClose={() => setShowEmergency(false)} />}
    </div>
  );
}

export default PatientDashboard;