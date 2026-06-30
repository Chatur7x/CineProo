public class Movie {
    private int id;
    private String title;
    private String genre;
    private double rating;
    private String language;
    private String poster;
    private String description;

    public Movie(int id, String title, String genre, double rating, String language,
                 String poster, String description) {
        this.id = id;
        this.title = title;
        this.genre = genre;
        this.rating = rating;
        this.language = language;
        this.poster = poster;
        this.description = description;
    }

    public int getId() { return id; }
    public String getTitle() { return title; }
    public String getGenre() { return genre; }
    public double getRating() { return rating; }
    public String getLanguage() { return language; }
    public String getPoster() { return poster; }
    public String getDescription() { return description; }

    public void setTitle(String title) { this.title = title; }
    public void setGenre(String genre) { this.genre = genre; }
    public void setRating(double rating) { this.rating = rating; }
    public void setLanguage(String language) { this.language = language; }
    public void setPoster(String poster) { this.poster = poster; }
    public void setDescription(String description) { this.description = description; }

    @Override
    public String toString() {
        return id + "|" + title + "|" + genre + "|" + rating + "|" + language + "|" + poster + "|" + description;
    }

    public static Movie fromString(String line) {
        String[] parts = line.split("\\|", 7);
        if (parts.length >= 6) {
            return new Movie(Integer.parseInt(parts[0]), parts[1], parts[2],
                Double.parseDouble(parts[3]), parts[4], parts[5],
                parts.length > 6 ? parts[6] : "");
        }
        return null;
    }
}
