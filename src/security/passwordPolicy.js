var PasswordPolicy = function () {
  this.minLength = 0;
  this.requireNumbers = false;
  this.requireSpecialChars = false;
};
PasswordPolicy.prototype.validate = function (password) { throw new Error("Abstract method"); };

var StrongPolicy = function () {
  PasswordPolicy.call(this);
  this.minLength = 12;
  this.requireNumbers = true;
  this.requireSpecialChars = true;
};
StrongPolicy.prototype = Object.create(PasswordPolicy.prototype);
StrongPolicy.prototype.constructor = StrongPolicy;
StrongPolicy.prototype.validate = function (password) {
  if (!password || password.length < this.minLength) return false;
  if (this.requireNumbers && !/[0-9]/.test(password)) return false;
  if (this.requireSpecialChars && !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) return false;
  if (!/[A-Z]/.test(password)) return false;
  return true;
};

var WeakPolicy = function () {
  PasswordPolicy.call(this);
  this.minLength = 4;
  this.requireNumbers = false;
  this.requireSpecialChars = false;
};
WeakPolicy.prototype = Object.create(PasswordPolicy.prototype);
WeakPolicy.prototype.constructor = WeakPolicy;
WeakPolicy.prototype.validate = function (password) {
  if (!password || password.length < this.minLength) return false;
  return true;
};
