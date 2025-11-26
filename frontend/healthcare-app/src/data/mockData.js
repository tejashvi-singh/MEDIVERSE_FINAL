export const mockUsers = {
    doctor: {
      id: "doc_001",
      email: "dr.smith@mediverse.com",
      name: "Dr. Sarah Smith",
      role: "doctor",
      specialty: "Cardiology",
      avatar: "👩‍⚕️"
    },
    patient: {
      id: "pat_001",
      email: "john.doe@email.com",
      name: "John Doe",
      role: "patient",
      age: 32,
      avatar: "👨"
    }
  };
  
  export const mockAppointments = [
    { id: 1, patient: "John Doe", doctor: "Dr. Smith", date: "2024-09-10", time: "10:00 AM", status: "confirmed", type: "Consultation" },
    { id: 2, patient: "Jane Wilson", doctor: "Dr. Smith", date: "2024-09-10", time: "2:00 PM", status: "pending", type: "Follow-up" },
    { id: 3, patient: "Mike Johnson", doctor: "Dr. Smith", date: "2024-09-11", time: "11:00 AM", status: "completed", type: "Check-up" },
  ];
  
  export const mockPatients = [
    { id: 1, name: "John Doe", age: 32, condition: "Hypertension", lastVisit: "2024-08-15" },
    { id: 2, name: "Jane Wilson", age: 45, condition: "Diabetes", lastVisit: "2024-08-20" },
    { id: 3, name: "Mike Johnson", age: 28, condition: "Asthma", lastVisit: "2024-08-25" },
  ];
  
  export const mockRecords = [
    { id: 1, type: "Lab Result", date: "2024-08-15", title: "Blood Test Results", doctor: "Dr. Smith" },
    { id: 2, type: "Prescription", date: "2024-08-10", title: "Medication Refill", doctor: "Dr. Smith" },
    { id: 3, type: "Imaging", date: "2024-07-25", title: "Chest X-Ray", doctor: "Dr. Wilson" },
  ];