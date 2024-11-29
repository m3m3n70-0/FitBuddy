from flask import Flask, request, jsonify
import requests
from flask_cors import CORS
import base64
from datetime import datetime

# Initialize Flask app and enable CORS
app = Flask(__name__)
CORS(app)

# Fitbit API Configuration
CLIENT_ID = "23PYYF"  # Replace with your Fitbit Client ID
CLIENT_SECRET = "cf4bc2be037b25da39fdaf8cc10b7f9b"  # Replace with your Fitbit Client Secret
TOKEN_URL = "https://api.fitbit.com/oauth2/token"
API_URL = "https://api.fitbit.com"

@app.route('/fitbit/token', methods=['POST'])
def exchange_token():
    """Exchange the authorization code for an access token."""
    code = request.json.get('code')  # Get authorization code from frontend
    redirect_uri = "http://localhost:3000/oauth-redirect"  # Must match the Fitbit Developer Portal

    # Payload for the token request
    payload = {
        'client_id': CLIENT_ID,
        'grant_type': 'authorization_code',
        'redirect_uri': redirect_uri,
        'code': code
    }

    # Authorization header using Base64 encoding
    auth_header = base64.b64encode(f"{CLIENT_ID}:{CLIENT_SECRET}".encode()).decode()
    headers = {
        'Authorization': f"Basic {auth_header}",
        'Content-Type': 'application/x-www-form-urlencoded'
    }

    # Debugging logs
    print(f"Authorization code received: {code}")
    print(f"Payload: {payload}")
    print(f"Headers: {headers}")

    # Send request to Fitbit for access token
    response = requests.post(TOKEN_URL, data=payload, headers=headers)

    # Debugging logs
    print(f"Fitbit API Response: {response.status_code}, {response.text}")

    # Return the response to the frontend
    if response.status_code == 200:
        return jsonify(response.json())
    else:
        return jsonify({'error': 'Failed to exchange token', 'details': response.json()}), response.status_code

@app.route('/fitbit/activity', methods=['POST'])
def fetch_activity():
    """Fetch activity data using the access token."""
    access_token = request.json.get('access_token')  # Get access token from frontend
    today_date = datetime.now().strftime('%Y-%m-%d')  # Format today's date (yyyy-MM-dd)

    endpoint = f"/1/user/-/activities/date/{today_date}.json"  # Use formatted date

    headers = {
        'Authorization': f"Bearer {access_token}"
    }

    # Debugging logs
    print(f"Access token received in backend: {access_token}")
    print(f"API Endpoint: {API_URL + endpoint}")

    # Send request to Fitbit to fetch activity data
    response = requests.get(API_URL + endpoint, headers=headers)

    # Debugging logs
    print(f"Fitbit API Response: {response.status_code}, {response.text}")

    if response.status_code == 200:
        return jsonify(response.json())
    else:
        return jsonify({'error': 'Failed to fetch activity', 'details': response.json()}), response.status_code

if __name__ == "__main__":
    app.run(port=4000, debug=True)
