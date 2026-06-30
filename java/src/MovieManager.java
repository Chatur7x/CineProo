import java.io.*;
import java.util.*;

public class MovieManager {
    private HashMap<Integer, Movie> movies;
    private static final String FILE_PATH = "movies_data.txt";

    public MovieManager() {
        movies = new HashMap<>();
        loadFromFile();
    }

    public void addMovie(Movie movie) {
        movies.put(movie.getId(), movie);
        saveToFile();
    }

    public Movie getMovie(int id) {
        return movies.get(id);
    }

    public ArrayList<Movie> getAllMovies() {
        return new ArrayList<>(movies.values());
    }

    public boolean removeMovie(int id) {
        Movie removed = movies.remove(id);
        if (removed != null) {
            saveToFile();
            return true;
        }
        return false;
    }

    public int getMovieCount() {
        return movies.size();
    }

    private void loadFromFile() {
        File file = new File(FILE_PATH);
        if (!file.exists()) return;
        try (BufferedReader br = new BufferedReader(new FileReader(file))) {
            String line;
            while ((line = br.readLine()) != null) {
                Movie m = Movie.fromString(line);
                if (m != null) movies.put(m.getId(), m);
            }
        } catch (IOException e) {
            System.err.println("Error loading movies: " + e.getMessage());
        }
    }

    private void saveToFile() {
        try (BufferedWriter bw = new BufferedWriter(new FileWriter(FILE_PATH))) {
            for (Movie m : movies.values()) {
                bw.write(m.toString());
                bw.newLine();
            }
        } catch (IOException e) {
            System.err.println("Error saving movies: " + e.getMessage());
        }
    }
}
