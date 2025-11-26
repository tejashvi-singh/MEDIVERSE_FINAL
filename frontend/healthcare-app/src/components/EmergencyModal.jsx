import React, { useEffect, useState } from "react";
import { AlertCircle, Phone } from "lucide-react";

function EmergencyModal({ onClose }) {
  const [status, setStatus] = useState('connecting');

  useEffect(() => {
    setTimeout(() => setStatus('connected'), 2000);
  }, []);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-2xl p-8 w-96">
        {status === 'connecting' && (
          <div className="text-center">
            <AlertCircle className="w-16 h-16 text-red-600 mx-auto mb-4 animate-pulse" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Connecting to Doctor...</h2>
            <p className="text-gray-600">Please wait</p>
          </div>
        )}
        {status === 'connected' && (
          <div className="text-center">
            <Phone className="w-16 h-16 text-green-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Connected!</h2>
            <p className="text-gray-600 mb-2">Dr. Sarah Smith</p>
            <p className="text-gray-600 mb-6">Emergency Specialist</p>
            <div className="flex gap-3">
              <button onClick={onClose} className="flex-1 bg-red-600 text-white py-2 rounded-lg">End Call</button>
              <button onClick={onClose} className="flex-1 bg-gray-300 text-gray-800 py-2 rounded-lg">Close</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default EmergencyModal;