<script>
document.addEventListener("DOMContentLoaded", async () => {
  // Load YAML helper
  async function loadYAML(url) {
    const res = await fetch(url);
    const text = await res.text();
    return jsyaml.load(text);
  }

  // Load MARKDOWN helper
  async function loadMarkdownFolder(folder) {
    const all = [];
    const api = `https://api.github.com/repos/Harshu2004/panditan-di-hatti/contents/${folder}`;
    const res = await fetch(api);
    const files = await res.json();
    for (const file of files) {
      if (file.name.endsWith(".md")) {
        const mdRes = await fetch(file.download_url);
        const raw = await mdRes.text();
        const [, fm, content] = raw.match(/^---\n([\s\S]+?)\n---\n([\s\S]*)$/) || [];
        const data = jsyaml.load(fm || "");
        data.body = content;
        all.push(data);
      }
    }
    return all;
  }

  // Load basic settings
  const banner = await loadYAML('banner.yml');
  const about = await loadYAML('about.yml');
  const settings = await loadYAML('settings.yml');

  // Update DOM
  document.querySelector("h1").textContent = banner.title;
  document.querySelector(".tagline").textContent = banner.tagline;
  document.getElementById("zomatoBtn").href = banner.zomato;

  // About Section
  document.querySelector(".about p").innerHTML = about.content;
  document.querySelector(".about img").src = about.owner_image;

  // Shop Image
  document.querySelector(".shop-img").src = about.shop_image;

  // Update timings
  const timingsList = document.getElementById("timing-list");
  timingsList.innerHTML = "";
  settings.opening_hours.forEach((day, i) => {
    const li = document.createElement("li");
    li.innerHTML = `${day.day}: <span>${day.time}</span>`;
    if (i === new Date().getDay()) li.classList.add("today");
    timingsList.appendChild(li);
  });

  // Load Menu
  const menuItems = await loadMarkdownFolder('content/menu');
  const menuSection = document.querySelector(".menu");
  menuItems.forEach(item => {
    const div = document.createElement("div");
    div.className = "menu-item";
    div.innerHTML = `
      <img src="${item.image}" alt="${item.title}">
      <div><strong>${item.title}:</strong> ${item.description}</div>
    `;
    menuSection.appendChild(div);
  });

  // Load Offers
  const offers = await loadMarkdownFolder('content/offers');
  const offersBanner = document.querySelector(".offers-banner");
  offersBanner.textContent = "🎉 " + offers[0].title + " – " + offers[0].details;

  // Load Reviews
  const reviews = await loadMarkdownFolder('content/reviews');
  const reviewSection = document.querySelector(".reviews");
  reviews.forEach(r => {
    const div = document.createElement("div");
    div.className = "review";
    div.innerHTML = `<strong>${r.name}:</strong> "${r.review}"`;
    reviewSection.appendChild(div);
  });
});
</script>

<!-- Load YAML parser -->
<script src="https://cdn.jsdelivr.net/npm/js-yaml@4.1.0/dist/js-yaml.min.js"></script>
