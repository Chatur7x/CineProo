var PasswordCheck = function () {};
PasswordCheck.prototype.runCheck = function (password) { throw new Error("Abstract method runCheck() must be overridden"); };

var Password = function (passwordStr) {
  var __password = passwordStr;
  var __score = 5;
  var __issues = [];
  var __isDuplicate = false;
  var MAX_SCORE = 5;

  this.analyze = function () {
    __score = MAX_SCORE;
    __issues = [];
    var checks = [new LengthCheck(), new ComplexityCheck(), new PatternCheck()];
    for (var i = 0; i < checks.length; i++) {
      var result = checks[i].runCheck(__password);
      var deduction = result[0], checkIssues = result[1];
      __score -= deduction;
      __issues = __issues.concat(checkIssues);
    }
    __score = Math.max(0, __score);
    return this;
  };

  this.getPassword = function () { return __password; };
  this.getScore = function () { return __score; };
  this.getIssues = function () { return __issues.slice(); };
  this.isDuplicate = function () { return __isDuplicate; };
  this.setDuplicate = function (val) { __isDuplicate = !!val; };
  this.getStrength = function () {
    if (__score >= 4) return "Strong";
    if (__score >= 2) return "Medium";
    return "Weak";
  };
  this.toString = function () {
    var dup = __isDuplicate ? " [DUPLICATE]" : "";
    return __password + " | Score: " + __score + "/5 (" + this.getStrength() + ")" + dup;
  };
};
