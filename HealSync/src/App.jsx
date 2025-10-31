import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
  useParams,
  useLocation,
} from "react-router-dom";

import Signup from "./pages/signup";
import Login from "./pages/login";
import Navbar from "./components/navbar.jsx";
import Footer from "./components/footer.jsx";
import WelcomePage from "./pages/welcome.jsx";

import PatientHomepage from "./pages/patienthomepage.jsx";
import PatientProfile from "./pages/patientprofile.jsx";
import PatientRecords from "./pages/patientrecords.jsx";
import Patientappointment from "./pages/patientappointment.jsx";

import Doctorhomepage from "./pages/doctorhomepage.jsx";
import Doctorprofile from "./pages/doctorprofile.jsx";
import Doctorappointment from "./pages/doctorappointment.jsx";

import AI from "./pages/ai.jsx";
import PostureCorrector from "./pages/postureCorrector.jsx";
import Notifications from "./pages/notification.jsx";

// Layout handles Navbar/Footer visibility
function Layout() {
  const location = useLocation();
  const authRoutes = ["/login", "/signup"];

  // Hide Navbar on login, signup, AI, and PostureCorrector pages
  const hideNavbar =
    authRoutes.includes(location.pathname) ||
    location.pathname.includes("/ai") ||
    location.pathname.includes("/posturecorrector");

  // Hide Footer on login, signup, profile, AI, and PostureCorrector pages
  const hideFooter =
    authRoutes.includes(location.pathname) ||
    location.pathname.includes("profile") ||
    location.pathname.includes("/ai") ||
    location.pathname.includes("/posturecorrector");

  return (
    <>
      {!hideNavbar && <Navbar />}
      <Outlet />
      {!hideFooter && <Footer />}
    </>
  );
}

// UserLayout for dynamic user routes using custom_id
function UserLayout() {
  const { custom_id } = useParams();
  return <Outlet context={{ custom_id }} />;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          {/* Public Routes */}
          <Route path="/" element={<WelcomePage />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/ai" element={<AI />} />


          {/* Patient-specific routes */}
          <Route path="/patient/:custom_id" element={<UserLayout />}>
            <Route index element={<PatientHomepage />} />
            <Route path="profile" element={<PatientProfile />} />
            <Route path="records" element={<PatientRecords />} />
            <Route path="appointments" element={<Patientappointment />} />
            <Route path="ai" element={<AI />} />
            <Route path="posturecorrector" element={<PostureCorrector />} />
            <Route path="notification" element={<Notifications />} />

          </Route>

          {/* Doctor-specific routes */}
          <Route path="/doctor/:custom_id" element={<UserLayout />}>
            <Route index element={<Doctorhomepage />} />
            <Route path="profile" element={<Doctorprofile />} />
            <Route path="ai" element={<AI />} />
            <Route path="appointments" element={<Doctorappointment />} />
            <Route path="posturecorrector" element={<PostureCorrector />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
