# 🎬 Filmee - Premium Online Movie Ticket Booking System

A state-of-the-art, fully functional web application frontend for **Filmee** (formerly MovieBook) designed for seamless online movie ticket reservations, live seat selection, instant digital e-ticket generation, and comprehensive cinema administration.

---

## 🌟 Key Features

### 1. 🎟️ End-to-End Customer Booking Journey
- **Movie Discovery**: Browse Now Showing and Coming Soon movies, filter by genre (Action, Sci-Fi, Drama, Animation, etc.), and perform live search.
- **Showtime & Theater Picker**: Select date ribbons (Today, Tomorrow, upcoming dates), multiplexes, and auditoriums (IMAX 3D, Dolby Atmos, 4DX).
- **Interactive Seat Matrix**: Real-time cinema curve screen, Standard vs. Premium Recliner seat tiers, dynamic pricing calculations, double-booking prevention, and 5-minute seat hold timer.
- **Checkout & Simulated Payment Gateway**: Order breakdown with 18% GST tax calculation, supporting Card, UPI / QR simulation, and 1-Click test pay.
- **Instant Digital E-Ticket**: Printable ticket pass with dynamic QR code, Barcode, booking reference ID, seat assignments, and date/time.

### 2. 🔐 Authentication & Roles
- Customer Sign In / Sign Up with demo pre-fill buttons.
- Admin role (`admin@filmee.com` / `admin`) with access to the Admin Control Center.

### 3. 🛡️ Admin Management Dashboard
- **Live Metrics**: Total Tickets Sold, Gross Revenue (₹), Total Catalog Movies, and User Accounts.
- **Movie Management**: Add, edit, remove movies, and toggle status between Now Showing & Coming Soon.
- **Show Scheduling**: Schedule shows with custom standard/premium pricing and auditorium mapping.
- **Audit Logs**: View all customer bookings and transaction statuses.

### 4. 💾 State Persistence
- All catalog items, auditoriums, shows, seat reservations, and user tickets persist in the browser's `localStorage` across page reloads.

---

## 🚀 How to Run Locally

Since this is a vanilla modern web application (HTML5, CSS3, JavaScript ES6+), you can run it instantly using any static server or by opening `index.html` in your browser:

### Option 1: Using Python
```bash
python -m http.server 3000
```
Then visit `http://localhost:3000` in your web browser.

### Option 2: Using Node.js `npx serve`
```bash
npx serve .
```

### Option 3: Direct File Open
Simply double-click `index.html` to open it in Chrome, Edge, Safari, or Firefox.

---

## 🗂️ Project Structure

```
Filmee/
├── index.html          # Main SPA interface & modals
├── css/
│   └── style.css       # Dark cinema design system, glassmorphism & responsive layouts
├── js/
│   ├── data.js         # Seed database (movies, auditoriums, shows, default users)
│   ├── storage.js      # Storage management & DAO persistence layer
│   └── app.js          # Core controller, seat map renderer, checkout & admin logic
└── README.md           # Documentation
```