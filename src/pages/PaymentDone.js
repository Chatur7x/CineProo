function PaymentDone() {
  var ctx = useBooking();
  var pmt = usePayment();
  var bridge = window.__paymentBridge || {};

  var movie = ctx.selectedMovie || bridge.movie;
  var seats = ctx.selectedSeats && ctx.selectedSeats.length > 0 ? ctx.selectedSeats : (bridge.seats || []);
  var showtime = ctx.selectedShowtime || bridge.showtime || "";
  var theatre = ctx.selectedTheatre || bridge.theatre || "";
  var district = ctx.selectedDistrict || bridge.district || "";
  var screen = ctx.selectedScreen || bridge.screen || null;
  var tid = pmt.transactionId || (bridge.booking && bridge.booking.id) || ("CB-" + Date.now());

  var pricePerSeat = screen ? getScreenPrice(screen) : PRICE_PER_SEAT;
  var taxPerSeat = screen ? getScreenTax(screen) : TAX_PER_SEAT;
  var subtotal = seats.length * pricePerSeat;
  var tax = seats.length * taxPerSeat;
  var total = subtotal + tax;
  var paymentMethod = pmt.paymentMethod === "counter" ? "Pay at Counter" : "Card";

  var cardInfo = "";
  var card = pmt.selectedCard || bridge.selectedCard || (bridge.booking && bridge.booking.cardInfo);
  if (card) {
    cardInfo = typeof card === 'string' ? card : (card.getMasked ? card.getMasked() : "");
  }

  return React.createElement("div", { className: "payment-done-page" },
    React.createElement("div", { className: "payment-success-card" },
      React.createElement("div", { className: "success-icon", style: { fontSize: "3rem", color: "#30D158" } }, "\u2713"),
      React.createElement("h2", null, "Booking Confirmed!"),
      React.createElement("div", { className: "ticket-details" },
        React.createElement("div", { className: "ticket-row" }, React.createElement("span", null, "Ticket #"), React.createElement("span", null, tid)),
        React.createElement("div", { className: "ticket-row" }, React.createElement("span", null, "Movie"), React.createElement("span", null, movie ? movie.title || movie : "")),
        theatre && React.createElement("div", { className: "ticket-row" }, React.createElement("span", null, "Theatre"), React.createElement("span", null, theatre + " (" + district + ")")),
        screen && React.createElement("div", { className: "ticket-row" },
          React.createElement("span", null, "Experience"),
          React.createElement("span", { className: "ticket-screen-row" },
            React.createElement("span", { className: "ticket-screen-badge", style: { backgroundColor: screen.color } }, screen.name)
          )
        ),
        React.createElement("div", { className: "ticket-row" }, React.createElement("span", null, "Showtime"), React.createElement("span", null, showtime)),
        React.createElement("div", { className: "ticket-row" }, React.createElement("span", null, "Seats"), React.createElement("span", null, seats.join(", "))),
        React.createElement("div", { className: "ticket-row" }, React.createElement("span", null, "Payment"), React.createElement("span", null, paymentMethod)),
        cardInfo && React.createElement("div", { className: "ticket-row" }, React.createElement("span", null, "Card"), React.createElement("span", null, cardInfo)),
        React.createElement("div", { className: "ticket-row total" }, React.createElement("span", null, "Total"), React.createElement("span", null, "\u20B9" + total.toFixed(2)))
      ),
      React.createElement("div", { className: "done-actions" },
        React.createElement("button", { onClick: function () { window.location.hash = "#/my-bookings"; } }, "My Bookings"),
        React.createElement("button", { onClick: function () { pmt.resetPayment(); window.__paymentBridge = null; window.location.hash = "#/"; } }, "Back to Home")
      )
    )
  );
}
