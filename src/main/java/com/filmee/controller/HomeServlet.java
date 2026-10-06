package com.filmee.controller;

import com.filmee.dao.MovieDAO;
import com.filmee.model.Movie;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.*;
import java.io.IOException;
import java.util.List;

public class HomeServlet extends HttpServlet {
    private MovieDAO movieDAO = new MovieDAO();

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        List<Movie> nowShowing = movieDAO.getMoviesByStatus("NOW_SHOWING");
        List<Movie> upcoming = movieDAO.getMoviesByStatus("UPCOMING");

        request.setAttribute("nowShowingMovies", nowShowing);
        request.setAttribute("upcomingMovies", upcoming);

        request.getRequestDispatcher("/home.jsp").forward(request, response);
    }
}
