# MovieBook Database Setup & Documentation

This directory contains the database design and initial seed data for the **MovieBook (Online Movie Ticket Booking System)** application.

## 📂 Files

- **`schema.sql`**: Complete MySQL DDL definitions including tables, indexes, relationships, and integrity constraints.
- **`seed.sql`**: Initial bootstrap data (Administrator, demo customers, multiplex auditoriums, movies, show timings, and sample booking).

---

## 🗄️ Database Tables Overview

| Table | Description |
|---|---|
| `users` | Customer & Administrator authentication with roles (`CUSTOMER`, `ADMIN`). |
| `movies` | Movie metadata (title, genre, language, duration, poster/trailer URLs, status). |
| `theaters` | Multiplex/theater entity with city and address. |
| `screens` | Auditoriums with row and seat grid configuration. |
| `shows` | Show schedule mapping movies to screens with date, time, and pricing tiers. |
| `bookings` | Ticket reservations with reference code (`MB-YYYY-XXXXX`) and pricing totals. |
| `booking_seats` | Individual reserved seats with unique composite key `(show_id, seat_row, seat_number)` to prevent double booking. |
| `payments` | Dummy checkout transactions and payment audit logs. |

---

## 🚀 Setup Instructions

### 1. Execute Schema and Seed
Open your MySQL terminal or MySQL Workbench and run:

```bash
mysql -u root -p < database/schema.sql
mysql -u root -p < database/seed.sql
```

### 2. JDBC Connection Details
In your Java `DBConnection.java` or `DatabaseUtil.java` helper class:

```java
String url = "jdbc:mysql://localhost:3306/moviebook_db?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC";
String username = "root";
String password = "your_mysql_password";

Class.forName("com.mysql.cj.jdbc.Driver");
Connection conn = DriverManager.getConnection(url, username, password);
```

### 3. Default Demo Accounts
- **Admin**: `admin@moviebook.com` / `admin123`
- **Customer**: `soham@example.com` / `user123`
