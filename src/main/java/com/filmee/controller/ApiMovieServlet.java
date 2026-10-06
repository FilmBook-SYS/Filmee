package com.filmee.controller;

import com.filmee.model.ApiResponse;
import com.filmee.model.Movie;
import com.filmee.model.User;
import com.filmee.service.MovieService;
import com.filmee.util.JsonUtil;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.*;
import java.io.BufferedReader;
import java.io.IOException;
import java.util.List;

@WebServlet(name = "ApiMovieServlet", urlPatterns = {"/api/movies/*"})
public class ApiMovieServlet extends HttpServlet {
    private final MovieService movieService = new MovieService();

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String pathInfo = request.getPathInfo();

        if (pathInfo == null || "/".equals(pathInfo)) {
            String query = request.getParameter("q");
            String genre = request.getParameter("genre");
            String status = request.getParameter("status");

            List<Movie> list;
            if (status != null && !status.isEmpty()) {
                list = "UPCOMING".equalsIgnoreCase(status) ? movieService.getUpcoming() : movieService.getNowShowing();
            } else if ((query != null && !query.isEmpty()) || (genre != null && !genre.isEmpty())) {
                list = movieService.searchMovies(query, genre);
            } else {
                list = movieService.getAllMovies();
            }
            JsonUtil.sendJsonResponse(response, HttpServletResponse.SC_OK, ApiResponse.ok(list));

        } else if ("/now-showing".equalsIgnoreCase(pathInfo)) {
            JsonUtil.sendJsonResponse(response, HttpServletResponse.SC_OK, ApiResponse.ok(movieService.getNowShowing()));

        } else if ("/upcoming".equalsIgnoreCase(pathInfo)) {
            JsonUtil.sendJsonResponse(response, HttpServletResponse.SC_OK, ApiResponse.ok(movieService.getUpcoming()));

        } else {
            try {
                int id = Integer.parseInt(pathInfo.substring(1));
                Movie movie = movieService.getMovieById(id);
                if (movie != null) {
                    JsonUtil.sendJsonResponse(response, HttpServletResponse.SC_OK, ApiResponse.ok(movie));
                } else {
                    JsonUtil.sendJsonResponse(response, HttpServletResponse.SC_NOT_FOUND, ApiResponse.error("Movie not found"));
                }
            } catch (NumberFormatException e) {
                JsonUtil.sendJsonResponse(response, HttpServletResponse.SC_BAD_REQUEST, ApiResponse.error("Invalid movie ID"));
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

        Movie movie = parseJsonMovie(request);
        boolean success = movieService.createMovie(movie);

        if (success) {
            JsonUtil.sendJsonResponse(response, HttpServletResponse.SC_CREATED, ApiResponse.ok("Movie added successfully", movie));
        } else {
            JsonUtil.sendJsonResponse(response, HttpServletResponse.SC_BAD_REQUEST, ApiResponse.error("Failed to add movie. Check input values."));
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
                boolean deleted = movieService.deleteMovie(id);
                if (deleted) {
                    JsonUtil.sendJsonResponse(response, HttpServletResponse.SC_OK, ApiResponse.ok("Movie deleted successfully", null));
                } else {
                    JsonUtil.sendJsonResponse(response, HttpServletResponse.SC_NOT_FOUND, ApiResponse.error("Movie not found or could not be deleted"));
                }
            } catch (NumberFormatException e) {
                JsonUtil.sendJsonResponse(response, HttpServletResponse.SC_BAD_REQUEST, ApiResponse.error("Invalid movie ID"));
            }
        } else {
            JsonUtil.sendJsonResponse(response, HttpServletResponse.SC_BAD_REQUEST, ApiResponse.error("Movie ID required"));
        }
    }

    private Movie parseJsonMovie(HttpServletRequest request) throws IOException {
        StringBuilder sb = new StringBuilder();
        try (BufferedReader reader = request.getReader()) {
            String line;
            while ((line = reader.readLine()) != null) {
                sb.append(line);
            }
        }
        return JsonUtil.fromJson(sb.toString(), Movie.class);
    }
}
