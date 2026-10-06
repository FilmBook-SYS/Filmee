package com.filmee.controller;

import com.filmee.dao.ShowDAO;
import com.filmee.model.ApiResponse;
import com.filmee.model.Show;
import com.filmee.model.User;
import com.filmee.util.JsonUtil;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.*;
import java.io.BufferedReader;
import java.io.IOException;
import java.sql.Date;
import java.util.List;

@WebServlet(name = "ApiShowServlet", urlPatterns = {"/api/shows/*"})
public class ApiShowServlet extends HttpServlet {
    private final ShowDAO showDAO = new ShowDAO();

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String pathInfo = request.getPathInfo();

        if (pathInfo == null || "/".equals(pathInfo)) {
            String movieIdStr = request.getParameter("movieId");
            String dateStr = request.getParameter("date");

            if (movieIdStr != null) {
                int movieId = Integer.parseInt(movieIdStr);
                List<Show> list;
                if (dateStr != null && !dateStr.isEmpty()) {
                    list = showDAO.getShowsByMovieAndDate(movieId, Date.valueOf(dateStr));
                } else {
                    list = showDAO.getShowsByMovieId(movieId);
                }
                JsonUtil.sendJsonResponse(response, HttpServletResponse.SC_OK, ApiResponse.ok(list));
            } else {
                JsonUtil.sendJsonResponse(response, HttpServletResponse.SC_OK, ApiResponse.ok(showDAO.getAllShows()));
            }

        } else if (pathInfo.startsWith("/seats/")) {
            try {
                int showId = Integer.parseInt(pathInfo.substring(7));
                List<String> bookedSeats = showDAO.getBookedSeats(showId);
                JsonUtil.sendJsonResponse(response, HttpServletResponse.SC_OK, ApiResponse.ok(bookedSeats));
            } catch (NumberFormatException e) {
                JsonUtil.sendJsonResponse(response, HttpServletResponse.SC_BAD_REQUEST, ApiResponse.error("Invalid show ID"));
            }
        } else {
            try {
                int showId = Integer.parseInt(pathInfo.substring(1));
                Show show = showDAO.getShowById(showId);
                if (show != null) {
                    JsonUtil.sendJsonResponse(response, HttpServletResponse.SC_OK, ApiResponse.ok(show));
                } else {
                    JsonUtil.sendJsonResponse(response, HttpServletResponse.SC_NOT_FOUND, ApiResponse.error("Show not found"));
                }
            } catch (NumberFormatException e) {
                JsonUtil.sendJsonResponse(response, HttpServletResponse.SC_BAD_REQUEST, ApiResponse.error("Invalid show ID"));
            }
        }
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        HttpSession session = request.getSession(false);
        User user = session != null ? (User) session.getAttribute("user") : null;

        if (user == null || !user.isAdmin()) {
            JsonUtil.sendJsonResponse(response, HttpServletResponse.SC_FORBIDDEN, ApiResponse.error("Admin access required."));
            return;
        }

        Show show = parseJsonShow(request);
        boolean success = showDAO.addShow(show);

        if (success) {
            JsonUtil.sendJsonResponse(response, HttpServletResponse.SC_CREATED, ApiResponse.ok("Show scheduled successfully", show));
        } else {
            JsonUtil.sendJsonResponse(response, HttpServletResponse.SC_BAD_REQUEST, ApiResponse.error("Failed to schedule show."));
        }
    }

    @Override
    protected void doDelete(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        HttpSession session = request.getSession(false);
        User user = session != null ? (User) session.getAttribute("user") : null;

        if (user == null || !user.isAdmin()) {
            JsonUtil.sendJsonResponse(response, HttpServletResponse.SC_FORBIDDEN, ApiResponse.error("Admin access required."));
            return;
        }

        String pathInfo = request.getPathInfo();
        if (pathInfo != null && pathInfo.length() > 1) {
            try {
                int id = Integer.parseInt(pathInfo.substring(1));
                boolean deleted = showDAO.deleteShow(id);
                if (deleted) {
                    JsonUtil.sendJsonResponse(response, HttpServletResponse.SC_OK, ApiResponse.ok("Show cancelled successfully", null));
                } else {
                    JsonUtil.sendJsonResponse(response, HttpServletResponse.SC_NOT_FOUND, ApiResponse.error("Show not found"));
                }
            } catch (NumberFormatException e) {
                JsonUtil.sendJsonResponse(response, HttpServletResponse.SC_BAD_REQUEST, ApiResponse.error("Invalid show ID"));
            }
        }
    }

    private Show parseJsonShow(HttpServletRequest request) throws IOException {
        StringBuilder sb = new StringBuilder();
        try (BufferedReader reader = request.getReader()) {
            String line;
            while ((line = reader.readLine()) != null) {
                sb.append(line);
            }
        }
        return JsonUtil.fromJson(sb.toString(), Show.class);
    }
}
