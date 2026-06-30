function BookingPage() {
  var ctx = useBooking();
  var timerState = React.useState(300);
  var timeLeft = timerState[0], setTimeLeft = timerState[1];
  var threadLogState = React.useState("[Thread-0] seat_map_mutex.lock() - acquired lock");
  var threadLog = threadLogState[0], setThreadLog = threadLogState[1];

  React.useEffect(function () {
    if (!ctx.selectedMovie || !ctx.selectedShowtime) return;
    var timer = setInterval(function () {
      setTimeLeft(function (prev) {
        if (prev <= 1) {
          clearInterval(timer);
          alert("Session expired. Mutex lock released.");
          ctx.setSelectedSeats([]);
          window.location.hash = "#/";
          return 0;
        }
        if (prev % 15 === 0) {
          var logs = [
            "[Thread-0] checking database connection pool...",
            "[Thread-0] local cache validation...",
            "[Thread-0] Mutex lock status: HELD",
            "[Thread-0] Thread.sleep(1000) - waiting for input...",
            "[Thread-1] queued - waiting for mutex release..."
          ];
          setThreadLog(logs[Math.floor(Math.random() * logs.length)]);
        }
        return prev - 1;
      });
    }, 1000);
    return function () { clearInterval(timer); };
  }, [ctx.selectedMovie, ctx.selectedShowtime]);

  if (!ctx.selectedMovie || !ctx.selectedShowtime) {
    return React.createElement("div", { className: "not-found" },
      React.createElement("h2", null, "No movie or showtime selected"),
      React.createElement("button", { className: "btn-primary", onClick: function () { window.location.hash = "#/"; } }, "Browse Movies")
    );
  }

  function formatTime(s) {
    var min = Math.floor(s / 60);
    var sec = s % 60;
    return min + ":" + (sec < 10 ? "0" + sec : sec);
  }

  var screenName = ctx.selectedScreen ? ctx.selectedScreen.name : "";
  var screenColor = ctx.selectedScreen ? ctx.selectedScreen.color : "var(--primary)";

  return React.createElement("div", { className: "booking-page" },
    React.createElement("button", {
      className: "btn-cancel",
      style: { 
        border: "none", 
        background: "transparent", 
        color: "var(--text-secondary)", 
        fontSize: "0.9rem", 
        cursor: "pointer", 
        display: "inline-flex", 
        alignItems: "center", 
        gap: "6px", 
        marginBottom: "16px",
        padding: "0" 
      },
      onClick: function() { 
        window.location.hash = "#/movie/" + ctx.selectedMovie.id; 
      }
    }, "\u2039 Back"),
    React.createElement("h1", null, "Select Your Seats"),

    // Java Concurrency Thread Lock Banner
    React.createElement("div", { className: "thread-timer-banner" },
      React.createElement("div", { className: "thread-timer-info" },
        React.createElement("span", { className: "thread-timer-clock" }, formatTime(timeLeft)),
        React.createElement("div", null,
          React.createElement("strong", { style: { fontSize: "0.85rem" } }, "Reservation Hold \u00b7 Java Concurrency"),
          React.createElement("div", { className: "thread-timer-log" }, threadLog)
        )
      ),
      React.createElement("span", { style: { fontSize: "0.72rem", background: "var(--primary)", padding: "4px 12px", borderRadius: "980px", color: "#fff", fontWeight: "600" } }, "Thread-0")
    ),

    // Booking Info Card
    React.createElement("div", { className: "booking-info", style: { display: "flex", flexDirection: "column", gap: "10px", padding: "20px", background: "var(--surface-solid)", borderRadius: "12px", border: "1px solid var(--border)", marginBottom: "24px" } },
      React.createElement("p", { style: { margin: 0, fontSize: "1.1rem", fontWeight: "600" } }, ctx.selectedMovie.title),
      ctx.selectedTheatre && React.createElement("p", { style: { margin: 0, color: "var(--text-secondary)", fontSize: "0.9rem" } }, ctx.selectedTheatre + " \u00b7 " + ctx.selectedDistrict),
      ctx.selectedScreenNumber && React.createElement("p", { style: { margin: 0, color: "var(--text-secondary)", fontSize: "0.85rem" } }, ctx.selectedScreenNumber.label),
      React.createElement("div", { style: { display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" } },
        ctx.selectedScreen && React.createElement("span", { className: "booking-screen-badge", style: { backgroundColor: screenColor } }, screenName),
        React.createElement("span", { style: { color: "var(--text-secondary)", fontSize: "0.85rem" } }, ctx.selectedShowtime)
      )
    ),

    React.createElement("div", { className: "booking-layout" },
      React.createElement(SeatMap, null),
      React.createElement("div", { className: "booking-sidebar" },
        React.createElement(BookingSummary, null),
        React.createElement("button", {
          className: "btn-primary",
          style: { width: "100%", marginTop: "12px" },
          disabled: ctx.selectedSeats.length === 0,
          onClick: function () { window.location.hash = "#/confirm"; }
        }, "Proceed to Payment")
      )
    )
  );
}
