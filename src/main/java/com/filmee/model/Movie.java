package com.filmee.model;

import java.io.Serializable;
import java.sql.Date;

public class Movie implements Serializable {
    private static final long serialVersionUID = 1L;

    private int movieId;
    private String title;
    private String description;
    private String genre;
    private String language;
    private int durationMinutes;
    private Date releaseDate;
    private String posterUrl;
    private String trailerUrl;
    private String status; // "NOW_SHOWING", "UPCOMING", "ARCHIVED"

    public Movie() {}

    public Movie(int movieId, String title, String description, String genre, String language, int durationMinutes, Date releaseDate, String posterUrl, String trailerUrl, String status) {
        this.movieId = movieId;
        this.title = title;
        this.description = description;
        this.genre = genre;
        this.language = language;
        this.durationMinutes = durationMinutes;
        this.releaseDate = releaseDate;
        this.posterUrl = posterUrl;
        this.trailerUrl = trailerUrl;
        this.status = status;
    }

    public int getMovieId() { return movieId; }
    public void setMovieId(int movieId) { this.movieId = movieId; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getGenre() { return genre; }
    public void setGenre(String genre) { this.genre = genre; }

    public String getLanguage() { return language; }
    public void setLanguage(String language) { this.language = language; }

    public int getDurationMinutes() { return durationMinutes; }
    public void setDurationMinutes(int durationMinutes) { this.durationMinutes = durationMinutes; }

    public Date getReleaseDate() { return releaseDate; }
    public void setReleaseDate(Date releaseDate) { this.releaseDate = releaseDate; }

    public String getPosterUrl() { return posterUrl; }
    public void setPosterUrl(String posterUrl) { this.posterUrl = posterUrl; }

    public String getTrailerUrl() { return trailerUrl; }
    public void setTrailerUrl(String trailerUrl) { this.trailerUrl = trailerUrl; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
