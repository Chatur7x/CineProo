import javax.swing.*;
import java.awt.*;
import java.util.HashMap;

public class MainGUI {
    private JFrame frame;
    private JPasswordField passwordField;
    private JCheckBox showPasswordCheck;
    private JProgressBar strengthBar;
    private JLabel strengthLabel;
    private JPanel rulesPanel;
    private JButton checkBtn, generateBtn, saveBtn;
    private JTextField lengthField;
    private JCheckBox includeNumbersCheck, includeSymbolsCheck;

    private HashMap<String, Integer> passwordHistory;
    private PasswordGenerator generator;

    public MainGUI() {
        passwordHistory = new HashMap<>();
        generator = new PasswordGenerator();
        initUI();
    }

    private void initUI() {
        frame = new JFrame("Password Strength Checker");
        frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        frame.setLayout(new BorderLayout(10, 10));

        JLabel title = new JLabel("Password Strength Checker", SwingConstants.CENTER);
        title.setFont(new Font("Arial", Font.BOLD, 18));
        frame.add(title, BorderLayout.NORTH);

        JPanel centerPanel = new JPanel();
        centerPanel.setLayout(new BoxLayout(centerPanel, BoxLayout.Y_AXIS));
        centerPanel.setBorder(BorderFactory.createEmptyBorder(10, 20, 10, 20));

        JPanel inputPanel = new JPanel(new FlowLayout(FlowLayout.LEFT));
        inputPanel.add(new JLabel("Enter Password:"));
        passwordField = new JPasswordField(20);
        passwordField.setEchoChar('\u2022');
        inputPanel.add(passwordField);
        showPasswordCheck = new JCheckBox("Show");
        showPasswordCheck.addActionListener(e -> {
            if (showPasswordCheck.isSelected()) {
                passwordField.setEchoChar((char) 0);
            } else {
                passwordField.setEchoChar('\u2022');
            }
        });
        inputPanel.add(showPasswordCheck);
        centerPanel.add(inputPanel);

        JPanel strengthPanel = new JPanel(new FlowLayout(FlowLayout.LEFT));
        strengthBar = new JProgressBar(0, 10);
        strengthBar.setPreferredSize(new Dimension(200, 25));
        strengthBar.setStringPainted(true);
        strengthPanel.add(new JLabel("Strength:"));
        strengthPanel.add(strengthBar);
        strengthLabel = new JLabel("Not checked");
        strengthPanel.add(strengthLabel);
        centerPanel.add(strengthPanel);

        rulesPanel = new JPanel();
        rulesPanel.setLayout(new BoxLayout(rulesPanel, BoxLayout.Y_AXIS));
        rulesPanel.setBorder(BorderFactory.createTitledBorder("Rules"));
        centerPanel.add(rulesPanel);

        JPanel genPanel = new JPanel(new FlowLayout(FlowLayout.LEFT));
        genPanel.setBorder(BorderFactory.createTitledBorder("Generator"));
        genPanel.add(new JLabel("Length:"));
        lengthField = new JTextField(5);
        lengthField.setText("16");
        genPanel.add(lengthField);
        includeNumbersCheck = new JCheckBox("Numbers");
        includeNumbersCheck.setSelected(true);
        genPanel.add(includeNumbersCheck);
        includeSymbolsCheck = new JCheckBox("Symbols");
        includeSymbolsCheck.setSelected(true);
        genPanel.add(includeSymbolsCheck);
        centerPanel.add(genPanel);

        frame.add(centerPanel, BorderLayout.CENTER);

        JPanel btnPanel = new JPanel(new FlowLayout());
        checkBtn = new JButton("Check");
        generateBtn = new JButton("Generate");
        saveBtn = new JButton("Save");
        btnPanel.add(checkBtn);
        btnPanel.add(generateBtn);
        btnPanel.add(saveBtn);
        frame.add(btnPanel, BorderLayout.SOUTH);

        checkBtn.addActionListener(e -> checkPassword());
        generateBtn.addActionListener(e -> generatePassword());
        saveBtn.addActionListener(e -> savePassword());

        frame.setSize(450, 450);
        frame.setVisible(true);
        frame.setLocationRelativeTo(null);
    }

