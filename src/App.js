import { HashRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";

// 🧱 Public components
import Navbar from "./components/Navbar";
import Events from "./components/Events";
// import Participants from "./components/Participants";
// import Students from "./components/Students";
import Guests from "./components/Guests";
import Form from "./components/GoogleForm";
import Coordinators from "./components/Coordinators";
import Footer from "./components/Footer";
import About from "./components/About";
// import Login from "./components/Login";
import ParticipantDashboard from "./components/ParticipantDashboard";
import PrivateRoute from "./components/PrivateRoute";
import News from "./components/News";
import ScrollDownArrow from "./components/ScrollDownArrow";

// ⚙️ Admin components
import AdminLogin from "./components/AdminLogin";
import leader from "./components/Leaderboard";
import AdminRegister from "./components/AdminRegister";
import Dashboard from "./components/Dashboard";

export default function App() {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  return (
    <HashRouter>
      {isAdminLoggedIn ? (
        // 🔐 Logged in as admin → Dashboard view
        <Dashboard />
      ) : (
        // 🌐 Normal public site view
        <>
          <Navbar />
          <News />
          <ScrollDownArrow />
          <Routes>
            <Route path="/leaderboard" element={<leader />} />
            <Route path="/admin-register" element={<AdminRegister />} />
            <Route path="/" element={<About />} />
            <Route path="/Events" element={<Events />} />
            <Route path="/participants" element={<Form />} />
            {/* <Route path="/students" element={<Students />} /> */}
            <Route path="/speakers" element={<Guests />} />
            <Route path="/coordinators" element={<Coordinators />} />
            <Route
              path="/admin"
              element={<AdminLogin onLogin={setIsAdminLoggedIn} />}
            />
            <Route path="/login" element={<Login />} />
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <ParticipantDashboard />
                </PrivateRoute>
              }
            />
            <Route path="*" element={<Login />} />{" "}
            {/* unknown path redirect to login */}
          </Routes>
          <Footer />
        </>
      )}
    </HashRouter>
  );
}
