export const tokensSettingsScript = String.raw`
(function () {
  window.EasyTierAdmin = window.EasyTierAdmin || {};
  const api = window.EasyTierAdmin;

  api.loadTokens = async function loadTokens() {
    try {
      const res = await fetch('/api/tokens', {
        headers: { 'Authorization': 'Bearer ' + token, 'X-Admin-Token': token }
      });
      if (!res.ok) throw new Error('API failed');
      const data = await res.json();
      const body = document.getElementById('tokensTableBody');
      if (!body) return;
      body.innerHTML = '';
      const tokens = data.tokens || [];
      if (!tokens.length) {
        body.innerHTML = '<tr><td colspan="4" style="text-align:center; color:var(--text-muted);">No tokens generated yet. Click Add EasyTier Config to start.</td></tr>';
        return;
      }
      tokens.forEach((tok) => {
        const tr = document.createElement('tr');
        tr.innerHTML = '<td style="font-family: monospace; font-weight: 600; color: #a78bfa;">' + tok.token + '</td>' +
          '<td>' + (tok.description || '') + '</td>' +
          '<td style="color: var(--text-secondary);">' + new Date(tok.createdAt).toLocaleString() + '</td>' +
          '<td><button class="btn-action btn-danger-action" onclick="EasyTierAdmin.deleteToken(' + JSON.stringify(tok.token) + ')"><i data-lucide="trash-2" style="width: 14px; height: 14px;"></i> ' + translations[currentLang]['action-delete'] + '</button></td>';
        body.appendChild(tr);
      });
      api.safeCreateIcons();
    } catch (error) {
      console.error(error);
    }
  };

  api.openCreateTokenModal = function openCreateTokenModal() {
    const modal = document.getElementById('createTokenModal');
    if (modal) modal.style.display = 'flex';
  };

  api.closeCreateTokenModal = function closeCreateTokenModal() {
    const modal = document.getElementById('createTokenModal');
    const input = document.getElementById('tokenDescInput');
    if (modal) modal.style.display = 'none';
    if (input) input.value = '';
  };

  api.handleCreateToken = async function handleCreateToken(event) {
    event.preventDefault();
    const description = document.getElementById('tokenDescInput').value;
    try {
      const res = await fetch('/api/tokens', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token,
          'X-Admin-Token': token
        },
        body: JSON.stringify({ description })
      });
      if (res.ok) {
        alert(translations[currentLang]['msg-gen-success']);
        api.closeCreateTokenModal();
        api.loadTokens();
      }
    } catch (error) {
      console.error(error);
    }
  };

  api.deleteToken = async function deleteToken(tokenVal) {
    if (!confirm('Are you sure you want to delete this token?')) return;
    try {
      const res = await fetch('/api/tokens?token=' + encodeURIComponent(tokenVal), {
        method: 'DELETE',
        headers: { 'Authorization': 'Bearer ' + token, 'X-Admin-Token': token }
      });
      if (res.ok) {
        alert(translations[currentLang]['msg-deleted-success']);
        api.loadTokens();
      }
    } catch (error) {
      console.error(error);
    }
  };

  api.loadSettings = async function loadSettings() {
    try {
      const res = await fetch('/api/config', {
        headers: { 'Authorization': 'Bearer ' + token, 'X-Admin-Token': token }
      });
      if (res.ok) {
        const data = await res.json();
        const toggle = document.getElementById('requireTokenToggle');
        if (toggle) toggle.checked = !!data.requireToken;
        window.easyTierConfigs = Array.isArray(data.easyTierConfigs) ? data.easyTierConfigs : [];
        api.renderEasyTierConfigs();
      }
    } catch (error) {
      console.error(error);
    }
  };

  api.renderEasyTierConfigs = function renderEasyTierConfigs() {
    const body = document.getElementById('easyTierConfigsTableBody');
    if (!body) return;
    body.innerHTML = '';
    if (!window.easyTierConfigs.length) {
      body.innerHTML = '<tr><td colspan="5" style="text-align:center; color:var(--text-muted);">' + translations[currentLang]['easytier-config-empty'] + '</td></tr>';
      return;
    }
    window.easyTierConfigs.forEach((config) => {
      const tr = document.createElement('tr');
      tr.innerHTML = '<td style="font-weight: 600; color: #ffffff;">' + (config.name || '') + '</td>' +
        '<td style="font-family: monospace; font-size: 0.85rem; word-break: break-all;">' + (config.wssUrl || '') + '</td>' +
        '<td>' + (config.roomId || 'default') + '</td>' +
        '<td style="font-family: monospace; font-size: 0.85rem; word-break: break-all;">' + (config.clientToken || '—') + '</td>' +
        '<td style="color: var(--text-secondary);">' + new Date(config.createdAt || Date.now()).toLocaleString() + '</td>';
      body.appendChild(tr);
    });
  };

  api.openEasyTierConfigModal = function openEasyTierConfigModal() {
    const modal = document.getElementById('easyTierConfigModal');
    if (modal) modal.style.display = 'flex';
  };

  api.closeEasyTierConfigModal = function closeEasyTierConfigModal() {
    const modal = document.getElementById('easyTierConfigModal');
    if (modal) modal.style.display = 'none';
    ['easyTierConfigNameInput','easyTierConfigWssInput','easyTierConfigRoomInput','easyTierConfigTokenInput','easyTierConfigNotesInput'].forEach((id) => {
      const element = document.getElementById(id);
      if (element) element.value = '';
    });
  };

  api.handleCreateEasyTierConfig = async function handleCreateEasyTierConfig(event) {
    event.preventDefault();
    const easyTierConfig = {
      name: document.getElementById('easyTierConfigNameInput').value.trim(),
      wssUrl: document.getElementById('easyTierConfigWssInput').value.trim(),
      roomId: document.getElementById('easyTierConfigRoomInput').value.trim(),
      clientToken: document.getElementById('easyTierConfigTokenInput').value.trim(),
      notes: document.getElementById('easyTierConfigNotesInput').value.trim()
    };
    try {
      const res = await fetch('/api/config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token,
          'X-Admin-Token': token
        },
        body: JSON.stringify({ easyTierConfig })
      });
      if (res.ok) {
        alert(translations[currentLang]['msg-config-added']);
        api.closeEasyTierConfigModal();
        api.loadSettings();
      } else {
        const errorData = await res.json().catch(() => ({}));
        alert(errorData.error || 'Failed to add EasyTier config');
      }
    } catch (error) {
      console.error(error);
    }
  };

  api.handleToggleRequireToken = async function handleToggleRequireToken(checked) {
    try {
      await fetch('/api/config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({ requireToken: checked })
      });
    } catch (error) {
      console.error(error);
    }
  };

  api.handleChangePassword = async function handleChangePassword(event) {
    event.preventDefault();
    const newPassword = document.getElementById('newPassInput').value;
    try {
      const res = await fetch('/api/config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({ adminPassword: newPassword })
      });
      if (res.ok) {
        alert(translations[currentLang]['msg-changed-pass']);
        const newPassInput = document.getElementById('newPassInput');
        if (newPassInput) newPassInput.value = '';
        const data = await res.json();
        if (data.token) {
          token = data.token;
          localStorage.setItem('easytier_admin_token', token);
        }
        const defaultPasswordAlert = document.getElementById('defaultPasswordAlert');
        if (defaultPasswordAlert) defaultPasswordAlert.style.display = 'none';
      }
    } catch (error) {
      console.error(error);
    }
  };
})();
`;