    private void checkPassword() {
        try {
            String password = new String(passwordField.getPassword());
            if (password == null || password.isEmpty()) {
                throw new IllegalArgumentException("Password cannot be empty");
            }

            PasswordAnalyzer analyzer = new PasswordAnalyzer(password);
            int score = analyzer.getScore();
            String strength = analyzer.getStrengthLabel();

            strengthBar.setValue(score);
            strengthLabel.setText(strength);

            if (score <= 3) {
                strengthBar.setForeground(Color.RED);
            } else if (score <= 6) {
                strengthBar.setForeground(Color.ORANGE);
            } else {
                strengthBar.setForeground(Color.GREEN);
            }

            rulesPanel.removeAll();
            for (String rule : analyzer.getRules()) {
                rulesPanel.add(new JLabel(rule));
            }
            rulesPanel.revalidate();
            rulesPanel.repaint();

            passwordHistory.put(password, score);

            PasswordPolicy weak = new WeakPolicy();
            PasswordPolicy strong = new StrongPolicy();
            boolean weakValid = weak.validate(password);
            boolean strongValid = strong.validate(password);

            String msg = "Score: " + score + "/10 (" + strength + ")\n";
            msg += "HashSet types found: " + analyzer.getTypesFound() + "\n";
            msg += "History entries: " + passwordHistory.size() + "\n";
            msg += "WeakPolicy: " + (weakValid ? "Valid" : "Invalid") + "\n";
            msg += "StrongPolicy: " + (strongValid ? "Valid" : "Invalid");

            JOptionPane.showMessageDialog(frame, msg, "Analysis Result", JOptionPane.INFORMATION_MESSAGE);

        } catch (IllegalArgumentException e) {
            JOptionPane.showMessageDialog(frame, e.getMessage(), "Error", JOptionPane.ERROR_MESSAGE);
        } finally {
            strengthBar.repaint();
        }
    }

    private void generatePassword() {
        try {
            int length = Integer.parseInt(lengthField.getText().trim());
            if (length <= 0) throw new NumberFormatException();

            generator.includeNumbers(includeNumbersCheck.isSelected());
            generator.includeSymbols(includeSymbolsCheck.isSelected());

            String generated = generator.generate(length);
            passwordField.setText(generated);
            passwordField.setEchoChar((char) 0);
            showPasswordCheck.setSelected(true);

            PasswordAnalyzer analyzer = new PasswordAnalyzer(generated);
            int score = analyzer.getScore();
            String strength = analyzer.getStrengthLabel();

            strengthBar.setValue(score);
            strengthLabel.setText(strength);

            if (score <= 3) {
                strengthBar.setForeground(Color.RED);
            } else if (score <= 6) {
                strengthBar.setForeground(Color.ORANGE);
            } else {
                strengthBar.setForeground(Color.GREEN);
            }

            rulesPanel.removeAll();
            for (String rule : analyzer.getRules()) {
                rulesPanel.add(new JLabel(rule));
            }
            rulesPanel.revalidate();
            rulesPanel.repaint();

            JOptionPane.showMessageDialog(frame,
                "Generated: " + generated + "\nStrength: " + strength + " (" + score + "/10)",
                "Generated Password", JOptionPane.INFORMATION_MESSAGE);

        } catch (NumberFormatException e) {
            JOptionPane.showMessageDialog(frame, "Invalid length. Enter a positive number.", "Error", JOptionPane.ERROR_MESSAGE);
        }
    }

    private void savePassword() {
        try {
            String password = new String(passwordField.getPassword());
            if (password == null || password.isEmpty()) {
                throw new IllegalArgumentException("Nothing to save");
            }
            generator.saveToFile(password);
            JOptionPane.showMessageDialog(frame, "Password saved to saved_passwords.txt", "Saved", JOptionPane.INFORMATION_MESSAGE);
        } catch (IllegalArgumentException e) {
            JOptionPane.showMessageDialog(frame, e.getMessage(), "Error", JOptionPane.ERROR_MESSAGE);
        } catch (Exception e) {
            JOptionPane.showMessageDialog(frame, "Save failed: " + e.getMessage(), "Error", JOptionPane.ERROR_MESSAGE);
        }
    }

    public static void main(String[] args) {
        SwingUtilities.invokeLater(MainGUI::new);
    }
}
