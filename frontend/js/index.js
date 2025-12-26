// ========== E-Waste Center Data ==========
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

// Map + markers
let map;
let allMarkers = [];

// Simple "frontend auth" state (for now; later replaced by backend)
let currentUser = null;
let rewardPoints = 0;

// ========== Map Initialization ==========

function initMap() {
  map = L.map('map').setView([22.5, 88.4], 4);

  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution:
      '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(map);

  addAllCenterMarkers();
}

function addAllCenterMarkers() {
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

  // Remove all markers
  allMarkers.forEach(marker => map.removeLayer(marker));
  allMarkers = [];

  if (!query) {
    addAllCenterMarkers();
    map.setView([22.5, 88.4], 4);
    return;
  }

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

  if (matchingLocations.length > 0) {
    const first = matchingLocations[0];
    map.setView([first.lat, first.lng], 10, { animate: true });

    const mapElement = document.getElementById('map');
    const mapTop = mapElement.getBoundingClientRect().top + window.pageYOffset;
    window.scrollTo({ top: mapTop - 80, behavior: 'smooth' });
  } else {
    alert('No matching e-waste centers found for that location.');
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

  // Open modal & (re)load video
  openBtn.addEventListener('click', () => {
    modal.style.display = 'block';
    iframe.setAttribute('src', originalSrc);
  });

  function closeModal() {
    modal.style.display = 'none';
    iframe.setAttribute('src', '');
  }

  closeBtn.addEventListener('click', closeModal);

  modal.addEventListener('click', event => {
    if (event.target === modal) {
      closeModal();
    }
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && modal.style.display === 'block') {
      closeModal();
    }
  });
}

// ========== Contact Form (simple demo handler) ==========

function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', event => {
    event.preventDefault();
    alert('Thank you for contacting us! This is a demo form.');
    form.reset();
  });
}

// ========== Frontend Auth + Rewards (using localStorage for now) ==========

function loadUserFromStorage() {
  const storedUser = localStorage.getItem('ewasteUser');
  const storedPoints = localStorage.getItem('ewastePoints');

  if (storedUser) {
    try {
      currentUser = JSON.parse(storedUser);
    } catch {
      currentUser = null;
    }
  }

  if (storedPoints) {
    const parsed = parseInt(storedPoints, 10);
    rewardPoints = isNaN(parsed) ? 0 : parsed;
  }

  updateRewardsUI();
}

function updateRewardsUI() {
  const navPointsSpan = document.getElementById('navRewardPoints');
  const currentPointsSpan = document.getElementById('currentPoints');

  if (navPointsSpan) {
    navPointsSpan.textContent = rewardPoints;
  }
  if (currentPointsSpan) {
    currentPointsSpan.textContent = rewardPoints;
  }
}

