// instagram కి బదులు InstagramLogo ని ఇంపోర్ట్ చేశాను
import { FacebookLogo, InstagramLogo, WhatsappLogo, MapPin, Phone, Envelope } from "@phosphor-icons/react";

const Footer = () => {
  return (
    <footer className="bg-slate-950 text-white pt-20 pb-10 border-t border-slate-900" style={{ fontFamily: "'Montserrat', sans-serif" }}>
      <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 md:grid-cols-4 gap-16">
        
        {/* Brand Section */}
        <div className="md:col-span-2">
          <h3 className="text-3xl font-black text-white mb-6 italic uppercase tracking-tighter">
            Kitchen <span className="text-orange-500">Kart</span>
          </h3>
          <p className="text-slate-500 text-sm leading-relaxed max-w-sm mb-8 font-medium">
            Tenali నుండి అచ్చమైన ఇంటి రుచులు. మేము నాణ్యమైన స్వీట్లు, హాట్స్, మరియు వెజ్ & నాన్-వెజ్ పచ్చళ్లను అందిస్తాము. 
            <br/><br/>
            <span className="text-slate-300 border-l-2 border-orange-600 pl-4 block italic">
              Specialist in Wedding & Function Bulk Orders.
            </span>
          </p>
          
          {/* SOCIAL ICONS SECTION */}
          <div className="flex gap-4">
             <a href="#" className="w-11 h-11 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:border-orange-500 hover:text-orange-500 hover:-translate-y-1 transition-all shadow-xl group">
                <FacebookLogo size={22} weight="bold" />
             </a>
             <a href="#" className="w-11 h-11 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:border-orange-500 hover:text-orange-500 hover:-translate-y-1 transition-all shadow-xl group">
                <InstagramLogo size={22} weight="bold" />
             </a>
             <a href="https://wa.me/919557553419" target="_blank" rel="noreferrer" className="w-11 h-11 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:border-green-500 hover:text-green-500 hover:-translate-y-1 transition-all shadow-xl group">
                <WhatsappLogo size={22} weight="bold" />
             </a>
          </div>
        </div>

        {/* Categories Section */}
        <div>
          <h4 className="font-black text-white mb-8 uppercase tracking-[0.3em] text-[10px] text-orange-500 font-sans">Categories</h4>
          <ul className="text-slate-400 text-sm space-y-4 font-bold uppercase tracking-tighter font-sans">
            <li className="hover:text-white cursor-pointer transition flex items-center gap-3">
               <span className="w-1.5 h-1.5 bg-orange-600 rounded-full group-hover:scale-150 transition-all"></span> Sweets & Desserts
            </li>
            <li className="hover:text-white cursor-pointer transition flex items-center gap-3">
               <span className="w-1.5 h-1.5 bg-orange-600 rounded-full"></span> Veg Pickles
            </li>
            <li className="hover:text-white cursor-pointer transition flex items-center gap-3">
               <span className="w-1.5 h-1.5 bg-orange-600 rounded-full"></span> Non-Veg Pickles
            </li>
            <li className="hover:text-white cursor-pointer transition flex items-center gap-3">
               <span className="w-1.5 h-1.5 bg-orange-600 rounded-full"></span> Hots & Savories
            </li>
            <li className="hover:text-white cursor-pointer transition flex items-center gap-3">
               <span className="w-1.5 h-1.5 bg-orange-600 rounded-full"></span> Kirana Essentials
            </li>
          </ul>
        </div>

        {/* Contact Info Section */}
        <div>
          <h4 className="font-black text-white mb-8 uppercase tracking-[0.3em] text-[10px] text-orange-500 font-sans">Get In Touch</h4>
          <ul className="text-slate-400 text-sm space-y-6 font-medium">
            <li className="flex items-start gap-4">
               <div className="text-orange-500 mt-1 bg-orange-500/10 p-2 rounded-lg"><MapPin size={18} weight="fill" /></div> 
               <span className="text-xs leading-5">Tenali, Guntur Dist,<br/>Andhra Pradesh</span>
            </li>
            <li className="flex items-center gap-4">
               <div className="text-orange-500 bg-orange-500/10 p-2 rounded-lg"><Phone size={18} weight="fill" /></div> 
               <span className="text-xs">+91 9557553419</span>
            </li>
            <li className="flex items-center gap-4">
               <div className="text-orange-500 bg-orange-500/10 p-2 rounded-lg"><Envelope size={18} weight="fill" /></div> 
               <span className="text-[11px] lowercase font-sans">kitchenkart@gmail.com</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Footer Bottom Bar */}
      <div className="max-w-7xl mx-auto px-8 border-t border-slate-900 mt-20 pt-10 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-slate-600 text-[9px] font-black tracking-[0.3em] uppercase font-sans">
          © 2026 Kitchen Kart • Pure Homemade Quality
        </p>
        <div className="flex gap-6 opacity-30">
            <span className="text-[8px] font-black uppercase tracking-widest text-white">Tenali Origins</span>
            <span className="text-[8px] font-black uppercase tracking-widest text-white">Crafted with Love</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;