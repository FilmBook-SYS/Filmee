/**
 * Filmee - Main Application Controller
 */
const app = {
  currentView: "home",
  activeCity: "Thane",
  selectedGenre: "ALL",
  movieTab: "NOW_SHOWING",
  searchQuery: "",

  // Active Booking Flow State
  selectedMovie: null,
  selectedDate: null,
  selectedShow: null,
  selectedSeats: [], // array of seat objects: { id: "C4", row: "C", num: 4, type: "STANDARD", price: 180 }
  holdTimerInterval: null,
  secondsLeft: 300,

  // Admin Active Tab
  currentAdminTab: "overview",

  init() {
    Storage.init();
    this.renderNavbarAuth();
    this.renderHeroCarousel();
    this.renderMovies();
    this.setupDateRibbon();
    this.attachEventListeners();
    console.log("🎬 Filmee Web Application Initialized Successfully.");
  },

  // ==================== NAVIGATION & ROUTING ====================
  navigateTo(viewName, params = {}) {
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
    } else if (viewName === "movies") {
      this.navigateTo("home");
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
        <div class="user-badge" onclick="app.toggleUserMenu()">
          <div class="user-avatar">${user.fullName.charAt(0)}</div>
          <span style="font-size: 0.9rem; font-weight: 600;">${user.fullName.split(" ")[0]}</span>
          <i class="fa-solid fa-chevron-down" style="font-size: 0.75rem; color: var(--text-muted);"></i>
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

  handleLoginSubmit(e) {
    e.preventDefault();
    const email = document.getElementById("loginEmail").value.trim();
    const pass = document.getElementById("loginPassword").value;

    const users = Storage.getUsers();
    const found = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === pass);

    if (found) {
      Storage.setCurrentUser(found);
      this.renderNavbarAuth();
      this.closeModal("authModal");
      this.showToast(`Welcome back, ${found.fullName}!`, "success");
      
      if (found.role === "ADMIN") {
        this.navigateTo("admin");
      }
    } else {
      this.showToast("Invalid email or password. Please try demo credentials.", "error");
    }
  },

  handleRegisterSubmit(e) {
    e.preventDefault();
    const name = document.getElementById("regName").value.trim();
    const email = document.getElementById("regEmail").value.trim();
    const phone = document.getElementById("regPhone").value.trim();
    const pass = document.getElementById("regPassword").value;

    const users = Storage.getUsers();
    if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
      this.showToast("Email address already registered.", "error");
      return;
    }

    const newUser = Storage.addUser({
      fullName: name,
      email: email,
      phone: phone,
      password: pass,
      role: "CUSTOMER"
    });

    Storage.setCurrentUser(newUser);
    this.renderNavbarAuth();
    this.closeModal("authModal");
    this.showToast("Account successfully created!", "success");
  },

  logoutUser() {
    Storage.logout();
    this.renderNavbarAuth();
    this.navigateTo("home");
    this.showToast("Logged out successfully.", "info");
  },

  // ==================== DISCOVERY & MOVIES ====================
  renderHeroCarousel() {
    const movies = Storage.getMovies();
    const featured = movies[0];
    if (!featured) return;

    const slideEl = document.getElementById("featuredSlide");
    slideEl.className = "featured-card";
    slideEl.style.backgroundImage = `url('${featured.backdropUrl || featured.posterUrl}')`;

    slideEl.innerHTML = `
      <div class="featured-overlay"></div>
      <div class="featured-content">
        <span class="tag-badge"><i class="fa-solid fa-sparkles"></i> Featured Premiere</span>
        <h1 class="featured-title">${featured.title}</h1>
        <div class="featured-meta">
          <span><i class="fa-solid fa-star text-accent"></i> ${featured.rating} / 10</span>
          <span>•</span>
          <span><i class="fa-regular fa-clock"></i> ${featured.durationMinutes} min</span>
          <span>•</span>
          <span>${featured.genre}</span>
        </div>
        <p class="featured-desc">${featured.description.substring(0, 180)}...</p>
        <div class="featured-actions">
          <button class="btn btn-primary" onclick="app.openMovieDetails(${featured.movieId})">
            <i class="fa-solid fa-ticket"></i> Book Tickets Now
          </button>
          <button class="btn btn-secondary" onclick="app.openMovieDetails(${featured.movieId})">
            <i class="fa-solid fa-circle-info"></i> More Details
          </button>
        </div>
      </div>
    `;
  },

  filterByGenre(genre) {
    this.selectedGenre = genre;
    document.querySelectorAll(".genre-filter-bar .chip").forEach(btn => {
      btn.classList.toggle("active", btn.textContent.trim().toUpperCase() === genre || (genre === "ALL" && btn.textContent.includes("All")));
    });
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

  renderMovies() {
    const grid = document.getElementById("movieGrid");
    let movies = Storage.getMovies();

    // Filter by tab
    movies = movies.filter(m => m.status === this.movieTab);

    // Filter by genre
    if (this.selectedGenre !== "ALL") {
      movies = movies.filter(m => m.genre.toLowerCase().includes(this.selectedGenre.toLowerCase()));
    }

    // Filter by search query
    if (this.searchQuery) {
      movies = movies.filter(m =>
        m.title.toLowerCase().includes(this.searchQuery) ||
        m.genre.toLowerCase().includes(this.searchQuery) ||
        (m.cast && m.cast.toLowerCase().includes(this.searchQuery))
      );
    }

    if (movies.length === 0) {
      grid.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 60px 20px; color: var(--text-muted);">
          <i class="fa-solid fa-film-slash fa-3x" style="margin-bottom: 16px;"></i>
          <h3>No movies found</h3>
          <p>Try adjusting your search query or genre filter.</p>
        </div>
      `;
      return;
    }

    grid.innerHTML = movies.map(movie => `
      <div class="movie-card" onclick="app.openMovieDetails(${movie.movieId})">
        <div class="movie-poster-wrap">
          <img src="${movie.posterUrl}" alt="${movie.title}" loading="lazy" />
          <div class="movie-badge-float">
            <i class="fa-solid fa-star"></i> ${movie.rating}
          </div>
        </div>
        <div class="movie-card-info">
          <h3 class="movie-title">${movie.title}</h3>
          <div class="movie-genre">${movie.genre}</div>
          <div class="movie-card-footer">
            <span class="movie-duration"><i class="fa-regular fa-clock"></i> ${movie.durationMinutes}m • ${movie.language.split(",")[0]}</span>
            <button class="btn-xs" style="background: rgba(255,94,58,0.15); color: var(--accent-primary); border-color: rgba(255,94,58,0.3);">
              ${movie.status === 'NOW_SHOWING' ? 'Book' : 'Info'}
            </button>
          </div>
        </div>
      </div>
    `).join("");
  },

  // ==================== MOVIE DETAILS & SHOWTIMES ====================
  openMovieDetails(movieId) {
    const movie = Storage.getMovieById(movieId);
    if (!movie) return;

    this.selectedMovie = movie;
    this.selectedDate = new Date().toISOString().split("T")[0];

    const heroContainer = document.getElementById("movieHeroInfo");
    heroContainer.innerHTML = `
      <div class="detail-poster">
        <img src="${movie.posterUrl}" alt="${movie.title}" />
      </div>
      <div class="detail-body">
        <div class="detail-pills">
          <span class="badge badge-info"><i class="fa-solid fa-clapperboard"></i> ${movie.ageRating || 'UA'}</span>
          <span class="badge" style="background: rgba(255,183,3,0.15); color: var(--accent-gold);"><i class="fa-solid fa-star"></i> ${movie.rating} / 10</span>
          <span class="badge" style="background: var(--bg-surface-elevated); color: var(--text-secondary);">${movie.language}</span>
        </div>
        <h1 class="detail-title">${movie.title}</h1>
        <div class="featured-meta" style="margin-bottom: 12px;">
          <span><i class="fa-regular fa-clock"></i> ${movie.durationMinutes} mins</span>
          <span>•</span>
          <span>${movie.genre}</span>
        </div>
        <p class="detail-desc">${movie.description}</p>
        <div style="font-size: 0.88rem; color: var(--text-secondary); margin-bottom: 6px;">
          <strong>Director:</strong> ${movie.director || 'Christopher Nolan'}
        </div>
        <div style="font-size: 0.88rem; color: var(--text-secondary);">
          <strong>Starring:</strong> ${movie.cast || 'Lead Ensemble'}
        </div>
      </div>
    `;

    this.setupDateRibbon();
    this.renderTheatersAndShows();
    this.navigateTo("movie-details");
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
            <span class="badge badge-info"><i class="fa-solid fa-sparkles"></i> Laser Projection</span>
          </div>

          <div class="showtimes-grid">
            ${theaterShows.map(s => {
              const screen = theater.screens.find(sc => sc.screenId === s.screenId) || { name: "Audi 1" };
              return `
                <div class="showtime-pill" onclick="app.startSeatSelection(${s.showId})">
                  <span class="showtime-time">${s.startTime}</span>
                  <span class="showtime-screen">${screen.name}</span>
                  <span style="font-size: 0.72rem; color: var(--text-muted); margin-top: 4px;">Std: ₹${s.standardPrice} | Prem: ₹${s.premiumPrice}</span>
                </div>
              `;
            }).join("")}
          </div>
        </div>
      `;
    }).join("");
  },

  // ==================== SEAT SELECTION STEP ====================
  startSeatSelection(showId) {
    const show = Storage.getShowById(showId);
    if (!show) return;

    this.selectedShow = show;
    this.selectedSeats = [];

    const theater = Storage.getTheaters().find(t => t.theaterId === show.theaterId);
    const screen = theater?.screens.find(s => s.screenId === show.screenId);

    // Update header
    document.getElementById("seatHeaderInfo").innerHTML = `
      <h3 style="font-size: 1.25rem;">${this.selectedMovie.title}</h3>
      <p style="font-size: 0.85rem; color: var(--text-secondary);">
        ${theater.name} • ${screen.name} • ${show.showDate} at ${show.startTime}
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

        if (c === 5) {
          // Aisle spacing
          html += `<div style="width: 24px;"></div>`;
        }

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
      this.showToast(`Seat ${seatId} is already reserved.`, "error");
      return;
    }

    const idx = this.selectedSeats.findIndex(s => s.id === seatId);
    if (idx !== -1) {
      this.selectedSeats.splice(idx, 1);
      el.classList.remove("selected");
    } else {
      if (this.selectedSeats.length >= 8) {
        this.showToast("You can select up to 8 seats per booking.", "error");
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
    if (count > 0) {
      seatListEl.textContent = this.selectedSeats.map(s => s.id).join(", ");
    } else {
      seatListEl.textContent = "No seats selected yet";
    }

    document.getElementById("btnProceedToPay").disabled = count === 0;
  },

  startHoldTimer() {
    this.stopHoldTimer();
    this.secondsLeft = 300; // 5 mins
    const timerDisplay = document.getElementById("timerCountdown");

    this.holdTimerInterval = setInterval(() => {
      this.secondsLeft--;
      if (this.secondsLeft <= 0) {
        this.stopHoldTimer();
        this.showToast("Seat hold session expired. Please re-select seats.", "error");
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

  // ==================== CHECKOUT & PAYMENT MODAL ====================
  openCheckoutModal() {
    const user = Storage.getCurrentUser();
    if (!user) {
      this.showToast("Please sign in or create an account to book tickets.", "info");
      this.openAuthModal("login");
      return;
    }

    if (this.selectedSeats.length === 0) return;

    const subtotal = this.selectedSeats.reduce((sum, s) => sum + s.price, 0);
    const tax = subtotal * 0.18;
    const grandTotal = subtotal + tax;

    document.getElementById("chkMovieTitle").textContent = this.selectedMovie.title;
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

  processPayment() {
    const user = Storage.getCurrentUser();
    if (!user) return;

    // Check collision & reserve in Storage
    const seatIds = this.selectedSeats.map(s => s.id);
    const reserveResult = Storage.reserveSeats(this.selectedShow.showId, seatIds);

    if (!reserveResult.success) {
      this.closeModal("checkoutModal");
      this.showToast(reserveResult.message, "error");
      this.renderTheatersAndShows();
      this.navigateTo("movie-details");
      return;
    }

    const subtotal = this.selectedSeats.reduce((sum, s) => sum + s.price, 0);
    const tax = subtotal * 0.18;
    const grandTotal = subtotal + tax;

    const theater = Storage.getTheaters().find(t => t.theaterId === this.selectedShow.theaterId);
    const screen = theater?.screens.find(s => s.screenId === this.selectedShow.screenId);

    const booking = Storage.createBooking({
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
      grandTotal: grandTotal
    });

    this.stopHoldTimer();
    this.closeModal("checkoutModal");
    this.showToast("🎉 Booking Confirmed! Generating your e-ticket...", "success");

    // Display ticket modal
    this.showDigitalTicket(booking);
  },

  // ==================== TICKET GENERATION & VIEW ====================
  showDigitalTicket(booking) {
    const user = Storage.getCurrentUser();

    document.getElementById("tktMovieTitle").textContent = booking.movieTitle;
    document.getElementById("tktLanguageGenre").textContent = `${this.selectedMovie?.genre || 'Action'} • ${this.selectedMovie?.language || 'English'}`;
    document.getElementById("tktTheaterAudi").textContent = `${booking.theaterName} • ${booking.screenName}`;
    document.getElementById("tktDateTime").textContent = `${booking.showDate} • ${booking.showTime}`;
    document.getElementById("tktSeats").textContent = booking.seats.join(", ");
    document.getElementById("tktReference").textContent = booking.bookingReference;
    document.getElementById("tktCustomerName").textContent = user?.fullName || "Valued Guest";
    document.getElementById("tktPaidAmount").textContent = booking.grandTotal.toFixed(2);

    document.getElementById("ticketModal").classList.add("active");
  },

  // ==================== MY BOOKINGS TAB ====================
  renderMyBookings() {
    const user = Storage.getCurrentUser();
    const container = document.getElementById("myBookingsContainer");

    if (!user) {
      container.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 60px 20px; color: var(--text-muted);">
          <i class="fa-solid fa-lock fa-3x" style="margin-bottom: 16px;"></i>
          <h3>Please Sign In</h3>
          <p>You need to be logged in to view your reservation history.</p>
          <button class="btn btn-primary" style="margin-top: 16px;" onclick="app.openAuthModal('login')">Sign In</button>
        </div>
      `;
      return;
    }

    const bookings = Storage.getBookingsForUser(user.userId);
    if (bookings.length === 0) {
      container.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 60px 20px; color: var(--text-muted);">
          <i class="fa-solid fa-ticket-simple fa-3x" style="margin-bottom: 16px;"></i>
          <h3>No bookings yet</h3>
          <p>You haven't reserved any movie tickets yet.</p>
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
          <div><i class="fa-solid fa-couch"></i> Seats: <strong>${b.seats.join(", ")}</strong> (${b.totalTickets} Tickets)</div>
          <div><i class="fa-solid fa-indian-rupee-sign"></i> Paid: ₹${b.grandTotal.toFixed(2)}</div>
        </div>

        <div style="display: flex; gap: 8px; margin-top: 8px;">
          ${b.status === 'CONFIRMED' ? `
            <button class="btn btn-secondary btn-block" onclick="app.showDigitalTicketById(${b.bookingId})">
              <i class="fa-solid fa-qrcode"></i> View Ticket
            </button>
            <button class="btn btn-danger" onclick="app.cancelBooking(${b.bookingId})">
              Cancel
            </button>
          ` : `
            <span style="font-size: 0.8rem; color: var(--text-muted);">Reservation Cancelled & Refunded</span>
          `}
        </div>
      </div>
    `).join("");
  },

  showDigitalTicketById(bookingId) {
    const bookings = Storage.getBookings();
    const found = bookings.find(b => b.bookingId === bookingId);
    if (found) {
      this.showDigitalTicket(found);
    }
  },

  cancelBooking(bookingId) {
    if (confirm("Are you sure you want to cancel this booking? Full refund will be processed.")) {
      Storage.cancelBooking(bookingId);
      this.showToast("Booking cancelled successfully.", "info");
      this.renderMyBookings();
    }
  },

  // ==================== ADMIN PANEL ====================
  renderAdminPanel() {
    const user = Storage.getCurrentUser();
    if (!user || user.role !== "ADMIN") {
      this.showToast("Admin access required. Please log in as administrator.", "error");
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

    if (tab === "overview") {
      const movies = Storage.getMovies();
      const bookings = Storage.getBookings();
      const confirmed = bookings.filter(b => b.status === "CONFIRMED");
      const revenue = confirmed.reduce((sum, b) => sum + b.grandTotal, 0);
      const totalTickets = confirmed.reduce((sum, b) => sum + b.totalTickets, 0);

      container.innerHTML = `
        <div class="admin-metrics-grid">
          <div class="metric-card">
            <div class="metric-icon" style="background: rgba(255,94,58,0.15); color: var(--accent-primary);">
              <i class="fa-solid fa-ticket"></i>
            </div>
            <div>
              <div class="metric-val">${totalTickets}</div>
              <div class="metric-title">Tickets Sold</div>
            </div>
          </div>

          <div class="metric-card">
            <div class="metric-icon" style="background: rgba(0,240,144,0.15); color: var(--accent-green);">
              <i class="fa-solid fa-indian-rupee-sign"></i>
            </div>
            <div>
              <div class="metric-val">₹${revenue.toFixed(0)}</div>
              <div class="metric-title">Total Gross Revenue</div>
            </div>
          </div>

          <div class="metric-card">
            <div class="metric-icon" style="background: rgba(5,217,232,0.15); color: var(--accent-cyan);">
              <i class="fa-solid fa-film"></i>
            </div>
            <div>
              <div class="metric-val">${movies.length}</div>
              <div class="metric-title">Catalog Movies</div>
            </div>
          </div>

          <div class="metric-card">
            <div class="metric-icon" style="background: rgba(255,183,3,0.15); color: var(--accent-gold);">
              <i class="fa-solid fa-users"></i>
            </div>
            <div>
              <div class="metric-val">${Storage.getUsers().length}</div>
              <div class="metric-title">Registered Accounts</div>
            </div>
          </div>
        </div>

        <div class="admin-table-card">
          <h3 style="margin-bottom: 16px;"><i class="fa-solid fa-clock-rotate-left text-accent"></i> Recent Transactions</h3>
          <table class="admin-table">
            <thead>
              <tr>
                <th>Booking ID</th>
                <th>Movie</th>
                <th>Seats</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${bookings.slice(0, 5).map(b => `
                <tr>
                  <td><code>${b.bookingReference}</code></td>
                  <td><strong>${b.movieTitle}</strong></td>
                  <td>${b.seats.join(", ")}</td>
                  <td>₹${b.grandTotal.toFixed(2)}</td>
                  <td><span class="badge ${b.status === 'CONFIRMED' ? 'badge-info' : 'badge-danger'}">${b.status}</span></td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        </div>
      `;
    } else if (tab === "movies") {
      const movies = Storage.getMovies();
      container.innerHTML = `
        <div class="admin-table-card">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
            <h3>Manage Movies</h3>
            <button class="btn btn-primary" onclick="app.openAddMovieModal()">
              <i class="fa-solid fa-plus"></i> Add Movie
            </button>
          </div>

          <table class="admin-table">
            <thead>
              <tr>
                <th>Poster</th>
                <th>Title</th>
                <th>Genre</th>
                <th>Duration</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              ${movies.map(m => `
                <tr>
                  <td><img src="${m.posterUrl}" style="width: 36px; height: 50px; object-fit: cover; border-radius: 4px;" /></td>
                  <td><strong>${m.title}</strong></td>
                  <td>${m.genre}</td>
                  <td>${m.durationMinutes}m</td>
                  <td><span class="badge badge-info">${m.status}</span></td>
                  <td>
                    <button class="btn-xs" onclick="app.openEditMovieModal(${m.movieId})"><i class="fa-solid fa-pen"></i></button>
                    <button class="btn-xs" style="color: #ef4444;" onclick="app.deleteMovie(${m.movieId})"><i class="fa-solid fa-trash"></i></button>
                  </td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        </div>
      `;
    } else if (tab === "shows") {
      const shows = Storage.getShows();
      const movies = Storage.getMovies();
      const theaters = Storage.getTheaters();

      container.innerHTML = `
        <div class="admin-table-card">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
            <h3>Schedule Shows & Pricing</h3>
            <button class="btn btn-primary" onclick="app.openAddShowModal()">
              <i class="fa-solid fa-plus"></i> Schedule New Show
            </button>
          </div>

          <table class="admin-table">
            <thead>
              <tr>
                <th>Show ID</th>
                <th>Movie</th>
                <th>Date</th>
                <th>Time</th>
                <th>Prices (Std/Prem)</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${shows.map(s => {
                const mov = movies.find(m => m.movieId === s.movieId) || { title: "Unknown" };
                return `
                  <tr>
                    <td>#${s.showId}</td>
                    <td><strong>${mov.title}</strong></td>
                    <td>${s.showDate}</td>
                    <td>${s.startTime}</td>
                    <td>₹${s.standardPrice} / ₹${s.premiumPrice}</td>
                    <td><span class="badge badge-info">${s.status}</span></td>
                  </tr>
                `;
              }).join("")}
            </tbody>
          </table>
        </div>
      `;
    } else if (tab === "bookings") {
      const bookings = Storage.getBookings();
      container.innerHTML = `
        <div class="admin-table-card">
          <h3 style="margin-bottom: 20px;">Complete Customer Booking Logs</h3>
          <table class="admin-table">
            <thead>
              <tr>
                <th>Booking Ref</th>
                <th>User ID</th>
                <th>Movie Title</th>
                <th>Show Date & Time</th>
                <th>Seats</th>
                <th>Total</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${bookings.map(b => `
                <tr>
                  <td><code>${b.bookingReference}</code></td>
                  <td>User #${b.userId}</td>
                  <td><strong>${b.movieTitle}</strong></td>
                  <td>${b.showDate} @ ${b.showTime}</td>
                  <td>${b.seats.join(", ")}</td>
                  <td>₹${b.grandTotal.toFixed(2)}</td>
                  <td><span class="badge ${b.status === 'CONFIRMED' ? 'badge-info' : 'badge-danger'}">${b.status}</span></td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        </div>
      `;
    }
  },

  openAddMovieModal() {
    document.getElementById("movieModalTitle").innerHTML = `<i class="fa-solid fa-plus-circle text-accent"></i> Add New Movie`;
    document.getElementById("adminMovieId").value = "";
    document.getElementById("formMovie").reset();
    document.getElementById("movieModal").classList.add("active");
  },

  openEditMovieModal(movieId) {
    const movie = Storage.getMovieById(movieId);
    if (!movie) return;

    document.getElementById("movieModalTitle").innerHTML = `<i class="fa-solid fa-pen text-accent"></i> Edit Movie`;
    document.getElementById("adminMovieId").value = movie.movieId;
    document.getElementById("mTitle").value = movie.title;
    document.getElementById("mGenre").value = movie.genre;
    document.getElementById("mLanguage").value = movie.language;
    document.getElementById("mDuration").value = movie.durationMinutes;
    document.getElementById("mStatus").value = movie.status;
    document.getElementById("mPoster").value = movie.posterUrl;
    document.getElementById("mDescription").value = movie.description;

    document.getElementById("movieModal").classList.add("active");
  },

  handleSaveMovie(e) {
    e.preventDefault();
    const id = document.getElementById("adminMovieId").value;
    const title = document.getElementById("mTitle").value.trim();
    const genre = document.getElementById("mGenre").value.trim();
    const language = document.getElementById("mLanguage").value.trim();
    const duration = parseInt(document.getElementById("mDuration").value);
    const status = document.getElementById("mStatus").value;
    const poster = document.getElementById("mPoster").value.trim();
    const desc = document.getElementById("mDescription").value.trim();

    Storage.saveMovie({
      movieId: id ? parseInt(id) : null,
      title,
      genre,
      language,
      durationMinutes: duration,
      status,
      posterUrl: poster,
      description: desc,
      rating: "8.8"
    });

    this.closeModal("movieModal");
    this.showToast("Movie saved successfully!", "success");
    this.switchAdminTab("movies");
    this.renderMovies();
  },

  deleteMovie(id) {
    if (confirm("Are you sure you want to remove this movie?")) {
      Storage.deleteMovie(id);
      this.showToast("Movie deleted.", "info");
      this.switchAdminTab("movies");
      this.renderMovies();
    }
  },

  openAddShowModal() {
    const movies = Storage.getMovies();
    const theaters = Storage.getTheaters();

    const movieSelect = document.getElementById("showMovieSelect");
    movieSelect.innerHTML = movies.map(m => `<option value="${m.movieId}">${m.title}</option>`).join("");

    const screenSelect = document.getElementById("showScreenSelect");
    screenSelect.innerHTML = theaters.flatMap(t =>
      t.screens.map(s => `<option value="${t.theaterId}_${s.screenId}">${t.name} - ${s.name}</option>`)
    ).join("");

    document.getElementById("showDateInput").value = new Date().toISOString().split("T")[0];
    document.getElementById("showTimeInput").value = "18:00";

    document.getElementById("showModal").classList.add("active");
  },

  handleSaveShow(e) {
    e.preventDefault();
    const movieId = parseInt(document.getElementById("showMovieSelect").value);
    const [theaterId, screenId] = document.getElementById("showScreenSelect").value.split("_").map(Number);
    const date = document.getElementById("showDateInput").value;
    const time = document.getElementById("showTimeInput").value;
    const stdPrice = parseFloat(document.getElementById("showStdPrice").value);
    const premPrice = parseFloat(document.getElementById("showPremPrice").value);

    Storage.addShow({
      movieId,
      theaterId,
      screenId,
      showDate: date,
      startTime: time,
      endTime: "21:00",
      standardPrice: stdPrice,
      premiumPrice: premPrice,
      status: "ACTIVE"
    });

    this.closeModal("showModal");
    this.showToast("Show scheduled successfully!", "success");
    this.switchAdminTab("shows");
  },

  // ==================== UTILS & TOASTS ====================
  showToast(message, type = "info") {
    const container = document.getElementById("toastContainer");
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

// Initialize app when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  app.init();
});
