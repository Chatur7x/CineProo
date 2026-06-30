function PythonAudit() {
  var inputState = React.useState("");
  var input = inputState[0], setInput = inputState[1];
  var resultState = React.useState(null);
  var result = resultState[0], setResult = resultState[1];
  var errorState = React.useState("");
  var error = errorState[0], setError = errorState[1];
  var tabState = React.useState("table");
  var tab = tabState[0], setTab = tabState[1];

  // Shell Console Simulator State
  var consoleInputState = React.useState("");
  var consoleInput = consoleInputState[0], setConsoleInput = consoleInputState[1];
  var consoleHistoryState = React.useState([
    { type: 'output', text: 'Python 3.10.4 (tags/v3.10.4:9d38120, Mar 23 2022, 23:13:41) [MSC v.1929 64 bit (AMD64)] on win32' },
    { type: 'output', text: 'Type "help", "copyright", "credits" or "license" for more information.' },
    { type: 'output', text: '>>> import security_audit' },
    { type: 'output', text: '>>> # Type "audit" to analyze stored checkout passwords, or "generate" to create a new one' }
  ]);
  var consoleHistory = consoleHistoryState[0], setConsoleHistory = consoleHistoryState[1];

  // Load checkout passwords from localStorage automatically on load
  React.useEffect(function () {
    loadStoredPasswords();
  }, []);

  function loadStoredPasswords() {
    try {
      var pwMgr = new PasswordManager();
      var services = pwMgr.getAllServices();
      var passwords = [];
      services.forEach(function (s) {
        passwords.push(pwMgr.getPassword(s));
      });
      // Fallback sample data if empty
      if (passwords.length === 0) {
        passwords = ["Hello123", "weak", "P@ssw0rd!", "password123"];
      }
      setInput(passwords.join("\n"));
    } catch (e) {
      setInput("Hello123\nweak\nP@ssw0rd!");
    }
  }

  function runAudit() {
    setError("");
    try {
      var lines = input.split("\n").filter(function (l) { return l.trim(); });
      if (lines.length === 0) { setError("Enter at least one password."); return; }
      var auditor = new PasswordAuditor("input");
      auditor.loadPasswords(lines);
      var tuples = auditor.getResultsAsTuples();
      var report = generateAuditReport(auditor);
      setResult({ auditor: auditor, tuples: tuples, report: report });

      // Append shell log
      var newLogs = [
        { type: 'prompt', text: '>>> auditor = security_audit.PasswordAuditor()' },
        { type: 'prompt', text: '>>> auditor.load_passwords(data)' },
        { type: 'output', text: 'Loaded ' + lines.length + ' password records.' },
        { type: 'prompt', text: '>>> print(auditor.generate_report())' },
        { type: 'output', text: 'Audit complete. Weak/Medium/Strong stats evaluated.' }
      ];
      setConsoleHistory(function (prev) { return prev.concat(newLogs); });
    } catch (e) {
      setError(e.message);
    }
  }

  function downloadReport() {
    if (!result) return;
    var blob = new Blob([result.report], { type: "text/plain" });
    var a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "audit_report.txt";
    a.click();
  }

  function loadSampleData() {
    setInput("Hello123\nweak\nP@ssw0rd!\npassword123\nAdmin123\nabc\nStrongP@ss1\nqwerty\nweak\n12345");
  }

  function handleConsoleSubmit(e) {
    e.preventDefault();
    var cmd = consoleInput.trim();
    if (!cmd) return;

    var response = [];
    response.push({ type: 'prompt', text: '>>> ' + cmd });

    var cmdLower = cmd.toLowerCase();
    if (cmdLower === 'help') {
      response.push({ type: 'output', text: 'Available commands:\n  audit      - Run auditor on input passwords\n  generate   - Generate a strong Python password\n  list       - Print current input passwords\n  clear      - Clear the console history\n  stored     - Read passwords stored from card checkouts' });
    } else if (cmdLower === 'clear') {
      setConsoleHistory([]);
      setConsoleInput("");
      return;
    } else if (cmdLower === 'generate') {
      var pw = new PasswordGenerator().generate(14, true, true);
      response.push({ type: 'output', text: 'Generated Password: ' + pw + '\nEntropy rating: High (Python random module simulated)' });
    } else if (cmdLower === 'audit') {
      var lines = input.split("\n").filter(function (l) { return l.trim(); });
      if (lines.length === 0) {
        response.push({ type: 'output', text: 'ValueError: Empty password list.' });
      } else {
        var auditor = new PasswordAuditor("input");
        auditor.loadPasswords(lines);
        var report = generateAuditReport(auditor);
        setResult({ auditor: auditor, tuples: auditor.getResultsAsTuples(), report: report });
        response.push({ type: 'output', text: 'Auditing complete. ' + lines.length + ' accounts analyzed. Switch tabs above to view table.' });
      }
    } else if (cmdLower === 'list') {
      var lines = input.split("\n").filter(function (l) { return l.trim(); });
      response.push({ type: 'output', text: 'Current Passwords:\n' + lines.map(function(l) { return ' - ' + l; }).join('\n') });
    } else if (cmdLower === 'stored') {
      try {
        var pwMgr = new PasswordManager();
        var services = pwMgr.getAllServices();
        if (services.length === 0) {
          response.push({ type: 'output', text: 'No card checkouts passwords stored in LocalStorage.' });
        } else {
          var details = services.map(function(s) { return s + ': ' + pwMgr.getPassword(s); }).join('\n');
          response.push({ type: 'output', text: 'Stored passwords found:\n' + details });
        }
      } catch(err) {
        response.push({ type: 'output', text: 'Error reading storage: ' + err.message });
      }
    } else {
      response.push({ type: 'output', text: "NameError: name '" + cmd + "' is not defined. Type 'help' for commands." });
    }

    setConsoleHistory(function (prev) { return prev.concat(response); });
    setConsoleInput("");

    // Auto scroll console
    setTimeout(function () {
      var cb = document.getElementById("console-body-scroll");
      if (cb) cb.scrollTop = cb.scrollHeight;
    }, 50);
  }

  // Calculate stats for Matplotlib chart
  var stats = { weak: 0, med: 0, strong: 0 };
  if (result && result.tuples) {
    result.tuples.forEach(function (t) {
      var strength = t[3].toLowerCase();
      if (strength === 'weak') stats.weak++;
      else if (strength === 'medium') stats.med++;
      else stats.strong++;
    });
  }
  var totalCount = (stats.weak + stats.med + stats.strong) || 1;
  var weakPct = (stats.weak / totalCount) * 100;
  var medPct = (stats.med / totalCount) * 100;
  var strongPct = (stats.strong / totalCount) * 100;

  function exportMatplotlibPlot() {
    if (!result) return;
    
    // Create a temporary canvas
    var canvas = document.createElement("canvas");
    canvas.width = 600;
    canvas.height = 350;
    var ctx = canvas.getContext("2d");
    
    // Background
    ctx.fillStyle = "#0f0f1a";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Title
    ctx.fillStyle = "#5aa9e6";
    ctx.font = "bold 18px monospace";
    ctx.fillText("matplotlib.pyplot: password_entropy_distribution", 25, 40);
    
    // Subtitle
    ctx.fillStyle = "#888899";
    ctx.font = "12px monospace";
    ctx.fillText("Python Security Audit Analytics - Matplotlib Export", 25, 60);
    
    // Grid Lines
    ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
    ctx.lineWidth = 1;
    for (var x = 150; x <= 500; x += 70) {
      ctx.beginPath();
      ctx.moveTo(x, 90);
      ctx.lineTo(x, 280);
      ctx.stroke();
    }
    
    // Draw horizontal bars
    var labels = ["Weak", "Medium", "Strong"];
    var counts = [stats.weak, stats.med, stats.strong];
    var percentages = [weakPct, medPct, strongPct];
    var colors = ["#FF453A", "#FF9F0A", "#30D158"];
    
    for (var i = 0; i < 3; i++) {
      var y = 110 + (i * 60);
      
      // Label
      ctx.fillStyle = colors[i];
      ctx.font = "bold 14px monospace";
      ctx.fillText(labels[i], 30, y + 15);
      
      // Value text
      ctx.fillStyle = "#ffffff";
      ctx.font = "14px monospace";
      ctx.fillText(counts[i] + " (" + Math.round(percentages[i]) + "%)", 520, y + 15);
      
      // Bar background track
      ctx.fillStyle = "#1e1e2f";
      ctx.fillRect(150, y, 350, 20);
      
      // Bar fill
      ctx.fillStyle = colors[i];
      var fillWidth = (percentages[i] / 100) * 350;
      ctx.fillRect(150, y, fillWidth, 20);
    }
    
    // Footer / Axis label
    ctx.fillStyle = "#888899";
    ctx.font = "11px monospace";
    ctx.fillText("X-axis: Relative Password Strength Weight Distribution (%)", 150, 310);
    
    // Download
    var a = document.createElement("a");
    a.href = canvas.toDataURL("image/png");
    a.download = "matplotlib_strength_distribution.png";
    a.click();
  }

  return React.createElement("div", { className: "python-audit-page" },
    React.createElement("h2", null, "Python Password Audit Center"),
    React.createElement("p", { className: "audit-subtitle" }, "Python OOP architecture re-implemented in Javascript \u2014 private attributes, abstraction, and list/tuple results"),

    React.createElement("div", { className: "audit-input-section" },
      React.createElement("h3", null, "Audit Database Inputs"),
      React.createElement("p", { style: { fontSize: "0.8rem", color: "var(--text-muted)", margin: "0 0 10px 0" } },
        "Note: Stored card details/checkout passwords from localStorage are automatically fetched below."
      ),
      React.createElement("textarea", { className: "audit-textarea", rows: 6, value: input, onChange: function (e) { setInput(e.target.value); }, placeholder: "password1\npassword2\n..." }),
      React.createElement("div", { className: "audit-buttons" },
        React.createElement("button", { className: "btn-audit", onClick: runAudit }, "Run Python Audit"),
        React.createElement("button", { className: "btn-sample", onClick: loadSampleData }, "Reset to Sample Data"),
        React.createElement("button", { className: "btn-sample", onClick: loadStoredPasswords }, "Reload Storage")
      )
    ),

    error && React.createElement("p", { className: "audit-error" }, error),

    result && React.createElement("div", { className: "audit-results" },
      /* Visual Matplotlib Analytics Chart simulation */
      React.createElement("div", { className: "matplotlib-chart" },
        React.createElement("div", { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', marginBottom: '16px' } },
          React.createElement("h4", { style: { margin: 0 } }, "📊 matplotlib.pyplot — Password Distribution Graph"),
          React.createElement("button", { 
            className: "btn-download", 
            style: { padding: '5px 12px', fontSize: '0.75rem', background: '#1e293b', border: '1px solid var(--border)', borderRadius: '6px', color: '#fff', cursor: 'pointer' },
            onClick: exportMatplotlibPlot 
          }, "📷 Save Plot (PNG)")
        ),
        React.createElement("div", { className: "chart-distribution" },
          React.createElement("div", { className: "chart-row-stat" },
            React.createElement("span", { className: "chart-label", style: { color: '#FF453A' } }, "🔴 Weak"),
            React.createElement("div", { className: "chart-track" },
              React.createElement("div", { className: "chart-fill-bar", style: { width: weakPct + '%', backgroundColor: '#FF453A' } })
            ),
            React.createElement("span", { className: "chart-value" }, stats.weak)
          ),
          React.createElement("div", { className: "chart-row-stat" },
            React.createElement("span", { className: "chart-label", style: { color: '#FF9F0A' } }, "🟡 Medium"),
            React.createElement("div", { className: "chart-track" },
              React.createElement("div", { className: "chart-fill-bar", style: { width: medPct + '%', backgroundColor: '#FF9F0A' } })
            ),
            React.createElement("span", { className: "chart-value" }, stats.med)
          ),
          React.createElement("div", { className: "chart-row-stat" },
            React.createElement("span", { className: "chart-label", style: { color: '#30D158' } }, "🟢 Strong"),
            React.createElement("div", { className: "chart-track" },
              React.createElement("div", { className: "chart-fill-bar", style: { width: strongPct + '%', backgroundColor: '#30D158' } })
            ),
            React.createElement("span", { className: "chart-value" }, stats.strong)
          )
        )
      ),

      React.createElement("div", { className: "audit-results-content" },
        React.createElement("div", { className: "audit-tabs" },
          React.createElement("button", { className: tab === "table" ? "tab-active" : "", onClick: function () { setTab("table"); } }, "Table View"),
          React.createElement("button", { className: tab === "report" ? "tab-active" : "", onClick: function () { setTab("report"); } }, "Report View"),
          React.createElement("button", { className: "btn-download", onClick: downloadReport }, "\u2B07 Download Report")
        ),
        tab === "table" && React.createElement("div", { className: "audit-table-wrapper" },
          React.createElement("table", { className: "audit-table" },
            React.createElement("thead", null, React.createElement("tr", null,
              React.createElement("th", null, "Password"),
              React.createElement("th", null, "Score"),
              React.createElement("th", null, "Strength"),
              React.createElement("th", null, "Issues"),
              React.createElement("th", null, "Duplicate")
            )),
            React.createElement("tbody", null, result.tuples.map(function (t, i) {
              return React.createElement("tr", { key: i, className: t[3].toLowerCase() + "-row" },
                React.createElement("td", null, t[0]),
                React.createElement("td", null, t[1] + "/5"),
                React.createElement("td", null, t[3]),
                React.createElement("td", null, t[2].length > 0 ? t[2].join(", ") : "(none)"),
                React.createElement("td", null, t[4] ? "Yes (Repeated)" : "No")
              );
            }))
          )
        ),
        tab === "report" && React.createElement("pre", { className: "audit-report-text" }, result.report)
      )
    ),

    /* Python Shell Terminal Emulator */
    React.createElement("div", { className: "python-console-wrapper" },
      React.createElement("div", { className: "console-header" },
        React.createElement("div", { className: "console-title" }, "python_interactive_shell.py"),
        React.createElement("div", { className: "console-dots" },
          React.createElement("span", { className: "console-dot red" }),
          React.createElement("span", { className: "console-dot yellow" }),
          React.createElement("span", { className: "console-dot green" })
        )
      ),
      React.createElement("div", { className: "console-body", id: "console-body-scroll" },
        consoleHistory.map(function (line, idx) {
          return React.createElement("div", { key: idx, className: "console-line " + line.type },
            React.createElement("pre", { style: { margin: 0, whiteSpace: 'pre-wrap', fontFamily: 'inherit' } }, line.text)
          );
        }),
        React.createElement("form", { onSubmit: handleConsoleSubmit, className: "console-input-row" },
          React.createElement("span", { className: "console-prompt-symbol" }, ">>>"),
          React.createElement("input", {
            type: "text", className: "console-input", value: consoleInput,
            onChange: function (e) { setConsoleInput(e.target.value); },
            placeholder: "help, audit, generate, clear, stored..."
          })
        )
      )
    ),

    React.createElement("div", { className: "audit-syllabus" },
      React.createElement("h3", null, "Python Syllabus Demonstrated"),
      React.createElement("ul", null,
        React.createElement("li", null, "Abstraction: PasswordCheck (abstract base)"),
        React.createElement("li", null, "Inheritance: LengthCheck, ComplexityCheck, PatternCheck extend PasswordCheck"),
        React.createElement("li", null, "Polymorphism: Same runCheck() \u2192 different behavior"),
        React.createElement("li", null, "Encapsulation: Private __score, __issues with property getters"),
        React.createElement("li", null, "Data Structures: List, Set (duplicates), Dict (results), Tuple, FrozenSet (blacklist)"),
        React.createElement("li", null, "Exception Handling: try/catch for validation errors"),
        React.createElement("li", null, "File I/O: Generate audit_report.txt (download)")
      )
    )
  );
}
