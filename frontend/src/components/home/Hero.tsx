const Hero = () => {
  return (
    <div className="relative overflow-hidden bg-slate-950 py-20 md:py-32 px-6">
      
      {/* Decorative Gradient Glows */}
      <div className="absolute top-0 right-0 -mr-32 -mt-32 w-96 h-96 bg-orange-600/10 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-0 left-0 -ml-32 -mb-32 w-96 h-96 bg-red-600/10 rounded-full blur-[120px]"></div>

      <div className="relative max-w-5xl mx-auto text-center">
        
        {/* Established Badge */}
        <div className="inline-flex items-center gap-3 bg-white/5 border border-white/10 px-4 py-2 rounded-full mb-8 shadow-2xl">
          <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></span>
          <span className="text-orange-200 text-[10px] md:text-xs font-black uppercase tracking-[0.3em]" style={{ fontFamily: "'Montserrat', sans-serif" }}>
            The Pride of Tenali • Since 1984
          </span>
        </div>

        {/* Brand Name & Tagline */}
        <h1 
          className="text-5xl md:text-7xl text-white mb-8 leading-[1.1]"
          style={{ fontFamily: "'Cinzel', serif", fontWeight: 900 }}
        >
          SOMESWARI <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-orange-400 to-yellow-500">
            FOODS & PICKLES
          </span>
        </h1>

        {/* Description focusing on Sweets, Hots & Bulk Orders */}
        <p className="text-slate-400 text-sm md:text-xl mb-12 max-w-3xl mx-auto font-medium leading-relaxed" style={{ fontFamily: "'Montserrat', sans-serif" }}>
          Experience the authentic essence of Andhra with our handcrafted 
          <span className="text-white italic"> Traditional Sweets</span>, 
          <span className="text-white italic"> Savory Hots</span>, and our legendary 
          <span className="text-white italic"> Veg & Non-Veg Pickles</span>. 
          Perfectly packed for your home or <span className="text-orange-400 font-bold underline decoration-orange-500/30 underline-offset-8">Bulk Events</span>.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <button 
            className="w-full sm:w-auto bg-orange-600 hover:bg-orange-500 text-white px-12 py-5 rounded-full font-black text-xs uppercase tracking-[0.2em] transition-all shadow-[0_10px_40px_-10px_rgba(234,88,12,0.5)] transform hover:-translate-y-1"
            style={{ fontFamily: "'Montserrat', sans-serif" }}
          >
            Shop Now
          </button>
          
          <button 
            className="w-full sm:w-auto bg-white/5 border border-white/10 hover:bg-white/10 text-white px-12 py-5 rounded-full font-black text-xs uppercase tracking-[0.2em] transition-all backdrop-blur-sm"
            style={{ fontFamily: "'Montserrat', sans-serif" }}
          >
            Bulk Order Enquiry
          </button>
        </div>

        {/* Feature Grid */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 opacity-60">
          {[
            { label: "Homemade", icon: "🏠" },
            { label: "Zero Preservatives", icon: "🌿" },
            { label: "Authentic Tenali", icon: "📍" },
            { label: "Fast Delivery", icon: "🚚" }
          ].map((item, idx) => (
            <div key={idx} className="flex flex-col items-center gap-2">
              <span className="text-2xl">{item.icon}</span>
              <span className="text-white text-[9px] font-black uppercase tracking-widest">{item.label}</span>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default Hero;