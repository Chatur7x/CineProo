import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;

public class PasswordAnalyzer {
    private String _password;
    private int _score;
    private ArrayList<String> _rules;
    private HashMap<String, Integer> _history;
    private HashSet<String> _typesFound;

    public PasswordAnalyzer(String password) {
        this._password = password;
        this._rules = new ArrayList<>();
        this._history = new HashMap<>();
        this._typesFound = new HashSet<>();
        analyze();
    }

    private void analyze() {
        _rules.clear();
        _score = 0;

        if (_password == null || _password.isEmpty()) {
            _rules.add("Password is empty");
            return;
        }

        _typesFound.clear();
        for (char c : _password.toCharArray()) {
            if (Character.isUpperCase(c)) _typesFound.add("UPPER");
            else if (Character.isLowerCase(c)) _typesFound.add("LOWER");
            else if (Character.isDigit(c)) _typesFound.add("DIGIT");
            else _typesFound.add("SPECIAL");
        }

        if (_password.length() >= 8) { _rules.add("Min 8 characters"); _score++; }
        else { _rules.add("Min 8 characters"); }

        if (_password.length() >= 12) { _rules.add("Min 12 characters"); _score++; }
        else { _rules.add("Min 12 characters"); }

        if (_password.length() >= 16) { _rules.add("Min 16 characters"); _score++; }
        else { _rules.add("Min 16 characters"); }

        if (_password.matches(".*[a-z].*")) { _rules.add("Has lowercase letter"); _score++; }
        else { _rules.add("Has lowercase letter"); }

        if (_password.matches(".*[A-Z].*")) { _rules.add("Has uppercase letter"); _score++; }
        else { _rules.add("Has uppercase letter"); }

        if (_password.matches(".*[0-9].*")) { _rules.add("Has number"); _score++; }
        else { _rules.add("Has number"); }

        if (_password.matches(".*[!@#$%^&*()_+\\-=\\[\\]{};':\"\\\\|,.<>\\/?].*")) {
            _rules.add("Has special character"); _score++;
        } else {
            _rules.add("Has special character");
        }

        if (_typesFound.size() >= 3) { _rules.add("3+ character types"); _score++; }
        else { _rules.add("3+ character types"); }

        if (_typesFound.size() >= 4) { _rules.add("All 4 character types"); _score++; }
        else { _rules.add("All 4 character types"); }

        boolean noRepeat = true;
        for (int i = 1; i < _password.length(); i++) {
            if (_password.charAt(i) == _password.charAt(i - 1)) {
                noRepeat = false;
                break;
            }
        }
        if (noRepeat) { _rules.add("No repeated consecutive chars"); _score++; }
        else { _rules.add("No repeated consecutive chars"); }

        _history.put(_password, _score);
    }

    public int getScore() { return _score; }

    public ArrayList<String> getRules() { return _rules; }

    public HashMap<String, Integer> getHistory() { return _history; }

    public HashSet<String> getTypesFound() { return _typesFound; }

    public String getStrengthLabel() {
        if (_score <= 3) return "Weak";
        if (_score <= 6) return "Medium";
        return "Strong";
    }
}
