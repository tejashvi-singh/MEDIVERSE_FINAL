import React from "react";
import DoctorDashboard from "./DoctorDashboard";
import PatientDashboard from "./PatientDashboard";

function Dashboard({ user, isGuest, onLogout }) {
  return user.role === 'doctor' ? (
    <DoctorDashboard user={user} onLogout={onLogout} />
  ) : (
    <PatientDashboard user={user} isGuest={isGuest} onLogout={onLogout} />
  );
}

export default Dashboard;