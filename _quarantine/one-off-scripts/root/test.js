const url = 'http://localhost:3000/';
fetch(url).then(r => r.text()).then(html => {
  console.log('--- HOMEPAGE ---');
  console.log('TITLE:', html.match(/<title>(.*?)<\/title>/)?.[1]);
  console.log('DESC:', html.match(/<meta[^>]*name="description"[^>]*content="([^"]*)"/)?.[1]);
  console.log('CANONICAL:', html.match(/<link[^>]*rel="canonical"[^>]*href="([^"]*)"/)?.[1]);
  const ld = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)?.[1];
  console.log('JSONLD:', ld ? 'Present' : 'Missing');
  console.log('WHATSAPP LINK (Home):', html.match(/href="(https:\/\/api\.whatsapp\.com\/send[^"]*)"/)?.[1]);
  
  return fetch('http://localhost:3000/collections');
}).then(r => r.text()).then(html => {
  console.log('\n--- COLLECTIONS ---');
  console.log('TITLE:', html.match(/<title>(.*?)<\/title>/)?.[1]);
  
  return fetch('http://localhost:3000/catalogs');
}).then(r => r.text()).then(html => {
  console.log('\n--- CATALOGS ---');
  console.log('VIEW CATALOG:', html.includes('View Catalog'));
  
});
