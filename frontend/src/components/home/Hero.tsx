const Hero = () => {
  return (
    <div className="relative overflow-hidden bg-slate-950 py-24 md:py-40 px-6">
      
      {/* Dynamic Background Glows */}
      <div className="absolute top-0 right-0 -mr-48 -mt-48 w-[600px] h-[600px] bg-orange-600/10 rounded-full blur-[150px] animate-pulse"></div>
      <div className="absolute bottom-0 left-0 -ml-48 -mb-48 w-[600px] h-[600px] bg-red-900/10 rounded-full blur-[150px] animate-pulse delay-1000"></div>

      <div className="relative max-w-6xl mx-auto text-center">
        
        {/* Established Badge */}
        <div className="inline-flex items-center gap-3 bg-white/5 border border-white/10 px-6 py-2.5 rounded-full mb-10 shadow-2xl backdrop-blur-md">
          <span className="w-2 h-2 bg-orange-500 rounded-full animate-ping"></span>
          <span className="text-orange-200 text-[9px] md:text-[11px] font-black uppercase tracking-[0.4em]" style={{ fontFamily: "'Montserrat', sans-serif" }}>
            Authentic Taste of Tenali • Since 1984
          </span>
        </div>

        {/* Brand Name - Kitchen Kart Style */}
        <h1 
          className="text-6xl md:text-8xl text-white mb-10 leading-[0.95] tracking-tighter italic font-black uppercase"
        >
          Kitchen <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 via-orange-400 to-yellow-500 underline underline-offset-[12px] decoration-white/10">
            Kart
          </span>
        </h1>

        {/* Description focusing on the 5 Core Categories */}
        <p className="text-slate-400 text-base md:text-xl mb-14 max-w-3xl mx-auto font-medium leading-relaxed" style={{ fontFamily: "'Montserrat', sans-serif" }}>
          Tenali స్పెషల్ <span className="text-white font-bold">Sweets & Hots</span>, 
          నోరూరించే <span className="text-white font-bold">Veg & Non-Veg Pickles</span> మరియు 
          సుస్వచ్ఛమైన <span className="text-white font-bold">Kirana Essentials</span>. 
          <br className="hidden md:block" />
          ఇంటి రుచి... ఇప్పుడు నేరుగా మీ ఇంటికి!
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
          <button 
            className="w-full sm:w-auto bg-orange-600 hover:bg-orange-500 text-white px-14 py-6 rounded-2xl font-black text-[11px] uppercase tracking-[0.25em] transition-all shadow-[0_15px_45px_-10px_rgba(234,88,12,0.6)] transform hover:-translate-y-1 active:scale-95"
            style={{ fontFamily: "'Montserrat', sans-serif" }}
          >
            Start Shopping
          </button>
          
          <button 
            className="w-full sm:w-auto bg-white/5 border border-white/10 hover:bg-white/10 text-white px-14 py-6 rounded-2xl font-black text-[11px] uppercase tracking-[0.25em] transition-all backdrop-blur-sm transform hover:-translate-y-1 active:scale-95"
            style={{ fontFamily: "'Montserrat', sans-serif" }}
          >
            Bulk Order Booking
          </button>
        </div>

        {/* Feature Grid with Phosphor Icons feel (Emojis for now) */}
        <div className="mt-28 grid grid-cols-2 md:grid-cols-4 gap-12 max-w-4xl mx-auto">
          {[
            { label: "Handmade", icon: "🏠", color: "text-orange-500" },
            { label: "100% Natural", icon: "🌿", color: "text-green-500" },
            { label: "Tenali Special", icon: "📍", color: "text-red-500" },
            { label: "Express Shipping", icon: "🚚", color: "text-blue-500" }
          ].map((item, idx) => (
            <div key={idx} className="flex flex-col items-center gap-4 group transition-all">
              <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center text-3xl border border-white/5 group-hover:border-white/10 transition-colors shadow-inner">
                {item.icon}
              </div>
              <span className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] group-hover:text-white transition-colors">{item.label}</span>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default Hero;