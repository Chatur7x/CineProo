public class StrongPolicy extends PasswordPolicy {
    public StrongPolicy() {
        this.minLength = 12;
        this.requireNumbers = true;
        this.requireSpecialChars = true;
    }

    @Override
    public boolean validate(String password) {
        if (password == null || password.length() < minLength) return false;
        if (requireNumbers && !password.matches(".*[0-9].*")) return false;
        if (requireSpecialChars && !password.matches(".*[!@#$%^&*()_+\\-=\\[\\]{};':\"\\\\|,.<>\\/?].*")) return false;
        if (!password.matches(".*[A-Z].*")) return false;
        return true;
    }
}
