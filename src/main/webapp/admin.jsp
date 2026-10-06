<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<jsp:include page="/includes/header.jsp" />

<div class="section-container">
  <div class="section-header">
    <div>
      <h2 class="section-title"><i class="fa-solid fa-shield-halved text-accent"></i> Administrator Dashboard</h2>
      <p class="section-subtitle">Manage movie catalog and theater show schedules</p>
    </div>
  </div>

  <!-- Add Movie Section -->
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
          <input type="url" name="posterUrl" required placeholder="https://images.unsplash.com/..." />
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

      <button type="submit" class="btn btn-primary"><i class="fa-solid fa-plus"></i> Add Movie to Catalog</button>
    </form>
  </div>

  <!-- Schedule Show Section -->
  <div class="admin-table-card" style="margin-bottom: 30px;">
    <h3 style="margin-bottom: 20px;"><i class="fa-solid fa-calendar-plus text-accent"></i> Schedule New Show</h3>
    <form action="${pageContext.request.contextPath}/admin" method="POST">
      <input type="hidden" name="action" value="addShow" />

      <div class="form-row">
        <div class="form-group">
          <label>Select Movie</label>
          <select name="movieId" required>
            <c:forEach var="m" items="${movies}">
              <option value="${m.movieId}">${m.title} (${m.language})</option>
            </c:forEach>
          </select>
        </div>

        <div class="form-group">
          <label>Select Screen / Auditorium</label>
          <select name="screenId" required>
            <c:forEach var="sc" items="${screens}">
              <option value="${sc.screenId}">${sc.theaterName} - ${sc.screenNumber}</option>
            </c:forEach>
          </select>
        </div>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label>Show Date</label>
          <input type="date" name="showDate" required value="2024-12-01" />
        </div>
        <div class="form-group">
          <label>Start Time (HH:MM)</label>
          <input type="text" name="startTime" required placeholder="18:30" value="18:30" />
        </div>
        <div class="form-group">
          <label>End Time (HH:MM)</label>
          <input type="text" name="endTime" required placeholder="21:15" value="21:15" />
        </div>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label>Standard Seat Price (₹)</label>
          <input type="number" name="standardPrice" required value="180" />
        </div>
        <div class="form-group">
          <label>Premium Recliner Price (₹)</label>
          <input type="number" name="premiumPrice" required value="300" />
        </div>
      </div>

      <button type="submit" class="btn btn-primary"><i class="fa-solid fa-calendar-check"></i> Add Show to Schedule</button>
    </form>
  </div>

  <!-- Current Movies Table -->
  <div class="admin-table-card" style="margin-bottom: 30px;">
    <h3 style="margin-bottom: 16px;"><i class="fa-solid fa-film text-accent"></i> Active Movies Catalog</h3>
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
              <form action="${pageContext.request.contextPath}/admin" method="POST" style="display: inline;" onsubmit="return confirm('Delete this movie?');">
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

  <!-- Scheduled Shows Table -->
  <div class="admin-table-card">
    <h3 style="margin-bottom: 16px;"><i class="fa-solid fa-clock text-accent"></i> Scheduled Shows</h3>
    <table class="admin-table">
      <thead>
        <tr>
          <th>Show ID</th>
          <th>Movie</th>
          <th>Theater & Screen</th>
          <th>Date</th>
          <th>Time</th>
          <th>Prices</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        <c:forEach var="s" items="${shows}">
          <tr>
            <td>#${s.showId}</td>
            <td><strong>${s.movieTitle}</strong></td>
            <td>${s.theaterName} (${s.screenName})</td>
            <td>${s.showDate}</td>
            <td>${s.startTime}</td>
            <td>₹${s.standardPrice} / ₹${s.premiumPrice}</td>
            <td>
              <form action="${pageContext.request.contextPath}/admin" method="POST" style="display: inline;" onsubmit="return confirm('Cancel this show?');">
                <input type="hidden" name="action" value="deleteShow" />
                <input type="hidden" name="showId" value="${s.showId}" />
                <button type="submit" class="btn-xs" style="color: #ef4444;"><i class="fa-solid fa-trash"></i> Cancel Show</button>
              </form>
            </td>
          </tr>
        </c:forEach>
      </tbody>
    </table>
  </div>
</div>

<jsp:include page="/includes/footer.jsp" />
