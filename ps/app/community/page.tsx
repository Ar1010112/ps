"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

interface EmergencyService {
  id: number;
  name: string;
  icon: JSX.Element;
  number: string;
  description: string;
}

interface CommentType {
  id: number;
  text: string;
  author: string;
  date: string;
  likes: number;
  replies: CommentType[];
}

interface ServiceStat {
  category: string;
  current: number;
  previous: number;
  icon: JSX.Element;
}

interface LiveService {
  id: number;
  type: 'ambulance' | 'fire' | 'police';
  status: 'dispatched' | 'enroute' | 'arrived';
  location: string;
  eta: string;
}

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  date: string;
  image: string;
}

const SecurityIcon = ({ className }: { className?: string }) => (
  <svg
    className={`h-6 w-6 text-[#07D348] ${className}`}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
    />
  </svg>
);

const SERVICE_STATS: ServiceStat[] = [
  { 
    category: "Response Time (Avg)", 
    current: 8.2, 
    previous: 14.5, 
    icon: <SecurityIcon />
  },
  { 
    category: "Active Emergencies", 
    current: 142, 
    previous: 89, 
    icon: <SecurityIcon />
  },
  { 
    category: "Rescues Today", 
    current: 327, 
    previous: 281, 
    icon: <SecurityIcon />
  }
];

const LIVE_SERVICES: LiveService[] = [
  { id: 1, type: 'ambulance', status: 'enroute', location: "Mohakhali Flyover", eta: "8 mins" },
  { id: 2, type: 'fire', status: 'dispatched', location: "Lalmatia Area", eta: "12 mins" },
  { id: 3, type: 'police', status: 'arrived', location: "Gulshan Circle-2", eta: "On Site" }
];

const BLOG_POSTS: BlogPost[] = [
  {
    id: 1,
    title: "New Emergency Response Protocols",
    excerpt: "Learn about our updated safety procedures and community guidelines for faster emergency response.",
    date: "March 15, 2024",
    image: `https://picsum.photos/seed/${Math.random()}/600/400`
  },
  {
    id: 2,
    title: "Community Safety Workshop",
    excerpt: "Join our free public safety workshops conducted by emergency response professionals.",
    date: "March 20, 2024",
    image: `https://picsum.photos/seed/${Math.random()}/600/400`
  },
  {
    id: 3,
    title: "Annual Emergency Service Report",
    excerpt: "Review our yearly performance metrics and service improvement initiatives.",
    date: "March 25, 2024",
    image: `https://picsum.photos/seed/${Math.random()}/600/400`
  }
];

