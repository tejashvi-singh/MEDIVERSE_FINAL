const doctorOptions = [
    { id: 1, name: 'Dr. Sarah Johnson', specialty: 'Cardiology' },
    { id: 2, name: 'Dr. Michael Chen', specialty: 'General Medicine' },
    { id: 3, name: 'Dr. Priya Sharma', specialty: 'Pediatrics' },
    { id: 4, name: 'Dr. James Williams', specialty: 'Orthopedics' },
    { id: 5, name: 'Dr. Emily Brown', specialty: 'Dermatology' }
  ];
  
  // In your JSX, update the select dropdown:
  <select 
    name="doctor" 
    className="doctor-select"
    required
  >
    <option value="">Choose a doctor</option>
    {doctorOptions.map(doctor => (
      <option key={doctor.id} value={doctor.id}>
        {doctor.name} - {doctor.specialty}
      </option>
    ))}
  </select>
  
  // Or if you're using a custom dropdown component, update the options array:
  const options = [
    'Choose a doctor',
    'Dr. Sarah Johnson - Cardiology',
    'Dr. Michael Chen - General Medicine',
    'Dr. Priya Sharma - Pediatrics',
    'Dr. James Williams - Orthopedics',
    'Dr. Emily Brown - Dermatology'
  ];