package com.filmee.dao;

import com.filmee.model.Show;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class ShowDAO {

    public List<Show> getAllShows() {
        List<Show> shows = new ArrayList<>();
        String sql = "SELECT s.*, m.title AS movie_title, m.poster_url, t.name AS theater_name, sc.screen_number AS screen_name " +
                     "FROM shows s " +
                     "JOIN movies m ON s.movie_id = m.movie_id " +
                     "JOIN screens sc ON s.screen_id = sc.screen_id " +
                     "JOIN theaters t ON sc.theater_id = t.theater_id " +
                     "ORDER BY s.show_date DESC, s.start_time ASC";
        try (Connection conn = DBConnection.getConnection();
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery(sql)) {
            while (rs.next()) {
                Show s = mapShow(rs);
                s.setBookedSeats(getBookedSeats(s.getShowId()));
                shows.add(s);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return shows;
    }

    public List<Show> getShowsByMovieId(int movieId) {
        List<Show> shows = new ArrayList<>();
        String sql = "SELECT s.*, m.title AS movie_title, m.poster_url, t.name AS theater_name, sc.screen_number AS screen_name " +
                     "FROM shows s " +
                     "JOIN movies m ON s.movie_id = m.movie_id " +
                     "JOIN screens sc ON s.screen_id = sc.screen_id " +
                     "JOIN theaters t ON sc.theater_id = t.theater_id " +
                     "WHERE s.movie_id = ? AND s.status = 'ACTIVE' " +
                     "ORDER BY s.show_date, s.start_time";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, movieId);
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    Show s = mapShow(rs);
                    s.setBookedSeats(getBookedSeats(s.getShowId()));
                    shows.add(s);
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return shows;
    }

    public List<Show> getShowsByMovieAndDate(int movieId, Date showDate) {
        List<Show> shows = new ArrayList<>();
        String sql = "SELECT s.*, m.title AS movie_title, m.poster_url, t.name AS theater_name, sc.screen_number AS screen_name " +
                     "FROM shows s " +
                     "JOIN movies m ON s.movie_id = m.movie_id " +
                     "JOIN screens sc ON s.screen_id = sc.screen_id " +
                     "JOIN theaters t ON sc.theater_id = t.theater_id " +
                     "WHERE s.movie_id = ? AND s.show_date = ? AND s.status = 'ACTIVE' " +
                     "ORDER BY s.start_time";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, movieId);
            ps.setDate(2, showDate);
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    Show s = mapShow(rs);
                    s.setBookedSeats(getBookedSeats(s.getShowId()));
                    shows.add(s);
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return shows;
    }

    public Show getShowById(int showId) {
        String sql = "SELECT s.*, m.title AS movie_title, m.poster_url, t.name AS theater_name, sc.screen_number AS screen_name " +
                     "FROM shows s " +
                     "JOIN movies m ON s.movie_id = m.movie_id " +
                     "JOIN screens sc ON s.screen_id = sc.screen_id " +
                     "JOIN theaters t ON sc.theater_id = t.theater_id " +
                     "WHERE s.show_id = ?";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, showId);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    Show s = mapShow(rs);
                    s.setBookedSeats(getBookedSeats(s.getShowId()));
                    return s;
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return null;
    }

    public List<String> getBookedSeats(int showId) {
        List<String> booked = new ArrayList<>();
        String sql = "SELECT CONCAT(seat_row, seat_number) AS seat_code FROM booking_seats WHERE show_id = ?";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, showId);
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    booked.add(rs.getString("seat_code"));
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return booked;
    }

    public boolean addShow(Show show) {
        String sql = "INSERT INTO shows (movie_id, screen_id, show_date, start_time, end_time, standard_price, premium_price, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
            ps.setInt(1, show.getMovieId());
            ps.setInt(2, show.getScreenId());
            ps.setDate(3, show.getShowDate());
            ps.setTime(4, show.getStartTime());
            ps.setTime(5, show.getEndTime());
            ps.setDouble(6, show.getStandardPrice());
            ps.setDouble(7, show.getPremiumPrice());
            ps.setString(8, show.getStatus() != null ? show.getStatus() : "ACTIVE");

            int affected = ps.executeUpdate();
            if (affected > 0) {
                try (ResultSet rs = ps.getGeneratedKeys()) {
                    if (rs.next()) {
                        show.setShowId(rs.getInt(1));
                    }
                }
                return true;
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return false;
    }

    public boolean deleteShow(int showId) {
        String sql = "DELETE FROM shows WHERE show_id = ?";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, showId);
            return ps.executeUpdate() > 0;
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return false;
    }

    private Show mapShow(ResultSet rs) throws SQLException {
        Show show = new Show();
        show.setShowId(rs.getInt("show_id"));
        show.setMovieId(rs.getInt("movie_id"));
        show.setScreenId(rs.getInt("screen_id"));
        show.setShowDate(rs.getDate("show_date"));
        show.setStartTime(rs.getTime("start_time"));
        show.setEndTime(rs.getTime("end_time"));
        show.setStandardPrice(rs.getDouble("standard_price"));
        show.setPremiumPrice(rs.getDouble("premium_price"));
        show.setStatus(rs.getString("status"));
        show.setMovieTitle(rs.getString("movie_title"));
        show.setPosterUrl(rs.getString("poster_url"));
        show.setTheaterName(rs.getString("theater_name"));
        show.setScreenName(rs.getString("screen_name"));
        return show;
    }
}
