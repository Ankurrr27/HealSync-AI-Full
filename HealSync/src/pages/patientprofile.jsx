import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { FaUserCircle, FaSave } from "react-icons/fa";
import { FiCamera } from "react-icons/fi";

const API_BASE = "http://localhost:5000/api/profile";
const UPLOADS_BASE_URL = "http://localhost:5000/";

const PatientProfile = () => {
  const { custom_id } = useParams();
  const [profile, setProfile] = useState({
    full_name: "",
    date_of_birth: "",
    gender: "Male",
    blood_group: "",
    primary_doctor: "",
    mobile_number: "",
    email: "",
    current_address: "",
    profile_image: null,
    aadhaar_number: "",
  });
  const [file, setFile] = useState(null);
  const [msg, setMsg] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Fetch profile data
  useEffect(() => {
    if (!custom_id) return;

    axios
      .get(`${API_BASE}/${custom_id}`)
      .then((res) => {
        const data = res.data;
        if (data.date_of_birth) {
          data.date_of_birth = data.date_of_birth.split("T")[0];
        }

        // 🧩 Fix: Ensure profile image has correct URL
        if (data.profile_image && !data.profile_image.startsWith("http")) {
          data.profile_image = `${UPLOADS_BASE_URL}${data.profile_image}`;
        }

        setProfile(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching profile:", err);
        setMsg("Error fetching profile data.");
        setIsLoading(false);
      });
  }, [custom_id]);

  // Handle input change
  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  // Handle file select
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setProfile({
      ...profile,
      profile_image: URL.createObjectURL(selectedFile),
    });
  };

  // Save profile
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("Saving profile...");

    const formData = new FormData();
    formData.append("custom_id", custom_id);

    for (let key in profile) {
      if (key !== "profile_image") {
        formData.append(key, profile[key] || "");
      }
    }

    if (file) {
      formData.append("profile_image", file);
    }

    try {
      await axios.post(`${API_BASE}/${custom_id}/update`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // 🔄 Refresh profile after saving
      const res = await axios.get(`${API_BASE}/${custom_id}`);
      const updatedData = res.data;

      if (updatedData.profile_image && !updatedData.profile_image.startsWith("http")) {
        updatedData.profile_image = `${UPLOADS_BASE_URL}${updatedData.profile_image}`;
      }

      setProfile(updatedData);
      setFile(null);
      setMsg("Profile saved successfully! ✅");
    } catch (error) {
      console.error("Error saving profile:", error);
      const errorMsg =
        error.response?.data?.message || "An unexpected error occurred.";
      setMsg(`❌ ${errorMsg}`);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="text-xl font-semibold text-blue-600">
          Loading Profile...
        </div>
      </div>
    );
  }

  return (
    <div className="md:bg-gradient-to-br md:from-blue-50 md:to-blue-200 min-h-90vh flex justify-center items-center px-4 py-1">
      <div className="w-full max-w-6xl bg-white/90  rounded-3xl  p-4 md:p-12 grid md:grid-cols-3 gap-8">
        {/* --- LEFT PANEL --- */}
        <div className="md:col-span-1 flex flex-col items-center p-6 bg-white rounded-2xl    transition-all duration-300">
          <div className="w-56 h-68 overflow-hidden bg-gray-100 flex items-center justify-center md:shadow-inner md:border-4 md:border-white  mb-6 relative">
            {profile.profile_image ? (
              <img
                src={
                  profile.profile_image.startsWith("blob:")
                    ? profile.profile_image
                    : `${profile.profile_image}`
                }
                alt="Profile"
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
              />
            ) : (
              <FaUserCircle className="text-gray-400 text-9xl" />
            )}
            <label className="absolute bottom-1 right-1 bg-blue-200 text-black p-3 rounded-full cursor-pointer hover:bg-blue-300 transition-transform duration-300 hover:scale-110 shadow-xl border-2 border-white">
              <FiCamera className="text-xl" />
              <input
                type="file"
                onChange={handleFileChange}
                className="hidden"
                accept="image/*"
              />
            </label>
          </div>

          <div className="text-center w-full space-y-2 mb-6">
            <h2 className="text-2xl font-extrabold text-gray-800 break-words">
              {profile.full_name || "Unnamed Patient"}
            </h2>
            <p className="text-base text-gray-500 font-mono bg-gray-50 p-1 rounded-lg inline-block">
              <span className="font-semibold text-gray-700">ID:</span> {custom_id}
            </p>
            <div className="flex justify-center gap-4 text-sm text-gray-600 pt-1">
              <p>
                <span className="font-semibold">Blood:</span>{" "}
                {profile.blood_group || "N/A"}
              </p>
              <p>•</p>
              <p>
                <span className="font-semibold">Gender:</span>{" "}
                {profile.gender || "N/A"}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleSubmit}
            className="w-full flex items-center justify-center bg-green-600 text-white px-4 py-3 rounded-xl font-bold uppercase tracking-wider shadow-lg hover:bg-green-700 transition-all duration-300 hover:shadow-xl disabled:bg-gray-400"
            disabled={msg.includes("Saving")}
          >
            <FaSave className="mr-3 text-lg" />{" "}
            {msg.includes("Saving") ? "Saving..." : "Save Profile"}
          </button>

          {msg && (
            <p
              className={`mt-4 text-sm font-medium text-center p-3 w-full rounded-xl shadow-inner ${
                msg.includes("success")
                  ? "bg-green-100 text-green-700 border border-green-300"
                  : "bg-red-100 text-red-700 border border-red-300"
              }`}
            >
              {msg}
            </p>
          )}
        </div>

        {/* --- RIGHT PANEL --- */}
        <form
          onSubmit={handleSubmit}
          className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-5 auto-rows-min"
        >
          {[
            { label: "Full Name", name: "full_name", type: "text", span: 2 },
            { label: "Aadhaar Number", name: "aadhaar_number", type: "text" },
            { label: "Date of Birth", name: "date_of_birth", type: "date" },
            {
              label: "Gender",
              name: "gender",
              type: "select",
              options: ["Male", "Female", "Other", "Prefer not to say"],
            },
            { label: "Blood Group", name: "blood_group", type: "text" },
            { label: "Mobile Number", name: "mobile_number", type: "tel" },
            { label: "Email", name: "email", type: "email", span: 2 },
            {
              label: "Primary Doctor",
              name: "primary_doctor",
              type: "text",
              span: 2,
            },
          ].map((field) => (
            <div
              key={field.name}
              className={`flex flex-col ${
                field.span === 2 ? "sm:col-span-2" : ""
              }`}
            >
              <label
                htmlFor={field.name}
                className="text-sm font-semibold text-gray-700 mb-1"
              >
                {field.label}
              </label>

              {field.type === "select" ? (
                <select
                  id={field.name}
                  name={field.name}
                  value={profile[field.name]}
                  onChange={handleChange}
                  className="p-3 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-white shadow-sm appearance-none"
                >
                  {field.options.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  id={field.name}
                  type={field.type}
                  name={field.name}
                  value={profile[field.name] || ""}
                  onChange={handleChange}
                  placeholder={`Enter ${field.label.toLowerCase()}`}
                  className="p-3 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 shadow-sm"
                />
              )}
            </div>
          ))}

          <div className="flex flex-col sm:col-span-2">
            <label
              htmlFor="current_address"
              className="text-sm font-semibold text-gray-700 mb-1"
            >
              Current Address
            </label>
            <textarea
              id="current_address"
              name="current_address"
              value={profile.current_address}
              onChange={handleChange}
              rows={3}
              placeholder="Full current address"
              className="p-3 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 shadow-sm resize-none"
            />
          </div>

          <button type="submit" className="hidden" aria-hidden="true"></button>
        </form>
      </div>
    </div>
  );
};

export default PatientProfile;
