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

  try {
    const res = await fetch(API_URL + url, options);
    
    if (res.status === 401) {
      localStorage.clear();
      window.location.href = '/';
      return null;
    }

    const json = await res.json();
    return { data: json };
  } catch (error) {
    console.error('API Error:', error);
    return { data: { success: false, message: error.message } };
  }
}

export const authAPI = {
  signup: (data) => request('POST', '/auth/register', data),
  login: (data) => request('POST', '/auth/login', data),
};

export const doctorAPI = {
  getAllDoctors: () => request('GET', '/doctors'),
};

export const patientAPI = {
  getMyPatients: () => request('GET', '/patients'),
};

export const appointmentAPI = {
  create: (data) => request('POST', '/appointments', data),
  getMyAppointments: () => request('GET', '/appointments/my'),
  updateStatus: (id, data) => request('PUT', `/appointments/${id}/status`, data),
  cancel: (id, reason) => request('PUT', `/appointments/${id}/cancel`, { reason })
};

export const recordAPI = {
  create: (data) => request('POST', '/records', data),
  getMyRecords: () => request('GET', '/records/my'),
};

export const chatAPI = {
  sendMessage: (data) => request('POST', '/chat', data),
};

export default request;