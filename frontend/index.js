// Add at the top of your existing index.js file:
document.addEventListener('DOMContentLoaded', () => {
  const bookBtn = document.getElementById('bookPickupBtn');

  if (bookBtn) {
    bookBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const token = localStorage.getItem('auth_token');

      if (token) {
        window.location.href = 'booking.html';
      } else {
        window.location.href = 'login.html';
      }
    });
  }
});

/* ============================
   NAVBAR AUTH STATE LOGIC
============================ */
document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('auth_token');

  const loginNav = document.getElementById('loginNav');
  const profileNav = document.getElementById('profileNav');
  const logoutNav = document.getElementById('logoutNav');
  const logoutBtn = document.getElementById('logoutBtn');

  if (token) {
    // Logged IN
    if (loginNav) loginNav.style.display = 'none';
    if (profileNav) profileNav.style.display = 'inline-block';
    if (logoutNav) logoutNav.style.display = 'inline-block';
  } else {
    // Logged OUT
    if (loginNav) loginNav.style.display = 'inline-block';
    if (profileNav) profileNav.style.display = 'none';
    if (logoutNav) logoutNav.style.display = 'none';
  }

  // Logout handler
  if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
      e.preventDefault();
      localStorage.clear();
      window.location.href = 'index.html';
    });
  }
});

