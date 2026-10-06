package com.filmee.model;

import java.io.Serializable;
import java.util.List;

public class Theater implements Serializable {
    private static final long serialVersionUID = 1L;

    private int theaterId;
    private String name;
    private String city;
    private String address;
    private int totalScreens;
    private List<Screen> screens;

    public Theater() {}

    public Theater(int theaterId, String name, String city, String address, int totalScreens) {
        this.theaterId = theaterId;
        this.name = name;
        this.city = city;
        this.address = address;
        this.totalScreens = totalScreens;
    }

    public int getTheaterId() { return theaterId; }
    public void setTheaterId(int theaterId) { this.theaterId = theaterId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public int getTotalScreens() { return totalScreens; }
    public void setTotalScreens(int totalScreens) { this.totalScreens = totalScreens; }

    public List<Screen> getScreens() { return screens; }
    public void setScreens(List<Screen> screens) { this.screens = screens; }
}
