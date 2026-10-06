package com.filmee.model;

import java.io.Serializable;

public class BookingSeat implements Serializable {
    private static final long serialVersionUID = 1L;

    private int bookingSeatId;
    private int bookingId;
    private int showId;
    private String seatRow;
    private int seatNumber;
    private String seatType; // "STANDARD" or "PREMIUM"
    private double price;

    public BookingSeat() {}

    public BookingSeat(int bookingSeatId, int bookingId, int showId, String seatRow, int seatNumber, String seatType, double price) {
        this.bookingSeatId = bookingSeatId;
        this.bookingId = bookingId;
        this.showId = showId;
        this.seatRow = seatRow;
        this.seatNumber = seatNumber;
        this.seatType = seatType;
        this.price = price;
    }

    public int getBookingSeatId() { return bookingSeatId; }
    public void setBookingSeatId(int bookingSeatId) { this.bookingSeatId = bookingSeatId; }

    public int getBookingId() { return bookingId; }
    public void setBookingId(int bookingId) { this.bookingId = bookingId; }

    public int getShowId() { return showId; }
    public void setShowId(int showId) { this.showId = showId; }

    public String getSeatRow() { return seatRow; }
    public void setSeatRow(String seatRow) { this.seatRow = seatRow; }

    public int getSeatNumber() { return seatNumber; }
    public void setSeatNumber(int seatNumber) { this.seatNumber = seatNumber; }

    public String getSeatType() { return seatType; }
    public void setSeatType(String seatType) { this.seatType = seatType; }

    public double getPrice() { return price; }
    public void setPrice(double price) { this.price = price; }

    public String getSeatCode() {
        return seatRow + seatNumber;
    }
}
