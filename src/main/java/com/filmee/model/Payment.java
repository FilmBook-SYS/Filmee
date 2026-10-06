package com.filmee.model;

import java.io.Serializable;
import java.sql.Timestamp;

public class Payment implements Serializable {
    private static final long serialVersionUID = 1L;

    private int paymentId;
    private int bookingId;
    private String transactionId;
    private String paymentMethod; // "CARD", "UPI", "NET_BANKING", "DUMMY_GATEWAY"
    private double amount;
    private String paymentStatus; // "SUCCESS", "FAILED", "REFUNDED"
    private Timestamp paymentTime;

    public Payment() {}

    public Payment(int paymentId, int bookingId, String transactionId, String paymentMethod, double amount, String paymentStatus) {
        this.paymentId = paymentId;
        this.bookingId = bookingId;
        this.transactionId = transactionId;
        this.paymentMethod = paymentMethod;
        this.amount = amount;
        this.paymentStatus = paymentStatus;
    }

    public int getPaymentId() { return paymentId; }
    public void setPaymentId(int paymentId) { this.paymentId = paymentId; }

    public int getBookingId() { return bookingId; }
    public void setBookingId(int bookingId) { this.bookingId = bookingId; }

    public String getTransactionId() { return transactionId; }
    public void setTransactionId(String transactionId) { this.transactionId = transactionId; }

    public String getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }

    public double getAmount() { return amount; }
    public void setAmount(double amount) { this.amount = amount; }

    public String getPaymentStatus() { return paymentStatus; }
    public void setPaymentStatus(String paymentStatus) { this.paymentStatus = paymentStatus; }

    public Timestamp getPaymentTime() { return paymentTime; }
    public void setPaymentTime(Timestamp paymentTime) { this.paymentTime = paymentTime; }
}
