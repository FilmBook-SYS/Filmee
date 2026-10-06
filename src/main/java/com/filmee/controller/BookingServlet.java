package com.filmee.controller;

import com.filmee.dao.BookingDAO;
import com.filmee.dao.ShowDAO;
import com.filmee.model.Booking;
import com.filmee.model.Show;
import com.filmee.model.User;

import javax.servlet.ServletException;
import javax.servlet.http.*;
import java.io.IOException;
import java.util.Arrays;
import java.util.List;

public class BookingServlet extends HttpServlet {
    private ShowDAO showDAO = new ShowDAO();
    private BookingDAO bookingDAO = new BookingDAO();

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String path = request.getServletPath();

        HttpSession session = request.getSession();
        User user = (User) session.getAttribute("user");

        if ("/seat-selection".equals(path)) {
            String showIdParam = request.getParameter("showId");
            if (showIdParam == null || showIdParam.isEmpty()) {
                response.sendRedirect(request.getContextPath() + "/home");
                return;
            }

            int showId = Integer.parseInt(showIdParam);
            Show show = showDAO.getShowById(showId);
            List<String> bookedSeats = showDAO.getBookedSeats(showId);

            request.setAttribute("show", show);
            request.setAttribute("bookedSeats", bookedSeats);
            request.getRequestDispatcher("/seat-selection.jsp").forward(request, response);

        } else if ("/my-bookings".equals(path)) {
            if (user == null) {
                response.sendRedirect(request.getContextPath() + "/auth?action=login");
                return;
            }
            List<Booking> myBookings = bookingDAO.getBookingsByUserId(user.getUserId());
            request.setAttribute("bookings", myBookings);
            request.getRequestDispatcher("/my-bookings.jsp").forward(request, response);

        } else if ("/ticket".equals(path)) {
            String bookingIdParam = request.getParameter("id");
            if (bookingIdParam != null) {
                int bookingId = Integer.parseInt(bookingIdParam);
                Booking booking = bookingDAO.getBookingById(bookingId);
                request.setAttribute("booking", booking);
                request.getRequestDispatcher("/ticket.jsp").forward(request, response);
            } else {
                response.sendRedirect(request.getContextPath() + "/home");
            }
        }
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        HttpSession session = request.getSession();
        User user = (User) session.getAttribute("user");

        if (user == null) {
            response.sendRedirect(request.getContextPath() + "/auth?action=login");
            return;
        }

        int showId = Integer.parseInt(request.getParameter("showId"));
        String seatString = request.getParameter("seats"); // Comma-separated: "C4,C5"
        double totalAmount = Double.parseDouble(request.getParameter("totalAmount"));

        List<String> selectedSeats = Arrays.asList(seatString.split(","));

        Booking booking = bookingDAO.createBooking(user.getUserId(), showId, selectedSeats, totalAmount);
        if (booking != null) {
            response.sendRedirect(request.getContextPath() + "/ticket?id=" + booking.getBookingId());
        } else {
            request.setAttribute("errorMessage", "Seat booking failed or seats are already taken.");
            response.sendRedirect(request.getContextPath() + "/seat-selection?showId=" + showId);
        }
    }
}
