'use client';
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { ReportTracker } from "@/components/report/ReportTracker";

// Client-side only components
const ClientOnlyGradient = dynamic(
  () => import("@/components/ClientOnlyGradient").then(mod => mod.default),
  { ssr: false }
);

export default function TrackReportPage() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#000000] relative overflow-hidden">
      <ClientOnlyGradient />

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(220)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-[#07D348] rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              transform: `scale(${0.5 + Math.random()})`
            }}
          ></div>
        ))}
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 flex justify-center">
        <div className="w-full max-w-5xl space-y-8">
          {/* Tracker Container */}
          <div className="relative group backdrop-blur-xl rounded-3xl border border-white/10 bg-[#0a0a0a] p-8 shadow-2xl hover:shadow-[0_0_40px_-15px_#07D348]/30 transition-all duration-300">
            <ReportTracker />
          </div>
        </div>
      </div>
    </div>
  );
}