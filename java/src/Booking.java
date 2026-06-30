public class Booking {
    private String id;
    private String movieTitle;
    private String showtime;
    private String seats;
    private double total;
    private String date;
    private String paymentMethod;
    private String cardInfo;

    public Booking(String id, String movieTitle, String showtime, String seats,
                   double total, String date, String paymentMethod, String cardInfo) {
        this.id = id;
        this.movieTitle = movieTitle;
        this.showtime = showtime;
        this.seats = seats;
        this.total = total;
        this.date = date;
        this.paymentMethod = paymentMethod;
        this.cardInfo = cardInfo;
    }

    public String getId() { return id; }
    public String getMovieTitle() { return movieTitle; }
    public String getShowtime() { return showtime; }
    public String getSeats() { return seats; }
    public double getTotal() { return total; }
    public String getDate() { return date; }
    public String getPaymentMethod() { return paymentMethod; }
    public String getCardInfo() { return cardInfo; }

    @Override
    public String toString() {
        return id + "|" + movieTitle + "|" + showtime + "|" + seats + "|" +
               total + "|" + date + "|" + paymentMethod + "|" + (cardInfo != null ? cardInfo : "");
    }

    public static Booking fromString(String line) {
        String[] parts = line.split("\\|");
        if (parts.length >= 6) {
            return new Booking(parts[0], parts[1], parts[2], parts[3],
                Double.parseDouble(parts[4]), parts[5],
                parts.length > 6 ? parts[6] : "Counter",
                parts.length > 7 ? parts[7] : "");
        }
        return null;
    }
}
