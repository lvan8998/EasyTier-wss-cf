import('./src/admin_html.js').then(m => {
  const html = m.serveAdminDashboard;
  const scriptRegex = /<script[^>]*>([\s\S]*?)<\/script>/g;
  let match;
  let count = 0;
  
  while((match = scriptRegex.exec(html)) !== null) {
    count++;
    const scriptContent = match[1].trim();
    if(scriptContent.length === 0) continue;
    
    console.log(`\n=== Script block ${count} ===`);
    console.log('Checking syntax...');
    
    try {
      new Function(scriptContent);
      console.log('✓ Valid JavaScript syntax');
    } catch(e) {
      console.log('✗ Syntax error detected:');
      console.log('Error:', e.message);
      console.log('Last 200 chars:', scriptContent.substring(scriptContent.length - 200));
    }
  }
}).catch(e => console.error('Error:', e.message));
