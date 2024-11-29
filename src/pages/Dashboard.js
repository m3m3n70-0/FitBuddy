import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [activityData, setActivityData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchActivityData = async () => {
      const accessToken = localStorage.getItem("fitbit_access_token");
      console.log("Access Token found in localStorage:", accessToken); // Debug log

      if (!accessToken) {
        console.warn("No token found, redirecting to login...");
        navigate("/");
        return;
      }

      try {
        const response = await axios.post("http://localhost:4000/fitbit/activity", {
          access_token: accessToken,
        });

        console.log("Activity Data:", response.data); // Debug log
        setActivityData(response.data.summary); // Update with Fitbit data
      } catch (error) {
        console.error("Error fetching activity data:", error.response?.data || error.message);
        localStorage.removeItem("fitbit_access_token"); // Remove invalid token
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    fetchActivityData();
  }, [navigate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>FitBuddy Dashboard</h1>
      {activityData ? (
        <div>
          <p>Steps Today: {activityData.steps || "No steps recorded today."}</p>
          <p>Calories Burned: {activityData.caloriesOut || "No data available."}</p>
        </div>
      ) : (
        <p>No activity data available for today.</p>
      )}
    </div>
  );
};

export default Dashboard;
