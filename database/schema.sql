-- =============================================================================
-- MovieBook: Online Movie Ticket Booking System
-- Database Schema Definition (MySQL)
-- =============================================================================

CREATE DATABASE IF NOT EXISTS moviebook_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE moviebook_db;

-- -------------------------------------------------------------
-- 1. Table: users
-- Supports Customer and Admin accounts
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    phone_number VARCHAR(20),
    role ENUM('CUSTOMER', 'ADMIN') NOT NULL DEFAULT 'CUSTOMER',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- -------------------------------------------------------------
-- 2. Table: movies
-- Stores movie catalog information
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS movies (
    movie_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    genre VARCHAR(100),
    language VARCHAR(50),
    duration_minutes INT NOT NULL,
    release_date DATE,
    poster_url VARCHAR(500),
    trailer_url VARCHAR(500),
    status ENUM('NOW_SHOWING', 'UPCOMING', 'ARCHIVED') DEFAULT 'NOW_SHOWING',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- -------------------------------------------------------------
-- 3. Table: theaters
-- Supports single or multi-theater operations
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS theaters (
    theater_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    city VARCHAR(100) NOT NULL,
    address VARCHAR(255),
    total_screens INT DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- -------------------------------------------------------------
-- 4. Table: screens (Auditoriums)
-- Defines seating grid capacity
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS screens (
    screen_id INT AUTO_INCREMENT PRIMARY KEY,
    theater_id INT NOT NULL,
    screen_number VARCHAR(20) NOT NULL,
    total_rows INT NOT NULL DEFAULT 10,
    seats_per_row INT NOT NULL DEFAULT 12,
    total_capacity INT GENERATED ALWAYS AS (total_rows * seats_per_row) STORED,
    FOREIGN KEY (theater_id) REFERENCES theaters(theater_id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- -------------------------------------------------------------
-- 5. Table: shows
-- Links movies to specific screens, dates, times, and tier pricing
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS shows (
    show_id INT AUTO_INCREMENT PRIMARY KEY,
    movie_id INT NOT NULL,
    screen_id INT NOT NULL,
    show_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    standard_price DECIMAL(8, 2) NOT NULL DEFAULT 150.00,
    premium_price DECIMAL(8, 2) NOT NULL DEFAULT 250.00,
    status ENUM('ACTIVE', 'CANCELLED', 'COMPLETED') DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (movie_id) REFERENCES movies(movie_id) ON DELETE CASCADE,
    FOREIGN KEY (screen_id) REFERENCES screens(screen_id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- -------------------------------------------------------------
-- 6. Table: bookings
-- Records reservation transactions and confirmation codes
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS bookings (
    booking_id INT AUTO_INCREMENT PRIMARY KEY,
    booking_reference VARCHAR(30) NOT NULL UNIQUE,
    user_id INT NOT NULL,
    show_id INT NOT NULL,
    total_tickets INT NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    booking_status ENUM('CONFIRMED', 'CANCELLED') DEFAULT 'CONFIRMED',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE RESTRICT,
    FOREIGN KEY (show_id) REFERENCES shows(show_id) ON DELETE RESTRICT
) ENGINE=InnoDB;

-- -------------------------------------------------------------
-- 7. Table: booking_seats
-- Prevents double-booking via UNIQUE composite constraint
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS booking_seats (
    booking_seat_id INT AUTO_INCREMENT PRIMARY KEY,
    booking_id INT NOT NULL,
    show_id INT NOT NULL,
    seat_row CHAR(2) NOT NULL,
    seat_number INT NOT NULL,
    seat_type ENUM('STANDARD', 'PREMIUM') DEFAULT 'STANDARD',
    price DECIMAL(8, 2) NOT NULL,
    
    FOREIGN KEY (booking_id) REFERENCES bookings(booking_id) ON DELETE CASCADE,
    FOREIGN KEY (show_id) REFERENCES shows(show_id) ON DELETE CASCADE,
    UNIQUE KEY uq_show_seat (show_id, seat_row, seat_number)
) ENGINE=InnoDB;

-- -------------------------------------------------------------
-- 8. Table: payments
-- Records dummy payment and transaction logs
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS payments (
    payment_id INT AUTO_INCREMENT PRIMARY KEY,
    booking_id INT NOT NULL UNIQUE,
    transaction_id VARCHAR(100) NOT NULL UNIQUE,
    payment_method ENUM('CARD', 'UPI', 'NET_BANKING', 'DUMMY_GATEWAY') DEFAULT 'DUMMY_GATEWAY',
    amount DECIMAL(10, 2) NOT NULL,
    payment_status ENUM('SUCCESS', 'FAILED', 'REFUNDED') DEFAULT 'SUCCESS',
    payment_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (booking_id) REFERENCES bookings(booking_id) ON DELETE CASCADE
) ENGINE=InnoDB;
