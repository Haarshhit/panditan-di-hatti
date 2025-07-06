// CMS dynamic loader for Panditan Di Hatti
async function loadSettings() {
  const res = await fetch('settings.yml');
  const text = await res.text();
  const data = jsyaml.load(text);
  const now = new Date();
  const mins = now.getHours() * 60 + now.getMinutes();
  const open = mins >= data.open_time && mins <= data.close_time;
  document.getElementById('openStatus').textContent = open ? '✅ We’re Open Now' : '❌ We’re Closed';
  const zomato = document.getElementById('zomatoBtn');
  zomato.href = data.zomato_url;
  zomato.className = open ? 'zomato open' : 'zomato closed';
}

async function loadOffers() {
  const res = await fetch('content/offers');
  const html = await res.text();
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const links = Array.from(doc.querySelectorAll('a')).map(a => a.href);
  let latest = links.pop(); // get the newest file
  const file = await fetch(latest);
  const raw = await file.text();
  const content = marked.parse(raw.split('---')[2] || '');
  document.getElementById('offers').innerHTML = content;
}

async function loadCollection(folder, containerId) {
  const res = await fetch(`content/${folder}`);
  const html = await res.text();
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const links = Array.from(doc.querySelectorAll('a')).filter(a => a.href.endsWith('.md'));
  const container = document.getElementById(containerId);
  for (let link of links) {
    const file = await fetch(link.href);
    const raw = await file.text();
    const content = raw.split('---')[2] || '';
    const html = marked.parse(content);
    const div = document.createElement('div');
    div.className = folder === 'menu' ? 'menu-item' : 'review';
    div.innerHTML = html;
    container.appendChild(div);
  }
}

loadSettings();
loadOffers();
loadCollection('menu', 'menu');
loadCollection('reviews', 'reviews');
