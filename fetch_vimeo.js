const https = require('https');

const options = {
  hostname: 'player.vimeo.com',
  path: '/video/26858667',
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.9',
    'Referer': 'https://indigenousreview.blogspot.com/',
    'Sec-Fetch-Dest': 'iframe',
    'Sec-Fetch-Mode': 'navigate',
    'Sec-Fetch-Site': 'cross-site'
  }
};

https.get(options, (res) => {
  console.log('Status Code:', res.statusCode);
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    console.log('HTML Length:', data.length);
    const configMatch = data.match(/window\.playerConfig\s*=\s*(\{.+?\});/) || data.match(/var\s+config\s*=\s*(\{.+?\});/) || data.match(/"config":(\{.+?\})/);
    if (configMatch) {
      console.log('Config match found!');
      try {
        const parsed = JSON.parse(configMatch[1]);
        console.log(JSON.stringify(parsed, null, 2).substring(0, 1000));
      } catch (e) {
        console.log('JSON parse error:', e.message);
        console.log(configMatch[1].substring(0, 500));
      }
    } else {
      console.log('Sample data snippet:', data.substring(0, 500));
    }
  });
});
