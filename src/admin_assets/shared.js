export const sharedScript = String.raw`
(function () {
  window.EasyTierAdmin = window.EasyTierAdmin || {};
  const api = window.EasyTierAdmin;

  api.safeCreateIcons = function safeCreateIcons() {
    try {
      if (typeof lucide !== 'undefined' && lucide.createIcons) {
        lucide.createIcons();
      }
    } catch (error) {
      console.warn('Lucide icons failed to load:', error);
    }
  };

  api.switchLanguage = function switchLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('easytier_admin_lang', lang);
    const loginLang = document.getElementById('loginLang');
    const dashboardLang = document.getElementById('dashboardLang');
    if (loginLang) loginLang.value = lang;
    if (dashboardLang) dashboardLang.value = lang;
    api.updateUI();
  };

  api.updateLanguagePickerLabels = function updateLanguagePickerLabels() {
    document.querySelectorAll('.top-lang-select option').forEach((option) => {
      const label = languageNames[option.value];
      if (label) option.textContent = label;
    });
  };

  api.updateLoginUI = function updateLoginUI() {
    const copy = loginCopy[currentLang] || loginCopy.en;
    const loginTitle = document.getElementById('loginTitle');
    const loginHint = document.getElementById('loginHint');
    const passwordLabel = document.querySelector('label[for="passwordInput"]');
    const passwordInput = document.getElementById('passwordInput');
    const loginButton = document.querySelector('#loginScreen button[type="submit"]');
    const loginError = document.getElementById('loginError');
    if (loginTitle) loginTitle.textContent = copy.title;
    if (loginHint) loginHint.textContent = copy.hint;
    if (passwordLabel) passwordLabel.textContent = copy.label;
    if (passwordInput) passwordInput.setAttribute('placeholder', copy.placeholder);
    if (loginButton) {
      const icon = loginButton.querySelector('i');
      loginButton.textContent = '';
      if (icon) loginButton.appendChild(icon);
      loginButton.appendChild(document.createTextNode(' ' + copy.button));
    }
    if (loginError) loginError.textContent = copy.error;
  };

  api.updateCountdownText = function updateCountdownText() {
    const refreshText = document.getElementById('refreshText');
    if (!refreshText) return;
    const text = currentLang === 'zh-CN' ? ('自动刷新 ' + countdown + ' 秒内') :
      currentLang === 'zh-TW' ? ('自動重新整理 ' + countdown + ' 秒內') :
      currentLang === 'ja' ? (countdown + '秒で自動更新') :
      currentLang === 'ko' ? (countdown + '초 뒤 새로고침') :
      ('Auto-refresh in ' + countdown + 's');
    refreshText.innerText = text;
  };

  api.formatBytes = function formatBytes(bytes) {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const index = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, index)).toFixed(2)) + ' ' + sizes[index];
  };

  api.updateUI = function updateUI() {
    const t = translations[currentLang] || translations.en;
    document.title = t['menu-overview'] + ' - EasyTier Admin';
    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const key = el.getAttribute('data-i18n');
      if (!t[key]) return;
      if (el.tagName === 'BUTTON') {
        const icon = el.querySelector('i');
        el.textContent = '';
        if (icon) el.appendChild(icon);
        el.appendChild(document.createTextNode(' ' + t[key]));
      } else {
        el.innerText = t[key];
      }
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
      const key = el.getAttribute('data-i18n-placeholder');
      if (t[key]) el.setAttribute('placeholder', t[key]);
    });
    const activeMenu = document.querySelector('.menu-item.active');
    if (activeMenu) {
      const span = activeMenu.querySelector('span');
      const pageTitle = document.getElementById('pageTitle');
      if (span && pageTitle) pageTitle.innerText = span.innerText;
    }
    api.updateCountdownText();
    api.updateLanguagePickerLabels();
    api.updateLoginUI();
  };

  api.showLogin = function showLogin() {
    const loginScreen = document.getElementById('loginScreen');
    const appLayout = document.getElementById('appLayout');
    if (loginScreen) loginScreen.style.display = 'flex';
    if (appLayout) {
      appLayout.style.display = 'none';
      appLayout.style.opacity = 0;
    }
    if (window.statsInterval) clearInterval(window.statsInterval);
  };

  api.showDashboard = function showDashboard() {
    const loginScreen = document.getElementById('loginScreen');
    const appLayout = document.getElementById('appLayout');
    if (loginScreen) loginScreen.style.display = 'none';
    if (appLayout) {
      appLayout.style.display = 'flex';
      setTimeout(() => {
        appLayout.style.opacity = 1;
      }, 50);
    }
    api.loadStats && api.loadStats();
    api.startPolling && api.startPolling();
  };
})();
`;
