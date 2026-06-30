var PasswordAnalyzer = function (password) {
  this._password = password;
  this._score = 0;
  this._rules = [];
  this._history = {};
  this._typesFound = new Set();
  this._analyze();
};

PasswordAnalyzer.prototype._analyze = function () {
  this._rules = [];
  this._score = 0;
  if (!this._password || this._password.length === 0) {
    this._rules.push("Password is empty");
    return;
  }
  this._typesFound = new Set();
  for (var i = 0; i < this._password.length; i++) {
    var c = this._password[i];
    if (c >= 'A' && c <= 'Z') this._typesFound.add("UPPER");
    else if (c >= 'a' && c <= 'z') this._typesFound.add("LOWER");
    else if (c >= '0' && c <= '9') this._typesFound.add("DIGIT");
    else this._typesFound.add("SPECIAL");
  }
  if (this._password.length >= 8) { this._rules.push("Min 8 characters"); this._score++; } else { this._rules.push("Min 8 characters"); }
  if (this._password.length >= 12) { this._rules.push("Min 12 characters"); this._score++; } else { this._rules.push("Min 12 characters"); }
  if (this._password.length >= 16) { this._rules.push("Min 16 characters"); this._score++; } else { this._rules.push("Min 16 characters"); }
  if (/[a-z]/.test(this._password)) { this._rules.push("Has lowercase letter"); this._score++; } else { this._rules.push("Has lowercase letter"); }
  if (/[A-Z]/.test(this._password)) { this._rules.push("Has uppercase letter"); this._score++; } else { this._rules.push("Has uppercase letter"); }
  if (/[0-9]/.test(this._password)) { this._rules.push("Has number"); this._score++; } else { this._rules.push("Has number"); }
  if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(this._password)) { this._rules.push("Has special character"); this._score++; } else { this._rules.push("Has special character"); }
  if (this._typesFound.size >= 3) { this._rules.push("3+ character types"); this._score++; } else { this._rules.push("3+ character types"); }
  if (this._typesFound.size >= 4) { this._rules.push("All 4 character types"); this._score++; } else { this._rules.push("All 4 character types"); }
  var noRepeat = true;
  for (var j = 1; j < this._password.length; j++) {
    if (this._password[j] === this._password[j - 1]) { noRepeat = false; break; }
  }
  if (noRepeat) { this._rules.push("No repeated consecutive chars"); this._score++; } else { this._rules.push("No repeated consecutive chars"); }
  this._history[this._password] = this._score;
};

PasswordAnalyzer.prototype.getScore = function () { return this._score; };
PasswordAnalyzer.prototype.getRules = function () { return this._rules; };
PasswordAnalyzer.prototype.getHistory = function () { return this._history; };
PasswordAnalyzer.prototype.getTypesFound = function () { return this._typesFound; };
PasswordAnalyzer.prototype.getStrengthLabel = function () {
  if (this._score <= 3) return "Weak";
  if (this._score <= 6) return "Medium";
  return "Strong";
};
