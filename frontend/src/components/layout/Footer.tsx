const Footer = () => {
  return (
    <footer className="bg-slate-950 text-white pt-16 pb-8" style={{ fontFamily: "'Montserrat', sans-serif" }}>
      <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 md:grid-cols-4 gap-12">
        
        {/* Brand Section */}
        <div className="md:col-span-2">
          <h3 className="text-2xl font-bold text-orange-500 mb-6" style={{ fontFamily: "'Cinzel', serif" }}>
            Someswari Foods & Pickles
          </h3>
          <p className="text-slate-400 text-sm leading-relaxed max-w-sm mb-6 font-medium">
            Authentic homemade taste from Tenali. Specializing in traditional Sweets, 
            crispy Savories, and premium Veg & Non-Veg Pickles. 
            <br/><br/>
            <b>Specialist in Wedding & Function Bulk Orders.</b>
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-bold text-white mb-6 uppercase tracking-widest text-xs">Explore</h4>
          <ul className="text-slate-400 text-sm space-y-3 font-medium">
            <li className="hover:text-orange-500 cursor-pointer transition">Sweets</li>
            <li className="hover:text-orange-500 cursor-pointer transition">Veg Pickles</li>
            <li className="hover:text-orange-500 cursor-pointer transition">Non-Veg Pickles</li>
            <li className="hover:text-orange-500 cursor-pointer transition">Bulk Orders</li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h4 className="font-bold text-white mb-6 uppercase tracking-widest text-xs">Contact Us</h4>
          <ul className="text-slate-400 text-sm space-y-4 font-medium">
            <li className="flex items-start gap-2">📍 <span>Tenali, Andhra Pradesh</span></li>
            <li className="flex items-center gap-2">📞 <span>+91 9557553419</span></li>
            <li className="flex items-center gap-2">📧 <span className="text-[10px]">someswaripickles@gmail.com</span></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-slate-900 mt-16 pt-8 text-center text-slate-600 text-[10px] font-bold tracking-[0.3em] uppercase">
        © 2026 Someswari Foods & Pickles • Crafted with Tradition
      </div>
    </footer>
  );
};

export default Footer;