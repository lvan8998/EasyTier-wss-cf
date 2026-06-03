import('./src/admin_i18n/index.js').then(m => {
  const result = m.buildAdminI18nScript();
  console.log('Type:', typeof result);
  console.log('Is string:', typeof result === 'string');
  console.log('Length:', result.length);
  console.log('Starts with:', result.substring(0, 50));
  console.log('Ends with:', result.substring(result.length - 50));
  
  // Verify it's valid JavaScript
  try {
    new Function(result);
    console.log('✓ Valid as JavaScript function body');
  } catch(e) {
    console.log('✗ NOT valid JavaScript:', e.message);
  }
  
  // Check for any issues
  if(result.includes('undefined')) {
    console.log('⚠ Contains "undefined" - might be a problem');
  }
  if(result.includes('${')) {
    console.log('⚠ Contains unexpanded template expression');
  }
}).catch(e => console.error('Error:', e.message));
