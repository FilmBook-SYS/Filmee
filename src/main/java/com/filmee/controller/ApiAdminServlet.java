package com.filmee.controller;

import com.filmee.model.ApiResponse;
import com.filmee.model.User;
import com.filmee.service.AdminService;
import com.filmee.util.JsonUtil;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.*;
import java.io.IOException;
import java.util.Map;

@WebServlet(name = "ApiAdminServlet", urlPatterns = {"/api/admin/*"})
public class ApiAdminServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;
    private final AdminService adminService = new AdminService();

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        HttpSession session = request.getSession(false);
        User user = session != null ? (User) session.getAttribute("user") : null;

        if (user == null || !user.isAdmin()) {
            JsonUtil.sendJsonResponse(response, HttpServletResponse.SC_FORBIDDEN, ApiResponse.error("Admin access required."));
            return;
        }

        String pathInfo = request.getPathInfo();

        if (pathInfo == null || "/metrics".equalsIgnoreCase(pathInfo) || "/".equals(pathInfo)) {
            Map<String, Object> metrics = adminService.getDashboardMetrics();
            JsonUtil.sendJsonResponse(response, HttpServletResponse.SC_OK, ApiResponse.ok(metrics));
        } else {
            JsonUtil.sendJsonResponse(response, HttpServletResponse.SC_NOT_FOUND, ApiResponse.error("Admin endpoint not found"));
        }
    }
}
