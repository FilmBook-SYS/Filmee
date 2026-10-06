<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<jsp:include page="/includes/header.jsp" />

<div class="section-container">
  <div class="section-header">
    <div>
      <h2 class="section-title"><i class="fa-solid fa-clapperboard text-accent"></i> All Movies in Theaters</h2>
      <p class="section-subtitle">Explore the complete cinema catalogue across all genres</p>
    </div>
  </div>

  <div class="movie-grid">
    <c:choose>
      <c:when test="${not empty movies}">
        <c:forEach var="movie" items="${movies}">
          <div class="movie-card">
            <div class="movie-poster-wrap">
              <img src="${movie.posterUrl}" alt="${movie.title}" />
              <div class="movie-badge-float">
                <i class="fa-solid fa-star"></i> 8.8
              </div>
            </div>
            <div class="movie-card-info">
              <h3 class="movie-title">${movie.title}</h3>
              <div class="movie-genre">${movie.genre}</div>
              <div class="movie-card-footer">
                <span class="movie-duration">${movie.durationMinutes}m • ${movie.language}</span>
                <a href="${pageContext.request.contextPath}/movie-details?id=${movie.movieId}" class="btn-xs" style="background: rgba(255,94,58,0.15); color: var(--accent-primary); border-color: rgba(255,94,58,0.3);">
                  ${movie.status == 'NOW_SHOWING' ? 'Book' : 'Details'}
                </a>
              </div>
            </div>
          </div>
        </c:forEach>
      </c:when>
      <c:otherwise>
        <div style="grid-column: 1/-1; text-align: center; padding: 50px 20px; color: var(--text-muted);">
          <h3>No movies currently available</h3>
        </div>
      </c:otherwise>
    </c:choose>
  </div>
</div>

<jsp:include page="/includes/footer.jsp" />
