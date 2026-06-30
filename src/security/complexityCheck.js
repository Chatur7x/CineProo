var ComplexityCheck = function () {};
ComplexityCheck.prototype = Object.create(PasswordCheck.prototype);
ComplexityCheck.prototype.constructor = ComplexityCheck;
ComplexityCheck.prototype.SPECIAL_CHARS = "!@#$%^&*()-_=+[]{}|;:,.<>?/~`";
ComplexityCheck.prototype.runCheck = function (password) {
  var issues = [], deduction = 0, sc = this.SPECIAL_CHARS;
  var hasUpper = false, hasLower = false, hasDigit = false, hasSpecial = false;
  for (var i = 0; i < password.length; i++) {
    var c = password[i];
    if (c >= 'A' && c <= 'Z') hasUpper = true;
    else if (c >= 'a' && c <= 'z') hasLower = true;
    else if (c >= '0' && c <= '9') hasDigit = true;
    else if (sc.indexOf(c) !== -1) hasSpecial = true;
  }
  if (!hasUpper) { issues.push("missing uppercase letter"); deduction += 1; }
  if (!hasLower) { issues.push("missing lowercase letter"); deduction += 1; }
  if (!hasDigit) { issues.push("missing digit"); deduction += 1; }
  if (!hasSpecial) { issues.push("missing special character"); deduction += 1; }
  return [deduction, issues];
};
