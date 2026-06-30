import javax.swing.*;
import javax.swing.table.DefaultTableModel;
import java.awt.*;

public class MovieManagerGUI extends JFrame {
    private MovieManager movieManager;
    private JTable movieTable;
    private DefaultTableModel tableModel;
    private JTextField titleField, ratingField, posterField, descField;
    private JComboBox<String> genreBox, langBox;

    public MovieManagerGUI(MovieManager manager) {
        this.movieManager = manager;
        setTitle("Movie Manager");
        setSize(800, 500);
        setLayout(new BorderLayout(10, 10));

        tableModel = new DefaultTableModel(new String[]{"ID", "Title", "Genre", "Rating", "Language"}, 0);
        movieTable = new JTable(tableModel);
        loadTableData();

        JPanel topPanel = new JPanel(new BorderLayout());
        topPanel.add(new JScrollPane(movieTable), BorderLayout.CENTER);
        add(topPanel, BorderLayout.CENTER);

        JPanel formPanel = new JPanel(new GridLayout(3, 4, 8, 8));
        formPanel.setBorder(BorderFactory.createTitledBorder("Add / Edit Movie"));

        formPanel.add(new JLabel("Title:"));
        titleField = new JTextField();
        formPanel.add(titleField);

        formPanel.add(new JLabel("Genre:"));
        genreBox = new JComboBox<>(new String[]{"Action", "Sci-Fi", "Sports", "Thriller", "Comedy", "Crime", "Drama"});
        formPanel.add(genreBox);

        formPanel.add(new JLabel("Rating:"));
        ratingField = new JTextField();
        formPanel.add(ratingField);

        formPanel.add(new JLabel("Language:"));
        langBox = new JComboBox<>(new String[]{"Telugu", "Tamil", "Hindi", "Kannada", "English"});
        formPanel.add(langBox);

        formPanel.add(new JLabel("Poster URL:"));
        posterField = new JTextField();
        formPanel.add(posterField);

        formPanel.add(new JLabel("Description:"));
        descField = new JTextField();
        formPanel.add(descField);

        add(formPanel, BorderLayout.NORTH);

        JPanel btnPanel = new JPanel(new FlowLayout());
        JButton addBtn = new JButton("Add Movie");
        JButton deleteBtn = new JButton("Delete Selected");
        JButton refreshBtn = new JButton("Refresh");

        addBtn.addActionListener(e -> addMovie());
        deleteBtn.addActionListener(e -> deleteMovie());
        refreshBtn.addActionListener(e -> loadTableData());

        btnPanel.add(addBtn);
        btnPanel.add(deleteBtn);
        btnPanel.add(refreshBtn);
        add(btnPanel, BorderLayout.SOUTH);

        setLocationRelativeTo(null);
        setVisible(true);
    }

    private void loadTableData() {
        tableModel.setRowCount(0);
        for (Movie m : movieManager.getAllMovies()) {
            tableModel.addRow(new Object[]{m.getId(), m.getTitle(), m.getGenre(), m.getRating(), m.getLanguage()});
        }
    }

    private void addMovie() {
        try {
            String title = titleField.getText().trim();
            if (title.isEmpty()) { JOptionPane.showMessageDialog(this, "Title required"); return; }
            double rating = Double.parseDouble(ratingField.getText().trim());
            int id = (int)(System.currentTimeMillis() % 100000);
            Movie movie = new Movie(id, title, (String)genreBox.getSelectedItem(), rating,
                (String)langBox.getSelectedItem(), posterField.getText().trim(), descField.getText().trim());
            movieManager.addMovie(movie);
            loadTableData();
            JOptionPane.showMessageDialog(this, "Movie added! ID: " + id);
            titleField.setText(""); ratingField.setText(""); posterField.setText(""); descField.setText("");
        } catch (NumberFormatException e) {
            JOptionPane.showMessageDialog(this, "Invalid rating", "Error", JOptionPane.ERROR_MESSAGE);
        }
    }

    private void deleteMovie() {
        int row = movieTable.getSelectedRow();
        if (row < 0) { JOptionPane.showMessageDialog(this, "Select a movie to delete"); return; }
        int id = (int)tableModel.getValueAt(row, 0);
        movieManager.removeMovie(id);
        loadTableData();
    }

    public static void main(String[] args) {
        SwingUtilities.invokeLater(() -> new MovieManagerGUI(new MovieManager()));
    }
}
