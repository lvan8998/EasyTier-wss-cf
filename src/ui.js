export function renderAdminPage(appName = "EasyTier WSS CF") {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${appName}</title>
  <style>
    body { margin: 0; font-family: system-ui, sans-serif; background: #f6f8fb; color: #0f172a; }
    .wrap { max-width: 1100px; margin: 0 auto; padding: 24px; }
    .card { background: #fff; border: 1px solid #dbe3ee; border-radius: 16px; padding: 16px; margin-bottom: 16px; }
    header { display:flex; justify-content:space-between; gap: 12px; align-items:center; margin-bottom: 18px; }
    h1 { margin: 0; font-size: 28px; }
    .muted { color:#64748b; font-size: 14px; }
    .row { display:flex; gap:12px; flex-wrap:wrap; }
    .grid { display:grid; grid-template-columns: repeat(12, minmax(0, 1fr)); gap: 12px; }
    .span-6 { grid-column: span 6; }
    .span-12 { grid-column: span 12; }
    @media (max-width: 900px) { .span-6 { grid-column: span 12; } header { flex-direction: column; align-items:flex-start; } }
    input, textarea, select, button { font: inherit; }
    input, textarea, select { width:100%; border:1px solid #cfd8e3; border-radius: 12px; padding: 11px 12px; background:#fff; }
    textarea { min-height: 88px; }
    button { border:0; border-radius: 12px; padding: 10px 14px; cursor:pointer; }
    .primary { background:#2563eb; color:#fff; }
    .secondary { background:#eff6ff; color:#2563eb; }
    .danger { background:#fef2f2; color:#b91c1c; }
    .badge { display:inline-block; border-radius:999px; padding:6px 10px; font-size:12px; background:#eef2ff; color:#4338ca; margin-right: 8px; }
    .badge.good { background:#ecfdf5; color:#15803d; }
    .badge.bad { background:#fef2f2; color:#b91c1c; }
    .hidden { display:none !important; }
    pre { margin:0; white-space: pre-wrap; word-break: break-word; background:#0f172a; color:#e2e8f0; padding:12px; border-radius:12px; }
    .stat { min-width: 140px; background:#f8fbff; border:1px solid #dbeafe; border-radius: 14px; padding: 12px; }
    .stat strong { display:block; font-size:24px; }
    .routes { display:grid; gap: 12px; }
    .route { border:1px solid #dbe3ee; border-radius:16px; padding:16px; background:#fff; }
    .route-top { display:flex; justify-content:space-between; gap:12px; flex-wrap:wrap; }
    .fields { display:grid; gap:10px; margin-top: 12px; }
    .actions { display:flex; gap:10px; flex-wrap:wrap; margin-top: 12px; }
    .notice { padding: 12px 14px; border-radius: 12px; margin-bottom: 16px; background:#eff6ff; color:#1d4ed8; border:1px solid #dbeafe; }
    .notice.error { background:#fef2f2; color:#b91c1c; border-color:#fecaca; }
  </style>
</head>
<body>
  <div class="wrap">
    <header>
      <div>
        <h1>${appName}</h1>
        <div class="muted">Standalone EasyTier WSS on Cloudflare Workers</div>
      </div>
      <div class="row">
        <button id="reloadBtn" class="secondary">Refresh</button>
        <button id="logoutBtn" class="danger">Logout</button>
      </div>
    </header>

    <div id="banner" class="notice hidden"></div>

    <div id="loginCard" class="card">
      <h3>Login</h3>
      <p class="muted">Use <code>ADMIN_PASSWORD</code> to sign in. For compatibility, <code>ADMIN_SECRET</code> is also accepted.</p>
      <form id="loginForm" class="grid">
        <div class="span-6">
          <label>Password</label>
          <input id="password" type="password" placeholder="ADMIN_PASSWORD" />
        </div>
        <div class="span-6" style="display:flex; align-items:end;">
          <button class="primary" type="submit">Login</button>
        </div>
      </form>
    </div>

    <div id="dashboardCard" class="card hidden">
      <div class="row">
        <div class="stat"><strong id="activeConnections">0</strong><span class="muted">Active connections</span></div>
        <div class="stat"><strong id="totalConnections">0</strong><span class="muted">Total connections</span></div>
        <div class="stat"><strong id="routeCount">0</strong><span class="muted">Routes</span></div>
      </div>
    </div>

    <div id="editorCard" class="card hidden">
      <div class="row" style="justify-content:space-between;">
        <div>
          <h3 id="editorTitle" style="margin:0 0 4px 0;">New route</h3>
          <div class="muted">Public entry: <code>wss://&lt;your-domain&gt;/ws/&lt;route-id&gt;/&lt;client-token&gt;</code></div>
        </div>
        <button id="cancelEditBtn" class="secondary" type="button">Cancel</button>
      </div>
      <form id="routeForm" class="grid" style="margin-top: 16px;">
        <input id="routeId" type="hidden" />
        <div class="span-6"><label>Name</label><input id="routeName" placeholder="Tokyo relay" /></div>
        <div class="span-6"><label>network-name</label><input id="networkName" placeholder="my-network" /></div>
        <div class="span-6"><label>network-secret</label><input id="networkSecret" placeholder="super-secret" /></div>
        <div class="span-6"><label>client token</label><input id="clientToken" placeholder="auto generated" /></div>
        <div class="span-6"><label>Status</label><select id="routeEnabled"><option value="true">Enabled</option><option value="false">Disabled</option></select></div>
        <div class="span-12"><label>Notes</label><textarea id="routeNotes" placeholder="Optional notes"></textarea></div>
        <div class="span-12 row">
          <button class="primary" type="submit">Save</button>
          <button class="secondary" type="button" id="generateTokenBtn">Generate token</button>
        </div>
      </form>
    </div>

    <div id="routesCard" class="card hidden">
      <div class="row" style="justify-content:space-between;">
        <h3 style="margin:0;">Routes</h3>
      </div>
      <div id="routes" class="routes" style="margin-top: 14px;"></div>
    </div>
  </div>

  <script>
    const TOKEN_KEY = "easytier-wss-cf-admin-token";
    const state = { token: localStorage.getItem(TOKEN_KEY) || "", editingId: "" };
    const banner = document.getElementById("banner");
    const loginCard = document.getElementById("loginCard");
    const dashboardCard = document.getElementById("dashboardCard");
    const editorCard = document.getElementById("editorCard");
    const routesCard = document.getElementById("routesCard");
    const routes = document.getElementById("routes");
    const editorTitle = document.getElementById("editorTitle");

    function showBanner(message, error = false) {
      banner.textContent = message;
      banner.className = error ? "notice error" : "notice";
      banner.classList.remove("hidden");
      clearTimeout(showBanner.timer);
      showBanner.timer = setTimeout(() => banner.classList.add("hidden"), 3500);
    }

    function authHeaders() {
      return state.token ? { Authorization: "Bearer " + state.token } : {};
    }

    async function api(path, options = {}) {
      const response = await fetch(path, {
        headers: { "Content-Type": "application/json", ...authHeaders(), ...(options.headers || {}) },
        ...options,
      });
      if (!response.ok) {
        throw new Error(await response.text());
      }
      if (response.status === 204) return null;
      return await response.json();
    }

    function setToken(token) {
      state.token = token || "";
      if (token) localStorage.setItem(TOKEN_KEY, token);
      else localStorage.removeItem(TOKEN_KEY);
    }

    function setEditor(route) {
      state.editingId = route?.id || "";
      document.getElementById("routeId").value = route?.id || "";
      document.getElementById("routeName").value = route?.name || "";
      document.getElementById("networkName").value = route?.networkName || "";
      document.getElementById("networkSecret").value = route?.networkSecret || "";
      document.getElementById("clientToken").value = route?.clientToken || "";
      document.getElementById("routeEnabled").value = route?.enabled === false ? "false" : "true";
      document.getElementById("routeNotes").value = route?.notes || "";
      editorTitle.textContent = route?.id ? "Edit route" : "New route";
      editorCard.classList.remove("hidden");
    }

    function resetEditor() {
      setEditor(null);
      state.editingId = "";
      editorTitle.textContent = "New route";
    }

    function field(label, value) {
      const wrap = document.createElement("div");
      const caption = document.createElement("div");
      caption.className = "muted";
      caption.style.marginBottom = "4px";
      caption.textContent = label;
      const pre = document.createElement("pre");
      pre.textContent = value || "";
      wrap.appendChild(caption);
      wrap.appendChild(pre);
      return wrap;
    }

    function copy(value) {
      navigator.clipboard.writeText(value).then(() => showBanner("Copied")).catch(() => showBanner("Copy failed", true));
    }

    function renderRoute(route) {
      const box = document.createElement("div");
      box.className = "route";

      const top = document.createElement("div");
      top.className = "route-top";
      const topLeft = document.createElement("div");
      const name = document.createElement("div");
      name.style.fontSize = "18px";
      name.style.fontWeight = "700";
      name.textContent = route.name || route.id;
      const meta = document.createElement("div");
      meta.className = "muted";
      meta.textContent = "id: " + route.id + " · created: " + route.createdAt;
      topLeft.appendChild(name);
      topLeft.appendChild(meta);

      const topRight = document.createElement("div");
      const status = document.createElement("span");
      status.className = "badge " + (route.enabled ? "good" : "bad");
      status.textContent = route.enabled ? "Enabled" : "Disabled";
      const counts = document.createElement("span");
      counts.className = "badge";
      counts.textContent = "active " + route.stats.activeConnections + " / total " + route.stats.totalConnections;
      topRight.appendChild(status);
      topRight.appendChild(counts);
      top.appendChild(topLeft);
      top.appendChild(topRight);

      const fields = document.createElement("div");
      fields.className = "fields";
      fields.appendChild(field("Public entry", route.publicWsUrl));
      fields.appendChild(field("EasyTier command", route.easyTierCommand));
      fields.appendChild(field("network-name", route.networkName));
      fields.appendChild(field("network-secret", route.networkSecret));
      fields.appendChild(field("client token", route.clientToken));
      fields.appendChild(field("notes", route.notes));
      fields.appendChild(field("last error", route.stats.lastError || "-"));

      const actions = document.createElement("div");
      actions.className = "actions";
      actions.innerHTML = [
        '<button class="secondary" type="button">Copy entry</button>',
        '<button class="secondary" type="button">Copy command</button>',
        '<button class="secondary" type="button">Validate</button>',
        '<button class="primary" type="button">Edit</button>',
        '<button class="danger" type="button">Delete</button>',
      ].join("");
      const [copyEntryBtn, copyCmdBtn, validateBtn, editBtn, deleteBtn] = actions.querySelectorAll("button");
      copyEntryBtn.onclick = () => copy(route.publicWsUrl);
      copyCmdBtn.onclick = () => copy(route.easyTierCommand);
      validateBtn.onclick = async () => {
        validateBtn.disabled = true;
        try {
          await api("/api/routes/" + route.id + "/test", { method: "POST" });
          showBanner("Configuration looks good");
        } catch (error) {
          showBanner(error.message || "Validation failed", true);
        } finally {
          validateBtn.disabled = false;
        }
      };
      editBtn.onclick = () => setEditor(route);
      deleteBtn.onclick = async () => {
        if (!confirm("Delete this route?")) return;
        await api("/api/routes/" + route.id, { method: "DELETE" });
        await refresh();
      };

      box.appendChild(top);
      box.appendChild(fields);
      box.appendChild(actions);
      return box;
    }

    function render(data) {
      dashboardCard.classList.remove("hidden");
      editorCard.classList.remove("hidden");
      routesCard.classList.remove("hidden");
      loginCard.classList.add("hidden");
      document.getElementById("activeConnections").textContent = data.summary.activeConnections;
      document.getElementById("totalConnections").textContent = data.summary.totalConnections;
      document.getElementById("routeCount").textContent = data.routes.length;
      routes.replaceChildren(...data.routes.map(renderRoute));
    }

    async function refresh() {
      const data = await api("/api/state", { method: "GET" });
      render(data);
    }

    document.getElementById("loginForm").addEventListener("submit", async (event) => {
      event.preventDefault();
      try {
        const resp = await api("/api/login", {
          method: "POST",
          body: JSON.stringify({ password: document.getElementById("password").value }),
        });
        setToken(resp.token);
        document.getElementById("password").value = "";
        showBanner("Logged in");
        await refresh();
      } catch (error) {
        showBanner(error.message || "Login failed", true);
      }
    });

    document.getElementById("routeForm").addEventListener("submit", async (event) => {
      event.preventDefault();
      const payload = {
        name: document.getElementById("routeName").value,
        networkName: document.getElementById("networkName").value,
        networkSecret: document.getElementById("networkSecret").value,
        clientToken: document.getElementById("clientToken").value,
        enabled: document.getElementById("routeEnabled").value === "true",
        notes: document.getElementById("routeNotes").value,
      };
      try {
        if (state.editingId) {
          await api("/api/routes/" + state.editingId, { method: "PUT", body: JSON.stringify(payload) });
        } else {
          await api("/api/routes", { method: "POST", body: JSON.stringify(payload) });
        }
        resetEditor();
        showBanner("Saved");
        await refresh();
      } catch (error) {
        showBanner(error.message || "Save failed", true);
      }
    });

    document.getElementById("generateTokenBtn").addEventListener("click", () => {
      const bytes = new Uint8Array(24);
      crypto.getRandomValues(bytes);
      const token = btoa(String.fromCharCode(...bytes)).replaceAll("+", "-").replaceAll("/", "_").replaceAll("=", "");
      document.getElementById("clientToken").value = token;
    });

    document.getElementById("cancelEditBtn").addEventListener("click", () => resetEditor());
    document.getElementById("reloadBtn").addEventListener("click", () => refresh().catch((error) => showBanner(error.message || "Refresh failed", true)));
    document.getElementById("logoutBtn").addEventListener("click", () => {
      setToken("");
      loginCard.classList.remove("hidden");
      dashboardCard.classList.add("hidden");
      editorCard.classList.add("hidden");
      routesCard.classList.add("hidden");
      routes.replaceChildren();
      showBanner("Logged out");
    });

    if (state.token) {
      refresh().catch(() => {
        setToken("");
        loginCard.classList.remove("hidden");
        showBanner("Session expired, please log in again", true);
      });
    }
  </script>
</body>
</html>`;
}
