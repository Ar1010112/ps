import { motion, AnimatePresence } from 'framer-motion';

interface TimelineEvent {
  description: string;
  timestamp: string | number;
}

interface Report {
  status: string;
  reportId: string;
  incidentType: string;
  timestamp: string | number;
  analysis?: {
    priority?: string;
    department?: string;
  };
  timeline?: TimelineEvent[];
}

interface ReportStatusProps {
  report: Report;
}

export function ReportStatus({ report }: ReportStatusProps) {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40 ring-yellow-500/20';
      case 'in progress':
        return 'bg-sky-500/20 text-sky-400 border-sky-500/40 ring-sky-500/20';
      case 'resolved':
        return 'bg-green-500/20 text-green-400 border-green-500/40 ring-green-500/20';
      default:
        return 'bg-zinc-500/20 text-zinc-400 border-zinc-500/40 ring-zinc-500/20';
    }
  };

  const getPriorityColor = (priority?: string) => {
    if (!priority) return 'bg-zinc-500/20 text-zinc-400';
    switch (priority.toLowerCase()) {
      case 'high':
        return 'bg-red-500/20 text-red-400 border-red-500/40';
      case 'medium':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/40';
      case 'low':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40';
      default:
        return 'bg-zinc-500/20 text-zinc-400';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="rounded-2xl bg-gradient-to-br from-zinc-900/90 to-zinc-900/60 border border-zinc-800/60 p-8 space-y-8 backdrop-blur-md shadow-2xl shadow-zinc-900/40 max-w-3xl mx-auto"
    >
      {/* Status Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="space-y-2">
          <p className="text-xs font-semibold text-zinc-400 uppercase tracking-widest">
            Report Status
          </p>
          <div className="flex items-center gap-3">
            <motion.span
              whileHover={{ scale: 1.05 }}
              className={`${getStatusColor(
                report.status
              )} px-4 py-1.5 rounded-full text-sm font-medium border transition-all duration-300 ring-2`}
            >
              {report.status || 'Pending Review'}
            </motion.span>
            <span className="text-xs text-zinc-400 font-mono">
              {new Date(report.timestamp).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
            </span>
          </div>
        </div>
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-zinc-800/60 px-4 py-3 rounded-xl border border-zinc-800/70 backdrop-blur-sm transition-all duration-300"
        >
          <p className="text-xs text-zinc-400 font-semibold uppercase tracking-wider">
            Report ID
          </p>
          <p className="text-sm font-mono text-white tracking-wide">{report.reportId}</p>
        </motion.div>
      </div>

      {/* Divider */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="h-px bg-gradient-to-r from-transparent via-zinc-600/60 to-transparent"
      />

      {/* Report Details */}
      <div className="grid gap-6 sm:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-2"
        >
          <p className="text-xs font-semibold text-zinc-400 uppercase tracking-widest">
            Incident Type
          </p>
          <p className="text-base text-white font-medium tracking-tight">
            {report.incidentType}
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-2"
        >
          <p className="text-xs font-semibold text-zinc-400 uppercase tracking-widest">
            Priority Level
          </p>
          {report.analysis?.priority ? (
            <motion.span
              whileHover={{ scale: 1.05 }}
              className={`${getPriorityColor(
                report.analysis.priority
              )} inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border transition-all duration-300`}
            >
              {report.analysis.priority}
            </motion.span>
          ) : (
            <p className="text-sm text-zinc-400">Not assigned</p>
          )}
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-2"
        >
          <p className="text-xs font-semibold text-zinc-400 uppercase tracking-widest">
            Assigned Department
          </p>
          <p className="text-base text-white font-medium tracking-tight">
            {report.analysis?.department || 'Not assigned'}
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-2"
        >
          <p className="text-xs font-semibold text-zinc-400 uppercase tracking-widest">
            Last Updated
          </p>
          <p className="text-base text-white font-medium tracking-tight">
            {report.timeline?.length
              ? new Date(
                  report.timeline[report.timeline.length - 1].timestamp
                ).toLocaleString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                  hour: 'numeric',
                  minute: 'numeric',
                  hour12: true,
                })
              : new Date(report.timestamp).toLocaleString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                  hour: 'numeric',
                  minute: 'numeric',
                  hour12: true,
                })}
          </p>
        </motion.div>
      </div>

      {/* Timeline */}
      <div className="space-y-4">
        <p className="text-xs font-semibold text-zinc-400 uppercase tracking-widest">
          Timeline
        </p>
        <div className="relative">
          {/* Vertical line with gradient glow */}
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: '100%' }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="absolute left-[11px] top-0 w-1 bg-gradient-to-b from-sky-500/30 via-sky-500/60 to-sky-500/30 rounded-full"
          />
          <AnimatePresence>
            <div className="space-y-6">
              {report.timeline?.map((event, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative flex gap-6 pl-1"
                >
                  <div className="absolute left-0 top-2 h-5 w-5 flex items-center justify-center">
                    <motion.div
                      whileHover={{ scale: 1.2, rotate: 360 }}
                      transition={{ duration: 0.3 }}
                      className="h-3.5 w-3.5 rounded-full bg-sky-500 ring-4 ring-sky-500/30"
                    />
                  </div>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="flex-1 pt-2"
                  >
                    <div className="bg-zinc-800/60 rounded-xl p-5 border border-zinc-800/70 backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:shadow-sky-500/10">
                      <p className="text-sm text-white font-medium">
                        {event.description}
                      </p>
                      <p className="text-xs text-zinc-400 mt-1.5 font-mono">
                        {new Date(event.timestamp).toLocaleString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                          hour: 'numeric',
                          minute: 'numeric',
                          hour12: true,
                        })}
                      </p>
                    </div>
                  </motion.div>
                </motion.div>
              )) || (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="text-center py-8"
                >
                  <p className="text-sm text-zinc-400">
                    No timeline events recorded yet
                  </p>
                </motion.div>
              )}
            </div>
          </AnimatePresence>
        </div>
      </div>

      {/* Status Actions */}
      <div className="flex flex-col sm:flex-row gap-4 pt-4">
        <motion.button
          whileHover={{ scale: 1.05, backgroundColor: 'rgba(14, 165, 233, 0.3)' }}
          whileTap={{ scale: 0.95 }}
          className="flex-1 bg-sky-600/20 hover:bg-sky-600/30 text-sky-400 hover:text-sky-300 px-6 py-3 rounded-xl border border-sky-600/40 text-sm font-semibold tracking-wide transition-colors duration-300"
        >
          View Full Details
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05, backgroundColor: 'rgba(63, 63, 70, 0.9)' }}
          whileTap={{ scale: 0.95 }}
          className="flex-1 bg-zinc-800/60 hover:bg-zinc-800/80 text-white px-6 py-3 rounded-xl border border-zinc-700/60 text-sm font-semibold tracking-wide transition-colors duration-300"
        >
          Contact Support
        </motion.button>
      </div>
    </motion.div>
  );
}