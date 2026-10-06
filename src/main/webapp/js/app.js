/**
 * Filmee - UI Application Controller (Integrated with Java REST Backend)
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
  selectedSeats: [],
  holdTimerInterval: null,
  secondsLeft: 300,

  // Admin Active Tab
  currentAdminTab: "overview",

  async init() {
    Storage.init();

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
    this.renderMovies();
    this.setupDateRibbon();
    this.attachEventListeners();
    console.log("🎬 Filmee Full-Stack UI Integration Initialized.");
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

    if (viewName === "home" || viewName === "movies") {
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
          <span><i class="fa-solid fa-star text-accent"></i> ${featured.rating || '9.0'} / 10</span>
          <span>•</span>
          <span><i class="fa-regular fa-clock"></i> ${featured.durationMinutes} min</span>
          <span>•</span>
          <span>${featured.genre}</span>
        </div>
        <p class="featured-desc">${(featured.description || "").substring(0, 180)}...</p>
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
        movies = movies.filter(m => m.genre.toLowerCase().includes(this.selectedGenre.toLowerCase()));
      }
      if (this.searchQuery) {
        movies = movies.filter(m =>
          m.title.toLowerCase().includes(this.searchQuery) ||
          m.genre.toLowerCase().includes(this.searchQuery)
        );
      }
    }

    if (movies.length === 0) {
      grid.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 60px 20px; color: var(--text-muted);">
          <i class="fa-solid fa-film-slash fa-3x" style="margin-bottom: 16px;"></i>
          <h3>No movies found</h3>
          <p>Try adjusting your search query or filter.</p>
        </div>
      `;
      return;
    }

    grid.innerHTML = movies.map(movie => `
      <div class="movie-card" onclick="app.openMovieDetails(${movie.movieId})">
        <div class="movie-poster-wrap">
          <img src="${movie.posterUrl}" alt="${movie.title}" loading="lazy" />
          <div class="movie-badge-float">
            <i class="fa-solid fa-star"></i> ${movie.rating || '9.0'}
          </div>
        </div>
        <div class="movie-card-info">
          <h3 class="movie-title">${movie.title}</h3>
          <div class="movie-genre">${movie.genre}</div>
          <div class="movie-card-footer">
            <span class="movie-duration">${movie.durationMinutes}m • ${(movie.language || 'English').split(",")[0]}</span>
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
          <span class="badge" style="background: rgba(255,183,3,0.15); color: var(--accent-gold);"><i class="fa-solid fa-star"></i> ${movie.rating || '9.0'} / 10</span>
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
          <strong>Starring:</strong> ${movie.cast || 'Lead Cast'}
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
            <span class="badge badge-info"><i class="fa-solid fa-sparkles"></i> 4K Laser</span>
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

  // ==================== SEAT SELECTION ====================
  startSeatSelection(showId) {
    const show = Storage.getShowById(showId);
    if (!show) return;

    this.selectedShow = show;
    this.selectedSeats = [];

    const theater = Storage.getTheaters().find(t => t.theaterId === show.theaterId);
    const screen = theater?.screens.find(s => s.screenId === show.screenId);

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
    const revenue = bookings.reduce((sum, b) => sum + (b.grandTotal || b.totalAmount || 0), 0);

    if (tab === "overview") {
      container.innerHTML = `
        <div class="admin-metrics-grid">
          <div class="metric-card">
            <div class="metric-icon" style="background: rgba(255,94,58,0.15); color: var(--accent-primary);"><i class="fa-solid fa-ticket"></i></div>
            <div>
              <div class="metric-val">${bookings.length}</div>
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
              <div class="metric-val">${movies.length}</div>
              <div class="metric-title">Active Movies</div>
            </div>
          </div>
        </div>
      `;
    }
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
