"use client";

import { useEffect, useState, useRef } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";

// Client-side only components
const ClientOnlyGradient = dynamic(
  () => import("@/components/ClientOnlyGradient").then((mod) => mod.default),
  { ssr: false }
);

const ReportWizard = dynamic(
  () =>
    import("@/components/report/ReportWizard").then((mod) => ({
      default: mod.ReportWizard,
    })),
  {
    ssr: false,
    loading: () => <div className="h-64 bg-zinc-900/70 rounded-2xl animate-pulse shadow-md" />,
  }
);

const SecureBadge = dynamic(
  () => import("@/components/SecureBadge").then((mod) => mod.default),
  { ssr: false }
);

export default function SubmitReport() {
  const [isMounted, setIsMounted] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Canvas particle animation with floating effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particleCount = window.innerWidth < 768 ? 50 : 150;
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 3 + 1,
      amplitude: Math.random() * 20 + 10, // Vertical oscillation amplitude (10-30px)
      speed: Math.random() * 0.02 + 0.01, // Animation speed
      phase: Math.random() * Math.PI * 2, // Random phase for variation
      driftX: (Math.random() * 0.2 - 0.1), // Slight horizontal drift
      color: `rgba(7, 211, 72, ${Math.random() * 0.5 + 0.1})`, // #07D348 with varying opacity
    }));

    let animationTime = 0;
    let animationId: number;
    const animate = () => {
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      animationTime += 0.05; // Increment time for smooth oscillation

      particles.forEach((particle) => {
        // Floating effect: vertical oscillation with sin wave
        const baseY = particle.y;
        particle.y = baseY + Math.sin(animationTime * particle.speed + particle.phase) * particle.amplitude;
        particle.x += particle.driftX; // Slight horizontal drift

        // Wrap particles vertically
        if (particle.y > canvas.height + particle.size) {
          particle.y = -particle.size;
          particle.x = Math.random() * canvas.width; // Randomize x on reset
        } else if (particle.y < -particle.size) {
          particle.y = canvas.height + particle.size;
          particle.x = Math.random() * canvas.width;
        }

        // Keep particles within horizontal bounds
        if (particle.x < 0 || particle.x > canvas.width) {
          particle.driftX = -particle.driftX;
        }

        // Draw particle
        ctx.fillStyle = particle.color;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      // Reinitialize particle positions on resize
      particles.forEach((particle) => {
        particle.x = Math.random() * canvas.width;
        particle.y = Math.random() * canvas.height;
      });
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <div className="relative min-h-screen bg-black selection:bg-sky-500/20 overflow-hidden">
      <ClientOnlyGradient />

      {/* Canvas for floating particles */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-0"
      />

      {/* Enhanced Background Glow Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-48 -left-24 w-96 h-96 bg-gradient-to-r from-[#07D348]/30 to-[#24fe41]/15 rounded-full blur-3xl opacity-50 animate-float"></div>
        <div className="absolute top-1/2 -right-48 w-96 h-96 bg-gradient-to-l from-[#07D348]/30 to-[#24fe41]/15 rounded-full blur-3xl opacity-40 animate-float-delayed"></div>
        <div className="absolute bottom-0 left-1/2 w-[200vw] h-48 bg-gradient-to-t from-[#07D348]/10 to-transparent -translate-x-1/2"></div>
        <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-gradient-to-br from-[#07D348]/30 to-[#24fe41]/15 rounded-full blur-2xl opacity-30 animate-float-slow"></div>
      </div>
      <style jsx>{`
        @keyframes float {
          0% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
          100% { transform: translateY(0); }
        }
        @keyframes float-delayed {
          0% { transform: translateY(0); }
          50% { transform: translateY(-30px); }
          100% { transform: translateY(0); }
        }
        @keyframes float-slow {
          0% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
          100% { transform: translateY(0); }
        }
      `}</style>

      <main className="relative px-6 pt-32">
        <div className="mx-auto max-w-3xl">
          <div className="flex flex-col items-center text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              whileHover={{ scale: 1.02 }}
              className="relative"
            >
              <SecureBadge />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-8 bg-gradient-to-b from-white to-white/80 bg-clip-text text-6xl font-bold tracking-tight text-transparent sm:text-7xl"
            >
              Submit Report
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-6 max-w-2xl text-lg leading-relaxed text-zinc-400"
            >
              Your safety is our priority. All submissions are encrypted and anonymized.
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-20 bg-zinc-900/70 rounded-2xl border border-white/10 p-6 backdrop-blur-2xl shadow-2xl hover:shadow-[#07D348]/30 transition-all will-change-transform"
          >
            <ReportWizard />
          </motion.div>
        </div>
      </main>
    </div>
  );
}