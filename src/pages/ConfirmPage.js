function ConfirmPage() {
  var ctx = useBooking();
  var movie = ctx.selectedMovie;
  var showtime = ctx.selectedShowtime;
  var seats = ctx.selectedSeats;
  var theatre = ctx.selectedTheatre;
  var district = ctx.selectedDistrict;
  var screen = ctx.selectedScreen;

  var pricePerSeat = screen ? getScreenPrice(screen) : PRICE_PER_SEAT;
  var taxPerSeat = screen ? getScreenTax(screen) : TAX_PER_SEAT;

  var subtotal = seats.length * pricePerSeat;
  var tax = seats.length * taxPerSeat;
  var total = subtotal + tax;

  if (!movie || seats.length === 0) {
    return React.createElement("div", { className: "confirm-page" },
      React.createElement("h2", null, "No booking selected"),
      React.createElement("p", null, "Please select a movie and seats first."),
      React.createElement("button", { onClick: function () { window.location.hash = "#/"; } }, "Browse Movies")
    );
  }

  function proceedToPayment() {
    window.location.hash = "#/payment";
  }

  function cancelBooking() {
    ctx.setSelectedSeats([]);
    ctx.setSelectedShowtime("");
    ctx.setSelectedTheatre("");
    ctx.setSelectedDistrict("");
    ctx.setSelectedScreen(null);
    ctx.setSelectedMovie(null);
    window.location.hash = "#/";
  }

  return React.createElement("div", { className: "confirm-page" },
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
        window.location.hash = "#/booking"; 
      }
    }, "\u2039 Back"),
    React.createElement("h2", null, "Booking Summary"),
    React.createElement("div", { className: "booking-summary-card" },
      React.createElement("div", { className: "summary-row" }, React.createElement("span", null, "Movie:"), React.createElement("span", null, movie.title)),
      theatre && React.createElement("div", { className: "summary-row" }, React.createElement("span", null, "Theatre:"), React.createElement("span", null, theatre + " (" + district + ")")),
      screen && React.createElement("div", { className: "summary-row" },
        React.createElement("span", null, "Experience:"),
        React.createElement("span", { className: "booking-screen-badge", style: { backgroundColor: screen.color, color: "#fff", display: "inline-block" } }, screen.name)
      ),
      React.createElement("div", { className: "summary-row" }, React.createElement("span", null, "Showtime:"), React.createElement("span", null, showtime)),
      React.createElement("div", { className: "summary-row" }, React.createElement("span", null, "Seats:"), React.createElement("span", null, seats.join(", "))),
      React.createElement("div", { className: "summary-row" }, React.createElement("span", null, "Price/Seat:"), React.createElement("span", null, "\u20B9" + pricePerSeat)),
      React.createElement("div", { className: "summary-row" }, React.createElement("span", null, "Subtotal:"), React.createElement("span", null, "\u20B9" + subtotal)),
      React.createElement("div", { className: "summary-row" }, React.createElement("span", null, "Tax:"), React.createElement("span", null, "\u20B9" + tax.toFixed(2))),
      React.createElement("div", { className: "summary-row total" }, React.createElement("span", null, "Total:"), React.createElement("span", null, "\u20B9" + total.toFixed(2)))
    ),
    React.createElement("div", { className: "confirm-actions" },
      React.createElement("button", { className: "btn-pay", onClick: proceedToPayment }, "Proceed to Payment"),
      React.createElement("button", { className: "btn-cancel", onClick: cancelBooking }, "Cancel")
    )
  );
}
