import React, { useContext, useRef } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import Navbar from "./components/common/Navbar";
import Footer from "./components/common/Footer";
import { AuthContext } from "./context/AuthContext";

const App = () => {
  return (
    <div className="min-h-screen bg-gray-100 font-inter flex flex-col">
      <Navbar />

      <main className="flex-grow">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};

export default App;