// API Helper with JWT
async function fetchWithAuth(url, options = {}) {
    const token = localStorage.getItem('auth_token');
    
    const headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...options.headers
    };
    
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    
    try {
        const response = await fetch(url, {
            ...options,
            headers
        });
        
        // Handle 401 Unauthorized
        if (response.status === 401) {
            localStorage.removeItem('auth_token');
            localStorage.removeItem('user');
            window.location.href = 'login.html';
            throw new Error('Session expired. Please login again.');
        }
        
        return await response.json();
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

// Then update any existing fetch calls in your index.js
// For example, if you had:
// const response = await fetch('/api/something');
// Change to:
// const data = await fetchWithAuth('/api/something');

// ========== E-Waste Center Data (same as your old JS) ==========
const eWasteCenters = [
  { name: 'AIWC laketown Kolkata', lat: 22.618867, lng: 88.386479 },
  { name: 'AIWC Salt lake Kolkata', lat: 22.516096, lng: 88.40255 },
  { name: 'Techno India Kolkata', lat: 22.57576, lng: 88.428286 },
  { name: 'AIWC Delhi H.O', lat: 28.622915, lng: 77.235942 },
  { name: 'Imperial College Orrisa', lat: 21.411443, lng: 83.561239 },
  { name: 'AIWC Bardoli Gujarat', lat: 21.122002, lng: 73.113599 },
  {
    name: 'Maitreyi, Branch of AIWC Kakinada Andra Pradesh',
    lat: 16.953018,
    lng: 82.237743
  },
  {
    name: 'Sant Nandlal Smritii Vidya Mandir Jharkhand',
    lat: 22.583892,
    lng: 86.478429
  },
  { name: 'AIWC Bangalore', lat: 12.928148, lng: 77.589859 },
  {
    name: 'TATA Steel Technical Institute Jharkhand',
    lat: 22.775627,
    lng: 86.20325
  },
  { name: 'AIWC - Mumbai', lat: 19.108916, lng: 72.83229 },
  { name: 'The Modern School Rajasthan', lat: 25.776028, lng: 71.394054 },
  { name: 'Collection Centre DAMAN AND DIU', lat: 20.41697, lng: 72.833173 },
  { name: 'Collection Centre Vapi', lat: 20.370434, lng: 72.86222 },
  { name: 'Collection Centre Allahabad', lat: 25.436002, lng: 81.7935 },
  { name: 'Collection Centre Amritsar', lat: 31.350452, lng: 75.575098 },
  { name: 'Collection Centre Goa', lat: 15.351026, lng: 73.930372 },
  { name: 'Collection Centre Bhopal', lat: 22.970184, lng: 76.129178 },
  { name: 'Collection Centre Cherlapally', lat: 17.462293, lng: 78.600655 },
  { name: 'Collection Centre Gaya', lat: 24.548138, lng: 80.945919 },
  { name: 'Collection Centre Bilaspur', lat: 22.064473, lng: 82.149063 },
  { name: 'Own Collection Centre Haryana', lat: 30.376641, lng: 76.779757 },
  { name: 'Own Collection Centre Shillong', lat: 23.571477, lng: 87.243821 },
  { name: 'Own Collection Centre Guwahati', lat: 26.111254, lng: 91.749108 },
  { name: 'Own Collection Centre Dimapur', lat: 25.913646, lng: 93.728346 },
  { name: 'Own Collection Centre Agartala', lat: 23.848635, lng: 91.298083 },
  { name: 'Collection Centre Chandigarh', lat: 30.711774, lng: 76.803551 },
  { name: 'Collection Centre Jammu', lat: 32.612158, lng: 74.856256 },
  { name: 'Collection Centre Baddi', lat: 30.933998, lng: 76.806307 },
  { name: 'Collection Centre Haridwar', lat: 29.938199, lng: 78.070698 },
  { name: 'Collection Centre Rangpo SIKKIM', lat: 27.174436, lng: 88.53034 },
  {
    name: 'Collection Centre Naharlagun Andra Pradesh',
    lat: 27.103223,
    lng: 93.69231
  },
  { name: 'Collection Centre Imphal Manipur', lat: 24.817819, lng: 93.944533 },
  { name: 'Collection Centre Pondicherry', lat: 11.910539, lng: 79.764619 },
  {
    name: 'Collection Centre ANDAMAN AND NICOBAR',
    lat: 11.664535,
    lng: 92.739045
  }
];

// We'll keep references we need at top-level
let map;
let allMarkers = [];

// ========== Map Initialization ==========

function initMap() {
  // Create the map, centered broadly on India
  map = L.map('map').setView([22.5, 88.4], 4);

  // Add OpenStreetMap tiles
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution:
      '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(map);

  // Add all center markers initially
  addAllCenterMarkers();
}

function addAllCenterMarkers() {
  // Clear old markers from array (not strictly needed for first load)
  allMarkers.forEach(marker => map.removeLayer(marker));
  allMarkers = [];

  eWasteCenters.forEach(center => {
    const marker = L.marker([center.lat, center.lng]).addTo(map);
    marker.bindPopup(`<b>${center.name}</b>`);
    allMarkers.push(marker);
  });
}

// ========== Search Functionality ==========

function searchEwasteCenters(location) {
  const query = location.trim().toLowerCase();

  // Remove all current markers from map
  allMarkers.forEach(marker => map.removeLayer(marker));
  allMarkers = [];

  // If no query, add all markers back and zoom out
  if (!query) {
    addAllCenterMarkers();
    map.setView([22.5, 88.4], 4);
    return;
  }

  // Store matching centers
  const matchingLocations = [];

  eWasteCenters.forEach(center => {
    const { name, lat, lng } = center;
    if (name.toLowerCase().includes(query)) {
      matchingLocations.push(center);

      const marker = L.marker([lat, lng]).addTo(map);
      marker.bindPopup(`<b>${name}</b>`).openPopup();
      allMarkers.push(marker);
    }
  });

  // Focus map on first result if any
  if (matchingLocations.length > 0) {
    const first = matchingLocations[0];
    map.setView([first.lat, first.lng], 10, { animate: true });

    // Smooth scroll to map
    const mapElement = document.getElementById('map');
    const mapTop = mapElement.getBoundingClientRect().top + window.pageYOffset;
    window.scrollTo({ top: mapTop - 80, behavior: 'smooth' });
  } else {
    alert('No matching e-waste centers found for that location.');
    // Optionally restore all markers
    addAllCenterMarkers();
  }
}

// ========== "Use My Location" (Geolocation) ==========

function centerMapOnUserLocation() {
  if (!navigator.geolocation) {
    alert('Geolocation is not supported by your browser.');
    return;
  }

  navigator.geolocation.getCurrentPosition(
    pos => {
      const { latitude, longitude } = pos.coords;
      map.setView([latitude, longitude], 10, { animate: true });

      const userMarker = L.marker([latitude, longitude]).addTo(map);
      userMarker.bindPopup('<b>Your Location</b>').openPopup();
      allMarkers.push(userMarker);
    },
    () => {
      alert('Unable to retrieve your location.');
    }
  );
}

// ========== Video Modal Logic (Stops video on close) ==========

function initVideoModal() {
  const openBtn = document.getElementById('openVideoBtn');
  const modal = document.getElementById('videoModal');
  const closeBtn = document.querySelector('.video-modal-close');
  const iframe = document.getElementById('recycleVideo');

  if (!openBtn || !modal || !closeBtn || !iframe) return;

  const originalSrc = iframe.getAttribute('src');

  // Open modal & (re)load the video
  openBtn.addEventListener('click', () => {
    modal.style.display = 'block';
    // Reset the src so it (re)starts when opened
    iframe.setAttribute('src', originalSrc);
  });

  // Helper to close modal & stop video
  function closeModal() {
    modal.style.display = 'none';
    // Remove src so YouTube stops playing in background
    iframe.setAttribute('src', '');
  }

  // Close when clicking X
  closeBtn.addEventListener('click', closeModal);

  // Close when clicking outside the video content
  modal.addEventListener('click', event => {
    if (event.target === modal) {
      closeModal();
    }
  });

  // (Optional) Escape key closes modal
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && modal.style.display === 'block') {
      closeModal();
    }
  });
}

