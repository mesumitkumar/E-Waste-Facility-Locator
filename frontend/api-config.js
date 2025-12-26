// API Configuration
const API_CONFIG = {
    BASE_URL: 'http://localhost:5000/api',
    ENDPOINTS: {
        AUTH: {
            LOGIN: '/auth/login',
            REGISTER: '/auth/register',
            LOGOUT: '/auth/logout',
            PROFILE: '/auth/profile'
        },
        EWASTE: {
            CENTERS: '/centers',
            BOOKINGS: '/bookings',
            REWARDS: '/rewards'
        }
    },
    HEADERS: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
};

// Get JWT Token
function getToken() {
    return localStorage.getItem('auth_token');
}

// Get Authorization Header
function getAuthHeader() {
    const token = getToken();
    return token ? { 'Authorization': `Bearer ${token}` } : {};
}

// Check if user is authenticated
function isAuthenticated() {
    return !!getToken();
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { API_CONFIG, getToken, getAuthHeader, isAuthenticated };
}