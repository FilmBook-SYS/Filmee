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
    private static final long serialVersionUID = 1L;
    private final transient ShowDAO showDAO = new ShowDAO();

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String pathInfo = request.getPathInfo();

        if (pathInfo == null || "/".equals(pathInfo)) {
            String movieIdStr = request.getParameter("movieId");
            String dateStr = request.getParameter("date");

            if (movieIdStr != null && !movieIdStr.trim().isEmpty()) {
                int movieId = Integer.parseInt(movieIdStr.trim());
                List<Show> list;
                if (dateStr != null && !dateStr.trim().isEmpty()) {
                    list = showDAO.getShowsByMovieAndDate(movieId, Date.valueOf(dateStr.trim()));
                } else {
                    list = showDAO.getShowsByMovieId(movieId);
                }
                JsonUtil.sendJsonResponse(response, HttpServletResponse.SC_OK, ApiResponse.ok(list));
            } else {
                JsonUtil.sendJsonResponse(response, HttpServletResponse.SC_OK, ApiResponse.ok(showDAO.getAllShows()));
            }

        } else if (pathInfo.contains("seats")) {
            // Handles /seats/101 or /101/seats
            try {
                String cleanId = pathInfo.replaceAll("[^0-9]", "");
                if (cleanId.isEmpty()) {
                    String paramId = request.getParameter("showId");
                    cleanId = paramId != null ? paramId.trim() : "";
                }
                int showId = Integer.parseInt(cleanId);
                List<String> bookedSeats = showDAO.getBookedSeats(showId);
                JsonUtil.sendJsonResponse(response, HttpServletResponse.SC_OK, ApiResponse.ok(bookedSeats));
            } catch (Exception e) {
                JsonUtil.sendJsonResponse(response, HttpServletResponse.SC_BAD_REQUEST, ApiResponse.error("Invalid show ID for seat lookup"));
            }
        } else {
            try {
                String cleanId = pathInfo.replaceAll("[^0-9]", "");
                int showId = Integer.parseInt(cleanId);
                Show show = showDAO.getShowById(showId);
                if (show != null) {
                    JsonUtil.sendJsonResponse(response, HttpServletResponse.SC_OK, ApiResponse.ok(show));
                } else {
                    JsonUtil.sendJsonResponse(response, HttpServletResponse.SC_NOT_FOUND, ApiResponse.error("Show not found"));
                }
            } catch (Exception e) {
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
        if (show == null || show.getMovieId() <= 0 || show.getScreenId() <= 0) {
            JsonUtil.sendJsonResponse(response, HttpServletResponse.SC_BAD_REQUEST, ApiResponse.error("Invalid show details in payload."));
            return;
        }

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
        if (pathInfo != null) {
            try {
                String cleanId = pathInfo.replaceAll("[^0-9]", "");
                int id = Integer.parseInt(cleanId);
                boolean deleted = showDAO.deleteShow(id);
                if (deleted) {
                    JsonUtil.sendJsonResponse(response, HttpServletResponse.SC_OK, ApiResponse.ok("Show cancelled successfully", null));
                } else {
                    JsonUtil.sendJsonResponse(response, HttpServletResponse.SC_NOT_FOUND, ApiResponse.error("Show not found"));
                }
            } catch (Exception e) {
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
        if (sb.length() == 0) return null;
        return JsonUtil.fromJson(sb.toString(), Show.class);
    }
}
