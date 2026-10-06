package com.filmee.model;

import java.io.Serializable;

public class Screen implements Serializable {
    private static final long serialVersionUID = 1L;

    private int screenId;
    private int theaterId;
    private String screenNumber;
    private int totalRows;
    private int seatsPerRow;
    private int totalCapacity;
    private String theaterName;

    public Screen() {}

    public Screen(int screenId, int theaterId, String screenNumber, int totalRows, int seatsPerRow) {
        this.screenId = screenId;
        this.theaterId = theaterId;
        this.screenNumber = screenNumber;
        this.totalRows = totalRows;
        this.seatsPerRow = seatsPerRow;
        this.totalCapacity = totalRows * seatsPerRow;
    }

    public int getScreenId() { return screenId; }
    public void setScreenId(int screenId) { this.screenId = screenId; }

    public int getTheaterId() { return theaterId; }
    public void setTheaterId(int theaterId) { this.theaterId = theaterId; }

    public String getScreenNumber() { return screenNumber; }
    public void setScreenNumber(String screenNumber) { this.screenNumber = screenNumber; }

    public int getTotalRows() { return totalRows; }
    public void setTotalRows(int totalRows) { this.totalRows = totalRows; }

    public int getSeatsPerRow() { return seatsPerRow; }
    public void setSeatsPerRow(int seatsPerRow) { this.seatsPerRow = seatsPerRow; }

    public int getTotalCapacity() { return totalCapacity; }
    public void setTotalCapacity(int totalCapacity) { this.totalCapacity = totalCapacity; }

    public String getTheaterName() { return theaterName; }
    public void setTheaterName(String theaterName) { this.theaterName = theaterName; }
}
