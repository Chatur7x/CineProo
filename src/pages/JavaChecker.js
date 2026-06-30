var JavaChecker = {
  template: '#java-checker-template',
  data: function () {
    return {
      activeTab: 'checker',
      password: '',
      genLength: 16,
      genNumbers: true,
      genSymbols: true,
      generatedPassword: '',
      policyPassword: '',
      policyResult: null
    };
  },
  computed: {
    analyzerResult: function () {
      if (!this.password) return null;
      var a = new PasswordAnalyzer(this.password);
      return {
        score: a.getScore(),
        strength: a.getStrengthLabel(),
        rules: a.getRules(),
        types: Array.from(a.getTypesFound())
      };
    },
    scorePercent: function () {
      return this.analyzerResult ? (this.analyzerResult.score / 10) * 100 : 0;
    },
    scoreColor: function () {
      if (!this.analyzerResult) return '#ccc';
      var s = this.analyzerResult.score;
      return s <= 3 ? '#FF453A' : s <= 6 ? '#FF9F0A' : '#30D158';
    }
  },
  methods: {
    generatePwd: function () {
      var gen = new PasswordGenerator();
      gen.includeNumbers(this.genNumbers);
      gen.includeSymbols(this.genSymbols);
      this.generatedPassword = gen.generate(this.genLength);
    },
    copyPassword: function () {
      var self = this;
      if (navigator.clipboard) {
        navigator.clipboard.writeText(this.generatedPassword);
      }
    },
    checkPolicy: function () {
      var pwd = this.policyPassword;
      if (!pwd) { this.policyResult = null; return; }
      var weak = new WeakPolicy();
      var strong = new StrongPolicy();
      this.policyResult = {
        weakValid: weak.validate(pwd),
        strongValid: strong.validate(pwd),
        weakMsg: weak.validate(pwd) ? '✓ Valid (min ' + weak.minLength + ' chars)' : '✗ Invalid (need ' + weak.minLength + '+ chars)',
        strongMsg: strong.validate(pwd) ? '✓ Valid (min ' + strong.minLength + ' chars, number, special, uppercase)' : '✗ Invalid (need ' + strong.minLength + '+ chars, number, special, uppercase)'
      };
    },
    useGenerated: function () {
      this.password = this.generatedPassword;
      this.activeTab = 'checker';
    }
  }
};
