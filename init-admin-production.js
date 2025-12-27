// Run this once after deploying to create admin user
// Replace YOUR_RAILWAY_URL with your actual Railway URL

const API_URL = 'https://your-app-name.railway.app/api';

fetch(`${API_URL}/auth/init-admin`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  }
})
.then(response => response.json())
.then(data => console.log('Admin user created:', data))
.catch(error => console.error('Error:', error));