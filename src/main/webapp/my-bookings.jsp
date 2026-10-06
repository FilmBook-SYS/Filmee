<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<jsp:include page="/includes/header.jsp" />

<div class="section-container">
  <div class="section-header">
    <div>
      <h2 class="section-title"><i class="fa-solid fa-ticket text-accent"></i> My Ticket History</h2>
      <p class="section-subtitle">View and print all your confirmed movie tickets</p>
    </div>
    <a href="${pageContext.request.contextPath}/home" class="btn btn-secondary">
      <i class="fa-solid fa-plus"></i> Book Another Movie
    </a>
  </div>

  <div class="my-bookings-container">
    <c:choose>
      <c:when test="${not empty bookings}">
        <c:forEach var="b" items="${bookings}">
          <div class="booking-card">
            <div class="booking-card-header">
              <div>
                <span class="booking-ref-tag">${b.bookingReference}</span>
                <h3 style="font-size: 1.15rem; margin-top: 6px;">${b.movieTitle}</h3>
              </div>
              <span class="badge badge-info">${b.bookingStatus}</span>
            </div>

            <div style="font-size: 0.85rem; color: var(--text-secondary); margin-top: 10px;">
              <div><i class="fa-solid fa-location-dot text-accent"></i> ${b.theaterName} (${b.screenName})</div>
              <div><i class="fa-regular fa-calendar"></i> ${b.showDate} at ${b.showTime}</div>
              <div><i class="fa-solid fa-couch"></i> Seats: 
                <c:forEach var="st" items="${b.seatList}" varStatus="s">
                  <strong>${st}</strong><c:if test="${!s.last}">, </c:if>
                </c:forEach>
              </div>
              <div><i class="fa-solid fa-indian-rupee-sign"></i> Paid: ₹${b.totalAmount}</div>
            </div>

            <a href="${pageContext.request.contextPath}/ticket?id=${b.bookingId}" class="btn btn-primary" style="margin-top: 12px;">
              <i class="fa-solid fa-qrcode"></i> View E-Ticket Pass
            </a>
          </div>
        </c:forEach>
      </c:when>
      <c:otherwise>
        <div style="grid-column: 1/-1; text-align: center; padding: 50px 20px; color: var(--text-muted);">
          <h3>No bookings found</h3>
          <p>You haven't reserved any tickets yet.</p>
        </div>
      </c:otherwise>
    </c:choose>
  </div>
</div>

<jsp:include page="/includes/footer.jsp" />
