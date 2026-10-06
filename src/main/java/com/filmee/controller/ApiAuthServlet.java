package com.filmee.controller;

import com.filmee.model.ApiResponse;
import com.filmee.model.User;
import com.filmee.service.AuthService;
import com.filmee.util.JsonUtil;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.*;
import java.io.BufferedReader;
import java.io.IOException;
import java.util.Map;

@WebServlet(name = "ApiAuthServlet", urlPatterns = {"/api/auth/*"})
public class ApiAuthServlet extends HttpServlet {
    private final AuthService authService = new AuthService();

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String pathInfo = request.getPathInfo();

        if ("/login".equalsIgnoreCase(pathInfo)) {
            Map<String, String> payload = parseJsonPayload(request);
            String email = payload.get("email");
            String password = payload.get("password");

            User user = authService.authenticate(email, password);
            if (user != null) {
                HttpSession session = request.getSession(true);
                session.setAttribute("user", user);
                JsonUtil.sendJsonResponse(response, HttpServletResponse.SC_OK, ApiResponse.ok("Login successful", user));
            } else {
                JsonUtil.sendJsonResponse(response, HttpServletResponse.SC_UNAUTHORIZED, ApiResponse.error("Invalid email or password."));
            }

        } else if ("/register".equalsIgnoreCase(pathInfo)) {
            Map<String, String> payload = parseJsonPayload(request);
            String fullName = payload.get("fullName");
            String email = payload.get("email");
            String password = payload.get("password");
            String phone = payload.get("phone");

            boolean success = authService.register(fullName, email, password, phone);
            if (success) {
                User user = authService.authenticate(email, password);
                request.getSession(true).setAttribute("user", user);
                JsonUtil.sendJsonResponse(response, HttpServletResponse.SC_CREATED, ApiResponse.ok("Account created successfully", user));
            } else {
                JsonUtil.sendJsonResponse(response, HttpServletResponse.SC_BAD_REQUEST, ApiResponse.error("Registration failed. Email may already be in use."));
            }

        } else if ("/logout".equalsIgnoreCase(pathInfo)) {
            HttpSession session = request.getSession(false);
            if (session != null) {
                session.invalidate();
            }
            JsonUtil.sendJsonResponse(response, HttpServletResponse.SC_OK, ApiResponse.ok("Logged out successfully", null));
        } else {
            JsonUtil.sendJsonResponse(response, HttpServletResponse.SC_NOT_FOUND, ApiResponse.error("Endpoint not found"));
        }
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String pathInfo = request.getPathInfo();

        if ("/me".equalsIgnoreCase(pathInfo)) {
            HttpSession session = request.getSession(false);
            User user = session != null ? (User) session.getAttribute("user") : null;

            if (user != null) {
                JsonUtil.sendJsonResponse(response, HttpServletResponse.SC_OK, ApiResponse.ok(user));
            } else {
                JsonUtil.sendJsonResponse(response, HttpServletResponse.SC_UNAUTHORIZED, ApiResponse.error("Not authenticated"));
            }
        } else {
            JsonUtil.sendJsonResponse(response, HttpServletResponse.SC_NOT_FOUND, ApiResponse.error("Endpoint not found"));
        }
    }

    @SuppressWarnings("unchecked")
    private Map<String, String> parseJsonPayload(HttpServletRequest request) throws IOException {
        StringBuilder sb = new StringBuilder();
        try (BufferedReader reader = request.getReader()) {
            String line;
            while ((line = reader.readLine()) != null) {
                sb.append(line);
            }
        }
        return JsonUtil.fromJson(sb.toString(), Map.class);
    }
}
