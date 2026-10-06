package com.filmee.dao;

import com.filmee.model.Booking;
import com.filmee.model.BookingSeat;
import com.filmee.model.Payment;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

public class BookingDAO {

    public Booking createBooking(int userId, int showId, List<String> selectedSeats, double totalAmount, String paymentMethod) {
        if (selectedSeats == null || selectedSeats.isEmpty()) {
            return null;
        }

        String checkSeatSql    = "SELECT 1 FROM booking_seats WHERE show_id = ? AND seat_row = ? AND seat_number = ? AND seat_type != 'CANCELLED'";
        String insertBookingSql = "INSERT INTO bookings (booking_reference, user_id, show_id, total_tickets, total_amount, booking_status) VALUES (?, ?, ?, ?, ?, 'CONFIRMED')";
        String insertSeatSql = "INSERT INTO booking_seats (booking_id, show_id, seat_row, seat_number, seat_type, price) VALUES (?, ?, ?, ?, ?, ?)";
        String insertPaymentSql = "INSERT INTO payments (booking_id, transaction_id, payment_method, amount, payment_status) VALUES (?, ?, ?, ?, 'SUCCESS')";

        String refCode = "FLM-2026-" + UUID.randomUUID().toString().substring(0, 5).toUpperCase();
        String txnId = "TXN-MB-" + System.currentTimeMillis();

        Connection conn = null;
        try {
            conn = DBConnection.getConnection();
            conn.setAutoCommit(false); // Begin Transaction

            // 1. Double Booking Check before insertion
            try (PreparedStatement psCheck = conn.prepareStatement(checkSeatSql)) {
                for (String rawSeat : selectedSeats) {
                    String seat = rawSeat.trim();
                    String row = seat.substring(0, 1).toUpperCase();
                    int num = Integer.parseInt(seat.substring(1));

                    psCheck.setInt(1, showId);
                    psCheck.setString(2, row);
                    psCheck.setInt(3, num);
                    try (ResultSet rsCheck = psCheck.executeQuery()) {
                        if (rsCheck.next()) {
                            // Seat is already booked! Rollback transaction
                            conn.rollback();
                            return null;
                        }
                    }
                }
            }

            // 2. Insert into bookings
            int bookingId = 0;
            try (PreparedStatement psBooking = conn.prepareStatement(insertBookingSql, Statement.RETURN_GENERATED_KEYS)) {
                psBooking.setString(1, refCode);
                psBooking.setInt(2, userId);
                psBooking.setInt(3, showId);
                psBooking.setInt(4, selectedSeats.size());
                psBooking.setDouble(5, totalAmount);
                psBooking.executeUpdate();

                try (ResultSet rs = psBooking.getGeneratedKeys()) {
                    if (rs.next()) {
                        bookingId = rs.getInt(1);
                    }
                }
            }

            if (bookingId == 0) {
                conn.rollback();
                return null;
            }

            // 3. Batch insert reserved seats
            List<BookingSeat> seatObjects = new ArrayList<>();
            double pricePerSeat = totalAmount / selectedSeats.size();

            try (PreparedStatement psSeat = conn.prepareStatement(insertSeatSql, Statement.RETURN_GENERATED_KEYS)) {
                for (String rawSeat : selectedSeats) {
                    String seat = rawSeat.trim();
                    String row = seat.substring(0, 1).toUpperCase();
                    int num = Integer.parseInt(seat.substring(1));
                    String type = ("A".equalsIgnoreCase(row) || "B".equalsIgnoreCase(row)) ? "PREMIUM" : "STANDARD";

                    psSeat.setInt(1, bookingId);
                    psSeat.setInt(2, showId);
                    psSeat.setString(3, row);
                    psSeat.setInt(4, num);
                    psSeat.setString(5, type);
                    psSeat.setDouble(6, pricePerSeat);
                    psSeat.addBatch();

                    seatObjects.add(new BookingSeat(0, bookingId, showId, row, num, type, pricePerSeat));
                }
                psSeat.executeBatch();
            }

            // 4. Insert Payment record
            try (PreparedStatement psPay = conn.prepareStatement(insertPaymentSql)) {
                psPay.setInt(1, bookingId);
                psPay.setString(2, txnId);
                psPay.setString(3, paymentMethod != null ? paymentMethod : "DUMMY_GATEWAY");
                psPay.setDouble(4, totalAmount);
                psPay.executeUpdate();
            }

            // Commit Transaction
            conn.commit();

            Booking booking = getBookingById(bookingId);
            return booking != null ? booking : new Booking();

        } catch (SQLException e) {
            if (conn != null) {
                try { conn.rollback(); } catch (SQLException ex) { ex.printStackTrace(); }
            }
            e.printStackTrace();
        } finally {
            if (conn != null) {
                try { conn.setAutoCommit(true); conn.close(); } catch (SQLException e) { e.printStackTrace(); }
            }
        }
        return null;
    }

