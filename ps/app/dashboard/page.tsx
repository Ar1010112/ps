"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState, useMemo } from "react";
import { Report, ReportStatus, ReportType } from "@prisma/client";
import { signOut } from "next-auth/react";
import Image from "next/image";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { motion, AnimatePresence } from "framer-motion";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

export default function Dashboard() {
  const { data: session } = useSession();
  const [reports, setReports] = useState<Report[]>([]);
  const [filter, setFilter] = useState<ReportStatus | "ALL">("ALL");
  const [typeFilter, setTypeFilter] = useState<ReportType | "ALL">("ALL");
  const [isLoading, setIsLoading] = useState(true);
  const [classifications, setClassifications] = useState<Record<string, string>>({});

  // Generate particles
  const particles = useMemo(() => {
    return Array.from({ length: 50 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      duration: 3 + Math.random() * 4,
      delay: Math.random() * 2,
      opacity: 0.2 + Math.random() * 0.5,
      size: 0.5 + Math.random() * 0.5,
    }));
  }, []);

  const filteredReports = useMemo(
    () =>
      reports.filter((report) => {
        const statusMatch = filter === "ALL" || report.status === filter;
        const typeMatch = typeFilter === "ALL" || report.type === typeFilter;
        return statusMatch && typeMatch;
      }),
    [reports, filter, typeFilter]
  );

  useEffect(() => {
    fetchReports();
  }, []);

  useEffect(() => {
    const classifyReports = async () => {
      for (const report of filteredReports) {
        if (!classifications[report.id]) {
          await classifyIncident(report.id, report.description);
        }
      }
    };
    classifyReports();
  }, [filteredReports]);

  const fetchReports = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/reports");
      const data = await response.json();
      setReports(data);
    } catch (error) {
      console.error("Error fetching reports:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const classifyIncident = async (reportId: string, description: string) => {
    try {
      const response = await fetch("/api/ai/classify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description }),
      });
      const { department } = await response.json();
      setClassifications((prev) => ({
        ...prev,
        [reportId]: department || "General",
      }));
    } catch (error) {
      console.error("Classification error:", error);
      setClassifications((prev) => ({
        ...prev,
        [reportId]: "Classification Failed",
      }));
    }
  };

  const updateReportStatus = async (reportId: string, newStatus: ReportStatus) => {
    try {
      const response = await fetch(`/api/reports/${reportId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (response.ok) fetchReports();
    } catch (error) {
      console.error("Error updating report:", error);
    }
  };

  const getStatusColor = (status: ReportStatus) => {
    const colors = {
      PENDING: "bg-amber-500/30 text-amber-300 border-amber-500/40",
      IN_PROGRESS: "bg-blue-500/30 text-blue-300 border-blue-500/40",
      RESOLVED: "bg-emerald-500/30 text-emerald-300 border-emerald-500/40",
      DISMISSED: "bg-neutral-600/30 text-neutral-300 border-neutral-600/40",
    };
    return colors[status];
  };

  const getDepartmentColor = (department: string) => {
    const colors: { [key: string]: string } = {
      Fire: "bg-red-500/30 text-red-300 border-red-500/40",
      Medical: "bg-blue-500/30 text-blue-300 border-blue-500/40",
      Police: "bg-amber-500/30 text-amber-300 border-amber-500/40",
      Traffic: "bg-purple-500/30 text-purple-300 border-purple-500/40",
      Crime: "bg-rose-500/30 text-rose-300 border-rose-500/40",
      Disaster: "bg-orange-500/30 text-orange-300 border-orange-500/40",
      General: "bg-neutral-700/30 text-neutral-300 border-neutral-700/40",
    };
    return colors[department] || "bg-neutral-700/30 text-neutral-300 border-neutral-700/40";
  };

  // Analytics Data
  const statusCounts = useMemo(() => {
    const counts = { PENDING: 0, IN_PROGRESS: 0, RESOLVED: 0, DISMISSED: 0 };
    reports.forEach((report) => {
      counts[report.status]++;
    });
    return counts;
  }, [reports]);

  const departmentCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    Object.values(classifications).forEach((dept) => {
      counts[dept] = (counts[dept] || 0) + 1;
    });
    return counts;
  }, [classifications]);

  const statusChartData = {
    labels: Object.keys(statusCounts),
    datasets: [
      {
        label: "Report Status",
        data: Object.values(statusCounts),
        backgroundColor: [
          "rgba(245, 158, 11, 0.6)",
          "rgba(59, 130, 246, 0.6)",
          "rgba(16, 185, 129, 0.6)",
          "rgba(107, 114, 128, 0.6)",
        ],
        borderColor: [
          "rgba(245, 158, 11, 1)",
          "rgba(59, 130, 246, 1)",
          "rgba(16, 185, 129, 1)",
          "rgba(107, 114, 128, 1)",
        ],
        borderWidth: 2,
      },
    ],
  };

  const departmentChartData = {
    labels: Object.keys(departmentCounts),
    datasets: [
      {
        label: "Department Distribution",
        data: Object.values(departmentCounts),
        backgroundColor: [
          "rgba(239, 68, 68, 0.6)",
          "rgba(59, 130, 246, 0.6)",
          "rgba(245, 158, 11, 0.6)",
          "rgba(168, 85, 247, 0.6)",
          "rgba(244, 63, 94, 0.6)",
          "rgba(249, 115, 22, 0.6)",
          "rgba(107, 114, 128, 0.6)",
        ],
        borderColor: [
          "rgba(239, 68, 68, 1)",
          "rgba(59, 130, 246, 1)",
          "rgba(245, 158, 11, 1)",
          "rgba(168, 85, 247, 1)",
          "rgba(244, 63, 94, 1)",
          "rgba(249, 115, 22, 1)",
          "rgba(107, 114, 128, 1)",
        ],
        borderWidth: 2,
      },
    ],
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[radial-gradient(ellipse_at_top_left,_#111827_0%,_#0a0e1a_70%)]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="rounded-full h-20 w-20 border-t-4 border-b-4 border-[#07D348]"
        ></motion.div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-[#0a0f0a] text-white">
      {/* Particle Animation Layer */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute w-0.5 h-4 bg-[#07D348] rounded-full"
            style={{
              left: `${particle.left}%`,
              top: `${particle.top}%`,
              animation: `rain ${particle.duration}s linear ${particle.delay}s infinite`,
              opacity: particle.opacity,
              transform: `translateY(-100vh) scale(${particle.size})`,
            }}
          ></div>
        ))}
      </div>
      <style jsx>{`
        @keyframes rain {
          0% {
            transform: translateY(-100vh);
          }
          100% {
            transform: translateY(100vh);
          }
        }
      `}</style>

      <nav className="border-b border-gray-800 bg-gray-900/90 backdrop-blur-2xl sticky top-0 z-50 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex justify-between items-center">
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-4xl font-extrabold bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent"
            >
              Admin Dashboard
            </motion.h1>
            <div className="flex items-center gap-6">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="flex items-center gap-3"
              >
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#07D348] to-emerald-500 flex items-center justify-center shadow-md">
                  <span className="text-xl font-bold text-white">
                    {session?.user?.name?.charAt(0) || "A"}
                  </span>
                </div>
                <span className="text-lg font-semibold text-gray-100">
                  {session?.user?.name || "Admin"}
                </span>
              </motion.div>
              <motion.button
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                onClick={() => signOut()}
                className="px-5 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-[#07D348] to-emerald-500 rounded-xl hover:from-[#06b63e] hover:to-emerald-600 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Sign Out
              </motion.button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10">
        {/* Analytics Section */}
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-gray-100 mb-8">Analytics Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="bg-gray-900/60 backdrop-blur-xl rounded-2xl p-8 border border-gray-800/50 shadow-2xl"
            >
              <h3 className="text-xl font-semibold text-gray-100 mb-6">Report Status Distribution</h3>
              <Bar
                data={statusChartData}
                options={{
                  responsive: true,
                  plugins: {
                    legend: { display: false },
                    tooltip: { backgroundColor: "rgba(0, 0, 0, 0.9)", padding: 12 },
                  },
                  scales: {
                    y: { beginAtZero: true, ticks: { color: "rgba(229, 231, 235, 0.9)", font: { size: 14 } } },
                    x: { ticks: { color: "rgba(229, 231, 235, 0.9)", font: { size: 14 } } },
                  },
                }}
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="bg-gray-900/60 backdrop-blur-xl rounded-2xl p-8 border border-gray-800/50 shadow-2xl"
            >
              <h3 className="text-xl font-semibold text-gray-100 mb-6">Department Distribution</h3>
              <Pie
                data={departmentChartData}
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      position: "bottom",
                      labels: { color: "rgba(229, 231, 235, 0.9)", font: { size: 14 } },
                    },
                    tooltip: { backgroundColor: "rgba(0, 0, 0, 0.9)", padding: 12 },
                  },
                }}
              />
            </motion.div>
          </div>
        </motion.section>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-10 flex flex-wrap gap-4 items-center justify-between"
        >
          <div className="flex gap-4">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as ReportStatus | "ALL")}
              className="bg-gray-900/80 border border-gray-800/50 text-gray-100 rounded-xl px-5 py-3 focus:ring-2 focus:ring-[#07D348] focus:border-[#07D348] transition-all duration-300 text-sm font-medium"
            >
              <option value="ALL">All Statuses</option>
              {Object.values(ReportStatus).map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as ReportType | "ALL")}
              className="bg-gray-900/80 border border-gray-800/50 text-gray-100 rounded-xl px-5 py-3 focus:ring-2 focus:ring-[#07D348] focus:border-[#07D348] transition-all duration-300 text-sm font-medium"
            >
              <option value="ALL">All Types</option>
              {Object.values(ReportType).map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
          <div className="text-gray-100 font-semibold text-lg">
            {filteredReports.length} {filteredReports.length === 1 ? "Report" : "Reports"}
          </div>
        </motion.div>

        {/* Reports */}
        <div className="grid gap-8 grid-cols-1">
          <AnimatePresence>
            {filteredReports.map((report, index) => (
              <motion.div
                key={report.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="bg-gray-900/60 backdrop-blur-xl rounded-2xl p-6 border border-gray-800/50 hover:border-[#07D348]/60 transition-all duration-300 shadow-2xl hover:shadow-[#07D348]/20 group will-change-transform"
              >
                <div className="space-y-5">
                  <div className="flex items-center justify-between gap-4">
                    <h2 className="text-xl font-bold text-gray-100 truncate">{report.title}</h2>
                    <span
                      className={`px-4 py-1.5 rounded-full text-sm font-semibold ${getStatusColor(
                        report.status
                      )}`}
                    >
                      {report.status}
                    </span>
                  </div>
                  <p className="text-gray-300 text-base line-clamp-3">{report.description}</p>

                  {!classifications[report.id] ? (
                    <div className="flex items-center gap-3 text-sm text-gray-400">
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                        className="w-5 h-5 rounded-full bg-gray-600"
                      ></motion.div>
                      Analyzing report...
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-gray-300 font-medium">Assigned to:</span>
                      <span
                        className={`px-4 py-1.5 rounded-full text-sm font-semibold ${getDepartmentColor(
                          classifications[report.id]
                        )}`}
                      >
                        {classifications[report.id]} Department
                      </span>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-6 text-sm text-gray-300">
                    <span className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-gray-800/50 flex items-center justify-center">
                        <div className="w-2.5 h-2.5 rounded-full bg-[#07D348]"></div>
                      </div>
                      {report.type}
                    </span>
                    <span className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-gray-800/50 flex items-center justify-center">
                        <div className="w-2.5 h-2.5 rounded-full bg-[#07D348]"></div>
                      </div>
                      {report.location || "N/A"}
                    </span>
                    <span className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-gray-800/50 flex items-center justify-center">
                        <div className="w-2.5 h-2.5 rounded-full bg-[#07D348]"></div>
                      </div>
                      {new Date(report.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  {report.image && (
                    <div className="mt-5 relative w-full h-56 rounded-xl border border-gray-800/50 overflow-hidden group-hover:ring-2 group-hover:ring-[#07D348]/40 transition-all duration-300">
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.3 }}
                        className="w-full h-full"
                      >
                        <Image
                          src={report.image}
                          alt="Report evidence"
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, 100vw"
                        />
                      </motion.div>
                    </div>
                  )}

                  <select
                    value={report.status}
                    onChange={(e) => updateReportStatus(report.id, e.target.value as ReportStatus)}
                    className="w-full bg-gray-900/80 border border-gray-800/50 text-gray-100 rounded-xl px-5 py-3 focus:ring-2 focus:ring-[#07D348] focus:border-[#07D348] hover:border-[#07D348]/60 transition-all duration-300 text-sm font-medium"
                  >
                    {Object.values(ReportStatus).map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filteredReports.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-center py-16 text-gray-300 text-lg bg-gray-900/60 backdrop-blur-xl rounded-2xl border border-gray-800/50 shadow-2xl"
          >
            No reports found matching the selected filters.
          </motion.div>
        )}
      </main>
    </div>
  );
}