export const authScript = String.raw`
(function () {
  window.EasyTierAdmin = window.EasyTierAdmin || {};
  const api = window.EasyTierAdmin;

  api.verifyToken = async function verifyToken() {
    const verifySeq = ++authCheckSeq;
    const tokenSnapshot = token;
    try {
      const res = await fetch('/api/auth/verify', {
        headers: {
          'Authorization': 'Bearer ' + token,
          'X-Admin-Token': token
        }
      });
      if (verifySeq !== authCheckSeq || tokenSnapshot !== token) return;
      if (res.ok) {
        api.showDashboard();
      } else {
        api.showLogin();
      }
    } catch (error) {
      if (verifySeq !== authCheckSeq || tokenSnapshot !== token) return;
      api.showLogin();
    }
  };

  api.handleLogin = async function handleLogin(event) {
    event.preventDefault();
    const password = document.getElementById('passwordInput').value;
    const loginSeq = ++authCheckSeq;
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });
      const data = await res.json();
      if (loginSeq !== authCheckSeq) return;
      if (res.ok && data.token) {
        token = data.token;
        localStorage.setItem('easytier_admin_token', token);
        api.showDashboard();
        api.loadStats && api.loadStats();
        api.startPolling && api.startPolling();
        api.updateUI();
      } else {
        const loginError = document.getElementById('loginError');
        if (loginError) loginError.style.display = 'block';
      }
    } catch (error) {
      if (loginSeq !== authCheckSeq) return;
      const loginError = document.getElementById('loginError');
      if (loginError) loginError.style.display = 'block';
    }
  };

  api.handleLogout = function handleLogout() {
    authCheckSeq++;
    token = '';
    localStorage.removeItem('easytier_admin_token');
    api.showLogin();
  };
})();
`;
