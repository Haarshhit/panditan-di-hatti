// 📦 Load all CMS content into site
// Requires: banner.yml, about.yml, settings.yml, video.yml, footer.yml
// And folders: content/menu/, content/offers/, content/reviews/

// Load YAML parser
const loadYAML = async (url) => {
  const res = await fetch(url);
  const text = await res.text();
  return jsyaml.load(text);
};

// 🏠 Banner Section
loadYAML('/banner.yml').then(data => {
  document.querySelector('#banner-title').innerText = data.title;
  document.querySelector('#tagline').innerText = data.tagline;
});

// 👤 About Section
loadYAML('/about.yml').then(data => {
  document.querySelector('#about-description').innerText = data.description;
  document.querySelector('#owner-image').src = data.owner_image;
});

// 🕒 Timings + Zomato + Meta
loadYAML('/settings.yml').then(data => {
  const now = new Date();
  const totalMins = now.getHours() * 60 + now.getMinutes();
  const isOpen = totalMins >= data.open_time && totalMins <= data.close_time;
  document.getElementById('openStatus').textContent = isOpen ? '✅ We’re Open Now' : '❌ We’re Closed Now';

  const btn = document.getElementById('zomatoBtn');
  btn.classList.add(isOpen ? 'open' : 'closed');
  btn.href = data.zomato_url;

  document.title = data.meta_title;
  document.querySelector('meta[name="description"]').setAttribute('content', data.meta_description);
});

// 🎥 Modi Video
loadYAML('/video.yml').then(data => {
  document.getElementById('modi-video-frame').src = data.youtube;
});

// 📜 Footer
loadYAML('/footer.yml').then(data => {
  document.getElementById('footer-text').innerText = data.footer_text;
});

// 🍽️ Menu Items
fetch('/content/menu')
  .then(res => res.text())
  .then(html => console.log("Menu folder list fetch not supported on Netlify directly."));

// Same for Offers & Reviews: must be statically embedded or use Netlify Functions
// Alternative: Use Eleventy, Astro, or JS static site generators to compile

// 💡 Tip: Replace static content with <span id="..."> and update with JS above
