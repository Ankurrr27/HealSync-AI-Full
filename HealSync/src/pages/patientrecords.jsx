import React, { useState, useEffect } from "react";
import axios from "axios";
import { useOutletContext } from "react-router-dom";
import { Upload, FileText, Trash2, AlertTriangle, CheckCircle, Loader2 } from "lucide-react";

const API_BASE_URL = "http://localhost:5000/api";

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

  const handleDelete = async (id) => {
    if (!window.confirm("🗑️ Delete this record?")) return;
    try {
      await axios.delete(`${API_BASE_URL}/records/${id}`);
      setMessage("✅ Record deleted.");
      fetchRecords();
    } catch {
      setMessage("❌ Failed to delete record.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center p-6">
      <div className="w-full max-w-5xl space-y-8">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center justify-center">
          <FileText className="h-8 w-8 mr-2 text-indigo-500" /> My Records
        </h1>

        {message && (
          <div
            className={`p-4 rounded-lg flex items-center font-medium text-sm ${
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
            {message}
          </div>
        )}

        <form className="flex flex-col md:flex-row gap-4 items-center" onSubmit={handleUpload}>
          <input
            id="file-input"
            type="file"
            accept=".pdf,.jpg,.png"
            className="file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-indigo-100 file:text-indigo-800 hover:file:bg-indigo-200 w-full md:w-auto"
            onChange={(e) => setFile(e.target.files[0])}
          />
          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg flex items-center shadow disabled:opacity-60 transition"
            disabled={loading || !file}
          >
            <Upload className="h-4 w-4 mr-1" /> {loading ? "Uploading..." : "Upload"}
          </button>
        </form>

        <div>
          {records.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {records.map((r) => (
                <div
                  key={r.record_id}
                  className="flex flex-col justify-between p-5 rounded-xl shadow border border-gray-200 hover:shadow-md bg-white transition"
                >
                  <div>
                    <div className="flex items-center mb-2">
                      <FileText className="h-5 w-5 text-indigo-500 mr-2" />
                      <p className="font-semibold truncate text-gray-800">{r.file_name}</p>
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
                      href={`http://localhost:5000/${r.file_path}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 text-center bg-indigo-50 hover:bg-indigo-100 text-indigo-700 py-1.5 rounded-lg text-sm font-medium border border-indigo-200 transition"
                    >
                      Open
                    </a>
                    <button
                      onClick={() => handleDelete(r.record_id)}
                      className="p-2 bg-red-50 hover:bg-red-100 rounded-lg border border-red-200 text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center p-8 border-2 border-dashed border-gray-300 rounded-xl text-gray-400">
              <FileText className="h-12 w-12 mx-auto mb-3 text-gray-300" />
              <p className="font-medium text-lg">No records found.</p>
              <p className="text-sm">Upload your first record to get started.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientRecords;
