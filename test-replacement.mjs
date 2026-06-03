import('./src/admin_i18n/index.js').then(m => {
  import('./src/admin_html.js').then(h => {
    const template = h.serveAdminDashboard;
    console.log('Template length:', template.length);
    const placeholder = '${buildAdminI18nScript()}';
    console.log('Contains placeholder:', template.includes(placeholder));
    const i18nScript = m.buildAdminI18nScript();
    console.log('i18n script length:', i18nScript.length);
    const result = template.replace(placeholder, i18nScript);
    console.log('Result length:', result.length);
    console.log('Placeholder removed:', !result.includes(placeholder));
    console.log('First few chars of result:', result.substring(0, 50));
  }).catch(e => console.error('HTML Error:', e.message));
}).catch(e => console.error('i18n Error:', e.message));
