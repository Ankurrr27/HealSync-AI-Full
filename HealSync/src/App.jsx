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
import Homepage from "./pages/patienthomepage.jsx";
import Profile from "./pages/patientprofile.jsx";
import Records from "./pages/patientrecords.jsx";
import Appointment from "./pages/patientappointment.jsx";
import WelcomePage from "./pages/welcome.jsx";
import PatientProfile from "./pages/patientprofile.jsx";
import PatientRecords from "./pages/patientrecords.jsx";
import Patientappointment from "./pages/patientappointment.jsx";
import PatientHomepage from "./pages/patienthomepage.jsx";
import Doctorprofile from "./pages/doctorprofile.jsx";
import Doctorappointment from "./pages/doctorappointment.jsx";
import Doctorhomepage from "./pages/doctorhomepage.jsx";

// Layout handles Navbar/Footer visibility
function Layout() {
  const location = useLocation();
  const authRoutes = ["/login", "/signup"];
  const hideHeaderFooter = authRoutes.includes(location.pathname);

  return (
    <>
      {!hideHeaderFooter && <Navbar />}
      <Outlet />
      {!hideHeaderFooter && <Footer />}
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
        {/* Public Layout */}
        <Route element={<Layout />}>
          <Route path="/" element={<WelcomePage />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />

          {/* Patient-specific routes */}
          <Route path="/patient/:custom_id" element={<UserLayout />}>
            <Route index element={<PatientHomepage />} />
            <Route path="profile" element={<PatientProfile />} />
            <Route path="records" element={<PatientRecords />} />
            <Route path="appointments" element={<Patientappointment />} />

            
          </Route>

          {/* Doctor-specific routes */}
          <Route path="/doctor/:custom_id" element={<UserLayout />}>
            <Route index element={<Doctorhomepage />} />
            <Route path="profile" element={<Doctorprofile />} />
            
            <Route path="appointments" element={<Doctorappointment />} />

            
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
