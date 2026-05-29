export function renderAdminPage(appName = "EasyTier WSS CF") {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover, maximum-scale=1.0, user-scalable=no" />
  <title>${appName}</title>
  <style>
    :root {
      color-scheme: light;
      --bg: #f5f7fb;
      --surface: rgba(255,255,255,.86);
      --surface-strong: rgba(255,255,255,.98);
      --line: rgba(15,23,42,.08);
      --text: #0f172a;
      --muted: #64748b;
      --blue: #2563eb;
      --blue-soft: #eaf2ff;
      --green: #0f9d58;
      --red: #b91c1c;
      --shadow: 0 22px 60px rgba(15,23,42,.08);
      --radius-xl: 28px;
      --radius-lg: 20px;
      --radius-md: 14px;
      --sidebar: 240px;
    }
    * { box-sizing: border-box; }
    html, body { height: 100%; }
    body {
      margin: 0;
      background:
        radial-gradient(circle at top left, rgba(37,99,235,.08), transparent 25%),
        radial-gradient(circle at 85% 5%, rgba(109,125,255,.12), transparent 24%),
        var(--bg);
      color: var(--text);
      font: 14px/1.5 -apple-system,BlinkMacSystemFont,"SF Pro Text","PingFang SC","Hiragino Sans GB","Microsoft YaHei",sans-serif;
      -webkit-font-smoothing: antialiased;
      text-rendering: optimizeLegibility;
    }
    a { color: inherit; text-decoration: none; }
    button, input, textarea, select { font: inherit; }
    .shell { min-height: 100%; display: flex; flex-direction: column; }
    .topbar {
      position: sticky; top: 0; z-index: 50;
      backdrop-filter: blur(20px);
      background: rgba(245,247,251,.78);
      border-bottom: 1px solid rgba(15,23,42,.06);
      padding: env(safe-area-inset-top, 0) 20px 0;
    }
    .topbar-inner {
      max-width: 1440px;
      margin: 0 auto;
      min-height: 72px;
      display: flex;
      align-items: center;
      gap: 14px;
      justify-content: space-between;
    }
    .brand {
      display: flex;
      align-items: center;
      gap: 12px;
      min-width: 0;
    }
    .logo {
      width: 40px; height: 40px; border-radius: 14px;
      display: grid; place-items: center;
      color: white; font-weight: 800;
      background: linear-gradient(145deg, #3b82f6, #8b5cf6);
      box-shadow: inset 0 1px 0 rgba(255,255,255,.65), 0 14px 28px rgba(37,99,235,.18);
      flex: none;
    }
    .brand-text { min-width: 0; }
    .brand-title { font-weight: 750; letter-spacing: -.03em; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .brand-sub { color: var(--muted); font-size: 12px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .toolbar {
      display: flex;
      align-items: center;
      gap: 10px;
      flex-wrap: wrap;
      justify-content: flex-end;
    }
    .select-shell {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 8px 12px;
      border-radius: 999px;
      border: 1px solid var(--line);
      background: rgba(255,255,255,.82);
      box-shadow: 0 10px 30px rgba(15,23,42,.05);
    }
    .select-shell select {
      border: 0; outline: none; background: transparent; color: var(--text);
      min-width: 120px;
    }
    .button {
      border: 0;
      border-radius: 999px;
      padding: 10px 14px;
      cursor: pointer;
      transition: transform .18s ease, opacity .18s ease, background .18s ease;
      display: inline-flex;
      align-items: center;
      gap: 8px;
    }
    .button:hover { transform: translateY(-1px); }
    .button.primary { background: linear-gradient(145deg, var(--blue), #1d4ed8); color: white; box-shadow: 0 16px 34px rgba(37,99,235,.22); }
    .button.secondary { background: var(--blue-soft); color: #1d4ed8; }
    .button.danger { background: #fef2f2; color: var(--red); }
    .button.ghost { background: rgba(255,255,255,.82); color: var(--text); border: 1px solid var(--line); }
    .locked .protected { display: none; }
    .layout {
      max-width: 1440px;
      width: 100%;
      margin: 0 auto;
      padding: 18px 20px 28px;
      display: grid;
      grid-template-columns: var(--sidebar) minmax(0, 1fr);
      gap: 18px;
      flex: 1;
      min-height: 0;
    }
    .sidebar {
      position: sticky;
      top: 92px;
      align-self: start;
      background: rgba(255,255,255,.58);
      border: 1px solid var(--line);
      border-radius: var(--radius-xl);
      box-shadow: var(--shadow);
      overflow: hidden;
    }
    .sidebar-head { padding: 18px 18px 10px; }
    .sidebar-title { margin: 0; font-size: 18px; letter-spacing: -.04em; }
    .sidebar-sub { margin-top: 6px; color: var(--muted); font-size: 13px; }
    .nav {
      display: grid;
      gap: 6px;
      padding: 0 12px 12px;
    }
    .nav button {
      width: 100%;
      justify-content: flex-start;
      text-align: left;
      border-radius: 14px;
      padding: 12px 12px;
      border: 1px solid transparent;
      background: transparent;
      color: var(--text);
    }
    .nav button[aria-selected="true"] {
      background: rgba(37,99,235,.09);
      border-color: rgba(37,99,235,.12);
      color: #1d4ed8;
    }
    .nav small { display: block; color: var(--muted); margin-top: 2px; }
    .content { min-width: 0; }
    .login-only {
      max-width: 780px;
      margin: 20px auto 0;
      padding: 0 20px;
    }
    .hero {
      background: linear-gradient(160deg, rgba(255,255,255,.92), rgba(255,255,255,.75));
      border: 1px solid var(--line);
      border-radius: var(--radius-xl);
      box-shadow: var(--shadow);
      padding: 18px;
      display: flex;
      justify-content: space-between;
      gap: 16px;
      align-items: start;
      margin-bottom: 16px;
    }
    .hero h1 { margin: 0; font-size: 28px; letter-spacing: -.05em; line-height: 1.05; }
    .hero p { margin: 8px 0 0; color: var(--muted); max-width: 72ch; }
    .hero-actions { display: flex; gap: 10px; flex-wrap: wrap; justify-content: flex-end; }
    .stats {
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: 12px;
      margin-bottom: 16px;
    }
    .stat {
      background: rgba(255,255,255,.82);
      border: 1px solid var(--line);
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow);
      padding: 16px;
    }
    .stat strong { display: block; font-size: 28px; letter-spacing: -.05em; line-height: 1; margin-bottom: 6px; }
    .stat span { color: var(--muted); font-size: 13px; }
    .panel {
      background: rgba(255,255,255,.82);
      border: 1px solid var(--line);
      border-radius: var(--radius-xl);
      box-shadow: var(--shadow);
      padding: 16px;
      margin-bottom: 16px;
    }
    .panel-head {
      display: flex;
      justify-content: space-between;
      gap: 12px;
      align-items: center;
      margin-bottom: 14px;
      flex-wrap: wrap;
    }
    .panel-title { margin: 0; font-size: 18px; letter-spacing: -.04em; }
    .panel-sub { color: var(--muted); margin-top: 4px; font-size: 13px; }
    .grid { display: grid; gap: 12px; }
    .grid.two { grid-template-columns: repeat(2, minmax(0,1fr)); }
    .grid.three { grid-template-columns: repeat(3, minmax(0,1fr)); }
    .grid.four { grid-template-columns: repeat(4, minmax(0,1fr)); }
    .card {
      background: rgba(255,255,255,.84);
      border: 1px solid rgba(15,23,42,.08);
      border-radius: var(--radius-lg);
      padding: 14px;
    }
    label { display: block; margin-bottom: 6px; color: var(--muted); font-size: 13px; }
    input, textarea, select {
      width: 100%;
      border: 1px solid rgba(15,23,42,.12);
      border-radius: 12px;
      padding: 11px 12px;
      background: rgba(255,255,255,.98);
      color: var(--text);
      outline: none;
    }
    textarea { min-height: 88px; resize: vertical; }
    input:focus, textarea:focus, select:focus {
      border-color: rgba(37,99,235,.45);
      box-shadow: 0 0 0 4px rgba(37,99,235,.10);
    }
    .muted { color: var(--muted); }
    .hidden { display: none !important; }
    .badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 6px 10px;
      border-radius: 999px;
      background: #eef2ff;
      color: #4338ca;
      font-size: 12px;
      border: 1px solid rgba(67,56,202,.12);
    }
    .badge.good { background: #ecfdf5; color: #15803d; border-color: rgba(21,128,61,.12); }
    .badge.bad { background: #fef2f2; color: #b91c1c; border-color: rgba(185,28,28,.12); }
    .list { display: grid; gap: 10px; }
    .list-item {
      background: rgba(255,255,255,.82);
      border: 1px solid rgba(15,23,42,.08);
      border-radius: 16px;
      padding: 14px;
    }
    .list-top {
      display: flex;
      justify-content: space-between;
      gap: 10px;
      align-items: start;
      flex-wrap: wrap;
    }
    .row { display: flex; gap: 10px; flex-wrap: wrap; }
    .actions { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 12px; }
    pre {
      margin: 0;
      white-space: pre-wrap;
      word-break: break-word;
      background: #0f172a;
      color: #e2e8f0;
      padding: 12px;
      border-radius: 14px;
    }
    .notice {
      margin-bottom: 16px;
      padding: 12px 14px;
      border-radius: 14px;
      background: #eff6ff;
      color: #1d4ed8;
      border: 1px solid #dbeafe;
    }
    .notice.error { background: #fef2f2; color: #b91c1c; border-color: #fecaca; }
    .topline {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
      align-items: center;
    }
    .keybox {
      display: grid;
      gap: 10px;
    }
    .keybox textarea { min-height: 72px; }
    .events { display: grid; gap: 10px; }
    .event {
      display: grid;
      gap: 6px;
      background: rgba(255,255,255,.84);
      border: 1px solid rgba(15,23,42,.08);
      border-radius: 16px;
      padding: 12px 14px;
    }
    .event-head { display:flex; justify-content:space-between; gap:8px; flex-wrap:wrap; }
    .tabs-mobile {
      display: none;
      overflow-x: auto;
      gap: 8px;
      padding: 0 20px 14px;
      background: rgba(245,247,251,.78);
      border-bottom: 1px solid rgba(15,23,42,.06);
      position: sticky;
      top: 72px;
      z-index: 40;
      backdrop-filter: blur(20px);
    }
    .tabs-mobile button {
      white-space: nowrap;
      border-radius: 999px;
      background: rgba(255,255,255,.82);
      border: 1px solid var(--line);
      padding: 10px 14px;
    }
    .tabs-mobile button[aria-selected="true"] {
      background: rgba(37,99,235,.10);
      color: #1d4ed8;
      border-color: rgba(37,99,235,.16);
    }
    .section-anchor { scroll-margin-top: 120px; }
    .mono { font-family: "SFMono-Regular", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; }
    @media (max-width: 1180px) {
      .layout { grid-template-columns: 1fr; }
      .sidebar { position: static; }
      .nav { grid-template-columns: repeat(5, minmax(0, 1fr)); }
    }
    @media (max-width: 920px) {
      .hero { flex-direction: column; }
      .hero-actions { justify-content: flex-start; }
      .stats, .grid.two, .grid.three, .grid.four { grid-template-columns: 1fr 1fr; }
      .nav { grid-template-columns: 1fr 1fr; }
    }
    @media (max-width: 680px) {
      .topbar-inner { flex-direction: column; align-items: stretch; padding-bottom: 12px; }
      .toolbar { justify-content: space-between; }
      .layout { padding-top: 12px; }
      .sidebar { display: none; }
      .tabs-mobile { display: flex; }
      .stats, .grid.two, .grid.three, .grid.four { grid-template-columns: 1fr; }
      .panel, .hero, .stat, .list-item, .event { border-radius: 18px; }
    }
  </style>
</head>
<body class="locked">
  <div class="shell">
    <div class="topbar">
      <div class="topbar-inner">
        <div class="brand">
          <div class="logo">E</div>
          <div class="brand-text">
            <div class="brand-title">${appName}</div>
            <div id="topSubtitle" class="brand-sub">Standalone EasyTier WSS on Cloudflare Workers</div>
          </div>
        </div>
        <div class="toolbar">
          <div class="select-shell">
            <span id="languageLabel" class="muted">Language</span>
            <select id="localeSelect" aria-label="Language"></select>
          </div>
          <button id="refreshBtn" class="button ghost" type="button">Refresh</button>
          <button id="loginToggleBtn" class="button primary" type="button">Login</button>
          <button id="logoutBtn" class="button danger hidden" type="button">Logout</button>
        </div>
      </div>
    </div>

    <section id="loginPanel" class="hero login-only">
      <div>
        <h1 id="loginTitle">Log in to the dashboard</h1>
        <p id="loginDesc">Use the Cloudflare secret <span class="mono">ADMIN_PASSWORD</span> to unlock the management panel. After login, you can generate API keys for public data access.</p>
      </div>
      <div class="hero-actions">
        <button id="loginBtn" class="button primary" type="button">Login</button>
      </div>
    </section>

    <div id="protectedContent" class="protected hidden">
      <div id="tabsMobile" class="tabs-mobile">
        <button data-target="#overviewSection">Overview</button>
        <button data-target="#routesSection">Routes</button>
        <button data-target="#apiKeysSection">API Keys</button>
        <button data-target="#publicApiSection">Public API</button>
        <button data-target="#eventsSection">Events</button>
      </div>

      <div class="layout">
        <aside class="sidebar">
          <div class="sidebar-head">
            <h2 id="sidebarTitle" class="sidebar-title">Control Center</h2>
            <div id="sidebarSub" class="sidebar-sub">Manage routes and access keys</div>
          </div>
          <div class="nav" id="sidebarNav">
            <button data-target="#overviewSection" aria-selected="true"><span id="navOverview">Overview</span><small id="navOverviewSub">Stats and status</small></button>
            <button data-target="#routesSection" aria-selected="false"><span id="navRoutes">Routes</span><small id="navRoutesSub">Create and edit routes</small></button>
            <button data-target="#apiKeysSection" aria-selected="false"><span id="navApiKeys">API Keys</span><small id="navApiKeysSub">Generate and revoke keys</small></button>
            <button data-target="#publicApiSection" aria-selected="false"><span id="navPublicApi">Public API</span><small id="navPublicApiSub">Verify key to read data</small></button>
            <button data-target="#eventsSection" aria-selected="false"><span id="navEvents">Events</span><small id="navEventsSub">Recent activity</small></button>
          </div>
        </aside>

        <main class="content">
          <div id="notice" class="notice hidden"></div>

          <section id="overviewSection" class="section-anchor">
          <div class="stats">
            <div class="stat"><strong id="activeConnections">0</strong><span id="activeConnectionsLabel">Active connections</span></div>
            <div class="stat"><strong id="totalConnections">0</strong><span id="totalConnectionsLabel">Total connections</span></div>
            <div class="stat"><strong id="routeCount">0</strong><span id="routeCountLabel">Routes</span></div>
            <div class="stat"><strong id="apiKeyCount">0</strong><span id="apiKeyCountLabel">API keys</span></div>
          </div>

          <div class="panel">
            <div class="panel-head">
              <div>
                <h2 class="panel-title" id="overviewTitle">Overview</h2>
                <div class="panel-sub" id="overviewSub">Built for a mobile-friendly experience with a clean, app-like layout.</div>
              </div>
              <div class="topline">
                <span class="badge" id="panelBadge">EasyTier WSS CF</span>
                <span class="badge good" id="panelBadge2">Workers Ready</span>
              </div>
            </div>
            <div class="grid two">
              <div class="card">
                <div class="muted" id="overviewApiHint">Public API is protected by a generated key.</div>
                <pre id="overviewApiExample" class="mono">X-API-Key: your-generated-key</pre>
              </div>
              <div class="card">
                <div class="muted" id="overviewUrlHint">Public data endpoint</div>
                <pre id="overviewApiUrl" class="mono">/api/public/state</pre>
              </div>
            </div>
          </div>
          </section>

          <section id="routesSection" class="section-anchor">
          <div class="panel">
            <div class="panel-head">
              <div>
                <h2 class="panel-title" id="routesTitle">Routes</h2>
                <div class="panel-sub" id="routesSub">Create routes for EasyTier WSS and manage them from the panel.</div>
              </div>
            </div>
            <form id="routeForm" class="grid two">
              <input id="routeId" type="hidden" />
              <div>
                <label id="routeNameLabel" for="routeName">Name</label>
                <input id="routeName" placeholder="Tokyo relay" />
              </div>
              <div>
                <label id="routeEnabledLabel" for="routeEnabled">Status</label>
                <select id="routeEnabled"><option value="true">Enabled</option><option value="false">Disabled</option></select>
              </div>
              <div>
                <label id="networkNameLabel" for="networkName">network-name</label>
                <input id="networkName" placeholder="my-network" />
              </div>
              <div>
                <label id="networkSecretLabel" for="networkSecret">network-secret</label>
                <input id="networkSecret" placeholder="super-secret" />
              </div>
              <div>
                <label id="clientTokenLabel" for="clientToken">client token</label>
                <input id="clientToken" placeholder="auto generated" />
              </div>
              <div>
                <label id="notesLabel" for="routeNotes">Notes</label>
                <input id="routeNotes" placeholder="Optional notes" />
              </div>
              <div class="row" style="grid-column:1 / -1;">
                <button class="button primary" id="saveRouteBtn" type="submit">Save route</button>
                <button class="button secondary" id="generateTokenBtn" type="button">Generate token</button>
                <button class="button ghost" id="cancelEditBtn" type="button">Cancel</button>
              </div>
            </form>
          </div>
          <div id="routesList" class="list" style="margin-top:14px;"></div>
          </section>

          <section id="apiKeysSection" class="section-anchor">
          <div class="panel">
            <div class="panel-head">
              <div>
                <h2 class="panel-title" id="apiKeysTitle">API Keys</h2>
                <div class="panel-sub" id="apiKeysSub">Generate a key in the backend, then use it to access the public API.</div>
              </div>
            </div>
            <div class="grid two">
              <form id="apiKeyForm" class="card">
                <div>
                  <label id="apiKeyNameLabel" for="apiKeyName">Key name</label>
                  <input id="apiKeyName" placeholder="mobile app" />
                </div>
                <div style="margin-top:10px;">
                  <label id="apiKeyNotesLabel" for="apiKeyNotes">Notes</label>
                  <textarea id="apiKeyNotes" placeholder="Optional notes"></textarea>
                </div>
                <div class="actions">
                  <button class="button primary" type="submit" id="createKeyBtn">Generate key</button>
                </div>
              </form>

              <div class="card keybox">
                <div class="muted" id="currentKeyLabel">Current key</div>
                <textarea id="currentApiKey" placeholder="Paste the generated key here"></textarea>
                <div class="row">
                  <button class="button secondary" id="saveCurrentKeyBtn" type="button">Save key</button>
                  <button class="button ghost" id="testKeyBtn" type="button">Verify key</button>
                  <button class="button ghost" id="copyKeyBtn" type="button">Copy key</button>
                </div>
                <pre id="apiKeyOutput" class="mono">Generated key will appear here.</pre>
              </div>
            </div>
            <div id="apiKeysList" class="list" style="margin-top:14px;"></div>
          </div>
          </section>

          <section id="publicApiSection" class="section-anchor">
          <div class="panel">
            <div class="panel-head">
              <div>
                <h2 class="panel-title" id="publicApiTitle">Public API</h2>
                <div class="panel-sub" id="publicApiSub">This endpoint only returns data after the API key is verified.</div>
              </div>
            </div>
            <div class="grid two">
              <div class="card">
                <div class="muted" id="publicApiUrlLabel">Endpoint</div>
                <pre id="publicApiUrl" class="mono">/api/public/state</pre>
                <div style="height:10px"></div>
                <div class="muted" id="publicApiHeaderLabel">Header</div>
                <pre id="publicApiHeader" class="mono">X-API-Key: your-generated-key</pre>
              </div>
              <div class="card">
                <div class="muted" id="publicApiResultLabel">Verification result</div>
                <pre id="publicApiResult" class="mono">Waiting for verification.</pre>
              </div>
            </div>
          </div>
          </section>

          <section id="eventsSection" class="section-anchor">
          <div class="panel">
            <div class="panel-head">
              <div>
                <h2 class="panel-title" id="eventsTitle">Recent events</h2>
                <div class="panel-sub" id="eventsSub">Open and close events from route connections.</div>
              </div>
            </div>
            <div id="eventsList" class="events"></div>
          </div>
          </section>
        </main>
      </div>
    </div>
  </div>

  <script>
    const TOKEN_KEY = "easytier-wss-cf-admin-token";
    const LOCALE_KEY = "easytier-wss-cf-admin-locale";
    const API_KEY_STORAGE = "easytier-wss-cf-public-api-key";
    const LOCALES = {
      en: {
        name: "English",
        topSubtitle: "Standalone EasyTier WSS on Cloudflare Workers",
        language: "Language",
        refresh: "Refresh",
        login: "Login",
        logout: "Logout",
        loginTitle: "Log in to the dashboard",
        loginDesc: "Use the Cloudflare secret ADMIN_PASSWORD to unlock the management panel. After login, you can generate API keys for public data access.",
        overview: "Overview",
        overviewSub: "Stats and status",
        routes: "Routes",
        routesSub: "Create and edit routes",
        apiKeys: "API Keys",
        apiKeysSub: "Generate and revoke keys",
        publicApi: "Public API",
        publicApiSub: "Verify key to read data",
        events: "Events",
        eventsSub: "Recent activity",
        activeConnections: "Active connections",
        totalConnections: "Total connections",
        routeCount: "Routes",
        apiKeyCount: "API keys",
        overviewTitle: "Overview",
        overviewSub2: "Built for a mobile-friendly experience with a clean, app-like layout.",
        overviewApiHint: "Public API is protected by a generated key.",
        overviewUrlHint: "Public data endpoint",
        routesTitle: "Routes",
        routesSub2: "Create routes for EasyTier WSS and manage them from the panel.",
        routeName: "Name",
        routeEnabled: "Status",
        networkName: "network-name",
        networkSecret: "network-secret",
        clientToken: "client token",
        notes: "Notes",
        saveRoute: "Save route",
        generateToken: "Generate token",
        cancel: "Cancel",
        enabled: "Enabled",
        disabled: "Disabled",
        edit: "Edit",
        delete: "Delete",
        copy: "Copy",
        copyEntry: "Copy entry",
        copyCommand: "Copy command",
        validate: "Validate",
        apiKeysTitle: "API Keys",
        apiKeysSub2: "Generate a key in the backend, then use it to access the public API.",
        keyName: "Key name",
        keyNotes: "Notes",
        createKey: "Generate key",
        currentKey: "Current key",
        saveKey: "Save key",
        testKey: "Verify key",
        copyKey: "Copy key",
        generatedKey: "Generated key will appear here.",
        publicApiTitle: "Public API",
        publicApiSub2: "This endpoint only returns data after the API key is verified.",
        endpoint: "Endpoint",
        header: "Header",
        verificationResult: "Verification result",
        eventsTitle: "Recent events",
        eventsSub2: "Open and close events from route connections.",
        noEvents: "No events yet.",
        noRoutes: "No routes yet.",
        noKeys: "No API keys yet.",
        loggedIn: "Logged in",
        loginFailed: "Login failed",
        saved: "Saved",
        saveFailed: "Save failed",
        copied: "Copied",
        copyFailed: "Copy failed",
        keyCreated: "API key created",
        keyRevoked: "API key revoked",
        keyInvalid: "Invalid API key",
        keyValid: "API key verified successfully",
        sessionExpired: "Session expired, please log in again",
        routeEnabledText: "Enabled",
        routeDisabledText: "Disabled",
        routeIdPrefix: "id: ",
        routeCreatedAt: "created: ",
        routeUpdatedAt: "updated: ",
        activeTotal: "active {active} / total {total}",
        confirmDeleteRoute: "Delete this route?",
        confirmRevokeKey: "Revoke this API key?",
        publicApiHint: "Paste a key and verify it before calling the public API."
      },
      "zh-Hans": {
        name: "简体中文",
        topSubtitle: "运行在 Cloudflare Workers 上的独立 EasyTier WSS",
        language: "语言",
        refresh: "刷新",
        login: "登录",
        logout: "退出",
        loginTitle: "登录管理后台",
        loginDesc: "使用 Cloudflare Secret 中的 ADMIN_PASSWORD 解锁面板。登录后可以生成对外 API key。",
        overview: "概览",
        overviewSub: "统计与状态",
        routes: "路由",
        routesSub: "创建和编辑路由",
        apiKeys: "API Key",
        apiKeysSub: "生成和撤销 key",
        publicApi: "对外 API",
        publicApiSub: "先验证 key 再读数据",
        events: "事件",
        eventsSub: "最近活动",
        activeConnections: "当前连接",
        totalConnections: "累计连接",
        routeCount: "路由数",
        apiKeyCount: "Key 数",
        overviewTitle: "概览",
        overviewSub2: "面向移动设备优化的简洁应用式布局。",
        overviewApiHint: "对外 API 受生成的 key 保护。",
        overviewUrlHint: "对外数据接口",
        routesTitle: "路由管理",
        routesSub2: "创建 EasyTier WSS 路由并在面板里管理。",
        routeName: "名称",
        routeEnabled: "状态",
        networkName: "network-name",
        networkSecret: "network-secret",
        clientToken: "client token",
        notes: "备注",
        saveRoute: "保存路由",
        generateToken: "生成 token",
        cancel: "取消",
        enabled: "启用",
        disabled: "禁用",
        edit: "编辑",
        delete: "删除",
        copy: "复制",
        copyEntry: "复制入口",
        copyCommand: "复制命令",
        validate: "验证",
        apiKeysTitle: "API Key",
        apiKeysSub2: "先在后台生成 key，再用它访问对外 API。",
        keyName: "Key 名称",
        keyNotes: "备注",
        createKey: "生成 key",
        currentKey: "当前 key",
        saveKey: "保存 key",
        testKey: "验证 key",
        copyKey: "复制 key",
        generatedKey: "生成后的 key 会显示在这里。",
        publicApiTitle: "对外 API",
        publicApiSub2: "只有在 API key 验证通过后才会返回数据。",
        endpoint: "接口",
        header: "请求头",
        verificationResult: "验证结果",
        eventsTitle: "最近事件",
        eventsSub2: "路由连接的打开与关闭事件。",
        noEvents: "暂无事件。",
        noRoutes: "暂无路由。",
        noKeys: "暂无 API key。",
        loggedIn: "登录成功",
        loginFailed: "登录失败",
        saved: "已保存",
        saveFailed: "保存失败",
        copied: "已复制",
        copyFailed: "复制失败",
        keyCreated: "API key 已生成",
        keyRevoked: "API key 已撤销",
        keyInvalid: "API key 无效",
        keyValid: "API key 验证成功",
        sessionExpired: "会话已过期，请重新登录",
        routeEnabledText: "已启用",
        routeDisabledText: "已禁用",
        routeIdPrefix: "id：",
        routeCreatedAt: "创建于：",
        routeUpdatedAt: "更新于：",
        activeTotal: "当前 {active} / 累计 {total}",
        confirmDeleteRoute: "确定删除这条路由吗？",
        confirmRevokeKey: "确定撤销这个 API key 吗？",
        publicApiHint: "先粘贴一个 key 并验证，再调用对外 API。"
      },
      "zh-Hant": {
        name: "繁體中文",
        topSubtitle: "執行於 Cloudflare Workers 的獨立 EasyTier WSS",
        language: "語言",
        refresh: "重新整理",
        login: "登入",
        logout: "登出",
        loginTitle: "登入管理後台",
        loginDesc: "使用 Cloudflare Secret 中的 ADMIN_PASSWORD 解鎖面板。登入後可以產生對外 API key。",
        overview: "總覽",
        overviewSub: "統計與狀態",
        routes: "路由",
        routesSub: "建立與編輯路由",
        apiKeys: "API Key",
        apiKeysSub: "產生與撤銷 key",
        publicApi: "對外 API",
        publicApiSub: "先驗證 key 再讀資料",
        events: "事件",
        eventsSub: "最近活動",
        activeConnections: "目前連線",
        totalConnections: "累計連線",
        routeCount: "路由數",
        apiKeyCount: "Key 數",
        overviewTitle: "總覽",
        overviewSub2: "面向行動裝置最佳化的簡潔應用式版面。",
        overviewApiHint: "對外 API 受產生的 key 保護。",
        overviewUrlHint: "對外資料端點",
        routesTitle: "路由管理",
        routesSub2: "建立 EasyTier WSS 路由並在面板裡管理。",
        routeName: "名稱",
        routeEnabled: "狀態",
        networkName: "network-name",
        networkSecret: "network-secret",
        clientToken: "client token",
        notes: "備註",
        saveRoute: "儲存路由",
        generateToken: "產生 token",
        cancel: "取消",
        enabled: "啟用",
        disabled: "停用",
        edit: "編輯",
        delete: "刪除",
        copy: "複製",
        copyEntry: "複製入口",
        copyCommand: "複製指令",
        validate: "驗證",
        apiKeysTitle: "API Key",
        apiKeysSub2: "先在後台產生 key，再用它存取對外 API。",
        keyName: "Key 名稱",
        keyNotes: "備註",
        createKey: "產生 key",
        currentKey: "目前 key",
        saveKey: "儲存 key",
        testKey: "驗證 key",
        copyKey: "複製 key",
        generatedKey: "產生後的 key 會顯示在這裡。",
        publicApiTitle: "對外 API",
        publicApiSub2: "只有在 API key 驗證通過後才會回傳資料。",
        endpoint: "介面",
        header: "請求標頭",
        verificationResult: "驗證結果",
        eventsTitle: "最近事件",
        eventsSub2: "路由連線的開啟與關閉事件。",
        noEvents: "暫無事件。",
        noRoutes: "暫無路由。",
        noKeys: "暫無 API key。",
        loggedIn: "登入成功",
        loginFailed: "登入失敗",
        saved: "已儲存",
        saveFailed: "儲存失敗",
        copied: "已複製",
        copyFailed: "複製失敗",
        keyCreated: "API key 已產生",
        keyRevoked: "API key 已撤銷",
        keyInvalid: "API key 無效",
        keyValid: "API key 驗證成功",
        sessionExpired: "工作階段已過期，請重新登入",
        routeEnabledText: "已啟用",
        routeDisabledText: "已停用",
        routeIdPrefix: "id：",
        routeCreatedAt: "建立於：",
        routeUpdatedAt: "更新於：",
        activeTotal: "目前 {active} / 累計 {total}",
        confirmDeleteRoute: "確定刪除這條路由嗎？",
        confirmRevokeKey: "確定撤銷這個 API key 嗎？",
        publicApiHint: "先貼上一個 key 並驗證，再呼叫對外 API。"
      },
      ja: {
        name: "日本語",
        topSubtitle: "Cloudflare Workers で動作する独立型 EasyTier WSS",
        language: "言語",
        refresh: "更新",
        login: "ログイン",
        logout: "ログアウト",
        loginTitle: "管理パネルにログイン",
        loginDesc: "Cloudflare Secret の ADMIN_PASSWORD でパネルを開きます。ログイン後、公開 API 用の key を生成できます。",
        overview: "概要",
        overviewSub: "統計と状態",
        routes: "ルート",
        routesSub: "ルートの作成と編集",
        apiKeys: "API Key",
        apiKeysSub: "key の生成と取り消し",
        publicApi: "公開 API",
        publicApiSub: "key を検証してからデータ取得",
        events: "イベント",
        eventsSub: "最近のアクティビティ",
        activeConnections: "現在の接続",
        totalConnections: "累計接続",
        routeCount: "ルート数",
        apiKeyCount: "Key 数",
        overviewTitle: "概要",
        overviewSub2: "モバイルでも使いやすい、すっきりしたアプリ風レイアウトです。",
        overviewApiHint: "公開 API は生成した key で保護されます。",
        overviewUrlHint: "公開データのエンドポイント",
        routesTitle: "ルート管理",
        routesSub2: "EasyTier WSS のルートを作成してパネルで管理できます。",
        routeName: "名前",
        routeEnabled: "状態",
        networkName: "network-name",
        networkSecret: "network-secret",
        clientToken: "client token",
        notes: "メモ",
        saveRoute: "ルートを保存",
        generateToken: "token を生成",
        cancel: "キャンセル",
        enabled: "有効",
        disabled: "無効",
        edit: "編集",
        delete: "削除",
        copy: "コピー",
        copyEntry: "エントリをコピー",
        copyCommand: "コマンドをコピー",
        validate: "検証",
        apiKeysTitle: "API Key",
        apiKeysSub2: "バックエンドで key を生成してから公開 API に使います。",
        keyName: "Key 名",
        keyNotes: "メモ",
        createKey: "key を生成",
        currentKey: "現在の key",
        saveKey: "key を保存",
        testKey: "key を検証",
        copyKey: "key をコピー",
        generatedKey: "生成された key はここに表示されます。",
        publicApiTitle: "公開 API",
        publicApiSub2: "API key が検証された後にのみデータを返します。",
        endpoint: "エンドポイント",
        header: "ヘッダー",
        verificationResult: "検証結果",
        eventsTitle: "最近のイベント",
        eventsSub2: "ルート接続の open / close イベントです。",
        noEvents: "イベントはまだありません。",
        noRoutes: "ルートはまだありません。",
        noKeys: "API key はまだありません。",
        loggedIn: "ログインしました",
        loginFailed: "ログインに失敗しました",
        saved: "保存しました",
        saveFailed: "保存に失敗しました",
        copied: "コピーしました",
        copyFailed: "コピーに失敗しました",
        keyCreated: "API key を生成しました",
        keyRevoked: "API key を取り消しました",
        keyInvalid: "API key が無効です",
        keyValid: "API key の検証に成功しました",
        sessionExpired: "セッションの期限が切れました。再度ログインしてください。",
        routeEnabledText: "有効",
        routeDisabledText: "無効",
        routeIdPrefix: "id: ",
        routeCreatedAt: "作成日時: ",
        routeUpdatedAt: "更新日時: ",
        activeTotal: "現在 {active} / 合計 {total}",
        confirmDeleteRoute: "このルートを削除しますか？",
        confirmRevokeKey: "この API key を取り消しますか？",
        publicApiHint: "key を貼り付けて検証してから公開 API を呼び出してください。"
      },
      ko: {
        name: "한국어",
        topSubtitle: "Cloudflare Workers에서 동작하는 독립형 EasyTier WSS",
        language: "언어",
        refresh: "새로고침",
        login: "로그인",
        logout: "로그아웃",
        loginTitle: "관리 패널 로그인",
        loginDesc: "Cloudflare Secret의 ADMIN_PASSWORD로 패널을 엽니다. 로그인 후 공개 API용 key를 생성할 수 있습니다.",
        overview: "개요",
        overviewSub: "통계와 상태",
        routes: "라우트",
        routesSub: "라우트 생성 및 편집",
        apiKeys: "API Key",
        apiKeysSub: "key 생성 및 폐기",
        publicApi: "공개 API",
        publicApiSub: "key 검증 후 데이터 조회",
        events: "이벤트",
        eventsSub: "최근 활동",
        activeConnections: "현재 연결",
        totalConnections: "누적 연결",
        routeCount: "라우트 수",
        apiKeyCount: "Key 수",
        overviewTitle: "개요",
        overviewSub2: "모바일에서도 쓰기 좋은 깔끔한 앱형 레이아웃입니다.",
        overviewApiHint: "공개 API는 생성한 key로 보호됩니다.",
        overviewUrlHint: "공개 데이터 엔드포인트",
        routesTitle: "라우트 관리",
        routesSub2: "EasyTier WSS 라우트를 만들고 패널에서 관리할 수 있습니다.",
        routeName: "이름",
        routeEnabled: "상태",
        networkName: "network-name",
        networkSecret: "network-secret",
        clientToken: "client token",
        notes: "메모",
        saveRoute: "라우트 저장",
        generateToken: "token 생성",
        cancel: "취소",
        enabled: "활성",
        disabled: "비활성",
        edit: "편집",
        delete: "삭제",
        copy: "복사",
        copyEntry: "엔트리 복사",
        copyCommand: "명령 복사",
        validate: "검증",
        apiKeysTitle: "API Key",
        apiKeysSub2: "백엔드에서 key를 생성한 뒤 공개 API에 사용하세요.",
        keyName: "Key 이름",
        keyNotes: "메모",
        createKey: "key 생성",
        currentKey: "현재 key",
        saveKey: "key 저장",
        testKey: "key 검증",
        copyKey: "key 복사",
        generatedKey: "생성된 key가 여기에 표시됩니다.",
        publicApiTitle: "공개 API",
        publicApiSub2: "API key가 검증된 후에만 데이터를 반환합니다.",
        endpoint: "엔드포인트",
        header: "헤더",
        verificationResult: "검증 결과",
        eventsTitle: "최근 이벤트",
        eventsSub2: "라우트 연결의 open / close 이벤트입니다.",
        noEvents: "이벤트가 아직 없습니다.",
        noRoutes: "라우트가 아직 없습니다.",
        noKeys: "API key가 아직 없습니다.",
        loggedIn: "로그인 완료",
        loginFailed: "로그인 실패",
        saved: "저장됨",
        saveFailed: "저장 실패",
        copied: "복사됨",
        copyFailed: "복사 실패",
        keyCreated: "API key 생성 완료",
        keyRevoked: "API key 폐기 완료",
        keyInvalid: "API key가 유효하지 않습니다",
        keyValid: "API key 검증 성공",
        sessionExpired: "세션이 만료되었습니다. 다시 로그인하세요.",
        routeEnabledText: "활성",
        routeDisabledText: "비활성",
        routeIdPrefix: "id: ",
        routeCreatedAt: "생성일: ",
        routeUpdatedAt: "수정일: ",
        activeTotal: "현재 {active} / 누적 {total}",
        confirmDeleteRoute: "이 라우트를 삭제할까요?",
        confirmRevokeKey: "이 API key를 폐기할까요?",
        publicApiHint: "key를 붙여넣고 검증한 뒤 공개 API를 호출하세요."
      }
    };

    const localeOrder = ["en", "zh-Hans", "zh-Hant", "ja", "ko"];
    const state = {
      token: localStorage.getItem(TOKEN_KEY) || "",
      locale: detectLocale(),
      data: null,
      apiKeys: [],
    };

    function detectLocale() {
      const saved = localStorage.getItem(LOCALE_KEY);
      if (saved && LOCALES[saved]) return saved;
      const language = (navigator.language || "en").toLowerCase();
      if (language.startsWith("zh-tw") || language.startsWith("zh-hk") || language.startsWith("zh-mo")) return "zh-Hant";
      if (language.startsWith("zh")) return "zh-Hans";
      if (language.startsWith("ja")) return "ja";
      if (language.startsWith("ko")) return "ko";
      return "en";
    }

    const el = (id) => document.getElementById(id);
    const notice = el("notice");
    const localeSelect = el("localeSelect");
    const topSubtitle = el("topSubtitle");
    const loginToggleBtn = el("loginToggleBtn");
    const logoutBtn = el("logoutBtn");
    const loginPanel = el("loginPanel");

    function t(key) {
      return LOCALES[state.locale][key] ?? LOCALES.en[key] ?? key;
    }

    function interpolate(template, values) {
      return template.replace(/\{(\w+)\}/g, (_, name) => String(values[name] ?? ""));
    }

    function showNotice(message, error = false) {
      notice.textContent = message;
      notice.className = error ? "notice error" : "notice";
      notice.classList.remove("hidden");
      clearTimeout(showNotice.timer);
      showNotice.timer = setTimeout(() => notice.classList.add("hidden"), 3200);
    }

    function authHeaders() {
      return state.token ? { Authorization: "Bearer " + state.token } : {};
    }

    async function api(path, options = {}) {
      const response = await fetch(path, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          ...authHeaders(),
          ...(options.headers || {}),
        },
      });
      if (!response.ok) {
        throw new Error(await response.text());
      }
      if (response.status === 204) return null;
      return await response.json();
    }

    function setAccessLocked(locked) {
      document.body.classList.toggle("locked", locked);
      loginPanel.classList.toggle("hidden", !locked);
      loginToggleBtn.classList.toggle("hidden", !locked);
      logoutBtn.classList.toggle("hidden", locked);
      el("protectedContent").classList.toggle("hidden", locked);
    }

    function setToken(token) {
      state.token = token || "";
      if (token) localStorage.setItem(TOKEN_KEY, token);
      else localStorage.removeItem(TOKEN_KEY);
    }

    function setLocale(locale) {
      if (!LOCALES[locale]) return;
      state.locale = locale;
      localStorage.setItem(LOCALE_KEY, locale);
      document.documentElement.lang = locale === "zh-Hans" ? "zh-CN" : locale === "zh-Hant" ? "zh-TW" : locale;
      renderStaticText();
      if (state.data) {
        renderState(state.data);
      }
    }

    function renderStaticText() {
      topSubtitle.textContent = t("topSubtitle");
      el("languageLabel").textContent = t("language");
      el("refreshBtn").textContent = t("refresh");
      loginToggleBtn.textContent = t("login");
      logoutBtn.textContent = t("logout");
      el("loginTitle").textContent = t("loginTitle");
      el("loginDesc").innerHTML = t("loginDesc");
      el("overviewTitle").textContent = t("overviewTitle");
      el("overviewSub2").textContent = t("overviewSub2");
      el("overviewApiHint").textContent = t("overviewApiHint");
      el("overviewUrlHint").textContent = t("overviewUrlHint");
      el("routesTitle").textContent = t("routesTitle");
      el("routesSub2").textContent = t("routesSub2");
      el("apiKeysTitle").textContent = t("apiKeysTitle");
      el("apiKeysSub2").textContent = t("apiKeysSub2");
      el("publicApiTitle").textContent = t("publicApiTitle");
      el("publicApiSub2").textContent = t("publicApiSub2");
      el("eventsTitle").textContent = t("eventsTitle");
      el("eventsSub2").textContent = t("eventsSub2");
      el("loginBtn").textContent = t("login");
      el("saveRouteBtn").textContent = t("saveRoute");
      el("generateTokenBtn").textContent = t("generateToken");
      el("cancelEditBtn").textContent = t("cancel");
      el("createKeyBtn").textContent = t("createKey");
      el("saveCurrentKeyBtn").textContent = t("saveKey");
      el("testKeyBtn").textContent = t("testKey");
      el("copyKeyBtn").textContent = t("copyKey");
      el("activeConnectionsLabel").textContent = t("activeConnections");
      el("totalConnectionsLabel").textContent = t("totalConnections");
      el("routeCountLabel").textContent = t("routeCount");
      el("apiKeyCountLabel").textContent = t("apiKeyCount");
      el("routeNameLabel").textContent = t("routeName");
      el("routeEnabledLabel").textContent = t("routeEnabled");
      el("networkNameLabel").textContent = t("networkName");
      el("networkSecretLabel").textContent = t("networkSecret");
      el("clientTokenLabel").textContent = t("clientToken");
      el("notesLabel").textContent = t("notes");
      el("apiKeyNameLabel").textContent = t("keyName");
      el("apiKeyNotesLabel").textContent = t("keyNotes");
      el("currentKeyLabel").textContent = t("currentKey");
      el("publicApiUrlLabel").textContent = t("endpoint");
      el("publicApiHeaderLabel").textContent = t("header");
      el("publicApiResultLabel").textContent = t("verificationResult");
      el("routeForm").querySelector("#routeEnabled").innerHTML = '<option value="true">' + t("enabled") + '</option><option value="false">' + t("disabled") + '</option>';
      el("sidebarTitle").textContent = t("overview");
      el("sidebarSub").textContent = t("routesSub2");
      el("navOverview").textContent = t("overview");
      el("navOverviewSub").textContent = t("overviewSub");
      el("navRoutes").textContent = t("routes");
      el("navRoutesSub").textContent = t("routesSub");
      el("navApiKeys").textContent = t("apiKeys");
      el("navApiKeysSub").textContent = t("apiKeysSub");
      el("navPublicApi").textContent = t("publicApi");
      el("navPublicApiSub").textContent = t("publicApiSub");
      el("navEvents").textContent = t("events");
      el("navEventsSub").textContent = t("eventsSub");

      localeSelect.replaceChildren(
        ...localeOrder.map((locale) => {
          const option = document.createElement("option");
          option.value = locale;
          option.textContent = LOCALES[locale].name;
          return option;
        }),
      );
      localeSelect.value = state.locale;
      el("overviewApiUrl").textContent = "/api/public/state";
      el("overviewApiExample").textContent = "X-API-Key: your-generated-key";
      el("publicApiUrl").textContent = "/api/public/state";
      el("publicApiHeader").textContent = "X-API-Key: your-generated-key";
      el("publicApiHint").textContent = t("publicApiHint");
      el("apiKeyOutput").textContent = t("generatedKey");
      el("apiKeyForm").querySelector("textarea").placeholder = "";
      el("currentApiKey").placeholder = "Paste the generated key here";
      el("routeNotes").placeholder = "Optional notes";
      el("apiKeyNotes").placeholder = "Optional notes";
      el("apiKeyName").placeholder = "mobile app";
    }

    function setActiveNav(target) {
      document.querySelectorAll(".nav button").forEach((button) => {
        button.setAttribute("aria-selected", String(button.dataset.target === target));
      });
    }

    function scrollToTarget(target) {
      const section = document.querySelector(target);
      if (section) section.scrollIntoView({ behavior: "smooth", block: "start" });
      setActiveNav(target);
    }

    function renderOverview(data) {
      el("activeConnections").textContent = data.summary.activeConnections ?? 0;
      el("totalConnections").textContent = data.summary.totalConnections ?? 0;
      el("routeCount").textContent = data.routes.length;
      el("apiKeyCount").textContent = data.summary.apiKeyCount ?? state.apiKeys.length ?? 0;
      const publicKey = localStorage.getItem(API_KEY_STORAGE) || "";
      if (publicKey) {
        el("currentApiKey").value = publicKey;
      }
    }

    function routeBadge(route) {
      const badge = document.createElement("span");
      badge.className = "badge " + (route.enabled ? "good" : "bad");
      badge.textContent = route.enabled ? t("routeEnabledText") : t("routeDisabledText");
      return badge;
    }

    function renderRoutes(routes) {
      const list = el("routesList");
      list.replaceChildren();
      if (!routes.length) {
        const empty = document.createElement("div");
        empty.className = "card muted";
        empty.textContent = t("noRoutes");
        list.appendChild(empty);
        return;
      }

      for (const route of routes) {
        const item = document.createElement("div");
        item.className = "list-item";
        const top = document.createElement("div");
        top.className = "list-top";

        const left = document.createElement("div");
        const title = document.createElement("div");
        title.style.fontWeight = "700";
        title.style.fontSize = "18px";
        title.textContent = route.name || route.id;
        const meta = document.createElement("div");
        meta.className = "muted";
        meta.textContent = t("routeIdPrefix") + route.id + " · " + t("routeCreatedAt") + route.createdAt;
        left.appendChild(title);
        left.appendChild(meta);

        const right = document.createElement("div");
        right.className = "row";
        right.appendChild(routeBadge(route));
        const active = document.createElement("span");
        active.className = "badge";
        active.textContent = interpolate(t("activeTotal"), {
          active: route.stats.activeConnections,
          total: route.stats.totalConnections,
        });
        right.appendChild(active);
        top.appendChild(left);
        top.appendChild(right);

        const body = document.createElement("div");
        body.style.marginTop = "12px";
        body.className = "grid two";
        const fields = [
          ["Public URL", route.publicWsUrl],
          ["EasyTier", route.easyTierCommand],
          [t("networkName"), route.networkName],
          [t("networkSecret"), route.networkSecret],
          [t("clientToken"), route.clientToken],
          [t("notes"), route.notes],
        ];
        for (const [label, value] of fields) {
          const box = document.createElement("div");
          const cap = document.createElement("div");
          cap.className = "muted";
          cap.style.marginBottom = "4px";
          cap.textContent = label;
          const pre = document.createElement("pre");
          pre.textContent = value || "";
          box.appendChild(cap);
          box.appendChild(pre);
          body.appendChild(box);
        }

        const actions = document.createElement("div");
        actions.className = "actions";
        actions.innerHTML = [
          '<button class="button secondary" type="button">' + t("copyEntry") + '</button>',
          '<button class="button secondary" type="button">' + t("copyCommand") + '</button>',
          '<button class="button secondary" type="button">' + t("validate") + '</button>',
          '<button class="button ghost" type="button">' + t("edit") + '</button>',
          '<button class="button danger" type="button">' + t("delete") + '</button>',
        ].join("");
        const [copyEntryBtn, copyCommandBtn, validateBtn, editBtn, deleteBtn] = actions.querySelectorAll("button");
        copyEntryBtn.onclick = () => copyText(route.publicWsUrl);
        copyCommandBtn.onclick = () => copyText(route.easyTierCommand);
        validateBtn.onclick = async () => {
          try {
            validateBtn.disabled = true;
            const response = await api("/api/routes/" + route.id + "/test", { method: "POST" });
            showNotice(response?.ok ? t("saved") : t("saveFailed"));
          } catch (error) {
            showNotice(error.message || t("saveFailed"), true);
          } finally {
            validateBtn.disabled = false;
          }
        };
        editBtn.onclick = () => fillRouteForm(route);
        deleteBtn.onclick = async () => {
          if (!confirm(t("confirmDeleteRoute"))) return;
          await api("/api/routes/" + route.id, { method: "DELETE" });
          await refresh();
        };

        item.appendChild(top);
        item.appendChild(body);
        item.appendChild(actions);
        list.appendChild(item);
      }
    }

    function renderApiKeys(keys) {
      state.apiKeys = keys;
      el("apiKeyCount").textContent = keys.length;
      const list = el("apiKeysList");
      list.replaceChildren();
      if (!keys.length) {
        const empty = document.createElement("div");
        empty.className = "card muted";
        empty.textContent = t("noKeys");
        list.appendChild(empty);
        return;
      }

      for (const key of keys) {
        const item = document.createElement("div");
        item.className = "list-item";
        const top = document.createElement("div");
        top.className = "list-top";
        const left = document.createElement("div");
        const title = document.createElement("div");
        title.style.fontWeight = "700";
        title.style.fontSize = "18px";
        title.textContent = key.name;
        const meta = document.createElement("div");
        meta.className = "muted";
        meta.textContent = key.id + " · " + t("routeCreatedAt") + key.createdAt + (key.lastUsedAt ? " · " + t("routeUpdatedAt") + key.lastUsedAt : "");
        left.appendChild(title);
        left.appendChild(meta);
        const right = document.createElement("div");
        right.className = "row";
        right.appendChild(key.enabled && !key.revokedAt ? routeBadge({ enabled: true }) : routeBadge({ enabled: false }));
        const copyHash = document.createElement("span");
        copyHash.className = "badge";
        copyHash.textContent = key.revokedAt ? key.revokedAt : key.notes || "";
        right.appendChild(copyHash);
        top.appendChild(left);
        top.appendChild(right);

        const actions = document.createElement("div");
        actions.className = "actions";
        actions.innerHTML = [
          '<button class="button danger" type="button">' + t("delete") + '</button>',
        ].join("");
        const [revokeBtn] = actions.querySelectorAll("button");
        revokeBtn.onclick = async () => {
          if (!confirm(t("confirmRevokeKey"))) return;
          await api("/api/admin/api-keys/" + key.id, { method: "DELETE" });
          showNotice(t("keyRevoked"));
          await refresh();
        };

        item.appendChild(top);
        item.appendChild(actions);
        list.appendChild(item);
      }
    }

    function renderEvents(events) {
      const list = el("eventsList");
      list.replaceChildren();
      if (!events.length) {
        const empty = document.createElement("div");
        empty.className = "card muted";
        empty.textContent = t("noEvents");
        list.appendChild(empty);
        return;
      }

      for (const event of events) {
        const item = document.createElement("div");
        item.className = "event";
        const head = document.createElement("div");
        head.className = "event-head";
        const title = document.createElement("strong");
        title.textContent = event.type.toUpperCase() + " · " + (event.routeName || event.routeId);
        const time = document.createElement("span");
        time.className = "muted";
        time.textContent = event.at;
        head.appendChild(title);
        head.appendChild(time);
        const meta = document.createElement("div");
        meta.className = "muted";
        meta.textContent = event.connectionId + (event.reason ? " · " + event.reason : "");
        item.appendChild(head);
        item.appendChild(meta);
        list.appendChild(item);
      }
    }

    function fillRouteForm(route) {
      el("routeId").value = route?.id || "";
      el("routeName").value = route?.name || "";
      el("routeEnabled").value = route?.enabled === false ? "false" : "true";
      el("networkName").value = route?.networkName || "";
      el("networkSecret").value = route?.networkSecret || "";
      el("clientToken").value = route?.clientToken || "";
      el("routeNotes").value = route?.notes || "";
    }

    function clearRouteForm() {
      fillRouteForm(null);
    }

    async function refresh() {
      if (!state.token) return;
      const data = await api("/api/admin/state");
      state.data = data;
      renderState(data);
      const apiKeys = await api("/api/admin/api-keys");
      renderApiKeys(apiKeys.apiKeys || []);
    }

    function renderState(data) {
      renderOverview(data);
      renderRoutes(data.routes || []);
      renderEvents(data.events || []);
      if (!data.events?.length) {
        el("eventsList").innerHTML = '<div class="card muted">' + t("noEvents") + '</div>';
      }
      if (!data.routes?.length) {
        el("routesList").innerHTML = '<div class="card muted">' + t("noRoutes") + '</div>';
      }
      el("publicApiResult").textContent = t("publicApiHint");
    }

    async function copyText(value) {
      try {
        await navigator.clipboard.writeText(value);
        showNotice(t("copied"));
      } catch {
        showNotice(t("copyFailed"), true);
      }
    }

    async function testPublicKey() {
      const key = el("currentApiKey").value.trim();
      if (!key) {
        showNotice(t("keyInvalid"), true);
        return;
      }
      try {
        const response = await fetch("/api/public/state", {
          headers: { "X-API-Key": key },
        });
        if (!response.ok) {
          throw new Error(await response.text());
        }
        const data = await response.json();
        el("publicApiResult").textContent = JSON.stringify({
          ok: true,
          routes: data.routes.length,
          activeConnections: data.summary.activeConnections,
          totalConnections: data.summary.totalConnections,
        }, null, 2);
        localStorage.setItem(API_KEY_STORAGE, key);
        showNotice(t("keyValid"));
      } catch (error) {
        el("publicApiResult").textContent = error.message || t("keyInvalid");
        showNotice(error.message || t("keyInvalid"), true);
      }
    }

    function updateCurrentKeyFromStorage() {
      const key = localStorage.getItem(API_KEY_STORAGE) || "";
      el("currentApiKey").value = key;
    }

    document.querySelectorAll("[data-target]").forEach((button) => {
      button.addEventListener("click", () => scrollToTarget(button.dataset.target));
    });

    el("loginBtn").addEventListener("click", async () => {
      const password = prompt("ADMIN_PASSWORD");
      if (!password) return;
      try {
        const data = await api("/api/login", {
          method: "POST",
          body: JSON.stringify({ password }),
        });
        setToken(data.token);
        await refresh();
        setAccessLocked(false);
        showNotice(t("loggedIn"));
      } catch (error) {
        showNotice(error.message || t("loginFailed"), true);
      }
    });

    el("loginToggleBtn").addEventListener("click", () => el("loginPanel").scrollIntoView({ behavior: "smooth" }));
    el("logoutBtn").addEventListener("click", () => {
      setToken("");
      state.data = null;
      setAccessLocked(true);
      showNotice(t("logout"));
    });

    el("refreshBtn").addEventListener("click", () => refresh().catch((error) => showNotice(error.message || t("saveFailed"), true)));
    el("routeForm").addEventListener("submit", async (event) => {
      event.preventDefault();
      try {
        const payload = {
          name: el("routeName").value,
          enabled: el("routeEnabled").value === "true",
          networkName: el("networkName").value,
          networkSecret: el("networkSecret").value,
          clientToken: el("clientToken").value,
          notes: el("routeNotes").value,
        };
        const routeId = el("routeId").value;
        if (routeId) {
          await api("/api/routes/" + routeId, { method: "PUT", body: JSON.stringify(payload) });
        } else {
          await api("/api/routes", { method: "POST", body: JSON.stringify(payload) });
        }
        clearRouteForm();
        showNotice(t("saved"));
        await refresh();
      } catch (error) {
        showNotice(error.message || t("saveFailed"), true);
      }
    });

    el("generateTokenBtn").addEventListener("click", () => {
      const bytes = new Uint8Array(24);
      crypto.getRandomValues(bytes);
      const token = btoa(String.fromCharCode(...bytes)).replaceAll("+", "-").replaceAll("/", "_").replaceAll("=", "");
      el("clientToken").value = token;
    });
    el("cancelEditBtn").addEventListener("click", () => clearRouteForm());

    el("apiKeyForm").addEventListener("submit", async (event) => {
      event.preventDefault();
      try {
        const payload = {
          name: el("apiKeyName").value || "Unnamed key",
          notes: el("apiKeyNotes").value,
        };
        const response = await api("/api/admin/api-keys", {
          method: "POST",
          body: JSON.stringify(payload),
        });
        const secret = response.key;
        el("currentApiKey").value = secret;
        el("apiKeyOutput").textContent = secret;
        localStorage.setItem(API_KEY_STORAGE, secret);
        showNotice(t("keyCreated"));
        await refresh();
      } catch (error) {
        showNotice(error.message || t("saveFailed"), true);
      }
    });

    el("saveCurrentKeyBtn").addEventListener("click", () => {
      localStorage.setItem(API_KEY_STORAGE, el("currentApiKey").value.trim());
      showNotice(t("saved"));
    });
    el("copyKeyBtn").addEventListener("click", () => copyText(el("currentApiKey").value.trim()));
    el("testKeyBtn").addEventListener("click", () => testPublicKey());

    localeSelect.addEventListener("change", () => setLocale(localeSelect.value));

    function boot() {
      renderStaticText();
      updateCurrentKeyFromStorage();
      setAccessLocked(true);
      if (state.token) {
        refresh()
          .then(() => setAccessLocked(false))
          .catch(() => {
            setToken("");
            setAccessLocked(true);
            showNotice(t("sessionExpired"), true);
          });
      }
    }

    boot();
  </script>
</body>
</html>`;
}
