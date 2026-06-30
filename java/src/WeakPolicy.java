public class WeakPolicy extends PasswordPolicy {
    public WeakPolicy() {
        this.minLength = 6;
        this.requireNumbers = false;
        this.requireSpecialChars = false;
    }

    @Override
    public boolean validate(String password) {
        if (password == null) return false;
        return password.length() >= minLength;
    }
}
