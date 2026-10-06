package com.filmee.dao;

import com.filmee.model.Booking;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

public class BookingDAO {

    public Booking createBooking(int userId, int showId, List<String> selectedSeats, double totalAmount) {
        String insertBookingSql = "INSERT INTO bookings (booking_reference, user_id, show_id, total_tickets, total_amount, booking_status) VALUES (?, ?, ?, ?, ?, 'CONFIRMED')";
        String insertSeatSql = "INSERT INTO booking_seats (booking_id, show_id, seat_row, seat_number, seat_type, price) VALUES (?, ?, ?, ?, ?, ?)";
        String insertPaymentSql = "INSERT INTO payments (booking_id, transaction_id, payment_method, amount, payment_status) VALUES (?, ?, 'DUMMY_GATEWAY', ?, 'SUCCESS')";

        String refCode = "FLM-2026-" + UUID.randomUUID().toString().substring(0, 5).toUpperCase();

        Connection conn = null;
        try {
            conn = DBConnection.getConnection();
            conn.setAutoCommit(false); // Transaction

            int bookingId = 0;
            try (PreparedStatement ps = conn.prepareStatement(insertBookingSql, Statement.RETURN_GENERATED_KEYS)) {
                ps.setString(1, refCode);
                ps.setInt(2, userId);
                ps.setInt(3, showId);
                ps.setInt(4, selectedSeats.size());
                ps.setDouble(5, totalAmount);
                ps.executeUpdate();

                try (ResultSet rs = ps.getGeneratedKeys()) {
                    if (rs.next()) {
                        bookingId = rs.getInt(1);
                    }
                }
            }

            if (bookingId == 0) {
                conn.rollback();
                return null;
            }

            // Insert seats
            try (PreparedStatement psSeat = conn.prepareStatement(insertSeatSql)) {
                for (String seat : selectedSeats) {
                    String row = seat.substring(0, 1);
                    int num = Integer.parseInt(seat.substring(1));
                    String type = ("A".equalsIgnoreCase(row) || "B".equalsIgnoreCase(row)) ? "PREMIUM" : "STANDARD";
                    double seatPrice = totalAmount / selectedSeats.size();

                    psSeat.setInt(1, bookingId);
                    psSeat.setInt(2, showId);
                    psSeat.setString(3, row);
                    psSeat.setInt(4, num);
                    psSeat.setString(5, type);
                    psSeat.setDouble(6, seatPrice);
                    psSeat.addBatch();
                }
                psSeat.executeBatch();
            }

            // Insert mock payment
            try (PreparedStatement psPay = conn.prepareStatement(insertPaymentSql)) {
                psPay.setInt(1, bookingId);
                psPay.setString(2, "TXN-" + System.currentTimeMillis());
                psPay.setDouble(3, totalAmount);
                psPay.executeUpdate();
            }

            conn.commit();

            Booking booking = new Booking();
            booking.setBookingId(bookingId);
            booking.setBookingReference(refCode);
            booking.setUserId(userId);
            booking.setShowId(showId);
            booking.setTotalTickets(selectedSeats.size());
            booking.setTotalAmount(totalAmount);
            booking.setBookingStatus("CONFIRMED");
            booking.setSeatList(selectedSeats);
            return booking;

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
        String sql = "SELECT b.*, m.title AS movie_title, t.name AS theater_name, sc.screen_number AS screen_name, " +
                     "s.show_date, s.start_time " +
                     "FROM bookings b " +
                     "JOIN shows s ON b.show_id = s.show_id " +
                     "JOIN movies m ON s.movie_id = m.movie_id " +
                     "JOIN screens sc ON s.screen_id = sc.screen_id " +
                     "JOIN theaters t ON sc.theater_id = t.theater_id " +
                     "WHERE b.user_id = ? ORDER BY b.created_at DESC";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, userId);
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    Booking b = mapBooking(rs);
                    b.setSeatList(getSeatsForBooking(conn, b.getBookingId()));
                    list.add(b);
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return list;
    }

    public Booking getBookingById(int bookingId) {
        String sql = "SELECT b.*, m.title AS movie_title, t.name AS theater_name, sc.screen_number AS screen_name, " +
                     "s.show_date, s.start_time " +
                     "FROM bookings b " +
                     "JOIN shows s ON b.show_id = s.show_id " +
                     "JOIN movies m ON s.movie_id = m.movie_id " +
                     "JOIN screens sc ON s.screen_id = sc.screen_id " +
                     "JOIN theaters t ON sc.theater_id = t.theater_id " +
                     "WHERE b.booking_id = ?";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, bookingId);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    Booking b = mapBooking(rs);
                    b.setSeatList(getSeatsForBooking(conn, b.getBookingId()));
                    return b;
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return null;
    }

    private List<String> getSeatsForBooking(Connection conn, int bookingId) {
        List<String> seats = new ArrayList<>();
        String sql = "SELECT CONCAT(seat_row, seat_number) AS seat_code FROM booking_seats WHERE booking_id = ?";
        try (PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, bookingId);
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    seats.add(rs.getString("seat_code"));
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return seats;
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
        b.setMovieTitle(rs.getString("movie_title"));
        b.setTheaterName(rs.getString("theater_name"));
        b.setScreenName(rs.getString("screen_name"));
        b.setShowDate(rs.getString("show_date"));
        b.setShowTime(rs.getString("start_time"));
        return b;
    }
}
