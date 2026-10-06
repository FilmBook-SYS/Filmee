package com.filmee.controller;

import com.filmee.dao.MovieDAO;
import com.filmee.dao.ShowDAO;
import com.filmee.model.Movie;
import com.filmee.model.Show;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.*;
import java.io.IOException;
import java.util.List;

@WebServlet(name = "MovieServlet", urlPatterns = {"/movies", "/movie-details"})
public class MovieServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;
    private final transient MovieDAO movieDAO = new MovieDAO();
    private final transient ShowDAO showDAO = new ShowDAO();

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String idParam = request.getParameter("id");

        if (idParam != null && !idParam.isEmpty()) {
            int movieId = Integer.parseInt(idParam);
            Movie movie = movieDAO.getMovieById(movieId);
            List<Show> shows = showDAO.getShowsByMovieId(movieId);

            request.setAttribute("movie", movie);
            request.setAttribute("shows", shows);
            request.getRequestDispatcher("/movie-details.jsp").forward(request, response);
        } else {
            List<Movie> allMovies = movieDAO.getAllMovies();
            request.setAttribute("movies", allMovies);
            request.getRequestDispatcher("/movies.jsp").forward(request, response);
        }
    }
}
