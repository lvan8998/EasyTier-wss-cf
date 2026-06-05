import { buildAdminI18nScript } from "./admin_i18n/index.js";

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
            max-width: 360px;
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
            max-width: 960px;
            margin: 0 auto;
            opacity: 0;
            transition: opacity 0.5s ease;
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
            max-height: 85vh;
            overflow-y: auto;
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

        /* RESPONSIVE MEDIA QUERIES */
        @media (max-width: 768px) {
            main {
                padding: 1.5rem;
            }
            .stats-grid {
                grid-template-columns: 1fr 1fr;
                gap: 1rem;
            }
            .stat-card {
                padding: 1rem;
                gap: 0.75rem;
            }
            .stat-icon {
                width: 40px;
                height: 40px;
            }
            .stat-val {
                font-size: 1.3rem;
            }
            .page-title {
                font-size: 1.5rem;
            }
            .refresh-indicator {
                font-size: 0.75rem;
                padding: 0.3rem 0.6rem;
            }
            .top-nav {
                flex-direction: column;
                gap: 1rem;
                margin-bottom: 1rem;
            }
            .header-controls {
                width: 100%;
                justify-content: space-between;
            }
            .table-title {
                font-size: 1rem;
            }
            th {
                padding: 0.75rem;
                font-size: 0.75rem;
            }
            td {
                padding: 0.75rem;
                font-size: 0.85rem;
            }
            .btn-action {
                padding: 0.35rem 0.7rem;
                font-size: 0.75rem;
            }
            .btn-create {
                padding: 0.5rem 1rem;
                font-size: 0.85rem;
            }
        }

        @media (max-width: 480px) {
            body {
                overflow-y: auto;
            }
            #appLayout {
                flex-direction: column;
            }
                left: -280px;
                top: 0;
                height: 100vh;
                z-index: 18;
                transition: left 0.3s ease;
                overflow-y: auto;
                padding: 1rem;
                border-right: 1px solid var(--border-color);
            }
        }
            .brand {
                font-size: 1.2rem;
                margin-bottom: 2rem;
            }
            main {
                flex-grow: 1;
                width: 100%;
                padding: 0;
                height: auto;
                overflow-y: auto;
            }
            .top-nav {
                display: flex;
                flex-direction: column;
                gap: 0.75rem;
                margin-bottom: 1.5rem;
                padding: 1rem;
                border-bottom: 1px solid var(--border-color);
            }
            .page-title {
                font-size: 1.2rem;
                margin-bottom: 0.5rem;
            }
            .header-controls {
                flex-direction: row;
                gap: 0.5rem;
                width: 100%;
            }
            .refresh-indicator {
                flex-grow: 1;
                font-size: 0.7rem;
                padding: 0.3rem 0.5rem;
            }
            .top-lang-wrapper {
                padding: 0.3rem 0.6rem 0.3rem 0.5rem;
                font-size: 0.7rem;
            }
            .top-lang-select {
                font-size: 0.7rem;
            }
            .tab-content {
                padding: 0;
                gap: 1.5rem;
            }
            #tabOverview {
                padding: 1rem;
            }
            .stats-grid {
                grid-template-columns: 1fr;
                gap: 1rem;
            }
            .stat-card {
                padding: 1rem;
                gap: 0.75rem;
                min-height: auto;
            }
            .stat-icon {
                width: 40px;
                height: 40px;
                flex-shrink: 0;
            }
            .stat-label {
                font-size: 0.75rem;
            }
            .stat-val {
                font-size: 1.2rem;
            }
            .topo-card {
                min-height: 300px;
                padding: 1rem;
            }
            .topo-body {
                min-height: 250px;
            }
            .topo-svg {
                min-height: 250px;
            }
            .table-card {
                padding: 1rem;
                border-radius: 12px;
            }
            .table-header-row {
                margin-bottom: 1rem;
                gap: 0.5rem;
                flex-wrap: wrap;
            }
            .table-title {
                font-size: 1rem;
                flex-basis: 100%;
            }
            .table-container {
                overflow-x: auto;
            }
            table {
                width: 100%;
            }
            table thead {
                display: none;
            }
            table tr {
                display: block;
                background: rgba(255, 255, 255, 0.02);
                border: 1px solid var(--border-color);
                border-radius: 8px;
                margin-bottom: 1rem;
                overflow: hidden;
            }
            table td {
                display: block;
                padding: 0.75rem;
                text-align: left;
                border: none;
                border-bottom: 1px solid rgba(255, 255, 255, 0.03);
                position: relative;
                padding-left: 50%;
            }
            table td:last-child {
                border-bottom: none;
            }
            table td:before {
                content: attr(data-label);
                position: absolute;
                left: 0.75rem;
                top: 0.75rem;
                color: var(--text-secondary);
                font-weight: 600;
                font-size: 0.75rem;
                text-transform: uppercase;
            }
            tr:hover td {
                background: transparent;
            }
            .btn-action {
                padding: 0.5rem 0.75rem;
                font-size: 0.75rem;
                min-height: 36px;
                min-width: 44px;
                display: inline-flex;
            }
            .btn-create {
                padding: 0.6rem 1rem;
                font-size: 0.85rem;
                min-height: 44px;
                width: 100%;
            }
            .btn-submit {
                padding: 0.75rem;
                font-size: 0.95rem;
                min-height: 44px;
            }
            .btn-cancel {
                padding: 0.6rem 1rem;
                min-height: 44px;
            }
            .modal-card {
                max-width: calc(100% - 2rem);
                padding: 1.5rem 1rem;
                border-radius: 16px;
                max-height: 90vh;
                overflow-y: auto;
            }
            .modal-title {
                font-size: 1.1rem;
                margin-bottom: 1rem;
            }
            .modal-actions {
                gap: 0.75rem;
                margin-top: 1.5rem;
                flex-wrap: wrap;
            }
            .btn-cancel, .btn-submit {
                flex: 1;
                min-width: 100px;
            }
            .form-group {
                margin-bottom: 1rem;
            }
            .form-control {
                padding: 0.75rem 1rem;
                font-size: 1rem;
                min-height: 44px;
            }
            textarea.form-control {
                min-height: 100px;
                resize: vertical;
            }
            .form-control:focus {
                border-color: var(--primary);
                background: rgba(0, 0, 0, 0.5);
            }
            .settings-card {
                max-width: 100%;
                padding: 1rem;
            }
            .settings-title {
                font-size: 1rem;
                margin-bottom: 1rem;
            }
            .switch-control {
                margin-bottom: 1rem;
            }
            .switch-label h4 {
                font-size: 0.95rem;
            }
            .switch-label p {
                font-size: 0.8rem;
                line-height: 1.4;
            }
            .login-card {
                padding: 2rem 1.5rem;
                max-width: calc(100% - 1rem);
                margin: 1rem auto;
            }
            .login-logo {
                font-size: 1.5rem;
                margin-bottom: 1rem;
            }
            .login-copy h1 {
                font-size: 1rem;
            }
            .login-copy p {
                font-size: 0.85rem;
                line-height: 1.4;
            }
            #easyTierConfigModal [style*="grid-template-columns: 1fr 1fr"] {
                grid-template-columns: 1fr !important;
            }
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
        <!-- Mobile Top Navigation (only visible on small screens) -->
                <!-- Sidebar Overlay for Mobile -->

        <!-- Sidebar -->

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

                <!-- EasyTier Config Files Section -->
                <div class="table-card" style="margin-top: 2rem;">
                    <div class="table-header-row">
                        <span class="table-title" data-i18n="easytier-configs-title">EasyTier Config Files</span>
                        <button class="btn-create" onclick="openEasyTierConfigModal()">
                            <i data-lucide="plus"></i>
                            <span data-i18n="btn-add-easytier-config">Add Config File</span>
                        </button>
                    </div>
                    <div class="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th data-i18n="th-config-name">Config Name</th>
                                    <th data-i18n="th-network-name">Network Name</th>
                                    <th data-i18n="th-virtual-ip">Virtual IP (IPv4)</th>
                                    <th data-i18n="th-peers">Peers</th>
                                    <th data-i18n="th-created">Created At</th>
                                    <th data-i18n="th-actions">Actions</th>
                                </tr>
                            </thead>
                            <tbody id="easyTierConfigsTableBody">
                                <!-- Dynamic -->
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>


                <!-- WSS Connection Test -->
                <div class="table-card" style="margin-top: 2rem;">
                    <div class="table-header-row">
                        <span class="table-title" data-i18n="wss-test-title">WSS Connection Test</span>
                        <button class="btn-action" onclick="testWssConnection()" id="wssTestBtn">
                            <i data-lucide="plug-2"></i>
                            <span data-i18n="wss-test-btn">Test Connection</span>
                        </button>
                    </div>
                    <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                        <div id="wssTestUrl" style="color: var(--text-secondary); font-family: monospace; font-size: 0.85rem; word-break: break-all;"></div>
                        <div id="wssTestStatus" style="font-weight: 600;" data-i18n="wss-test-not-tested">Click "Test Connection" to verify WSS relay</div>
                    </div>
                </div>
        </main>
    </div>

    <!-- MODAL: CREATE EASYTIER CONFIG -->
    <div id="easyTierConfigModal" class="modal">
        <div class="modal-card" style="max-width: 720px; width: 90%;">
            <h3 class="modal-title" data-i18n="easytier-config-modal-title">Add EasyTier Config</h3>
            <form onsubmit="handleCreateEasyTierConfig(event)">
                <input type="hidden" id="easyTierConfigId">
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.5rem;">
                    <!-- Column 1: Network settings -->
                    <div style="display: flex; flex-direction: column; gap: 0.8rem;">
                        <h4 style="color: var(--primary); border-bottom: 1px solid var(--glass-border); padding-bottom: 0.3rem;" data-i18n="section-net-identity">Network Identity</h4>
                        <div class="form-group">
                            <label for="easyTierConfigInstanceName" data-i18n="label-instance-name">Instance Name</label>
                            <input type="text" id="easyTierConfigInstanceName" class="form-control" data-i18n-placeholder="placeholder-instance-name">
                        </div>
                        <div class="form-group">
                            <label for="easyTierConfigNetworkName" data-i18n="easytier-config-network-name">Network Name</label>
                            <input type="text" id="easyTierConfigNetworkName" class="form-control" data-i18n-placeholder="placeholder-network-name" required>
                        </div>
                        <div class="form-group">
                            <label for="easyTierConfigNetworkSecret" data-i18n="easytier-config-network-secret">Network Secret</label>
                            <input type="password" id="easyTierConfigNetworkSecret" class="form-control" data-i18n-placeholder="placeholder-network-secret" required>
                        </div>
                        
                        <h4 style="color: var(--primary); border-bottom: 1px solid var(--glass-border); padding-bottom: 0.3rem; margin-top: 0.5rem;" data-i18n="section-ip-settings">IP & DHCP</h4>
                        <div class="form-group">
                            <label for="easyTierConfigIpv4" data-i18n="label-ipv4">Virtual IPv4</label>
                            <input type="text" id="easyTierConfigIpv4" class="form-control" data-i18n-placeholder="placeholder-ipv4">
                        </div>
                        <div class="switch-control" style="margin-top: 0.5rem;">
                            <span style="font-size: 0.9rem; font-weight: 500;" data-i18n="label-dhcp">Enable DHCP</span>
                            <label class="switch">
                                <input type="checkbox" id="easyTierConfigDhcp">
                                <span class="slider"></span>
                            </label>
                        </div>
                    </div>

                    <!-- Column 2: Connection & Flags -->
                    <div style="display: flex; flex-direction: column; gap: 0.8rem;">
                        <h4 style="color: var(--primary); border-bottom: 1px solid var(--glass-border); padding-bottom: 0.3rem;" data-i18n="section-connections">Connections</h4>
                        <div class="form-group">
                            <label for="easyTierConfigPeers" data-i18n="label-peers">P2P Peers (one per line)</label>
                            <textarea id="easyTierConfigPeers" class="form-control" rows="3" data-i18n-placeholder="placeholder-peers"></textarea>
                        </div>
                        <div class="form-group">
                            <label for="easyTierConfigRpcPortal" data-i18n="label-rpc-portal">RPC Portal Address</label>
                            <input type="text" id="easyTierConfigRpcPortal" class="form-control" value="127.0.0.1:15888">
                        </div>
                    </div>
                </div>

                <!-- Advanced flags section -->
                <h4 style="color: var(--primary); border-bottom: 1px solid var(--glass-border); padding-bottom: 0.3rem; margin-bottom: 0.8rem;" data-i18n="section-flags">Options & Flags</h4>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.5rem;">
                    <div style="display: flex; flex-direction: column; gap: 0.8rem;">
                        <div class="form-group">
                            <label for="easyTierConfigProtocol" data-i18n="label-protocol">Default Protocol</label>
                            <select id="easyTierConfigProtocol" class="form-control" style="background: var(--input-bg); color: var(--text-color); border: 1px solid var(--glass-border); border-radius: 8px; padding: 0.6rem 0.8rem;">
                                <option value="tcp" data-i18n="option-tcp">TCP</option>
                                <option value="udp" data-i18n="option-udp">UDP</option>
                                <option value="ws" data-i18n="option-ws">WebSocket (WS)</option>
                                <option value="wss" data-i18n="option-wss">WebSocket Secure (WSS)</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="easyTierConfigDevName" data-i18n="label-dev-name">TUN Device Name</label>
                            <input type="text" id="easyTierConfigDevName" class="form-control" value="tun0">
                        </div>
                        <div class="form-group">
                            <label for="easyTierConfigMtu" data-i18n="label-mtu">MTU</label>
                            <input type="number" id="easyTierConfigMtu" class="form-control" value="1380">
                        </div>
                    </div>
                    <div style="display: flex; flex-direction: column; gap: 0.8rem;">
                        <div class="form-group">
                            <label for="easyTierConfigProxyNetworks" data-i18n="label-proxy-networks">Proxy Subnets (one per line)</label>
                            <textarea id="easyTierConfigProxyNetworks" class="form-control" rows="2" data-i18n-placeholder="placeholder-proxy-networks"></textarea>
                        </div>
                        <div style="display: flex; flex-direction: column; gap: 0.6rem; margin-top: 0.5rem;">
                            <div class="switch-control">
                                <span style="font-size: 0.9rem; font-weight: 500;" data-i18n="label-encryption">Enable Encryption</span>
                                <label class="switch">
                                    <input type="checkbox" id="easyTierConfigEncryption" checked>
                                    <span class="slider"></span>
                                </label>
                            </div>
                            <div class="switch-control">
                                <span style="font-size: 0.9rem; font-weight: 500;" data-i18n="label-ipv6">Enable IPv6</span>
                                <label class="switch">
                                    <input type="checkbox" id="easyTierConfigIpv6" checked>
                                    <span class="slider"></span>
                                </label>
                            </div>
                            <div class="switch-control">
                                <span style="font-size: 0.9rem; font-weight: 500;" data-i18n="label-latency-first">Latency First</span>
                                <label class="switch">
                                    <input type="checkbox" id="easyTierConfigLatencyFirst">
                                    <span class="slider"></span>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="form-group" style="margin-bottom: 1.5rem;">
                    <label for="easyTierConfigNotes" data-i18n="easytier-config-notes">Notes</label>
                    <textarea id="easyTierConfigNotes" class="form-control" rows="2" data-i18n-placeholder="placeholder-notes"></textarea>
                </div>

                <div class="modal-actions">
                    <button type="button" class="btn-cancel" onclick="closeEasyTierConfigModal()" data-i18n="btn-cancel">Cancel</button>
                    <button type="submit" class="btn-submit" style="width: auto; padding: 0.6rem 1.5rem;" data-i18n="btn-confirm">Save Configuration</button>
                </div>
            </form>
        </div>
    </div>

    <!-- Translations: src/admin_i18n/locales/*.js -->
    <script>
${buildAdminI18nScript()}

        function safeCreateIcons() {
            try {
                if (typeof lucide !== 'undefined' && lucide.createIcons) {
                    lucide.createIcons();
                }
            } catch (e) {
                console.warn('Lucide icons failed to load:', e);
            }
        }

        function getTableLabels() {
            const t = translations[currentLang] || translations.en;
            return {
                roomsTableBody: {
                    0: t['th-room-name'],
                    1: t['th-peer-count'],
                    2: t['th-actions']
                },
                peersTableBody: {
                    0: t['th-peer-id'],
                    1: t['th-virtual-ip'],
                    2: t['th-hostname'],
                    3: t['th-version'],
                    4: t['th-rx-tx'],
                    5: t['th-conn-time'],
                    6: t['th-actions']
                },
                tokensTableBody: {
                    0: t['th-token'],
                    1: t['th-desc'],
                    2: t['th-created'],
                    3: t['th-actions']
                },
                easyTierConfigsTableBody: {
                    0: t['th-config-name'],
                    1: t['th-network-name'],
                    2: t['th-virtual-ip'],
                    3: t['th-peers'],
                    4: t['th-created'],
                    5: t['th-actions']
                }
            };
        }

        function refreshTableLabels() {
            const tableLabels = getTableLabels();
            for (const table in tableLabels) {
                const tbody = document.getElementById(table);
                if (!tbody) continue;
                const rows = tbody.querySelectorAll('tr');
                rows.forEach((row) => {
                    const tds = row.querySelectorAll('td');
                    tds.forEach((td, index) => {
                        if (tableLabels[table][index]) {
                            td.setAttribute('data-label', tableLabels[table][index]);
                        }
                    });
                });
            }
        }

        window.refreshTableLabels = refreshTableLabels;

        // Add data-label attributes to table cells for mobile card view
        function setupTableLabels() {
            const observer = new MutationObserver(function() {
                refreshTableLabels();
            });
            observer.observe(document.body, {
                childList: true,
                subtree: true,
                characterData: true
            });
            refreshTableLabels();
        }
        </script>
    <script src="/assets/admin/shared.js" defer></script>
    <script src="/assets/admin/auth.js" defer></script>
    <script src="/assets/admin/dashboard.js" defer></script>
    <script src="/assets/admin/tokens-settings.js" defer></script>
    <script src="/assets/admin/boot.js" defer></script>
    <script>
        // Initialize mobile features after all scripts are loaded
        document.addEventListener('DOMContentLoaded', function() {
            setupTableLabels();
            // Show relay WSS URL in test card
            var urlDisplay = document.getElementById('wssTestUrl');
            if (urlDisplay) {
                urlDisplay.textContent = 'Relay: wss://' + window.location.host + ':443';
            }
        });
    
        // WSS Connection Test
        window.testWssConnection = function() {
            const btn = document.getElementById('wssTestBtn');
            const status = document.getElementById('wssTestStatus');
            const urlDisplay = document.getElementById('wssTestUrl');
            if (!btn || !status || !urlDisplay) return;
            
            btn.disabled = true;
            btn.style.opacity = '0.5';
            status.textContent = EasyTierAdmin.t('wss-test-testing', 'Testing...');
            status.style.color = 'var(--warning)';
            
            try {
                const wsUrl = EasyTierAdmin.buildClientWsUrl('wss-test');
                urlDisplay.textContent = wsUrl;
                
                const ws = new WebSocket(wsUrl);
                const timeout = setTimeout(() => {
                    ws.close();
                    status.textContent = EasyTierAdmin.t('wss-test-timeout', 'Timeout - no response from relay');
                    status.style.color = 'var(--danger)';
                    btn.disabled = false;
                    btn.style.opacity = '1';
                }, 8000);
                
                ws.onopen = function() {
                    clearTimeout(timeout);
                    status.textContent = EasyTierAdmin.t('wss-test-success', 'Connected! Relay is reachable via WSS');
                    status.style.color = 'var(--success)';
                    btn.disabled = false;
                    btn.style.opacity = '1';
                    ws.close();
                };
                
                ws.onerror = function() {
                    clearTimeout(timeout);
                    status.textContent = EasyTierAdmin.t('wss-test-failed', 'Connection failed - relay unreachable');
                    status.style.color = 'var(--danger)';
                    btn.disabled = false;
                    btn.style.opacity = '1';
                };
            } catch(e) {
                status.textContent = EasyTierAdmin.t('wss-test-error', 'Error') + ': ' + e.message;
                status.style.color = 'var(--danger)';
                btn.disabled = false;
                btn.style.opacity = '1';
            }
        };
        </script>
</body>
</html>
`;
