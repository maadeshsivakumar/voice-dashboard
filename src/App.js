import React, { useState } from 'react';

function App() {
  const [file, setFile] = useState(null);
  const [responseData, setResponseData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
      const backendURL = process.env.REACT_APP_BACKEND_URL
      const res = await fetch(`${backendURL}/analyze`, {
        method: "POST",
        body: formData,
      });
      if (!res.ok) {
        throw new Error("Failed to fetch analysis");
      }
      const data = await res.json();
      setResponseData(data);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const renderSentimentIndicator = (sentiment) => {
    // Show a green check for positive sentiment, red cross otherwise
    return sentiment.toLowerCase() === 'positive' ? 
      <span style={{ color: 'green', marginLeft: '8px' }}>✓</span> : 
      <span style={{ color: 'red', marginLeft: '8px' }}>✗</span>;
  };

  return (
    <div style={{ padding: '20px', maxWidth: '960px', margin: '0 auto' }}>
      <h1>Sales Coaching Analysis</h1>
      <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
        <input type="file" accept="audio/*" onChange={handleFileChange} />
        <button type="submit" style={{ marginLeft: '10px' }}>Upload & Analyze</button>
      </form>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      {responseData && (
        <div className="results" style={{ backgroundColor: '#fafafa', padding: '20px', borderRadius: '6px', border: '1px solid #eaeaea' }}>
          <h2>Analysis Results</h2>
          <section style={{ marginBottom: '20px' }}>
            <h3>Summary</h3>
            <p>{responseData.summary}</p>
          </section>
          <section style={{ marginBottom: '20px' }}>
            <h3>Metrics</h3>
            <ul style={{ listStyleType: 'none', paddingLeft: 0 }}>
              <li>
                <strong>Talk-to-Listen Ratio:</strong> {responseData.metrics.talk_to_listen_ratio}
              </li>
              <li>
                <strong>Call Duration:</strong> {responseData.metrics.call_duration}
              </li>
              <li>
                <strong>Representative Sentiment:</strong> {responseData.metrics.sentiment_rep}
                {renderSentimentIndicator(responseData.metrics.sentiment_rep)}
              </li>
              <li>
                <strong>Customer Sentiment:</strong> {responseData.metrics.sentiment_customer}
              </li>
            </ul>
          </section>
          <section style={{ marginBottom: '20px' }}>
            <h3>Feedback</h3>
            <p>{responseData.feedback}</p>
          </section>
          <section>
            <h3>Recommendations</h3>
            <ol>
              {responseData.recommendations.map((rec, idx) => (
                <li key={idx}>{rec}</li>
              ))}
            </ol>
          </section>
        </div>
      )}
    </div>
  );
}

export default App;
