-- =============================================================================
-- MovieBook: Online Movie Ticket Booking System
-- Initial Seed Data
-- =============================================================================

USE moviebook_db;

-- 1. Default Users (Admin & Customer)
INSERT INTO users (full_name, email, password_hash, phone_number, role) VALUES
('System Administrator', 'admin@moviebook.com', 'admin123', '9876543210', 'ADMIN'),
('Soham Sonawan', 'soham@example.com', 'user123', '9876543211', 'CUSTOMER'),
('Rajveer Singh', 'rajveer@example.com', 'user123', '9876543212', 'CUSTOMER'),
('Siddhant Sinalkar', 'siddhant@example.com', 'user123', '9876543213', 'CUSTOMER');

-- 2. Sample Theater and Auditoriums
INSERT INTO theaters (name, city, address, total_screens) VALUES
('MovieBook Grand Multiplex', 'Thane', 'Ghodbunder Road, Thane West', 2);

INSERT INTO screens (theater_id, screen_number, total_rows, seats_per_row) VALUES
(1, 'Audi 1 (IMAX)', 8, 10),
(1, 'Audi 2 (Dolby Atmos)', 6, 8);

-- 3. Movie Catalog
INSERT INTO movies (title, description, genre, language, duration_minutes, release_date, poster_url, trailer_url, status) VALUES
('Dune: Part Two', 'Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family.', 'Sci-Fi / Adventure', 'English', 166, '2024-03-01', 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=500', 'https://www.youtube.com', 'NOW_SHOWING'),
('Oppenheimer', 'The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb.', 'Biography / Drama', 'English', 180, '2023-07-21', 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500', 'https://www.youtube.com', 'NOW_SHOWING'),
('Interstellar', 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity survival.', 'Sci-Fi / Drama', 'English', 169, '2014-11-07', 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=500', 'https://www.youtube.com', 'NOW_SHOWING'),
('Spider-Man: Beyond the Spider-Verse', 'Miles Morales catapults across the Multiverse to protect its very existence.', 'Animation / Action', 'English', 140, '2025-06-15', 'https://images.unsplash.com/photo-1635805737707-575885ab0820?w=500', 'https://www.youtube.com', 'UPCOMING');

-- 4. Scheduled Shows
INSERT INTO shows (movie_id, screen_id, show_date, start_time, end_time, standard_price, premium_price, status) VALUES
(1, 1, CURDATE(), '14:30:00', '17:16:00', 180.00, 300.00, 'ACTIVE'),
(1, 1, CURDATE(), '18:30:00', '21:16:00', 200.00, 350.00, 'ACTIVE'),
(2, 2, CURDATE(), '15:00:00', '18:00:00', 150.00, 250.00, 'ACTIVE'),
(2, 2, CURDATE(), '19:00:00', '22:00:00', 170.00, 280.00, 'ACTIVE'),
(3, 1, DATE_ADD(CURDATE(), INTERVAL 1 DAY), '20:00:00', '22:49:00', 200.00, 320.00, 'ACTIVE');

-- 5. Sample Booking and Payment
INSERT INTO bookings (booking_reference, user_id, show_id, total_tickets, total_amount, booking_status) VALUES
('MB-2026-A109F', 2, 1, 2, 360.00, 'CONFIRMED');

INSERT INTO booking_seats (booking_id, show_id, seat_row, seat_number, seat_type, price) VALUES
(1, 1, 'C', 4, 'STANDARD', 180.00),
(1, 1, 'C', 5, 'STANDARD', 180.00);

INSERT INTO payments (booking_id, transaction_id, payment_method, amount, payment_status) VALUES
(1, 'TXN-MB-987654321', 'DUMMY_GATEWAY', 360.00, 'SUCCESS');
