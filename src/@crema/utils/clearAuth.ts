/**
 * Utility to clear all authentication data
 * Use this when switching from mock data to real API
 */

export const clearAllAuthData = () => {
  try {
    // Clear localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    localStorage.removeItem('remember');

    // Clear sessionStorage
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');

    // Clear all cookies
    document.cookie.split(';').forEach((c) => {
      document.cookie = c
        .replace(/^ +/, '')
        .replace(/=.*/, '=;expires=' + new Date().toUTCString() + ';path=/');
    });

    console.log('✅ Cleared all authentication data');
    return true;
  } catch (error) {
    console.error('❌ Error clearing auth data:', error);
    return false;
  }
};

/**
 * Clear auth and reload page
 */
export const clearAuthAndReload = () => {
  clearAllAuthData();
  window.location.href = '/signin';
};

/**
 * Development only: Add clear button to page
 * Remove this in production
 */
export const addDevClearButton = () => {
  if (process.env.NODE_ENV !== 'production') {
    const button = document.createElement('button');
    button.textContent = '🧹 Clear Auth (Dev)';
    button.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 9999;
      padding: 10px 20px;
      background: #ff4d4f;
      color: white;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-weight: bold;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    `;
    button.onclick = () => {
      if (confirm('Xóa tất cả token và reload?')) {
        clearAuthAndReload();
      }
    };
    document.body.appendChild(button);
  }
};
