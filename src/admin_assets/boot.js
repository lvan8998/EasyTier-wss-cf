export const bootScript = String.raw`
window.EasyTierAdmin = window.EasyTierAdmin || {};
const api = window.EasyTierAdmin;

let currentLang = 'en';
let token = localStorage.getItem('easytier_admin_token') || '';
let statsInterval = null;
let countdown = 5;
let globalStats = { rooms: [], totalPeers: 0, totalRx: 0, totalTx: 0 };
let activeSelectedRoomId = null;
let authCheckSeq = 0;
let easyTierConfigs = [];

const browserLang = navigator.language || '';
if (browserLang.startsWith('zh-CN') || browserLang.startsWith('zh-Hans')) {
  currentLang = 'zh-CN';
} else if (browserLang.startsWith('zh-TW') || browserLang.startsWith('zh-HK') || browserLang.startsWith('zh-Hant')) {
  currentLang = 'zh-TW';
} else if (browserLang.startsWith('ja')) {
  currentLang = 'ja';
} else if (browserLang.startsWith('ko')) {
  currentLang = 'ko';
}

const savedLang = localStorage.getItem('easytier_admin_lang');
if (savedLang && supportedLangs.indexOf(savedLang) !== -1) {
  currentLang = savedLang;
}

window.addEventListener('error', function (event) {
  console.error('Admin UI script error:', event.error || event.message);
});

const loginLang = document.getElementById('loginLang');
const dashboardLang = document.getElementById('dashboardLang');
if (loginLang) loginLang.value = currentLang;
if (dashboardLang) dashboardLang.value = currentLang;

api.updateUI();
if (token) {
  api.verifyToken();
} else {
  api.showLogin();
}

window.currentLang = currentLang;
window.token = token;
window.statsInterval = statsInterval;
window.countdown = countdown;
window.globalStats = globalStats;
window.activeSelectedRoomId = activeSelectedRoomId;
window.authCheckSeq = authCheckSeq;
window.easyTierConfigs = easyTierConfigs;

window.switchLanguage = api.switchLanguage;
window.handleLogin = api.handleLogin;
window.handleLogout = api.handleLogout;
window.switchTab = api.switchTab;
window.loadStats = api.loadStats;
window.loadRooms = api.loadRooms;
window.viewRoomPeers = api.viewRoomPeers;
window.closeRoomPeers = api.closeRoomPeers;
window.kickPeer = api.kickPeer;
window.loadTokens = api.loadTokens;
window.openCreateTokenModal = api.openCreateTokenModal;
window.closeCreateTokenModal = api.closeCreateTokenModal;
window.handleCreateToken = api.handleCreateToken;
window.deleteToken = api.deleteToken;
window.loadSettings = api.loadSettings;
window.openEasyTierConfigModal = api.openEasyTierConfigModal;
window.closeEasyTierConfigModal = api.closeEasyTierConfigModal;
window.handleCreateEasyTierConfig = api.handleCreateEasyTierConfig;
window.handleToggleRequireToken = api.handleToggleRequireToken;
window.handleChangePassword = api.handleChangePassword;
`;
