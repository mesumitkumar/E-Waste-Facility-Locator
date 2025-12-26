// Booking functionality
document.addEventListener('DOMContentLoaded', function () {
  const API_BASE_URL = 'http://localhost:5000/api';

  // Auth check
  const token = localStorage.getItem('auth_token');
  const user = localStorage.getItem('user');

  if (!token || !user) {
    window.location.href = 'login.html';
    return;
  }

  // DOM elements
  const bookingForm = document.getElementById('bookingForm');
  const weightInput = document.getElementById('weight');
  const pointsPreview = document.getElementById('estimatedPoints');
  const summaryDevice = document.getElementById('summaryDevice');
  const summaryWeight = document.getElementById('summaryWeight');
  const summaryPoints = document.getElementById('summaryPoints');
  const summaryDate = document.getElementById('summaryDate');
  const summaryTime = document.getElementById('summaryTime');
  const bookingMessage = document.getElementById('bookingMessage');

  // Date limits
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  document.getElementById('pickupDate').min =
    tomorrow.toISOString().split('T')[0];

  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + 30);
  document.getElementById('pickupDate').max =
    maxDate.toISOString().split('T')[0];

  // ======================
  // POINTS LOGIC
  // ======================
  function calculatePoints(weight) {
    return Math.round(weight * 30);
  }

  function updatePointsCalculation() {
    const weight = parseFloat(weightInput.value) || 0;
    pointsPreview.textContent = calculatePoints(weight);
    updateSummary();
  }

  // ======================
  // SUMMARY UPDATE
  // ======================
  function updateSummary() {
    const device = document.getElementById('deviceType').value || '-';
    const weight = parseFloat(weightInput.value) || 0;
    const points = calculatePoints(weight);
    const date = document.getElementById('pickupDate').value || '-';
    const time = document.getElementById('pickupTimeSlot').value || '-';

    summaryDevice.textContent = device;
    summaryWeight.textContent = weight + ' kg';
    summaryPoints.textContent = points + ' points';
    summaryDate.textContent = date;
    summaryTime.textContent = time;
  }

  // Event listeners
  weightInput.addEventListener('input', updatePointsCalculation);
  document.getElementById('deviceType').addEventListener('change', updateSummary);
  document.getElementById('pickupDate').addEventListener('change', updateSummary);
  document.getElementById('pickupTimeSlot').addEventListener('change', updateSummary);
  document.getElementById('quantity').addEventListener('input', updateSummary);

  // ======================
  // FORM SUBMIT
  // ======================
  bookingForm.addEventListener('submit', async function (e) {
    e.preventDefault();

    // Structured address
    const flatNo = document.getElementById('flatNo').value.trim();
    const area = document.getElementById('area').value.trim();
    const city = document.getElementById('city').value.trim();
    const state = document.getElementById('state').value.trim();
    const pincode = document.getElementById('pincode').value.trim();

    const pickupAddress = `${flatNo}, ${area}, ${city}, ${state} - ${pincode}`;

    const formData = {
      deviceType: document.getElementById('deviceType').value,
      quantity: parseInt(document.getElementById('quantity').value),
      weight: parseFloat(document.getElementById('weight').value),
      pickupDate: document.getElementById('pickupDate').value,
      pickupTimeSlot: document.getElementById('pickupTimeSlot').value,
      specialInstructions:
        document.getElementById('specialInstructions').value || null,

      flatNo,
      area,
      city,
      state,
      pincode
    };

    // Validation
    if (
      !formData.deviceType ||
      !formData.weight ||
      !formData.pickupDate ||
      !formData.pickupTimeSlot ||
      !flatNo ||
      !area ||
      !city ||
      !state ||
      !/^\d{6}$/.test(pincode)
    ) {
      showMessage(bookingMessage, 'Please fill all required fields correctly', 'error');
      return;
    }

    const submitBtn = this.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Booking...';
    submitBtn.disabled = true;

    try {
      const response = await fetch(`${API_BASE_URL}/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        showMessage(bookingMessage, data.message, 'success');

        if (data.user) {
          localStorage.setItem('user', JSON.stringify(data.user));
        }

        setTimeout(() => {
          window.location.href = 'dashboard.html';
        }, 5000);
      } else {
        showMessage(bookingMessage, data.message || 'Booking failed', 'error');
      }
    } catch (error) {
      console.error('Booking error:', error);
      showMessage(bookingMessage, 'Network error. Please try again.', 'error');
    } finally {
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
    }
  });

  function showMessage(element, text, type = 'info') {
    element.className = `message ${type}`;
    element.innerHTML =
      type === 'success'
        ? `<i class="fas fa-check-circle"></i> ${text}<br><small>Redirecting to dashboard in 5 seconds...</small>`
        : text;
  }

  // Logout
  document.querySelector('.logout-btn')?.addEventListener('click', function (e) {
    e.preventDefault();
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    window.location.href = 'index.html';
  });

  // Init
  updatePointsCalculation();
  updateSummary();
});
