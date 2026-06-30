function PasswordStrengthMeter(props) {
  var password = props.password || "";
  var pw = new Password(password);
  pw.analyze();
  var score = pw.getScore();
  var strength = pw.getStrength();
  var issues = pw.getIssues();
  var pct = (score / 5) * 100;
  var color = score >= 4 ? "#30D158" : score >= 2 ? "#FF9F0A" : "#FF453A";
  return React.createElement("div", { className: "strength-meter" },
    React.createElement("div", { className: "strength-bar-bg" },
      React.createElement("div", { className: "strength-bar-fill", style: { width: pct + "%", backgroundColor: color } })
    ),
    React.createElement("span", { className: "strength-label", style: { color: color } }, strength + " (" + score + "/5)"),
    issues.length > 0 && React.createElement("ul", { className: "strength-issues" },
      issues.map(function (issue, i) { return React.createElement("li", { key: i }, issue); })
    )
  );
}
