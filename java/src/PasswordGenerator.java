import java.io.FileWriter;
import java.io.IOException;
import java.util.Random;

public class PasswordGenerator {
    private static final String LETTERS = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    private static final String NUMBERS = "0123456789";
    private static final String SYMBOLS = "!@#$%^&*()_+-=[]{}|;:,.<>?";

    private boolean includeNumbers;
    private boolean includeSymbols;
    private Random random;

    public PasswordGenerator() {
        this.includeNumbers = true;
        this.includeSymbols = true;
        this.random = new Random();
    }

    public void includeNumbers(boolean include) { this.includeNumbers = include; }
    public void includeSymbols(boolean include) { this.includeSymbols = include; }

    public String generate(int length) {
        StringBuilder pool = new StringBuilder(LETTERS);
        if (includeNumbers) pool.append(NUMBERS);
        if (includeSymbols) pool.append(SYMBOLS);

        StringBuilder password = new StringBuilder();
        for (int i = 0; i < length; i++) {
            int index = random.nextInt(pool.length());
            password.append(pool.charAt(index));
        }
        return password.toString();
    }

    public void saveToFile(String password) throws IOException {
        FileWriter fw = null;
        try {
            fw = new FileWriter("saved_passwords.txt", true);
            fw.write(password + System.lineSeparator());
        } finally {
            if (fw != null) {
                try { fw.close(); } catch (IOException e) {
                    System.err.println("Error closing file: " + e.getMessage());
                }
            }
        }
    }
}
