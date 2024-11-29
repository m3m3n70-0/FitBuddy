import React from "react";

const Login = () => {
  const clientId = "23PYYF"; // Jouw Client ID
  const redirectUri = "http://localhost:3000/oauth-redirect"; // Moet overeenkomen met de Fitbit Developer Portal
  const scope = "activity heartrate sleep";

  const fitbitAuthUrl = `https://www.fitbit.com/oauth2/authorize?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(
    redirectUri
  )}&scope=${scope}&expires_in=3600`;

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>FitBuddy Login</h1>
      <p>Log in met Fitbit om te starten</p>
      <a href={fitbitAuthUrl}>
        <button style={{ padding: "10px 20px", fontSize: "16px" }}>
          Log in met Fitbit
        </button>
      </a>
    </div>
  );
};

export default Login;
