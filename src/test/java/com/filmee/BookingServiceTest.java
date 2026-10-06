package com.filmee;

import com.filmee.model.BookingSeat;
import com.filmee.model.User;

public class BookingServiceTest {

    public static void main(String[] args) {
        testUserAdminRole();
        testBookingSeatCode();
        System.out.println("✅ All Filmee Backend Unit & Model Tests Passed Successfully!");
    }

    public static void testUserAdminRole() {
        User admin = new User(1, "Admin User", "admin@filmee.com", "pass", "9876543210", "ADMIN");
        if (!admin.isAdmin()) {
            throw new AssertionError("User with role ADMIN should return true for isAdmin()");
        }

        User customer = new User(2, "Customer User", "cust@filmee.com", "pass", "9876543211", "CUSTOMER");
        if (customer.isAdmin()) {
            throw new AssertionError("User with role CUSTOMER should return false for isAdmin()");
        }
    }

    public static void testBookingSeatCode() {
        BookingSeat seat = new BookingSeat(1, 10, 100, "C", 4, "STANDARD", 180.0);
        if (!"C4".equals(seat.getSeatCode())) {
            throw new AssertionError("Seat code should match concatenation of row and number C4, got: " + seat.getSeatCode());
        }
    }
}
