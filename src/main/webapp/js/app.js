/**
 * Filmee - UI Application Controller (Integrated with Java REST Backend)
 */
const I18N = {
  en: {
    navDiscover: "Discover",
    navMovies: "Movies",
    navTickets: "My Tickets",
    navAdmin: "Admin Panel",
    searchPlaceholder: "Search movies, genre, actor...",
    allMovies: "All Movies",
    marathiMovies: "Marathi Movies",
    cartoonMovies: "Cartoon & Doraemon",
    animeMovies: "Anime Movies",
    hindiMovies: "Hindi Movies",
    englishMovies: "English Movies",
    action: "Action",
    scifi: "Sci-Fi",
    fantasy: "Fantasy",
    horror: "Horror & Comedy",
    drama: "Drama",
    nowShowingTitle: "Now Showing in Cinemas",
    nowShowingSubtitle: "Catch the biggest blockbusters on the giant screen today",
    tabNowShowing: "Now Showing",
    tabUpcoming: "Coming Soon",
    feature1Title: "Live Interactive Seating",
    feature1Desc: "Select your favorite recliner or standard seats in real-time",
    feature2Title: "Instant Digital E-Tickets",
    feature2Desc: "Get instant barcode & QR verification right after booking",
    feature3Title: "Zero Payment Friction",
    feature3Desc: "Seamless simulated checkout supporting cards, UPI, and wallets",
    backToMovies: "Back to Movies",
    selectDateTime: "1. Select Date & Showtime",
    liveAuditoriums: "Live Auditoriums",
    bookTicketsNow: "Book Tickets Now",
    moreDetails: "More Details",
    bookNowBtn: "Book Now",
    detailsBtn: "Details",
    screenLabel: "CINEMA SCREEN THIS WAY",
    proceedCheckout: "Proceed to Checkout",
    langNextText: "हिंदी",
    toastSwitchedLang: "Language switched to English",
    toastThemeDark: "Cinema Dark Mode active",
    toastThemeLight: "Cinema Light Mode active"
  },
  hi: {
    navDiscover: "खोजें",
    navMovies: "फ़िल्में",
    navTickets: "मेरे टिकट",
    navAdmin: "एडमिन पैनल",
    searchPlaceholder: "फ़िल्में, शैली, कलाकार खोजें...",
    allMovies: "सभी फ़िल्में",
    marathiMovies: "मराठी फ़िल्में",
    cartoonMovies: "कार्टून व डोरेमोन",
    animeMovies: "एनीमे फ़िल्में",
    hindiMovies: "हिंदी फ़िल्में",
    englishMovies: "अंग्रेज़ी फ़िल्में",
    action: "एक्शन",
    scifi: "साइ-फाइ",
    fantasy: "फैंटेसी",
    horror: "हॉरर व कॉमेडी",
    drama: "ड्रामा",
    nowShowingTitle: "सिनेमाघरों में अभी चल रही हैं",
    nowShowingSubtitle: "आज ही बड़े पर्दे पर सबसे बड़ी ब्लॉकबस्टर फ़िल्मों का आनंद लें",
    tabNowShowing: "अभी चल रही हैं",
    tabUpcoming: "जल्द आ रही हैं",
    feature1Title: "लाइव सीट चयन",
    feature1Desc: "रीयल-टाइम में अपनी पसंदीदा रिक्लाइनर या सामान्य सीट चुनें",
    feature2Title: "त्वरित डिजिटल ई-टिकट",
    feature2Desc: "बुकिंग के तुरंत बाद बारकोड और क्यूआर सत्यापन प्राप्त करें",
    feature3Title: "आसान व सुरक्षित भुगतान",
    feature3Desc: "कार्ड, यूपीआई और वॉलेट द्वारा तुरंत टिकट पुष्टि",
    backToMovies: "फ़िल्मों पर वापस जाएं",
    selectDateTime: "1. दिनांक और शो का समय चुनें",
    liveAuditoriums: "लाइव स्क्रीन",
    bookTicketsNow: "टिकट बुक करें",
    moreDetails: "अधिक विवरण",
    bookNowBtn: "बुक करें",
    detailsBtn: "विवरण",
    screenLabel: "सिनेमा स्क्रीन इस तरफ है",
    proceedCheckout: "भुगतान के लिए आगे बढ़ें",
    langNextText: "English",
    toastSwitchedLang: "भाषा बदलकर हिंदी कर दी गई है",
    toastThemeDark: "सिनेमा डार्क मोड सक्रिय",
    toastThemeLight: "सिनेमा लाइट मोड सक्रिय"
  }
};

