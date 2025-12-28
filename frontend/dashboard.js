const API_BASE_URL = 'https://e-waste-facility-locator-production.up.railway.app/api';


document.addEventListener('DOMContentLoaded', async () => {
  const token = localStorage.getItem('auth_token');
  const user = JSON.parse(localStorage.getItem('user'));

  if (!token || !user) {
    document.getElementById('dashboardContent').style.display = 'none';
    document.getElementById('authContent').style.display = 'block';
    return;
  }

  document.getElementById('dashboardContent').style.display = 'block';
  document.getElementById('authContent').style.display = 'none';

  document.getElementById('userName').textContent =
    user.name || user.email;

  try {
    document.getElementById('dashboardLoading').style.display = 'block';

    const res = await fetch(`${API_BASE_URL}/users/dashboard`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const result = await res.json();
    if (!result.success) return;

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
            ${new Date(item.created_at).toLocaleDateString()}
          </p>
        </div>
        <span class="activity-points">
          +${item.points_earned} points
        </span>
      </div>
    `;
  });
}

document.getElementById('logoutLink')?.addEventListener('click', (e) => {
  e.preventDefault();
  localStorage.removeItem('auth_token');
  localStorage.removeItem('user');
  window.location.href = 'index.html';
});
