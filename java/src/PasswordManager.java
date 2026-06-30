import java.io.*;
import java.util.*;

public class PasswordManager {
    private HashMap<String, String> passwords;
    private static final String FILE_PATH = "saved_passwords.txt";

    public PasswordManager() {
        passwords = new HashMap<>();
        loadFromFile();
    }

    public void savePassword(String service, String password) {
        passwords.put(service, password);
        saveToFile();
    }

    public String getPassword(String service) {
        return passwords.get(service);
    }

    public ArrayList<String> getAllServices() {
        return new ArrayList<>(passwords.keySet());
    }

    public boolean removePassword(String service) {
        String removed = passwords.remove(service);
        if (removed != null) {
            saveToFile();
            return true;
        }
        return false;
    }

    private void loadFromFile() {
        File file = new File(FILE_PATH);
        if (!file.exists()) return;
        try (BufferedReader br = new BufferedReader(new FileReader(file))) {
            String line;
            while ((line = br.readLine()) != null) {
                String[] parts = line.split(":", 2);
                if (parts.length == 2) {
                    passwords.put(parts[0], parts[1]);
                }
            }
        } catch (IOException e) {
            System.err.println("Error loading passwords: " + e.getMessage());
        }
    }

    private void saveToFile() {
        try (BufferedWriter bw = new BufferedWriter(new FileWriter(FILE_PATH))) {
            for (Map.Entry<String, String> entry : passwords.entrySet()) {
                bw.write(entry.getKey() + ":" + entry.getValue());
                bw.newLine();
            }
        } catch (IOException e) {
            System.err.println("Error saving passwords: " + e.getMessage());
        }
    }
}
