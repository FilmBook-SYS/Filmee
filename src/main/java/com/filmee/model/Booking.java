package com.filmee.model;

import java.io.Serializable;
import java.sql.Timestamp;
import java.util.List;

@SuppressWarnings("serial")
public class Booking implements Serializable {
    private static final long serialVersionUID = 1L;

    private int bookingId;
    private String bookingReference;
    private int userId;
    private int showId;
    private int totalTickets;
    private double totalAmount;
    private String bookingStatus; // "CONFIRMED", "CANCELLED"
    private Timestamp createdAt;

    // Join / Display helper fields
    private String customerName;
    private String customerEmail;
    private String customerPhone;
    private String movieTitle;
    private String posterUrl;
    private String theaterName;
    private String screenName;
    private String showDate;
    private String showTime;
    private List<BookingSeat> seats;
    private List<String> seatCodes;
    private Payment payment;

    public Booking() {}

    public int getBookingId() { return bookingId; }
    public void setBookingId(int bookingId) { this.bookingId = bookingId; }

    public String getBookingReference() { return bookingReference; }
    public void setBookingReference(String bookingReference) { this.bookingReference = bookingReference; }

    public int getUserId() { return userId; }
    public void setUserId(int userId) { this.userId = userId; }

    public int getShowId() { return showId; }
    public void setShowId(int showId) { this.showId = showId; }

    public int getTotalTickets() { return totalTickets; }
    public void setTotalTickets(int totalTickets) { this.totalTickets = totalTickets; }

    public double getTotalAmount() { return totalAmount; }
    public void setTotalAmount(double totalAmount) { this.totalAmount = totalAmount; }

    public String getBookingStatus() { return bookingStatus; }
    public void setBookingStatus(String bookingStatus) { this.bookingStatus = bookingStatus; }

    public Timestamp getCreatedAt() { return createdAt; }
    public void setCreatedAt(Timestamp createdAt) { this.createdAt = createdAt; }

    public String getCustomerName() { return customerName; }
    public void setCustomerName(String customerName) { this.customerName = customerName; }

    public String getCustomerEmail() { return customerEmail; }
    public void setCustomerEmail(String customerEmail) { this.customerEmail = customerEmail; }

    public String getCustomerPhone() { return customerPhone; }
    public void setCustomerPhone(String customerPhone) { this.customerPhone = customerPhone; }

    public String getMovieTitle() { return movieTitle; }
    public void setMovieTitle(String movieTitle) { this.movieTitle = movieTitle; }

    public String getPosterUrl() { return posterUrl; }
    public void setPosterUrl(String posterUrl) { this.posterUrl = posterUrl; }

    public String getTheaterName() { return theaterName; }
    public void setTheaterName(String theaterName) { this.theaterName = theaterName; }

    public String getScreenName() { return screenName; }
    public void setScreenName(String screenName) { this.screenName = screenName; }

    public String getShowDate() { return showDate; }
    public void setShowDate(String showDate) { this.showDate = showDate; }

    public String getShowTime() { return showTime; }
    public void setShowTime(String showTime) { this.showTime = showTime; }

    public List<BookingSeat> getSeats() { return seats; }
    public void setSeats(List<BookingSeat> seats) { this.seats = seats; }

    public List<String> getSeatCodes() { return seatCodes; }
    public void setSeatCodes(List<String> seatCodes) { this.seatCodes = seatCodes; }

    public Payment getPayment() { return payment; }
    public void setPayment(Payment payment) { this.payment = payment; }
}
