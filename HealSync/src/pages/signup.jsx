import { useState } from "react";
import { UserIcon, BriefcaseIcon, KeyIcon } from "@heroicons/react/24/outline";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("patient");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
  e.preventDefault();
  setMessage("Processing registration...");

  try {
    const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/register`, {

      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password, role }),
    });

    const data = await res.json();

    if (!res.ok) {
      setMessage(data.message || "Something went wrong");
      return;
    }

    setMessage(`Registration successful! Your ID: ${data.custom_id}`);

    setTimeout(() => {
      setMessage("");
      window.location.href = "/login"; // redirect to login
    }, 1500);
  } catch (err) {
    console.error(err);
    setMessage("Server error: unable to register");
  }
};


  return (
    <div className="min-h-screen relative flex justify-center items-center p-4 md:bg-blue-200 bg-white">
      <div className="flex w-full max-w-4xl bg-white rounded-2xl shadow-0 md:shadow-2xl overflow-hidden relative border border-gray-100">
        {/* LEFT SIDE: Image + Branding */}
        <div className="hidden lg:flex w-5/12 bg-blue-400 p-8 flex-col justify-center items-center relative text-white">
          <div className="relative z-10 text-center">
             <h1 className="text-4xl font-extrabold mb-2 tracking-wide">
              <span className="text-white">Heal</span>Sync
            </h1>
            <p className="text-md  mb-8 text-indigo-200">
              Your connection to seamless, personalized healthcare.
            </p>

            {/* Doctor Illustration from public folder */}
            <div className="p-1 rounded-lg">
              <img
                src="/Doctors-cuate.png"
                alt="Friendly Medical Professional"
                className="w-full h-auto max-h-72 object-cover rounded-md shadow-xl"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src =
                    "https://placehold.co/400x300/6366f1/ffffff?text=Image+Loading+Failed";
                }}
              />
            </div>
            
          </div>
        </div>

        {/* RIGHT SIDE: Signup Form */}
        <div className="w-full lg:w-7/12 p-8 sm:p-10 flex flex-col justify-center bg-white">
          <div className="max-w-xs mx-auto w-full">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              Create Account
            </h2>
            <p className="text-gray-500 mb-8 text-base">
              Start managing your health today.
            </p>

            {/* ROLE SELECTION */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                I am registering as a:
              </label>
              <div className="flex space-x-2">
                {/* Patient */}
                <div
                  onClick={() => setRole("patient")}
                  className={`flex-1 p-3 text-center rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                    role === "patient"
                      ? "border-blue-400 bg-blue-50 shadow-md"
                      : "border-gray-300 hover:border-blue-400 bg-white"
                  }`}
                >
                  <UserIcon
                    className={`w-6 h-6 mx-auto mb-1 ${
                      role === "patient" ? "text-blue-400" : "text-gray-500"
                    }`}
                  />
                  <span
                    className={`text-sm font-semibold ${
                      role === "patient" ? "text-blue-600" : "text-gray-700"
                    }`}
                  >
                    Patient
                  </span>
                </div>

                {/* Admin */}
                <div
                  onClick={() => setRole("admin")}
                  className={`flex-1 p-3 text-center rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                    role === "admin"
                      ? "border-red-600 bg-red-50 shadow-md"
                      : "border-gray-300 hover:border-red-400 bg-white"
                  }`}
                >
                  <KeyIcon
                    className={`w-6 h-6 mx-auto mb-1 ${
                      role === "admin" ? "text-red-600" : "text-gray-500"
                    }`}
                  />
                  <span
                    className={`text-sm font-semibold ${
                      role === "admin" ? "text-red-700" : "text-gray-700"
                    }`}
                  >
                    Admin
                  </span>
                </div>

                {/* Doctor */}
                <div
                  onClick={() => setRole("doctor")}
                  className={`flex-1 p-3 text-center rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                    role === "doctor"
                      ? "border-green-600 bg-green-50 shadow-md"
                      : "border-gray-300 hover:border-green-400 bg-white"
                  }`}
                >
                  <BriefcaseIcon
                    className={`w-6 h-6 mx-auto mb-1 ${
                      role === "doctor" ? "text-green-600" : "text-gray-500"
                    }`}
                  />
                  <span
                    className={`text-sm font-semibold ${
                      role === "doctor" ? "text-green-700" : "text-gray-700"
                    }`}
                  >
                    Doctor
                  </span>
                </div>
              </div>
            </div>

            {/* FORM */}
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Full Name"
                className="p-3 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-blue-500 transition-all duration-200 text-gray-800"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <input
                type="email"
                placeholder="Email Address"
                className="p-3 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-blue-500 transition-all duration-200 text-gray-800"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Password"
                className="p-3 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500 transition-all duration-200 text-gray-800"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <button
                type="submit"
                className="bg-blue-400 text-white font-semibold text-base py-3 rounded-lg mt-3 hover:bg-blue-600 active:scale-[.99] transition-all duration-200 shadow-xl shadow-indigo-600/30"
              >
                Register as {role.charAt(0).toUpperCase() + role.slice(1)}
              </button>
            </form>

            {/* MESSAGE */}
            {message && (
              <p
                className={`mt-4 text-center font-medium text-sm p-2 rounded-lg ${
                  message.includes("successful")
                    ? "text-green-800 bg-green-100"
                    : "text-red-800 bg-red-100"
                }`}
              >
                {message}
              </p>
            )}

            {/* LOGIN LINK */}
            <p className="mt-5 text-center text-gray-500 text-sm">
              Already a member?
              <a
                href="/login"
                className="text-blue-600 font-bold hover:text-indigo-700 ml-1 transition-colors"
              >
                Log In
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
