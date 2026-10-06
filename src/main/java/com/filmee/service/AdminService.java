package com.filmee.service;

import com.filmee.dao.BookingDAO;
import com.filmee.dao.MovieDAO;
import com.filmee.dao.ShowDAO;
import com.filmee.dao.UserDAO;
import com.filmee.model.Booking;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class AdminService {
    private final BookingDAO bookingDAO;
    private final MovieDAO movieDAO;
    private final ShowDAO showDAO;
    private final UserDAO userDAO;

    public AdminService() {
        this.bookingDAO = new BookingDAO();
        this.movieDAO = new MovieDAO();
        this.showDAO = new ShowDAO();
        this.userDAO = new UserDAO();
    }

    public Map<String, Object> getDashboardMetrics() {
        List<Booking> bookings = bookingDAO.getAllBookings();
        int totalTickets = 0;
        double totalRevenue = 0.0;

        for (Booking b : bookings) {
            if ("CONFIRMED".equalsIgnoreCase(b.getBookingStatus())) {
                totalTickets += b.getTotalTickets();
                totalRevenue += b.getTotalAmount();
            }
        }

        Map<String, Object> metrics = new HashMap<>();
        metrics.put("totalTicketsSold", totalTickets);
        metrics.put("grossRevenue", Math.round(totalRevenue * 100.0) / 100.0);
        metrics.put("totalMovies", movieDAO.getAllMovies().size());
        metrics.put("totalShows", showDAO.getAllShows().size());
        metrics.put("totalUsers", userDAO.getAllUsers().size());
        metrics.put("recentBookings", bookings.size() > 10 ? bookings.subList(0, 10) : bookings);

        return metrics;
    }
}
