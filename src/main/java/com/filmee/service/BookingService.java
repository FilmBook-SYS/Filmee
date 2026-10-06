package com.filmee.service;

import com.filmee.dao.BookingDAO;
import com.filmee.dao.ShowDAO;
import com.filmee.model.Booking;
import com.filmee.model.Show;
import java.util.List;

public class BookingService {
    private final BookingDAO bookingDAO;
    private final ShowDAO showDAO;

    public BookingService() {
        this.bookingDAO = new BookingDAO();
        this.showDAO = new ShowDAO();
    }

    public BookingService(BookingDAO bookingDAO, ShowDAO showDAO) {
        this.bookingDAO = bookingDAO;
        this.showDAO = showDAO;
    }

    public double calculateTotalWithGst(int showId, List<String> seatCodes) {
        Show show = showDAO.getShowById(showId);
        if (show == null || seatCodes == null || seatCodes.isEmpty()) {
            return 0.0;
        }

        double subtotal = 0.0;
        for (String raw : seatCodes) {
            String row = raw.trim().substring(0, 1).toUpperCase();
            if ("A".equals(row) || "B".equals(row)) {
                subtotal += show.getPremiumPrice();
            } else {
                subtotal += show.getStandardPrice();
            }
        }
        double tax = subtotal * 0.18; // 18% GST
        return Math.round((subtotal + tax) * 100.0) / 100.0;
    }

    public Booking reserveSeats(int userId, int showId, List<String> seatCodes, String paymentMethod) {
        if (seatCodes == null || seatCodes.isEmpty() || seatCodes.size() > 10) {
            return null;
        }

        double grandTotal = calculateTotalWithGst(showId, seatCodes);
        return bookingDAO.createBooking(userId, showId, seatCodes, grandTotal, paymentMethod);
    }

    public List<Booking> getUserBookings(int userId) {
        return bookingDAO.getBookingsByUserId(userId);
    }

    public Booking getBookingDetails(int bookingId) {
        return bookingDAO.getBookingById(bookingId);
    }

    public boolean cancelUserBooking(int bookingId, int userId) {
        Booking b = bookingDAO.getBookingById(bookingId);
        if (b != null && b.getUserId() == userId) {
            return bookingDAO.cancelBooking(bookingId);
        }
        return false;
    }
}
