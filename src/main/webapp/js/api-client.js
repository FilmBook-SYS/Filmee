/**
 * Filmee - Client-Side REST API Connector
 * Bridges UI interactions to Java Servlets & REST endpoints (/api/...)
 */
const ApiClient = {
  baseUrl: window.location.origin + (window.location.pathname.includes("/Filmee") || window.location.pathname.includes("/filmee") ? window.location.pathname.substring(0, window.location.pathname.indexOf("/api") !== -1 ? window.location.pathname.indexOf("/api") : window.location.pathname.lastIndexOf("/")) : "") + "/api",

  async request(endpoint, options = {}) {
    const defaultHeaders = {
      "Content-Type": "application/json",
      "Accept": "application/json"
    };

    const config = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers
      }
    };

    if (options.body && typeof options.body === "object") {
      config.body = JSON.stringify(options.body);
    }

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, config);
      const data = await response.json();
      return data;
    } catch (error) {
      console.warn(`[ApiClient] REST Endpoint (${endpoint}) unreachable. Falling back to local storage:`, error);
      return null;
    }
  },

  // Auth Endpoints
  auth: {
    login(email, password) {
      return ApiClient.request("/auth/login", {
        method: "POST",
        body: { email, password }
      });
    },
    register(fullName, email, password, phone) {
      return ApiClient.request("/auth/register", {
        method: "POST",
        body: { fullName, email, password, phone }
      });
    },
    getMe() {
      return ApiClient.request("/auth/me", { method: "GET" });
    },
    logout() {
      return ApiClient.request("/auth/logout", { method: "POST" });
    }
  },

  // Movie Endpoints
  movies: {
    getAll(query = "", genre = "") {
      const params = new URLSearchParams();
      if (query) params.append("q", query);
      if (genre) params.append("genre", genre);
      return ApiClient.request(`/movies?${params.toString()}`, { method: "GET" });
    },
    getNowShowing() {
      return ApiClient.request("/movies/now-showing", { method: "GET" });
    },
    getUpcoming() {
      return ApiClient.request("/movies/upcoming", { method: "GET" });
    },
    getById(movieId) {
      return ApiClient.request(`/movies/${movieId}`, { method: "GET" });
    },
    create(movieData) {
      return ApiClient.request("/movies", {
        method: "POST",
        body: movieData
      });
    },
    delete(movieId) {
      return ApiClient.request(`/movies/${movieId}`, { method: "DELETE" });
    }
  },

  // Shows & Seat Availability Endpoints
  shows: {
    getByMovie(movieId, date = "") {
      const params = new URLSearchParams({ movieId });
      if (date) params.append("date", date);
      return ApiClient.request(`/shows?${params.toString()}`, { method: "GET" });
    },
    getBookedSeats(showId) {
      return ApiClient.request(`/shows/seats/${showId}`, { method: "GET" });
    },
    schedule(showData) {
      return ApiClient.request("/shows", {
        method: "POST",
        body: showData
      });
    },
    delete(showId) {
      return ApiClient.request(`/shows/${showId}`, { method: "DELETE" });
    }
  },

  // Booking Endpoints
  bookings: {
    create(showId, seats, paymentMethod = "DUMMY_GATEWAY") {
      return ApiClient.request("/bookings", {
        method: "POST",
        body: { showId, seats, paymentMethod }
      });
    },
    getMyBookings() {
      return ApiClient.request("/bookings/my-bookings", { method: "GET" });
    },
    getTicket(bookingId) {
      return ApiClient.request(`/bookings/${bookingId}`, { method: "GET" });
    },
    cancel(bookingId) {
      return ApiClient.request(`/bookings/cancel/${bookingId}`, { method: "POST" });
    }
  },

  // Admin Metrics
  admin: {
    getMetrics() {
      return ApiClient.request("/admin/metrics", { method: "GET" });
    }
  }
};
