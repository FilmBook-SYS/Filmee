package com.filmee.service;

import com.filmee.dao.UserDAO;
import com.filmee.model.User;

public class AuthService {
    private final UserDAO userDAO;

    public AuthService() {
        this.userDAO = new UserDAO();
    }

    public AuthService(UserDAO userDAO) {
        this.userDAO = userDAO;
    }

    public User authenticate(String email, String password) {
        if (email == null || password == null || email.trim().isEmpty() || password.isEmpty()) {
            return null;
        }
        return userDAO.login(email.trim(), password);
    }

    public boolean register(String fullName, String email, String password, String phone) {
        if (fullName == null || fullName.trim().isEmpty() ||
            email == null || email.trim().isEmpty() ||
            password == null || password.length() < 4) {
            return false;
        }

        if (userDAO.existsByEmail(email.trim())) {
            return false; // Email duplicate
        }

        User user = new User(0, fullName.trim(), email.trim(), password, phone != null ? phone.trim() : null, "CUSTOMER");
        return userDAO.register(user);
    }

    public User getUserProfile(int userId) {
        return userDAO.getUserById(userId);
    }
}
