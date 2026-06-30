var PatternCheck = function () {};
PatternCheck.prototype = Object.create(PasswordCheck.prototype);
PatternCheck.prototype.constructor = PatternCheck;
PatternCheck.prototype.WEAK_PATTERNS = new Set([
  "password", "password123", "123456", "12345678",
  "qwerty", "abc123", "monkey", "letmein", "admin",
  "welcome", "football", "iloveyou", "sunshine",
  "princess", "passw0rd", "111111", "000000", "666666",
  "dragon", "master", "shadow", "trustno1"
]);
PatternCheck.prototype.runCheck = function (password) {
  var issues = [], deduction = 0;
  if (this.WEAK_PATTERNS.has(password.toLowerCase())) {
    issues.push("matches a known weak password");
    deduction = 4;
  } else if (/^\d+$/.test(password)) {
    issues.push("contains only digits");
    deduction = Math.max(deduction, 3);
  } else if (password.length < 4) {
    issues.push("too short (less than 4 characters)");
    deduction = Math.max(deduction, 2);
  }
  return [deduction, issues];
};
