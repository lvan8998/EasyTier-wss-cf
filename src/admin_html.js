export const serveAdminDashboard = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>EasyTier Relay Dashboard</title>
    <!-- Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Outfit:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <!-- Lucide Icons -->
    <script src="https://unpkg.com/lucide@latest"></script>
    <style>
        :root {
            --bg-color: #080c14;
            --card-bg: rgba(17, 24, 39, 0.7);
            --sidebar-bg: rgba(15, 23, 42, 0.95);
            --border-color: rgba(255, 255, 255, 0.08);
            --text-primary: #f3f4f6;
            --text-secondary: #9ca3af;
            --text-muted: #6b7280;
            --primary: #6366f1;
            --primary-hover: #4f46e5;
            --secondary: #8b5cf6;
            --success: #10b981;
            --danger: #ef4444;
            --warning: #f59e0b;
            --font-outfit: 'Outfit', sans-serif;
            --font-inter: 'Inter', sans-serif;
        }

        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }

        body {
            font-family: var(--font-inter);
            background-color: var(--bg-color);
            color: var(--text-primary);
            overflow: hidden;
            height: 100vh;
            background-image: 
                radial-gradient(circle at 0% 0%, rgba(99, 102, 241, 0.12) 0%, transparent 45%),
                radial-gradient(circle at 100% 100%, rgba(139, 92, 246, 0.12) 0%, transparent 45%);
        }

        /* Utility classes */
        .flex { display: flex; }
        .flex-col { flex-direction: column; }
        .align-center { align-items: center; }
        .justify-between { justify-content: space-between; }
        .gap-2 { gap: 0.5rem; }
        .gap-4 { gap: 1rem; }

        /* Login Screen */
        #loginScreen {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            width: 100vw;
            position: absolute;
            top: 0;
            left: 0;
            z-index: 100;
            background-color: var(--bg-color);
        }

        .login-card {
            background: var(--card-bg);
            border: 1px solid var(--border-color);
            border-radius: 20px;
            padding: 3rem;
            width: 100%;
            max-width: 450px;
            backdrop-filter: blur(20px);
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
            text-align: center;
            animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }

        @keyframes slideUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }

        .login-logo {
            font-family: var(--font-outfit);
            font-size: 2rem;
            font-weight: 800;
            background: linear-gradient(135deg, #a78bfa, #6366f1);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            margin-bottom: 2rem;
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
        }

        .form-group {
            margin-bottom: 1.5rem;
            text-align: left;
        }

        .form-group label {
            display: block;
            font-size: 0.85rem;
            font-weight: 500;
            color: var(--text-secondary);
            margin-bottom: 0.5rem;
        }

        .form-control {
            width: 100%;
            background: rgba(0, 0, 0, 0.3);
            border: 1px solid var(--border-color);
            border-radius: 10px;
            padding: 0.75rem 1rem;
            color: var(--text-primary);
            font-family: var(--font-inter);
            font-size: 0.95rem;
            outline: none;
            transition: border-color 0.3s;
        }

        .form-control:focus {
            border-color: var(--primary);
        }

        .btn-submit {
            width: 100%;
            background: linear-gradient(135deg, var(--primary), var(--secondary));
            color: #ffffff;
            border: none;
            border-radius: 10px;
            padding: 0.75rem;
            font-family: var(--font-outfit);
            font-size: 1rem;
            font-weight: 600;
            cursor: pointer;
            box-shadow: 0 4px 15px rgba(99, 102, 241, 0.3);
            transition: all 0.3s;
        }

        .btn-submit:hover {
            transform: translateY(-1px);
            box-shadow: 0 6px 20px rgba(99, 102, 241, 0.45);
        }

        .login-error {
            color: var(--danger);
            font-size: 0.85rem;
            margin-top: 1rem;
            display: none;
        }

        /* App Layout */
        #appLayout {
            display: flex;
            height: 100vh;
            width: 100vw;
            opacity: 0;
            transition: opacity 0.5s ease;
        }

        /* Sidebar */
        aside {
            width: 260px;
            background: var(--sidebar-bg);
            border-right: 1px solid var(--border-color);
            padding: 2rem 1.5rem;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            flex-shrink: 0;
            z-index: 10;
        }

        .brand {
            font-family: var(--font-outfit);
            font-size: 1.35rem;
            font-weight: 700;
            color: var(--text-primary);
            display: flex;
            align-items: center;
            gap: 0.5rem;
            margin-bottom: 3rem;
        }

        .menu-list {
            list-style: none;
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
            flex-grow: 1;
        }

        .menu-item {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            padding: 0.75rem 1rem;
            color: var(--text-secondary);
            text-decoration: none;
            border-radius: 10px;
            font-weight: 500;
            font-size: 0.95rem;
            cursor: pointer;
            transition: all 0.2s ease;
        }

        .menu-item:hover, .menu-item.active {
            color: #ffffff;
            background: rgba(255, 255, 255, 0.05);
        }

        .menu-item.active {
            border-left: 3px solid var(--primary);
            background: rgba(99, 102, 241, 0.1);
        }

        .sidebar-footer {
            border-top: 1px solid var(--border-color);
            padding-top: 1.5rem;
            margin-top: auto;
        }

        .user-info {
            display: flex;
            align-items: center;
            justify-content: space-between;
            font-size: 0.85rem;
            color: var(--text-secondary);
        }

        .logout-btn {
            background: transparent;
            border: none;
            color: var(--text-muted);
            cursor: pointer;
            transition: color 0.2s;
        }

        .logout-btn:hover {
            color: var(--danger);
        }

        /* Main Content Container */
        main {
            flex-grow: 1;
            padding: 2.5rem;
            display: flex;
            flex-direction: column;
            overflow-y: auto;
            height: 100vh;
        }

        /* Top Header */
        .top-nav {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 2rem;
        }

        .page-title {
            font-family: var(--font-outfit);
            font-size: 1.75rem;
            font-weight: 700;
        }

        .refresh-indicator {
            font-size: 0.8rem;
            color: var(--text-muted);
            display: flex;
            align-items: center;
            gap: 0.5rem;
            background: rgba(255, 255, 255, 0.03);
            padding: 0.4rem 0.8rem;
            border-radius: 9999px;
            border: 1px solid var(--border-color);
        }

        .refresh-spinner {
            width: 12px;
            height: 12px;
            border: 2px solid var(--text-muted);
            border-top-color: transparent;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            display: none;
        }

        @keyframes spin {
            to { transform: rotate(360deg); }
        }

        /* Dashboard Overview Content */
        .tab-content {
            display: none;
            flex-direction: column;
            gap: 2rem;
            animation: fadeIn 0.4s ease;
        }

        .tab-content.active {
            display: flex;
        }

        /* Cards Grid */
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
            gap: 1.5rem;
        }

        .stat-card {
            background: var(--card-bg);
            border: 1px solid var(--border-color);
            border-radius: 16px;
            padding: 1.5rem;
            backdrop-filter: blur(15px);
            position: relative;
            overflow: hidden;
            display: flex;
            align-items: center;
            gap: 1.25rem;
        }

        .stat-icon {
            background: rgba(99, 102, 241, 0.1);
            color: var(--primary);
            width: 48px;
            height: 48px;
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .stat-data {
            display: flex;
            flex-direction: column;
        }

        .stat-label {
            font-size: 0.8rem;
            color: var(--text-secondary);
            font-weight: 500;
            text-transform: uppercase;
            letter-spacing: 0.05em;
        }

        .stat-val {
            font-family: var(--font-outfit);
            font-size: 1.6rem;
            font-weight: 700;
            margin-top: 0.25rem;
        }

        /* Topology Card */
        .topo-card {
            background: var(--card-bg);
            border: 1px solid var(--border-color);
            border-radius: 20px;
            padding: 1.5rem;
            min-height: 400px;
            display: flex;
            flex-direction: column;
            backdrop-filter: blur(15px);
        }

        .topo-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1.5rem;
        }

        .topo-title {
            font-family: var(--font-outfit);
            font-size: 1.15rem;
            font-weight: 600;
        }

        .topo-body {
            flex-grow: 1;
            background: rgba(0, 0, 0, 0.4);
            border: 1px solid rgba(255, 255, 255, 0.03);
            border-radius: 12px;
            position: relative;
            overflow: hidden;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 350px;
        }

        .topo-svg {
            width: 100%;
            height: 100%;
            min-height: 350px;
            position: absolute;
            top: 0;
            left: 0;
        }

        /* Tables & Lists */
        .table-card {
            background: var(--card-bg);
            border: 1px solid var(--border-color);
            border-radius: 20px;
            padding: 1.5rem;
            backdrop-filter: blur(15px);
        }

        .table-header-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1.5rem;
        }

        .table-title {
            font-family: var(--font-outfit);
            font-size: 1.2rem;
            font-weight: 700;
        }

        .table-container {
            width: 100%;
            overflow-x: auto;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            text-align: left;
        }

        th {
            padding: 1rem;
            color: var(--text-secondary);
            font-weight: 600;
            font-size: 0.85rem;
            border-bottom: 1px solid var(--border-color);
            text-transform: uppercase;
        }

        td {
            padding: 1rem;
            border-bottom: 1px solid rgba(255, 255, 255, 0.03);
            font-size: 0.9rem;
            vertical-align: middle;
        }

        tr:hover td {
            background: rgba(255, 255, 255, 0.01);
        }

        .badge-status {
            display: inline-flex;
            align-items: center;
            gap: 0.35rem;
            padding: 0.25rem 0.6rem;
            border-radius: 9999px;
            font-size: 0.75rem;
            font-weight: 600;
        }

        .badge-success { background: rgba(16, 185, 129, 0.15); color: var(--success); }
        .badge-danger { background: rgba(239, 68, 68, 0.15); color: var(--danger); }
        .badge-warning { background: rgba(245, 158, 11, 0.15); color: var(--warning); }

        .btn-action {
            background: rgba(255, 255, 255, 0.03);
            border: 1px solid var(--border-color);
            color: var(--text-primary);
            padding: 0.4rem 0.8rem;
            border-radius: 8px;
            cursor: pointer;
            font-size: 0.8rem;
            display: inline-flex;
            align-items: center;
            gap: 0.35rem;
            transition: all 0.2s;
        }

        .btn-action:hover {
            background: rgba(255, 255, 255, 0.08);
            border-color: var(--primary);
        }

        .btn-danger-action {
            background: rgba(239, 68, 68, 0.05);
            border-color: rgba(239, 68, 68, 0.2);
            color: #fca5a5;
        }

        .btn-danger-action:hover {
            background: rgba(239, 68, 68, 0.15);
            border-color: var(--danger);
            color: #ffffff;
        }

        .btn-create {
            background: linear-gradient(135deg, var(--primary), var(--secondary));
            border: none;
            color: #ffffff;
            padding: 0.6rem 1.25rem;
            border-radius: 10px;
            cursor: pointer;
            font-size: 0.9rem;
            font-weight: 600;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            box-shadow: 0 4px 15px rgba(99, 102, 241, 0.25);
            transition: all 0.2s;
        }

        .btn-create:hover {
            transform: translateY(-1px);
            box-shadow: 0 6px 20px rgba(99, 102, 241, 0.35);
        }

        /* Language switcher */
        .header-controls {
            display: flex;
            align-items: center;
            gap: 1rem;
        }

        .top-lang-wrapper {
            position: relative;
            background: rgba(255, 255, 255, 0.03);
            border: 1px solid var(--border-color);
            padding: 0.4rem 1.5rem 0.4rem 0.8rem;
            border-radius: 9999px;
            display: flex;
            align-items: center;
            gap: 0.35rem;
            cursor: pointer;
        }

        .top-lang-select {
            background: transparent;
            color: var(--text-primary);
            border: none;
            outline: none;
            font-size: 0.8rem;
            font-weight: 500;
            appearance: none;
            cursor: pointer;
        }

        .top-lang-arrow {
            position: absolute;
            right: 0.6rem;
            color: var(--text-muted);
            pointer-events: none;
            width: 12px;
            height: 12px;
        }

        /* Settings CSS */
        .settings-card {
            background: var(--card-bg);
            border: 1px solid var(--border-color);
            border-radius: 20px;
            padding: 2rem;
            backdrop-filter: blur(15px);
            max-width: 700px;
        }

        .settings-title {
            font-family: var(--font-outfit);
            font-size: 1.35rem;
            font-weight: 700;
            margin-bottom: 1.5rem;
            border-bottom: 1px solid var(--border-color);
            padding-bottom: 0.75rem;
        }

        .settings-group {
            margin-bottom: 2rem;
        }

        .switch-control {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1.5rem;
        }

        .switch-label h4 {
            font-size: 1rem;
            font-weight: 600;
            margin-bottom: 0.25rem;
        }

        .switch-label p {
            font-size: 0.85rem;
            color: var(--text-secondary);
        }

        /* Toggle switch */
        .switch {
            position: relative;
            display: inline-block;
            width: 52px;
            height: 28px;
        }

        .switch input {
            opacity: 0;
            width: 0;
            height: 0;
        }

        .slider {
            position: absolute;
            cursor: pointer;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: rgba(255, 255, 255, 0.1);
            transition: .4s;
            border-radius: 34px;
            border: 1px solid var(--border-color);
        }

        .slider:before {
            position: absolute;
            content: "";
            height: 20px;
            width: 20px;
            left: 3px;
            bottom: 3px;
            background-color: white;
            transition: .4s;
            border-radius: 50%;
        }

        input:checked + .slider {
            background-color: var(--primary);
        }

        input:checked + .slider:before {
            transform: translateX(24px);
        }

        /* Modal styling */
        .modal {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.7);
            z-index: 200;
            justify-content: center;
            align-items: center;
            backdrop-filter: blur(5px);
        }

        .modal-card {
            background: var(--sidebar-bg);
            border: 1px solid var(--border-color);
            border-radius: 20px;
            padding: 2.5rem;
            width: 100%;
            max-width: 500px;
            animation: slideUp 0.3s ease;
        }

        .modal-title {
            font-family: var(--font-outfit);
            font-size: 1.25rem;
            font-weight: 700;
            margin-bottom: 1.5rem;
        }

        .modal-actions {
            display: flex;
            justify-content: flex-end;
            gap: 1rem;
            margin-top: 2rem;
        }

        .btn-cancel {
            background: transparent;
            border: 1px solid var(--border-color);
            color: var(--text-secondary);
            padding: 0.6rem 1.25rem;
            border-radius: 10px;
            cursor: pointer;
            font-weight: 600;
        }

        .btn-cancel:hover {
            background: rgba(255, 255, 255, 0.03);
            color: #ffffff;
        }

        /* Custom Alert Banner */
        .alert-banner {
            background: rgba(245, 158, 11, 0.1);
            border: 1px solid rgba(245, 158, 11, 0.2);
            color: #fcd34d;
            padding: 1rem;
            border-radius: 12px;
            font-size: 0.9rem;
            display: flex;
            align-items: center;
            gap: 0.75rem;
            margin-bottom: 2rem;
        }
    </style>
