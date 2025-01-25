import React, { useState } from "react";

const Dashboard = () => {
  const [prediction, setPrediction] = useState(null);

  const fetchPrediction = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ features: [7.1, 22, 30] }),
      });
      const result = await response.json();
      setPrediction(result.prediction);
    } catch (error) {
      console.error("Error fetching prediction:", error);
    }
  };

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h1>Ganga Water Quality Dashboard</h1>
      <button
        onClick={fetchPrediction}
        style={{
          backgroundColor: "#007BFF",
          color: "white",
          padding: "10px 20px",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Get Prediction
      </button>
      {prediction !== null && (
        <div style={{ marginTop: "20px" }}>
          <p style={{ fontSize: "18px", fontWeight: "bold" }}>
            Predicted Quality: {prediction}
          </p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
