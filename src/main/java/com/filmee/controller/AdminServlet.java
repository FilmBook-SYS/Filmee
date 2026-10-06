package com.filmee.controller;

import com.filmee.dao.MovieDAO;
import com.filmee.dao.ShowDAO;
import com.filmee.model.Movie;
import com.filmee.model.Show;
import com.filmee.model.User;

import javax.servlet.ServletException;
import javax.servlet.http.*;
import java.io.IOException;
import java.sql.Date;
import java.sql.Time;
import java.util.List;

public class AdminServlet extends HttpServlet {
    private MovieDAO movieDAO = new MovieDAO();
    private ShowDAO showDAO = new ShowDAO();

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        HttpSession session = request.getSession();
        User user = (User) session.getAttribute("user");

        if (user == null || !user.isAdmin()) {
            response.sendRedirect(request.getContextPath() + "/auth?action=login");
            return;
        }

        List<Movie> movies = movieDAO.getAllMovies();
        request.setAttribute("movies", movies);
        request.getRequestDispatcher("/admin.jsp").forward(request, response);
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        HttpSession session = request.getSession();
        User user = (User) session.getAttribute("user");

        if (user == null || !user.isAdmin()) {
            response.sendRedirect(request.getContextPath() + "/auth?action=login");
            return;
        }

        String action = request.getParameter("action");

        if ("addMovie".equalsIgnoreCase(action)) {
            String title = request.getParameter("title");
            String description = request.getParameter("description");
            String genre = request.getParameter("genre");
            String language = request.getParameter("language");
            int duration = Integer.parseInt(request.getParameter("duration"));
            Date releaseDate = Date.valueOf(request.getParameter("releaseDate"));
            String posterUrl = request.getParameter("posterUrl");
            String trailerUrl = request.getParameter("trailerUrl");
            String status = request.getParameter("status");

            Movie movie = new Movie(0, title, description, genre, language, duration, releaseDate, posterUrl, trailerUrl, status);
            movieDAO.addMovie(movie);

        } else if ("deleteMovie".equalsIgnoreCase(action)) {
            int movieId = Integer.parseInt(request.getParameter("movieId"));
            movieDAO.deleteMovie(movieId);

        } else if ("addShow".equalsIgnoreCase(action)) {
            int movieId = Integer.parseInt(request.getParameter("movieId"));
            int screenId = Integer.parseInt(request.getParameter("screenId"));
            Date showDate = Date.valueOf(request.getParameter("showDate"));
            Time startTime = Time.valueOf(request.getParameter("startTime") + ":00");
            Time endTime = Time.valueOf(request.getParameter("endTime") + ":00");
            double stdPrice = Double.parseDouble(request.getParameter("standardPrice"));
            double premPrice = Double.parseDouble(request.getParameter("premiumPrice"));

            Show show = new Show();
            show.setMovieId(movieId);
            show.setScreenId(screenId);
            show.setShowDate(showDate);
            show.setStartTime(startTime);
            show.setEndTime(endTime);
            show.setStandardPrice(stdPrice);
            show.setPremiumPrice(premPrice);
            show.setStatus("ACTIVE");

            showDAO.addShow(show);
        }

        response.sendRedirect(request.getContextPath() + "/admin");
    }
}
