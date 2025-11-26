import React, { useState } from "react";
import { User, Calendar, FileText, Users, Activity, Plus, Search, Bell, Settings, LogOut, MessageCircle } from "lucide-react";
import AIChatbot from "./AIChatbot";
import { mockAppointments, mockPatients } from "../data/mockData";

function DoctorDashboard({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState("overview");
  const [showChatbot, setShowChatbot] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b px-6 py-4">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-blue-600">Healthcare</h1>
            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">Doctor Portal</span>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => setShowChatbot(true)} className="p-2 hover:bg-blue-50 rounded-lg text-blue-600">
              <MessageCircle className="h-5 w-5" />
            </button>
            <Bell className="h-5 w-5 text-gray-600 cursor-pointer" />
            <Settings className="h-5 w-5 text-gray-600 cursor-pointer" />
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="font-medium">{user.name}</p>
                <p className="text-sm text-gray-500">{user.specialty}</p>
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
                { id: 'appointments', label: 'Appointments', icon: Calendar },
                { id: 'patients', label: 'Patients', icon: Users },
                { id: 'records', label: 'Records', icon: FileText },
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
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                  <div className="bg-blue-50 p-6 rounded-lg border">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-blue-600 text-sm font-medium">Today's Appointments</p>
                        <p className="text-3xl font-bold text-blue-900">5</p>
                      </div>
                      <Calendar className="h-8 w-8 text-blue-600" />
                    </div>
                  </div>
                  <div className="bg-green-50 p-6 rounded-lg border">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-green-600 text-sm font-medium">Total Patients</p>
                        <p className="text-3xl font-bold text-green-900">124</p>
                      </div>
                      <Users className="h-8 w-8 text-green-600" />
                    </div>
                  </div>
                  <div className="bg-orange-50 p-6 rounded-lg border">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-orange-600 text-sm font-medium">Pending Reports</p>
                        <p className="text-3xl font-bold text-orange-900">8</p>
                      </div>
                      <FileText className="h-8 w-8 text-orange-600" />
                    </div>
                  </div>
                  <div className="bg-purple-50 p-6 rounded-lg border">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-purple-600 text-sm font-medium">Completed Today</p>
                        <p className="text-3xl font-bold text-purple-900">3</p>
                      </div>
                      <Activity className="h-8 w-8 text-purple-600" />
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-white rounded-lg border p-6">
                    <h3 className="text-lg font-semibold mb-4">Recent Appointments</h3>
                    {mockAppointments.slice(0, 3).map(apt => (
                      <div key={apt.id} className="flex justify-between p-3 bg-gray-50 rounded mb-2">
                        <div>
                          <p className="font-medium">{apt.patient}</p>
                          <p className="text-sm text-gray-600">{apt.date} {apt.time}</p>
                        </div>
                        <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded">{apt.status}</span>
                      </div>
                    ))}
                  </div>
                  <div className="bg-white rounded-lg border p-6">
                    <h3 className="text-lg font-semibold mb-4">Recent Patients</h3>
                    {mockPatients.slice(0, 3).map(patient => (
                      <div key={patient.id} className="flex justify-between p-3 bg-gray-50 rounded mb-2">
                        <div>
                          <p className="font-medium">{patient.name}</p>
                          <p className="text-sm text-gray-600">{patient.condition}</p>
                        </div>
                        <p className="text-sm text-gray-500">{patient.lastVisit}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            {activeTab === 'appointments' && (
              <div className="bg-white rounded-lg border">
                <div className="p-6 border-b">
                  <h2 className="text-xl font-semibold">All Appointments</h2>
                </div>
                <div className="p-6">
                  {mockAppointments.map(apt => (
                    <div key={apt.id} className="border rounded-lg p-4 mb-4">
                      <h4 className="font-semibold">{apt.patient}</h4>
                      <p className="text-gray-600">{apt.type}</p>
                      <p className="text-sm text-gray-500">{apt.date} at {apt.time}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {activeTab === 'patients' && (
              <div className="bg-white rounded-lg border">
                <div className="p-6 border-b">
                  <h2 className="text-xl font-semibold">Patient Management</h2>
                </div>
                <div className="p-6">
                  {mockPatients.map(patient => (
                    <div key={patient.id} className="border rounded-lg p-4 mb-4">
                      <h4 className="font-semibold">{patient.name}</h4>
                      <p className="text-gray-600">Age: {patient.age} | {patient.condition}</p>
                      <p className="text-sm text-gray-500">Last Visit: {patient.lastVisit}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {activeTab === 'records' && (
              <div className="bg-white rounded-lg border p-6">
                <h2 className="text-xl font-semibold">Medical Records</h2>
                <p className="text-gray-600 mt-4">Records management coming soon</p>
              </div>
            )}
          </main>
        </div>
      </div>
      <AIChatbot isOpen={showChatbot} onClose={() => setShowChatbot(false)} userRole="doctor" />
    </div>
  );
}

export default DoctorDashboard;