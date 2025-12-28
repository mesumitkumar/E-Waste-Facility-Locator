const API_BASE_URL = 'https://e-waste-facility-locator-production.up.railway.app/api';

document.addEventListener('DOMContentLoaded', async () => {
  const token = localStorage.getItem('auth_token');
  document.addEventListener('DOMContentLoaded', async () => {
  const token = localStorage.getItem('auth_token');

  if (!token) {
    window.location.href = 'index.html';
    return;
  }

  // show dashboard shell immediately
  document.getElementById('dashboardContent').style.display = 'block';


  // Show dashboard
  document.getElementById('dashboardContent').style.display = 'block';

  document.getElementById('userName').textContent =
  d.user.name || d.user.email;


  try {
    document.getElementById('dashboardLoading').style.display = 'block';

    const res = await fetch(`${API_BASE_URL}/users/dashboard`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!res.ok) {
      throw new Error('Unauthorized');
    }

    const result = await res.json();

    const d = result.dashboard;

    document.getElementById('pointsBalance').textContent =
      d.stats.totalPoints;

    document.getElementById('pickupCount').textContent =
      d.stats.totalBookings;

    document.getElementById('carbonSaved').textContent =
      d.user.carbonSaved;

    document.getElementById('walletBalance').textContent =
      `₹${d.stats.totalPoints}`;

    renderRecentActivity(d.recentActivity);

  } catch (err) {
  console.error('Dashboard error:', err);

  if (err.message === 'Unauthorized') {
    localStorage.clear();
    window.location.href = 'index.html';
  }

  } finally {
    document.getElementById('dashboardLoading').style.display = 'none';
  }
});

function renderRecentActivity(items) {
  const list = document.querySelector('.activity-list');
  list.innerHTML = '';

  if (!items || items.length === 0) {
    list.innerHTML = '<p>No recent activity</p>';
    return;
  }

  items.forEach(item => {
    list.innerHTML += `
      <div class="activity-item">
        <i class="fas fa-truck activity-icon pickup"></i>
        <div class="activity-details">
          <p><strong>Pickup ${item.status}</strong></p>
          <p class="activity-time">
            ${new Date(item.created_at).toLocaleString()}
          </p>
        </div>
        <span class="activity-points">
          +${item.points_earned} points
        </span>
      </div>
    `;
  });
}

// Logout
document.getElementById('logoutLink')?.addEventListener('click', (e) => {
  e.preventDefault();
  localStorage.clear();
  window.location.href = 'index.html';
});
