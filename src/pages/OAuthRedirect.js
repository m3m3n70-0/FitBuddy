import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const OAuthRedirect = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAccessToken = async (authorizationCode) => {
      try {
        const response = await axios.post("http://localhost:4000/fitbit/token", {
          code: authorizationCode,
        });

        const { access_token } = response.data;
        console.log("Access Token received:", access_token); // Debug log
        localStorage.setItem("fitbit_access_token", access_token);

        navigate("/dashboard");
      } catch (error) {
        console.error("Error fetching access token:", error.response?.data || error.message);
        navigate("/");
      }
    };

    const query = new URLSearchParams(window.location.search);
    const authorizationCode = query.get("code");

    if (authorizationCode) {
      fetchAccessToken(authorizationCode);
    } else {
      console.error("No authorization code found in URL");
      navigate("/");
    }
  }, [navigate]);

  return <div>Processing login...</div>;
};

export default OAuthRedirect;
