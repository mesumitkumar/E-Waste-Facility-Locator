const API_BASE_URL = 'https://e-waste-facility-locator-production.up.railway.app/api';


/* =====================
   UTILITY FUNCTIONS
===================== */
function showMessage(el, msg, type = 'info') {
    if (!el) return;
    el.textContent = msg;
    el.className = `message ${type}`;
}

function getAuth() {
    const token = localStorage.getItem('auth_token');
    const user = localStorage.getItem('user');
    return {
        isLoggedIn: !!token,
        token,
        user: user ? JSON.parse(user) : null
    };
}

/* =====================
   LOGIN FORM
===================== */
document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('loginEmail').value.trim().toLowerCase();
    const password = document.getElementById('loginPassword').value.trim();
    const messageDiv = document.getElementById('loginMessage');

    try {
        const res = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message);

        localStorage.setItem('auth_token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));

        showMessage(messageDiv, 'Login successful!', 'success');
        setTimeout(() => location.href = 'index.html', 1000);

    } catch (err) {
        showMessage(messageDiv, err.message || 'Login failed', 'error');
    }
});

/* =====================
   SIGNUP FORM
===================== */
document.getElementById('signupForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('fullName').value.trim();
    const email = document.getElementById('signupEmail').value.trim().toLowerCase();
    const password = document.getElementById('signupPassword').value.trim();
    const confirmPassword = document.getElementById('confirmPassword').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const city = document.getElementById('location').value;
    const messageDiv = document.getElementById('signupMessage');

    if (password !== confirmPassword) {
        showMessage(messageDiv, 'Passwords do not match', 'error');
        return;
    }

    try {
        const res = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name,
                email,
                password,
                mobile: phone || null,
                city: city || null
            })
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message);

        localStorage.setItem('auth_token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));

        showMessage(messageDiv, 'Signup successful!', 'success');
        setTimeout(() => location.href = 'index.html', 1000);

    } catch (err) {
        showMessage(messageDiv, err.message || 'Signup failed', 'error');
    }
});

/* =====================
   LOGOUT
===================== */
document.querySelectorAll('.logout-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.clear();
        location.href = 'index.html';
    });
});

/* =====================
   PROTECTED PAGES
===================== */
if (location.pathname.includes('dashboard.html')) {
    const auth = getAuth();
    if (!auth.isLoggedIn) {
        location.href = 'login.html';
    }
}
