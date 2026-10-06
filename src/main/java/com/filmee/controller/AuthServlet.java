package com.filmee.controller;

import com.filmee.dao.UserDAO;
import com.filmee.model.User;

import javax.servlet.ServletException;
import javax.servlet.http.*;
import java.io.IOException;

public class AuthServlet extends HttpServlet {
    private UserDAO userDAO = new UserDAO();

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String action = request.getParameter("action");

        if ("login".equalsIgnoreCase(action)) {
            String email = request.getParameter("email");
            String password = request.getParameter("password");

            User user = userDAO.login(email, password);
            if (user != null) {
                HttpSession session = request.getSession();
                session.setAttribute("user", user);
                if (user.isAdmin()) {
                    response.sendRedirect(request.getContextPath() + "/admin");
                } else {
                    response.sendRedirect(request.getContextPath() + "/home");
                }
            } else {
                request.setAttribute("errorMessage", "Invalid email or password.");
                request.getRequestDispatcher("/login.jsp").forward(request, response);
            }

        } else if ("register".equalsIgnoreCase(action)) {
            String fullName = request.getParameter("fullName");
            String email = request.getParameter("email");
            String phone = request.getParameter("phone");
            String password = request.getParameter("password");

            User newUser = new User(0, fullName, email, password, phone, "CUSTOMER");
            boolean success = userDAO.register(newUser);

            if (success) {
                User logged = userDAO.login(email, password);
                request.getSession().setAttribute("user", logged);
                response.sendRedirect(request.getContextPath() + "/home");
            } else {
                request.setAttribute("errorMessage", "Email already registered or registration failed.");
                request.getRequestDispatcher("/register.jsp").forward(request, response);
            }
        }
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String action = request.getParameter("action");

        if ("logout".equalsIgnoreCase(action)) {
            request.getSession().invalidate();
            response.sendRedirect(request.getContextPath() + "/home");
        } else if ("login".equalsIgnoreCase(action)) {
            request.getRequestDispatcher("/login.jsp").forward(request, response);
        } else if ("register".equalsIgnoreCase(action)) {
            request.getRequestDispatcher("/register.jsp").forward(request, response);
        } else {
            response.sendRedirect(request.getContextPath() + "/home");
        }
    }
}
