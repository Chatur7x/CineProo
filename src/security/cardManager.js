var Card = function (number, name, expiry, cvv, bank) {
  var __number = number;
  var __name = name;
  var __expiry = expiry;
  var __cvv = cvv;
  var __bank = bank;
  this.getNumber = function () { return __number; };
  this.getName = function () { return __name; };
  this.getExpiry = function () { return __expiry; };
  this.getCvv = function () { return __cvv; };
  this.getBank = function () { return __bank; };
  this.getLast4 = function () { return __number.slice(-4); };
  this.getCardType = function () {
    if (/^4/.test(__number)) return "Visa";
    if (/^5[1-5]/.test(__number)) return "Mastercard";
    if (/^3[47]/.test(__number)) return "Amex";
    if (/^6(?:011|5)/.test(__number)) return "RuPay";
    return "Unknown";
  };
  this.getMasked = function () { return this.getBank() + " " + this.getCardType() + " ****" + this.getLast4(); };
};

var CardManager = function () {
  this._cards = {};
  this._loadFromStorage();
};

CardManager.prototype._loadFromStorage = function () {
  try {
    var data = JSON.parse(localStorage.getItem("savedCards") || "[]");
    for (var i = 0; i < data.length; i++) {
      var c = data[i];
      var card = new Card(c.number, c.name, c.expiry, c.cvv, c.bank);
      this._cards[card.getLast4()] = card;
    }
  } catch (e) { this._cards = {}; }
};

CardManager.prototype._saveToStorage = function () {
  var arr = [];
  for (var key in this._cards) {
    if (this._cards.hasOwnProperty(key)) {
      var c = this._cards[key];
      arr.push({ number: c.getNumber(), name: c.getName(), expiry: c.getExpiry(), cvv: c.getCvv(), bank: c.getBank() });
    }
  }
  localStorage.setItem("savedCards", JSON.stringify(arr));
};

CardManager.prototype.addCard = function (card) {
  this._cards[card.getLast4()] = card;
  this._saveToStorage();
};

CardManager.prototype.getCard = function (last4) { return this._cards[last4] || null; };

CardManager.prototype.getAllCards = function () {
  var result = [];
  for (var key in this._cards) {
    if (this._cards.hasOwnProperty(key)) result.push(this._cards[key]);
  }
  return result;
};

CardManager.prototype.removeCard = function (last4) {
  delete this._cards[last4];
  this._saveToStorage();
};
