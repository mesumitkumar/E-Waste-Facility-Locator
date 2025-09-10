const eWasteCenters = [
  { name: 'AIWC laketown Kolkata', lat:22.618867, lng:88.386479 },
  { name: 'AIWC Salt lake Kolkata', lat: 22.516096, lng: 88.402550 },
  { name: 'Techno India Kolkata', lat:22.575760 , lng:88.428286 },
  { name: 'AIWC Delhi H.O', lat:28.622915 , lng: 77.235942 },
  { name: 'Imperial College Orrisa', lat:21.411443 , lng: 83.561239 },
  { name: 'AIWC Bardoli Gujarat', lat:21.122002 , lng: 73.113599 },
  { name: 'Maitreyi, Branch of AIWC Kakinada Andra Pradesh', lat:16.953018, lng:82.237743  },
  { name: 'Sant Nandlal Smritii Vidya Mandir Jharkhand', lat:22.583892, lng: 86.478429 },
  { name: 'AIWC Bangalore', lat:12.928148 , lng:77.589859  },
  { name: 'TATA Steel Technical Institute Jharkhand', lat:22.775627 , lng:86.203250  },
  { name: 'AIWC - Mumbai', lat:19.108916 , lng: 72.832290 },
  { name: 'The Modern School Rajasthan', lat:25.776028 , lng:71.394054 },
  { name: 'Collection Centre DAMAN AND DIU', lat: 20.416970, lng: 72.833173},
  { name: 'Collection Centre Vapi', lat:20.370434, lng: 72.862220},
  { name: 'Collection Centre Allahabad', lat:25.436002, lng: 81.793500 },
  { name: 'Collection Centre Amritsar	', lat:31.350452, lng: 75.575098 },
  { name: 'Collection Centre Goa', lat:15.351026, lng: 73.930372 },
  { name: 'Collection Centre Bhopal', lat:22.970184 , lng:76.129178 },
  { name: 'Collection Centre Cherlapally', lat:17.462293 , lng: 78.600655},
  { name: 'Collection Centre Gaya', lat: 24.548138, lng:80.945919 },
  { name: 'Collection Centre Bilaspur', lat:22.064473 , lng: 82.149063},
  { name: 'Own Collection Centre Haryana', lat: 30.376641, lng: 76.779757},
  { name: 'Own Collection Centre Shillong', lat:23.571477 , lng: 87.243821},
  { name: 'Own Collection Centre Guwahati', lat: 26.111254, lng:91.749108 },
  { name: 'Own Collection Centre Dimapur', lat: 25.913646, lng:93.728346 },
  { name: 'Own Collection Centre Agartala', lat:23.848635 , lng:91.298083 },
  { name: 'Collection Centre Chandigarh', lat: 30.711774, lng: 76.803551},
  { name: 'Collection Centre Jammu', lat:32.612158 , lng: 74.856256},
  { name: 'Collection Centre Baddi', lat:30.933998 , lng:76.806307 },
  { name: 'Collection Centre Haridwar', lat:29.938199 , lng:78.070698 },
  { name: 'Collection Centre Rangpo SIKKIM', lat:27.174436 , lng:88.530340 },
  { name: 'Collection Centre Naharlagun Andra Pradesh', lat:27.103223 , lng: 93.692310},
  { name: 'Collection Centre Imphal Manipur ', lat: 24.817819, lng: 93.944533},
  { name: 'Collection Centre Pondicherry	 ', lat: 11.910539, lng:79.764619 },
  { name: 'Collection Centre ANDAMAN AND NICOBAR', lat:11.664535 , lng: 92.739045}
  // Add more centers as needed
];
    const map = L.map('map');
    map.setView([22.50, 88.40], 4);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);
    
    for (const center of eWasteCenters) {
  const marker = L.marker([center.lat, center.lng]).addTo(map);
  
  // You can bind a popup to the marker to display additional information
  marker.bindPopup(`<b>${center.name}</b>`).openPopup();
}

// Function to handle the search
// Function to handle the search
// Function to handle the search

// Function to handle the search
function searchEwasteCenters(location) {
  // Clear any existing markers on the map
  map.eachLayer((layer) => {
    if (layer instanceof L.Marker) {
      map.removeLayer(layer);
    }
  });

  // Initialize an array to store matching locations
  const matchingLocations = [];

  // Loop through e-waste center coordinates and show markers that match the search location
  for (const center of eWasteCenters) {
    const { name, lat, lng } = center;

    // Check if the location name contains the search query (case-insensitive)
    if (name.toLowerCase().includes(location.toLowerCase())) {
      matchingLocations.push(center);

      // Add a marker for the matching location
      const marker = L.marker([lat, lng]).addTo(map);

      // Bind a popup to the marker with the center's name
      marker.bindPopup(`<b>${name}</b>`).openPopup();
    }
  }

  // If there are matching locations, zoom in on the first matching location with a zoom animation
  if (matchingLocations.length > 0) {
    const firstMatchingLocation = matchingLocations[0];
    const { lat, lng } = firstMatchingLocation;

    // Set the view to the first matching location with a zoom animation
    map.setView([lat, lng], 12, { animate: true });

    // Calculate the position of the map on the page
    const mapPosition = map.getContainer().getBoundingClientRect().top;

    // Calculate the current scroll position
    const currentScrollPosition = window.pageYOffset;

    // Calculate the target scroll position based on the map's position
    const targetScrollPosition = currentScrollPosition + mapPosition;

    // Use window.scrollTo to scroll to the map's position with an animation
    window.scrollTo({
      top: targetScrollPosition,
      behavior: 'smooth', // Smooth scrolling animation
    });
  }
}

// Event listener for the search button
document.getElementById('searchButton').addEventListener('click', () => {
  const locationInput = document.getElementById('locationInput').value;

  // Call the search function with the user's input
  searchEwasteCenters(locationInput);
});

$(document).ready(function() {
  $('#headerVideoLink').magnificPopup({
    type:'inline',
    midClick: true // Allow opening popup on middle mouse click. Always set it to true if you don't provide alternative source in href.
  });         
});



      
  
    
      

    