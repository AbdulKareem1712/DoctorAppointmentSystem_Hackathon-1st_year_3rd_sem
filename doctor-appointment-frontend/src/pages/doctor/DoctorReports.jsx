import React, { useState, useEffect } from 'react';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import reportService from '../../services/reportService';
import { 
  Users, UserCheck, Calendar, Activity,
  Download, FileText, Database
} from 'lucide-react';

const DoctorReports = () => {
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReport();
  }, []);

  const fetchReport = async () => {
    try {
      const data = await reportService.getDoctorReport();
      setReportData(data);
    } catch (error) {
      console.error("Failed to fetch doctor report", error);
    } finally {
      setLoading(false);
    }
  };

  const generatePDF = () => {
    if (!reportData) return;
    const doc = new jsPDF();
    doc.text("Doctor Performance Report", 14, 15);
    
    const data = [
      ["Patients Treated Today", reportData.patientsTreatedToday],
      ["Patients Treated This Week", reportData.patientsTreatedThisWeek],
      ["Total Completed Appointments", reportData.completedAppointments],
      ["Total Cancelled Appointments", reportData.cancelledAppointments],
      ["Upcoming Appointments", reportData.upcomingAppointments],
    ];
    
    doc.autoTable({
      startY: 25,
      head: [['Metric', 'Count']],
      body: data,
    });

    doc.save("doctor_report.pdf");
  };

  const generateCSV = () => {
    if (!reportData) return;
    
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Doctor Performance Report\n\n";
    csvContent += "Metric,Count\n";
    csvContent += `Patients Treated Today,${reportData.patientsTreatedToday}\n`;
    csvContent += `Patients Treated This Week,${reportData.patientsTreatedThisWeek}\n`;
    csvContent += `Total Completed Appointments,${reportData.completedAppointments}\n`;
    csvContent += `Total Cancelled Appointments,${reportData.cancelledAppointments}\n`;
    csvContent += `Upcoming Appointments,${reportData.upcomingAppointments}\n`;

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "doctor_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) return <div className="p-8 text-center text-slate-500">Loading Report...</div>;
  if (!reportData) return <div className="p-8 text-center text-rose-500">Failed to load report.</div>;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">My Reports</h1>
          <p className="text-slate-500 text-sm mt-1">Your performance and appointment statistics</p>
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard icon={<UserCheck />} label="Patients Today" value={reportData.patientsTreatedToday} color="bg-indigo-500" />
        <StatCard icon={<Users />} label="Patients This Week" value={reportData.patientsTreatedThisWeek} color="bg-emerald-500" />
        <StatCard icon={<Activity />} label="Completed Appointments" value={reportData.completedAppointments} color="bg-sky-500" />
        <StatCard icon={<Activity />} label="Cancelled Appointments" value={reportData.cancelledAppointments} color="bg-rose-500" />
        <StatCard icon={<Calendar />} label="Upcoming Appointments" value={reportData.upcomingAppointments} color="bg-amber-500" />
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

export default DoctorReports;
