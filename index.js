
// App State & Data
const SERVICE_DATA = {
  'Soft Glam': { price: 500, label: 'R 500' },
  'Full Glam': { price: 600, label: 'R 600' },
  'Graduation Makeup': { price: 550, label: 'R 550' },
  'Bridal Artistry': { price: 1500, label: 'R 1500' },
  'Classes': { price: 2500, label: 'R 2500' }
};

const GALLERY_DATA = [
  { cat: 'Soft Glam', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA4yapSDp5GSpTszwntTsgc9NHT-EpqjdN-AW6OjFbeUwyTTAQC5H8YupizHCP96nwvI3XLZ6CPbECC7N1AL2PBDFFtC2f-6PeIl9ptyiJKGRpYS8h_Ei7-k9h1pC94Wz_VgJdmTcBjUx-VBbq_kvrr1KKZ1ogBJbHdNqWDwiC0JgGIeloSbUT7YoEoRCqcb4KQJRFAi49BIS5G2nefBKmuWrrXBqs4OTmE--HJx-h4dOsNoeulE1CeVIVR-EG2fy5yESJyO04SqA' },
  { cat: 'Full Glam', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDXDqzR6uBfP2BAUUT6fmvUNJXa6qxbfIqcRYAGl-lNpWf5ZsTCISqhbB0H4admaNERYPjuHjMSE5tFwZEWO7bkZsSLecMUtXZ1gmy4pnqScgSE5ke66dao2V1di3FHyQZBRz3whvJxAZq_2tBsL_LOPVoVvSMkk1LhW0yRUPS-NCzF5PZDWcMu5HavKQnFJ1WSMDkvU_D9GV1HBl5e0jqw5EMwTF89Q84ki9IAE6RGcyS0sW0kBlYzcCK-UtvX2bmduCMvTJv75Q' },
  { cat: 'Editorial', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA4J981hwpeBT4POLaehd6KIXjMNOSIW-77NgvajNqMukRgGL3fdFaNKGl3K-RLPtpVRKDG5QqByiKmhlw1ID6b4pQ261De314dzlcvLmSQ_1ntnlNfNAd9KosuI7XgPwdch0jmAZkKSSkFA2MD7LweXIB7Ddz7w6dsiNldAK-qwI-tF9f195SJg94M5CIFnMiTVVz_2uNWupR28D4gXQFT__uujtLcN67nm5KPGwjKUwjeieBXK_FiGP4LNJYdYN0A1KvzzasYOA' },
  { cat: 'Soft Glam', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBXR-_KAqQ6CnkTKhE-TFL2PIrqdPqvoaLZgvZyz43bnNcCi74-YbbYdjBVsU1CZjos-O32JhAPwIdbTldvMAOkdYylRTRprSogw71xzhLt5n472iYYQ6BjSGozVc6bz5gevDHVemx5PiVSXnTx3GU-3gPPR8wkadZsNH7XcaiOScFREq8d635yePhR7hDNNf1PYKxBCotPz_xz9OPGtLATx5FKZDeiWI448GbgxzNGnCGiqdHZjGSZ_puY02hM4IibMYJecI2utQ' },
  { cat: 'Bridal', img: 'https://picsum.photos/800/1200?random=1' },
  { cat: 'Full Glam', img: 'https://picsum.photos/800/1000?random=2' },
  { cat: 'Editorial', img: 'https://picsum.photos/800/900?random=3' },
  { cat: 'Bridal', img: 'https://picsum.photos/800/1100?random=4' },
  { cat: 'Soft Glam', img: 'https://picsum.photos/800/800?random=5' }
];

// Router Logic
function navigate() {
  const hash = window.location.hash || '#/';
  const pages = document.querySelectorAll('[data-page]');
  const navLinks = document.querySelectorAll('.nav-link');
  
  pages.forEach(p => p.classList.remove('active'));
  navLinks.forEach(l => l.classList.remove('text-accent', 'border-b', 'border-accent', 'pb-1'));

  if (hash.startsWith('#/')) {
    let pageId = hash.split('/')[1] || 'home';
    if (pageId.includes('?')) pageId = pageId.split('?')[0];
    
    const targetPage = document.querySelector(`[data-page="${pageId}"]`);
    if (targetPage) targetPage.classList.add('active');

    // Special handling for classes section anchor
    if (hash === '#/classes') {
      const homePage = document.querySelector(`[data-page="home"]`);
      if (homePage) homePage.classList.add('active');
      const section = document.getElementById('classes-section');
      if (section) section.scrollIntoView({ behavior: 'smooth' });
    }

    // Highlighting current nav link
    const currentLink = document.querySelector(`a[href="#/${pageId}"]`);
    if (currentLink) currentLink.classList.add('text-accent', 'border-b', 'border-accent', 'pb-1');
  }

  // Pre-fill booking if query exists
  const urlParams = new URLSearchParams(window.location.hash.split('?')[1]);
  const serviceParam = urlParams.get('service');
  if (serviceParam) {
    const serviceSelect = document.getElementById('form-service');
    if (serviceSelect) {
      serviceSelect.value = serviceParam;
      updateBookingSummary();
    }
  }

  window.scrollTo(0, 0);
  initReveal();
  
  if (window.lucide) {
    window.lucide.createIcons();
  }
}

function initReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('visible');
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

function updateBookingSummary() {
  const serviceEl = document.getElementById('form-service');
  if (!serviceEl) return;
  const service = serviceEl.value;
  const data = SERVICE_DATA[service];
  const nameEl = document.getElementById('summary-service-name');
  const priceEl = document.getElementById('summary-total-price');
  const depositEl = document.getElementById('summary-deposit-amount');
  
  if (nameEl) nameEl.innerText = service;
  if (priceEl) priceEl.innerText = data.label;
  if (depositEl) depositEl.innerText = 'R ' + (data.price / 2);
}

function renderPortfolio(filter) {
  const categories = ['All', 'Soft Glam', 'Full Glam', 'Bridal', 'Editorial'];
  const filtersCont = document.getElementById('portfolio-filters');
  const gridCont = document.getElementById('portfolio-grid');

  if (filtersCont) {
    filtersCont.innerHTML = categories.map(cat => `
      <button onclick="renderPortfolio('${cat}')" class="px-6 py-2 rounded-full text-[10px] uppercase tracking-widest font-bold transition-all border ${filter === cat ? 'bg-primary text-white border-primary dark:bg-stone-100 dark:text-primary' : 'bg-white dark:bg-neutral-900 text-primary dark:text-stone-400 border-stone-200 dark:border-neutral-800'}">${cat}</button>
    `).join('');
  }

  const items = filter === 'All' ? GALLERY_DATA : GALLERY_DATA.filter(i => i.cat === filter);
  if (gridCont) {
    gridCont.innerHTML = items.map((item, idx) => `
      <div class="masonry-item reveal group relative overflow-hidden rounded-2xl bg-stone-200 dark:bg-neutral-800" style="transition-delay: ${idx * 50}ms">
        <img src="${item.img}" class="w-full h-auto transform group-hover:scale-105 transition-transform duration-1000 grayscale hover:grayscale-0" />
        <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-6">
          <span class="text-accent text-[10px] uppercase tracking-[0.2em] mb-1">${item.cat}</span>
          <h3 class="text-white font-display text-xl">Signature Look</h3>
        </div>
      </div>
    `).join('');
    initReveal();
  }
}

// Expose globally
window.renderPortfolio = renderPortfolio;
window.updateBookingSummary = updateBookingSummary;

// Initialization
document.addEventListener('DOMContentLoaded', () => {
  // Theme Toggle
  const toggleBtn = document.getElementById('theme-toggle');
  const toggleBtnMob = document.getElementById('theme-toggle-mobile');
  
  const handleTheme = () => {
    document.documentElement.classList.toggle('dark');
    const isDark = document.documentElement.classList.contains('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    if (window.lucide) window.lucide.createIcons();
  };
  
  if (toggleBtn) toggleBtn.onclick = handleTheme;
  if (toggleBtnMob) toggleBtnMob.onclick = handleTheme;

  if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark');
  }

  // Mobile Menu
  const menuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  if (menuBtn && mobileMenu) {
    menuBtn.onclick = () => mobileMenu.classList.toggle('hidden');
  }

  // Home Page Services Rendering
  const servicesGrid = document.getElementById('services-grid');
  const services = [
    { title: 'Soft Glam', price: 'R 500', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD0lSiJUmzElG5GSAwy-uXhnKLx7X6acmFKqwMj9zhkQoPR7ivN-rBMF7HpBOBjHLogcc7tScleHbNmNpwOeqb9fxnJm7PPMxKZ9S23ptfBbqXt-jElMlCpcnBSGO8wiW72K1KY8ColzmXCbm3bZ-_ET5df04OCkRGcudrk8fUF3cEW6PhSF95bRjTNWEmyAY7LJrAAMXM72U1XeHoj-9mj7lCm4UlpyXGnyRHDLQRo8PxkITsfa3NAx3F1Pup0j8_FWTB8gt-jxw' },
    { title: 'Full Glam', price: 'R 600', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC-gH9-K5WG_DrK3IWP7hHzDjjhlHd0b_z2Y0eThhgyMxcJMU8V_TCOmCEvefVoFcm8jJ0ZTC4YqhL32aBLpVzn15CIZQNbE-PlzfDUZVL30tvhdKPzYkNw2-Pw0FpCe34ilY1EwQwST3Qu6g9OEda_r16H66adBohQZtvPekJflfvYN6UA2OwDkZ-xKa5tXIY7YJAxNNGFC3S33KWF3iZvWu9Ae_gDeTvKPL5_7FJidnDM21r4BnnHGoXHu8D2jpDj_CvZlBkXzw' },
    { title: 'Graduation Makeup', price: 'R 550', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBXR-_KAqQ6CnkTKhE-TFL2PIrqdPqvoaLZgvZyz43bnNcCi74-YbbYdjBVsU1CZjos-O32JhAPwIdbTldvMAOkdYylRTRprSogw71xzhLt5n472iYYQ6BjSGozVc6bz5gevDHVemx5PiVSXnTx3GU-3gPPR8wkadZsNH7XcaiOScFREq8d635yePhR7hDNNf1PYKxBCotPz_xz9OPGtLATx5FKZDeiWI448GbgxzNGnCGiqdHZjGSZ_puY02hM4IibMYJecI2utQ' },
    { title: 'Bridal Artistry', price: 'R 1500', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA4J981hwpeBT4POLaehd6KIXjMNOSIW-77NgvajNqMukRgGL3fdFaNKGl3K-RLPtpVRKDG5QqByiKmhlw1ID6b4pQ261De314dzlcvLmSQ_1ntnlNfNAd9KosuI7XgPwdch0jmAZkKSSkFA2MD7LweXIB7Ddz7w6dsiNldAK-qwI-tF9f195SJg94M5CIFnMiTVVz_2uNWupR28D4gXQFT__uujtLcN67nm5KPGwjKUwjeieBXK_FiGP4LNJYdYN0A1KvzzasYOA' }
  ];

  if (servicesGrid) {
    servicesGrid.innerHTML = services.map((s, i) => `
      <div class="reveal" style="transition-delay: ${i * 100}ms">
        <div class="relative aspect-[4/5] overflow-hidden rounded-2xl mb-6 shadow-lg group">
          <img src="${s.img}" class="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" />
          <div class="absolute inset-0 bg-black/20 group-hover:bg-black/40"></div>
          <div class="absolute bottom-6 left-6 text-white"><h3 class="font-display text-xl">${s.title}</h3><p class="text-[10px] opacity-80 mt-1 uppercase tracking-widest">${s.price}</p></div>
        </div>
        <a href="#/booking?service=${encodeURIComponent(s.title)}" class="block w-full text-center py-3 bg-stone-100 dark:bg-neutral-800 text-[10px] uppercase font-bold tracking-widest hover:bg-primary hover:text-white dark:hover:bg-stone-100 dark:hover:text-primary transition-all rounded-xl">Book Now</a>
      </div>
    `).join('');
  }

  // Portfolio Preview on Home
  const portfolioPreview = document.getElementById('home-portfolio-preview');
  if (portfolioPreview) {
    portfolioPreview.innerHTML = [1, 2, 3, 4].map(i => `
      <div class="aspect-square overflow-hidden rounded-xl group reveal" style="transition-delay: ${i * 100}ms">
        <img src="https://picsum.photos/600/600?random=${i + 10}" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
      </div>
    `).join('');
  }

  // Portfolio Logic
  renderPortfolio('All');

  // Booking Form Setup
  const serviceSelect = document.getElementById('form-service');
  if (serviceSelect) serviceSelect.onchange = updateBookingSummary;

  const locBtns = document.querySelectorAll('.loc-btn');
  locBtns.forEach(btn => {
    btn.onclick = () => {
      locBtns.forEach(b => {
        b.classList.remove('bg-primary', 'text-white', 'border-primary', 'dark:bg-stone-100', 'dark:text-primary');
        b.classList.add('bg-stone-50', 'dark:bg-neutral-950', 'text-slate-500', 'border-stone-200', 'dark:border-neutral-800');
      });
      btn.classList.add('bg-primary', 'text-white', 'border-primary', 'dark:bg-stone-100', 'dark:text-primary');
      btn.classList.remove('bg-stone-50', 'dark:bg-neutral-950', 'text-slate-500', 'border-stone-200', 'dark:border-neutral-800');
      window.selectedLocation = btn.getAttribute('data-loc');
    };
  });
  window.selectedLocation = 'At Studio';

  const bookingForm = document.getElementById('booking-form');
  if (bookingForm) {
    bookingForm.onsubmit = (e) => {
      e.preventDefault();
      const name = document.getElementById('form-name').value;
      const phone = document.getElementById('form-phone').value;
      const service = document.getElementById('form-service').value;
      const message = document.getElementById('form-message').value;
      const currentS = SERVICE_DATA[service];
      const deposit = currentS.price / 2;

      const text = `*NEW BOOKING REQUEST*\n✨ *Artistry by Kwanda* ✨\n\n*CLIENT DETAILS:*\n👤 Name: ${name}\n📱 Phone: ${phone}\n\n*SERVICE:*\n💄 Service: ${service}\n💰 Total: ${currentS.label}\n💳 *50% Deposit: R ${deposit}*\n\n*LOGISTICS:*\n📍 Location: ${window.selectedLocation}\n\n*NOTES:*\n📝 ${message}\n\n--- Acknowledgement of non-refundable deposit.`;
      window.open(`https://wa.me/27646501742?text=${encodeURIComponent(text)}`, '_blank');
    };
  }

  window.onhashchange = navigate;
  navigate();
});
