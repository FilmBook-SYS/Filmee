<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<jsp:include page="/includes/header.jsp" />

<!-- Hero Banner Premiere -->
<c:if test="${not empty nowShowingMovies}">
  <div class="hero-carousel">
    <div class="featured-card" style="background-image: url('${nowShowingMovies[0].posterUrl}');">
      <div class="featured-overlay"></div>
      <div class="featured-content">
        <span class="tag-badge"><i class="fa-solid fa-sparkles"></i> Premiere Blockbuster</span>
        <h1 class="featured-title">${nowShowingMovies[0].title}</h1>
        <div class="featured-meta">
          <span><i class="fa-regular fa-clock"></i> ${nowShowingMovies[0].durationMinutes} mins</span>
          <span>•</span>
          <span>${nowShowingMovies[0].genre}</span>
        </div>
        <p class="featured-desc">${nowShowingMovies[0].description}</p>
        <div class="featured-actions">
          <a href="${pageContext.request.contextPath}/movie-details?id=${nowShowingMovies[0].movieId}" class="btn btn-primary">
            <i class="fa-solid fa-ticket"></i> Book Tickets Now
          </a>
        </div>
      </div>
    </div>
  </div>
</c:if>

<!-- Now Showing Section -->
<div class="section-container">
  <div class="section-header">
    <div>
      <h2 class="section-title"><i class="fa-solid fa-fire text-accent"></i> Now Showing in Theaters</h2>
      <p class="section-subtitle">Select a movie to pick your showtime and seats</p>
    </div>
  </div>

  <div class="movie-grid">
    <c:forEach var="movie" items="${nowShowingMovies}">
      <div class="movie-card" onclick="window.location.href='${pageContext.request.contextPath}/movie-details?id=${movie.movieId}'">
        <img class="movie-card-bg-img" src="${movie.posterUrl}" alt="${movie.title}" referrerpolicy="no-referrer" loading="lazy" />
        <div class="movie-card-overlay"></div>
        <div class="movie-card-top">
          <span class="movie-lang-pill">${movie.language}</span>
          <div class="movie-badge-float">
            <i class="fa-solid fa-star"></i> 9.2
          </div>
        </div>
        <div class="movie-card-info">
          <h3 class="movie-title">${movie.title}</h3>
          <div class="movie-genre">${movie.genre}</div>
          <div class="movie-card-footer">
            <span class="movie-duration"><i class="fa-regular fa-clock"></i> ${movie.durationMinutes}m</span>
            <a href="${pageContext.request.contextPath}/movie-details?id=${movie.movieId}" class="btn-xs btn-book-action">
              <i class="fa-solid fa-ticket"></i> Book
            </a>
          </div>
        </div>
      </div>
    </c:forEach>
  </div>
</div>

<!-- Coming Soon Section -->
<c:if test="${not empty upcomingMovies}">
  <div class="section-container">
    <div class="section-header">
      <div>
        <h2 class="section-title"><i class="fa-solid fa-calendar-star text-accent"></i> Coming Soon</h2>
        <p class="section-subtitle">Upcoming releases heading to the big screen</p>
      </div>
    </div>

    <div class="movie-grid">
      <c:forEach var="movie" items="${upcomingMovies}">
        <div class="movie-card" onclick="window.location.href='${pageContext.request.contextPath}/movie-details?id=${movie.movieId}'">
          <img class="movie-card-bg-img" src="${movie.posterUrl}" alt="${movie.title}" referrerpolicy="no-referrer" loading="lazy" />
          <div class="movie-card-overlay"></div>
          <div class="movie-card-top">
            <span class="movie-lang-pill">${movie.language}</span>
            <div class="movie-badge-float">
              <i class="fa-solid fa-calendar"></i> Soon
            </div>
          </div>
          <div class="movie-card-info">
            <h3 class="movie-title">${movie.title}</h3>
            <div class="movie-genre">${movie.genre}</div>
            <div class="movie-card-footer">
              <span class="movie-duration">Release: ${movie.releaseDate}</span>
              <a href="${pageContext.request.contextPath}/movie-details?id=${movie.movieId}" class="btn-xs btn-book-action">
                <i class="fa-solid fa-info"></i> Details
              </a>
            </div>
          </div>
        </div>
      </c:forEach>
    </div>
  </div>
</c:if>

<jsp:include page="/includes/footer.jsp" />
