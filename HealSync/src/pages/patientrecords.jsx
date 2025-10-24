import { useState, useEffect } from "react";
import axios from "axios";

const PatientRecords = () => {
  const [customId, setCustomId] = useState("");
  const [file, setFile] = useState(null);
  const [records, setRecords] = useState([]);
  const [message, setMessage] = useState("");

  // Upload file
  const handleUpload = async (e) => {
    e.preventDefault();
    if (!customId || !file) {
      setMessage("Enter ID & select a file");
      return;
    }

    const formData = new FormData();
    formData.append("custom_id", customId);
    formData.append("file", file);

    try {
      await axios.post("http://localhost:5000/api/records/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMessage("✅ File uploaded successfully!");
      setFile(null);
      fetchRecords(customId); // auto-fetch after upload
    } catch (err) {
      console.error(err);
      setMessage("❌ Upload failed. Check server or network.");
    }
  };

  // Fetch records
  const fetchRecords = async (id) => {
    const fetchId = id || customId;
    if (!fetchId) {
      setMessage("Enter a valid ID to fetch records");
      return;
    }

    try {
      const res = await axios.get(
        `http://localhost:5000/api/records/${fetchId}`
      );
      setRecords(res.data);
      setMessage(`Fetched ${res.data.length} record(s)`);
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to fetch records. Check server or network.");
      setRecords([]);
    }
  };

  // Optional: fetch automatically when customId changes
  useEffect(() => {
    if (customId) fetchRecords(customId);
  }, [customId]);

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Patient Records</h1>

      {/* Feedback */}
      {message && <p className="mb-4 text-sm text-gray-700">{message}</p>}

      {/* Upload Form */}
      <form className="flex flex-col gap-2 mb-6" onSubmit={handleUpload}>
        <input
          type="text"
          placeholder="Enter Patient Custom ID"
          className="border p-2 rounded"
          value={customId}
          onChange={(e) => setCustomId(e.target.value)}
        />
        <input
          type="file"
          accept=".pdf,.jpg,.png"
          onChange={(e) => setFile(e.target.files[0])}
        />
        <button className="bg-blue-500 text-white p-2 rounded" type="submit">
          Upload
        </button>
      </form>

      {/* Fetch button */}
      <div className="mb-4">
        <button
          className="bg-green-500 text-white p-2 rounded"
          onClick={() => fetchRecords()}
        >
          Fetch Records
        </button>
      </div>

      {/* Display uploaded files */}
      {records.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {records.map((r) => (
            <div
              key={r.record_id}
              className="border p-3 rounded shadow-sm flex flex-col"
            >
              <p className="font-medium">{r.file_name}</p>
              <p className="text-sm text-gray-500">Type: {r.file_type}</p>
              <p className="text-sm text-gray-400">
                Uploaded: {new Date(r.uploaded_at).toLocaleString()}
              </p>
              <a
                href={`http://localhost:5000/${r.file_path}`}
                target="_blank"
                className="mt-2 text-blue-600 underline"
              >
                View File
              </a>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No records to display</p>
      )}
    </div>
  );
};

export default PatientRecords;