function initAuthSystem() {
  const authNav = document.getElementById('authNav');
  const rewardsNav = document.getElementById('rewardsNav');
  const authModal = document.getElementById('authModal');
  const rewardsModal = document.getElementById('rewardsModal');
  const loginForm = document.getElementById('loginForm');
  const signupForm = document.getElementById('signupForm');
  const authTabs = document.querySelectorAll('.auth-tab');
  const redeemForm = document.getElementById('redeemForm');
  const redeemMessage = document.getElementById('redeemMessage');

  function openModal(modalElement) {
    if (modalElement) {
      modalElement.style.display = 'block';
    }
  }

  function closeModalById(id) {
    const modalElement = document.getElementById(id);
    if (modalElement) {
      modalElement.style.display = 'none';
    }
  }

  function setActiveAuthTab(tabName) {
    authTabs.forEach(btn => {
      const isActive = btn.dataset.tab === tabName;
      btn.classList.toggle('active', isActive);
    });

    if (loginForm && signupForm) {
      if (tabName === 'login') {
        loginForm.classList.remove('hidden');
        signupForm.classList.add('hidden');
      } else {
        signupForm.classList.remove('hidden');
        loginForm.classList.add('hidden');
      }
    }
  }

  // Navbar: Login / Signup click
  if (authNav && authModal) {
    authNav.addEventListener('click', event => {
      event.preventDefault();
      setActiveAuthTab(currentUser ? 'login' : 'signup');
      openModal(authModal);
    });
  }

  // Navbar: Rewards click
  if (rewardsNav && rewardsModal) {
    rewardsNav.addEventListener('click', event => {
      event.preventDefault();

      if (!currentUser) {
        alert('Please login or sign up to view and redeem rewards.');
        if (authModal) {
          setActiveAuthTab('signup');
          openModal(authModal);
        }
        return;
      }

      updateRewardsUI();
      openModal(rewardsModal);
    });
  }

  // Auth tab buttons
  authTabs.forEach(btn => {
    btn.addEventListener('click', () => {
      setActiveAuthTab(btn.dataset.tab);
    });
  });

  // Close buttons for modals
  document.querySelectorAll('.modal-close').forEach(closeBtn => {
    const targetId = closeBtn.dataset.close;
    closeBtn.addEventListener('click', () => {
      closeModalById(targetId);
    });
  });

  // Close when clicking outside modal content
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', e => {
      if (e.target === overlay) {
        overlay.style.display = 'none';
      }
    });
  });

  // Login form submit
  if (loginForm) {
    loginForm.addEventListener('submit', event => {
      event.preventDefault();
      const email = loginForm.loginEmail.value.trim();
      const password = loginForm.loginPassword.value.trim();

      if (!currentUser || currentUser.email !== email) {
        alert('No such user found. Please sign up first.');
        setActiveAuthTab('signup');
        return;
      }

      // In real app: verify password on backend.
      if (!password) {
        alert('Please enter your password.');
        return;
      }

      alert(`Welcome back, ${currentUser.name}!`);
      closeModalById('authModal');
    });
  }

  // Signup form submit
  if (signupForm) {
    signupForm.addEventListener('submit', event => {
      event.preventDefault();

      const name = signupForm.signupName.value.trim();
      const email = signupForm.signupEmail.value.trim();
      const password = signupForm.signupPassword.value.trim();
      const city = signupForm.signupCity.value.trim();

      if (!name || !email || !password) {
        alert('Please fill in all required fields.');
        return;
      }

      // Save fake user for demo
      currentUser = { name, email, city };
      localStorage.setItem('ewasteUser', JSON.stringify(currentUser));

      // Ensure reward points key exists
      localStorage.setItem('ewastePoints', String(rewardPoints));
      updateRewardsUI();

      alert('Signup successful! Your demo account is now active.');
      closeModalById('authModal');
    });
  }

  // Redeem rewards form
  if (redeemForm) {
    redeemForm.addEventListener('submit', event => {
      event.preventDefault();

      if (!currentUser) {
        alert('Please login to redeem rewards.');
        return;
      }

      const pointsToRedeem = parseInt(
        redeemForm.redeemPoints.value,
        10
      );

      if (isNaN(pointsToRedeem) || pointsToRedeem <= 0) {
        redeemMessage.textContent = 'Enter a valid number of points.';
        return;
      }

      if (pointsToRedeem > rewardPoints) {
        redeemMessage.textContent = 'You do not have enough points.';
        return;
      }

      rewardPoints -= pointsToRedeem;
      localStorage.setItem('ewastePoints', String(rewardPoints));
      updateRewardsUI();

      const amount = pointsToRedeem; // demo: 1 point = ₹1
      redeemMessage.textContent =
        `Redeemed ${pointsToRedeem} points (~₹${amount}) in this demo. ` +
        'In a real app, this would send a payout request to the backend.';

      redeemForm.reset();
    });
  }
}

// ========== DOMContentLoaded ==========

document.addEventListener('DOMContentLoaded', () => {
  // Map and related buttons
  initMap();

  const searchButton = document.getElementById('searchButton');
  const locationInput = document.getElementById('locationInput');
  if (searchButton && locationInput) {
    searchButton.addEventListener('click', () => {
      searchEwasteCenters(locationInput.value);
    });

    locationInput.addEventListener('keydown', event => {
      if (event.key === 'Enter') {
        event.preventDefault();
        searchEwasteCenters(locationInput.value);
      }
    });
  }

  const findMeBtn = document.getElementById('findMe');
  if (findMeBtn) {
    findMeBtn.addEventListener('click', centerMapOnUserLocation);
  }

  // Video popup
  initVideoModal();

  // Contact form
  initContactForm();

  // Auth + rewards
  loadUserFromStorage();
  initAuthSystem();
});
