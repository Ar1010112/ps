import SafetyChatbot from "@/components/SafetyChatbot";
import Link from "next/link";

export default function Home() {
  return (
    <main className="relative px-6 pt-20 md:pt-7 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-48 -left-24 w-96 h-96 bg-gradient-to-r from-[#07D348]/20 to-[#24fe41]/10 rounded-full blur-3xl opacity-50 animate-float"></div>
        <div className="absolute top-1/2 -right-48 w-96 h-96 bg-gradient-to-l from-[#07D348]/20 to-[#24fe41]/10 rounded-full blur-3xl opacity-30 animate-float-delayed"></div>
        <div className="absolute bottom-0 left-1/2 w-[200vw] h-48 bg-gradient-to-t from-[#07D348]/5 to-transparent -translate-x-1/2"></div>
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(300)].map((_, i) => (
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

      <div className="mx-auto max-w-6xl relative">
        {/* Hero Section */}
        <div className="flex flex-col items-center text-center relative z-10">
          <div className="inline-flex h-10 items-center gap-2 rounded-full border border-[#07D348]/30 bg-[#07D348]/10 px-5 text-sm text-[#07D348] backdrop-blur-sm transition-all hover:border-[#07D348]/50 hover:bg-[#07D348]/20 animate-fade-in">
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 15V17M6 21H18C19.1046 21 20 20.1046 20 19V13C20 11.8954 19.1046 11 18 11H6C4.89543 11 4 11.8954 4 13V19C4 20.1046 4.89543 21 6 21ZM16 11V7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7V11H16Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Secure & Anonymous Reporting
          </div>

          <h1 className="mt-8 bg-gradient-to-b from-white to-white/80 bg-clip-text text-5xl font-bold tracking-tight text-transparent sm:text-6xl md:text-7xl lg:text-8xl animate-slide-up">
            Report Incident
            <span className="block mt-3 bg-gradient-to-r from-[#fdfc47] to-[#24fe41] bg-clip-text text-transparent relative">
              Protect Public Safety
              <div className="absolute inset-0 bg-gradient-to-r from-[#fdfc47] to-[#24fe41] opacity-10 blur-3xl -z-10"></div>
            </span>
          </h1>

          <p className="mt-6 max-w-2xl text-lg md:text-xl leading-relaxed text-zinc-300 animate-fade-in-delayed">
            Your voice matters. help create safer communities while maintaining 
            complete anonymity through our military-grade encrypted reporting system.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-4 animate-fade-in-up">
            <Link href={"/submit-report"}>
              <button className="group relative flex h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#07D348] to-[#24fe41] px-8 text-sm font-medium text-white transition-all hover:shadow-lg hover:shadow-[#07D348]/30 hover:-translate-y-0.5 hover:scale-[1.02]">
                <span className="relative z-10">Make Report</span>
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#07D348] to-[#24fe41] opacity-0 transition-opacity group-hover:opacity-100 -z-10"></div>
                <svg
                  className="h-4 w-4 transition-transform group-hover:translate-x-1"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M5 12H19M12 5L19 12L12 19"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </Link>
            <Link href={"/auth/signin"}>
              <button className="flex h-12 items-center justify-center gap-2 rounded-xl border border-[#07D348]/30 bg-white/5 px-8 text-sm font-medium text-white backdrop-blur-sm transition-all hover:border-[#24fe41]/50 hover:bg-[#07D348]/10 hover:shadow-[0_0_20px_-5px_#07D348] group">
                <span>Login to Dashboard</span>
                <div className="w-0 h-[2px] bg-[#07D348] transition-all group-hover:w-4"></div>
              </button>
            </Link>
          </div>
        </div>

     {/* Features Grid */}
<div className="mt-32 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
  {[
    {
      title: "Anonymous & Verified Reporting",
      description: "Submit reports anonymously or choose to verify for follow-ups — your identity, your control.",
      icon: (
        <div className="relative">
          <div className="absolute inset-0 bg-[#07D348] blur-xl opacity-30"></div>
          <svg className="h-6 w-6 text-[#07D348] relative" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 15c2.5 0 4.847.656 6.879 1.804M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
      ),
    },
    {
      title: "AI-Powered Report Classification",
      description: "Automatically route incidents to the right authorities using smart categorization.",
      icon: (
        <div className="relative">
          <div className="absolute inset-0 bg-[#07D348] blur-xl opacity-30"></div>
          <svg className="h-6 w-6 text-[#07D348] relative" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-6h13M3 6h18M3 12h6m6 0v6" />
          </svg>
        </div>
      ),
    },
    {
      title: "One-Click Location Sharing",
      description: "Share your real-time location instantly with responders in one tap.",
      icon: (
        <div className="relative">
          <div className="absolute inset-0 bg-[#07D348] blur-xl opacity-30"></div>
          <svg className="h-6 w-6 text-[#07D348] relative" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 1.105-.895 2-2 2s-2-.895-2-2 .895-2 2-2 2 .895 2 2zM12 2C6.477 2 2 6.477 2 12s4.477 10 10 10c1.485 0 2.9-.324 4.162-.9L22 22l-1.1-5.838A9.955 9.955 0 0022 12c0-5.523-4.477-10-10-10z" />
          </svg>
        </div>
      ),
    },
    {
      title: "Live Report Tracking",
      description: "Follow your report in real-time from submission to resolution.",
      icon: (
        <div className="relative">
          <div className="absolute inset-0 bg-[#07D348] blur-xl opacity-30"></div>
          <svg className="h-6 w-6 text-[#07D348] relative" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h1l3 8h11l3-6H9" />
          </svg>
        </div>
      ),
    },
    {
      title: "AI-Assisted Reporting",
      description: "Generate titles, descriptions, and classify incidents with the help of AI.",
      icon: (
        <div className="relative">
          <div className="absolute inset-0 bg-[#07D348] blur-xl opacity-30"></div>
          <svg className="h-6 w-6 text-[#07D348] relative" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </div>
      ),
    },   
    {
      title: "Hate Speech Detection",
      description: "AI automatically flags hate speech for moderation and safety.",
      icon: (
        <div className="relative">
          <div className="absolute inset-0 bg-[#07D348] blur-xl opacity-30"></div>
          <svg className="h-6 w-6 text-[#07D348] relative" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856C19.12 19 20 18.104 20 17V7c0-1.104-.88-2-1.938-2H5.938C4.88 5 4 5.896 4 7v10c0 1.104.88 2 1.938 2z" />
          </svg>
        </div>
      ),
    },

  ].map((feature, i) => (
    <div
      key={i}
      className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-white/5 to-transparent p-8 transition-all hover:border-[#07D348]/30 hover:bg-[#07D348]/10 hover:shadow-[0_0_30px_-10px_#07D348]"
    >
      <div className="relative">
        <div className="mb-5 inline-flex rounded-xl bg-white/5 p-3 backdrop-blur-sm">
          {feature.icon}
        </div>
        <h3 className="mb-3 text-xl font-semibold text-white">{feature.title}</h3>
        <p className="text-md leading-relaxed text-zinc-300">{feature.description}</p>
      </div>
    </div>
  ))}
</div>


        {/* Stats Section */}
        <div className="mt-32 rounded-3xl border border-white/10 bg-gradient-to-b from-white/5 to-transparent p-12 backdrop-blur-xl relative overflow-hidden">
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-[#07D348]/10 rounded-full blur-3xl"></div>
          <div className="grid gap-y-12 sm:grid-cols-3">
            {[
              { value: "250K+", label: "Secure Reports", metric: "and counting" },
              { value: "100%", label: "Anonymity", metric: "guaranteed" },
              { value: "24/7", label: "Support", metric: "coverage" },
            ].map((stat, i) => (
              <div 
                key={i}
                className={`text-center ${i < 2 ? 'sm:border-r border-white/10' : ''}`}
              >
                <div className="text-4xl font-bold text-[#07D348] mb-2">
                  {stat.value}
                </div>
                <div className="text-lg text-zinc-300 font-medium">
                  {stat.label}
                </div>
                <div className="text-sm text-zinc-500 mt-1">
                  {stat.metric}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Trust Badges */}
        <div className="mt-32 mb-20 flex flex-col items-center gap-8 animate-fade-in">
          <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm text-zinc-300 backdrop-blur-xl transition-all hover:border-[#07D348]/30 hover:bg-[#07D348]/10 group">
            <div className="flex space-x-2">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#07D348] opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#07D348]"></span>
              </span>
            </div>
            Trusted by Law Enforcement Nationwide
          </div>
        </div>
      </div>
      <SafetyChatbot/>
    </main>
  );
}
