const API_BASE_URL = 'https://e-waste-facility-locator-production.up.railway.app/api';

document.addEventListener('DOMContentLoaded', async () => {
  const token = localStorage.getItem('auth_token');

  if (!token) {
    window.location.href = 'index.html';
    return;
  }

  document.getElementById('dashboardContent').style.display = 'block';

  try {
    document.getElementById('dashboardLoading').style.display = 'block';

    const res = await fetch(`${API_BASE_URL}/users/dashboard`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (res.status === 401) throw new Error('Unauthorized');

    const result = await res.json();
    const d = result.dashboard;

    document.getElementById('userName').textContent =
      d.user.name || d.user.email;

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
    console.error(err);
    if (err.message === 'Unauthorized') {
      localStorage.clear();
      window.location.href = 'index.html';
    }
  } finally {
    document.getElementById('dashboardLoading').style.display = 'none';
  }
});
