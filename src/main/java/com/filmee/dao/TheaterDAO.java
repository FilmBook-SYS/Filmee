package com.filmee.dao;

import com.filmee.model.Screen;
import com.filmee.model.Theater;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class TheaterDAO {

    public List<Theater> getAllTheaters() {
        List<Theater> theaters = new ArrayList<>();
        String sql = "SELECT * FROM theaters ORDER BY name ASC";
        try (Connection conn = DBConnection.getConnection();
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery(sql)) {
            while (rs.next()) {
                Theater t = mapTheater(rs);
                t.setScreens(getScreensByTheaterId(t.getTheaterId()));
                theaters.add(t);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return theaters;
    }

    public List<Screen> getScreensByTheaterId(int theaterId) {
        List<Screen> list = new ArrayList<>();
        String sql = "SELECT sc.*, t.name AS theater_name FROM screens sc " +
                     "JOIN theaters t ON sc.theater_id = t.theater_id " +
                     "WHERE sc.theater_id = ? ORDER BY sc.screen_number";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, theaterId);
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    list.add(mapScreen(rs));
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return list;
    }

    public Screen getScreenById(int screenId) {
        String sql = "SELECT sc.*, t.name AS theater_name FROM screens sc " +
                     "JOIN theaters t ON sc.theater_id = t.theater_id " +
                     "WHERE sc.screen_id = ?";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, screenId);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    return mapScreen(rs);
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return null;
    }

    private Theater mapTheater(ResultSet rs) throws SQLException {
        Theater t = new Theater();
        t.setTheaterId(rs.getInt("theater_id"));
        t.setName(rs.getString("name"));
        t.setCity(rs.getString("city"));
        t.setAddress(rs.getString("address"));
        t.setTotalScreens(rs.getInt("total_screens"));
        return t;
    }

    private Screen mapScreen(ResultSet rs) throws SQLException {
        Screen s = new Screen();
        s.setScreenId(rs.getInt("screen_id"));
        s.setTheaterId(rs.getInt("theater_id"));
        s.setScreenNumber(rs.getString("screen_number"));
        s.setTotalRows(rs.getInt("total_rows"));
        s.setSeatsPerRow(rs.getInt("seats_per_row"));
        s.setTotalCapacity(rs.getInt("total_capacity"));
        s.setTheaterName(rs.getString("theater_name"));
        return s;
    }
}
