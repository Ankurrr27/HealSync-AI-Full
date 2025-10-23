import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("Logging in...");

    try {
      const res = await axios.post("http://localhost:5000/api/login", {
        email,
        password,
      });

      // Save token + user info
      localStorage.setItem("token", res.data.token);
      if (res.data.user) {
        localStorage.setItem("user", JSON.stringify(res.data.user));
      }

      setMessage("Login successful! Redirecting...");

    setTimeout(() => {
  const role = res.data.user?.role?.toLowerCase();
  if (role === "patient" && res.data.user.custom_id) {
    navigate(`/patient/${res.data.user.custom_id}/profile`);
  } else if (role === "doctor" && res.data.user.custom_id) {
    navigate(`/doctor/${res.data.user.custom_id}/profile`);
  } else {
    navigate("/"); // fallback
  }
}, 500);

    } catch (err) {
      const errorMsg =
        err.response?.data?.message || "Login failed. Try again!";
      setMessage(errorMsg);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-blue-200 p-4">
      <div className="flex w-full max-w-4xl bg-white rounded-xl shadow-2xl overflow-hidden">
        {/* Left Side */}
        <div className="hidden lg:flex w-5/12 bg-blue-400 p-8 flex-col justify-center items-center text-white">
          <h1 className="text-4xl font-extrabold mb-2">HealSync</h1>
          <p className="text-sm mb-6 text-indigo-100">
            Securely access your health dashboard.
          </p>
          <img
            src="/Doctors-cuate.png"
            alt="Medical"
            className="w-full h-auto max-h-72 rounded-md shadow-xl"
          />
        </div>

        {/* Right Side (Login Form) */}
        <div className="w-full lg:w-7/12 p-8 sm:p-10 flex flex-col justify-center">
          <div className="max-w-xs mx-auto w-full">
            <h2 className="text-2xl font-bold mb-2">Welcome Back</h2>
            <p className="text-gray-500 mb-8 text-sm">
              Sign in to continue.
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <input
                type="email"
                placeholder="Email"
                className="p-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-gray-800"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Password"
                className="p-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-gray-800"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <button className="bg-blue-600 text-white py-2.5 rounded-lg mt-3 hover:bg-blue-700 transition-all shadow-md">
                Log In
              </button>
            </form>

            {message && (
              <p
                className={`mt-4 text-center font-medium text-sm ${
                  message.includes("successful") ? "text-green-600" : "text-red-600"
                }`}
              >
                {message}
              </p>
            )}

            <p className="mt-5 text-center text-gray-500 text-sm">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="text-indigo-600 font-bold hover:text-indigo-700"
              >
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
