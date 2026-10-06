<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<jsp:include page="/includes/header.jsp" />

<div class="section-container">
  <div class="section-header">
    <div>
      <h2 class="section-title"><i class="fa-solid fa-shield-halved text-accent"></i> Administrator Dashboard</h2>
      <p class="section-subtitle">Manage movie catalog and theater scheduling</p>
    </div>
  </div>

  <div class="admin-table-card" style="margin-bottom: 30px;">
    <h3 style="margin-bottom: 20px;"><i class="fa-solid fa-plus-circle text-accent"></i> Add New Movie</h3>
    <form action="${pageContext.request.contextPath}/admin" method="POST">
      <input type="hidden" name="action" value="addMovie" />

      <div class="form-group">
        <label>Movie Title</label>
        <input type="text" name="title" required placeholder="e.g. Gladiator II" />
      </div>

      <div class="form-row">
        <div class="form-group">
          <label>Genre</label>
          <input type="text" name="genre" required placeholder="Action / Drama" />
        </div>
        <div class="form-group">
          <label>Language</label>
          <input type="text" name="language" required placeholder="English, Hindi" />
        </div>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label>Duration (Minutes)</label>
          <input type="number" name="duration" required value="148" />
        </div>
        <div class="form-group">
          <label>Release Date</label>
          <input type="date" name="releaseDate" required value="2024-11-22" />
        </div>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label>Poster URL</label>
          <input type="url" name="posterUrl" required placeholder="https://..." />
        </div>
        <div class="form-group">
          <label>Status</label>
          <select name="status">
            <option value="NOW_SHOWING">Now Showing</option>
            <option value="UPCOMING">Upcoming</option>
          </select>
        </div>
      </div>

      <div class="form-group">
        <label>Synopsis</label>
        <textarea name="description" rows="2" placeholder="Brief movie description..."></textarea>
      </div>

      <button type="submit" class="btn btn-primary"><i class="fa-solid fa-plus"></i> Add Movie</button>
    </form>
  </div>

  <div class="admin-table-card">
    <h3 style="margin-bottom: 16px;"><i class="fa-solid fa-film text-accent"></i> Current Movies</h3>
    <table class="admin-table">
      <thead>
        <tr>
          <th>Poster</th>
          <th>Title</th>
          <th>Genre</th>
          <th>Duration</th>
          <th>Status</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        <c:forEach var="m" items="${movies}">
          <tr>
            <td><img src="${m.posterUrl}" style="width: 36px; height: 50px; object-fit: cover; border-radius: 4px;" /></td>
            <td><strong>${m.title}</strong></td>
            <td>${m.genre}</td>
            <td>${m.durationMinutes}m</td>
            <td><span class="badge badge-info">${m.status}</span></td>
            <td>
              <form action="${pageContext.request.contextPath}/admin" method="POST" style="display: inline;" onsubmit="return confirm('Delete movie?');">
                <input type="hidden" name="action" value="deleteMovie" />
                <input type="hidden" name="movieId" value="${m.movieId}" />
                <button type="submit" class="btn-xs" style="color: #ef4444;"><i class="fa-solid fa-trash"></i> Delete</button>
              </form>
            </td>
          </tr>
        </c:forEach>
      </tbody>
    </table>
  </div>
</div>

<jsp:include page="/includes/footer.jsp" />
