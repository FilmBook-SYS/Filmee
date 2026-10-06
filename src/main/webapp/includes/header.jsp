<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="referrer" content="no-referrer" />
  <title>Filmee | Online Movie Ticket Booking</title>
  
  <!-- Google Fonts: Bebas Neue, Cinzel, Outfit & Inter -->
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Cinzel:wght@700;800;900&family=Inter:wght@300;400;500;600;700&family=Outfit:wght@500;600;700;800;900&display=swap" rel="stylesheet" />
  
  <!-- Font Awesome Icons -->
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />
  
  <!-- CSS Stylesheet -->
  <link rel="stylesheet" href="${pageContext.request.contextPath}/css/style.css" />
</head>
<body>

  <!-- ==================== NAVIGATION BAR ==================== -->
  <header class="navbar">
    <div class="nav-container">
      <a href="${pageContext.request.contextPath}/home" class="nav-brand">
        <div class="brand-icon">
          <i class="fa-solid fa-film"></i>
        </div>
        <span class="brand-name">Film<span>ee</span></span>
      </a>

      <nav class="nav-menu">
        <a href="${pageContext.request.contextPath}/home" class="nav-link">
          <i class="fa-solid fa-compass"></i> Discover
        </a>
        <a href="${pageContext.request.contextPath}/my-bookings" class="nav-link">
          <i class="fa-solid fa-ticket"></i> My Tickets
        </a>
        <c:if test="${sessionScope.user != null && sessionScope.user.role == 'ADMIN'}">
          <a href="${pageContext.request.contextPath}/admin" class="nav-link admin-nav-link">
            <i class="fa-solid fa-shield-halved"></i> Admin Panel
          </a>
        </c:if>
      </nav>

      <div class="nav-actions">
        <c:choose>
          <c:when test="${sessionScope.user != null}">
            <div class="user-badge">
              <div class="user-avatar">${sessionScope.user.fullName.substring(0, 1)}</div>
              <span>${sessionScope.user.fullName}</span>
            </div>
            <a href="${pageContext.request.contextPath}/auth?action=logout" class="btn-xs" title="Logout">
              <i class="fa-solid fa-arrow-right-from-bracket"></i> Logout
            </a>
          </c:when>
          <c:otherwise>
            <a href="${pageContext.request.contextPath}/auth?action=login" class="btn btn-primary">
              <i class="fa-solid fa-user"></i> Sign In
            </a>
          </c:otherwise>
        </c:choose>
      </div>
    </div>
  </header>

  <main class="main-content">
