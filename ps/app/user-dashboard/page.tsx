"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Report, ReportStatus, ReportType } from "@prisma/client";
import { signOut } from "next-auth/react";

interface NewReportState {
  title: string;
  description: string;
  type: ReportType;
  location: string;
  image: string;
}

export default function UserDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [reports, setReports] = useState<Report[]>([]);
  const [newReport, setNewReport] = useState<NewReportState>({
    title: "",
    description: "",
    type: ReportType.NON_EMERGENCY,
    location: "",
    image: ""
  });
  const [showReportForm, setShowReportForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
    if (session?.user.role === "ADMIN") {
      router.push("/dashboard");
    }
  }, [status, session, router]);

  useEffect(() => {
    const fetchReports = async () => {
      const res = await fetch("/api/reports");
      const data = await res.json();
      setReports(data);
    };
    fetchReports();
  }, []);

  const handleSubmitReport = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const res = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newReport)
      });

      if (res.ok) {
        setShowReportForm(false);
        setNewReport({
          title: "",
          description: "",
          type: ReportType.NON_EMERGENCY,
          location: "",
          image: ""
        });
        const updatedReports = await fetch("/api/reports").then(res => res.json());
        setReports(updatedReports);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (status === "loading") return <div>Loading...</div>;

  const statusColors = {
    [ReportStatus.PENDING]: "bg-yellow-500/20 text-yellow-500",
    [ReportStatus.IN_PROGRESS]: "bg-blue-500/20 text-blue-500",
    [ReportStatus.RESOLVED]: "bg-green-500/20 text-green-500",
    [ReportStatus.DISMISSED]: "bg-red-500/20 text-red-500"
  };

  return (
    <div className="min-h-screen bg-neutral-900 text-gray-100">
      <nav className="bg-neutral-800/50 backdrop-blur-md border-b border-[#07D348]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-xl font-bold bg-gradient-to-r from-[#07D348] to-[#24fe41] bg-clip-text text-transparent">
              CivicSafe User Dashboard
            </h1>
            <div className="flex items-center gap-4">
              <span className="text-sm text-neutral-400">{session?.user.email}</span>
              <button
                onClick={() => signOut()}
                className="px-4 py-2 bg-neutral-700/50 hover:bg-neutral-700 rounded-lg transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-neutral-800/50 p-4 rounded-xl border border-[#07D348]/20">
            <h3 className="text-neutral-400 text-sm">Total Reports</h3>
            <p className="text-2xl font-bold">{reports.length}</p>
          </div>
          {Object.values(ReportStatus).map(status => (
            <div key={status} className="bg-neutral-800/50 p-4 rounded-xl border border-[#07D348]/20">
              <h3 className="text-neutral-400 text-sm">{status}</h3>
              <p className="text-2xl font-bold">
                {reports.filter(r => r.status === status).length}
              </p>
            </div>
          ))}
        </div>

        <div className="mb-8 flex justify-between items-center">
          <h2 className="text-2xl font-bold">Your Safety Reports</h2>
          <button
            onClick={() => setShowReportForm(!showReportForm)}
            className="bg-gradient-to-r from-[#07D348] to-[#24fe41] text-black px-6 py-2 rounded-lg font-semibold hover:opacity-90 transition-opacity"
          >
            {showReportForm ? "Cancel" : "New Report"}
          </button>
        </div>

        {showReportForm && (
          <form onSubmit={handleSubmitReport} className="mb-8 bg-neutral-800/50 p-6 rounded-xl border border-[#07D348]/20">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm text-neutral-400">Title</label>
                <input
                  required
                  value={newReport.title}
                  onChange={e => setNewReport({...newReport, title: e.target.value})}
                  className="w-full bg-neutral-700/50 border border-neutral-600 rounded-lg px-4 py-2 focus:outline-none focus:border-[#07D348]"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-neutral-400">Type</label>
                <select
                  value={newReport.type}
                  onChange={e => setNewReport({
                    ...newReport,
                    type: e.target.value as ReportType
                  })}
                  className="w-full bg-neutral-700/50 border border-neutral-600 rounded-lg px-4 py-2 focus:outline-none focus:border-[#07D348]"
                >
                  {Object.values(ReportType).map(type => (
                    <option key={type} value={type}>
                      {type.toLowerCase().replace('_', ' ')}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm text-neutral-400">Location</label>
                <input
                  value={newReport.location}
                  onChange={e => setNewReport({...newReport, location: e.target.value})}
                  className="w-full bg-neutral-700/50 border border-neutral-600 rounded-lg px-4 py-2 focus:outline-none focus:border-[#07D348]"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-neutral-400">Image URL</label>
                <input
                  value={newReport.image}
                  onChange={e => setNewReport({...newReport, image: e.target.value})}
                  className="w-full bg-neutral-700/50 border border-neutral-600 rounded-lg px-4 py-2 focus:outline-none focus:border-[#07D348]"
                />
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-sm text-neutral-400">Description</label>
                <textarea
                  required
                  value={newReport.description}
                  onChange={e => setNewReport({...newReport, description: e.target.value})}
                  className="w-full bg-neutral-700/50 border border-neutral-600 rounded-lg px-4 py-2 focus:outline-none focus:border-[#07D348] h-32"
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="md:col-span-2 bg-[#07D348] text-black px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {isSubmitting ? "Submitting..." : "Submit Report"}
              </button>
            </div>
          </form>
        )}

        <div className="bg-neutral-800/50 rounded-xl border border-[#07D348]/20 overflow-hidden">
          <table className="w-full">
            <thead className="bg-neutral-700/20">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium text-neutral-400">Title</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-neutral-400">Type</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-neutral-400">Status</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-neutral-400">Location</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-neutral-400">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-700/50">
              {reports.map(report => (
                <tr key={report.id} className="hover:bg-neutral-700/20 transition-colors">
                  <td className="px-6 py-4">{report.title}</td>
                  <td className="px-6 py-4">
                    {report.type.toLowerCase().replace('_', ' ')}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-sm ${statusColors[report.status]}`}>
                      {report.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">{report.location || "N/A"}</td>
                  <td className="px-6 py-4">
                    {new Date(report.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}