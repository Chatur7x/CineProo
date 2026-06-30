var LengthCheck = function () {};
LengthCheck.prototype = Object.create(PasswordCheck.prototype);
LengthCheck.prototype.constructor = LengthCheck;
LengthCheck.prototype.MIN_LENGTH = 8;
LengthCheck.prototype.runCheck = function (password) {
  if (password.length < this.MIN_LENGTH) {
    return [1, ["too short (" + password.length + " chars, need " + this.MIN_LENGTH + ")"]];
  }
  return [0, []];
};
