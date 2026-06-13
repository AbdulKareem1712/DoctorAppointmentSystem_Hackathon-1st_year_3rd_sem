import React, { useState, useEffect } from 'react';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import reportService from '../../services/reportService';
import { 
  Calendar, Activity, UserCheck, 
  Download, FileText, Database
} from 'lucide-react';

const PatientReports = () => {
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReport();
  }, []);

  const fetchReport = async () => {
    try {
      const data = await reportService.getPatientReport();
      setReportData(data);
    } catch (error) {
      console.error("Failed to fetch patient report", error);
    } finally {
      setLoading(false);
    }
  };

  const generatePDF = () => {
    if (!reportData) return;
    const doc = new jsPDF();
    doc.text("My Medical Report", 14, 15);
    
    // Overview
    const overviewData = [
      ["Total Appointments", reportData.totalAppointments],
      ["Completed Appointments", reportData.completedAppointments],
      ["Cancelled Appointments", reportData.cancelledAppointments],
      ["Different Doctors Consulted", reportData.doctorsConsulted],
    ];
    
    doc.autoTable({
      startY: 25,
      head: [['Metric', 'Value']],
      body: overviewData,
    });

    // Appointment History
    if (reportData.appointmentHistory && reportData.appointmentHistory.length > 0) {
      const appHistoryBody = reportData.appointmentHistory.map(a => [
        a.date, a.timeSlot, a.doctorName, a.department, a.status
      ]);
      doc.text("Appointment History", 14, doc.lastAutoTable.finalY + 10);
      doc.autoTable({
        startY: doc.lastAutoTable.finalY + 15,
        head: [['Date', 'Time Slot', 'Doctor', 'Department', 'Status']],
        body: appHistoryBody,
      });
    }

    // Prescription History
    if (reportData.prescriptionHistory && reportData.prescriptionHistory.length > 0) {
      const rxHistoryBody = reportData.prescriptionHistory.map(p => [
        p.date, p.doctorName, p.medicineDetails, p.notes
      ]);
      doc.text("Prescription History", 14, doc.lastAutoTable.finalY + 10);
      doc.autoTable({
        startY: doc.lastAutoTable.finalY + 15,
        head: [['Date', 'Doctor', 'Medicine Details', 'Notes']],
        body: rxHistoryBody,
      });
    }

    doc.save("patient_report.pdf");
  };

  const generateCSV = () => {
    if (!reportData) return;
    
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Patient Medical Report\n\n";
    
    csvContent += "Metric,Value\n";
    csvContent += `Total Appointments,${reportData.totalAppointments}\n`;
    csvContent += `Completed Appointments,${reportData.completedAppointments}\n`;
    csvContent += `Cancelled Appointments,${reportData.cancelledAppointments}\n`;
    csvContent += `Different Doctors Consulted,${reportData.doctorsConsulted}\n\n`;

    if (reportData.appointmentHistory && reportData.appointmentHistory.length > 0) {
      csvContent += "Appointment History\n";
      csvContent += "Date,Time Slot,Doctor,Department,Status\n";
      reportData.appointmentHistory.forEach(a => {
        csvContent += `"${a.date}","${a.timeSlot}","${a.doctorName}","${a.department}","${a.status}"\n`;
      });
      csvContent += "\n";
    }

    if (reportData.prescriptionHistory && reportData.prescriptionHistory.length > 0) {
      csvContent += "Prescription History\n";
      csvContent += "Date,Doctor,Medicine Details,Notes\n";
      reportData.prescriptionHistory.forEach(p => {
        // Replace newlines inside details/notes with spaces for simple CSV export to avoid breaking layout
        const safeMedicine = p.medicineDetails.replace(/\n/g, ' ');
        const safeNotes = p.notes ? p.notes.replace(/\n/g, ' ') : '';
        csvContent += `"${p.date}","${p.doctorName}","${safeMedicine}","${safeNotes}"\n`;
      });
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "patient_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) return <div className="p-8 text-center text-slate-500">Loading Report...</div>;
  if (!reportData) return <div className="p-8 text-center text-rose-500">Failed to load report.</div>;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">My Reports</h1>
          <p className="text-slate-500 text-sm mt-1">Your medical history and statistics</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={generateCSV}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-100 font-medium transition-colors"
          >
            <Database className="w-4 h-4" />
            Download CSV
          </button>
          <button 
            onClick={generatePDF}
            className="flex items-center gap-2 px-4 py-2 bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-100 font-medium transition-colors"
          >
            <FileText className="w-4 h-4" />
            Download PDF
          </button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={<Calendar />} label="Total Appointments" value={reportData.totalAppointments} color="bg-indigo-500" />
        <StatCard icon={<Activity />} label="Completed Appointments" value={reportData.completedAppointments} color="bg-emerald-500" />
        <StatCard icon={<Activity />} label="Cancelled Appointments" value={reportData.cancelledAppointments} color="bg-rose-500" />
        <StatCard icon={<UserCheck />} label="Doctors Consulted" value={reportData.doctorsConsulted} color="bg-sky-500" />
      </div>

      {/* Tables */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
          <h2 className="text-lg font-bold text-slate-800 mb-4">Recent Appointments</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="py-3 font-semibold text-slate-500">Date</th>
                  <th className="py-3 font-semibold text-slate-500">Doctor</th>
                  <th className="py-3 font-semibold text-slate-500">Status</th>
                </tr>
              </thead>
              <tbody>
                {reportData.appointmentHistory.slice(0, 5).map((app, idx) => (
                  <tr key={idx} className="border-b border-slate-50 last:border-0 hover:bg-slate-50">
                    <td className="py-3 font-medium text-slate-700">{app.date}</td>
                    <td className="py-3 text-slate-600">{app.doctorName} ({app.department})</td>
                    <td className="py-3 font-bold text-slate-700">{app.status}</td>
                  </tr>
                ))}
                {reportData.appointmentHistory.length === 0 && (
                  <tr>
                    <td colSpan="3" className="py-4 text-center text-slate-500">No appointments found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
          <h2 className="text-lg font-bold text-slate-800 mb-4">Recent Prescriptions</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="py-3 font-semibold text-slate-500">Date</th>
                  <th className="py-3 font-semibold text-slate-500">Doctor</th>
                  <th className="py-3 font-semibold text-slate-500">Details</th>
                </tr>
              </thead>
              <tbody>
                {reportData.prescriptionHistory.slice(0, 5).map((rx, idx) => (
                  <tr key={idx} className="border-b border-slate-50 last:border-0 hover:bg-slate-50">
                    <td className="py-3 font-medium text-slate-700">{rx.date}</td>
                    <td className="py-3 text-slate-600">{rx.doctorName}</td>
                    <td className="py-3 text-slate-600 text-sm truncate max-w-xs">{rx.medicineDetails}</td>
                  </tr>
                ))}
                {reportData.prescriptionHistory.length === 0 && (
                  <tr>
                    <td colSpan="3" className="py-4 text-center text-slate-500">No prescriptions found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value, color }) => (
  <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-sm ${color}`}>
      {React.cloneElement(icon, { className: "w-6 h-6" })}
    </div>
    <div>
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <h3 className="text-2xl font-bold text-slate-800">{value}</h3>
    </div>
  </div>
);

export default PatientReports;
