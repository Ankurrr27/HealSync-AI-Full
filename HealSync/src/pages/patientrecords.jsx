import React, { useState } from "react";
import axios from "axios";
import { Upload, FileText, Search, AlertTriangle, CheckCircle } from "lucide-react";

const PatientRecords = () => {
  const [customId, setCustomId] = useState("");
  const [file, setFile] = useState(null);
  const [records, setRecords] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const isError = message.includes("❌");

  const fetchRecords = async (id) => {
    const fetchId = id || customId.trim();
    if (!fetchId) return setMessage("❌ Please enter a Patient ID."), setRecords([]);

    setLoading(true);
    setMessage(`⏳ Loading records for ID: ${fetchId}...`);
    try {
      const res = await axios.get(`http://localhost:5000/api/records/${fetchId}`);
      setRecords(res.data);
      setMessage(`✅ ${res.data.length} record(s) found for ${fetchId}.`);
    } catch {
      setMessage("❌ Fetch failed. Ensure backend is running.");
      setRecords([]);
    } finally { setLoading(false); }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!customId.trim() || !file) return setMessage("❌ Enter ID and select a file.");

    setLoading(true);
    setMessage("⏳ Uploading file...");
    const formData = new FormData();
    formData.append("custom_id", customId.trim());
    formData.append("file", file);

    try {
      await axios.post("http://localhost:5000/api/records/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMessage("✅ File uploaded! Refreshing records...");
      setFile(null);
      document.getElementById("file-input").value = "";
      fetchRecords(customId);
    } catch {
      setMessage("❌ Upload failed. Check server or file size.");
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center p-4">
      <div className="w-full max-w-4xl bg-white shadow-lg rounded-xl p-6 sm:p-10 border border-gray-200">
        
        <h1 className="text-3xl font-bold text-gray-800 flex items-center justify-center mb-4">
          <FileText className="h-7 w-7 mr-2 text-gray-600" /> Patient Record Manager
        </h1>

        {message && (
          <div className={`p-3 mb-5 rounded flex items-center text-sm font-medium ${
            isError ? "bg-red-50 text-red-700 border border-red-100" : "bg-green-50 text-green-700 border border-green-100"
          }`}>
            {isError ? <AlertTriangle className="h-5 w-5 mr-2" /> : <CheckCircle className="h-5 w-5 mr-2" />}
            {message}
          </div>
        )}

        {/* Controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 items-end">
          <input
            type="text"
            placeholder="Patient ID e.g., PTX-45391"
            className="col-span-2 p-3 border border-gray-300 rounded-lg focus:border-gray-500 focus:ring-1 focus:ring-gray-400 outline-none text-gray-700 w-full"
            value={customId}
            onChange={(e) => setCustomId(e.target.value)}
          />
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center justify-center shadow disabled:opacity-60"
            onClick={() => fetchRecords()}
            disabled={loading || !customId.trim()}
          >
            <Search className="h-4 w-4 mr-1" /> {loading ? "Fetching..." : "Fetch"}
          </button>
        </div>

        {/* Upload */}
        <form className="flex flex-col md:flex-row gap-4 mb-6" onSubmit={handleUpload}>
          <input
            id="file-input"
            type="file"
            accept=".pdf,.jpg,.png"
            className="file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
            onChange={(e) => setFile(e.target.files[0])}
          />
          <button
            type="submit"
            className="bg-gray-700 hover:bg-gray-800 text-white px-6 py-2 rounded-lg flex items-center shadow disabled:opacity-60"
            disabled={loading || !customId.trim() || !file}
          >
            <Upload className="h-4 w-4 mr-1" /> {loading ? "Processing..." : "Upload"}
          </button>
        </form>

        {/* Records */}
        <div>
          {records.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {records.map((r) => (
                <div key={r.record_id} className="p-4 border rounded-lg shadow-sm hover:shadow-md transition flex flex-col justify-between hover:bg-gray-50">
                  <div>
                    <div className="flex items-center mb-1">
                      <FileText className="h-5 w-5 text-gray-600 mr-2" />
                      <p className="font-semibold truncate">{r.file_name}</p>
                    </div>
                    <span className="text-xs text-gray-700 bg-gray-100 px-2 py-0.5 rounded-full">{r.file_type || "Unknown"}</span>
                    <p className="text-xs text-gray-400 mt-1">Uploaded: {new Date(r.uploaded_at).toLocaleDateString()}</p>
                  </div>
                  <a
                    href={`http://localhost:5000/${r.file_path}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 text-center bg-gray-100 hover:bg-gray-200 text-gray-700 py-1 rounded-lg text-sm border border-gray-200"
                  >
                    Open
                  </a>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center p-6 border-2 border-dashed border-gray-300 rounded-lg text-gray-400">
              <FileText className="h-10 w-10 mx-auto mb-2 text-gray-300" />
              <p className="font-medium">No records found.</p>
              <p className="text-sm">Enter an ID or upload a new record.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientRecords;
