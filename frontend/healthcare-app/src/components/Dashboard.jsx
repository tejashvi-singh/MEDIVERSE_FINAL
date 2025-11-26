import React, { useState } from "react";
import DoctorDashboard from "./DoctorDashboard";
import PatientDashboard from "./PatientDashboard";
import { mockUsers } from "../data/mockData";

function Dashboard() {
  const [currentUser, setCurrentUser] = useState(null);
  const [userType, setUserType] = useState(null);

  const handleLogin = (type) => {
    setUserType(type);
    setCurrentUser(mockUsers[type]);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setUserType(null);
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full mx-4">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Healthcare App</h1>
            <p className="text-gray-600">Choose your portal to continue</p>
          </div>
          <div className="space-y-4">
            <button onClick={() => handleLogin('doctor')} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-lg flex items-center justify-center gap-3">
              <span className="text-2xl">👩‍⚕️</span>
              <div className="text-left">
                <div className="font-semibold">Doctor Portal</div>
                <div className="text-sm opacity-90">Manage patients</div>
              </div>
            </button>
            <button onClick={() => handleLogin('patient')} className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-4 px-6 rounded-lg flex items-center justify-center gap-3">
              <span className="text-2xl">👨</span>
              <div className="text-left">
                <div className="font-semibold">Patient Portal</div>
                <div className="text-sm opacity-90">View records</div>
              </div>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return userType === 'doctor' ? <DoctorDashboard user={currentUser} onLogout={handleLogout} /> : <PatientDashboard user={currentUser} onLogout={handleLogout} />;
}

export default Dashboard;