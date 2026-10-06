package com.filmee.model;

import java.io.Serializable;
import java.sql.Date;
import java.sql.Time;

public class Show implements Serializable {
    private static final long serialVersionUID = 1L;

    private int showId;
    private int movieId;
    private int screenId;
    private Date showDate;
    private Time startTime;
    private Time endTime;
    private double standardPrice;
    private double premiumPrice;
    private String status;

    // Join helper fields
    private String movieTitle;
    private String posterUrl;
    private String theaterName;
    private String screenName;

    public Show() {}

    public int getShowId() { return showId; }
    public void setShowId(int showId) { this.showId = showId; }

    public int getMovieId() { return movieId; }
    public void setMovieId(int movieId) { this.movieId = movieId; }

    public int getScreenId() { return screenId; }
    public void setScreenId(int screenId) { this.screenId = screenId; }

    public Date getShowDate() { return showDate; }
    public void setShowDate(Date showDate) { this.showDate = showDate; }

    public Time getStartTime() { return startTime; }
    public void setStartTime(Time startTime) { this.startTime = startTime; }

    public Time getEndTime() { return endTime; }
    public void setEndTime(Time endTime) { this.endTime = endTime; }

    public double getStandardPrice() { return standardPrice; }
    public void setStandardPrice(double standardPrice) { this.standardPrice = standardPrice; }

    public double getPremiumPrice() { return premiumPrice; }
    public void setPremiumPrice(double premiumPrice) { this.premiumPrice = premiumPrice; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getMovieTitle() { return movieTitle; }
    public void setMovieTitle(String movieTitle) { this.movieTitle = movieTitle; }

    public String getPosterUrl() { return posterUrl; }
    public void setPosterUrl(String posterUrl) { this.posterUrl = posterUrl; }

    public String getTheaterName() { return theaterName; }
    public void setTheaterName(String theaterName) { this.theaterName = theaterName; }

    public String getScreenName() { return screenName; }
    public void setScreenName(String screenName) { this.screenName = screenName; }
}
