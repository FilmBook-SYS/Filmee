<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<jsp:include page="/includes/header.jsp" />

<div style="max-width: 440px; margin: 30px auto;">
  <div class="ticket-container" id="printableTicket">
    <div class="ticket-header">
      <div class="ticket-brand">
        <i class="fa-solid fa-film text-accent"></i>
        <span>Film<span>ee</span> Cinema Pass</span>
      </div>
      <span class="ticket-status-badge"><i class="fa-solid fa-circle-check"></i> ${booking.bookingStatus}</span>
    </div>

    <div class="ticket-body">
      <div class="ticket-movie-title">${booking.movieTitle}</div>
      <div class="ticket-meta">Digital Reservation Pass</div>

      <div class="ticket-grid">
        <div class="tkt-cell">
          <span class="tkt-label">THEATER & AUDI</span>
          <strong>${booking.theaterName} • ${booking.screenName}</strong>
        </div>
        <div class="tkt-cell">
          <span class="tkt-label">DATE & TIME</span>
          <strong>${booking.showDate} • ${booking.showTime}</strong>
        </div>
        <div class="tkt-cell">
          <span class="tkt-label">SEATS</span>
          <strong class="text-accent">
            <c:forEach var="seat" items="${booking.seatList}" varStatus="status">
              ${seat}<c:if test="${!status.last}">, </c:if>
            </c:forEach>
          </strong>
        </div>
        <div class="tkt-cell">
          <span class="tkt-label">BOOKING ID</span>
          <strong>${booking.bookingReference}</strong>
        </div>
      </div>

      <div class="ticket-qr-section">
        <div class="tkt-qr">
          <i class="fa-solid fa-qrcode fa-5x"></i>
        </div>
        <div class="tkt-qr-info">
          <p><strong>Scan at cinema entrance</strong></p>
          <small class="text-muted">Total Paid: ₹${booking.totalAmount}</small>
        </div>
      </div>
    </div>

    <div class="ticket-tear-line">
      <div class="notch notch-left"></div>
      <div class="tear-dots"></div>
      <div class="notch notch-right"></div>
    </div>

    <div class="ticket-footer">
      <div class="barcode-graphic">||| | |||| | || ||||| ||| | ||| |||| | ||| || |||</div>
      <small>Thank you for booking with Filmee!</small>
    </div>
  </div>

  <div class="ticket-actions" style="margin-top: 20px;">
    <button class="btn btn-primary" onclick="window.print()"><i class="fa-solid fa-print"></i> Print Ticket</button>
    <a href="${pageContext.request.contextPath}/home" class="btn btn-secondary"><i class="fa-solid fa-house"></i> Home</a>
  </div>
</div>

<jsp:include page="/includes/footer.jsp" />
