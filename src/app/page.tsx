import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 pt-24 pb-12 relative overflow-hidden text-center">

      {/* Background Glow Effects - Restored Vibrant */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-400/20 rounded-full blur-[120px] -z-10 animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-400/20 rounded-full blur-[120px] -z-10 animate-pulse delay-1000" />

      {/* Subtle Noise Texture for "Premium" feel (Enhancement) */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none z-0" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")' }}></div>

      {/* Hero Content Wrapper */}
      <div className="z-10 flex flex-col items-center max-w-4xl mx-auto">

        {/* Abstract 3D Pill (Restored & Enhanced) */}
        <div className="relative w-72 h-32 md:w-96 md:h-40 mb-16 animate-float perspective-1000">
          <div className="relative w-full h-full transform preserve-3d rotate-12 transition-transform hover:rotate-6 duration-700 ease-out">
            {/* Pill Shape */}
            <div className="absolute inset-0 rounded-full flex shadow-[0_20px_60px_-15px_rgba(59,130,246,0.5)] bg-white overflow-hidden border border-white/40 backdrop-blur-sm ring-1 ring-white/50">

              {/* Left Side (White/Frost) */}
              <div className="w-1/2 h-full bg-gradient-to-br from-white via-blue-50 to-blue-100 relative">
                <div className="absolute inset-0 bg-white/40 backdrop-blur-md" />
                {/* Highlight */}
                <div className="absolute top-4 left-6 w-3/4 h-1/2 bg-gradient-to-b from-white to-transparent opacity-80 rounded-full blur-[2px]" />
              </div>

              {/* Right Side (Blue/Gradient) */}
              <div className="w-1/2 h-full bg-gradient-to-br from-blue-400 to-blue-600 relative overflow-hidden">
                {/* Inner Shadow/Depth */}
                <div className="absolute inset-0 bg-black/5 shadow-inner" />
                {/* Glossy Reflection */}
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/20 rounded-full blur-xl" />
                <div className="absolute bottom-4 right-8 w-24 h-8 bg-blue-300/30 rounded-full blur-md" />
              </div>
            </div>

            {/* Floating Elements (Particles) */}
            <div className="absolute -top-8 -right-8 w-16 h-16 bg-white/30 rounded-full blur-xl animate-bounce delay-700" />
            <div className="absolute -bottom-4 -left-12 w-24 h-24 bg-blue-500/10 rounded-full blur-xl animate-bounce delay-300" />
          </div>
        </div>

        {/* Main Headline */}
        <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-gray-900 dark:text-white mb-8 leading-[0.9] drop-shadow-sm select-none">
          DAWAK YOUR <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-600 animate-gradient-x">
            HEALTH
          </span> <br />
          ADVENTURE
        </h1>

        <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-2xl mb-12 font-medium leading-relaxed">
          Experience pharmacy delivery reimagined. <br className="hidden md:block" /> Lightning fast, beautifully simple.
        </p>

        {/* Major Call to Action */}
        <Link href="/search">
          <button className="group relative px-12 py-6 bg-gray-900 dark:bg-white rounded-[2rem] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.3)] hover:shadow-[0_30px_60px_-12px_rgba(59,130,246,0.4)] transition-all duration-300 transform hover:-translate-y-1 active:scale-95 overflow-hidden">

            {/* Button Gradient Overlay on Hover */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            <div className="relative flex items-center gap-4">
              <span className="text-2xl font-bold text-white dark:text-gray-900 group-hover:text-white transition-colors">Start Order</span>
              <div className="w-12 h-12 bg-white/10 dark:bg-black/5 rounded-full flex items-center justify-center group-hover:bg-white/20 transition-colors">
                <ArrowRight className="w-6 h-6 text-white dark:text-gray-900 group-hover:text-white" />
              </div>
            </div>
          </button>
        </Link>

        {/* Trust Indicators */}
        <div className="mt-20 flex gap-8 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
          <div className="flex items-center gap-2 text-sm font-semibold text-gray-500 dark:text-gray-400">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span>24/7 Support</span>
          </div>
          <div className="flex items-center gap-2 text-sm font-semibold text-gray-500 dark:text-gray-400">
            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            <span>Real-time Tracking</span>
          </div>
        </div>

      </div>
    </div>
  );
}
