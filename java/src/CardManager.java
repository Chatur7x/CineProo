import java.io.*;
import java.util.*;

public class CardManager {
    private HashMap<String, Card> cards;
    private static final String FILE_PATH = "saved_cards.txt";

    public CardManager() {
        cards = new HashMap<>();
        loadFromFile();
    }

    public void addCard(Card card) {
        cards.put(card.getLast4(), card);
        saveToFile();
    }

    public Card getCard(String last4) {
        return cards.get(last4);
    }

    public ArrayList<Card> getAllCards() {
        return new ArrayList<>(cards.values());
    }

    public boolean removeCard(String last4) {
        Card removed = cards.remove(last4);
        if (removed != null) {
            saveToFile();
            return true;
        }
        return false;
    }

    public int getCardCount() {
        return cards.size();
    }

    private void loadFromFile() {
        File file = new File(FILE_PATH);
        if (!file.exists()) return;
        try (BufferedReader br = new BufferedReader(new FileReader(file))) {
            String line;
            while ((line = br.readLine()) != null) {
                String[] parts = line.split("\\|");
                if (parts.length == 5) {
                    Card card = new Card(parts[0], parts[1], parts[2], parts[3], parts[4]);
                    cards.put(card.getLast4(), card);
                }
            }
        } catch (IOException e) {
            System.err.println("Error loading cards: " + e.getMessage());
        }
    }

    private void saveToFile() {
        try (BufferedWriter bw = new BufferedWriter(new FileWriter(FILE_PATH))) {
            for (Card card : cards.values()) {
                bw.write(card.getNumber() + "|" + card.getName() + "|" +
                         card.getExpiry() + "|" + card.getCvv() + "|" + card.getBank());
                bw.newLine();
            }
        } catch (IOException e) {
            System.err.println("Error saving cards: " + e.getMessage());
        }
    }
}