export default function EmergencyDashboard() {
  const [location, setLocation] = useState<string>("");
  const [locationError, setLocationError] = useState<string>("");
  const [comments, setComments] = useState<any[]>([]);
  const [comment, setComment] = useState('');
  const [emergencyType, setEmergencyType] = useState<string | null>(null);

  const handleLocationShare = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = `${position.coords.longitude},${position.coords.latitude}`;
          setLocation(coords);
          setLocationError("");
        },
        (error) => {
          setLocationError("Unable to retrieve your location. Please enable permissions.");
        }
      );
    } else {
      setLocationError("Geolocation is not supported by this browser.");
    }
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (comment.trim()) {
      setComments([{
        id: comments.length + 1,
        text: comment,
        author: "Citizen",
        date: new Date().toLocaleString(),
        likes: 0,
        replies: []
      }, ...comments]);
      setComment('');
    }
  };

  return (
    <div className="relative min-h-screen bg-black selection:bg-[#07D348]/20 overflow-hidden">
      <div className="fixed inset-0 -z-10 min-h-screen">
        <div className="absolute -top-48 -left-24 w-96 h-96 bg-gradient-to-r from-[#07D348]/20 to-[#24fe41]/10 rounded-full blur-3xl opacity-50 animate-float"></div>
        <div className="absolute top-1/2 -right-48 w-96 h-96 bg-gradient-to-l from-[#07D348]/20 to-[#24fe41]/10 rounded-full blur-3xl opacity-30 animate-float-delayed"></div>
        <div className="absolute bottom-0 left-1/2 w-[200vw] h-48 bg-gradient-to-t from-[#07D348]/5 to-transparent -translate-x-1/2"></div>
      </div>

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(100)].map((_, i) => (
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

      <main className="relative px-6 pt-32">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col items-center text-center mb-28">
            <div className="inline-flex h-10 items-center gap-2 rounded-full border border-[#07D348]/30 bg-[#07D348]/10 px-5 text-sm text-[#07D348] backdrop-blur-sm transition-all hover:border-[#07D348]/50 hover:bg-[#07D348]/20">
              <SecurityIcon className="h-4 w-4" />
              24/7 Nationwide Emergency Response
            </div>

            <h1 className="mt-8 bg-gradient-to-b from-white to-white/80 bg-clip-text text-5xl font-bold tracking-tight text-transparent sm:text-6xl">
              Join the community
              <span className="block mt-4 bg-gradient-to-r from-[#07D348] to-[#24fe41] bg-clip-text text-transparent text-3xl">
              Share your feedback and help build a greater nation
              </span>
            </h1>
          </div>

          <div className="rounded-3xl border border-white/10 bg-gradient-to-b from-white/5 to-transparent p-12 backdrop-blur-xl relative overflow-hidden mb-28">
            <div className="grid gap-8 md:grid-cols-3 mb-12">
              {SERVICE_STATS.map((stat) => (
                <div key={stat.category} className="text-center p-6">
                  <div className="text-4xl font-bold text-[#07D348] mb-2">
                    {stat.current}
                    <span className="text-sm text-zinc-400 ml-2">({stat.previous})</span>
                  </div>
                  <div className="text-lg text-zinc-300 font-medium">
                    {stat.category}
                  </div>
                </div>
              ))}
            </div>

            <div className="grid gap-4">
              {LIVE_SERVICES.map((service) => (
                <div 
                  key={service.id}
                  className="group relative overflow-hidden rounded-xl border border-white/10 bg-gradient-to-b from-white/5 to-transparent p-6 transition-all hover:border-[#07D348]/30 hover:bg-[#07D348]/10"
                >
                  <div className="flex items-center gap-6">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/5 p-3 backdrop-blur-sm">
                      <SecurityIcon />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-white">{service.location}</h3>
                      <p className="text-sm text-zinc-300">{service.type.toUpperCase()} - {service.status}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      service.status === 'arrived' ? 'bg-green-500/20 text-green-400' :
                      service.status === 'enroute' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-red-500/20 text-red-400'
                    }`}>
                      {service.eta}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <section className="mb-28">
            <div className="rounded-3xl border border-white/10 bg-gradient-to-b from-white/5 to-transparent p-12 backdrop-blur-xl">
              <h2 className="text-3xl font-bold text-white mb-8">
                Real-time Location Sharing
                <span className="block text-xl mt-2 text-[#07D348]">Instant Position Tracking</span>
              </h2>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div className="p-6 rounded-2xl bg-zinc-900/50 border border-white/10">
                  <div className="flex flex-col gap-4">
                    <button 
                      onClick={handleLocationShare}
                      className="group relative inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#07D348]/20 to-[#24fe41]/10 px-6 text-sm font-medium text-[#07D348] transition-all hover:from-[#07D348]/30 hover:to-[#24fe41]/20"
                    >
                      Share Live Location
                      <SecurityIcon className="h-5 w-5" />
                    </button>
                    
                    <div className="space-y-4">
                      <input
                        type="text"
                        value={location}
                        readOnly
                        placeholder="Current location coordinates"
                        className="w-full bg-zinc-900/50 rounded-lg p-3 text-zinc-300 focus:outline-none focus:ring-2 focus:ring-[#07D348]"
                      />
                      {locationError && (
                        <p className="text-red-400 text-sm">{locationError}</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="relative h-64 rounded-2xl overflow-hidden border border-[#07D348]/20 bg-[#07D348]/10">
                  {location ? (
                    <Image
                      src={`https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/pin-l+3bb138(${location})/${location},14/600x400?access_token=${process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}`}
                      alt="Location Map"
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-center justify-center">
                      <p className="text-zinc-300 text-sm">
                        Your live location will appear here once shared
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>

          <section className="mb-28">
            <h2 className="text-3xl font-bold text-white mb-8">
              Safety Updates
              <span className="block text-xl mt-2 text-[#07D348]">Latest News & Announcements</span>
            </h2>

            <div className="grid md:grid-cols-3 gap-8">
              {BLOG_POSTS.map((post) => (
                <motion.div
                  key={post.id}
                  whileHover={{ scale: 1.02 }}
                  className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-white/5 to-transparent"
                >
                  <div className="relative h-48 bg-zinc-900">
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      unoptimized
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  </div>
                  
                  <div className="p-6">
                    <p className="text-sm text-[#07D348] mb-2">{post.date}</p>
                    <h3 className="text-xl font-semibold text-white mb-3">{post.title}</h3>
                    <p className="text-zinc-300 mb-4">{post.excerpt}</p>
                    <button className="text-[#07D348] flex items-center gap-2 group-hover:text-[#24fe41] transition-colors">
                      Read More
                      <svg
                        className="h-4 w-4 transition-transform group-hover:translate-x-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 8l4 4m0 0l-4 4m4-4H3"
                        />
                      </svg>
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          <section className="mb-28">
            <h2 className="text-4xl font-bold text-white mb-12 text-center">
              Community Hub
              <span className="block text-xl mt-3 bg-gradient-to-r from-[#07D348] to-[#24fe41] bg-clip-text text-transparent">
                Your Voice Builds Safer Communities
              </span>
            </h2>

            <div className="grid md:grid-cols-2 gap-8">
              <motion.div 
                className="relative p-8 rounded-3xl border-2 border-white/10 bg-gradient-to-br from-zinc-900/60 to-zinc-900/30 backdrop-blur-xl"
              >
                <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(7,211,72,0.1),transparent)] opacity-30" />
                <h3 className="text-2xl font-semibold text-white mb-8 flex items-center gap-3">
                  <SecurityIcon className="h-7 w-7 text-[#07D348]" />
                  Emergency Report Portal
                </h3>
                
                <form className="space-y-6">
                  <div className="space-y-4">
                    <label className="block text-zinc-100 font-medium">Incident Type</label>
                    <select 
                      className="w-full bg-zinc-800/50 border border-zinc-700 rounded-xl p-4 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-[#07D348] focus:border-transparent transition-all"
                      value={emergencyType || ''}
                      onChange={(e) => setEmergencyType(e.target.value)}
                    >
                      <option value="" className="bg-zinc-800">Select incident type</option>
                      <option value="medical" className="bg-zinc-800">Medical Emergency</option>
                      <option value="fire" className="bg-zinc-800">Fire Emergency</option>
                      <option value="crime" className="bg-zinc-800">Criminal Activity</option>
                      <option value="accident" className="bg-zinc-800">Road Accident</option>
                    </select>
                  </div>

                  <div className="space-y-4">
                    <label className="block text-zinc-100 font-medium">Location Details</label>
                    <input 
                      type="text" 
                      className="w-full bg-zinc-800/50 border border-zinc-700 rounded-xl p-4 text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#07D348] focus:border-transparent transition-all"
                      placeholder="Enter precise location or landmark"
                    />
                  </div>

                  <div className="space-y-4">
                    <label className="block text-zinc-100 font-medium">Incident Description</label>
                    <textarea 
                      className="w-full h-32 bg-zinc-800/50 border border-zinc-700 rounded-xl p-4 text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#07D348] focus:border-transparent transition-all"
                      placeholder="Provide detailed description of the emergency"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full group relative flex items-center justify-center gap-2 h-14 bg-gradient-to-r from-[#07D348]/90 to-[#24fe41]/90 rounded-xl font-semibold text-white hover:from-[#07D348] hover:to-[#24fe41] transition-all transform hover:scale-[1.02] shadow-lg hover:shadow-[#07D348]/30"
                  >
                    Submit Secure Report
                    <svg
                      className="h-5 w-5 transition-transform group-hover:translate-x-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </button>
                </form>
              </motion.div>

              <div className="space-y-6">
                <motion.div
                  className="p-6 rounded-3xl bg-zinc-900/50 border border-zinc-700 backdrop-blur-lg"
                >
                  <form onSubmit={handleCommentSubmit} className="space-y-4">
                    <div className="flex gap-4">
                      <div className="flex-1 relative">
                        <input
                          type="text"
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                          placeholder="Share your safety insights..."
                          className="w-full bg-zinc-800/50 border border-zinc-700 rounded-xl p-4 pr-16 text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#07D348] focus:border-transparent transition-all"
                        />
                        <button
                          type="submit"
                          className="absolute right-2 top-2 bg-[#07D348]/20 hover:bg-[#07D348]/30 p-2 rounded-lg text-[#07D348] transition-colors"
                        >
                          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </form>
                </motion.div>

                <AnimatePresence>
                  {comments.map((comment) => (
                    <motion.div
                      key={comment.id}
                      initial={{ opacity: 0, x: 50, scale: 0.95 }}
                      animate={{ opacity: 1, x: 0, scale: 1 }}
                      exit={{ opacity: 0, height: 0 }}
                      className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-700 backdrop-blur-lg hover:border-[#07D348]/30 transition-all group"
                    >
                      <div className="flex items-start gap-4 mb-4">
                        <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-[#07D348]/20 flex items-center justify-center">
                          <span className="text-[#07D348] font-medium">{comment.author[0]}</span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <h4 className="font-semibold text-[#07D348]">{comment.author}</h4>
                            <span className="text-xs text-zinc-400">{comment.date}</span>
                          </div>
                          <p className="mt-2 text-zinc-100 leading-relaxed">{comment.text}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 mt-4">
                        <button className="text-zinc-400 hover:text-[#07D348] flex items-center gap-1 transition-colors">
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                          </svg>
                          <span className="text-sm">{comment.likes}</span>
                        </button>
                        <button className="text-zinc-400 hover:text-[#07D348] text-sm transition-colors">
                          Report Concern
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </section>

          <div className="text-center mb-28">
            <h2 className="text-3xl font-bold text-white mb-6">
              Need Immediate Assistance?
            </h2>
            <button className="group relative inline-flex h-14 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#07D348] to-[#24fe41] px-10 text-lg font-medium text-white transition-all hover:shadow-lg hover:shadow-[#07D348]/30">
              Call Emergency 999
              <svg
                className="h-5 w-5 transition-transform group-hover:translate-x-1"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  stroke="currentColor"
                  strokeWidth="2"
                />
              </svg>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}