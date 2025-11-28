import React from 'react';
import { X, FileText, Calendar, User, Activity } from 'lucide-react';

function MedicalRecordViewer({ record, onClose }) {
  if (!record) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-6 rounded-t-xl">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold mb-2">{record.title}</h2>
              <div className="flex items-center gap-4 text-sm opacity-90">
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {new Date(record.recordDate || record.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
                <span className="flex items-center gap-1">
                  <FileText className="w-4 h-4" />
                  {record.recordType?.toUpperCase().replace('-', ' ')}
                </span>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Doctor & Patient Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <User className="w-5 h-5 text-blue-600" />
                <h3 className="font-semibold text-blue-900">Doctor Information</h3>
              </div>
              <p className="text-gray-800">
                {record.doctorId?.userId?.name || 'Dr. Unknown'}
              </p>
              <p className="text-sm text-gray-600">
                {record.doctorId?.specialty || 'Specialist'}
              </p>
            </div>

            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
              <div className="flex items-center gap-2 mb-2">
                <User className="w-5 h-5 text-green-600" />
                <h3 className="font-semibold text-green-900">Patient Information</h3>
              </div>
              <p className="text-gray-800">
                {record.patientId?.userId?.name || 'Patient'}
              </p>
              <p className="text-sm text-gray-600">
                Age: {record.patientId?.age || 'N/A'}
              </p>
            </div>
          </div>

          {/* Description */}
          {record.description && (
            <div className="bg-gray-50 rounded-lg p-4 border">
              <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
              <p className="text-gray-700 whitespace-pre-wrap">{record.description}</p>
            </div>
          )}

          {/* Diagnosis */}
          {record.diagnosis && (
            <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
              <h3 className="font-semibold text-yellow-900 mb-2">Diagnosis</h3>
              <p className="text-gray-700 whitespace-pre-wrap">{record.diagnosis}</p>
            </div>
          )}

          {/* Treatment */}
          {record.treatment && (
            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
              <h3 className="font-semibold text-green-900 mb-2">Treatment Plan</h3>
              <p className="text-gray-700 whitespace-pre-wrap">{record.treatment}</p>
            </div>
          )}

          {/* Medications */}
          {record.medications && record.medications.length > 0 && (
            <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
              <h3 className="font-semibold text-purple-900 mb-3">Prescribed Medications</h3>
              <div className="space-y-3">
                {record.medications.map((med, index) => (
                  <div key={index} className="bg-white rounded-lg p-3 border">
                    <div className="flex justify-between items-start mb-1">
                      <p className="font-semibold text-gray-900">{med.name || med.medicine}</p>
                      <span className="text-sm bg-purple-100 text-purple-800 px-2 py-1 rounded">
                        {med.dosage}
                      </span>
                    </div>
                    {med.frequency && (
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Frequency:</span> {med.frequency}
                      </p>
                    )}
                    {med.duration && (
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Duration:</span> {med.duration}
                      </p>
                    )}
                    {med.instructions && (
                      <p className="text-sm text-gray-600 mt-1">
                        <span className="font-medium">Instructions:</span> {med.instructions}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Vital Signs */}
          {record.vitals && Object.keys(record.vitals).some(key => record.vitals[key]) && (
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <div className="flex items-center gap-2 mb-3">
                <Activity className="w-5 h-5 text-blue-600" />
                <h3 className="font-semibold text-blue-900">Vital Signs</h3>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {record.vitals.bloodPressure && (
                  <div className="bg-white rounded-lg p-3 border">
                    <p className="text-xs text-gray-600 mb-1">Blood Pressure</p>
                    <p className="text-lg font-semibold text-gray-900">{record.vitals.bloodPressure}</p>
                    <p className="text-xs text-gray-500">mmHg</p>
                  </div>
                )}
                {record.vitals.heartRate && (
                  <div className="bg-white rounded-lg p-3 border">
                    <p className="text-xs text-gray-600 mb-1">Heart Rate</p>
                    <p className="text-lg font-semibold text-gray-900">{record.vitals.heartRate}</p>
                    <p className="text-xs text-gray-500">bpm</p>
                  </div>
                )}
                {record.vitals.temperature && (
                  <div className="bg-white rounded-lg p-3 border">
                    <p className="text-xs text-gray-600 mb-1">Temperature</p>
                    <p className="text-lg font-semibold text-gray-900">{record.vitals.temperature}</p>
                    <p className="text-xs text-gray-500">°F</p>
                  </div>
                )}
                {record.vitals.weight && (
                  <div className="bg-white rounded-lg p-3 border">
                    <p className="text-xs text-gray-600 mb-1">Weight</p>
                    <p className="text-lg font-semibold text-gray-900">{record.vitals.weight}</p>
                    <p className="text-xs text-gray-500">kg</p>
                  </div>
                )}
                {record.vitals.height && (
                  <div className="bg-white rounded-lg p-3 border">
                    <p className="text-xs text-gray-600 mb-1">Height</p>
                    <p className="text-lg font-semibold text-gray-900">{record.vitals.height}</p>
                    <p className="text-xs text-gray-500">cm</p>
                  </div>
                )}
                {record.vitals.bmi && (
                  <div className="bg-white rounded-lg p-3 border">
                    <p className="text-xs text-gray-600 mb-1">BMI</p>
                    <p className="text-lg font-semibold text-gray-900">{record.vitals.bmi}</p>
                    <p className="text-xs text-gray-500">kg/m²</p>
                  </div>
                )}
                {record.vitals.oxygenLevel && (
                  <div className="bg-white rounded-lg p-3 border">
                    <p className="text-xs text-gray-600 mb-1">Oxygen Level</p>
                    <p className="text-lg font-semibold text-gray-900">{record.vitals.oxygenLevel}</p>
                    <p className="text-xs text-gray-500">%</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Lab Results */}
          {record.labResults && record.labResults.length > 0 && (
            <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-200">
              <h3 className="font-semibold text-indigo-900 mb-3">Lab Results</h3>
              <div className="space-y-2">
                {record.labResults.map((lab, index) => (
                  <div key={index} className="bg-white rounded-lg p-3 border flex justify-between items-center">
                    <div>
                      <p className="font-medium text-gray-900">{lab.testName}</p>
                      <p className="text-sm text-gray-600">
                        Normal Range: {lab.normalRange} {lab.unit}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className={`text-lg font-bold ${
                        lab.status === 'normal' ? 'text-green-600' :
                        lab.status === 'abnormal' ? 'text-orange-600' :
                        lab.status === 'critical' ? 'text-red-600' :
                        'text-gray-900'
                      }`}>
                        {lab.result} {lab.unit}
                      </p>
                      <span className={`text-xs px-2 py-1 rounded ${
                        lab.status === 'normal' ? 'bg-green-100 text-green-800' :
                        lab.status === 'abnormal' ? 'bg-orange-100 text-orange-800' :
                        lab.status === 'critical' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {lab.status?.toUpperCase()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Follow-up */}
          {record.followUpDate && (
            <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
              <h3 className="font-semibold text-orange-900 mb-2">Follow-up Required</h3>
              <div className="flex items-center gap-2 text-gray-700">
                <Calendar className="w-5 h-5 text-orange-600" />
                <span>
                  {new Date(record.followUpDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>
              {record.followUpInstructions && (
                <p className="text-sm text-gray-600 mt-2">{record.followUpInstructions}</p>
              )}
            </div>
          )}

          {/* Findings */}
          {record.findings && (
            <div className="bg-gray-50 rounded-lg p-4 border">
              <h3 className="font-semibold text-gray-900 mb-2">Clinical Findings</h3>
              <p className="text-gray-700 whitespace-pre-wrap">{record.findings}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 border-t p-4 rounded-b-xl">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-500">
              Created on {new Date(record.createdAt).toLocaleDateString()}
            </p>
            <button
              onClick={onClose}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MedicalRecordViewer;