const app = {
  currentView: "home",
  activeCity: "Thane",
  selectedGenre: "ALL",
  movieTab: "NOW_SHOWING",
  searchQuery: "",
  currentTheme: "dark",
  currentLanguage: "en",

  // Active Booking Flow State
  selectedMovie: null,
  selectedDate: null,
  selectedShow: null,
  selectedSeats: [],
  holdTimerInterval: null,
  secondsLeft: 300,

  // Admin Active Tab
  currentAdminTab: "overview",

  async init() {
    Storage.init();

    // Initialize Theme & Language
    this.initTheme();
    this.initLanguage();

    // Check active session from Java backend
    try {
      if (typeof ApiClient !== "undefined") {
        const sessionRes = await ApiClient.auth.getMe();
        if (sessionRes && sessionRes.success && sessionRes.data) {
          Storage.setCurrentUser(sessionRes.data);
        }
      }
    } catch (e) {
      console.log("Local standalone mode active.");
    }

    this.renderNavbarAuth();
    this.renderHeroCarousel();
    this.renderGenreChips();
    this.renderMovies();
    this.setupDateRibbon();
    this.attachEventListeners();
    console.log("🎬 Filmee Full-Stack UI Integration Initialized.");
  },

  // ==================== THEME & LOCALIZATION ====================
  initTheme() {
    const savedTheme = localStorage.getItem("filmee_theme") || "dark";
    this.setTheme(savedTheme, false);
  },

  toggleTheme() {
    const newTheme = this.currentTheme === "dark" ? "light" : "dark";
    this.setTheme(newTheme, true);
  },

  setTheme(theme, showNotice = true) {
    this.currentTheme = theme;
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("filmee_theme", theme);

    const icon = document.getElementById("themeIcon");
    if (icon) {
      if (theme === "light") {
        icon.className = "fa-solid fa-moon text-gold";
      } else {
        icon.className = "fa-solid fa-sun text-gold";
      }
    }

    if (showNotice) {
      const t = I18N[this.currentLanguage] || I18N.en;
      this.showToast(theme === "dark" ? t.toastThemeDark : t.toastThemeLight, "info");
    }
  },

  initLanguage() {
    const savedLang = localStorage.getItem("filmee_lang") || "en";
    this.setLanguage(savedLang, false);
  },

  toggleLanguage() {
    const nextLang = this.currentLanguage === "en" ? "hi" : "en";
    this.setLanguage(nextLang, true);
  },

  setLanguage(lang, showNotice = true) {
    this.currentLanguage = lang;
    localStorage.setItem("filmee_lang", lang);
    this.applyLanguage();

    if (showNotice) {
      const t = I18N[lang] || I18N.en;
      this.showToast(t.toastSwitchedLang, "success");
    }
  },

  applyLanguage() {
    const t = I18N[this.currentLanguage] || I18N.en;

    // Language toggle button text
    const langBtnText = document.getElementById("langBtnText");
    if (langBtnText) langBtnText.textContent = t.langNextText;

    // Navigation links
    const navHome = document.getElementById("nav-home");
    if (navHome) navHome.innerHTML = `<i class="fa-solid fa-compass"></i> ${t.navDiscover}`;

    const navMovies = document.getElementById("nav-movies");
    if (navMovies) navMovies.innerHTML = `<i class="fa-solid fa-clapperboard"></i> ${t.navMovies}`;

    const navBookings = document.getElementById("nav-bookings");
    if (navBookings) navBookings.innerHTML = `<i class="fa-solid fa-ticket"></i> ${t.navTickets}`;

    const navAdmin = document.getElementById("nav-admin");
    if (navAdmin) navAdmin.innerHTML = `<i class="fa-solid fa-shield-halved"></i> ${t.navAdmin}`;

    // Search input placeholder
    const searchInput = document.getElementById("globalSearchInput");
    if (searchInput) searchInput.placeholder = t.searchPlaceholder;

    // Tab pills
    const pillNowShowing = document.getElementById("pill-now-showing");
    if (pillNowShowing) pillNowShowing.textContent = t.tabNowShowing;

    const pillUpcoming = document.getElementById("pill-upcoming");
    if (pillUpcoming) pillUpcoming.textContent = t.tabUpcoming;

    // Section title & subtitle
    const secTitle = document.querySelector("#view-home .section-title");
    if (secTitle) secTitle.innerHTML = `<i class="fa-solid fa-fire text-accent"></i> ${t.nowShowingTitle}`;

    const secSub = document.querySelector("#view-home .section-subtitle");
    if (secSub) secSub.textContent = t.nowShowingSubtitle;

    // Features banner
    const featureItems = document.querySelectorAll(".features-banner .feature-item");
    if (featureItems.length >= 3) {
      featureItems[0].querySelector("h4").textContent = t.feature1Title;
      featureItems[0].querySelector("p").textContent = t.feature1Desc;

      featureItems[1].querySelector("h4").textContent = t.feature2Title;
      featureItems[1].querySelector("p").textContent = t.feature2Desc;

      featureItems[2].querySelector("h4").textContent = t.feature3Title;
      featureItems[2].querySelector("p").textContent = t.feature3Desc;
    }

    // Refresh genre filter chips with active language
    this.renderGenreChips();

    // Refresh hero and movies view
    this.renderHeroCarousel();
    this.renderMovies();
  },

  renderGenreChips() {
    const bar = document.getElementById("genreFilterBar");
    if (!bar) return;
    const t = I18N[this.currentLanguage] || I18N.en;
    const chips = [
      { key: "ALL", label: t.allMovies, icon: "" },
      { key: "Marathi", label: t.marathiMovies, icon: '<i class="fa-solid fa-masks-theater text-gold"></i> ' },
      { key: "Cartoon", label: t.cartoonMovies, icon: '<i class="fa-solid fa-wand-magic-sparkles text-orange"></i> ' },
      { key: "Anime", label: t.animeMovies, icon: '<i class="fa-solid fa-dragon text-gold"></i> ' },
      { key: "Hindi", label: t.hindiMovies, icon: '<i class="fa-solid fa-film text-gold"></i> ' },
      { key: "English", label: t.englishMovies, icon: '<i class="fa-solid fa-globe text-orange"></i> ' },
      { key: "Action", label: t.action, icon: "" },
      { key: "Sci-Fi", label: t.scifi, icon: "" },
      { key: "Fantasy", label: t.fantasy, icon: "" },
      { key: "Horror", label: t.horror, icon: "" },
      { key: "Drama", label: t.drama, icon: "" }
    ];

    bar.innerHTML = chips.map(c => `
      <button class="chip ${this.selectedGenre.toUpperCase() === c.key.toUpperCase() ? 'active' : ''}" 
              onclick="app.filterByGenre('${c.key}')">
        ${c.icon}${c.label}
      </button>
    `).join("");
  },

  // ==================== NAVIGATION & ROUTING ====================
  navigateTo(viewName) {
    this.currentView = viewName;
    document.querySelectorAll(".app-view").forEach(el => el.classList.remove("active"));
    document.querySelectorAll(".nav-link").forEach(el => el.classList.remove("active"));

    const targetView = document.getElementById(`view-${viewName}`);
    if (targetView) targetView.classList.add("active");

    const activeNav = document.getElementById(`nav-${viewName}`);
    if (activeNav) activeNav.classList.add("active");

    window.scrollTo({ top: 0, behavior: "smooth" });

    if (viewName === "home") {
      this.renderMovies();
    } else if (viewName === "my-bookings") {
      this.renderMyBookings();
    } else if (viewName === "admin") {
      this.renderAdminPanel();
    }
  },

  onCityChange(city) {
    this.activeCity = city;
    this.showToast(`Switched city to ${city}`, "info");
    this.renderMovies();
  },

  // ==================== AUTHENTICATION ====================
  renderNavbarAuth() {
    const wrapper = document.getElementById("authWrapper");
    const user = Storage.getCurrentUser();

    if (user) {
      wrapper.innerHTML = `
        <div class="user-badge">
          <div class="user-avatar">${user.fullName ? user.fullName.charAt(0) : 'U'}</div>
          <span style="font-size: 0.9rem; font-weight: 600;">${user.fullName ? user.fullName.split(" ")[0] : 'User'}</span>
        </div>
        <button class="btn-xs" style="margin-left: 8px;" onclick="app.logoutUser()" title="Logout">
          <i class="fa-solid fa-arrow-right-from-bracket"></i>
        </button>
      `;
    } else {
      wrapper.innerHTML = `
        <button class="btn btn-primary" onclick="app.openAuthModal('login')">
          <i class="fa-solid fa-user"></i> Sign In
        </button>
      `;
    }
  },

  openAuthModal(tab = "login") {
    this.switchAuthForm(tab);
    document.getElementById("authModal").classList.add("active");
  },

  closeModal(modalId) {
    document.getElementById(modalId).classList.remove("active");
  },

  switchAuthForm(tab) {
    document.querySelectorAll(".auth-tab-btn").forEach(b => b.classList.remove("active"));
    document.querySelectorAll(".auth-form").forEach(f => f.classList.remove("active"));

    if (tab === "login") {
      document.getElementById("tab-login").classList.add("active");
      document.getElementById("formLogin").classList.add("active");
    } else {
      document.getElementById("tab-register").classList.add("active");
      document.getElementById("formRegister").classList.add("active");
    }
  },

  fillDemoCredentials(role) {
    if (role === "admin") {
      document.getElementById("loginEmail").value = "admin@filmee.com";
      document.getElementById("loginPassword").value = "admin";
    } else {
      document.getElementById("loginEmail").value = "soham@example.com";
      document.getElementById("loginPassword").value = "user123";
    }
  },

  async handleLoginSubmit(e) {
    e.preventDefault();
    const email = document.getElementById("loginEmail").value.trim();
    const pass = document.getElementById("loginPassword").value;

    let user = null;

    if (typeof ApiClient !== "undefined") {
      const res = await ApiClient.auth.login(email, pass);
      if (res && res.success && res.data) {
        user = res.data;
      }
    }

    if (!user) {
      const users = Storage.getUsers();
      user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === pass);
    }

    if (user) {
      Storage.setCurrentUser(user);
      this.renderNavbarAuth();
      this.closeModal("authModal");
      this.showToast(`Welcome back, ${user.fullName}!`, "success");

      if (user.role === "ADMIN") {
        this.navigateTo("admin");
      }
    } else {
      this.showToast("Invalid email or password.", "error");
    }
  },

  async handleRegisterSubmit(e) {
    e.preventDefault();
    const name = document.getElementById("regName").value.trim();
    const email = document.getElementById("regEmail").value.trim();
    const phone = document.getElementById("regPhone").value.trim();
    const pass = document.getElementById("regPassword").value;

    let user = null;

    if (typeof ApiClient !== "undefined") {
      const res = await ApiClient.auth.register(name, email, pass, phone);
      if (res && res.success && res.data) {
        user = res.data;
      }
    }

    if (!user) {
      const users = Storage.getUsers();
      if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
        this.showToast("Email address already registered.", "error");
        return;
      }
      user = Storage.addUser({ fullName: name, email, phone, password: pass, role: "CUSTOMER" });
    }

    Storage.setCurrentUser(user);
    this.renderNavbarAuth();
    this.closeModal("authModal");
    this.showToast("Account successfully registered!", "success");
  },

  async logoutUser() {
    if (typeof ApiClient !== "undefined") {
      await ApiClient.auth.logout();
    }
    Storage.logout();
    this.renderNavbarAuth();
    this.navigateTo("home");
    this.showToast("Logged out successfully.", "info");
  },

  // ==================== DISCOVERY & MOVIES ====================
  featuredHeroIndex: 0,
  featuredTimer: null,

  renderHeroCarousel() {
    const movies = Storage.getMovies();
    if (!movies || movies.length === 0) return;
    
    // Choose top featured movies (including blockbuster Anime and Hindi/English hits)
    const featuredList = movies.slice(0, 5);
    const featured = featuredList[this.featuredHeroIndex % featuredList.length];
    if (!featured) return;

    const slideEl = document.getElementById("featuredSlide");
    slideEl.className = "featured-card";

    const t = I18N[this.currentLanguage] || I18N.en;

    slideEl.innerHTML = `
      <img class="featured-bg-img" 
           src="${featured.backdropUrl || featured.posterUrl}" 
           alt="${featured.title}" 
           referrerpolicy="no-referrer" 
           onerror="if (this.src !== '${featured.posterUrl}') { this.src = '${featured.posterUrl}'; } else { app.handlePosterError(this, '${encodeURIComponent(featured.title)}', '${encodeURIComponent(featured.genre)}', '${featured.rating}'); }" />
      <div class="featured-overlay"></div>
      <div class="featured-content">
        <span class="tag-badge badge-gold"><i class="fa-solid fa-sparkles"></i> ${this.currentLanguage === 'hi' ? 'विशेष प्रीमियर • आधिकारिक' : 'Featured Premiere • Official'}</span>
        <h1 class="featured-title">${featured.title}</h1>
        <div class="featured-meta">
          <span><i class="fa-solid fa-star text-accent"></i> ${featured.rating || '9.5'} / 10</span>
          <span>•</span>
          <span><i class="fa-regular fa-clock"></i> ${featured.durationMinutes} min</span>
          <span>•</span>
          <span>${featured.genre}</span>
        </div>
        <p class="featured-desc">${(featured.description || "").substring(0, 200)}...</p>
        <div class="featured-actions">
          <button class="btn btn-primary" onclick="app.openMovieDetails(${featured.movieId})">
            <i class="fa-solid fa-ticket"></i> ${t.bookTicketsNow}
          </button>
          <button class="btn btn-secondary" onclick="app.openMovieDetails(${featured.movieId})">
            <i class="fa-solid fa-circle-info"></i> ${t.moreDetails}
          </button>
        </div>
      </div>
    `;

    // Render indicators
    const indContainer = document.getElementById("carouselIndicators");
    if (indContainer) {
      indContainer.innerHTML = featuredList.map((m, idx) => `
        <div class="carousel-dot ${idx === (this.featuredHeroIndex % featuredList.length) ? 'active' : ''}" 
             onclick="app.setFeaturedSlide(${idx})" title="${m.title}"></div>
      `).join("");
    }

    if (!this.featuredTimer) {
      this.featuredTimer = setInterval(() => {
        const mv = Storage.getMovies();
        if (mv && mv.length > 0) {
          app.featuredHeroIndex = (app.featuredHeroIndex + 1) % Math.min(5, mv.length);
          app.renderHeroCarousel();
        }
      }, 6000);
    }
  },

  setFeaturedSlide(idx) {
    this.featuredHeroIndex = idx;
    this.renderHeroCarousel();
  },

  filterByGenre(genre) {
    this.selectedGenre = genre;
    this.renderGenreChips();
    this.renderMovies();
  },

  switchMovieTab(tab) {
    this.movieTab = tab;
    document.getElementById("pill-now-showing").classList.toggle("active", tab === "NOW_SHOWING");
    document.getElementById("pill-upcoming").classList.toggle("active", tab === "UPCOMING");
    this.renderMovies();
  },

  handleSearch(query) {
    this.searchQuery = query.toLowerCase().trim();
    this.renderMovies();
  },

  async renderMovies() {
    const grid = document.getElementById("movieGrid");
    let movies = [];

    if (typeof ApiClient !== "undefined") {
      const res = await ApiClient.movies.getAll(this.searchQuery, this.selectedGenre);
      if (res && res.success && Array.isArray(res.data) && res.data.length > 0) {
        movies = res.data;
      }
    }

    if (movies.length === 0) {
      movies = Storage.getMovies();
      movies = movies.filter(m => m.status === this.movieTab);
      if (this.selectedGenre !== "ALL") {
        const filterKey = this.selectedGenre.toLowerCase();
        if (filterKey === "cartoon") {
          movies = movies.filter(m =>
            (m.genre && (m.genre.toLowerCase().includes("cartoon") || m.genre.toLowerCase().includes("animation") || m.genre.toLowerCase().includes("doraemon") || m.genre.toLowerCase().includes("kids"))) ||
            (m.title && (m.title.toLowerCase().includes("doraemon") || m.title.toLowerCase().includes("shinchan") || m.title.toLowerCase().includes("bheem") || m.title.toLowerCase().includes("panda")))
          );
        } else if (filterKey === "marathi") {
          movies = movies.filter(m =>
            (m.genre && m.genre.toLowerCase().includes("marathi")) ||
            (m.language && m.language.toLowerCase().includes("marathi"))
          );
        } else {
          movies = movies.filter(m =>
            (m.genre && m.genre.toLowerCase().includes(filterKey)) ||
            (m.language && m.language.toLowerCase().includes(filterKey))
          );
        }
      }
      if (this.searchQuery) {
        movies = movies.filter(m =>
          (m.title && m.title.toLowerCase().includes(this.searchQuery)) ||
          (m.genre && m.genre.toLowerCase().includes(this.searchQuery)) ||
          (m.language && m.language.toLowerCase().includes(this.searchQuery)) ||
          (m.cast && m.cast.toLowerCase().includes(this.searchQuery)) ||
          (m.director && m.director.toLowerCase().includes(this.searchQuery))
        );
      }
    }

    if (movies.length === 0) {
      grid.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 60px 20px; color: var(--text-muted);">
          <i class="fa-solid fa-film-slash fa-3x" style="margin-bottom: 16px; color: var(--accent-orange);"></i>
          <h3>No movies found</h3>
          <p>Try adjusting your search query or category filter.</p>
        </div>
      `;
      return;
    }

    const t = I18N[this.currentLanguage] || I18N.en;

    grid.innerHTML = movies.map((movie, index) => `
      <div class="movie-card" style="--card-index: ${index};" onclick="app.openMovieDetails(${movie.movieId})" title="${movie.title}">
        <img class="movie-card-bg-img" 
             src="${movie.posterUrl}" 
             alt="${movie.title}" 
             referrerpolicy="no-referrer" 
             loading="lazy" 
             onerror="app.handlePosterError(this, '${encodeURIComponent(movie.title)}', '${encodeURIComponent(movie.genre)}', '${movie.rating}')" />
        <div class="movie-card-overlay"></div>
        
        <div class="movie-card-top">
          <span class="movie-lang-pill">${(movie.language || 'Hindi').split(",")[0]}</span>
          <div class="movie-badge-float">
            <i class="fa-solid fa-star"></i> ${movie.rating || '9.0'}
          </div>
        </div>

        <div class="movie-card-info">
          <h3 class="movie-title">${movie.title}</h3>
          <div class="movie-genre">${movie.genre}</div>
          <div class="movie-card-footer">
            <span class="movie-duration"><i class="fa-regular fa-clock"></i> ${movie.durationMinutes}m</span>
            <button class="btn-xs btn-book-action">
              ${movie.status === 'NOW_SHOWING' ? `<i class="fa-solid fa-ticket"></i> ${t.bookNowBtn}` : `<i class="fa-solid fa-info"></i> ${t.detailsBtn}`}
            </button>
          </div>
        </div>
      </div>
    `).join("");
  },

  // Dynamic aesthetic SVG fallback generator if any external poster URL fails
  handlePosterError(imgEl, rawTitle, rawGenre, rating) {
    if (!imgEl) return;
    if (imgEl.dataset.fallbackApplied) return;
    imgEl.dataset.fallbackApplied = "true";

    const title = decodeURIComponent(rawTitle || "Movie");
    const genre = decodeURIComponent(rawGenre || "Cinema");
    const rate = rating || "9.5";

    const svg = `
      <svg width="400" height="600" viewBox="0 0 400 600" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#3D1A04"/>
            <stop offset="35%" stop-color="#241408"/>
            <stop offset="70%" stop-color="#14141C"/>
            <stop offset="100%" stop-color="#0B0B0F"/>
          </linearGradient>
          <radialGradient id="centerGlow" cx="50%" cy="32%" r="65%">
            <stop offset="0%" stop-color="#FF7A00" stop-opacity="0.45"/>
            <stop offset="50%" stop-color="#FFB703" stop-opacity="0.15"/>
            <stop offset="100%" stop-color="#0B0B0F" stop-opacity="0"/>
          </radialGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#bgGrad)"/>
        <circle cx="200" cy="200" r="180" fill="url(#centerGlow)"/>
        <g transform="translate(150, 120)">
          <circle cx="50" cy="50" r="45" fill="none" stroke="#FFB703" stroke-width="3.5" stroke-dasharray="10 5"/>
          <circle cx="50" cy="50" r="32" fill="rgba(255,122,0,0.2)" stroke="#FF7A00" stroke-width="2"/>
          <circle cx="50" cy="50" r="16" fill="#FFB703" fill-opacity="0.8"/>
          <circle cx="50" cy="50" r="6" fill="#0B0B0F"/>
        </g>
        <text x="200" y="270" font-family="Cinzel, serif" font-weight="900" font-size="14" letter-spacing="6" fill="#FFB703" fill-opacity="0.6" text-anchor="middle">FILMEE CINEMAS</text>
        <text x="200" y="320" font-family="Outfit, sans-serif" font-weight="900" font-size="22" fill="#FFFFFF" text-anchor="middle">
          ${title.length > 20 ? title.substring(0, 18) + '...' : title}
        </text>
        <text x="200" y="355" font-family="Inter, sans-serif" font-weight="600" font-size="14" fill="#FFE082" text-anchor="middle">
          ${genre.split('/')[0]}
        </text>
        <rect x="135" y="385" width="130" height="34" rx="17" fill="rgba(255,122,0,0.3)" stroke="#FFB703" stroke-width="2"/>
        <text x="200" y="408" font-family="Outfit, sans-serif" font-weight="900" font-size="16" fill="#FFB703" text-anchor="middle">★ ${rate} / 10</text>
      </svg>
    `;
    imgEl.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg.trim());
  },

  // ==================== MOVIE DETAILS & SHOWTIMES ====================
  openMovieDetails(movieId) {
    const movie = Storage.getMovieById(movieId);
    if (!movie) return;

    this.selectedMovie = movie;
    this.selectedDate = new Date().toISOString().split("T")[0];

    const ratingVal = parseFloat(movie.rating) || 9.5;
    const fullStars = Math.floor(ratingVal / 2);
    const halfStar = (ratingVal % 2) >= 0.8;
    const votesCount = Math.floor(ratingVal * 4200 + (movie.movieId * 750));
    const audiencePct = Math.min(99, Math.round(ratingVal * 10 - 2));

    const heroContainer = document.getElementById("movieHeroInfo");
    heroContainer.innerHTML = `
      <div class="detail-poster">
        <img src="${movie.posterUrl}" 
             alt="${movie.title}" 
             referrerpolicy="no-referrer" 
             onerror="app.handlePosterError(this, '${encodeURIComponent(movie.title)}', '${encodeURIComponent(movie.genre)}', '${movie.rating}')" />
      </div>
      <div class="detail-body">
        <div class="detail-pills">
          <span class="badge badge-info"><i class="fa-solid fa-clapperboard"></i> ${movie.ageRating || 'UA 16+'}</span>
          <span class="badge" style="background: rgba(255,183,3,0.18); color: var(--accent-gold); border: 1.5px solid rgba(255,183,3,0.5); font-weight: 800;">
            <i class="fa-solid fa-star text-gold"></i> ${movie.rating || '9.5'} / 10
          </span>
          <span class="badge" style="background: var(--bg-surface-elevated); color: var(--text-secondary); border: 1px solid var(--border-light);">${movie.language}</span>
        </div>
        
        <h1 class="detail-title">${movie.title}</h1>
        
        <div class="featured-meta" style="margin-bottom: 12px;">
          <span><i class="fa-regular fa-clock text-accent"></i> ${movie.durationMinutes} mins</span>
          <span>•</span>
          <span><i class="fa-solid fa-film text-gold"></i> ${movie.genre}</span>
          <span>•</span>
          <span>Released ${movie.releaseDate || '2024'}</span>
        </div>

        <!-- Comprehensive Rating Showcase for Selected Movie -->
        <div class="rating-showcase-box">
          <div class="rating-primary-badge">
            <div class="rating-score-circle">${movie.rating || '9.5'}</div>
            <div class="rating-score-text">
              <h4>Critic & User Rating</h4>
              <div class="rating-stars-row">
                ${Array.from({ length: 5 }, (_, i) => `<i class="fa-solid fa-star${i < fullStars ? '' : (i === fullStars && halfStar ? '-half-stroke' : ' text-muted')}"></i>`).join("")}
              </div>
              <span class="rating-votes-count"><i class="fa-solid fa-users"></i> ${votesCount.toLocaleString()} verified ratings</span>
            </div>
          </div>

          <div class="rating-badges-cluster">
            <div class="metric-chip"><i class="fa-solid fa-fire text-orange"></i> <strong>${audiencePct}%</strong> Audience Score</div>
            <div class="metric-chip critic"><i class="fa-solid fa-award text-gold"></i> <strong>Filmee Certified Hit</strong></div>
          </div>

          <div class="user-rate-interactive-box">
            <span>Rate this movie:</span>
            <div class="user-stars-group" id="userRatingGroup">
              <i class="fa-regular fa-star" onclick="app.setUserRating(${movie.movieId}, 1)" title="1 / 5"></i>
              <i class="fa-regular fa-star" onclick="app.setUserRating(${movie.movieId}, 2)" title="2 / 5"></i>
              <i class="fa-regular fa-star" onclick="app.setUserRating(${movie.movieId}, 3)" title="3 / 5"></i>
              <i class="fa-regular fa-star" onclick="app.setUserRating(${movie.movieId}, 4)" title="4 / 5"></i>
              <i class="fa-regular fa-star" onclick="app.setUserRating(${movie.movieId}, 5)" title="5 / 5"></i>
            </div>
          </div>
        </div>

        <p class="detail-desc">${movie.description}</p>
        
        <div style="font-size: 0.9rem; color: var(--text-secondary); margin-bottom: 6px;">
          <strong class="text-gold">Director:</strong> ${movie.director || 'Christopher Nolan'}
        </div>
        <div style="font-size: 0.9rem; color: var(--text-secondary);">
          <strong class="text-gold">Starring:</strong> ${movie.cast || 'Lead Cast'}
        </div>
      </div>
    `;

    this.setupDateRibbon();
    this.renderTheatersAndShows();
    this.navigateTo("movie-details");
  },

  setUserRating(movieId, stars) {
    const starEls = document.querySelectorAll("#userRatingGroup i");
    starEls.forEach((el, idx) => {
      if (idx < stars) {
        el.className = "fa-solid fa-star";
        el.style.color = "#FFB703";
      } else {
        el.className = "fa-regular fa-star";
        el.style.color = "#8A8A93";
      }
    });
    this.showToast(`Thank you! You rated this movie ${stars * 2}/10 ★`, "success");
  },

  setupDateRibbon() {
    const container = document.getElementById("dateRibbon");
    const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    let html = "";
    const today = new Date();

    for (let i = 0; i < 6; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      const isoStr = d.toISOString().split("T")[0];
      const dayName = i === 0 ? "TODAY" : i === 1 ? "TOMORROW" : days[d.getDay()];
      const isSelected = isoStr === this.selectedDate;

      html += `
        <div class="date-card ${isSelected ? 'active' : ''}" onclick="app.selectDate('${isoStr}')">
          <span class="date-day">${dayName}</span>
          <span class="date-num">${d.getDate()}</span>
          <span style="font-size: 0.72rem; color: var(--text-muted);">${months[d.getMonth()]}</span>
        </div>
      `;
    }
    container.innerHTML = html;
  },

  selectDate(dateStr) {
    this.selectedDate = dateStr;
    this.setupDateRibbon();
    this.renderTheatersAndShows();
  },

  renderTheatersAndShows() {
    const container = document.getElementById("theatersShowList");
    if (!this.selectedMovie) return;

    const theaters = Storage.getTheaters();
    const shows = Storage.getShowsForMovie(this.selectedMovie.movieId, this.selectedDate);

    if (shows.length === 0) {
      container.innerHTML = `
        <div style="text-align: center; padding: 40px 20px; color: var(--text-muted); background: var(--bg-surface-elevated); border-radius: var(--radius-md);">
          <i class="fa-solid fa-calendar-xmark fa-2x" style="margin-bottom: 10px;"></i>
          <h4>No scheduled shows for this date</h4>
          <p>Please select another date above or check back shortly.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = theaters.map(theater => {
      const theaterShows = shows.filter(s => s.theaterId === theater.theaterId);
      if (theaterShows.length === 0) return "";

      return `
        <div class="theater-card">
          <div class="theater-header">
            <div>
              <div class="theater-name"><i class="fa-solid fa-location-dot text-accent"></i> ${theater.name}</div>
              <div class="theater-address">${theater.address}</div>
            </div>
            <span class="badge badge-info"><i class="fa-solid fa-sparkles"></i> 4K Laser</span>
          </div>

          <div class="showtimes-grid">
            ${theaterShows.map(s => {
              const screen = theater.screens.find(sc => sc.screenId === s.screenId) || { name: "Audi 1" };
              const formatBadge = screen.name.includes("IMAX") ? "IMAX 3D" : screen.name.includes("4DX") ? "4DX 3D" : screen.name.includes("VIP") ? "VIP Lounge" : "Dolby Atmos";
              return `
                <div class="showtime-pill" onclick="app.startSeatSelection(${s.showId})" title="Click to book ${s.startTime} in ${screen.name}">
                  <div class="showtime-pill-top">
                    <span class="showtime-time">${s.startTime}</span>
                    <span class="showtime-format-chip">${formatBadge}</span>
                  </div>
                  <span class="showtime-screen">${screen.name}</span>
                  ${s.slotType ? `<span class="showtime-type-label"><i class="fa-solid fa-sun-plant-wilt"></i> ${s.slotType}</span>` : ''}
                  <div class="showtime-prices">
                    <span>Std: <strong class="text-gold">₹${s.standardPrice}</strong></span>
                    <span>Prem: <strong class="text-orange">₹${s.premiumPrice}</strong></span>
                  </div>
                </div>
              `;
            }).join("")}
          </div>
        </div>
      `;
    }).join("");
  },

  // ==================== SEAT SELECTION ====================
  startSeatSelection(showId) {
    const show = Storage.getShowById(showId);
    if (!show) return;

    this.selectedShow = show;
    this.selectedSeats = [];

    const theater = Storage.getTheaters().find(t => t.theaterId === show.theaterId);
    const screen = theater?.screens.find(s => s.screenId === show.screenId);

    document.getElementById("seatHeaderInfo").innerHTML = `
      <div style="display: flex; align-items: center; gap: 12px; flex-wrap: wrap;">
        <h3 style="font-size: 1.35rem; font-weight: 800; color: #fff;">${this.selectedMovie.title}</h3>
        <span class="badge" style="background: rgba(255,183,3,0.18); color: #FFB703; border: 1.5px solid #FFB703; font-weight: 800;">
          <i class="fa-solid fa-star text-gold"></i> ${this.selectedMovie.rating || '9.5'} / 10
        </span>
      </div>
      <p style="font-size: 0.88rem; color: var(--text-secondary); margin-top: 4px;">
        <span class="text-orange"><i class="fa-solid fa-location-dot"></i> ${theater.name}</span> • ${screen.name} • ${show.showDate} at <strong class="text-gold">${show.startTime}</strong>
      </p>
    `;

    document.getElementById("legendStdPrice").textContent = show.standardPrice;
    document.getElementById("legendPremPrice").textContent = show.premiumPrice;

    this.renderSeatGrid(screen, show);
    this.updateSeatSummary();
    this.startHoldTimer();
    this.navigateTo("seat-selection");
  },

  backToShowSelection() {
    this.stopHoldTimer();
    this.navigateTo("movie-details");
  },

  renderSeatGrid(screen, show) {
    const container = document.getElementById("auditoriumGrid");
    const bookedSeats = Storage.getBookedSeats(show.showId);
    const rows = screen.rows || ["A", "B", "C", "D", "E", "F", "G", "H"];
    const cols = screen.cols || 10;
    const premiumRows = screen.premiumRows || ["A", "B"];

    let html = "";

    rows.forEach(row => {
      const isPremium = premiumRows.includes(row);
      const price = isPremium ? show.premiumPrice : show.standardPrice;
      const type = isPremium ? "PREMIUM" : "STANDARD";

      html += `<div class="seat-row">`;
      html += `<div class="row-label">${row}</div>`;

      for (let c = 1; c <= cols; c++) {
        const seatId = `${row}${c}`;
        const isBooked = bookedSeats.includes(seatId);
        const isSelected = this.selectedSeats.some(s => s.id === seatId);

        if (c === 5) html += `<div style="width: 24px;"></div>`;

        html += `
          <div 
            class="seat ${type.toLowerCase()} ${isBooked ? 'booked' : ''} ${isSelected ? 'selected' : ''}" 
            data-seat-id="${seatId}"
            data-row="${row}"
            data-num="${c}"
            data-type="${type}"
            data-price="${price}"
            onclick="app.toggleSeatSelect('${seatId}', '${row}', ${c}, '${type}', ${price}, this)"
            title="${type} Seat ${seatId} - ₹${price}"
          >
            ${c}
          </div>
        `;
      }

      html += `<div class="row-label">${row}</div>`;
      html += `</div>`;
    });

    container.innerHTML = html;
  },

  toggleSeatSelect(seatId, row, num, type, price, el) {
    if (el.classList.contains("booked")) {
      this.showToast(`Seat ${seatId} is already booked.`, "error");
      return;
    }

    const idx = this.selectedSeats.findIndex(s => s.id === seatId);
    if (idx !== -1) {
      this.selectedSeats.splice(idx, 1);
      el.classList.remove("selected");
    } else {
      if (this.selectedSeats.length >= 8) {
        this.showToast("You can select up to 8 seats.", "error");
        return;
      }
      this.selectedSeats.push({ id: seatId, row, num, type, price });
      el.classList.add("selected");
    }

    this.updateSeatSummary();
  },

  updateSeatSummary() {
    const count = this.selectedSeats.length;
    const subtotal = this.selectedSeats.reduce((sum, s) => sum + s.price, 0);

    document.getElementById("selectedSeatCount").textContent = count;
    document.getElementById("selectedTotalPrice").textContent = subtotal.toFixed(2);

    const seatListEl = document.getElementById("selectedSeatList");
    seatListEl.textContent = count > 0 ? this.selectedSeats.map(s => s.id).join(", ") : "No seats selected yet";

    document.getElementById("btnProceedToPay").disabled = count === 0;
  },

  startHoldTimer() {
    this.stopHoldTimer();
    this.secondsLeft = 300;
    const timerDisplay = document.getElementById("timerCountdown");

    this.holdTimerInterval = setInterval(() => {
      this.secondsLeft--;
      if (this.secondsLeft <= 0) {
        this.stopHoldTimer();
        this.showToast("Seat hold session expired.", "error");
        this.selectedSeats = [];
        this.updateSeatSummary();
        this.renderTheatersAndShows();
        this.navigateTo("movie-details");
      } else {
        const mins = String(Math.floor(this.secondsLeft / 60)).padStart(2, "0");
        const secs = String(this.secondsLeft % 60).padStart(2, "0");
        if (timerDisplay) timerDisplay.textContent = `${mins}:${secs}`;
      }
    }, 1000);
  },

  stopHoldTimer() {
    if (this.holdTimerInterval) {
      clearInterval(this.holdTimerInterval);
      this.holdTimerInterval = null;
    }
  },

  // ==================== CHECKOUT & PAYMENT ====================
  openCheckoutModal() {
    const user = Storage.getCurrentUser();
    if (!user) {
      this.showToast("Please sign in to proceed with payment.", "info");
      this.openAuthModal("login");
      return;
    }

    if (this.selectedSeats.length === 0) return;

    const subtotal = this.selectedSeats.reduce((sum, s) => sum + s.price, 0);
    const tax = subtotal * 0.18;
    const grandTotal = subtotal + tax;

    document.getElementById("chkMovieTitle").innerHTML = `${this.selectedMovie.title} <span class="badge" style="background: rgba(255,183,3,0.18); color: #FFB703; border: 1px solid #FFB703; font-size: 0.75rem; font-weight: 800; margin-left: 6px;"><i class="fa-solid fa-star text-gold"></i> ${this.selectedMovie.rating || '9.5'}</span>`;
    document.getElementById("chkAudiDate").textContent = `${this.selectedShow.showDate}`;
    document.getElementById("chkShowtime").textContent = `${this.selectedShow.startTime}`;
    document.getElementById("chkSeats").textContent = this.selectedSeats.map(s => s.id).join(", ");

    document.getElementById("chkSubtotal").textContent = subtotal.toFixed(2);
    document.getElementById("chkFee").textContent = tax.toFixed(2);
    document.getElementById("chkGrandTotal").textContent = grandTotal.toFixed(2);
    document.getElementById("btnPayAmount").textContent = grandTotal.toFixed(2);

    document.getElementById("checkoutModal").classList.add("active");
  },

  switchPaymentTab(tab) {
    document.querySelectorAll(".pay-tab").forEach(t => t.classList.remove("active"));
    document.querySelectorAll(".payment-view").forEach(v => v.classList.remove("active"));

    document.getElementById(`pay-tab-${tab}`).classList.add("active");
    document.getElementById(`pay-form-${tab}`).classList.add("active");
  },

  async processPayment() {
    const user = Storage.getCurrentUser();
    if (!user) return;

    const seatIds = this.selectedSeats.map(s => s.id);
    let booking = null;

    if (typeof ApiClient !== "undefined") {
      const res = await ApiClient.bookings.create(this.selectedShow.showId, seatIds, "DUMMY_GATEWAY");
      if (res && res.success && res.data) {
        booking = res.data;
      }
    }

    if (!booking) {
      const reserveResult = Storage.reserveSeats(this.selectedShow.showId, seatIds);
      if (!reserveResult.success) {
        this.closeModal("checkoutModal");
        this.showToast(reserveResult.message, "error");
        return;
      }

      const subtotal = this.selectedSeats.reduce((sum, s) => sum + s.price, 0);
      const tax = subtotal * 0.18;
      const theater = Storage.getTheaters().find(t => t.theaterId === this.selectedShow.theaterId);
      const screen = theater?.screens.find(s => s.screenId === this.selectedShow.screenId);

      booking = Storage.createBooking({
        userId: user.userId,
        showId: this.selectedShow.showId,
        movieId: this.selectedMovie.movieId,
        movieTitle: this.selectedMovie.title,
        theaterName: theater?.name || "Filmee Multiplex",
        screenName: screen?.name || "Audi 1",
        showDate: this.selectedShow.showDate,
        showTime: this.selectedShow.startTime,
        seats: seatIds,
        totalTickets: this.selectedSeats.length,
        subtotal: subtotal,
        tax: tax,
        grandTotal: subtotal + tax
      });
    }

    this.stopHoldTimer();
    this.closeModal("checkoutModal");
    this.showToast("🎉 Booking Confirmed! Ticket ready.", "success");
    this.showDigitalTicket(booking);
  },

  showDigitalTicket(booking) {
    const user = Storage.getCurrentUser();

    document.getElementById("tktMovieTitle").textContent = booking.movieTitle;
    document.getElementById("tktLanguageGenre").textContent = `${this.selectedMovie?.genre || 'Action'} • ${this.selectedMovie?.language || 'English'}`;
    document.getElementById("tktTheaterAudi").textContent = `${booking.theaterName} • ${booking.screenName}`;
    document.getElementById("tktDateTime").textContent = `${booking.showDate} • ${booking.showTime}`;
    document.getElementById("tktSeats").textContent = Array.isArray(booking.seats) ? (typeof booking.seats[0] === 'object' ? booking.seats.map(s => s.seatRow + s.seatNumber).join(", ") : booking.seats.join(", ")) : "";
    document.getElementById("tktReference").textContent = booking.bookingReference;
    document.getElementById("tktCustomerName").textContent = user?.fullName || "Valued Guest";
    document.getElementById("tktPaidAmount").textContent = (booking.grandTotal || booking.totalAmount || 0).toFixed(2);

    document.getElementById("ticketModal").classList.add("active");
  },

  renderMyBookings() {
    const user = Storage.getCurrentUser();
    const container = document.getElementById("myBookingsContainer");

    if (!user) {
      container.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 60px 20px; color: var(--text-muted);">
          <h3>Please Sign In</h3>
          <p>Sign in to view your tickets.</p>
          <button class="btn btn-primary" style="margin-top: 16px;" onclick="app.openAuthModal('login')">Sign In</button>
        </div>
      `;
      return;
    }

    const bookings = Storage.getBookingsForUser(user.userId);
    if (bookings.length === 0) {
      container.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 60px 20px; color: var(--text-muted);">
          <h3>No bookings yet</h3>
          <button class="btn btn-primary" style="margin-top: 16px;" onclick="app.navigateTo('home')">Browse Movies</button>
        </div>
      `;
      return;
    }

    container.innerHTML = bookings.map(b => `
      <div class="booking-card">
        <div class="booking-card-header">
          <div>
            <span class="booking-ref-tag">${b.bookingReference}</span>
            <h3 style="font-size: 1.15rem; margin-top: 6px;">${b.movieTitle}</h3>
          </div>
          <span class="badge ${b.status === 'CONFIRMED' ? 'badge-info' : 'badge-danger'}">
            ${b.status}
          </span>
        </div>
        <div style="font-size: 0.85rem; color: var(--text-secondary);">
          <div><i class="fa-solid fa-location-dot text-accent"></i> ${b.theaterName} (${b.screenName})</div>
          <div><i class="fa-regular fa-calendar"></i> ${b.showDate} at ${b.showTime}</div>
          <div><i class="fa-solid fa-couch"></i> Seats: <strong>${Array.isArray(b.seats) ? b.seats.join(", ") : ""}</strong></div>
          <div><i class="fa-solid fa-indian-rupee-sign"></i> Paid: ₹${(b.grandTotal || b.totalAmount || 0).toFixed(2)}</div>
        </div>
      </div>
    `).join("");
  },

  renderAdminPanel() {
    const user = Storage.getCurrentUser();
    if (!user || user.role !== "ADMIN") {
      this.showToast("Admin access required.", "error");
      this.openAuthModal("login");
      this.fillDemoCredentials("admin");
      return;
    }
    document.getElementById("adminUsername").textContent = user.fullName;
    this.switchAdminTab(this.currentAdminTab);
  },

  switchAdminTab(tab) {
    this.currentAdminTab = tab;
    document.querySelectorAll(".admin-nav-item").forEach(b => b.classList.remove("active"));
    const activeBtn = document.getElementById(`adm-tab-${tab}`);
    if (activeBtn) activeBtn.classList.add("active");

    const container = document.getElementById("adminContentArea");
    const movies = Storage.getMovies();
    const bookings = Storage.getBookings();
    const users = Storage.getUsers();
    const revenue = bookings.filter(b => b.status === "CONFIRMED").reduce((sum, b) => sum + (b.grandTotal || b.totalAmount || 0), 0);

    if (tab === "overview") {
      container.innerHTML = `
        <div class="admin-metrics-grid">
          <div class="metric-card">
            <div class="metric-icon" style="background: rgba(229,9,20,0.15); color: var(--accent-primary);"><i class="fa-solid fa-ticket"></i></div>
            <div>
              <div class="metric-val">${bookings.filter(b => b.status === 'CONFIRMED').length}</div>
              <div class="metric-title">Total Bookings</div>
            </div>
          </div>
          <div class="metric-card">
            <div class="metric-icon" style="background: rgba(0,240,144,0.15); color: var(--accent-green);"><i class="fa-solid fa-indian-rupee-sign"></i></div>
            <div>
              <div class="metric-val">₹${revenue.toFixed(0)}</div>
              <div class="metric-title">Gross Revenue</div>
            </div>
          </div>
          <div class="metric-card">
            <div class="metric-icon" style="background: rgba(5,217,232,0.15); color: var(--accent-cyan);"><i class="fa-solid fa-film"></i></div>
            <div>
              <div class="metric-val">${movies.filter(m => m.status === 'NOW_SHOWING').length}</div>
              <div class="metric-title">Now Showing</div>
            </div>
          </div>
          <div class="metric-card">
            <div class="metric-icon" style="background: rgba(255,183,3,0.15); color: var(--accent-gold);"><i class="fa-solid fa-users"></i></div>
            <div>
              <div class="metric-val">${users.filter(u => u.role !== 'ADMIN').length}</div>
              <div class="metric-title">Registered Users</div>
            </div>
          </div>
        </div>
        <div style="margin-top: 24px; background: var(--bg-surface-elevated); border-radius: var(--radius-md); padding: 20px;">
          <h4 style="margin-bottom: 14px; color: var(--text-primary);"><i class="fa-solid fa-clock-rotate-left text-accent"></i> Recent Bookings</h4>
          <div style="overflow-x: auto;">
            <table style="width: 100%; border-collapse: collapse; font-size: 0.85rem;">
              <thead>
                <tr style="color: var(--text-muted); border-bottom: 1px solid var(--border-subtle);">
                  <th style="padding: 8px; text-align: left;">Booking Ref</th>
                  <th style="padding: 8px; text-align: left;">Movie</th>
                  <th style="padding: 8px; text-align: left;">Date</th>
                  <th style="padding: 8px; text-align: right;">Amount</th>
                  <th style="padding: 8px; text-align: center;">Status</th>
                </tr>
              </thead>
              <tbody>
                ${bookings.slice(0, 8).map(b => `
                  <tr style="border-bottom: 1px solid var(--border-subtle);">
                    <td style="padding: 8px; font-family: monospace; color: var(--accent-primary);">${b.bookingReference}</td>
                    <td style="padding: 8px;">${b.movieTitle}</td>
                    <td style="padding: 8px; color: var(--text-secondary);">${b.showDate}</td>
                    <td style="padding: 8px; text-align: right;">₹${(b.grandTotal || 0).toFixed(0)}</td>
                    <td style="padding: 8px; text-align: center;">
                      <span class="badge ${b.status === 'CONFIRMED' ? 'badge-info' : 'badge-danger'}" style="font-size: 0.75rem;">${b.status}</span>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      `;
    } else if (tab === "movies") {
      container.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
          <h3><i class="fa-solid fa-film text-accent"></i> Manage Movies</h3>
          <button class="btn btn-primary" onclick="app.openMovieModal()">
            <i class="fa-solid fa-plus"></i> Add New Movie
          </button>
        </div>
        <div style="overflow-x: auto;">
          <table style="width: 100%; border-collapse: collapse; font-size: 0.85rem; background: var(--bg-surface-elevated); border-radius: var(--radius-md);">
            <thead>
              <tr style="color: var(--text-muted); border-bottom: 1px solid var(--border-subtle);">
                <th style="padding: 12px 16px; text-align: left;">Poster</th>
                <th style="padding: 12px 16px; text-align: left;">Title</th>
                <th style="padding: 12px 16px; text-align: left;">Genre</th>
                <th style="padding: 12px 16px; text-align: center;">Duration</th>
                <th style="padding: 12px 16px; text-align: center;">Status</th>
                <th style="padding: 12px 16px; text-align: center;">Actions</th>
              </tr>
            </thead>
            <tbody>
              ${movies.map(m => `
                <tr style="border-bottom: 1px solid var(--border-subtle);">
                  <td style="padding: 10px 16px;">
                    <img src="${m.posterUrl}" alt="${m.title}" style="width: 40px; height: 56px; object-fit: cover; border-radius: 4px;" />
                  </td>
                  <td style="padding: 10px 16px; font-weight: 600; color: var(--text-primary);">${m.title}</td>
                  <td style="padding: 10px 16px; color: var(--text-secondary); font-size: 0.8rem;">${m.genre}</td>
                  <td style="padding: 10px 16px; text-align: center; color: var(--text-secondary);">${m.durationMinutes}m</td>
                  <td style="padding: 10px 16px; text-align: center;">
                    <span class="badge ${m.status === 'NOW_SHOWING' ? 'badge-info' : ''}" style="font-size: 0.75rem; ${m.status === 'UPCOMING' ? 'background: rgba(255,183,3,0.15); color: var(--accent-gold);' : ''}">
                      ${m.status === 'NOW_SHOWING' ? 'Now Showing' : 'Coming Soon'}
                    </span>
                  </td>
                  <td style="padding: 10px 16px; text-align: center;">
                    <button class="btn-xs" onclick="app.openMovieModal(${m.movieId})" title="Edit" style="margin-right: 6px;">
                      <i class="fa-solid fa-pen-to-square"></i>
                    </button>
                    <button class="btn-xs" onclick="app.deleteMovie(${m.movieId})" title="Delete" style="background: rgba(255,59,48,0.15); color: #ff3b30; border-color: rgba(255,59,48,0.3);">
                      <i class="fa-solid fa-trash"></i>
                    </button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      `;
    } else if (tab === "shows") {
      const shows = Storage.getShows();
      const theaters = Storage.getTheaters();
      container.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
          <h3><i class="fa-solid fa-calendar-check text-accent"></i> Manage Shows</h3>
          <button class="btn btn-primary" onclick="app.openShowModal()">
            <i class="fa-solid fa-plus"></i> Schedule New Show
          </button>
        </div>
        <div style="overflow-x: auto;">
          <table style="width: 100%; border-collapse: collapse; font-size: 0.85rem; background: var(--bg-surface-elevated); border-radius: var(--radius-md);">
            <thead>
              <tr style="color: var(--text-muted); border-bottom: 1px solid var(--border-subtle);">
                <th style="padding: 12px 16px; text-align: left;">Movie</th>
                <th style="padding: 12px 16px; text-align: left;">Theater & Audi</th>
                <th style="padding: 12px 16px; text-align: center;">Date</th>
                <th style="padding: 12px 16px; text-align: center;">Time</th>
                <th style="padding: 12px 16px; text-align: center;">Prices</th>
                <th style="padding: 12px 16px; text-align: center;">Status</th>
              </tr>
            </thead>
            <tbody>
              ${shows.map(s => {
                const movie = movies.find(m => m.movieId === s.movieId);
                const theater = theaters.find(t => t.theaterId === s.theaterId);
                const screen = theater?.screens.find(sc => sc.screenId === s.screenId);
                return `
                  <tr style="border-bottom: 1px solid var(--border-subtle);">
                    <td style="padding: 10px 16px; font-weight: 600;">${movie?.title || 'Unknown'}</td>
                    <td style="padding: 10px 16px; color: var(--text-secondary); font-size: 0.8rem;">${theater?.name || ''}<br/><small>${screen?.name || ''}</small></td>
                    <td style="padding: 10px 16px; text-align: center;">${s.showDate}</td>
                    <td style="padding: 10px 16px; text-align: center; font-weight: 600; color: var(--accent-primary);">${s.startTime}</td>
                    <td style="padding: 10px 16px; text-align: center; font-size: 0.8rem;">Std: ₹${s.standardPrice}<br/>Prem: ₹${s.premiumPrice}</td>
                    <td style="padding: 10px 16px; text-align: center;">
                      <span class="badge ${s.status === 'ACTIVE' ? 'badge-info' : 'badge-danger'}" style="font-size: 0.75rem;">${s.status}</span>
                    </td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      `;
    } else if (tab === "bookings") {
      container.innerHTML = `
        <div style="margin-bottom: 20px;">
          <h3><i class="fa-solid fa-receipt text-accent"></i> All Booking Logs</h3>
        </div>
        <div style="overflow-x: auto;">
          <table style="width: 100%; border-collapse: collapse; font-size: 0.85rem; background: var(--bg-surface-elevated); border-radius: var(--radius-md);">
            <thead>
              <tr style="color: var(--text-muted); border-bottom: 1px solid var(--border-subtle);">
                <th style="padding: 12px 16px; text-align: left;">Booking Ref</th>
                <th style="padding: 12px 16px; text-align: left;">Movie</th>
                <th style="padding: 12px 16px; text-align: left;">Theater</th>
                <th style="padding: 12px 16px; text-align: center;">Date & Time</th>
                <th style="padding: 12px 16px; text-align: center;">Seats</th>
                <th style="padding: 12px 16px; text-align: right;">Amount</th>
                <th style="padding: 12px 16px; text-align: center;">Status</th>
                <th style="padding: 12px 16px; text-align: center;">Action</th>
              </tr>
            </thead>
            <tbody>
              ${bookings.map(b => `
                <tr style="border-bottom: 1px solid var(--border-subtle);">
                  <td style="padding: 10px 16px; font-family: monospace; color: var(--accent-primary); font-size: 0.8rem;">${b.bookingReference}</td>
                  <td style="padding: 10px 16px; font-weight: 600;">${b.movieTitle}</td>
                  <td style="padding: 10px 16px; color: var(--text-secondary); font-size: 0.8rem;">${b.theaterName}</td>
                  <td style="padding: 10px 16px; text-align: center; font-size: 0.8rem;">${b.showDate}<br/>${b.showTime}</td>
                  <td style="padding: 10px 16px; text-align: center;">${Array.isArray(b.seats) ? b.seats.join(', ') : ''}</td>
                  <td style="padding: 10px 16px; text-align: right; font-weight: 600;">₹${(b.grandTotal || b.totalAmount || 0).toFixed(0)}</td>
                  <td style="padding: 10px 16px; text-align: center;">
                    <span class="badge ${b.status === 'CONFIRMED' ? 'badge-info' : 'badge-danger'}" style="font-size: 0.75rem;">${b.status}</span>
                  </td>
                  <td style="padding: 10px 16px; text-align: center;">
                    ${b.status === 'CONFIRMED' ? `<button class="btn-xs" onclick="app.adminCancelBooking(${b.bookingId})" style="background: rgba(255,59,48,0.15); color: #ff3b30; border-color: rgba(255,59,48,0.3); font-size: 0.75rem;">Cancel</button>` : '<span style="color: var(--text-muted); font-size: 0.8rem;">-</span>'}
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      `;
    }
  },

  // ==================== ADMIN CRUD HANDLERS ====================
  openMovieModal(movieId = null) {
    const titleEl = document.getElementById("movieModalTitle");
    const form = document.getElementById("formMovie");
    form.reset();
    document.getElementById("adminMovieId").value = "";

    if (movieId) {
      const movie = Storage.getMovieById(movieId);
      if (!movie) return;
      titleEl.innerHTML = `<i class="fa-solid fa-pen-to-square text-accent"></i> Edit Movie`;
      document.getElementById("adminMovieId").value = movie.movieId;
      document.getElementById("mTitle").value = movie.title;
      document.getElementById("mGenre").value = movie.genre;
      document.getElementById("mLanguage").value = movie.language;
      document.getElementById("mDuration").value = movie.durationMinutes;
      document.getElementById("mStatus").value = movie.status;
      document.getElementById("mPoster").value = movie.posterUrl;
      document.getElementById("mDescription").value = movie.description || "";
    } else {
      titleEl.innerHTML = `<i class="fa-solid fa-plus-circle text-accent"></i> Add New Movie`;
    }

    document.getElementById("movieModal").classList.add("active");
  },

  async handleSaveMovie(e) {
    e.preventDefault();
    const movieId = document.getElementById("adminMovieId").value;
    const movieData = {
      movieId: movieId ? parseInt(movieId) : null,
      title: document.getElementById("mTitle").value.trim(),
      genre: document.getElementById("mGenre").value.trim(),
      language: document.getElementById("mLanguage").value.trim(),
      durationMinutes: parseInt(document.getElementById("mDuration").value),
      status: document.getElementById("mStatus").value,
      posterUrl: document.getElementById("mPoster").value.trim(),
      description: document.getElementById("mDescription").value.trim(),
      rating: "8.5",
      ageRating: "UA"
    };

    let saved = null;
    if (typeof ApiClient !== "undefined") {
      const res = movieId
        ? await ApiClient.movies.create(movieData)
        : await ApiClient.movies.create(movieData);
      if (res && res.success && res.data) saved = res.data;
    }

    if (!saved) {
      saved = Storage.saveMovie(movieData);
    }

    this.closeModal("movieModal");
    this.showToast(movieId ? "Movie updated successfully!" : "New movie added!", "success");
    this.switchAdminTab("movies");
  },

  async deleteMovie(movieId) {
    if (!confirm("Are you sure you want to delete this movie?")) return;

    let deleted = false;
    if (typeof ApiClient !== "undefined") {
      const res = await ApiClient.movies.delete(movieId);
      if (res && res.success) deleted = true;
    }
    if (!deleted) {
      Storage.deleteMovie(movieId);
    }
    this.showToast("Movie deleted.", "info");
    this.switchAdminTab("movies");
  },

  openShowModal() {
    const form = document.getElementById("formShow");
    form.reset();

    const movies = Storage.getMovies().filter(m => m.status === "NOW_SHOWING");
    const theaters = Storage.getTheaters();

    const movieSelect = document.getElementById("showMovieSelect");
    movieSelect.innerHTML = movies.map(m =>
      `<option value="${m.movieId}">${m.title}</option>`
    ).join("");

    const screenSelect = document.getElementById("showScreenSelect");
    screenSelect.innerHTML = theaters.flatMap(t =>
      t.screens.map(s =>
        `<option value="${t.theaterId}__${s.screenId}">${t.name} — ${s.name}</option>`
      )
    ).join("");

    const today = new Date().toISOString().split("T")[0];
    document.getElementById("showDateInput").value = today;
    document.getElementById("showDateInput").min = today;

    document.getElementById("showModal").classList.add("active");
  },

  async handleSaveShow(e) {
    e.preventDefault();
    const movieId = parseInt(document.getElementById("showMovieSelect").value);
    const [theaterIdStr, screenIdStr] = document.getElementById("showScreenSelect").value.split("__");
    const theaterId = parseInt(theaterIdStr);
    const screenId = parseInt(screenIdStr);
    const showDate = document.getElementById("showDateInput").value;
    const startTime = document.getElementById("showTimeInput").value;
    const standardPrice = parseInt(document.getElementById("showStdPrice").value);
    const premiumPrice = parseInt(document.getElementById("showPremPrice").value);

    const movie = Storage.getMovieById(movieId);
    const [h, m] = startTime.split(":").map(Number);
    const endMinutes = h * 60 + m + (movie?.durationMinutes || 120);
    const endTime = `${String(Math.floor(endMinutes / 60) % 24).padStart(2, "0")}:${String(endMinutes % 60).padStart(2, "0")}`;

    const showData = { movieId, theaterId, screenId, showDate, startTime, endTime, standardPrice, premiumPrice, status: "ACTIVE" };

    let saved = null;
    if (typeof ApiClient !== "undefined") {
      const res = await ApiClient.shows.schedule(showData);
      if (res && res.success && res.data) saved = res.data;
    }
    if (!saved) {
      saved = Storage.addShow(showData);
    }

    this.closeModal("showModal");
    this.showToast(`Show scheduled for ${showDate} at ${startTime}!`, "success");
    this.switchAdminTab("shows");
  },

  adminCancelBooking(bookingId) {
    if (!confirm("Cancel this booking? Seats will be freed.")) return;
    Storage.cancelBooking(bookingId);
    this.showToast("Booking cancelled and seats freed.", "info");
    this.switchAdminTab("bookings");
  },

  showToast(message, type = "info") {
    const container = document.getElementById("toastContainer");
    if (!container) return;
    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    const icon = type === "success" ? "fa-circle-check" : type === "error" ? "fa-circle-exclamation" : "fa-circle-info";
    toast.innerHTML = `<i class="fa-solid ${icon}"></i> <span>${message}</span>`;
    container.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = "translateX(100%)";
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  },

  attachEventListeners() {
    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        document.querySelectorAll(".modal-backdrop").forEach(m => m.classList.remove("active"));
      }
    });
  }
};

document.addEventListener("DOMContentLoaded", () => {
  app.init();
});
