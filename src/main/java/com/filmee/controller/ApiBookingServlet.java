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
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@WebServlet(name = "ApiBookingServlet", urlPatterns = {"/api/bookings/*"})
public class ApiBookingServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;
    private final transient BookingService bookingService = new BookingService();

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        HttpSession session = request.getSession(false);
        User user = session != null ? (User) session.getAttribute("user") : null;

        if (user == null) {
            JsonUtil.sendJsonResponse(response, HttpServletResponse.SC_UNAUTHORIZED, ApiResponse.error("User not authenticated. Please log in."));
            return;
        }

        String pathInfo = request.getPathInfo();

        if (pathInfo == null || "/".equals(pathInfo) || "/my-bookings".equalsIgnoreCase(pathInfo)) {
            List<Booking> list = bookingService.getUserBookings(user.getUserId());
            JsonUtil.sendJsonResponse(response, HttpServletResponse.SC_OK, ApiResponse.ok(list));
        } else {
            try {
                String cleanId = pathInfo.replaceAll("[^0-9]", "");
                if (cleanId.isEmpty()) {
                    JsonUtil.sendJsonResponse(response, HttpServletResponse.SC_BAD_REQUEST, ApiResponse.error("Invalid booking ID"));
                    return;
                }
                int bookingId = Integer.parseInt(cleanId);
                Booking booking = bookingService.getBookingDetails(bookingId);

                if (booking != null && (user.isAdmin() || booking.getUserId() == user.getUserId())) {
                    JsonUtil.sendJsonResponse(response, HttpServletResponse.SC_OK, ApiResponse.ok(booking));
                } else {
                    JsonUtil.sendJsonResponse(response, HttpServletResponse.SC_NOT_FOUND, ApiResponse.error("Booking not found"));
                }
            } catch (Exception e) {
                JsonUtil.sendJsonResponse(response, HttpServletResponse.SC_BAD_REQUEST, ApiResponse.error("Error retrieving booking: " + e.getMessage()));
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

        // Handle Cancel Booking action
        if (pathInfo != null && pathInfo.contains("cancel")) {
            try {
                String cleanId = pathInfo.replaceAll("[^0-9]", "");
                if (cleanId.isEmpty()) {
                    String paramId = request.getParameter("id");
                    cleanId = paramId != null ? paramId.trim() : "";
                }
                int bookingId = Integer.parseInt(cleanId);
                boolean success = bookingService.cancelUserBooking(bookingId, user.getUserId());
                if (success) {
                    JsonUtil.sendJsonResponse(response, HttpServletResponse.SC_OK, ApiResponse.ok("Booking cancelled and refunded successfully", null));
                } else {
                    JsonUtil.sendJsonResponse(response, HttpServletResponse.SC_BAD_REQUEST, ApiResponse.error("Failed to cancel booking."));
                }
            } catch (Exception e) {
                JsonUtil.sendJsonResponse(response, HttpServletResponse.SC_BAD_REQUEST, ApiResponse.error("Invalid booking ID for cancellation"));
            }
            return;
        }

        // Handle Create Reservation
        Map<String, Object> payload = parseJsonPayload(request);
        if (payload == null || !payload.containsKey("showId") || !payload.containsKey("seats")) {
            JsonUtil.sendJsonResponse(response, HttpServletResponse.SC_BAD_REQUEST, ApiResponse.error("Missing showId or seats in payload"));
            return;
        }

        try {
            int showId = Integer.parseInt(payload.get("showId").toString());
            List<?> rawSeats = (List<?>) payload.get("seats");
            List<String> seats = new ArrayList<>();
            for (Object s : rawSeats) {
                if (s != null && !s.toString().trim().isEmpty()) {
                    seats.add(s.toString().trim().toUpperCase());
                }
            }

            String paymentMethod = payload.get("paymentMethod") != null ? payload.get("paymentMethod").toString() : "DUMMY_GATEWAY";

            Booking booking = bookingService.reserveSeats(user.getUserId(), showId, seats, paymentMethod);

            if (booking != null && booking.getBookingId() > 0) {
                JsonUtil.sendJsonResponse(response, HttpServletResponse.SC_CREATED, ApiResponse.ok("Booking confirmed successfully!", booking));
            } else {
                JsonUtil.sendJsonResponse(response, HttpServletResponse.SC_CONFLICT, ApiResponse.error("One or more selected seats are already booked! Please select other seats."));
            }
        } catch (Exception e) {
            JsonUtil.sendJsonResponse(response, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, ApiResponse.error("Booking error: " + e.getMessage()));
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
        if (sb.length() == 0) return null;
        return JsonUtil.fromJson(sb.toString(), Map.class);
    }
}
