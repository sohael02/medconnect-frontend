// 🌍 Replace with your actual OpenRouteService API key
const ORS_API_KEY = "eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6ImI2NTdjMTEyNTg5MDQwYTRhZGU0YzVhNTk5MWUwZTU2IiwiaCI6Im11cm11cjY0In0=";

// 🔁 Scroll logic
window.addEventListener('scroll', () => {
  const welcome = document.getElementById('welcomeSection');
  const search = document.getElementById('searchSection');

  if (window.scrollY > 50) {
    welcome.classList.remove('visible');
    welcome.classList.add('hidden');
    search.classList.remove('hidden');
    search.classList.add('visible');
  } else {
    welcome.classList.remove('hidden');
    welcome.classList.add('visible');
    search.classList.remove('visible');
    search.classList.add('hidden');
  }
});

window.addEventListener('DOMContentLoaded', () => {
  document.getElementById('welcomeSection').classList.add('visible');
  document.getElementById('searchSection').classList.add('hidden');
});

// 🔍 Search functionality
document.getElementById('searchForm').addEventListener('submit', async function (e) {
  e.preventDefault();

  const medicine = document.getElementById('medicineInput').value.trim();
  const location = document.getElementById('userAddress').value.trim();

  if (!medicine || !location) {
    alert("Please enter both medicine and location.");
    return;
  }

  try {
    const geoResponse = await fetch(`https://api.openrouteservice.org/geocode/search?api_key=${ORS_API_KEY}&text=${encodeURIComponent(location)}&size=1`);
    const geoData = await geoResponse.json();

    if (!geoData.features || geoData.features.length === 0) {
      alert("Location not found. Please enter a valid address.");
      return;
    }

    const userLat = geoData.features[0].geometry.coordinates[1];
    const userLng = geoData.features[0].geometry.coordinates[0];

    const response = await fetch('https://medconnect-aquz.onrender.com/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ medicine, userLat, userLng })
    });

    const stores = await response.json();
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = "";

    if (stores.length === 0) {
      resultDiv.innerHTML = "<p>No stores found nearby with this medicine.</p>";
      return;
    }

    resultDiv.innerHTML = `<h2>Available Stores:</h2>`;
    stores.forEach(store => {
      const storeDiv = document.createElement('div');
      storeDiv.classList.add("store-card");
      storeDiv.innerHTML = `
        <h3>${store.store_name}</h3>
        <p><strong>Medicines:</strong> ${store.medicines}</p>
        <p><strong>Address:</strong> ${store.address}</p>
        <p><strong>Distance:</strong> ${store.distance?.toFixed(2)} km</p>
        <p><strong>Contact:</strong> ${store.contact_number}</p>
        <p><strong>Email:</strong> ${store.email}</p>
        <p><strong>Website:</strong> <a href="${store.website}" target="_blank">${store.website}</a></p>
      `;
      resultDiv.appendChild(storeDiv);
    });

  } catch (error) {
    console.error("Error during search:", error);
    alert("Something went wrong. Please try again later.");
  }
});