const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

async function request(method, url, data) {
  const token = localStorage.getItem('token');

  const options = {
    method,
    headers: {
      'Content-Type': 'application/json'
    }
  };

  if (token) options.headers['Authorization'] = `Bearer ${token}`;
  if (data) options.body = JSON.stringify(data);

  const res = await fetch(API_URL + url, options);

  if (res.status === 401) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
  }

  const json = await res.json();
  return json;
}

export const authAPI = {
  signup: (data) => request('POST', '/auth/signup', data),
  login: (data) => request('POST', '/auth/login', data),
  getMe: () => request('GET', '/auth/me')
};

export const doctorAPI = {
  getAllDoctors: () => request('GET', '/doctors'),
  getDoctorProfile: (id) => request('GET', `/doctors/${id}`),
  updateProfile: (data) => request('PUT', '/doctors/profile', data),
  getMyPatients: () => request('GET', '/doctors/patients')
};

export const patientAPI = {
  getProfile: () => request('GET', '/patients/profile'),
  updateProfile: (data) => request('PUT', '/patients/profile', data)
};

export const appointmentAPI = {
  create: (data) => request('POST', '/appointments', data),
  getMyAppointments: () => request('GET', '/appointments/my-appointments'),
  updateStatus: (id, data) => request('PUT', `/appointments/${id}/status`, data),
  cancel: (id, reason) => request('PUT', `/appointments/${id}/cancel`, { reason })
};

export const recordAPI = {
  create: (data) => request('POST', '/records', data),
  getMyRecords: () => request('GET', '/records/my-records'),
  getRecordById: (id) => request('GET', `/records/${id}`)
};

export const chatAPI = {
  sendMessage: (data) => request('POST', '/chat/message', data),
  getHistory: (sessionId) => request('GET', `/chat/history/${sessionId}`),
  getSessions: () => request('GET', '/chat/sessions')
};

export default request;
