import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { FaUserCircle, FaSave } from "react-icons/fa";
import { FiCamera } from "react-icons/fi";

// Base API URL for profile endpoints
const API_BASE = "http://localhost:5000/api/profile";

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
    profile_image: null, // Stores the URL/path for display
  });
  const [file, setFile] = useState(null); // Stores the new file object for upload
  const [msg, setMsg] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // --- Data Fetching Effect ---
  useEffect(() => {
    if (!custom_id) return;

    axios
      .get(`${API_BASE}/${custom_id}`)
      .then((res) => {
        // Ensure date_of_birth is handled correctly (e.g., if it's a full ISO string)
        const data = res.data;
        if (data.date_of_birth) {
          data.date_of_birth = data.date_of_birth.split("T")[0];
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

  // --- Handlers ---

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    // Create a local object URL for instant preview in the browser
    setProfile({ ...profile, profile_image: URL.createObjectURL(selectedFile) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("Saving profile...");

    const formData = new FormData();
    formData.append("custom_id", custom_id);

    // Append text fields
    for (let key in profile) {
      // Exclude profile_image from the simple append if it's a local URL
      if (key !== "profile_image") {
        formData.append(key, profile[key] || "");
      }
    }

    // Append the file object if a new one was selected
    if (file) {
      formData.append("profile_image", file);
    }

    try {
      await axios.post(`${API_BASE}/${custom_id}/update`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      // Clear file state and update profile to reflect server's new image path if necessary
      setFile(null);
      setMsg("Profile saved successfully! ✅");

      // Optional: Refetch the data to ensure the profile_image path is the one from the server
      // or update the profile state with the expected new path if your server returns it.
      // For simplicity, we just keep the current state (which has the blob URL if a new file was selected).

    } catch (error) {
      console.error("Error saving profile:", error);
      const errorMsg = error.response?.data?.message || "An unexpected error occurred.";
      setMsg(`Failed to save profile. ❌ ${errorMsg}`);
    }
  };

  // Function to determine the image source path
  const getProfileImageSrc = () => {
    if (!profile.profile_image) return null;

    // Check if it's a local blob URL (for immediate preview)
    if (profile.profile_image.startsWith("blob:")) {
      return profile.profile_image;
    }

    // Otherwise, construct the full URL for a server-hosted image
    // Assumes the image path in 'profile_image' is relative to the root of your app/server
    // The replace logic works to strip '/api/profile'
    return `${API_BASE.replace("/api/profile", "")}/${profile.profile_image}`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="text-xl font-semibold text-blue-600">Loading Profile...</div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-blue-50 to-blue-200 min-h-90vh flex justify-center items-center px-4 py-1">
      <div className="w-full max-w-6xl bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl p-4 md:p-12 grid md:grid-cols-3 gap-8">

        {/* --- LEFT PANEL: Profile Summary & Image --- */}
        <div className="md:col-span-1 flex flex-col items-center p-6 bg-white rounded-2xl shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300">
          
          {/* Image Upload Area */}
          <div className="w-56 h-68  overflow-hidden bg-gray-100 flex items-center justify-center shadow-inner border-4 border-white ring-4 ring-blue-100 mb-6 relative">
            {profile.profile_image ? (
              <img
                src={profile.profile_url}
  alt="Profile"
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
              />
            ) : (
              <FaUserCircle className="text-gray-400 text-9xl" />
            )}

            {/* Camera Icon/Label */}
            <label className="absolute bottom-1 right-1 bg-blue-200 text-black p-3 rounded-full cursor-pointer hover:bg-blue-300 transition-transform duration-300 hover:scale-110 shadow-xl border-2 border-white">
              <FiCamera className="text-xl" />
              <input type="file" onChange={handleFileChange} className="hidden" accept="image/*" />
            </label>
          </div>

          {/* Basic Info */}
          <div className="text-center w-full space-y-2 mb-6">
            <h2 className="text-2xl font-extrabold text-gray-800 break-words">{profile.full_name || "Unnamed Patient"}</h2>
            <p className="text-base text-gray-500 font-mono bg-gray-50 p-1 rounded-lg inline-block"><span className="font-semibold text-gray-700">ID:</span> {custom_id}</p>
            <div className="flex justify-center gap-4 text-sm text-gray-600 pt-1">
                <p><span className="font-semibold">Blood:</span> {profile.blood_group || "N/A"}</p>
                <p>•</p>
                <p><span className="font-semibold">Gender:</span> {profile.gender || "N/A"}</p>
            </div>
          </div>

          {/* Save Button (Separate from form for better layout control) */}
          <button
            type="button" // Change to type="button" since the form submission is handled by the click handler
            onClick={handleSubmit}
            className="w-full flex items-center justify-center bg-green-600 text-white px-4 py-3 rounded-xl font-bold uppercase tracking-wider shadow-lg hover:bg-green-700 transition-all duration-300 hover:shadow-xl disabled:bg-gray-400"
            disabled={msg.includes("Saving")}
          >
            <FaSave className="mr-3 text-lg" /> {msg.includes("Saving") ? "Saving..." : "Save Profile"}
          </button>

          {/* Status Message */}
          {msg && (
            <p className={`mt-4 text-sm font-medium text-center p-3 w-full rounded-xl shadow-inner ${
              msg.includes("success")
                ? "bg-green-100 text-green-700 border border-green-300"
                : "bg-red-100 text-red-700 border border-red-300"
            }`}>
              {msg}
            </p>
          )}
        </div>

        {/* --- RIGHT PANEL: Detailed Form Fields --- */}
        <form onSubmit={handleSubmit} className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-5 auto-rows-min">
          {[
            { label: "Full Name", name: "full_name", type: "text", span: 2 },
            { label: "Date of Birth", name: "date_of_birth", type: "date" },
            { label: "Gender", name: "gender", type: "select", options: ["Male", "Female", "Other", "Prefer not to say"] },
            { label: "Blood Group", name: "blood_group", type: "text" },
            { label: "Mobile Number", name: "mobile_number", type: "tel" },
            { label: "Email", name: "email", type: "email", span: 2 },
            { label: "Primary Doctor", name: "primary_doctor", type: "text", span: 2 },
          ].map((field) => (
            <div key={field.name} className={`flex flex-col ${field.span === 2 ? "sm:col-span-2" : ""}`}>
              <label htmlFor={field.name} className="text-sm font-semibold text-gray-700 mb-1">{field.label}</label>
              
              {/* Select Field */}
              {field.type === "select" ? (
                <select
                  id={field.name}
                  name={field.name}
                  value={profile[field.name]}
                  onChange={handleChange}
                  className="p-3 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-white shadow-sm appearance-none"
                >
                  {field.options.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              ) : (
                // Text/Date/Email/Tel Input Field
                <input
                  id={field.name}
                  type={field.type}
                  name={field.name}
                  value={profile[field.name] || ""} // Ensure value is a string, even if empty
                  onChange={handleChange}
                  placeholder={`Enter ${field.label.toLowerCase()}`}
                  className="p-3 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 shadow-sm"
                />
              )}
            </div>
          ))}

          {/* Address Textarea */}
          <div className="flex flex-col sm:col-span-2">
            <label htmlFor="current_address" className="text-sm font-semibold text-gray-700 mb-1">Current Address</label>
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
          
          {/* An invisible submit button is here to enable form submission on Enter key,
              but the visible button is on the left panel. */}
          <button type="submit" className="hidden" aria-hidden="true"></button>
        </form>
      </div>
    </div>
  );
};

export default PatientProfile;