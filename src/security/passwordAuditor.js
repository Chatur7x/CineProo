var PasswordAuditor = function (filepath) {
  this._filepath = filepath;
  this._passwords = [];
  this._passwordObjects = [];
  this._resultsDict = {};
  this._duplicateSet = new Set();
};

PasswordAuditor.prototype.loadPasswords = function (lines) {
  if (!lines || lines.length === 0) throw new Error("ERROR: No passwords provided.");
  this._passwords = lines.map(function (l) { return l.trim(); }).filter(function (l) { return l !== ""; });
  if (this._passwords.length === 0) throw new Error("ERROR: No valid passwords found.");
  var seen = new Set();
  for (var i = 0; i < this._passwords.length; i++) {
    var pwd = this._passwords[i];
    if (seen.has(pwd)) this._duplicateSet.add(pwd);
    seen.add(pwd);
  }
  for (var j = 0; j < this._passwords.length; j++) {
    var pw = this._passwords[j];
    var pwObj = new Password(pw);
    pwObj.analyze();
    pwObj.setDuplicate(this._duplicateSet.has(pw));
    this._passwordObjects.push(pwObj);
    this._resultsDict[pw] = pwObj;
  }
  return this;
};

PasswordAuditor.prototype.getPasswordCount = function () { return this._passwords.length; };
PasswordAuditor.prototype.getUniqueCount = function () { return new Set(this._passwords).size; };
PasswordAuditor.prototype.getDuplicateCount = function () { return this.getPasswordCount() - this.getUniqueCount(); };
PasswordAuditor.prototype.getDuplicatePasswords = function () { return Array.from(this._duplicateSet).sort(); };
PasswordAuditor.prototype.getPasswordObjects = function () { return this._passwordObjects.slice(); };

PasswordAuditor.prototype.getResultsAsTuples = function () {
  var results = [];
  for (var pwd in this._resultsDict) {
    if (this._resultsDict.hasOwnProperty(pwd)) {
      var pw = this._resultsDict[pwd];
      results.push([pwd, pw.getScore(), pw.getIssues(), pw.getStrength(), pw.isDuplicate()]);
    }
  }
  return results;
};

PasswordAuditor.prototype.getResult = function (password) { return this._resultsDict[password] || null; };

PasswordAuditor.prototype.getPasswordsByStrength = function (category) {
  return this._passwordObjects.filter(function (pw) { return pw.getStrength() === category; });
};

function generateAuditReport(auditor) {
  var a = auditor;
  var lines = [];
  lines.push("=".repeat(60));
  lines.push("                    PASSWORD AUDIT REPORT");
  lines.push("=".repeat(60));
  lines.push("  Total passwords loaded:    " + a.getPasswordCount());
  lines.push("  Unique passwords:          " + a.getUniqueCount());
  lines.push("  Duplicate passwords:       " + a.getDuplicateCount());
  lines.push("=".repeat(60));
  if (a.getDuplicatePasswords().length > 0) {
    lines.push("\n  --- DUPLICATE PASSWORDS ---");
    a.getDuplicatePasswords().forEach(function (p) { lines.push("    * " + p); });
  }
  var results = a.getResultsAsTuples();
  lines.push("\n" + "-".repeat(60));
  lines.push("  PASSWORD AUDIT DETAILS");
  lines.push("-".repeat(60));
  results.forEach(function (t) {
    var dupTag = t[4] ? " [DUPLICATE]" : "";
    lines.push("\n  Password: " + t[0] + dupTag);
    lines.push("  Score:    " + t[1] + "/5 (" + t[3] + ")");
    if (t[2].length > 0) {
      t[2].forEach(function (issue) { lines.push("    - " + issue); });
    } else {
      lines.push("    (no issues)");
    }
  });
  var weakList = results.filter(function (t) { return t[3] === "Weak"; });
  var mediumList = results.filter(function (t) { return t[3] === "Medium"; });
  var strongList = results.filter(function (t) { return t[3] === "Strong"; });
  lines.push("\n" + "-".repeat(60));
  lines.push("  SUMMARY BY STRENGTH");
  lines.push("-".repeat(60));
  lines.push("  Weak passwords:   " + weakList.length);
  weakList.forEach(function (t) { lines.push("    - " + t[0] + " (Score: " + t[1] + "/5)"); });
  lines.push("  Medium passwords: " + mediumList.length);
  mediumList.forEach(function (t) { lines.push("    - " + t[0] + " (Score: " + t[1] + "/5)"); });
  lines.push("  Strong passwords: " + strongList.length);
  strongList.forEach(function (t) { lines.push("    - " + t[0] + " (Score: " + t[1] + "/5)"); });
  lines.push("\n" + "=".repeat(60));
  lines.push("                    END OF REPORT");
  lines.push("=".repeat(60));
  return lines.join("\n");
}
