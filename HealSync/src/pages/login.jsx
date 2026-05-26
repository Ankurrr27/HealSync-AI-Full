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
      const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/login`, {


        email,
        password,
      });

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
        } else if (role === "admin" && res.data.user.custom_id) {
          navigate(`/admin/${res.data.user.custom_id}/profile`);
        } else {
          navigate("/");
        }
      }, 500);
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || "Login failed. Try again!";
      setMessage(errorMsg);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center  md:bg-blue-200 px-4 sm:px-6 py-8">
      <div className="flex flex-col lg:flex-row w-full max-w-5xl bg-white rounded-2xl md:shadow-2xl overflow-hidden">
        {/* Left Side */}
        <div className="hidden lg:flex w-full lg:w-5/12 bg-blue-400 p-6 lg:p-10 flex-col justify-center items-center text-white">
          <h1 className="text-3xl lg:text-4xl font-extrabold mb-2 text-center">
            HealSync
          </h1>
          <p className="text-xs sm:text-sm mb-6 text-indigo-100 text-center">
            Securely access your health dashboard.
          </p>
          <img
            src="/Doctors-cuate.png"
            alt="Medical"
            className="w-3/4 max-w-xs lg:max-w-sm h-auto rounded-lg shadow-xl"
          />
        </div>

        {/* Right Side (Login Form) */}
        <div className="w-full lg:w-7/12 p-6 sm:p-10 flex flex-col justify-center bg-white">
          <div className="max-w-sm sm:max-w-md mx-auto w-full">
            <h2 className="text-2xl sm:text-3xl font-bold mb-2 text-center lg:text-left">
              Welcome Back
            </h2>
            <p className="text-gray-500 mb-6 text-sm sm:text-base text-center lg:text-left">
              Sign in to continue.
            </p>

            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-3 sm:gap-4"
            >
              <input
                type="email"
                placeholder="Email"
                className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-800 text-sm sm:text-base"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Password"
                className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-gray-800 text-sm sm:text-base"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <button className="bg-blue-400 text-white py-3 rounded-lg mt-3 hover:bg-blue-600 transition-all shadow-md text-sm sm:text-base">
                Log In
              </button>
            </form>

            {message && (
              <p
                className={`mt-4 text-center font-medium text-sm sm:text-base ${
                  message.includes("successful")
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {message}
              </p>
            )}

            <p className="mt-5 text-center text-gray-500 text-sm sm:text-base">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="text-blue-600 font-semibold hover:text-indigo-700"
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
