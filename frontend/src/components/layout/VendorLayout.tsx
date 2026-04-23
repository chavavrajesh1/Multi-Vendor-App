import { Outlet } from "react-router-dom";
import Footer from "./Footer";
import Navbar from "./Navbar"; // Navbar ni import cheyandi (path correct ga chusukondi)

const VendorLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-slate-950">
      {/* 1. NAVBAR IKKADA ADD CHESHAMU */}
      <Navbar />

      <div className="flex flex-grow">
         {/* Sidebar unte ikkada un-comment cheyandi */}
         {/* <Sidebar /> */}
         
         <main className="flex-grow p-6 pt-24"> 
            {/* pt-24 is for spacing since Navbar is fixed */}
            <Outlet />
         </main>
      </div>

      {/* 2. SINGLE FOOTER (Dashboard ki footer voddankunte deenni teeseyochu) */}
      <Footer />
    </div>
  );
};

export default VendorLayout;