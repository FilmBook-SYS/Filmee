package com.filmee;

import com.filmee.model.BookingSeat;
import com.filmee.model.User;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

public class BookingServiceTest {

    @Test
    public void testUserAdminRole() {
        User admin = new User(1, "Admin User", "admin@filmee.com", "pass", "9876543210", "ADMIN");
        assertTrue(admin.isAdmin(), "User with role ADMIN should return true for isAdmin()");

        User customer = new User(2, "Customer User", "cust@filmee.com", "pass", "9876543211", "CUSTOMER");
        assertFalse(customer.isAdmin(), "User with role CUSTOMER should return false for isAdmin()");
    }

    @Test
    public void testBookingSeatCode() {
        BookingSeat seat = new BookingSeat(1, 10, 100, "C", 4, "STANDARD", 180.0);
        assertEquals("C4", seat.getSeatCode(), "Seat code should match concatenation of row and number");
    }
}
