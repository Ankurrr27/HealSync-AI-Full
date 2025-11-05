import React, { useState, useEffect } from "react";
import axios from "axios";
import { useOutletContext } from "react-router-dom";
import {
  Upload,
  FileText,
  AlertTriangle,
  CheckCircle,
  Loader2,
} from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;


const PatientRecords = () => {
  const { custom_id } = useOutletContext();
  const [file, setFile] = useState(null);
  const [records, setRecords] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const isError = message.includes("❌");

  useEffect(() => {
    if (custom_id) fetchRecords();
  }, [custom_id]);

  const fetchRecords = async () => {
    setLoading(true);
    setMessage(`⏳ Fetching your records...`);
    try {
      const res = await axios.get(`${API_BASE_URL}/records/${custom_id}`);
      setRecords(res.data);
      setMessage(`✅ Loaded ${res.data.length} record(s)!`);
    } catch {
      setMessage("❌ Failed to fetch records. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return setMessage("❌ Please select a file.");

    setLoading(true);
    setMessage("⏳ Uploading file...");
    const formData = new FormData();
    formData.append("file", file);

    try {
      await axios.post(`${API_BASE_URL}/records/${custom_id}/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMessage("✅ File uploaded successfully!");
      setFile(null);
      document.getElementById("file-input").value = "";
      fetchRecords();
    } catch {
      setMessage("❌ Upload failed. File too large or server error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center p-4 sm:p-6">
      <div className="w-full max-w-5xl space-y-6 sm:space-y-8">
        {/* HEADER */}
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 flex items-center justify-center text-center">
          <FileText className="h-7 w-7 sm:h-8 sm:w-8 mr-2 text-indigo-500" />
          My Records
        </h1>

        {/* STATUS MESSAGE */}
        {message && (
          <div
            className={`p-3 sm:p-4 rounded-lg flex items-center font-medium text-sm sm:text-base ${
              isError
                ? "bg-red-50 text-red-700 border border-red-200"
                : "bg-indigo-50 text-indigo-700 border border-indigo-200"
            }`}
          >
            {loading ? (
              <Loader2 className="h-5 w-5 mr-2 animate-spin" />
            ) : isError ? (
              <AlertTriangle className="h-5 w-5 mr-2" />
            ) : (
              <CheckCircle className="h-5 w-5 mr-2" />
            )}
            <span className="truncate">{message}</span>
          </div>
        )}

        {/* UPLOAD SECTION */}
        <form
          className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-center"
          onSubmit={handleUpload}
        >
          <input
            id="file-input"
            type="file"
            accept=".pdf,.jpg,.png"
            className="file:py-2 file:px-3 file:rounded-full file:border-0 file:bg-indigo-100 file:text-indigo-800 hover:file:bg-indigo-200 w-full sm:w-auto text-sm"
            onChange={(e) => setFile(e.target.files[0])}
          />
          <button
            type="submit"
            className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg flex items-center justify-center shadow-md text-sm sm:text-base transition disabled:opacity-60"
            disabled={loading || !file}
          >
            <Upload className="h-4 w-4 mr-1" />{" "}
            {loading ? "Uploading..." : "Upload"}
          </button>
        </form>

        {/* RECORDS LIST */}
        <div>
          {records.length > 0 ? (
            <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
              {records.map((r) => (
                <div
                  key={r.record_id}
                  className="flex flex-col justify-between p-4 sm:p-5 rounded-xl shadow border border-gray-200 hover:shadow-md bg-white transition"
                >
                  <div>
                    <div className="flex items-center mb-2">
                      <FileText className="h-5 w-5 text-indigo-500 mr-2" />
                      <p className="font-semibold truncate text-gray-800 text-sm sm:text-base">
                        {r.file_name}
                      </p>
                    </div>
                    <span
                      className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                        r.file_type?.toLowerCase() === "pdf"
                          ? "bg-red-100 text-red-700"
                          : "bg-indigo-100 text-indigo-700"
                      }`}
                    >
                      {r.file_type || "Unknown"}
                    </span>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(r.uploaded_at).toLocaleString()}
                    </p>
                  </div>

                  <div className="flex gap-2 mt-4">
                    <a
  href={`${API_BASE_URL.replace("/api", "")}/${r.file_path}`}
  target="_blank"
  rel="noopener noreferrer"
  className="flex-1 text-center bg-indigo-50 hover:bg-indigo-100 text-indigo-700 py-1.5 rounded-lg text-xs sm:text-sm font-medium border border-indigo-200 transition"
>
  Open
</a>

                      
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center p-6 sm:p-8 border-2 border-dashed border-gray-300 rounded-xl text-gray-400">
              <FileText className="h-10 w-10 sm:h-12 sm:w-12 mx-auto mb-3 text-gray-300" />
              <p className="font-medium text-base sm:text-lg">
                No records found.
              </p>
              <p className="text-xs sm:text-sm">
                Upload your first record to get started.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientRecords;