// ========== Contact Form (Simple client-side handler) ==========

function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', event => {
    event.preventDefault();

    alert('Thank you for contacting us! This is a demo form.');

    form.reset();
  });
}

// ========== Event Listeners Setup ==========

document.addEventListener('DOMContentLoaded', () => {
  // Initialize map
  initMap();

  // Search button
  const searchButton = document.getElementById('searchButton');
  const locationInput = document.getElementById('locationInput');
  if (searchButton && locationInput) {
    searchButton.addEventListener('click', () => {
      searchEwasteCenters(locationInput.value);
    });

    // Also allow pressing Enter in the input to search
    locationInput.addEventListener('keydown', event => {
      if (event.key === 'Enter') {
        event.preventDefault();
        searchEwasteCenters(locationInput.value);
      }
    });
  }

  // "Use my location" button
  const findMeBtn = document.getElementById('findMe');
  if (findMeBtn) {
    findMeBtn.addEventListener('click', centerMapOnUserLocation);
  }

  // Video modal
  initVideoModal();

  // Contact form handler
  initContactForm();
});

/* ============================
   CONTACT FORM VALIDATION
============================ */
document.addEventListener('DOMContentLoaded', () => {
  const contactForm = document.querySelector('form'); // your contact form

  if (!contactForm) return;

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Fetch values using placeholders / order
    const inputs = contactForm.querySelectorAll('input, select, textarea');

    let allFilled = true;

    inputs.forEach(input => {
      if (!input.value || input.value.trim() === '') {
        allFilled = false;
      }
    });

    if (!allFilled) {
      alert('Please fill all the fields.');
      return;
    }

    alert('Your message has been sent successfully!');
    contactForm.reset();
  });
});

/* ============================
   CONTACT SECTION – SEND MESSAGE
============================ */

const sendMessageBtn = Array.from(document.querySelectorAll('button'))
  .find(btn => btn.textContent.trim() === 'Send Message');

if (sendMessageBtn) {
  sendMessageBtn.addEventListener('click', (e) => {
    e.preventDefault();

    const contactSection = sendMessageBtn.closest('section');
    if (!contactSection) return;

    const inputs = contactSection.querySelectorAll('input, select, textarea');
    const successMsg = document.getElementById('contactSuccessMsg');

    let allFilled = true;

    inputs.forEach(input => {
      if (!input.value || input.value.trim() === '') {
        allFilled = false;
      }
    });

    if (!allFilled) {
      // simple inline error
      alert('Please fill all the fields.');
      return;
    }

    // Show success message
    if (successMsg) {
      successMsg.style.display = 'block';

      // auto hide after 4 seconds
      setTimeout(() => {
        successMsg.style.display = 'none';
      }, 4000);
    }

    // Clear form fields
    inputs.forEach(input => input.value = '');
  });
}
