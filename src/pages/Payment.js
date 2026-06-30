function Payment() {
  var ctx = useBooking();
  var pmt = usePayment();
  var movie = ctx.selectedMovie;
  var seats = ctx.selectedSeats;

  if (!movie || seats.length === 0) {
    return React.createElement("div", { className: "payment-page" },
      React.createElement("h2", null, "No booking to pay for"),
      React.createElement("button", { className: "btn-primary", onClick: function () { window.location.hash = "#/"; } }, "Browse Movies")
    );
  }

  var pricePerSeat = ctx.selectedScreen ? getScreenPrice(ctx.selectedScreen) : PRICE_PER_SEAT;
  var taxPerSeat = ctx.selectedScreen ? getScreenTax(ctx.selectedScreen) : TAX_PER_SEAT;
  var subtotal = seats.length * pricePerSeat;
  var tax = seats.length * taxPerSeat;
  var convFee = 30;
  var total = subtotal + tax + convFee;

  var cardManager = new CardManager();
  var savedCards = cardManager.getAllCards();

  function selectPayAtCounter() {
    pmt.setPaymentMethod("counter");
    window.__paymentBridge = {
      movie: movie, showtime: ctx.selectedShowtime, seats: seats.slice(),
      total: total, paymentMethod: "Counter",
      theatre: ctx.selectedTheatre, district: ctx.selectedDistrict, screen: ctx.selectedScreen
    };
    ctx.confirmBooking();
    var booking = {
      id: Date.now(), movie: movie, showtime: window.__paymentBridge.showtime,
      seats: seats.slice(), total: total, date: new Date().toLocaleDateString(),
      paymentMethod: "Counter", cardInfo: "",
      theatre: window.__paymentBridge.theatre, district: window.__paymentBridge.district,
      screen: window.__paymentBridge.screen
    };
    try {
      var existing = JSON.parse(localStorage.getItem("javaBookings") || "[]");
      existing.push(booking);
      localStorage.setItem("javaBookings", JSON.stringify(existing));
    } catch (e) {}
    window.location.hash = "#/payment-done";
  }

  function selectPayViaCard(card) {
    pmt.setPaymentMethod("card");
    window.__paymentBridge = {
      movie: movie, showtime: ctx.selectedShowtime, seats: seats.slice(),
      total: total, theatre: ctx.selectedTheatre, district: ctx.selectedDistrict,
      screen: ctx.selectedScreen
    };
    if (card) {
      pmt.setSelectedCard(card);
      window.__paymentBridge.savedCard = card;
    }
    window.location.hash = "#/card-form";
  }

  var screenName = ctx.selectedScreen ? ctx.selectedScreen.name : "Standard";

  return React.createElement("div", { className: "payment-page" },
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
        window.location.hash = "#/confirm"; 
      }
    }, "\u2039 Back"),
    React.createElement("h2", { style: { fontWeight: 700, letterSpacing: "-0.02em" } }, "Payment"),

    // Order Summary
    React.createElement("div", { className: "payment-summary", style: { textAlign: "left" } },
      React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" } },
        React.createElement("span", { style: { fontWeight: 600, fontSize: "1.05rem" } }, movie.title),
        ctx.selectedScreen && React.createElement("span", { className: "booking-screen-badge", style: { backgroundColor: ctx.selectedScreen.color } }, screenName)
      ),
      ctx.selectedTheatre && React.createElement("p", { style: { color: "var(--text-secondary)", fontSize: "0.85rem", marginBottom: "4px", padding: 0 } }, ctx.selectedTheatre + " \u00b7 " + ctx.selectedDistrict),
      React.createElement("p", { style: { color: "var(--text-secondary)", fontSize: "0.85rem", marginBottom: "4px", padding: 0 } }, ctx.selectedShowtime + " \u00b7 " + seats.join(", ")),

      // Price Breakdown
      React.createElement("div", { style: { borderTop: "1px solid var(--border)", marginTop: "14px", paddingTop: "14px" } },
        React.createElement("div", { style: { display: "flex", justifyContent: "space-between", marginBottom: "8px", fontSize: "0.88rem" } },
          React.createElement("span", { style: { color: "var(--text-secondary)" } }, "Tickets (" + seats.length + " \u00d7 \u20B9" + pricePerSeat + ")"),
          React.createElement("span", null, "\u20B9" + subtotal.toFixed(2))
        ),
        React.createElement("div", { style: { display: "flex", justifyContent: "space-between", marginBottom: "8px", fontSize: "0.88rem" } },
          React.createElement("span", { style: { color: "var(--text-secondary)" } }, "Taxes & GST"),
          React.createElement("span", null, "\u20B9" + tax.toFixed(2))
        ),
        React.createElement("div", { style: { display: "flex", justifyContent: "space-between", marginBottom: "8px", fontSize: "0.88rem" } },
          React.createElement("span", { style: { color: "var(--text-secondary)" } }, "Convenience Fee"),
          React.createElement("span", null, "\u20B9" + convFee.toFixed(2))
        ),
        React.createElement("div", { style: { display: "flex", justifyContent: "space-between", marginTop: "12px", paddingTop: "12px", borderTop: "1px solid var(--border)", fontSize: "1.15rem", fontWeight: 700 } },
          React.createElement("span", null, "Total"),
          React.createElement("span", { style: { color: "var(--primary)" } }, "\u20B9" + total.toFixed(2))
        )
      )
    ),

    // Payment Methods Header
    React.createElement("h3", { style: { fontSize: "0.8rem", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "1px", margin: "28px 0 14px" } }, "Payment Method"),

    // Payment Options
    React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: "8px" } },
      React.createElement("button", { className: "payment-option-btn", style: { display: "flex", alignItems: "center", gap: "16px", textAlign: "left", padding: "18px 20px" }, onClick: function () { selectPayViaCard(null); } },
        React.createElement("div", { style: { width: "42px", height: "42px", borderRadius: "10px", background: "linear-gradient(135deg, #0A84FF, #5E5CE6)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800, fontSize: "0.65rem", flexShrink: 0, letterSpacing: "0.5px" } }, "CARD"),
        React.createElement("div", { style: { flex: 1 } },
          React.createElement("span", { className: "payment-label", style: { fontSize: "0.95rem" } }, "Credit / Debit Card"),
          React.createElement("span", { className: "payment-desc" }, "Visa, Mastercard, RuPay")
        ),
        React.createElement("span", { style: { color: "var(--text-muted)", fontSize: "1.2rem" } }, "\u203A")
      ),
      React.createElement("button", { className: "payment-option-btn", style: { display: "flex", alignItems: "center", gap: "16px", textAlign: "left", padding: "18px 20px" }, onClick: selectPayAtCounter },
        React.createElement("div", { style: { width: "42px", height: "42px", borderRadius: "10px", background: "linear-gradient(135deg, #30D158, #64D2FF)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800, fontSize: "0.6rem", flexShrink: 0, letterSpacing: "0.5px" } }, "BOX"),
        React.createElement("div", { style: { flex: 1 } },
          React.createElement("span", { className: "payment-label", style: { fontSize: "0.95rem" } }, "Pay at Box Office"),
          React.createElement("span", { className: "payment-desc" }, "Pay when you arrive")
        ),
        React.createElement("span", { style: { color: "var(--text-muted)", fontSize: "1.2rem" } }, "\u203A")
      )
    ),

    // Saved Cards
    savedCards.length > 0 && React.createElement("div", { style: { marginTop: "24px" } },
      React.createElement("h3", { style: { fontSize: "0.8rem", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "12px" } }, "Saved Cards"),
      savedCards.map(function (card, i) {
        return React.createElement("div", { key: i, className: "saved-card-item", onClick: function () { selectPayViaCard(card); } },
          React.createElement("span", { className: "card-badge" }, card.getBank()),
          React.createElement("span", { className: "card-info", style: { flex: 1 } }, card.getCardType() + " ****" + card.getLast4()),
          React.createElement("span", { style: { color: "var(--text-muted)", fontSize: "1.2rem" } }, "\u203A")
        );
      })
    )
  );
}
