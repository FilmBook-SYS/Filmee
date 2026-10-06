package com.filmee.service;

import com.filmee.dao.MovieDAO;
import com.filmee.model.Movie;
import java.util.List;

public class MovieService {
    private final MovieDAO movieDAO;

    public MovieService() {
        this.movieDAO = new MovieDAO();
    }

    public MovieService(MovieDAO movieDAO) {
        this.movieDAO = movieDAO;
    }

    public List<Movie> getAllMovies() {
        return movieDAO.getAllMovies();
    }

    public List<Movie> getNowShowing() {
        return movieDAO.getMoviesByStatus("NOW_SHOWING");
    }

    public List<Movie> getUpcoming() {
        return movieDAO.getMoviesByStatus("UPCOMING");
    }

    public List<Movie> searchMovies(String query, String genre) {
        return movieDAO.searchMovies(query, genre);
    }

    public Movie getMovieById(int id) {
        return movieDAO.getMovieById(id);
    }

    public boolean createMovie(Movie movie) {
        if (movie.getTitle() == null || movie.getTitle().trim().isEmpty() || movie.getDurationMinutes() <= 0) {
            return false;
        }
        return movieDAO.addMovie(movie);
    }

    public boolean updateMovie(Movie movie) {
        if (movie.getMovieId() <= 0 || movie.getTitle() == null) {
            return false;
        }
        return movieDAO.updateMovie(movie);
    }

    public boolean deleteMovie(int movieId) {
        return movieDAO.deleteMovie(movieId);
    }
}
