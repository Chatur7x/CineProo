import java.io.*;
import java.util.*;

public class BookingStorage {
    private ArrayList<Booking> bookings;
    private static final String FILE_PATH = "bookings.txt";

    public BookingStorage() {
        bookings = new ArrayList<>();
        loadFromFile();
    }

    public void addBooking(Booking booking) {
        bookings.add(booking);
        saveToFile();
    }

    public ArrayList<Booking> getAllBookings() {
        return new ArrayList<>(bookings);
    }

    public Booking getBooking(String id) {
        for (Booking b : bookings) {
            if (b.getId().equals(id)) return b;
        }
        return null;
    }

    public int getBookingCount() {
        return bookings.size();
    }

    private void loadFromFile() {
        File file = new File(FILE_PATH);
        if (!file.exists()) return;
        try (BufferedReader br = new BufferedReader(new FileReader(file))) {
            String line;
            while ((line = br.readLine()) != null) {
                Booking b = Booking.fromString(line);
                if (b != null) bookings.add(b);
            }
        } catch (IOException e) {
            System.err.println("Error loading bookings: " + e.getMessage());
        }
    }

    private void saveToFile() {
        try (BufferedWriter bw = new BufferedWriter(new FileWriter(FILE_PATH))) {
            for (Booking b : bookings) {
                bw.write(b.toString());
                bw.newLine();
            }
        } catch (IOException e) {
            System.err.println("Error saving bookings: " + e.getMessage());
        }
    }
}
