function OtpVerify() {
  var pmt = usePayment();
  var ctx = useBooking();
  var MAX_ATTEMPTS = 3;

  var otpState = React.useState("");
  var enteredOtp = otpState[0], setEnteredOtp = otpState[1];
  var attemptState = React.useState(0);
  var attempts = attemptState[0], setAttempts = attemptState[1];
  var errState = React.useState("");
  var error = errState[0], setError = errState[1];
  var generatedOtp = React.useRef(null);
  var resendState = React.useState(false);
  var resent = resendState[0], setResent = resendState[1];

  if (!generatedOtp.current) {
    generatedOtp.current = String(Math.floor(100000 + Math.random() * 900000));
  }

  function getCardInfo() {
    var card = pmt.selectedCard || (window.__paymentBridge && window.__paymentBridge.selectedCard);
    return card ? (card.getMasked ? card.getMasked() : (card.getBank + " " + card.getCardType + " ****" + card.getLast4)) : "";
  }

  function verifyOtp() {
    if (enteredOtp === generatedOtp.current) {
      setError("");
      pmt.setOtpStatus({ verified: true, attempts: attempts, otp: enteredOtp });
      var tid = "CB-" + Date.now();
      pmt.setTransactionId(tid);

      var bridge = window.__paymentBridge || {};
      var screen = ctx.selectedScreen || bridge.screen;
      var pricePerSeat = screen ? getScreenPrice(screen) : PRICE_PER_SEAT;
      var taxPerSeat = screen ? getScreenTax(screen) : TAX_PER_SEAT;

      ctx.confirmBooking();
      var cardInfo = getCardInfo();
      var movie = ctx.selectedMovie || bridge.movie;
      var seats = ctx.selectedSeats || [];
      if (seats.length === 0 && bridge.seats) seats = bridge.seats;
      var total = seats.length * pricePerSeat + seats.length * taxPerSeat;
      var booking = {
        id: tid,
        movie: movie,
        showtime: ctx.selectedShowtime || bridge.showtime,
        theatre: ctx.selectedTheatre || bridge.theatre || "",
        district: ctx.selectedDistrict || bridge.district || "",
        screen: screen,
        seats: seats,
        total: total,
        date: new Date().toLocaleDateString(),
        paymentMethod: "Card",
        cardInfo: cardInfo
      };
      try {
        var existing = JSON.parse(localStorage.getItem("javaBookings") || "[]");
        existing.push(booking);
        localStorage.setItem("javaBookings", JSON.stringify(existing));
      } catch (e) {}
      if (window.__paymentBridge) {
        window.__paymentBridge.booking = booking;
      }
      window.location.hash = "#/payment-done";
    } else {
      var newAttempts = attempts + 1;
      setAttempts(newAttempts);
      if (newAttempts >= MAX_ATTEMPTS) {
        setError("Too many incorrect attempts. Payment failed.");
      } else {
        setError("Invalid OTP. " + (MAX_ATTEMPTS - newAttempts) + " attempts remaining.");
      }
    }
  }

  function resendOtp() {
    generatedOtp.current = String(Math.floor(100000 + Math.random() * 900000));
    setResent(true);
    setTimeout(function () { setResent(false); }, 3000);
  }

  function handleOtpInput(e) {
    setEnteredOtp(e.target.value.replace(/\D/g, "").substring(0, 6));
  }

  if (attempts >= MAX_ATTEMPTS) {
    return React.createElement("div", { className: "otp-page" },
      React.createElement("h2", null, "\u274C Payment Failed"),
      React.createElement("p", null, "Too many incorrect OTP attempts. Please try booking again."),
      React.createElement("button", { onClick: function () { window.location.hash = "#/"; } }, "Back to Home")
    );
  }

  var cardInfo = getCardInfo();

  return React.createElement("div", { className: "otp-page" },
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
        window.location.hash = "#/card-form"; 
      }
    }, "\u2039 Back"),
    React.createElement("h2", null, "OTP Verification"),
    React.createElement("p", { className: "otp-info" }, "An OTP has been sent to your registered mobile"),
    cardInfo && React.createElement("p", { className: "otp-card-info" }, "Paying via " + cardInfo),
    React.createElement("div", { className: "otp-input-group" },
      React.createElement("input", {
        type: "text", className: "otp-input", maxLength: 6, value: enteredOtp,
        placeholder: "Enter 6-digit OTP", onChange: handleOtpInput
      })
    ),
    React.createElement("p", { className: "otp-demo" }, "Demo OTP: " + generatedOtp.current),
    error && React.createElement("p", { className: "otp-error" }, error),
    React.createElement("div", { className: "otp-actions" },
      React.createElement("button", { className: "btn-verify", onClick: verifyOtp, disabled: enteredOtp.length < 6 }, "Verify"),
      React.createElement("button", { className: "btn-resend", onClick: resendOtp }, resent ? "OTP Resent!" : "Resend OTP")
    )
  );
}
