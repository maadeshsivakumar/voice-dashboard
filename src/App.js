import React, { useState } from 'react';

function App() {
  const [file, setFile] = useState(null);
  const [responseData, setResponseData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const backendURL = process.env.REACT_APP_BACKEND_URL;

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError("Please select an audio file");
      return;
    }
    setError('');
    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch(`${backendURL}/analyze`, {
        method: "POST",
        body: formData,
      });
      if (!res.ok) {
        throw new Error("Failed to fetch analysis");
      }
      const data = await res.json();
      console.log("Analysis data:", data);
      setResponseData(data);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Sales Coaching Analysis</h1>
      <form onSubmit={handleSubmit}>
        <input type="file" accept="audio/*" onChange={handleFileChange} />
        <button type="submit" style={{ marginLeft: '10px' }}>Upload & Analyze</button>
      </form>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      {responseData && (
        <div>
          <h2>Analysis Results:</h2>
          <pre>{JSON.stringify(responseData, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default App;
