var PasswordGenerator = function () {
  this.LETTERS = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  this.NUMBERS = "0123456789";
  this.SYMBOLS = "!@#$%^&*()_+-=[]{}|;:,.<>?";
  this._includeNumbers = true;
  this._includeSymbols = true;
};

PasswordGenerator.prototype.includeNumbers = function (val) { this._includeNumbers = val; };
PasswordGenerator.prototype.includeSymbols = function (val) { this._includeSymbols = val; };

PasswordGenerator.prototype.generate = function (length) {
  var pool = this.LETTERS;
  if (this._includeNumbers) pool += this.NUMBERS;
  if (this._includeSymbols) pool += this.SYMBOLS;
  var password = "";
  for (var i = 0; i < length; i++) {
    password += pool.charAt(Math.floor(Math.random() * pool.length));
  }
  return password;
};
