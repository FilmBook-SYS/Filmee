package com.filmee.controller;

import com.filmee.model.ApiResponse;
import com.filmee.model.Booking;
import com.filmee.model.User;
import com.filmee.service.BookingService;
import com.filmee.util.JsonUtil;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.*;
import java.io.BufferedReader;
import java.io.IOException;
import java.util.List;
import java.util.Map;

@WebServlet(name = "ApiBookingServlet", urlPatterns = {"/api/bookings/*"})
public class ApiBookingServlet extends HttpServlet {
    private final BookingService bookingService = new BookingService();

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        HttpSession session = request.getSession(false);
        User user = session != null ? (User) session.getAttribute("user") : null;

        if (user == null) {
            JsonUtil.sendJsonResponse(response, HttpServletResponse.SC_UNAUTHORIZED, ApiResponse.error("User not authenticated."));
            return;
        }

        String pathInfo = request.getPathInfo();

        if (pathInfo == null || "/".equals(pathInfo) || "/my-bookings".equalsIgnoreCase(pathInfo)) {
            List<Booking> list = bookingService.getUserBookings(user.getUserId());
            JsonUtil.sendJsonResponse(response, HttpServletResponse.SC_OK, ApiResponse.ok(list));
        } else {
            try {
                int bookingId = Integer.parseInt(pathInfo.substring(1));
                Booking booking = bookingService.getBookingDetails(bookingId);

                if (booking != null && (user.isAdmin() || booking.getUserId() == user.getUserId())) {
                    JsonUtil.sendJsonResponse(response, HttpServletResponse.SC_OK, ApiResponse.ok(booking));
                } else {
                    JsonUtil.sendJsonResponse(response, HttpServletResponse.SC_NOT_FOUND, ApiResponse.error("Booking not found"));
                }
            } catch (NumberFormatException e) {
                JsonUtil.sendJsonResponse(response, HttpServletResponse.SC_BAD_REQUEST, ApiResponse.error("Invalid booking ID"));
            }
        }
    }

    @Override
    @SuppressWarnings("unchecked")
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        HttpSession session = request.getSession(false);
        User user = session != null ? (User) session.getAttribute("user") : null;

        if (user == null) {
            JsonUtil.sendJsonResponse(response, HttpServletResponse.SC_UNAUTHORIZED, ApiResponse.error("Please sign in to complete your booking."));
            return;
        }

        String pathInfo = request.getPathInfo();

        if (pathInfo != null && pathInfo.contains("/cancel/")) {
            int bookingId = Integer.parseInt(pathInfo.substring(pathInfo.lastIndexOf("/") + 1));
            boolean success = bookingService.cancelUserBooking(bookingId, user.getUserId());
            if (success) {
                JsonUtil.sendJsonResponse(response, HttpServletResponse.SC_OK, ApiResponse.ok("Booking cancelled and refunded successfully", null));
            } else {
                JsonUtil.sendJsonResponse(response, HttpServletResponse.SC_BAD_REQUEST, ApiResponse.error("Failed to cancel booking."));
            }
            return;
        }

        Map<String, Object> payload = parseJsonPayload(request);
        if (payload == null || !payload.containsKey("showId") || !payload.containsKey("seats")) {
            JsonUtil.sendJsonResponse(response, HttpServletResponse.SC_BAD_REQUEST, ApiResponse.error("Missing showId or seats in payload"));
            return;
        }

        int showId = ((Number) payload.get("showId")).intValue();
        List<String> seats = (List<String>) payload.get("seats");
        String paymentMethod = (String) payload.get("paymentMethod");

        Booking booking = bookingService.reserveSeats(user.getUserId(), showId, seats, paymentMethod);

        if (booking != null && booking.getBookingId() > 0) {
            JsonUtil.sendJsonResponse(response, HttpServletResponse.SC_CREATED, ApiResponse.ok("Booking confirmed successfully!", booking));
        } else {
            JsonUtil.sendJsonResponse(response, HttpServletResponse.SC_CONFLICT, ApiResponse.error("One or more selected seats are already booked! Please select other seats."));
        }
    }

    @SuppressWarnings("unchecked")
    private Map<String, Object> parseJsonPayload(HttpServletRequest request) throws IOException {
        StringBuilder sb = new StringBuilder();
        try (BufferedReader reader = request.getReader()) {
            String line;
            while ((line = reader.readLine()) != null) {
                sb.append(line);
            }
        }
        return JsonUtil.fromJson(sb.toString(), Map.class);
    }
}
