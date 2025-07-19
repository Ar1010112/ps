
"use client";

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import SafetyChatbot from "@/components/SafetyChatbot";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeFAQ, setActiveFAQ] = useState(null);
  const canvasRef = useRef(null);
  const featureGridRef = useRef(null);
  const threeContainerRef = useRef(null);
  const testimonialRef = useRef(null);

  const sliderImages = [
    { id: 1080, text: "Emergency Response Teams" },
    { id: 1081, text: "Community Safety Patrols" },
    { id: 1082, text: "Disaster Preparedness" },
    { id: 1083, text: "Public Safety Awareness" },
    { id: 1084, text: "Crime Prevention Initiatives" },
  ];

  const testimonials = [
    {
      quote: "This system helped our community report a dangerous intersection. Within a week, traffic police were deployed and accidents reduced by 60%.",
      author: "Arnob Bokshi",
      role: "Community Leader, Dhaka",
      image: 1001
    },
    {
      quote: "As a woman walking home at night, I feel safer knowing I can quickly report suspicious activity anonymously through this system.",
      author: "Md Kuddus",
      role: "University Student",
      image: 1002
    },
    {
      quote: "The integration with 999 emergency services saved my neighbor's life when we reported a medical emergency. Response time was under 5 minutes.",
      author: "Mofiz.",
      role: "Shop Owner, Chittagong",
      image: 1003
    }
  ];

  const faqs = [
    {
      question: "How does the anonymous reporting work?",
      answer: "Our system uses military-grade encryption to protect your identity. When you submit a report, we automatically remove all metadata and personally identifiable information before forwarding to authorities, while preserving the crucial details of your report."
    },
    {
      question: "What types of incidents can I report?",
      answer: "You can report any public safety concern including: criminal activity, traffic hazards, environmental issues, public health concerns, infrastructure problems, and suspicious activities. Our AI categorizes reports for proper routing."
    },
    {
      question: "How quickly will authorities respond?",
      answer: "Emergency reports are forwarded immediately to government services. Non-emergency reports are typically addressed within 24-72 hours depending on severity. You'll receive status updates through your secure dashboard."
    },
    {
      question: "Can I add photos or videos to my report?",
      answer: "Yes, you can attach multimedia evidence while maintaining anonymity. All media is automatically stripped of metadata and processed through our secure encryption pipeline before being shared with authorities."
    }
  ];

  // Initialize Three.js scene
  useEffect(() => {
    if (!threeContainerRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    threeContainerRef.current.appendChild(renderer.domElement);

    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 500;
    const posArray = new Float32Array(particlesCount * 3);

    for(let i = 0; i < particlesCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 10;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.02,
      color: 0x07D348,
      transparent: true,
      opacity: 0.8
    });
    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    const geometry = new THREE.IcosahedronGeometry(0.5, 0);
    const material = new THREE.MeshBasicMaterial({ 
      color: 0x07D348,
      wireframe: true,
      transparent: true,
      opacity: 0.3
    });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    camera.position.z = 3;
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableZoom = false;

    const animate = () => {
      requestAnimationFrame(animate);
      particlesMesh.rotation.x += 0.0005;
      particlesMesh.rotation.y += 0.0005;
      mesh.rotation.x += 0.005;
      mesh.rotation.y += 0.005;
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      threeContainerRef.current?.removeChild(renderer.domElement);
    };
  }, []);

  // Enhanced Feature Grid Hover Effects
  useEffect(() => {
    if (!featureGridRef.current) return;

    const features = featureGridRef.current.querySelectorAll('.feature-item');
    
    features.forEach((feature, index) => {
      const image = feature.querySelector('.feature-image');
      
      feature.addEventListener('mouseenter', () => {
        gsap.to(feature, {
          scale: 1.05,
          boxShadow: '0 0 30px -5px rgba(7, 211, 72, 0.5)',
          duration: 0.3,
          ease: 'power2.out'
        });
        
        gsap.to(image, {
          opacity: 1,
          scale: 1,
          duration: 0.3,
          ease: 'power2.out'
        });

        // Create glowing particles
        for (let i = 0; i < 15; i++) {
          const particle = document.createElement('div');
          particle.className = 'absolute w-2 h-2 bg-[#07D348] rounded-full pointer-events-none glow-particle';
          particle.style.left = `${Math.random() * 100}%`;
          particle.style.top = `${Math.random() * 100}%`;
          feature.appendChild(particle);

          gsap.to(particle, {
            x: (Math.random() - 0.5) * 150,
            y: (Math.random() - 0.5) * 150,
            opacity: 0,
            scale: 0,
            duration: 1.2,
            ease: 'power2.out',
            onComplete: () => feature.removeChild(particle)
          });
        }
      });

      feature.addEventListener('mousemove', (e) => {
        const rect = feature.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        gsap.to(image, {
          x: x * 0.2,
          y: y * 0.2,
          rotation: x * 0.02,
          duration: 0.4,
          ease: 'power2.out'
        });
      });

      feature.addEventListener('mouseleave', () => {
        gsap.to(feature, {
          scale: 1,
          boxShadow: '0 0 20px -10px rgba(7, 211, 72, 0.2)',
          duration: 0.3,
          ease: 'power2.out'
        });
        
        gsap.to(image, {
          x: 0,
          y: 0,
          rotation: 0,
          opacity: 0,
          scale: 0.8,
          duration: 0.3,
          ease: 'power2.out'
        });
      });
    });

    return () => {
      features.forEach(feature => {
        feature.removeEventListener('mouseenter', () => {});
        feature.removeEventListener('mousemove', () => {});
        feature.removeEventListener('mouseleave', () => {});
      });
    };
  }, []);

  // Testimonial Hover Effects
  useEffect(() => {
    if (!testimonialRef.current) return;

    const cards = testimonialRef.current.querySelectorAll('.testimonial-card');

    cards.forEach((card, index) => {
      card.addEventListener('mouseenter', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        gsap.to(card, {
          rotationY: x * 0.05,
          rotationX: -y * 0.05,
          scale: 1.05,
          boxShadow: '0 0 40px -5px rgba(7, 211, 72, 0.6)',
          duration: 0.3,
          ease: 'power2.out'
        });

        const image = card.querySelector('.testimonial-image');
        gsap.to(image, {
          x: x * 0.1,
          y: y * 0.1,
          scale: 1.1,
          duration: 0.4,
          ease: 'power2.out'
        });

        // Create glowing particles
        for (let i = 0; i < 10; i++) {
          const particle = document.createElement('div');
          particle.className = 'absolute w-2 h-2 bg-[#07D348] rounded-full pointer-events-none glow-particle';
          particle.style.left = `${Math.random() * 100}%`;
          particle.style.top = `${Math.random() * 100}%`;
          card.appendChild(particle);

          gsap.to(particle, {
            x: (Math.random() - 0.5) * 100,
            y: (Math.random() - 0.5) * 100,
            opacity: 0,
            scale: 0,
            duration: 0.8,
            ease: 'power2.out',
            onComplete: () => card.removeChild(particle)
          });
        }
      });

      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        gsap.to(card, {
          rotationY: x * 0.05,
          rotationX: -y * 0.05,
          duration: 0.2,
          ease: 'power2.out'
        });
      });

      card.addEventListener('mouseleave', () => {
        gsap.to(card, {
          rotationY: 0,
          rotationX: 0,
          scale: 1,
          boxShadow: '0 0 20px -10px rgba(7, 211, 72, 0.3)',
          duration: 0.3,
          ease: 'power2.out'
        });

        const image = card.querySelector('.testimonial-image');
        gsap.to(image, {
          x: 0,
          y: 0,
          scale: 1,
          duration: 0.3,
          ease: 'power2.out'
        });
      });
    });

    return () => {
      cards.forEach(card => {
        card.removeEventListener('mouseenter', () => {});
        card.removeEventListener('mousemove', () => {});
        card.removeEventListener('mouseleave', () => {});
      });
    };
  }, []);

  // Initialize particles
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const particleCount = window.innerWidth < 768 ? 100 : 300;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 3 + 1,
        speedX: Math.random() * 0.5 - 0.25,
        speedY: Math.random() * 0.5 - 0.25,
        color: `rgba(7, 211, 72, ${Math.random() * 0.5 + 0.1})`
      });
    }

    let animationId;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(particle => {
        ctx.fillStyle = particle.color;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();

        particle.x += particle.speedX;
        particle.y += particle.speedY;

        if (particle.x < 0 || particle.x > canvas.width) {
          particle.speedX = -particle.speedX;
        }
        if (particle.y < 0 || particle.y > canvas.height) {
          particle.speedY = -particle.speedY;
        }
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Slider effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sliderImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [sliderImages.length]);

  // Generate rain particles
  const generateRainParticles = () => {
    const particles = [];
    const particleCount = 100;
    
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        id: i,
        left: Math.random() * 100,
        top: Math.random() * 100,
        duration: Math.random() * 2 + 1,
        delay: Math.random() * 5,
        opacity: Math.random() * 0.5 + 0.1,
        size: Math.random() * 0.5 + 0.5
      });
    }
    
    return particles;
  };

  const rainParticles = generateRainParticles();

  const toggleFAQ = (index) => {
    setActiveFAQ(activeFAQ === index ? null : index);
  };

  return (
    <main className="relative px-6 pt-20 md:pt-7 overflow-hidden min-h-screen bg-[#0a0f0a]">
      <div ref={threeContainerRef} className="fixed inset-0 w-full h-full pointer-events-none -z-10" />
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 w-full h-full pointer-events-none"
      />
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-48 -left-24 w-96 h-96 bg-gradient-to-r from-[#07D348]/30 to-[#24fe41]/15 rounded-full blur-3xl opacity-40 animate-float"></div>
        <div className="absolute top-1/4 -right-48 w-96 h-96 bg-gradient-to-l from-[#07D348]/30 to-[#24fe41]/15 rounded-full blur-3xl opacity-30 animate-float-delayed"></div>
        <div className="absolute bottom-0 left-1/2 w-[200vw] h-48 bg-gradient-to-t from-[#07D348]/10 to-transparent -translate-x-1/2"></div>
        <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-gradient-to-br from-[#07D348]/30 to-[#24fe41]/15 rounded-full blur-2xl opacity-30 animate-float-slow"></div>
      </div>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {rainParticles.map((particle) => (
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

      <div className="mx-auto max-w-7xl relative">
        {/* Hero Section */}
        <section className="flex flex-col items-center text-center relative z-10 py-20">
          <div className="inline-flex h-10 items-center gap-2 rounded-full border border-[#07D348]/30 bg-[#07D348]/10 px-5 text-sm text-[#07D348] backdrop-blur-sm transition-all hover:border-[#07D348]/50 hover:bg-[#07D348]/20">
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 15V17M6 21H18C19.1046 21 20 20.1046 arsen 20 19V13C20 11.8954 19.1046 11 18 11H6C4.89543 11 4 11.8954 4 13V19C4 20.1046 4.89543 21 6 21ZM16 11V7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7V11H16Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Secure & Anonymous Reporting
          </div>

          <h1 className="mt-8 bg-gradient-to-b from-white to-white/80 bg-clip-text text-5xl font-bold tracking-tight text-transparent sm:text-6xl md:text-7xl lg:text-8xl">
            Report Incident
            <span className="block mt-3 bg-gradient-to-r from-[#fdfc47] to-[#24fe41] bg-clip-text text-transparent relative">
              Protect Public Safety
              <div className="absolute inset-0 bg-gradient-to-r from-[#fdfc47] to-[#24fe41] opacity-10 blur-3xl -z-10"></div>
            </span>
          </h1>

          <p className="mt-10 max-w-3xl text-xl leading-relaxed text-zinc-300">
            Your voice matters. Help create safer communities while maintaining 
            complete anonymity through our military-grade encrypted reporting system.
          </p>

          <div className="mt-12 flex flex-col sm:flex-row gap-6">
            <Link href={"/submit-report"}>
              <button className="group relative flex h-14 items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-[#07D348] to-[#24fe41] px-10 text-lg font-medium text-white transition-all hover:shadow-lg hover:shadow-[#07D348]/40 hover:-translate-y-0.5">
                <span className="relative z-10">Make Report Now</span>
                <svg
                  className="h-5 w-5 transition-transform group-hover:translate-x-1"
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
              <button className="flex h-14 items-center justify-center gap-3 rounded-xl border-2 border-[#07D348]/30 bg-white/5 px-10 text-lg font-medium text-white backdrop-blur-sm transition-all hover:border-[#24fe41]/50 hover:bg-[#07D348]/10 hover:shadow-[0_0_30px_-5px_#07D348] group">
                <span>Login to Dashboard</span>
                <div className="w-0 h-[2px] bg-[#07D348] transition-all group-hover:w-5"></div>
              </button>
            </Link>
          </div>
        </section>

        {/* Enhanced Features Grid Section */}
        <section className="mt-20 relative" ref={featureGridRef}>
          <div className="absolute inset-0 bg-gradient-to-b from-[#07D348]/10 to-transparent rounded-3xl -z-10"></div>
          <h2 className="text-4xl font-bold text-center mb-16 bg-white bg-clip-text text-transparent relative">
            Our Comprehensive Services
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-[#07D348] to-[#24fe41] rounded-full blur-sm"></div>
          </h2>
          
          <div className="grid gap-8 sm:gap-4 sm:gap-y-8 lg:grid-cols-3 relative">
            {[
              {
                title: "Anonymous Reporting",
                description: "Submit reports without revealing your identity, with military-grade encryption protecting your data.",
                icon: (
                  <svg className="w-10 h-10 text-[#07D348]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                ),
                image: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxITEhUSExMVFRUXFRcXGBcYFRUVGBUXFxUXFxgXFRUYHSggGBolHRUXITEhJSkrLi4uFx8zODMtNygtLisBCgoKDg0OGhAQGC0fHR0tLS0tLS0tLSstLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSstLS0tLS0tLS0tLS0tKy0tN//AABEIAKUBMgMBIgACEQEDEQH/xAAbAAACAwEBAQAAAAAAAAAAAAADBAACBQYBB//EAEIQAAICAQEFBQUFBQYFBQAAAAECAAMRIQQSMUFRBQYTYXEigZHB8AcyobHRFEJSkuEjU2KC0vEVM6KywhZEY3KD/8QAGQEAAwEBAQAAAAAAAAAAAAAAAAECBAMF/8QAIxEBAQACAgICAwEBAQAAAAAAAAECEQMxEiEEQRMiMlGhQv/aAAwDAQACEQMRAD8A+WywEgEsBLSsBLATwS2IBYCeqs9UQiLAPN2WVYREhfDgQSrCqssiQ1aQCorllrjFdUuEiAFdcItUMExD11xHoBa5YJGTVIK4bBZqZTwY+K574UXkCHhCeGqP2AKMkgDqTgfEwKbVSxCixCx5Bhr6dYbBXwZ4a5oeDPPAh5DTPeuD8GaRqg7Ko9jTNeieNTNHwJRqoSjTPauCNc0nqgWrj2RF1gys0BXBNXGCJSUauONXKMkATZJQiMssEywMEiVIhCJUiABYShhGlDAKzyWkgFxLCeAS4gEEKBKBYVBALIsMqytYh0gSyVwqpL1LDIsQUSqERIRUjAqz6xHoJUhhVCVp5QyJJ2eglrhtzEKlU0Oy9jWy2uts4ZgNOI9MybT0zwmJbw53g7nUfxW/Ff8ATLr3R2b/AOT+Yf6Yth8/uAVWdtAoJOhOg8pym396mzitdwdSAWPnroPxn2fbO5Ox2ruOLCvMC1lz6lcGID7L+y/7lz633f645Z9h8J2rbHfV2LHzOcenSLq+PmPrhPue3dxuwaDi5a6ieAs2u1Cfc1oh+z+43Yly71NVVq9U2m2we/Fpl+UD5b2D3hXSu0nBwFcnhywxPLznWikTsx9nnZY/9mn89p/85o092tkUBVoUAaAbznA6atItn0HzlqoI1az6d/6f2b+5H8z/AOqZPefsehKCyVhW3l1yx0J8zFsOF8MdIJq5pGrSDeuPYZxqgDXNRq/dAPXpK2Wmc1cGatY8yQbLHsmc9cDYkfdYtYJWyJOsC6xqwQDCMFyIIiMOIFhAAsIMwzCCIgakktieQAghBBrCIIBdRDIsoghkEBREWMVVytSxuoeUVJeqvSGFctUsOsm09KrXGFTnPVUmGrTTWTabxEjHhieouYatJO1Kok0uw0H7RUf8a/nA7NsrO26oyfy8z0E2tm7KNVlb7wYK6lvLBBOJFyk7VMbenYYkxLIwIyNQZbEaA92cJ3i7Wtv2mzZq7GropO7YUO69tu5vFA4IKouoO6QSVOvszv8AE+aps5pssW1NoRl2m91Zabrd9bNpsuQ1NWhBP/LwOIO+DjexKxCo8CtSW8Gpcs2XKgHT+0BdiDZgr4eSxLe3/eAyu3bLTaFtbcYA4FqlXZM6EpYurNrk7v3nIVcBczte7XZAqrDvWFufJOQC1VeSatnDZIC1puphTglWbUsSec70bDUNtTwQEdqLDeqKBvBmRamfBG65xYN/juqwyBqHv2Gn3L224q+z7Q2/ZUfZc4y6HGVbB/5lTHw25aDXWdLicj3cDDaqRjQ7Pdk8ANx6QQoxrlyxJ05DAxur2WIqAiJk96Ezs7eq/wDcJtFZm94E3qWUcSVx/MDJOPnwTTEq1WmpmptOwNXx1Gmo5esUsrGkJdnZpnhIJkmgykQFleY5SZ9lUG9UesrgLBKlJnWVxW1Zo3V4irpLlSzrViziP2LFbBKhE3ME4jLiAeM4AwgnEM8E8AHJJJALrDIIJIZYAZBD1iCQRmtYEPSI1UICkxygSaBkEbRcCArjir5esiqj2sQ1aaT0VaZEKg0EmqFoTAjvZ2wm1jk4UDU+Z4ARZBOj7AC+ESRwY558hic88tReE3Tex7Cta4VRrxJOp9YltbZsIX2bFXK8d1xwIPUcMjzBng7Xrd7KFRg6LvEkHdwxIUgnmcH4GY9d7WtWm8xaq0ozj95N4pqeZPsH1Bmftqxx06/uxcWryQRrwIxjy+M28RTs+ndEcE1YzUY87u7SSSSNLD7zdqtUFrqIFtmTvFd8VVqVDWFAcucsqqo1JboDORVkpRncsSXIsb79t20MQN0bv37GZfZVdFC6aD2me29r39u2gDVq/BpxrovhC3gNfaO0OumM8jpldHursCtezkK37OoRGyp3bHB3sAaK61+GpxjV2HAACug0e63ZlyBr9owLbAAKlO8uz1LqtQPAtkkswGCcDUKCd2eyCKh5Od7b2pg24mN9sBc6gEnU46Aa+6dGZh9uAIDbu5ZeHX2iF+c55zcdOKyZeyqhSWQAsRoxzxJAJB6nUE+sz9o7HGpXeHkcY+MjXYWqlWAssOXbmNN+wjpqcDpvDpL/APGdn8b9nBBtADEb2AASeJJ46cOPCZ92dNNwlY1qEHBGCOUXsXBm522i5XGMkHOOYGJj2TRjdzbLlNXRVkzAumNI6Vi9y6y0kL1iNomltCxG1ZcqaQsEUsWO3CKuJ0STcQDCM2rF2jADwLQ7wDQMPEk9kgF1hUg0hkEANXGqxFq42kCMVRytots6xtFk04apWM16QFCxrd5TnThhTp+UNSIvyjOzmTVG6l5Ta7CfG+D5H6/Cc7te1+FW9nHdU4B/eb91fecD3zD7rdrDZtossvd2FoUHOWCsNSVA4KegELxZZ42z6L8mOOUluncds9nizDEEHUcTqDyOPjA7Bs6I1aKME21k44BQ6sfdpj3ieXdto2tW468Sd4AADrzz5YgO7W1patdqPvh3GvTDAboB5D8ePOZcMMttmfJJi+iIMS08kzNTG9knmZIBx/ezbdgNhWyizaLa90OaWNZrDDIW24WVg6HO5vHAbOADmbXdnbNmsp3dmXw0rYoaypRq2yS28DxJJJ3sneyTk6zg9vfwL9oS4mtmte1WcELYrnO/W/BmUHcA0I3RyAm79nezW5uvbIpdK66gcje8NrWewA/u5tIB/ewTzla9B2kkkkkJM/t2rNFmOO7keoII/ETQinap/sbP/rDRztxfbfYq7QFtS1q2UhlZcZ4cNeoODG+yuykoay3OXsK7zMQDhFCgDhpxPvMxts7wps1oRt4g5Z8YwmgI4nOTroAfxmR2/wB+RcvhUB0B+8xIUkdBjUfEThPj8uV1J6aMvk8cx3a6LtHtOqy7wldS4UkqDnAyAc406aecUtUcZ882W81bRXYv+IepxnU884M+h+IGUMDkHUek058P49Rkw5fyWvHGYrYuY0w9Yu0iOhXaEiO0pNDaDpENoOZeJUhYInaI7YYle06RFKWRd4w8BZKIu8C8K0C8DUkkzJALpDpALDJAGqhGUMWpjKQI5Q2I7UOEQpMeq1PpIpw/QYyR0EVqGkZr6yKqLheojVA01gAId7goyZOrfUO2SbrI7z7QCyU45+IxzphScLjrnBmBbYBp9e+MbdtW/Y9hOpO6OgVdB89fKZW1W6anJPLz655T0+LDww083ky88tl739rIyvpx9J9M7n1CnZa3ZgC/9qd44HtY3ePkFPvM+XVU7xAydfomaibadRk4BwATwGBgSOXj85rbphn4dPr9vfVV42U+4MfyMS2v7Qt37oV/PBUcM8Sek+S3baRzMHftu7gHXAOQMnDHXl0AxOU+PjO3S8uV6d3tf2m7aPuigf8A5sf/ADm52F332jaqN5WrW5dHXcGCRzGScA6HynyFrt4ac5u9ydoqrtfxSFG5kE6jKnhjmTnl0lZcWOuimeU7rtts767apIDqpGhBrTI+MHsne/tGzIFg04nwqgF9TuybJsv7cxcruVD2U/dsOcneZtcAgDC40zrrwa7OFaIKrQKCvAk4Vgx0JY/vaa55466ZvxfVrTfkTXqe/wDhrZ+8m0j79/AZz4dQz8F0H4zjbvtG29rHKbRu1l23B4dJwm9hdSmeHnznSd6OzkTZbbS5wE4733s6KARyJIHvnyerQgfQmnjwx/xmyyy/19Y7N+0FiFW6wqx0Dbq7p9cD2T7sTes7QsdcGwspH+HBHuE+G33bwAB8xy14/MzZ7F7duC7gsI/2nPk+Pv3irHlsnt0n2gbDlFvHEew3mDqpPocj/NOGpbXE6vaO2Xsqaqxg+8MHIGeoORjUH8pyd1GNccOX6Tvw45Y46v05cmUyu4YdvZGmq66c+o+GR752HdvbQR4ZIOm8vD/MNOh1zzyTOL2Vs+6aXZm3tXlRwDAj/CQMDHqvs/HrHy4ecTx5eFd04HWLvCi0MoYDiM/HWAtPSec9ALaGGNIi8azprFLjrKhErlESvEctit3SdImk7RFnjLiLOJUIvbAPDWQLmM4pJJmSILrDJApDIYAzXGqopVGVMCO0iN0mJUtG6yMSacaNLYEOLOETpeMJiRYqG6jnUTN7b2vgAc4B+J00l+0NqKV6cSQo9/HX0mFfZ1I4eefz6Ymj4/Hv9mX5HJ/5KMM6DgNB7vOK7UwXTO83IRi6wjhx9OcUZd3nvOefHE12s+MX2FgpLEje4Y/MyeJx8z+kTsyMYI059D5+UGu0Zz1+uMm2Onj9myuDmL2Pg5+vWWVydJ6VB0iPoZRmaXYbhb6idV3wreQb2Tn0zn3TP2VSPZPTQ+X9Ixjjj3StekW6r7b2XsKqWAGBhDgaAH2gRj3Z98JtWwK5G8oI6emZTu9tItVbAfvVVMfLeDHPy901CmumJgtsrRJLHyT7QLDWw2RGYVBUd1zoXLMwPuGOHHScYwOes6Lvltfi7Xew1/tCo9KwKx7ju598wb/ZBPwx16GbcZrFxuW76LAKr4Awfyhaxrn4wCV9eJ1MN90YjgpsbRpxk8XdAOhBAz6xJTpnyln2hR7B4nHDlAvE3ZSPvqND+EvXbpofKK0uynIzjmP6w2/nXGPrylJrquwe0cgVMeXs+WOK+U1rDpOI2O8o6kcQwOvTOv5fjOur2gOgYHiPgeYmH5HH43ynVavj57njfpGOnnE9oEM7acYpY85SO1AsbSJ2nSMMdIo3rLKgWRZ2h3aL2GURdzAtDNAuYGHJJJACJCIYKswgMAZraMVmKqYxWYEcrfEZrs0iVcYSKg/Q/WM5MQpfSFtuwufdJk3dC3U2F2vfkhRjABPv0mVe2uuvrLX265+sxTf1M9DDGY46Ybbld0UrjXHu4ARKzaNdNep/Tyldps5a/GKq+OWevl0iyyXjiK651HH64iIM2G9dffwP5R1m0yJm3n2zjoJzzdcP8aVLR6vHny8pn7GZpIPX4Y5dZ0x6cs1rh0+8PaGufrMPW2RvDn15evnpBk6fWPzgtmbdYryOSPXmNfrSW5dvrP2aXb1CjmEasjp4dhZR/LcPhOq2/aRVW9v8CM3vAyPxE+ffZftoFj08/acf9Cn8QJtfaBt+5sm6M5sfd893JY/KY8sN8mmjHLWG3y2xSc5Px4k84i3tnPIaD5mMbdfoAOLaDy6kSUafhj3Ca2eeoXFeOWIvbk6YPn0/pHbD5j698z9o9ePl/WTk6Y9qbVdhTPNkRjqNCf3sZY+meAim0jO6voJqVHTAkS7rrf1hneA9OP8ASek/Drx/2gcAfe4df1Ehf4es6OOhlfnNXsrbSHC50Y4x68/j85jK+kujkZ9fx9YspuaEurt2LNxidrT1bt5Q3UA+/GsDb6zBpu3sGxou5zC2mLsTKIJjFbIe1oBjGAXgWhXgLIG8klZIARIVRAqYVTAGEhqzF0aGRoEZRoxWdfdE6zDq0AcpOkp2haQo9flKV2dZbbVLIccePrHhdZROfvGxl3HodfrrF7W6/XrJZbj1gCxbgpPnwH4zZtlmJexsyJ+8fQfCVsbGc49Br+M1eyuxXsUb3sg6knn6DnOVsnbtMfXohs9L2HcQEnoBF9u7Pepytgw2BwIPEZ4ifROz9krpXCLjPE/vN6n5Tnu+dHtK/wDFgfy5/UTj+Tyy0668Zth7GcTTB+Ez6VjtT++asemXPsxnT9Tp5cottq5GRxHOGPpj69J5bw589PlLc56dH9nW2r+1K3AtUy8Tod5SR+E2PtJ2oM9CcBus+M50JAX8iZ8+7C2o03E9M/8AUpX5j4TT719rGxlbOvhVoPUrvE4/zGcfH9/Jd68YzFO+5bkPZX0HEiNcOkBs67q4HITxrfrP1rOqLN1LXzn/AHiNph2bPlAXHSTXTGEDUzsAoJYnAAGST5DnH6SQNcj10weYI6xvutTm5W/hsT5n8lM7PtPYarQd5df4ho3x5zP+Txy9tNx8o4WyzT3gfgYJGI1zNDtfsh61Yj2l4gjyPMcv6zOS3Oo+v1naZSuXjocPC73CJiz/AH/pDLdK2i4tzsm04I5afHh+kZtaJdlqQhb+I6egh3Mycn9XTRhNYxW19IBjLuYNtIlBuYBoSyBaADaBaFaBYQNSSVkgBUlxBpCrACCFDQKmXEAYBhlMVSFBgRhePGMo/SIoYdCYrANfsyOfaGT14H4iJ3dhqfu2MPUAj5GNBjCb5j3S1Cmx9j1qQzZc+YwB7uc3K7IgrQ6RX32cOeLpMXvTqtfTJ+U0d7SZPeE+yg82/IR8c/Ys+mMg90urTxF5wn1xm1lotb5npb6+cVavGqmES3TofWNFgVo9vPUH4iV1axQf3VBPqZa1vbXPQ/rBrZgFuJb8pLpOjV12OcWNpPCDClo1XWAMmMulVGOUBtEYZ/r3ReyKni2+5q4ZzjOnzA+ZnS22Gc53UbHif5fn+gm6WmLOfs1Y9PS2dDjHnMXa+xFJyh3fIjIHoeU1GeCsthjbOhZL2xv+CMfvMo9ASflD0dl1rgn2j58Ph+sde2CNkq55UvGRd2gLHnj2QLPEb1mgnMjmUgHjGDJkYyuYANoJ4ZzAMYGHiSXkgFRCLJJACCWkkgBEMJmeSQJdWhkeSSAELS6NpJJCgesy4bWSSIL5mN282SnofzE9kl8f9Jz/AJZqtrC50HniSSama9iAQNw5jjJJHSBezOvl+klaZ1Pp6SSSftUHr8h9YhCJJJSS7tjh9cIuTJJJrpi2u7R9p/RfzM22aSSZc/6aMelGgXbWeSSToVplGaSSMg2MCZ7JAB2GUPCeSQCjTwySQOKMYIySQCskkkA//9k="
              },
              {
                title: "Emergency & Non-Emergency Integration",
                description: "Direct connection to Bangladesh's 999 service for immediate emergency response with non-emergency service",
                icon: (
                  <svg className="w-10 h-10 text-[#07D348]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856C19.12 19 20 18.104 20 17V7c0-1.104-.88-2-1.938-2H5.938C4.88 5 4 5.896 4 7v10c0 1.104.88 2 1.938 2z" />
                  </svg>
                ),
                image: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxISEhUTEhMVFhUXGBgYGBgVGBcYGRgYGRcYFxUYGRkYHSggGBolHRcVIjEhJSkrLi4vFx8zODMtNygtLisBCgoKDg0OGhAQGi0mHyUuLS0vLS0tLS0tLS0tLS0tLS0tLTAtLS0tLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLf/AABEIALcBEwMBIgACEQEDEQH/xAAcAAAABwEBAAAAAAAAAAAAAAAAAQMEBQYHAgj/xABDEAACAQIEAgcGAwcCBAcBAAABAhEAAwQSITEFQQYTIlFhcYEHMpGhsfBCwdEUI1JicoLhkvEkM6KyFUNEY4OTwlP/xAAbAQACAwEBAQAAAAAAAAAAAAAAAgEDBAUGB//EADIRAAICAQMCAwcDBAMBAAAAAAABAhEDBBIhMUEFE1EUImFxkbHRgaHBFTLh8BZCYgb/2gAMAwEAAhEDEQA/AMdtLVz6A9Fmx16NRaSDccfJF/mPyEnuBrfA+GviLq2k3bcnZVHvMfAfoOdaqOLYbBWxhLbsqoO0FXtO7AEs7RBJ005CABpSZt7jth1ff0K5SS6iPTLFq9puHYG2Vtgw7jspAMsqn8RJ3YnWDvM1lvGuA3MOZZHCcm3X/Usir1c6eZGhbSsBIBiCB9BOnypR+l+HvKetRlEaxDgDnpofrSafTRwR2xXXlvu36lKyK/7vwZthxlMMAwI0PzMffKk+I4RrT5WR0MTldSpg7GGGop1fx8YhcRatBES4HRPw9khoI2ExqBpXoniPD7OIEXrSOpggOoaJE8+fjWDxLxP2NwuNp335Low5s87LxW4+VL7G5bAKwdSFMbHcxAI328aaYm21m4VmY1BGzA6git0xPQbAH/0yemYf9pFZ77RujyWMvVAhAsoCSSFBy3FkySASranTMaq0Xi2DPkWOCav5UOvdKjhltt2rrsCTyrV+gvRa2Yvtma2R2M5kmNCdtFkGPjWO2ELEKokkgAd5Ogr1V0c4UtrC2bO/Voqz3wIn61X43myQhHHjfMr+iLYtPqPcG4gL9al8NbAG1V/E8Rt2r9nDaG5dJ/tUA6nxJBgeB7qlMZxFbPvmPzqnwPTbF5mXr2+QspJuoklRimGAxwuCRtTya9IuRBShXE0c0AdUdcZqPNQAdFQmimgAGuSKMmuSaACIoooE0U0AERTbiGI6q29z+FWbUx7oJ35bb11xDGpZtvdecqAsYEmBvoKyfjntFvN1oW5ZtD3Vtm07vDaBnZmVQCIiI3Oh0kbBKyH4p0tbFO925g0vpCAG4mTKrW5GVutJtz2mAgk5gTGgqkcWNosWswqfwu/eJOU5pdZJAzmSI2mAlfCwwN8sCAoW2CZVGmDsCAQI327hUa2SeyXGn4o7pjTel6j9Dq9h/wASwRGwZDHoGJj78afY7pJiL1pLNy65tooVUByrA0Exq3LemeFxCqwLZTH/ALYJPaGndME790VqWG6W4DMgs4TB2uyC9y4ioA0drKqqWOswJnStGOXFUVyRmHDuEYjEmLFl3/pBKjzY6D1NaB0c9mwtxcxjBjv1Sns+GdvxeQ08TU5xL2j4e2v7tWuGNCR1SHugNLEeIBqh8b6f4u9IRuqXutiDH9WrT4gjyqXuYtjjp/xdi/VIAtm22WBoLjJGYQPwKdI7we7SjXbpYksZJqw4vDW8VbS6uItrdRER7V0lSxUZc6sdGJEaVC38Cybx/qX5a1XJMZUhrQrrKO8UKWhjZuhHDUweAu49ll3H7pW1EzltzptmM/7Cq2nD8TfLlUvO8nMxS4JYnU6jtGTOlbC+DVkS0oXLbKwDsGUQsgb8zrpIHMUuG/DeUgjZh9615T+uThKUoxu31fZdkZ5Yd9bmYy/RbFKstZuf/W4A/wCmqzxS0wUqVhiY7tBqfWvR2IS6BK3GK96Nr9+GtRXEuDWMWpF9A5ggXFAW6s98aP5GfKr8X/0PvbcsK+Qvsm13FmEYG+jr1dxRMQG2DDkG7j3MP816B4Zfz2rLwIa2h5yDlEz4zNY10k6BX8PeVU7du66ojr3sYEjcEcx4ac42vgmFRLZw6CBaChe+Mo1PiSGn1rN45kx54Y/Ld3b+xfju+Re5Zqme0rhwfCZuaOAf6bn7sj4sh/tq8C6QpX0nuqp9Krf/AAt7vhT8HU/lXC0UlDPjlF919+hZMyn2VcF/aMarsJSyOsPdm2tjznX+2vRdu8LaE7wPjVF9knABYwKXCBmvfvWP8p9weWWD6mrc753j8MFQPPn61v8AEtY8urcl0Xur+X9f4HXERtheCqcWMUDLMvbBJOuWFZZ20kR4/GY47w4XrZP4l1H5immDuBNz2ogCpO3ilVM1xgPP8hzq/wAN1TnKMXy/4XT7iqKjbXzITgWJ6sZW3FSycUVmyioDillHfNbJynaNKZ4O09u4GkkV6yM2uCavkvybV1FQA42ogEipaxjFYb1cpJiUOYoqAahUkAoUKFABUVHRUAFSOJxCW1LOQFG5NdX7oUSfhVc4vdtuCbpBCgkk+6gG5jmfE1DdEpWV/pF0+Qqy2QwEEG4TkC+IkEk+EeWtZTjcchYt2ySudmuEliCSFJJ2ZpEDkDJnanfSziKNdzR2UHWZOWmlsXP4mLkDLyhvCqneuscxuMSx1Yn+LaD4AHL4dqk6llKIV3GZ8zZRqf5hCjUAa6RGndtTa5enfaND8hPca5v3QNADI0nlsJ085+NJNoB4/Qf5n4U9CWKI0hwd/e/L8xT3BYyFhQob+OJb0JkKeUiDpUbaeJ03EfMH8qfpZCkgdwP1q7BH3rKssvdE7xJMkknmTvSEU6daSdNCa0yRVFjW5XFdGirNJGhBUVHQpaA9R4ZMxKk5W1II+niKkJMZbwn+dPzFRoYHtryOvgedS1uwlxZDFSd6+Z4rlcUufiCE04efetOD98xSy2X/AB2gfEUQwJT3X17uVM8b0ot2OyzBn/hQ/U8q2YNK8ktm1p/Cmv3uhrokmwciSAdZAYQQeUb6jvpjgsNcXFOxX921lRm0gOjuSD6OPhVbx3SvEvqsIP5d/Vj+UUja6SYksIYnvQhZPkY1+M11v6LNLcuvpf8Av4FeRF2vWZ2iar3SrAPcsPbUQ1zKkxqCzqC3iACT6VL4S6biho38x6GefhSd8xcEsDpMCeWnPzrz2SShLelTT/dFsY7uBR8ttUsoIVVA8gNAKXsqjqDIDCu7WGzLDbmT8ageM2LoMLsBvMazoYjXT86mMGmpS6Nd/r9RcsqHGNv9UbjcwdvEgEAfHeoS9fuXDLNr8h4AchUdxfFuMSASxzW0IHiCyyAOZga1Z+A8MXRrxE8kkD4/pXofDfI0mLzptbp9PWvT8lW5y4HPB8NduLBAy/xRH03o+qZLjIw1HPvHIirRZYaRHptSXEMJnGYDtLt494rqQz+Y7LFaKtj+FC5XGGt3LXOQKnFGlI3k0Na0q5G68Dvh3EAw13qTDTVSvtkEg064JxwXBBOtOsiumK48FjoVwjzRzVgh1RUU0zxXEUR1tzLvoqjUmBJ+QJ9KAsYcf4latkI9xVZvdzGPDSfWs49pePyW0wysc10h2ynXq1M7+JjTmFarN02w/WFLtxOzZzNlIksCpE6ToCQfjWK8e4kLl17hJCzlUHQ5beyrpIJLKf727qzXJ5GmuEaYpKFkZjXGcLvANxhy0E20k6kR8S576Z5joWggR4Sdco+JZj50ZYsruRqzAachOaB65aUsYJ391SQPPcxLD5egFXWkuRKbfAzNuTlBn7kk/Ck8Q4J02Gg8v1p3ikKSCpDt3yCF56dxnfwPfTCmQjBVgFr3CeYg92on6j51BWVJZR4j01qcuQqBJMLHyM1ow3yUZa4E8QoGtRuJvk9nYDl+tL4y9pTGnnO+CMcK5CNCgaKqmXB0VChSgeqGtj31IIbu2M0ld4umFUs4JBMKBuTrp4bH4VROH9PipAxNvKDuyERvvkOvnHwqU6X8QtPYtBXQ9YwZGGugB7SkcjIHrXgcXh+bFq4RyR4b7d135BsZcZ6cPdJVCVG2VQ2v9TRJ+lMME2fe3r36ipLoY7XbhS4q5EALFVUEzsBpudfgav1rBYbNIw5P9xj1r02XX6TSPylw/RL7i7WymcP4TcunsITHPZR5k1aMB0QH/mvJ/hXQfE/pVnwu0BAoGw/xTpVHhVXtmXNzF0v3/cfYkRbcOCJCiI8SfPemd+0mZSNwIPxn8zViNVTpFgskPZZlBMFVOgO4IHLnXJ1vhrySuLVvrf3HWTaiYSy24IIPI8qrvGc1q07OR1aAme4TPmaYjiN9Ym48TG9RWHOI4i1+yHbqrar2iTDsdQuvipny8atyeENxVPn/AG+pTKdnfCMQMQ/WkZFgKub3yoJMnuEk6VbsJh7cDKy+u9VjhlvDYZQLpC3Boymc0+QEmamT0js2lzMFQbDrGClj4LvXEy47y7drrpVMsi4pW2WPD4EDmSfCnLXAn/MuBfCdf1qn3ellgrIuNcMbWgxC92gEmk+C4nD4kkm+Gg9osdZ7iNwfA7V6HQaSEIPJkjsj8X1+a/L/AEFeWL4i7LZdRDqjAg8p+nfTe8ulL4bhFsahiQe6APkKc3sHpp+vzrtwnB8J8E2ym8Tw7v2VYiecVXsZgb+FHWglgNTA1jv8a0A4UTv9KQ4haVkKnmIpsmCMlyCbfQjOjPShLqjtCrXZxKtsayrAdHrlu44T3ZlfCpexexFhte0Kphmnj4mr+IrZfcdiltW2uMYCgknwAqD6LWnu2f2t1h73aQEarZ3QeBYQx8IHI1UPaT0mCYIW3kC6yq45m2WHWAR/LmHrV/t8SHVC7bZHtkArlYEMvLKRW1O+SF1IfphexAwzNZClgQO1sA3Zcwe4GRPcK828WhWtgGQttQARGkkkEciWLH7mvRXG+OZrbnIQgUyDBJAB0naTtWEY+wrXlKgAntOG1KjMJCnYj3txyqqTqVvoaFbjSXJF4LBvecADszO8D+bflPrVuGAxVxerwsllWGNrKgUHWC7do6A7RuNKrmDvBFbvJ576aAeW/wAa6tdJMTbttZs3Mqs+eV0ecuUjN3QB8KSTlKXHYsglGPvdx50uudWtu2125duQMy3SzBSBDMCxlcx2H8pOxBNUC5iAo1PKu8SWJLMSWJkkkkk+JO9O+DYZGfNcupbVde1JJPIBVBJq6FRXJRmdttIXw+BFuCT2vp5VKcJ4K2JYjMVUbtE1I2ujwvJ1lvEI6d6jY7wQTINFheP2rA6tQT3kVTqda5QcNNzJfDp9TFCMt1zGfGuiPV22dLjOy6xAGnPbnFVCrpe6WjUBJ9aqeOuKzkomQdwMj/FGieoprMv14NNrsN6KjoVuJCoUKFKBtvSvoP1Vw3zrh1Exvl33Hd41SYuSXIi2dFTwn8P3rW7FbkxmmN9GYeXu61C8Y4VZc58QloePbtn0gCa8rpfG1GKjli3XdU3/AAS4V0K50AJIukToU7Xlm7JG8id/s6Bw7iR2MVkhvYazfz2sX1IU6g3rbFgORRVYkeB1qy8J6YYS/cFu3fXrOWjKG8FLgSfCsHiGPJLM9RiTp0+j4479hU6NRt35pwt2qxw7Ha5SYPcanbVyas0usc/mPY6vXlgZjAprce28jLmHMtoPWmmLJdwq7Df86c8RxIsWjl0J0Hn3+lX4smXVZnGNJLi6t38L4G4S5IbifB0cZrcgAjYaeck6CqkenvDeHE4dGe8e0ztbCsM/JS0gTpGmgjWp7Ds57TExyE71It0MwOMTPisNaZm/EFyPHI50hvnXfw4XhVzlb+i/T/LZTXNoxXpX08u49gRbWyinslSTdPgz8hzgD1NRGFxJ1cn1O58yd603j/sVUktgr5A//leE+guDbwkHxNZLjke3cZLqlGRiottocymCWHcD8fKrobW9yMOfHKTpk1b40+cBTGUSWmMs7eflVj4dxtQ4vjs3AR1gERcA3B8d4O4ms9Z8gljLHUL495rvDcQJJ7tPXx9afLjhlg4TVplHlySuB6m4DxJL9lLluCrAEf57jUqLgrMPY7jg+Dyg6q7qw/uLA/A/KpLpt04XCP1FsjrIBdt8k7KP5o18AR31xdHOe54l2bX0Om8yjj3yLbxW2m+dbb/zEAN5z9apnFePolzqmaH/AITv/t41XuE9JDeY51j+bNJM980piOAJxJ1ew5V7Rg3VUshUHtpOiuw1gA6HeAa7Kg1wyvFqVLlFs4XfDEQJJ7t6kcdatAS7BfAdo/oPjVJs4vF/8qxaNi0NDnIN5453GG39K6DxoukN25ZsZ7jHT50/BddnXTDF8LLJ+0Yd7+TtAM5Cg+SMJ8jIpS90kZcKv7Nw9xYyygUNoh7UiBA3kAGPGqv0C6O3OKX2v3gf2a23a3/evuLanuGhY+Q56bYvDkyZSihMuUIAMoWIyxtEcqlMWcXLo6M+49dQWbbzmVyMhXZpEg/0lZrGuN4rK7ZREXLig+CkEf8AdW49JOjTW7VlMNPVpcJFvRiALdwhVzfhnLufCspuYg4m4qixaUqSDltgHNzJnUMYE+VHl70PHI4P5lKe6Wqb4RwvMJI1+vlUhxjhxtuNVz8x4aQfPb4ipjhgUgBhB+nlWPPPbwjdp4qfLK3j+COydhZPhVYKcvpWqdL7zYfCae9dbIGGkLBLHzIEf3TWZM0EKolj9gCrsFuNsq1FKVIdcMxNyzmyEgMMrDkR+o7/APNIPcUT3x8D50o2HeDnYiN4BPlJHeabYjDFCQZBG4OhB5gg7Hwq6knaXUy0m+REmioiaOrExgUKFCgAqFChUAaLjPa/jW0toiDxJb/ty/OqrxTpTi8RPW3WyndUhQfONW9San73QrDMVW1jFR3bKq4gAKdJM3F0A07jqR6WvhfsaQQb2IV/6AQvxma4jnotLy4U/inf6X+SFyY9C9/yqT4T0dxOJI6my7D+I9lP9R0+Gtbxw3oHgcPBCpI/EUDN6M5JFSNy/h7fJm8z+lYs/j/bFHn4v+F+RtqXVlf6M4HFWrK28TdF1191lBlR3Fjq/nAPnVq4XxSDlfyB+9qhcVxpjogC+QmopsYwJJYknkY+grgrzJTeThP4fgqlkin7ppWHZUGYnUn61XOP8UzXSBsvZHdP4vnp6VFp0jZLcurHIGZVGpJAJAnn5eNVXCcdFwTmAJmJIOvM16PwOLlu4pL7vqxnOy84BDcdVJksdfAc/lNXm3AHcBoKznoheVSzSWjsgzpO7fl8atdm8WhnYQJMch3Ua/xGMM/lLlr6WNEnevGwrnE4a3cXLdRHU7h1VgfQimdnGp60ut8HnT4tcmr3WMZ90+9m/DHtm5bRrF1yFU2fdJgkZrZ0yiJIXLMDWss4n7O8XaGayVvjmE7Lj+w7jbYk+FX/ANqHTBlxIsWWANtNdAe2+pHnly/E1T7XSRjrcfbuMfKu1gucFL1Oflz7ZNJcF66CdHrmGw9ltUuFczg97EsVYeEx6VSMTYUY65bxmdbpuO3a911LEq6nmCIHhtyq9ezTir3muXGYlV7KjfXny8VHOtAPVmCVUnvKie86/Cox6aKm8kVy+GPkgskFfHcw3hGHTFYvqbethCetuIDDjlaDDTzPpzNa/gcUloAKFVEVQAogASdABy0Aqb/aPGmuJW25hrYM6E7GPTzNaoRq7DYoxShxX7ieG4nbvNkgExOoB84qn+0jotiMZZAwrKWQy1omC3dlY6A76GAe+pJOGYNLvWWrj2rik6BgRPMFT+tSdq7da4pm0y6ZmQkGO9lPkY1NPLFFiQzS6P8AbkqfsruY+1b/AGW9gjbw9rNlvPNpyxYsRkI/eSxPaECBueeiveMRz2o1ik28Kz0bBrjrwRHuPOS0jO0DWFBY/IVitziNrO+JChesJukfwzLET4A1p3tExPUcLxlwk62mtjzuxaH/AH155xGIfqFQAl7pCKokkrzjzOUfGlcdxJKcFsXMbea9EtcuG2kzCItq5duQO/KEA8WPgauXCejrEBmB079NafdE+jrYPD4cXAou/vS4n8Vwrl12JCIFjxMTUf7RekDWbf7OpHWXQcxUglE5zGzNt5T4ViyLzJ0jXgyKEWym9OeL9ZeKq4Nm12UCmVLCMzac5MT3Cqth1/FzM7gH73FFi3BbKNhv584rgHT1rdGKiqRmlJybbHxv7EBSQZEr1hB91bbluyVgEgAH9G11hlAGw92RlnUlmOpBI1WfLuoHbX5mAZ0BAHcJ376SZvsE+UQd5IBoFEGoCgaAqUxg6FCipyAUKFCoAs/GcWMQ6BVKZQQuaCZMFjE6QAB4SakOBdKsbYOSzecoPxHUfBpDf5qPBu4p+tvGSBEqoUwCSASBrEwPAAchU3bt6jSe/wC+RpJQjONSVnPzZtsqi/8AB3xDpPj3/wDVOD4KnwjLUBiOkvEE1N8kd+Vf0q1DBow5D776jMfwiCY8/j/mazexYF/bCP0RVDUSj/dyQQ6YYo+9dc+RVfolPuFdKmLRcvNbHeV6wHwMQaheKcNy6qPMaRUVRLS4ZKtqX6L8HRxuGRWi9dIunGYdXhQfG6wgnvyqZjzPwqmW8W6kkMZOpkzJ8ZpGhTafTY8EdsF+SykXvo17Rnw1sWnshlE9pSQ2pnYyCeW4q7cN9o2EvQGudWe64Msf3ar86w6nDYG4La3ijC2zFVY7Mw1IHfFYdT4Pps8nJppvun+SHE9IYPiSOMyXA4PNSCPiKfX+OpZtvcuGEtqXY+AEn15DzrzBZuMplCVPepIPxFPMTx3EvbNl79x0JBKsxaYMjU6xPLwrm/8AHpRmnDJx34rghWd8S4s9+9cvOe1cYsde8zHkOQrn9rLEKoJYwAAJJJMAAcyaZ/sxgHvrSvY30XDucddAItkraH88dpz5AwPEk6QK9OvdVIr2Qkyw9D+IW8LZS2eyyqM2YZZZu02h8R8hV1wPEAwDAzOsD5U7e2G94A+YB+tReI4Cs5rDdS3colJ/o0j0IqzDkjGO1/UjUY5znvj04VfIlrOJk+6fPQ+uvl864/bXliozEKSFG5IJgannpUQbOMWSVW5pE22yk77h4A9Cab3DHbuG9YYDuOUyS2pEqSJ0/OtMdr6MyS3rqmSuL4kkHr8ISSI1tByRppInSmlu/gywhrlpzsCzKPVXEAbfKo21xu8zhVvW2UkLoucawBmIad+5astnB3yQH6nJzy5if9JUCmb2dRFHzXxz+iJnh91OrWGLgD3mOpjnpSi3CdoPrH1pEWoEAfClLeD55tO6sTds6UVSozn2odLcgGHezmtNnkwZZ1ByqAeUzr3xy3jehvs/Wz1eJxXavjtKg9yzptp7zj4DSJiTb+keHtXr6oyhxZZbg0/80e78DJ9Kc4XFsRqNfGsuTJ/1HIHpLjbioRnNu2FLu4MEKNxpr8O+sG4pjizM2xYmNSSF1G5Mn/etY9rvGmSwlhWg3WlgIAyJEjw7RT4Gsauakn0H0qdPClu9SO4ktdqNK5NKL7v39+laCTrlsfgPz1pJz9n77opX7939fWm9ABUVChUEh0KFCnIBQoUKCS3cPxIG2s6yfl5CKdW+JWi0ZxPhVUsPmkEwDprsBz+WlE1xV1RoPkINFnNelTbtmg4XFoWADCe6RMfZp65UkDvBH5/lVPs40rC3IDxrl+U9xpZ+JHMp7v0pqRlcGnRJcU4cCDFUjiWFyNER6/lvVn/8Z5GojjF9XHjv4+MUsol+lc4TquCDpzgMDdvOLdpGdzsqgk+fgPGtJ4D7J9FfF3u49Xa38i7D6D1rRuD8Kw+ETJh7SoOce83izHVvWqnI6pn/AER9lRkXccRpqLKmf9bD6D41x7b7aoMGiZVVRdAtqIAH7sAgDQDSK1G/jrdtC9x1RV3ZiAB5k1jPtf4xhsTfsmxdFzKjBiuqiWlQDzO/yqFyyCiZ4FLYLDljPL60lYslj4c6kc+UaelWJFOSVcR6iOJYgwx25D9a9A+zfAdVw7DA7snWH/5CX+hFee0V7txUHvOyqPMkKK9S4SyLaKi7IoUeSgAfSlmx8caQ40FGIriuhSFh1QopoTQAjftwwYeI/NT8R86o9r2h4m3ev2blm03VOQMuZCV0IJ1ImDyAq/Ms6femv5Vk3TLDdRxNWjs4hR/qXQ/IipsgsPDvafibl5LI4fq50br9AvNiOqqwdM+k7YfD5bTravOCFYw2TTVtRBI8RvFNOD8OSyM+WDG5rI+mPHzib167PYH7u2OUDc+p+gottk0XrhPF8+Gt3LlztHR3HNh3/OprDcUBT3w3iDWJcH6QlEs2nP7sXmLEfwsuXbnGdj6CrraR7UhWVkOoKn4aVjzRcZEMrHtD4j12NbutqqDWeWZtB4t/01ViPlrTvid4veuMebHl4/4po50PwrdBVFIgRHOll937P+1IClyNB6d/+1MSE4+9R9aRalSfv/BpJ96CTmhQoVAB0KOhVhAVChQqAFsVYa2xRxDAwRR2ripqO03Kdh4+NTvTTDZLquPxr2vNYUH4R8KrhPhSJ9yGr4HCYrWTMnnS64naTTHN4UU1NiPEmOr16abs5PPauJrXegfQG2trPjsOpu55QM5MJAgMqtlOs6GfGolIeMEjQ8A4e2jAkyqmSIJkAyRyJp0LNBGiuus5VTZYZ77aAwwdobA3wD49hyPTT6VjYtAe8fQVZ/aT0juYvFumY9TaYpbXl2dGfxJIOvdFVRXirY9Ct32F/wBoOyiBXIc7zTjDsjabGu8ZaAG/rT0U7knVEx7OMCb/ABHDrEhG6w+AtjMPmF+NejIrKPYfwiBexZG/7pPIQ1w/HIPQ1q2eqpPkvQBNda0QNHNQSGKDGjUE6Cui4XbU9/IeQ5+ZoAIiBJ3Ow8O81S/aZwhsRhustj97ZPWLG+m49RNW9nJ13pNjIINSBmtjpRdxeBKWiqvlysTuNIJAqlcU6K3+rUW4aBsO6pnphwy5w3FHEWBNm4ZI5KTuD4GpDgHHP2qLWHQda3JjCqv4naNco+ZIFR05C/UzvhHC7j4i2nVMwS5bFwZGdVBbXOFB0ifga0DpNwE5mxVi5kt5WZoOXLlGoI25Rt4VdeGdG7OG6x7Qcvd1usWJzGSZyTlEEmIGg0qA9od7qsLcIYhruW3AiHBPa0P4subUcgO6s8575pIVmNs3fz1+53rm7oo+P1rp9dO+uMSda2ghEU5unUCdvGflSNg9off0pS40kn85oJCf750k1dPXBoJCoUKFQAYoTRUKawDmhRUKLAt3TNCxtNMrBWfHcD6/CqrcWDr8qunSlVbDFtJDrqPUd3jVLL99Iugvc4JoUKl+iGAS/jLNt/cJJbxCqXjyOWPWpGL/ANCvZ6bVy3iL7q0KHW2BIDESCxPNZ2HMAzWm27YjvFRlu9vpSoB0Oc/f1qpuwJIEaGaacbxy2MPdvGOxbZte8A5R6mBXGUMNTWfe1vjypaGEQy9zKz/yoDKjzJE+Q8RQgMpLSZO/PxpRbo7ppEV2oq4VpCj3z/CBRG7O4+dSWFszhrtwj/l3LQPgrrd//SL8addB7Nt+IYcOAy9YDlI3gEifWD6UMRfI3ToLgP2fAYe2VytkDMOeZ+20+OtTl1QVI28fHlTcGuxc8aqLRbDXAwlpHIxrBGhpUhB+InwAj5k1xglXtMdp0G3IT9KWu2OybgXRQTA/EQJAqaARuXTEDQd3699INeUbkVnHSHi+It3rotXVtrbKWyWXMXbQkJrq/b2jlz5OOHcQxbtnvDqrRGnWEK0ggghfeZTBEkA67Gs7zPsjYtMu7NAzSJBBHhQ6tiJAkb6d3fHdVMxXGrVlhkcksf8AaRyqFx/TZLbE5f3q+4wMQPE7x4c6jz/RCvTV1ZbOM4zCsrJe7akaryPrvUZw7jFog27CJaVIC5QFCzJ9RI1HPeZiqbeuXsfetmxlm8qlwWVMhzlHcIWll7OeFnfYaCr5h7+HtWupuJbW2uhIA32YupmSY1OtVylOXDFzLHjW1dRS50lS1pfmye9gerPiLg7JB9Kzv2q8YFy5bsqwKoM7QQQWYQu3csn+8U74t0lt2SRg8+U/huHNbPkjSQvjIqkYjCZ2LaAsSTEAamTAGgGvzFaMOGSe6RksjFfc1xBYwKkrWAUakk7wDEHWKUKhR2eWs+m/z+VaqJsYtZCrIOvOfypA6DXzrq5dOafgO6k2M1BIbVxXc6fffSdQSChQoUAChQoUAChQoUAW/i97/hnBglsoEHUQQdRHnVRqXxt1mQtJMZfIakajl86jrEayubTviPhvUIBCrd7PbdoXmdw3WIuZNezDDKTG53321qpNUlw2+1vtBu02hAOuUQfT/FDA2D/xURMiBuT6GTE99OV4tqSCCPhGm2sT6VmdjiLqZLMfASY8ddP9t6lcJxNzlJJG+5nUHlO9JtINBw2OzAFSplZJER6Caxjp0lz9uvtcB7T9k8ioACQefZy1b7nFCi5sxAGnLfb09aZcWxtu+At23nAEA6ZhO5UwY5aa1MVyFmfV0rVKNwuSSmYLuJG3gWkaeIHpS2F4QgI63WeSnTyPP4VohhnLoiqeeEVyx10atm5YxqTAayCB3vabrxH9lq9T32acNd8dbuaKLUuc0gtoVAXv1IpxhSlqOrAXy8t/hI9TTxsad5g8jJmR/itPsTrlmV6xXwjXFvjv186c4dM595AOZZgPgOdY5d4kWCkEBlMjmQY1A+lL3OKsQrA6jUfQ/pS+wf8Aob21ehsicQtWtriaeMknyG1cYjpVh1WWLN4KOXfqR8qyMcbJ3I+lNL3E2P4id++njo13Yr1noiwYTpFhbGOuokW7d189lmVMtq6wytIOgGsg6bkedZ43wHHYu9nS6t4MzyyXP3aFGgzJBUdwg6bU1XKbik21udoHI/utrqpAIOp8edXPinF8Ph1TrEtWoIjD4ZYBY6Q0QG5bjf58/WYY4JJx5vsdTRZnng1Piu426Mez1FXPibzO3Lq2hF/pZllj/Np3cpqB6fcIwmEe0tpXd2BdjccsImFGXbU5vhWg4fjauiubTLOwYif8VmftNx63b9txMZMsjbssTAkcsx+NZsM7nyaM+OsfBF4zj1x7YtaLbkEqqqo0AUbDQQIgQKYLjjEDQdw079fPzpiL48fl+ldoW3W2T4wT9K2JehgfxHBxesn7+4roYrwn8+URTFrrDdQOXu1w2IJEaDyAosmhW/i2J3jypEXSP860lQqLJoOaE0VCoJDoqFCgAUKFCgAUKFCgAUKFCgB67LBBnx+XLvpBrPcfs0KFWRimhJNo6OEO8ilsPheZPwoUK0LDGyl5ZUSdq8ANJmNDMc9ZEa8udH+2NMzQoVasUF2K3OT7hG+x510Lpn9aFCropLoUy56nVhjqJ2pciR86FCrI9CmfU7D6DWkxfA+/GKFCpbIUUwkvaka7yPX/AGNcDEkbEwdR+fz1oqFVuTLFFWA4hgfmPzFAYo8zv9/fnQoVDmyVBM4F4kysyNe6ImfvxpPA3rhvZgDdukaB2HPmSTr5UKFY8yWTiRrwyeN+6X/hvCOIXE/4h7agjsoNYHjBj5mnVzonhmA69nuxy9xR5QS3/VQoUkNNiTuizJqsslTY4tYTC2P+VZtoRzCDN/q3PxrjEYwcyT50dCt8IIwTkyCxfEAG0UE85GhHcaa8f4fhrmEe+lsAgEiNCrA67bjehQrJ4ljioxmutpBo8knNoz1xtSZFChWRnUQVChQqCQUKFCgAUKFCgAUKFCgAUKFCgD//2Q=="
              },
              {
                title: "AI-Powered Analysis",
                description: "Incident type , Report title , Description, Department classificaion and AI powered chatbot",
                icon: (
                  <svg className="w-10 h-10 text-[#07D348]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                ),
                image: "data:image/jpeg;base64,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"
              },
              {
                title: "Real-Time Alerts",
                description: "Get notifications when authorities respond to your report or when similar incidents occur nearby.",
                icon: (
                  <svg className="w-10 h-10 text-[#07D348]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                ),
                image: "data:image/jpeg;base64,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"
              },
              {
                title: "Community Dashboard",
                description: "View anonymized incident trends and safety statistics for your area.",
                icon: (
                  <svg className="w-10 h-10 text-[#07D348]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                ),
                image: "data:image/jpeg;base64,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"
              },
              {
                title: "Multimedia Support",
                description: "Attach photos, videos, or documents to provide crucial evidence while maintaining privacy.",
                icon: (
                  <svg className="w-10 h-10 text-[#07D348]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                ),
                image: "data:image/jpeg;base64,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"
              }
            ].map((feature, i) => (
              <div
                key={i}
                className="feature-item relative overflow-hidden rounded-2xl border-2 border-[#07D348]/20 bg-gradient-to-br from-[#0a0f0a]/80 to-[#07D348]/10 backdrop-blur-md p-8 transition-all duration-300 hover:shadow-[0_0_30px_-5px_rgba(7,211,72,0.4)] group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-[#07D348]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative z-10">
                  <div className="mb-6 inline-flex rounded-xl bg-[#07D348]/10 p-4 backdrop-blur-sm group-hover:bg-[#07D348]/20 transition-colors">
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl font-semibold text-white mb-3 group-hover:text-[#07D348] transition-colors">{feature.title}</h3>
                  <p className="text-zinc-300 text-sm leading-relaxed">{feature.description}</p>
                </div>
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                  <Image
                    src={feature.image}
                    alt={feature.title}
                    width={300}
                    height={200}
                    className="feature-image absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 scale-80 object-cover rounded-lg transition-all duration-300"
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Community Safety in Action Slider */}
        <section className="mt-20 relative">
          <h2 className="text-4xl font-bold text-center mb-16 bg-white bg-clip-text text-transparent">
            Community Safety in Action
          </h2>
          
          <div className="relative w-full overflow-hidden rounded-3xl border-2 border-white/20 h-96 md:h-[32rem]">
            {sliderImages.map((img, index) => (
              <div 
                key={img.id}
                className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}
              >
                <Image
                  src=""
                  alt={img.text}
                  width={1600}
                  height={900}
                  className="object-cover w-full h-full"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-12 text-white">
                  <h3 className="text-3xl font-bold">{img.text}</h3>
                  <p className="mt-4 text-xl max-w-2xl">See how our reporting system enhances public safety across communities</p>
                </div>
              </div>
            ))}
            
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
              {sliderImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all ${index === currentSlide ? 'bg-[#07D348] w-6' : 'bg-white/50'}`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>

          <div className="mt-8 flex justify-center">
            <Link href="/community">
              <button className="group relative flex h-14 items-center justify-center gap-3 rounded-xl border-2 border-[#07D348]/30 bg-white/5 px-10 text-lg font-medium text-white backdrop-blur-sm transition-all hover:border-[#24fe41]/50 hover:bg-[#07D348]/10 hover:shadow-[0_0_30px_-5px_#07D348]">
                <span>Join Our Community</span>
                <svg
                  className="h-5 w-5 transition-transform group-hover:translate-x-1"
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
          </div>
        </section>

        {/* Bangladesh 999 Integration Section */}
        <section className="mt-40 rounded-3xl border-2 border-white/10 bg-gradient-to-b from-white/5 to-transparent p-12 backdrop-blur-xl relative overflow-hidden">
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-[#07D348]/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-[#24fe41]/10 rounded-full blur-3xl"></div>
          <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
                Integrated with Bangladesh National Emergency Service 999
              </h2>
              <p className="text-xl text-zinc-300 mb-8">
                Our system is directly connected to Bangladesh's official emergency response system, ensuring critical reports receive immediate attention from authorities.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-[#07D348] mr-3 mt-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-zinc-300">Direct connection to police, fire, and medical services</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-[#07D348] mr-3 mt-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-zinc-300">Automatic location sharing for faster response</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-[#07D348] mr-3 mt-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-zinc-300">Priority handling of emergency reports</span>
                </li>
              </ul>
            </div>
            <div className="relative aspect-video rounded-2xl overflow-hidden border-2 border-white/20">
              <Image 
                src={`https://picsum.photos/id/1086/800/450`}
                alt="Bangladesh emergency response team"
                width={800}
                height={450}
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
            </div>
          </div>
        </section>

        {/* Enhanced Testimonials Section */}
        <section className="mt-40 relative overflow-x-hidden py-16" ref={testimonialRef}>
          <div className="absolute inset-0 bg-gradient-to-b from-[#07D348]/10 to-[#24fe41]/5 -z-10">
            <div className="absolute inset-0 opacity-20" style={{
              backgroundImage: `radial-gradient(circle at 50% 50%, rgba(7, 211, 72, 0.3) 0%, transparent 70%)`,
              backgroundSize: '100% 100%',
              backgroundPosition: 'center'
            }}></div>
          </div>
          <h2 className="text-4xl font-bold text-center mb-16 bg-gradient-to-r from-white to-[#07D348] bg-clip-text text-transparent relative">
            What Citizens Are Saying
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-[#07D348] to-[#24fe41] rounded-full blur-sm"></div>
          </h2>
          
          <div className="relative w-full h-[400px] sm:h-[380px] overflow-hidden">
            <div className="absolute top-0 left-0 h-full flex items-center gap-6 animate-marquee">
              {[...testimonials, ...testimonials].map((testimonial, index) => (
                <div 
                  key={`${index}-${testimonial.author}`}
                  className="testimonial-card inline-flex w-[300px] sm:w-[320px] p-5 rounded-2xl border-2 border-[#07D348]/30 bg-gradient-to-br from-[#0a0f0a]/50 to-[#07D348]/10 backdrop-blur-lg flex-shrink-0 transition-all duration-300 hover:shadow-[0_0_30px_-5px_rgba(7,211,72,0.5)] group"
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  <div className="flex flex-col items-center w-full">
                    <div className="w-full h-[200px] rounded-xl overflow-hidden border-2 border-[#07D348]/40 relative group/image">
                      <Image
                        src={`https://picsum.photos/id/${testimonial.image}/600/400`}
                        alt={testimonial.author}
                        width={600}
                        height={400}
                        className="testimonial-image object-cover w-full h-full transition-transform duration-500 group-hover/image:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#07D348]/20 to-transparent opacity-0 group-hover/image:opacity-100 transition-opacity duration-300"></div>
                    </div>
                    <div className="mt-4 text-center">
                      <p className="text-sm sm:text-base text-zinc-200 leading-relaxed font-medium line-clamp-3">{testimonial.quote}</p>
                      <div className="mt-3 font-bold text-white text-lg sm:text-xl">{testimonial.author}</div>
                      <div className="text-xs sm:text-sm text-[#07D348] font-medium">{testimonial.role}</div>
                      <div className="flex mt-3 justify-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <svg key={i} className="w-5 h-5 text-[#07D348] group-hover:text-[#24fe41] transition-colors" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="absolute inset-y-0 left-0 w-24 sm:w-32 bg-gradient-to-r from-[#0a0f0a] to-transparent z-10"></div>
            <div className="absolute inset-y-0 right-0 w-24 sm:w-32 bg-gradient-to-l from-[#0a0f0a] to-transparent z-10"></div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="mt-40">
          <h2 className="text-4xl font-bold text-center mb-16 bg-white bg-clip-text text-transparent">
            Frequently Asked Questions
          </h2>
          
          <div className="max-w-4xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <div 
                key={index}
                className="rounded-2xl border-2 border-white/10 bg-gradient-to-b from-white/5 to-transparent overflow-hidden backdrop-blur-sm transition-all duration-300 hover:border-[#07D348]/30"
              >
                <button
                  className="w-full p-6 text-left flex justify-between items-center group"
                  onClick={() => toggleFAQ(index)}
                >
                  <h3 className="text-xl font-semibold text-white group-hover:text-[#07D348] transition-colors">
                    {faq.question}
                  </h3>
                  <svg
                    className={`w-6 h-6 text-[#07D348] transition-transform duration-300 ${activeFAQ === index ? 'transform rotate-180' : ''}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div 
                  className={`px-6 pb-6 text-zinc-300 transition-all duration-300 overflow-hidden ${activeFAQ === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
                >
                  <p className="leading-relaxed">{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="mt-40 mb-12 text-center relative">
          <div className="absolute -top-20 left-1/2 w-64 h-64 bg-[#07D348]/10 rounded-full blur-3xl -translate-x-1/2 -z-10"></div>
          <h2 className="text-4xl font-bold mb-6 bg-white bg-clip-text text-transparent">
            Ready to Make Your Community Safer?
          </h2>
          <p className="text-xl text-zinc-300 max-w-3xl mx-auto mb-10">
            Join thousands of Bangladeshi citizens who are making their neighborhoods safer through anonymous, secure reporting.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <Link href={"/submit-report"}>
              <button className="group relative flex h-14 items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-[#07D348] to-[#24fe41] px-10 text-lg font-medium text-white transition-all hover:shadow-lg hover:shadow-[#07D348]/40 hover:-translate-y-0.5">
                <span className="relative z-10">Report an Incident</span>
                <svg
                  className="h-5 w-5 transition-transform group-hover:translate-x-1"
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
            <Link href={"/about"}>
              <button className="flex h-14 items-center justify-center gap-3 rounded-xl border-2 border-[#07D348]/30 bg-white/5 px-10 text-lg font-medium text-white backdrop-blur-sm transition-all hover:border-[#24fe41]/50 hover:bg-[#07D348]/10 hover:shadow-[0_0_30px_-5px_#07D348] group">
                <span>Learn How It Works</span>
                <div className="w-0 h-[2px] bg-[#07D348] transition-all group-hover:w-5"></div>
              </button>
            </Link>
          </div>
        </section>
      </div>

      <style jsx global>{`
        @keyframes rain {
          to {
            transform: translateY(100vh) scale(var(--tw-scale-x), var(--tw-scale-y));
          }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(2deg); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(10px) rotate(5deg); }
          50% { transform: translateY(-10px) rotate(7deg); }
        }
        @keyframes float-slow {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(1deg); }
        }
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px -5px rgba(7, 211, 72, 0.3); }
          50% { box-shadow: 0 0 30px -5px rgba(7, 211, 72, 0.5); }
        }
        .animate-float { animation: float 8s ease-in-out infinite; }
        .animate-float-delayed { animation: float-delayed 10s ease-in-out infinite; }
        .animate-float-slow { animation: float-slow 12s ease-in-out infinite; }
        .animate-marquee {
          animation: marquee 15s linear infinite;
          display: flex;
          width: max-content;
        }
        .animate-pulse-glow {
          animation: pulse-glow 2s ease-in-out infinite;
        }
        .glow-particle {
          box-shadow: 0 0 8px 2px rgba(7, 211, 72, 0.6);
        }
        .testimonial-card {
          transform: perspective(1000px);
        }
      `}</style>
      
      <SafetyChatbot/>
    </main>
  );
}