</head>
<body>

    <!-- LOGIN SCREEN -->
    <div id="loginScreen">
        <div class="login-card">
            <div class="login-logo">
                <i data-lucide="network"></i>
                <span>EasyTier Admin</span>
            </div>
            <div class="login-copy" style="text-align: center; margin: 0.5rem 0 1.5rem;">
                <h1 id="loginTitle" data-i18n="login-title">Sign in to continue</h1>
                <p id="loginHint" data-i18n="login-hint">Use the admin password configured in Cloudflare Workers to unlock the dashboard.</p>
            </div>
            
            <div class="form-group" style="text-align: center; margin-bottom: 2rem;">
                <div class="top-lang-wrapper" style="display: inline-flex;" onclick="document.getElementById('loginLang').focus()">
                    <i data-lucide="languages" style="width: 14px; height: 14px;"></i>
                    <select id="loginLang" class="top-lang-select" onchange="switchLanguage(this.value)">
                        <option value="en">English</option>
                        <option value="zh-CN">简体中文</option>
                        <option value="zh-TW">繁體中文</option>
                        <option value="ja">日本語</option>
                        <option value="ko">한국어</option>
                    </select>
                    <i data-lucide="chevron-down" class="top-lang-arrow"></i>
                </div>
            </div>

            <form onsubmit="handleLogin(event)">
                <div class="form-group">
                    <label for="passwordInput" data-i18n="login-label">Admin Password</label>
                    <input type="password" id="passwordInput" class="form-control" data-i18n-placeholder="password-placeholder" placeholder="Enter admin password" required>
                </div>
                <button type="submit" class="btn-submit" data-i18n="login-btn">Sign In</button>
            </form>
            <p id="loginError" class="login-error" data-i18n="login-error">Incorrect password. Please try again.</p>
        </div>
    </div>

    <!-- APP LAYOUT -->
    <div id="appLayout">
        <!-- Sidebar -->
        <aside>
            <div class="flex-col">
                <div class="brand">
                    <i data-lucide="network" style="color: var(--primary);"></i>
                    <span>EasyTier Relay</span>
                </div>
                <ul class="menu-list">
                    <li class="menu-item active" onclick="switchTab('overview', this)">
                        <i data-lucide="layout-dashboard"></i>
                        <span data-i18n="menu-overview">Overview</span>
                    </li>
                    <li class="menu-item" onclick="switchTab('rooms', this)">
                        <i data-lucide="folder-tree"></i>
                        <span data-i18n="menu-rooms">Rooms & Peers</span>
                    </li>
                    <li class="menu-item" onclick="switchTab('tokens', this)">
                        <i data-lucide="key-round"></i>
                        <span data-i18n="menu-tokens">Client Tokens</span>
                    </li>
                    <li class="menu-item" onclick="switchTab('settings', this)">
                        <i data-lucide="settings"></i>
                        <span data-i18n="menu-settings">Settings</span>
                    </li>
                </ul>
            </div>
            <div class="sidebar-footer">
                <div class="user-info">
                    <span id="adminText" data-i18n="role-admin">Administrator</span>
                    <button class="logout-btn" onclick="handleLogout()" title="Logout">
                        <i data-lucide="log-out" style="width: 18px; height: 18px;"></i>
                    </button>
                </div>
            </div>
        </aside>

        <!-- Main Content -->
        <main>
            <div class="top-nav">
                <h2 id="pageTitle" class="page-title" data-i18n="menu-overview">Overview</h2>
                <div class="header-controls">
                    <div class="refresh-indicator">
                        <div id="refreshSpinner" class="refresh-spinner"></div>
                        <i data-lucide="clock" id="clockIcon" style="width: 14px; height: 14px;"></i>
                        <span id="refreshText">Auto-refresh in 5s</span>
                    </div>
                    <div class="top-lang-wrapper" onclick="document.getElementById('dashboardLang').focus()">
                        <i data-lucide="languages" style="width: 14px; height: 14px;"></i>
                        <select id="dashboardLang" class="top-lang-select" onchange="switchLanguage(this.value)">
                            <option value="en">English</option>
                            <option value="zh-CN">简体中文</option>
                            <option value="zh-TW">繁體中文</option>
                            <option value="ja">日本語</option>
                            <option value="ko">한국어</option>
                        </select>
                        <i data-lucide="chevron-down" class="top-lang-arrow"></i>
                    </div>
                </div>
            </div>



            <!-- TAB: OVERVIEW -->
            <div id="tabOverview" class="tab-content active">
                <div class="stats-grid">
                    <div class="stat-card">
                        <div class="stat-icon"><i data-lucide="activity"></i></div>
                        <div class="stat-data">
                            <span class="stat-label" data-i18n="stat-status">Status</span>
                            <span class="stat-val" style="color: var(--success);" data-i18n="stat-online">Online</span>
                        </div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon"><i data-lucide="folder"></i></div>
                        <div class="stat-data">
                            <span class="stat-label" data-i18n="stat-active-rooms">Active Rooms</span>
                            <span id="statActiveRooms" class="stat-val">0</span>
                        </div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon"><i data-lucide="users"></i></div>
                        <div class="stat-data">
                            <span class="stat-label" data-i18n="stat-connected-peers">Total Peers</span>
                            <span id="statConnectedPeers" class="stat-val">0</span>
                        </div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon"><i data-lucide="arrow-down-up"></i></div>
                        <div class="stat-data">
                            <span class="stat-label" data-i18n="stat-total-traffic">Traffic (Rx/Tx)</span>
                            <span id="statTotalTraffic" class="stat-val">0 B / 0 B</span>
                        </div>
                    </div>
                </div>

                <div class="topo-card">
                    <div class="topo-header">
                        <span class="topo-title" data-i18n="topo-map-title">Network Topology</span>
                        <div style="font-size: 0.8rem; color: var(--text-secondary);">
                            <span style="display:inline-block; width:10px; height:10px; border-radius:50%; background:var(--primary); margin-right:5px;"></span>Server
                            <span style="display:inline-block; width:10px; height:10px; border-radius:50%; background:var(--success); margin-left:15px; margin-right:5px;"></span>Active Peer
                        </div>
                    </div>
                    <div class="topo-body" id="topoBody">
                        <svg class="topo-svg" id="topoSvg"></svg>
                        <div id="topoEmptyText" style="color: var(--text-muted); font-size: 0.95rem;" data-i18n="topo-no-nodes">No nodes connected. WSS relay is empty.</div>
                    </div>
                </div>
            </div>

            <!-- TAB: ROOMS -->
            <div id="tabRooms" class="tab-content">
                <div class="table-card">
                    <div class="table-header-row">
                        <span class="table-title" data-i18n="rooms-list-title">Relay Rooms</span>
                    </div>
                    <div class="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th data-i18n="th-room-name">Room ID</th>
                                    <th data-i18n="th-peer-count">Active Peers</th>
                                    <th data-i18n="th-actions">Actions</th>
                                </tr>
                            </thead>
                            <tbody id="roomsTableBody">
                                <!-- Dynamic -->
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- Dynamic Room Peers Detail Box -->
                <div id="roomPeersCard" class="table-card" style="display: none;">
                    <div class="table-header-row">
                        <span id="roomPeersTitle" class="table-title">Room Peers</span>
                        <button class="btn-action" onclick="closeRoomPeers()"><i data-lucide="x"></i><span data-i18n="btn-close">Close</span></button>
                    </div>
                    <div class="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th data-i18n="th-peer-id">Peer ID</th>
                                    <th data-i18n="th-virtual-ip">Virtual IP</th>
                                    <th data-i18n="th-hostname">Hostname</th>
                                    <th data-i18n="th-version">Version</th>
                                    <th data-i18n="th-rx-tx">Rx / Tx Traffic</th>
                                    <th data-i18n="th-conn-time">Connected Time</th>
                                    <th data-i18n="th-actions">Actions</th>
                                </tr>
                            </thead>
                            <tbody id="peersTableBody">
                                <!-- Dynamic -->
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <!-- TAB: TOKENS -->
            <div id="tabTokens" class="tab-content">
                <div class="table-card">
                    <div class="table-header-row">
                        <span class="table-title" data-i18n="tokens-title">Client Connection Tokens</span>
                        <button class="btn-create" onclick="openCreateTokenModal()">
                            <i data-lucide="plus"></i>
                            <span data-i18n="btn-gen-token">Generate Token</span>
                        </button>
                    </div>
                    <div class="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th data-i18n="th-token">Token</th>
                                    <th data-i18n="th-desc">Description</th>
                                    <th data-i18n="th-created">Created At</th>
                                    <th data-i18n="th-actions">Actions</th>
                                </tr>
                            </thead>
                            <tbody id="tokensTableBody">
                                <!-- Dynamic -->
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <!-- TAB: SETTINGS -->
            <div id="tabSettings" class="tab-content">
                <div class="settings-card">
                    <div class="settings-title" data-i18n="settings-general">General Configuration</div>
                    <div class="settings-group">
                        <div class="switch-control">
                            <div class="switch-label">
                                <h4 data-i18n="set-req-token-title">Require Client Connection Token</h4>
                                <p data-i18n="set-req-token-desc">Reject EasyTier clients connection unless they present a valid token via query parameters.</p>
                            </div>
                            <label class="switch">
                                <input type="checkbox" id="requireTokenToggle" onchange="handleToggleRequireToken(this.checked)">
                                <span class="slider"></span>
                            </label>
                        </div>
                        <div class="table-header-row" style="margin-top: 1.25rem;">
                            <span class="table-title" data-i18n="easytier-configs-title">EasyTier Configurations</span>
                            <button class="btn-create" onclick="openEasyTierConfigModal()">
                                <i data-lucide="plus"></i>
                                <span data-i18n="btn-add-easytier-config">Add EasyTier Config</span>
                            </button>
                        </div>
                        <div class="table-container">
                            <table>
                                <thead>
                                    <tr>
                                        <th data-i18n="th-config-name">Name</th>
                                        <th data-i18n="th-wss-url">WSS Address</th>
                                        <th data-i18n="th-room-id">Room ID</th>
                                        <th data-i18n="th-config-token">Client Token</th>
                                        <th data-i18n="th-created">Created At</th>
                                    </tr>
                                </thead>
                                <tbody id="easyTierConfigsTableBody">
                                    <!-- Dynamic -->
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div class="settings-title" data-i18n="settings-admin-pass">Admin Password</div>
                    <p style="color: var(--text-secondary); font-size: 0.9rem; line-height: 1.6;" data-i18n="set-pass-env-note">The admin password is configured via the <code style="background:rgba(255,255,255,0.08);padding:0.1em 0.4em;border-radius:4px;">ADMIN_PASSWORD</code> environment variable in the Cloudflare Workers dashboard. Changes take effect after redeployment.</p>
                </div>
            </div>
        </main>
    </div>

    <!-- MODAL: CREATE TOKEN -->
    <div id="createTokenModal" class="modal">
        <div class="modal-card">
            <h3 class="modal-title" data-i18n="btn-gen-token">Generate Token</h3>
            <form onsubmit="handleCreateToken(event)">
                <div class="form-group">
                    <label for="tokenDescInput" data-i18n="th-desc">Description</label>
                    <input type="text" id="tokenDescInput" class="form-control" placeholder="e.g. Home Node, Office VPS" required>
                </div>
                <div class="modal-actions">
                    <button type="button" class="btn-cancel" onclick="closeCreateTokenModal()" data-i18n="btn-cancel">Cancel</button>
                    <button type="submit" class="btn-submit" style="width: auto; padding: 0.6rem 1.5rem;" data-i18n="btn-confirm">Generate</button>
                </div>
            </form>
        </div>
    </div>

    <!-- MODAL: CREATE EASYTIER CONFIG -->
    <div id="easyTierConfigModal" class="modal">
        <div class="modal-card">
            <h3 class="modal-title" data-i18n="easytier-config-modal-title">Add EasyTier Config</h3>
            <form onsubmit="handleCreateEasyTierConfig(event)">
                <div class="form-group">
                    <label for="easyTierConfigNameInput" data-i18n="easytier-config-name">Config Name</label>
                    <input type="text" id="easyTierConfigNameInput" class="form-control" data-i18n-placeholder="easytier-config-name-ph" placeholder="Home Node" required>
                </div>
                <div class="form-group">
                    <label for="easyTierConfigWssInput" data-i18n="easytier-config-wss">WSS Address</label>
                    <input type="url" id="easyTierConfigWssInput" class="form-control" data-i18n-placeholder="easytier-config-wss-ph" placeholder="wss://example.com/ws" required>
                </div>
                <div class="form-group">
                    <label for="easyTierConfigRoomInput" data-i18n="easytier-config-room">Room ID</label>
                    <input type="text" id="easyTierConfigRoomInput" class="form-control" data-i18n-placeholder="easytier-config-room-ph" placeholder="default">
                </div>
                <div class="form-group">
                    <label for="easyTierConfigTokenInput" data-i18n="easytier-config-token">Client Token</label>
                    <input type="text" id="easyTierConfigTokenInput" class="form-control" data-i18n-placeholder="easytier-config-token-ph" placeholder="Optional token">
                </div>
                <div class="form-group">
                    <label for="easyTierConfigNotesInput" data-i18n="easytier-config-notes">Notes</label>
                    <textarea id="easyTierConfigNotesInput" class="form-control" rows="3" data-i18n-placeholder="easytier-config-notes-ph" placeholder="Optional notes"></textarea>
                </div>
                <div class="modal-actions">
                    <button type="button" class="btn-cancel" onclick="closeEasyTierConfigModal()" data-i18n="btn-cancel">Cancel</button>
                    <button type="submit" class="btn-submit" style="width: auto; padding: 0.6rem 1.5rem;" data-i18n="btn-confirm">Confirm</button>
                </div>
            </form>
        </div>
    </div>

    <!-- Translations & Dashboard JS Logic -->
    <script>
        const translations = {
    en: {
        "login-label": "Admin Password",
        "login-btn": "Sign In",
        "login-error": "Incorrect password. Please try again.",
        "menu-overview": "Overview",
        "menu-rooms": "Rooms & Peers",
        "menu-tokens": "Client Tokens",
        "menu-settings": "Settings",
        "role-admin": "Administrator",
        "stat-status": "Server Status",
        "stat-online": "Online",
        "stat-active-rooms": "Active Rooms",
        "stat-connected-peers": "Total Peers",
        "stat-total-traffic": "Traffic (Rx/Tx)",
        "topo-map-title": "Network Topology Map",
        "topo-no-nodes": "No nodes connected. WSS relay is empty.",
        "rooms-list-title": "Active Relay Rooms",
        "th-room-name": "Room ID",
        "th-peer-count": "Active Peers",
        "th-actions": "Actions",
        "btn-close": "Close",
        "th-peer-id": "Peer ID",
        "th-virtual-ip": "Virtual IP",
        "th-hostname": "Hostname",
        "th-version": "Version",
        "th-rx-tx": "Rx / Tx Traffic",
        "th-conn-time": "Connected Time",
        "tokens-title": "Client Connection Tokens",
        "btn-gen-token": "Generate Token",
        "th-token": "Token",
        "th-desc": "Description",
        "th-created": "Created At",
        "settings-general": "General Configuration",
        "set-req-token-title": "Require Connection Token",
        "set-req-token-desc": "Enforce EasyTier clients to connect with a valid token parameter.",
        "easytier-configs-title": "EasyTier Configurations",
        "btn-add-easytier-config": "Add EasyTier Config",
        "th-config-name": "Name",
        "th-wss-url": "WSS Address",
        "th-room-id": "Room ID",
        "th-config-token": "Client Token",
        "easytier-config-modal-title": "Add EasyTier Config",
        "easytier-config-name": "Config Name",
        "easytier-config-wss": "WSS Address",
        "easytier-config-room": "Room ID",
        "easytier-config-token": "Client Token",
        "easytier-config-notes": "Notes",
        "easytier-config-name-ph": "Home Node",
        "easytier-config-wss-ph": "wss://example.com/ws",
        "easytier-config-room-ph": "default",
        "easytier-config-token-ph": "Optional token",
        "easytier-config-notes-ph": "Optional notes",
        "easytier-config-empty": "No EasyTier configs yet. Click Add EasyTier Config to create one.",
        "msg-config-added": "EasyTier config added successfully!",
        "settings-admin-pass": "Change Admin Password",
        "set-new-pass": "New Password",
        "btn-save": "Save Password",
        "btn-cancel": "Cancel",
        "btn-confirm": "Confirm",
        "alert-security-title": "Security Warning: ",
        "alert-security-desc": "You are using the default admin password 'admin'. Please change it immediately.",
        "action-view": "View Peers",
        "action-kick": "Kick",
        "action-ban": "Ban",
        "action-delete": "Delete",
        "msg-changed-pass": "Admin password updated successfully!",
        "msg-gen-success": "Token generated successfully!",
        "msg-kicked-success": "Peer kicked successfully!",
        "msg-deleted-success": "Token deleted successfully!",
        "set-pass-env-note": "The admin password is configured via the ADMIN_PASSWORD environment variable in the Cloudflare Workers dashboard. Changes take effect after redeployment."
    },
    "zh-CN": {
        "login-label": "管理员密码",
        "login-btn": "登录",
        "login-error": "密码错误，请重试",
        "menu-overview": "系统概览",
        "menu-rooms": "房间与节点",
        "menu-tokens": "连接令牌",
        "menu-settings": "设置",
        "role-admin": "系统管理员",
        "stat-status": "服务器状态",
        "stat-online": "在线",
        "stat-active-rooms": "活跃房间",
        "stat-connected-peers": "在线节点数",
        "stat-total-traffic": "流量 (接收/发送)",
        "topo-map-title": "网络拓扑图",
        "topo-no-nodes": "暂无节点连接，中继服务器空闲。",
        "rooms-list-title": "活跃中继房间列表",
        "th-room-name": "房间 ID",
        "th-peer-count": "在线节点",
        "th-actions": "操作",
        "btn-close": "关闭",
        "th-peer-id": "节点 ID",
        "th-virtual-ip": "虚拟 IP (EasyTier)",
        "th-hostname": "主机名",
        "th-version": "EasyTier 版本",
        "th-rx-tx": "接收 / 发送",
        "th-conn-time": "已连接时间",
        "tokens-title": "客户端连接令牌 (Tokens)",
        "btn-gen-token": "创建令牌",
        "th-token": "令牌",
        "th-desc": "描述",
        "th-created": "创建时间",
        "settings-general": "全局配置",
        "set-req-token-title": "启用连接令牌校验",
        "set-req-token-desc": "强制 EasyTier 客户端在连接时携带合法的 token 查询参数，否则拒绝连接。",
        "settings-admin-pass": "修改管理员密码",
        "set-new-pass": "输入新密码",
        "btn-save": "保存",
        "btn-cancel": "取消",
        "btn-confirm": "确认",
        "alert-security-title": "安全警告：",
        "alert-security-desc": "您当前正在使用默认管理员密码 'admin'，请立即修改以保证安全！",
        "action-view": "查看节点",
        "action-kick": "踢出",
        "action-ban": "加入黑名单",
        "action-delete": "删除",
        "msg-changed-pass": "管理员密码修改成功！",
        "msg-gen-success": "令牌生成成功！",
        "msg-kicked-success": "节点已被踢出！",
        "msg-deleted-success": "令牌已删除！",
        "set-pass-env-note": "管理员密码通过 Cloudflare Workers 仪表板的 ADMIN_PASSWORD 环境变量配置，修改后重新部署生效。"
    },
    "zh-TW": {
        "login-label": "管理員密碼",
        "login-btn": "登入",
        "login-error": "密碼錯誤，請重試",
        "menu-overview": "系統概覽",
        "menu-rooms": "房間與節點",
        "menu-tokens": "連線權杖",
        "menu-settings": "設定",
        "role-admin": "系統管理員",
        "stat-status": "伺服器狀態",
        "stat-online": "線上",
        "stat-active-rooms": "活躍房間",
        "stat-connected-peers": "線上節點數",
        "stat-total-traffic": "流量 (接收/傳送)",
        "topo-map-title": "網路拓撲圖",
        "topo-no-nodes": "暫無節點連線，中繼伺服器空閒。",
        "rooms-list-title": "活躍中繼房間清單",
        "th-room-name": "房間 ID",
        "th-peer-count": "線上節點",
        "th-actions": "操作",
        "btn-close": "關閉",
        "th-peer-id": "節點 ID",
        "th-virtual-ip": "虛擬 IP (EasyTier)",
        "th-hostname": "主機名稱",
        "th-version": "EasyTier 版本",
        "th-rx-tx": "接收 / 傳送",
        "th-conn-time": "已連線時間",
        "tokens-title": "用戶端連線權杖 (Tokens)",
        "btn-gen-token": "建立權杖",
        "th-token": "權杖",
        "th-desc": "描述",
        "th-created": "建立時間",
        "settings-general": "全域設定",
        "set-req-token-title": "啟用連線權杖驗證",
        "set-req-token-desc": "強制 EasyTier 用戶端在連線時攜帶合法的 token 查詢參數，否則拒絕連線。",
        "settings-admin-pass": "變更管理員密碼",
        "set-new-pass": "輸入新密碼",
        "btn-save": "儲存",
        "btn-cancel": "取消",
        "btn-confirm": "確認",
        "alert-security-title": "安全警告：",
        "alert-security-desc": "您目前正在使用預設管理員密碼 'admin'，請立即變更以確保安全！",
        "action-view": "查看節點",
        "action-kick": "踢出",
        "action-ban": "加入黑名單",
        "action-delete": "刪除",
        "msg-changed-pass": "管理員密碼變更成功！",
        "msg-gen-success": "權杖建立成功！",
        "msg-kicked-success": "節點已被踢出！",
        "msg-deleted-success": "權杖已刪除！",
        "set-pass-env-note": "管理員密碼可在 Cloudflare Workers 儀表板以 ADMIN_PASSWORD 環境變數設定，修改後重新部署生效。"
    },
    ja: {
        "login-label": "管理者パスワード",
        "login-btn": "ログイン",
        "login-error": "パスワードが正しくありません。再試行してください",
        "menu-overview": "システム概要",
        "menu-rooms": "部屋とノード",
        "menu-tokens": "接続トークン",
        "menu-settings": "設定",
        "role-admin": "システム管理者",
        "stat-status": "稼働状態",
        "stat-online": "オンライン",
        "stat-active-rooms": "アクティブな部屋",
        "stat-connected-peers": "接続中ノード数",
        "stat-total-traffic": "転送量 (受信/送信)",
        "topo-map-title": "ネットワークトポロジーマップ",
        "topo-no-nodes": "接続されているノードはありません。中継サーバーは空いています。",
        "rooms-list-title": "アクティブな部屋のリスト",
        "th-room-name": "部屋 ID",
        "th-peer-count": "接続ノード数",
        "th-actions": "操作",
        "btn-close": "閉じる",
        "th-peer-id": "ノード ID",
        "th-virtual-ip": "仮想 IP",
        "th-hostname": "ホスト名",
        "th-version": "バージョン",
        "th-rx-tx": "受信 / 送信",
        "th-conn-time": "接続時間",
        "tokens-title": "クライアント接続用トークン",
        "btn-gen-token": "トークン生成",
        "th-token": "トークン",
        "th-desc": "説明",
        "th-created": "作成日時",
        "settings-general": "一般設定",
        "set-req-token-title": "接続トークンの検証を強制",
        "set-req-token-desc": "クライアントが有効な token パラメータを持って接続することを強制します。",
        "settings-admin-pass": "管理者パスワードの変更",
        "set-new-pass": "新しいパスワード",
        "btn-save": "保存",
        "btn-cancel": "キャンセル",
        "btn-confirm": "確認",
        "alert-security-title": "セキュリティ警告：",
        "alert-security-desc": "デフォルトの管理者パスワード 'admin' を使用しています。すぐに変更してください。",
        "action-view": "詳細表示",
        "action-kick": "キック",
        "action-ban": "禁止リストへ",
        "action-delete": "削除",
        "msg-changed-pass": "管理者パスワードが更新されました。",
        "msg-gen-success": "トークンが生成されました。",
        "msg-kicked-success": "ノードをキックしました。",
        "msg-deleted-success": "トークンを削除しました。",
        "set-pass-env-note": "管理者パスワードは Cloudflare Workers ダッシュボードの ADMIN_PASSWORD 環境変数で設定します。変更は再デプロイ後に有効になります。"
    },
    ko: {
        "login-label": "관리자 비밀번호",
        "login-btn": "로그인",
        "login-error": "비밀번호가 올바르지 않습니다. 다시 시도하십시오.",
        "menu-overview": "시스템 개요",
        "menu-rooms": "룸 및 피어",
        "menu-tokens": "연결 토큰",
        "menu-settings": "설정",
        "role-admin": "시스템 관리자",
        "stat-status": "서버 상태",
        "stat-online": "온라인",
        "stat-active-rooms": "활성 룸",
        "stat-connected-peers": "온라인 피어 수",
        "stat-total-traffic": "트래픽 (수신/전송)",
        "topo-map-title": "네트워크 토폴로지 맵",
        "topo-no-nodes": "연결된 노드가 없습니다. WSS 릴레이가 비어 있습니다.",
        "rooms-list-title": "활성 릴레이 룸 목록",
        "th-room-name": "룸 ID",
        "th-peer-count": "연결 피어",
        "th-actions": "작업",
        "btn-close": "닫기",
        "th-peer-id": "피어 ID",
        "th-virtual-ip": "가상 IP",
        "th-hostname": "호스트 이름",
        "th-version": "버전",
        "th-rx-tx": "수신 / 전송",
        "th-conn-time": "연결 시간",
        "tokens-title": "클라이언트 연결 토큰",
        "btn-gen-token": "토큰 생성",
        "th-token": "토큰",
        "th-desc": "설명",
        "th-created": "생성일",
        "settings-general": "일반 설정",
        "set-req-token-title": "연결 토큰 검증 필수",
        "set-req-token-desc": "EasyTier 클라이언트가 연결 시 유효한 token 파라미터를 보내도록 강제합니다.",
        "settings-admin-pass": "관리자 비밀번호 변경",
        "set-new-pass": "새 비밀번호",
        "btn-save": "저장",
        "btn-cancel": "취소",
        "btn-confirm": "확인",
        "alert-security-title": "보안 경고：",
        "alert-security-desc": "기본 관리자 비밀번호 'admin' 을 사용중입니다. 즉시 변경하십시오.",
        "action-view": "피어 보기",
        "action-kick": "추방",
        "action-ban": "차단 목록",
        "action-delete": "삭제",
        "msg-changed-pass": "비밀번호가 성공적으로 변경되었습니다!",
        "msg-gen-success": "토큰이 생성되었습니다!",
        "msg-kicked-success": "피어가 성공적으로 추방되었습니다!",
        "msg-deleted-success": "토큰이 삭제되었습니다!",
        "set-pass-env-note": "관리자 비밀번호는 Cloudflare Workers 대시보드의 ADMIN_PASSWORD 환경 변수로 설정됩니다. 변경 사항은 재배포 후 적용됩니다."
    }
};

        function safeCreateIcons() {
            try {
                if (typeof lucide !== 'undefined' && lucide.createIcons) {
                    lucide.createIcons();
                }
            } catch (e) {
                console.warn('Lucide icons failed to load:', e);
            }
        }

        let currentLang = 'en';
        const supportedLangs = ['en', 'zh-CN', 'zh-TW', 'ja', 'ko'];
        const languageNames = {
            en: 'English',
            'zh-CN': '简体中文',
            'zh-TW': '繁體中文',
            ja: '日本語',
            ko: '한국어'
        };
        const loginCopy = {
            en: {
                title: 'Sign in to continue',
                hint: 'Use the admin password configured in Cloudflare Workers to unlock the dashboard.',
                label: 'Admin Password',
                placeholder: 'Enter admin password',
                button: 'Sign In',
                error: 'Incorrect password. Please try again.'
            },
            'zh-CN': {
                title: '登录以继续',
                hint: '请输入在 Cloudflare Workers 中配置的管理密码以进入控制台。',
                label: '管理员密码',
                placeholder: '请输入管理员密码',
                button: '登录',
                error: '密码错误，请重试。'
            },
            'zh-TW': {
                title: '登入以繼續',
                hint: '請輸入在 Cloudflare Workers 中設定的管理密碼以進入控制台。',
                label: '管理員密碼',
                placeholder: '請輸入管理員密碼',
                button: '登入',
                error: '密碼錯誤，請再試一次。'
            },
            ja: {
                title: '続行するにはログインしてください',
                hint: 'Cloudflare Workers で設定した管理パスワードを入力してダッシュボードを開きます。',
                label: '管理者パスワード',
                placeholder: '管理者パスワードを入力',
                button: 'ログイン',
                error: 'パスワードが正しくありません。もう一度お試しください。'
            },
            ko: {
                title: '계속하려면 로그인하세요',
                hint: 'Cloudflare Workers에 설정한 관리자 비밀번호를 입력해 대시보드를 잠금 해제하세요.',
                label: '관리자 비밀번호',
                placeholder: '관리자 비밀번호 입력',
                button: '로그인',
                error: '비밀번호가 올바르지 않습니다. 다시 시도하세요.'
            }
        };
        </script>
    <script src="/assets/admin/shared.js" defer></script>
    <script src="/assets/admin/auth.js" defer></script>
    <script src="/assets/admin/dashboard.js" defer></script>
    <script src="/assets/admin/tokens-settings.js" defer></script>
    <script src="/assets/admin/boot.js" defer></script>
</body>
</html>
`;
