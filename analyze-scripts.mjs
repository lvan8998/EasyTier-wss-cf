import('./src/admin_html.js').then(m => {
  const html = m.serveAdminDashboard;
  const scriptRegex = /<script[^>]*>([\s\S]*?)<\/script>/g;
  let match;
  let count = 0;
  while((match = scriptRegex.exec(html)) !== null) {
    count++;
    console.log(`\nScript block ${count}:`);
    console.log('Length:', match[1].length);
    console.log('First 100 chars:', match[1].substring(0, 100));
    console.log('Last 50 chars:', match[1].substring(match[1].length - 50));
    // Check for common issues
    if(match[1].includes('${')) {
      console.log('WARNING: Contains unexpanded template expression');
    }
  }
  console.log(`\nTotal script blocks: ${count}`);
}).catch(e => console.error('Error:', e.message));