    public List<Booking> getBookingsByUserId(int userId) {
        List<Booking> list = new ArrayList<>();
        String sql = "SELECT b.*, u.full_name AS customer_name, u.email AS customer_email, u.phone_number AS customer_phone, " +
                     "m.title AS movie_title, m.poster_url, t.name AS theater_name, sc.screen_number AS screen_name, " +
                     "s.show_date, s.start_time, p.payment_id, p.transaction_id, p.payment_method, p.payment_status " +
                     "FROM bookings b " +
                     "JOIN users u ON b.user_id = u.user_id " +
                     "JOIN shows s ON b.show_id = s.show_id " +
                     "JOIN movies m ON s.movie_id = m.movie_id " +
                     "JOIN screens sc ON s.screen_id = sc.screen_id " +
                     "JOIN theaters t ON sc.theater_id = t.theater_id " +
                     "LEFT JOIN payments p ON b.booking_id = p.booking_id " +
                     "WHERE b.user_id = ? ORDER BY b.created_at DESC";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, userId);
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    Booking b = mapBooking(rs);
                    b.setSeats(getSeatsForBooking(conn, b.getBookingId()));
                    b.setSeatCodes(getSeatCodesForBooking(b.getSeats()));
                    list.add(b);
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return list;
    }

    public List<Booking> getAllBookings() {
        List<Booking> list = new ArrayList<>();
        String sql = "SELECT b.*, u.full_name AS customer_name, u.email AS customer_email, u.phone_number AS customer_phone, " +
                     "m.title AS movie_title, m.poster_url, t.name AS theater_name, sc.screen_number AS screen_name, " +
                     "s.show_date, s.start_time, p.payment_id, p.transaction_id, p.payment_method, p.payment_status " +
                     "FROM bookings b " +
                     "JOIN users u ON b.user_id = u.user_id " +
                     "JOIN shows s ON b.show_id = s.show_id " +
                     "JOIN movies m ON s.movie_id = m.movie_id " +
                     "JOIN screens sc ON s.screen_id = sc.screen_id " +
                     "JOIN theaters t ON sc.theater_id = t.theater_id " +
                     "LEFT JOIN payments p ON b.booking_id = p.booking_id " +
                     "ORDER BY b.created_at DESC";
        try (Connection conn = DBConnection.getConnection();
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery(sql)) {
            while (rs.next()) {
                Booking b = mapBooking(rs);
                b.setSeats(getSeatsForBooking(conn, b.getBookingId()));
                b.setSeatCodes(getSeatCodesForBooking(b.getSeats()));
                list.add(b);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return list;
    }

    public Booking getBookingById(int bookingId) {
        String sql = "SELECT b.*, u.full_name AS customer_name, u.email AS customer_email, u.phone_number AS customer_phone, " +
                     "m.title AS movie_title, m.poster_url, t.name AS theater_name, sc.screen_number AS screen_name, " +
                     "s.show_date, s.start_time, p.payment_id, p.transaction_id, p.payment_method, p.payment_status " +
                     "FROM bookings b " +
                     "JOIN users u ON b.user_id = u.user_id " +
                     "JOIN shows s ON b.show_id = s.show_id " +
                     "JOIN movies m ON s.movie_id = m.movie_id " +
                     "JOIN screens sc ON s.screen_id = sc.screen_id " +
                     "JOIN theaters t ON sc.theater_id = t.theater_id " +
                     "LEFT JOIN payments p ON b.booking_id = p.booking_id " +
                     "WHERE b.booking_id = ?";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, bookingId);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    Booking b = mapBooking(rs);
                    b.setSeats(getSeatsForBooking(conn, b.getBookingId()));
                    b.setSeatCodes(getSeatCodesForBooking(b.getSeats()));
                    return b;
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return null;
    }

    public boolean cancelBooking(int bookingId) {
        String updateBookingSql  = "UPDATE bookings      SET booking_status  = 'CANCELLED' WHERE booking_id = ?";
        String updateSeatsSql    = "UPDATE booking_seats SET seat_type       = 'CANCELLED' WHERE booking_id = ?";
        String updatePaymentSql  = "UPDATE payments      SET payment_status  = 'REFUNDED'  WHERE booking_id = ?";

        Connection conn = null;
        try {
            conn = DBConnection.getConnection();
            conn.setAutoCommit(false);

            try (PreparedStatement ps1 = conn.prepareStatement(updateBookingSql)) {
                ps1.setInt(1, bookingId);
                ps1.executeUpdate();
            }

            // Mark seats as cancelled (preserves audit trail, frees seat for re-booking logic)
            try (PreparedStatement ps2 = conn.prepareStatement(updateSeatsSql)) {
                ps2.setInt(1, bookingId);
                ps2.executeUpdate();
            }

            try (PreparedStatement ps3 = conn.prepareStatement(updatePaymentSql)) {
                ps3.setInt(1, bookingId);
                ps3.executeUpdate();
            }

            conn.commit();
            return true;
        } catch (SQLException e) {
            if (conn != null) {
                try { conn.rollback(); } catch (SQLException ex) { ex.printStackTrace(); }
            }
            e.printStackTrace();
        } finally {
            if (conn != null) {
                try { conn.setAutoCommit(true); conn.close(); } catch (SQLException e) { e.printStackTrace(); }
            }
        }
        return false;
    }

    private List<BookingSeat> getSeatsForBooking(Connection conn, int bookingId) {
        List<BookingSeat> seats = new ArrayList<>();
        String sql = "SELECT * FROM booking_seats WHERE booking_id = ? ORDER BY seat_row, seat_number";
        try (PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, bookingId);
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    BookingSeat bs = new BookingSeat();
                    bs.setBookingSeatId(rs.getInt("booking_seat_id"));
                    bs.setBookingId(rs.getInt("booking_id"));
                    bs.setShowId(rs.getInt("show_id"));
                    bs.setSeatRow(rs.getString("seat_row"));
                    bs.setSeatNumber(rs.getInt("seat_number"));
                    bs.setSeatType(rs.getString("seat_type"));
                    bs.setPrice(rs.getDouble("price"));
                    seats.add(bs);
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return seats;
    }

    private List<String> getSeatCodesForBooking(List<BookingSeat> seats) {
        List<String> codes = new ArrayList<>();
        if (seats != null) {
            for (BookingSeat s : seats) {
                codes.add(s.getSeatCode());
            }
        }
        return codes;
    }

    private Booking mapBooking(ResultSet rs) throws SQLException {
        Booking b = new Booking();
        b.setBookingId(rs.getInt("booking_id"));
        b.setBookingReference(rs.getString("booking_reference"));
        b.setUserId(rs.getInt("user_id"));
        b.setShowId(rs.getInt("show_id"));
        b.setTotalTickets(rs.getInt("total_tickets"));
        b.setTotalAmount(rs.getDouble("total_amount"));
        b.setBookingStatus(rs.getString("booking_status"));
        b.setCreatedAt(rs.getTimestamp("created_at"));
        b.setCustomerName(rs.getString("customer_name"));
        b.setCustomerEmail(rs.getString("customer_email"));
        b.setCustomerPhone(rs.getString("customer_phone"));
        b.setMovieTitle(rs.getString("movie_title"));
        b.setPosterUrl(rs.getString("poster_url"));
        b.setTheaterName(rs.getString("theater_name"));
        b.setScreenName(rs.getString("screen_name"));
        b.setShowDate(rs.getString("show_date"));
        b.setShowTime(rs.getString("start_time"));

        if (rs.getString("transaction_id") != null) {
            Payment p = new Payment();
            p.setPaymentId(rs.getInt("payment_id"));
            p.setBookingId(b.getBookingId());
            p.setTransactionId(rs.getString("transaction_id"));
            p.setPaymentMethod(rs.getString("payment_method"));
            p.setAmount(b.getTotalAmount());
            p.setPaymentStatus(rs.getString("payment_status"));
            b.setPayment(p);
        }
        return b;
    }
}
