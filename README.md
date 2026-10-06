# 🎬 Filmee Backend - Java Servlets, JDBC & MySQL REST API

An enterprise, transactional Java backend architecture designed for the **Filmee (MovieBook Online Movie Ticket Booking System)** application.

---

## 🏛️ System Architecture

```
[ Frontend / Client (JSP, HTML5, Mobile, React) ]
                         │  HTTP / JSON / CORS
                         ▼
             [ REST Servlets & Controllers ]
           (ApiAuth, ApiMovie, ApiShow, ApiBooking)
                         │
                         ▼
                 [ Service Layer ]
           (Auth, Movie, Booking, Admin)
                         │
                         ▼
                   [ DAO Layer ]
     (UserDAO, MovieDAO, ShowDAO, BookingDAO, DBConnection)
                         │  JDBC
                         ▼
                [ MySQL Database ]
```

---

## 📡 REST API Reference

All endpoints return JSON wrapped in a standard envelope:
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... },
  "timestamp": 1728210000000
}
```

### 1. 🔑 Authentication (`/api/auth`)

| Method | Endpoint | Description | Sample Payload |
|---|---|---|---|
| `POST` | `/api/auth/login` | Authenticate customer or admin | `{"email": "soham@example.com", "password": "user123"}` |
| `POST` | `/api/auth/register` | Register new customer account | `{"fullName": "Rajveer Singh", "email": "rajveer@example.com", "password": "user123", "phone": "9876543210"}` |
| `GET` | `/api/auth/me` | Get active session profile | *None (Requires Session)* |
| `POST` | `/api/auth/logout` | Invalidate current session | *None* |

---

### 2. 🎬 Movie Catalog (`/api/movies`)

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/movies` | Get all movies (supports `?q=search` and `?genre=Sci-Fi`) |
| `GET` | `/api/movies/now-showing` | Retrieve currently active cinema releases |
| `GET` | `/api/movies/upcoming` | Retrieve upcoming release previews |
| `GET` | `/api/movies/{id}` | Get detailed movie metadata by ID |
| `POST` | `/api/movies` | Add new movie *(Admin Only)* |
| `DELETE` | `/api/movies/{id}` | Remove movie from catalog *(Admin Only)* |

---

### 3. 📅 Showtimes & Seat Availability (`/api/shows`)

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/shows?movieId=1` | Get scheduled showtimes for movie |
| `GET` | `/api/shows/seats/{showId}` | Get list of already reserved seats (e.g. `["C4", "C5"]`) |
| `POST` | `/api/shows` | Schedule new show with tier pricing *(Admin Only)* |
| `DELETE` | `/api/shows/{id}` | Cancel/delete scheduled show *(Admin Only)* |

---

### 4. 🎟️ Ticket Reservations & Payments (`/api/bookings`)

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/bookings` | Atomically reserve seats, calculate GST, and record payment |
| `GET` | `/api/bookings/my-bookings` | Retrieve user's reservation history |
| `GET` | `/api/bookings/{id}` | Fetch printable digital e-ticket pass |
| `POST` | `/api/bookings/cancel/{id}` | Cancel reservation, release seats & process refund |

#### Sample Booking Request:
```json
{
  "showId": 101,
  "seats": ["C4", "C5"],
  "paymentMethod": "UPI"
}
```

---

### 5. 🛡️ Admin Metrics (`/api/admin`)

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/admin/metrics` | Returns total tickets sold, gross revenue (₹), catalog count, and recent transactions |

---

## ⚙️ Database Configuration

By default, the backend connects to MySQL at `localhost:3306/moviebook_db`. You can override this using environment variables:

| Variable | Description | Default |
|---|---|---|
| `DB_HOST` | Database host | `localhost` |
| `DB_PORT` | Database port | `3306` |
| `DB_NAME` | Database schema name | `moviebook_db` |
| `DB_USER` | Database username | `root` |
| `DB_PASSWORD` | Database password | `root` |
| `DB_URL` | Full JDBC connection string override | *(optional)* |

---

## 🚀 Building & Running

### 1. Build WAR Package
```bash
mvn clean package
```

### 2. Run on Apache Tomcat
Copy `target/filmee-backend.war` to Tomcat's `webapps/` folder, then start Tomcat:
```bash
catalina.bat run
```
Access the backend APIs at `http://localhost:8080/filmee-backend/api/...`