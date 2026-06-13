import React, { useState, useEffect } from 'react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import reportService from '../../services/reportService';
import {
  Users,
  UserCheck,
  Calendar,
  Activity,
  FileText,
  Database,
  DollarSign
} from 'lucide-react';

const AdminReports = () => {
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReport();
  }, []);

  const fetchReport = async () => {
    try {
      const data = await reportService.getAdminReport();
      setReportData(data);
    } catch (error) {
      console.error('Failed to fetch admin report', error);
    } finally {
      setLoading(false);
    }
  };

  const generatePDF = () => {
    if (!reportData) return;

    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text('Admin System Report', 14, 15);

    // Overview Data
    const overviewData = [
      ['Total Doctors', reportData.totalDoctors],
      ['Total Patients', reportData.totalPatients],
      ['Total Appointments', reportData.totalAppointments],
      ['Appointments This Week', reportData.appointmentsThisWeek],
      ['Completed Appointments', reportData.completedAppointments],
      ['Cancelled Appointments', reportData.cancelledAppointments],
      ['New Doctors Added', reportData.newDoctorsAdded],
      ['Total Salary Paid', `$${reportData.salarySummary}`]
    ];

    // First Table
    autoTable(doc, {
      startY: 25,
      head: [['Metric', 'Value']],
      body: overviewData
    });

    // Department-wise Statistics
    const deptBody = Object.entries(
      reportData.departmentWiseStatistics || {}
    ).map(([department, count]) => [department, count]);

    const firstY = doc.lastAutoTable?.finalY || 50;

    doc.text('Department-wise Doctors', 14, firstY + 10);

    autoTable(doc, {
      startY: firstY + 15,
      head: [['Department', 'Doctor Count']],
      body: deptBody
    });

    // Doctor Performance Statistics
    const docBody = Object.entries(
      reportData.doctorPerformanceStatistics || {}
    ).map(([doctor, count]) => [doctor, count]);

    const secondY = doc.lastAutoTable?.finalY || 100;

    doc.text(
      'Doctor Performance (Completed Appointments)',
      14,
      secondY + 10
    );

    autoTable(doc, {
      startY: secondY + 15,
      head: [['Doctor Name', 'Completed Appointments']],
      body: docBody
    });

    doc.save('admin_report.pdf');
  };

  const generateCSV = () => {
    if (!reportData) return;

    let csvContent = 'data:text/csv;charset=utf-8,';

    csvContent += 'Admin System Report\n\n';

    csvContent += 'Metric,Value\n';
    csvContent += `Total Doctors,${reportData.totalDoctors}\n`;
    csvContent += `Total Patients,${reportData.totalPatients}\n`;
    csvContent += `Total Appointments,${reportData.totalAppointments}\n`;
    csvContent += `Appointments This Week,${reportData.appointmentsThisWeek}\n`;
    csvContent += `Completed Appointments,${reportData.completedAppointments}\n`;
    csvContent += `Cancelled Appointments,${reportData.cancelledAppointments}\n`;
    csvContent += `New Doctors Added,${reportData.newDoctorsAdded}\n`;
    csvContent += `Total Salary Paid,${reportData.salarySummary}\n\n`;

    csvContent += 'Department,Doctor Count\n';

    Object.entries(reportData.departmentWiseStatistics || {}).forEach(
      ([department, count]) => {
        csvContent += `"${department}",${count}\n`;
      }
    );

    csvContent += '\n';

    csvContent += 'Doctor Name,Completed Appointments\n';

    Object.entries(reportData.doctorPerformanceStatistics || {}).forEach(
      ([doctor, count]) => {
        csvContent += `"${doctor}",${count}\n`;
      }
    );

    const encodedUri = encodeURI(csvContent);

    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'admin_report.csv');

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-slate-500">
        Loading Report...
      </div>
    );
  }

  if (!reportData) {
    return (
      <div className="p-8 text-center text-rose-500">
        Failed to load report.
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Admin Reports
          </h1>

          <p className="text-slate-500 text-sm mt-1">
            System-wide statistics and analytics
          </p>
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
        <StatCard
          icon={<Users />}
          label="Total Doctors"
          value={reportData.totalDoctors}
          color="bg-indigo-500"
        />

        <StatCard
          icon={<UserCheck />}
          label="Total Patients"
          value={reportData.totalPatients}
          color="bg-emerald-500"
        />

        <StatCard
          icon={<Calendar />}
          label="Total Appointments"
          value={reportData.totalAppointments}
          color="bg-sky-500"
        />

        <StatCard
          icon={<Activity />}
          label="Appointments This Week"
          value={reportData.appointmentsThisWeek}
          color="bg-purple-500"
        />

        <StatCard
          icon={<UserCheck />}
          label="Completed Appointments"
          value={reportData.completedAppointments}
          color="bg-teal-500"
        />

        <StatCard
          icon={<Activity />}
          label="Cancelled Appointments"
          value={reportData.cancelledAppointments}
          color="bg-rose-500"
        />

        <StatCard
          icon={<Users />}
          label="New Doctors"
          value={reportData.newDoctorsAdded}
          color="bg-amber-500"
        />

        <StatCard
          icon={<DollarSign />}
          label="Salary Total"
          value={`$${reportData.salarySummary}`}
          color="bg-green-600"
        />
      </div>

      {/* Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Department Table */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
          <h2 className="text-lg font-bold text-slate-800 mb-4">
            Department-wise Doctors
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="py-3 font-semibold text-slate-500">
                    Department
                  </th>

                  <th className="py-3 font-semibold text-slate-500 text-right">
                    Count
                  </th>
                </tr>
              </thead>

              <tbody>
                {Object.entries(
                  reportData.departmentWiseStatistics || {}
                ).map(([department, count], idx) => (
                  <tr
                    key={idx}
                    className="border-b border-slate-50 last:border-0 hover:bg-slate-50"
                  >
                    <td className="py-3 font-medium text-slate-700">
                      {department}
                    </td>

                    <td className="py-3 font-bold text-slate-700 text-right">
                      {count}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Doctor Performance Table */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
          <h2 className="text-lg font-bold text-slate-800 mb-4">
            Doctor Performance
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="py-3 font-semibold text-slate-500">
                    Doctor Name
                  </th>

                  <th className="py-3 font-semibold text-slate-500 text-right">
                    Completed Appointments
                  </th>
                </tr>
              </thead>

              <tbody>
                {Object.entries(
                  reportData.doctorPerformanceStatistics || {}
                ).map(([doctor, count], idx) => (
                  <tr
                    key={idx}
                    className="border-b border-slate-50 last:border-0 hover:bg-slate-50"
                  >
                    <td className="py-3 font-medium text-slate-700">
                      {doctor}
                    </td>

                    <td className="py-3 font-bold text-emerald-600 text-right">
                      {count}
                    </td>
                  </tr>
                ))}
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
    <div
      className={`w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-sm ${color}`}
    >
      {React.cloneElement(icon, {
        className: 'w-6 h-6'
      })}
    </div>

    <div>
      <p className="text-sm font-medium text-slate-500">
        {label}
      </p>

      <h3 className="text-2xl font-bold text-slate-800">
        {value}
      </h3>
    </div>
  </div>
);

export default AdminReports;