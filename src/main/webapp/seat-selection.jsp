<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<jsp:include page="/includes/header.jsp" />

<div class="seat-view-container">
  <div class="seat-header-bar">
    <a href="${pageContext.request.contextPath}/movie-details?id=${show.movieId}" class="back-btn">
      <i class="fa-solid fa-arrow-left"></i> Change Show
    </a>
    <div class="seat-header-info">
      <h3>${show.movieTitle}</h3>
      <p style="color: var(--text-secondary); font-size: 0.85rem;">
        ${show.theaterName} • ${show.screenName} • ${show.showDate} at ${show.startTime}
      </p>
    </div>
  </div>

  <!-- Screen Curve -->
  <div class="screen-perspective">
    <div class="cinema-screen">
      <span class="screen-label">CINEMA SCREEN THIS WAY</span>
    </div>
  </div>

  <!-- Seat Legend -->
  <div class="seat-legend">
    <div class="legend-item">
      <span class="seat-sample seat-available"></span>
      <span>Standard (₹${show.standardPrice})</span>
    </div>
    <div class="legend-item">
      <span class="seat-sample seat-premium-sample"></span>
      <span>Premium Recliner (₹${show.premiumPrice})</span>
    </div>
    <div class="legend-item">
      <span class="seat-sample seat-selected"></span>
      <span>Selected</span>
    </div>
    <div class="legend-item">
      <span class="seat-sample seat-booked"></span>
      <span>Booked</span>
    </div>
  </div>

  <!-- Interactive Grid Form -->
  <form action="${pageContext.request.contextPath}/booking" method="POST" id="bookingForm">
    <input type="hidden" name="showId" value="${show.showId}" />
    <input type="hidden" name="seats" id="hiddenSeats" value="" />
    <input type="hidden" name="totalAmount" id="hiddenTotalAmount" value="0" />

    <div class="auditorium-grid" id="jspAuditoriumGrid">
      <!-- Generated via Simple Javascript for instant interaction -->
    </div>

    <div class="seat-bottom-bar">
      <div class="seat-summary-left">
        <div class="selected-seats-badge">
          <span class="count" id="jspSeatCount">0</span> Tickets Selected
        </div>
        <div class="seat-list-preview" id="jspSeatList">No seats selected</div>
      </div>

      <div class="seat-summary-right">
        <div class="total-price-box">
          <span class="total-label">Total Amount:</span>
          <span class="total-value">₹<span id="jspTotalPrice">0.00</span></span>
        </div>
        <button type="submit" class="btn btn-primary" id="jspBtnSubmit" disabled>
          Confirm & Pay <i class="fa-solid fa-arrow-right"></i>
        </button>
      </div>
    </div>
  </form>
</div>

<script>
  const bookedSeatsList = [
    <c:forEach var="bSeat" items="${bookedSeats}" varStatus="status">
      "${bSeat}"<c:if test="${!status.last}">,</c:if>
    </c:forEach>
  ];

  const stdPrice = ${show.standardPrice};
  const premPrice = ${show.premiumPrice};
  const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
  const cols = 10;
  const premiumRows = ['A', 'B'];

  const selectedSeats = [];

  function buildGrid() {
    const grid = document.getElementById('jspAuditoriumGrid');
    let html = '';

    rows.forEach(row => {
      const isPrem = premiumRows.includes(row);
      const price = isPrem ? premPrice : stdPrice;
      const type = isPrem ? 'premium' : 'standard';

      html += '<div class="seat-row"><div class="row-label">' + row + '</div>';

      for (let c = 1; c <= cols; c++) {
        const seatId = row + c;
        const isBooked = bookedSeatsList.includes(seatId);

        if (c === 5) html += '<div style="width: 20px;"></div>';

        html += '<div class="seat ' + type + (isBooked ? ' booked' : '') + '" id="seat_' + seatId + '" onclick="toggleSeat(\'' + seatId + '\', ' + price + ', this)">' + c + '</div>';
      }

      html += '<div class="row-label">' + row + '</div></div>';
    });

    grid.innerHTML = html;
  }

  function toggleSeat(seatId, price, el) {
    if (el.classList.contains('booked')) return;

    const idx = selectedSeats.findIndex(s => s.id === seatId);
    if (idx !== -1) {
      selectedSeats.splice(idx, 1);
      el.classList.remove('selected');
    } else {
      if (selectedSeats.length >= 8) {
        alert('You can select a maximum of 8 seats.');
        return;
      }
      selectedSeats.push({ id: seatId, price: price });
      el.classList.add('selected');
    }

    updateSummary();
  }

  function updateSummary() {
    const total = selectedSeats.reduce((sum, s) => sum + s.price, 0);
    const tax = total * 0.18;
    const grandTotal = total + tax;

    document.getElementById('jspSeatCount').textContent = selectedSeats.length;
    document.getElementById('jspTotalPrice').textContent = grandTotal.toFixed(2);
    document.getElementById('jspSeatList').textContent = selectedSeats.length > 0 ? selectedSeats.map(s => s.id).join(', ') : 'No seats selected';

    document.getElementById('hiddenSeats').value = selectedSeats.map(s => s.id).join(',');
    document.getElementById('hiddenTotalAmount').value = grandTotal.toFixed(2);
    document.getElementById('jspBtnSubmit').disabled = selectedSeats.length === 0;
  }

  buildGrid();
</script>

<jsp:include page="/includes/footer.jsp" />
