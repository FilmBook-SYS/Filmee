/**
 * Filmee - Storage Management & Mock DAO Layer
 */
const Storage = {
  KEYS: {
    USERS: "filmee_users",
    MOVIES: "filmee_movies",
    THEATERS: "filmee_theaters",
    SHOWS: "filmee_shows",
    BOOKINGS: "filmee_bookings",
    BOOKED_SEATS: "filmee_booked_seats",
    CURRENT_USER: "filmee_current_user"
  },

  // Initialize LocalStorage with default seeds if empty or updated
  init() {
    const DATA_VERSION = "v8_official_theatrical_posters";
    const currentVersion = localStorage.getItem("filmee_data_version");

    if (!localStorage.getItem(this.KEYS.MOVIES) || currentVersion !== DATA_VERSION) {
      localStorage.setItem(this.KEYS.MOVIES, JSON.stringify(INITIAL_DATA.movies));
      localStorage.setItem(this.KEYS.SHOWS, JSON.stringify(INITIAL_DATA.shows));
      localStorage.setItem(this.KEYS.THEATERS, JSON.stringify(INITIAL_DATA.theaters));
      localStorage.setItem("filmee_data_version", DATA_VERSION);
    }
    if (!localStorage.getItem(this.KEYS.THEATERS)) {
      localStorage.setItem(this.KEYS.THEATERS, JSON.stringify(INITIAL_DATA.theaters));
    }
    if (!localStorage.getItem(this.KEYS.SHOWS)) {
      localStorage.setItem(this.KEYS.SHOWS, JSON.stringify(INITIAL_DATA.shows));
    }
    if (!localStorage.getItem(this.KEYS.USERS)) {
      localStorage.setItem(this.KEYS.USERS, JSON.stringify(INITIAL_DATA.users));
    }
    if (!localStorage.getItem(this.KEYS.BOOKINGS)) {
      localStorage.setItem(this.KEYS.BOOKINGS, JSON.stringify(INITIAL_DATA.bookings));
    }
    if (!localStorage.getItem(this.KEYS.BOOKED_SEATS)) {
      localStorage.setItem(this.KEYS.BOOKED_SEATS, JSON.stringify(INITIAL_DATA.bookedSeatsMap));
    }
    if (!localStorage.getItem(this.KEYS.CURRENT_USER)) {
      // Default to customer Soham for instant preview
      localStorage.setItem(this.KEYS.CURRENT_USER, JSON.stringify(INITIAL_DATA.users[1]));
    }
  },

  // Generic Get / Set
  get(key) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      console.error("Storage read error:", e);
      return null;
    }
  },

  set(key, val) {
    try {
      localStorage.setItem(key, JSON.stringify(val));
    } catch (e) {
      console.error("Storage write error:", e);
    }
  },

  // Auth operations
  getCurrentUser() {
    return this.get(this.KEYS.CURRENT_USER);
  },

  setCurrentUser(user) {
    this.set(this.KEYS.CURRENT_USER, user);
  },

  logout() {
    localStorage.removeItem(this.KEYS.CURRENT_USER);
  },

  getUsers() {
    return this.get(this.KEYS.USERS) || [];
  },

  addUser(user) {
    const users = this.getUsers();
    user.userId = Date.now();
    users.push(user);
    this.set(this.KEYS.USERS, users);
    return user;
  },

  // Movies operations
  getMovies() {
    return this.get(this.KEYS.MOVIES) || [];
  },

  getMovieById(id) {
    const movies = this.getMovies();
    return movies.find(m => m.movieId === parseInt(id));
  },

  saveMovie(movieData) {
    const movies = this.getMovies();
    if (movieData.movieId) {
      const idx = movies.findIndex(m => m.movieId === parseInt(movieData.movieId));
      if (idx !== -1) {
        movies[idx] = { ...movies[idx], ...movieData };
      }
    } else {
      movieData.movieId = Date.now();
      movies.unshift(movieData);
    }
    this.set(this.KEYS.MOVIES, movies);
    return movieData;
  },

  deleteMovie(id) {
    let movies = this.getMovies();
    movies = movies.filter(m => m.movieId !== parseInt(id));
    this.set(this.KEYS.MOVIES, movies);
  },

  // Theaters & Shows
  getTheaters() {
    return this.get(this.KEYS.THEATERS) || [];
  },

  getShows() {
    return this.get(this.KEYS.SHOWS) || [];
  },

  getShowsForMovie(movieId, date) {
    const shows = this.getShows();
    return shows.filter(s => {
      const matchMovie = s.movieId === parseInt(movieId);
      const matchDate = date ? s.showDate === date : true;
      return matchMovie && matchDate && s.status === "ACTIVE";
    });
  },

  getShowById(showId) {
    const shows = this.getShows();
    return shows.find(s => s.showId === parseInt(showId));
  },

  addShow(showData) {
    const shows = this.getShows();
    showData.showId = Date.now();
    shows.push(showData);
    this.set(this.KEYS.SHOWS, shows);
    return showData;
  },

  // Booked Seats
  getBookedSeats(showId) {
    const map = this.get(this.KEYS.BOOKED_SEATS) || {};
    return map[showId.toString()] || [];
  },

  reserveSeats(showId, seatArray) {
    const map = this.get(this.KEYS.BOOKED_SEATS) || {};
    const key = showId.toString();
    const existing = map[key] || [];

    // Check collision
    const hasCollision = seatArray.some(seat => existing.includes(seat));
    if (hasCollision) {
      return { success: false, message: "One or more seats have just been booked by another customer!" };
    }

    map[key] = [...existing, ...seatArray];
    this.set(this.KEYS.BOOKED_SEATS, map);
    return { success: true };
  },

  // Bookings
  getBookings() {
    return this.get(this.KEYS.BOOKINGS) || [];
  },

  getBookingsForUser(userId) {
    const bookings = this.getBookings();
    return bookings.filter(b => b.userId === parseInt(userId));
  },

  createBooking(booking) {
    const bookings = this.getBookings();
    booking.bookingId = Date.now();
    booking.bookingReference = `FLM-2026-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
    booking.createdAt = new Date().toISOString();
    booking.status = "CONFIRMED";

    bookings.unshift(booking);
    this.set(this.KEYS.BOOKINGS, bookings);
    return booking;
  },

  cancelBooking(bookingId) {
    const bookings = this.getBookings();
    const idx = bookings.findIndex(b => b.bookingId === parseInt(bookingId));
    if (idx !== -1) {
      bookings[idx].status = "CANCELLED";
      
      // Free up seats
      const showId = bookings[idx].showId;
      const seatsToFree = bookings[idx].seats || [];
      const map = this.get(this.KEYS.BOOKED_SEATS) || {};
      if (map[showId.toString()]) {
        map[showId.toString()] = map[showId.toString()].filter(s => !seatsToFree.includes(s));
        this.set(this.KEYS.BOOKED_SEATS, map);
      }

      this.set(this.KEYS.BOOKINGS, bookings);
      return true;
    }
    return false;
  }
};
