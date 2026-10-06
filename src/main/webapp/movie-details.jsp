<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<jsp:include page="/includes/header.jsp" />

<div class="details-content-container">
  <a href="${pageContext.request.contextPath}/home" class="back-btn">
    <i class="fa-solid fa-arrow-left"></i> Back to Movies
  </a>

  <div class="movie-hero-info">
    <div class="detail-poster">
      <img src="${movie.posterUrl}" alt="${movie.title}" />
    </div>
    <div class="detail-body">
      <div class="detail-pills">
        <span class="badge badge-info"><i class="fa-solid fa-clapperboard"></i> ${movie.status}</span>
        <span class="badge" style="background: var(--bg-surface-elevated); color: var(--text-secondary);">${movie.language}</span>
      </div>
      <h1 class="detail-title">${movie.title}</h1>
      <div class="featured-meta">
        <span><i class="fa-regular fa-clock"></i> ${movie.durationMinutes} mins</span>
        <span>•</span>
        <span>${movie.genre}</span>
      </div>
      <p class="detail-desc">${movie.description}</p>
    </div>
  </div>

  <div class="booking-scheduler-box">
    <div class="scheduler-header">
      <h3><i class="fa-solid fa-calendar-days text-accent"></i> Available Showtimes</h3>
    </div>

    <c:choose>
      <c:when test="${not empty shows}">
        <div class="showtimes-grid">
          <c:forEach var="s" items="${shows}">
            <a href="${pageContext.request.contextPath}/seat-selection?showId=${s.showId}" class="showtime-pill">
              <span class="showtime-time">${s.startTime}</span>
              <span class="showtime-screen">${s.theaterName} (${s.screenName})</span>
              <span style="font-size: 0.75rem; color: var(--text-muted); margin-top: 4px;">Std: ₹${s.standardPrice} | Prem: ₹${s.premiumPrice}</span>
            </a>
          </c:forEach>
        </div>
      </c:when>
      <c:otherwise>
        <p style="color: var(--text-muted); text-align: center; padding: 20px;">No shows scheduled currently for this movie.</p>
      </c:otherwise>
    </c:choose>
  </div>
</div>

<jsp:include page="/includes/footer.jsp" />
