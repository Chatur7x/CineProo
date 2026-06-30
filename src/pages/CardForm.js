var CardForm = {
  template: '#card-form-template',
  data: function () {
    return {
      cardNumber: '', cardName: '', cardExpiry: '', cardCvv: '',
      selectedBank: 'HDFC Bank', password: '', savedCardMode: false, savedCards: [],
      activePolicy: 'WeakPolicy',
      banks: ['HDFC Bank', 'ICICI Bank', 'SBI', 'Axis Bank', 'Kotak Mahindra', 'Canara Bank', 'Union Bank', 'Yes Bank'],
      fileIoLogs: [
        { type: 'system', text: '[System] JVM initialized.' },
        { type: 'system', text: '[Java File IO] FileReader cards.dat loaded (142 bytes).' }
      ]
    };
  },
  computed: {
    cardType: function () {
      var n = this.cardNumber.replace(/\D/g, '');
      if (/^4/.test(n)) return 'Visa';
      if (/^5[1-5]/.test(n)) return 'Mastercard';
      if (/^3[47]/.test(n)) return 'Amex';
      if (/^6(?:011|5)/.test(n)) return 'RuPay';
      return '';
    },
    formattedNumber: function () {
      return this.cardNumber.replace(/\D/g, '').substring(0, 16).replace(/(.{4})/g, '$1 ').trim();
    },
    isLuhnValid: function () {
      var num = this.cardNumber.replace(/\D/g, '');
      if (num.length < 13) return false;
      var sum = 0;
      var shouldDouble = false;
      for (var i = num.length - 1; i >= 0; i--) {
        var d = parseInt(num.charAt(i));
        if (shouldDouble) {
          d *= 2;
          if (d > 9) d -= 9;
        }
        sum += d;
        shouldDouble = !shouldDouble;
      }
      return sum % 10 === 0;
    },
    isPasswordPolicyPassed: function () {
      if (!this.password) return false;
      var policy;
      if (this.activePolicy === 'StrongPolicy') {
        policy = new StrongPolicy();
      } else {
        policy = new WeakPolicy();
      }
      return policy.validate(this.password);
    },
    pythonAuditAlert: function () {
      if (!this.password) return '';
      var lengthCheck = new LengthCheck();
      var complexityCheck = new ComplexityCheck();
      
      var lenResult = lengthCheck.runCheck(this.password);
      if (lenResult[0] > 0) {
        return "Failed Python LengthCheck! Abstract class rules require at least 8 characters.";
      }
      
      var compResult = complexityCheck.runCheck(this.password);
      if (compResult[0] > 0) {
        return "Failed Python ComplexityCheck! Issues: " + compResult[1].join(", ") + ".";
      }
      return '';
    },
    javaExceptions: function () {
      var list = [];
      
      // Card number exception check (Luhn validation)
      var cleanNum = this.cardNumber.replace(/\D/g, '');
      if (cleanNum.length >= 13 && !this.isLuhnValid) {
        list.push({
          name: "java.lang.IllegalArgumentException: Invalid checksum digit in card verification",
          stack: "security.CardValidator.validateLuhn(CardValidator.java:42)"
        });
      }
      
      // Password exception check (Policy check)
      if (this.password && !this.isPasswordPolicyPassed) {
        list.push({
          name: "security.PasswordPolicyViolationException: Password does not meet " + this.activePolicy + " requirements",
          stack: "security.PasswordChecker.validatePolicy(PasswordChecker.java:108)"
        });
      }
      
      // Expiry format check
      if (this.cardExpiry.length >= 5 && !/^\d{2}\/\d{2}$/.test(this.cardExpiry)) {
        list.push({
          name: "java.text.ParseException: Unparseable date format (Expected MM/YY)",
          stack: "java.text.SimpleDateFormat.parse(SimpleDateFormat.java:366)"
        });
      }

      return list;
    },
    strengthInfo: function () {
      var pw = new Password(this.password);
      pw.analyze();
      return { score: pw.getScore(), strength: pw.getStrength(), issues: pw.getIssues() };
    },
    strengthPct: function () { return (this.strengthInfo.score / 5) * 100; },
    strengthColor: function () {
      var s = this.strengthInfo.score;
      return s >= 4 ? '#30D158' : s >= 2 ? '#FF9F0A' : '#FF453A';
    },
    isFormValid: function () {
      return this.isLuhnValid &&
             this.cardName.trim().length > 2 &&
             /^\d{2}\/\d{2}$/.test(this.cardExpiry) &&
             /^\d{3,4}$/.test(this.cardCvv) &&
             this.isPasswordPolicyPassed;
    }
  },
  methods: {
    onCardNumberInput: function (e) {
      var val = e.target.value;
      var clean = val.replace(/\D/g, '').substring(0, 16);
      var parts = [];
      for (var i = 0; i < clean.length; i += 4) {
        parts.push(clean.substring(i, i + 4));
      }
      this.cardNumber = parts.join(' ');
    },
    onExpiryInput: function (e) {
      var val = e.target.value;
      var clean = val.replace(/\D/g, '').substring(0, 4);
      if (clean.length > 2) {
        this.cardExpiry = clean.substring(0, 2) + '/' + clean.substring(2);
      } else {
        this.cardExpiry = clean;
      }
    },
    goBack: function () {
      window.location.hash = '#/payment';
    },
    submitCard: function () {
      if (!this.isFormValid) return;
      var self = this;
      
      // Simulate Java BufferedWriter file writing logs
      self.fileIoLogs.push({ type: 'stream', text: '>>> BufferedWriter bw = new BufferedWriter(new FileWriter("cards.dat", true));' });
      self.fileIoLogs.push({ type: 'stream', text: '>>> Card c = new Card("' + self.cardNumber.slice(0, 4) + '...", "' + self.cardName + '");' });
      self.fileIoLogs.push({ type: 'stream', text: '>>> bw.write(c.serialize());' });
      self.fileIoLogs.push({ type: 'stream', text: '>>> bw.newLine(); bw.close();' });
      self.fileIoLogs.push({ type: 'system', text: '[Java File IO] Flush buffer: 84 bytes written to disk.' });

      // Delay transition to let the user see the log output
      setTimeout(function () {
        var num = self.cardNumber.replace(/\D/g, '');
        var card = new Card(num, self.cardName, self.cardExpiry, self.cardCvv, self.selectedBank);
        var mgr = new CardManager();
        mgr.addCard(card);
        window.__paymentBridge = window.__paymentBridge || {};
        window.__paymentBridge.selectedCard = card;
        var pwMgr = new PasswordManager();
        if (self.password) pwMgr.savePassword('CineBook', self.password);
        window.location.hash = '#/otp';
      }, 1200);
    },
    selectSavedCard: function (card) {
      window.__paymentBridge = window.__paymentBridge || {};
      window.__paymentBridge.selectedCard = card;
      window.location.hash = '#/otp';
    }
  },
  mounted: function () {
    window.__paymentBridge = window.__paymentBridge || {};
    var saved = window.__paymentBridge.savedCard;
    if (saved) {
      this.cardNumber = saved.getNumber ? saved.getNumber() : '';
      this.cardName = saved.getName ? saved.getName() : '';
      this.cardExpiry = saved.getExpiry ? saved.getExpiry() : '';
      this.cardCvv = saved.getCvv ? saved.getCvv() : '';
      this.selectedBank = saved.getBank ? saved.getBank() : 'HDFC Bank';
      this.savedCardMode = true;
    }
    var mgr = new CardManager();
    this.savedCards = mgr.getAllCards();
  }
};
