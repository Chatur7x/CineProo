import com.sun.net.httpserver.HttpServer;
import com.sun.net.httpserver.HttpExchange;
import java.io.*;
import java.net.InetSocketAddress;
import java.nio.charset.StandardCharsets;
import java.util.*;

public class PaymentServer {
    private static CardManager cardManager = new CardManager();
    private static BookingStorage bookingStorage = new BookingStorage();
    private static PasswordManager passwordManager = new PasswordManager();

    public static void main(String[] args) throws IOException {
        HttpServer server = HttpServer.create(new InetSocketAddress(8080), 0);

        server.createContext("/api/cards", (exchange) -> {
            if ("GET".equals(exchange.getRequestMethod())) {
                String json = cardsToJson(cardManager.getAllCards());
                sendResponse(exchange, 200, json);
            } else if ("POST".equals(exchange.getRequestMethod())) {
                String body = readBody(exchange);
                String[] parts = body.split("&");
                Map<String, String> params = new HashMap<>();
                for (String p : parts) {
                    String[] kv = p.split("=");
                    if (kv.length == 2) params.put(kv[0], kv[1]);
                }
                Card card = new Card(params.get("number"), params.get("name"),
                    params.get("expiry"), params.get("cvv"), params.get("bank"));
                cardManager.addCard(card);
                sendResponse(exchange, 200, "{\"status\":\"ok\",\"last4\":\"" + card.getLast4() + "\"}");
            } else {
                sendResponse(exchange, 405, "{\"error\":\"Method not allowed\"}");
            }
        });

        server.createContext("/api/bookings", (exchange) -> {
            if ("GET".equals(exchange.getRequestMethod())) {
                String json = bookingsToJson(bookingStorage.getAllBookings());
                sendResponse(exchange, 200, json);
            } else {
                sendResponse(exchange, 405, "{\"error\":\"Method not allowed\"}");
            }
        });

        server.createContext("/api/passwords", (exchange) -> {
            if ("GET".equals(exchange.getRequestMethod())) {
                String json = servicesToJson(passwordManager.getAllServices());
                sendResponse(exchange, 200, json);
            } else if ("POST".equals(exchange.getRequestMethod())) {
                String body = readBody(exchange);
                String[] parts = body.split("&");
                Map<String, String> params = new HashMap<>();
                for (String p : parts) {
                    String[] kv = p.split("=");
                    if (kv.length == 2) params.put(kv[0], kv[1]);
                }
                if (params.containsKey("service") && params.containsKey("password")) {
                    passwordManager.savePassword(params.get("service"), params.get("password"));
                    sendResponse(exchange, 200, "{\"status\":\"ok\"}");
                } else {
                    sendResponse(exchange, 400, "{\"error\":\"Missing service or password\"}");
                }
            } else {
                sendResponse(exchange, 405, "{\"error\":\"Method not allowed\"}");
            }
        });

        server.createContext("/api/health", (exchange) -> {
            sendResponse(exchange, 200, "{\"status\":\"ok\",\"java\":true}");
        });

        server.setExecutor(null);
        server.start();
        System.out.println("Java Payment Server running on http://localhost:8080");
    }

    private static String cardsToJson(ArrayList<Card> cards) {
        StringBuilder sb = new StringBuilder("{\"cards\":[");
        for (int i = 0; i < cards.size(); i++) {
            Card c = cards.get(i);
            if (i > 0) sb.append(",");
            sb.append("{\"number\":\"").append(c.getNumber())
              .append("\",\"name\":\"").append(c.getName())
              .append("\",\"expiry\":\"").append(c.getExpiry())
              .append("\",\"bank\":\"").append(c.getBank())
              .append("\",\"last4\":\"").append(c.getLast4())
              .append("\",\"type\":\"").append(c.getCardType())
              .append("\"}");
        }
        sb.append("]}");
        return sb.toString();
    }

    private static String bookingsToJson(ArrayList<Booking> bookings) {
        StringBuilder sb = new StringBuilder("{\"bookings\":[");
        for (int i = 0; i < bookings.size(); i++) {
            Booking b = bookings.get(i);
            if (i > 0) sb.append(",");
            sb.append("{\"id\":\"").append(b.getId())
              .append("\",\"movie\":\"").append(b.getMovieTitle())
              .append("\",\"showtime\":\"").append(b.getShowtime())
              .append("\",\"seats\":\"").append(b.getSeats())
              .append("\",\"total\":").append(b.getTotal())
              .append(",\"date\":\"").append(b.getDate())
              .append("\",\"paymentMethod\":\"").append(b.getPaymentMethod())
              .append("\",\"cardInfo\":\"").append(b.getCardInfo() != null ? b.getCardInfo() : "")
              .append("\"}");
        }
        sb.append("]}");
        return sb.toString();
    }

    private static String servicesToJson(ArrayList<String> services) {
        StringBuilder sb = new StringBuilder("{\"services\":[");
        for (int i = 0; i < services.size(); i++) {
            if (i > 0) sb.append(",");
            sb.append("\"").append(services.get(i)).append("\"");
        }
        sb.append("]}");
        return sb.toString();
    }

    private static void sendResponse(HttpExchange exchange, int code, String response) throws IOException {
        byte[] bytes = response.getBytes(StandardCharsets.UTF_8);
        exchange.getResponseHeaders().set("Content-Type", "application/json");
        exchange.getResponseHeaders().set("Access-Control-Allow-Origin", "*");
        exchange.sendResponseHeaders(code, bytes.length);
        OutputStream os = exchange.getResponseBody();
        os.write(bytes);
        os.close();
    }

    private static String readBody(HttpExchange exchange) throws IOException {
        InputStream is = exchange.getRequestBody();
        BufferedReader br = new BufferedReader(new InputStreamReader(is, StandardCharsets.UTF_8));
        StringBuilder sb = new StringBuilder();
        String line;
        while ((line = br.readLine()) != null) sb.append(line);
        return sb.toString();
    }
}
