public class Card {
    private String number;
    private String name;
    private String expiry;
    private String cvv;
    private String bank;

    public Card(String number, String name, String expiry, String cvv, String bank) {
        this.number = number;
        this.name = name;
        this.expiry = expiry;
        this.cvv = cvv;
        this.bank = bank;
    }

    public String getNumber() { return number; }
    public String getName() { return name; }
    public String getExpiry() { return expiry; }
    public String getCvv() { return cvv; }
    public String getBank() { return bank; }
    public String getLast4() { return number.length() >= 4 ? number.substring(number.length() - 4) : number; }

    public String getCardType() {
        if (number.startsWith("4")) return "Visa";
        if (number.matches("^5[1-5].*")) return "Mastercard";
        if (number.startsWith("34") || number.startsWith("37")) return "Amex";
        if (number.startsWith("6011") || number.startsWith("65")) return "RuPay";
        return "Unknown";
    }

    public String getMasked() {
        return bank + " " + getCardType() + " ****" + getLast4();
    }

    @Override
    public String toString() {
        return getMasked();
    }
}
