var PasswordManager = function () {
  this._passwords = {};
  this._loadFromStorage();
};

PasswordManager.prototype._loadFromStorage = function () {
  try {
    this._passwords = JSON.parse(localStorage.getItem("savedServicePasswords") || "{}");
  } catch (e) { this._passwords = {}; }
};

PasswordManager.prototype._saveToStorage = function () {
  localStorage.setItem("savedServicePasswords", JSON.stringify(this._passwords));
};

PasswordManager.prototype.savePassword = function (service, password) {
  this._passwords[service] = password;
  this._saveToStorage();
};

PasswordManager.prototype.getPassword = function (service) {
  return this._passwords[service] || null;
};

PasswordManager.prototype.getAllServices = function () {
  return Object.keys(this._passwords);
};

PasswordManager.prototype.removePassword = function (service) {
  delete this._passwords[service];
  this._saveToStorage();
};
