public abstract class PasswordPolicy {
    protected int minLength;
    protected boolean requireNumbers;
    protected boolean requireSpecialChars;

    public abstract boolean validate(String password);

    public int getMinLength() { return minLength; }
    public boolean isRequireNumbers() { return requireNumbers; }
    public boolean isRequireSpecialChars() { return requireSpecialChars; }
}
