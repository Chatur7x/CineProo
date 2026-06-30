function SeatMap() {
  var ctx = useBooking();
  var seats = ctx.seats || [];
  var selectedSeats = ctx.selectedSeats;
  var setSelectedSeats = ctx.setSelectedSeats;
  var rows = ["A", "B", "C", "D", "E", "F", "G"];
  var movie = ctx.selectedMovie;
  var screen = ctx.selectedScreen;
  var screenNumber = ctx.selectedScreenNumber;
  var posterUrl = movie && movie.poster ? movie.poster : "";

  // Animation & Quantity State
  var mountedRef = React.useRef(false);
  var animState = React.useState(false);
  var animated = animState[0], setAnimated = animState[1];
  var bestSeatState = React.useState(null);
  var bestSeats = bestSeatState[0], setBestSeats = bestSeatState[1];
  var quantityState = React.useState(1);
  var quantity = quantityState[0], setQuantity = quantityState[1];

  React.useEffect(function () {
    if (!mountedRef.current) {
      mountedRef.current = true;
      setTimeout(function () { setAnimated(true); }, 100);
    }
  }, []);

  // ─── Best Seat Suggestion Algorithm ───
  // Sweet spot: rows D-E (middle), seats 4-9 (center), for best screen & sound
  React.useEffect(function () {
    var bestRows = ["D", "E", "C"];
    var bestCols = [5, 6, 7, 8, 4, 9];
    var suggested = [];
    for (var r = 0; r < bestRows.length && suggested.length < 4; r++) {
      for (var c = 0; c < bestCols.length && suggested.length < 4; c++) {
        var seatId = bestRows[r] + bestCols[c];
        var seat = seats.find(function (s) { return s.id === seatId; });
        if (seat && seat.status === "available") {
          suggested.push(seatId);
        }
      }
    }
    setBestSeats(suggested);
  }, [seats]);

  // Helper to select additional seats adjacent to current selection or from recommended/available pool
  function selectAdditionalSeats(currentSelection, countNeeded) {
    var toAdd = [];
    
    function isAvailable(sid) {
      var s = seats.find(function(st) { return st.id === sid; });
      return s && s.status === "available" && currentSelection.indexOf(sid) === -1 && toAdd.indexOf(sid) === -1;
    }

    if (currentSelection.length > 0) {
      var lastId = currentSelection[currentSelection.length - 1];
      var seatObj = seats.find(function(s) { return s.id === lastId; });
      if (seatObj) {
        var row = seatObj.row;
        var num = seatObj.number;
        var rowSeats = seats.filter(function(s) { return s.row === row; });
        
        // Try adjacent right
        for (var i = 1; i <= 12 && toAdd.length < countNeeded; i++) {
          var nextId = row + (num + i);
          if (isAvailable(nextId)) {
            toAdd.push(nextId);
          } else {
            break;
          }
        }
        
        // Try adjacent left
        if (toAdd.length < countNeeded) {
          for (var i = 1; i <= 12 && toAdd.length < countNeeded; i++) {
            var prevId = row + (num - i);
            if (isAvailable(prevId)) {
              toAdd.push(prevId);
            } else {
              break;
            }
          }
        }
      }
    }
    
    // Fallback to recommended seats
    if (toAdd.length < countNeeded && bestSeats) {
      bestSeats.forEach(function(bid) {
        if (toAdd.length < countNeeded && isAvailable(bid)) {
          toAdd.push(bid);
        }
      });
    }
    
    // Ultimate fallback: any available seat
    if (toAdd.length < countNeeded) {
      seats.forEach(function(s) {
        if (toAdd.length < countNeeded && s.status === "available" && currentSelection.indexOf(s.id) === -1 && toAdd.indexOf(s.id) === -1) {
          toAdd.push(s.id);
        }
      });
    }
    
    return toAdd;
  }

  // Handle stepper quantity change & update selection accordingly
  function handleQuantityChange(newQty) {
    if (newQty < 1 || newQty > 10) return;
    
    if (selectedSeats.length > 0) {
      if (newQty > selectedSeats.length) {
        // User increased quantity: try to add adjacent or recommended seats
        var countNeeded = newQty - selectedSeats.length;
        var added = selectAdditionalSeats(selectedSeats, countNeeded);
        if (added.length > 0) {
          var nextSelection = selectedSeats.concat(added);
          setSelectedSeats(nextSelection);
          setQuantity(nextSelection.length);
        }
      } else if (newQty < selectedSeats.length) {
        // User decreased quantity: remove last selected seats
        var nextSelection = selectedSeats.slice(0, newQty);
        setSelectedSeats(nextSelection);
        setQuantity(nextSelection.length);
      }
    } else {
      // Just update quantity state if no seats are selected yet
      setQuantity(newQty);
    }
  }

  // Contiguous seat selection based on active stepper quantity
  function handleClick(id) {
    var seat = seats.find(function (s) { return s.id === id; });
    if (!seat) return;

    // Toggle off if already selected
    if (selectedSeats.indexOf(id) !== -1) {
      var nextSelection = selectedSeats.filter(function (s) { return s !== id; });
      setSelectedSeats(nextSelection);
      setQuantity(Math.max(1, nextSelection.length));
      return;
    }

    // If selection is already active, just append/toggle to the list
    if (selectedSeats.length > 0) {
      var added = selectedSeats.concat([id]);
      setSelectedSeats(added);
      setQuantity(added.length);
      return;
    }

    // Otherwise, try to select quantity contiguous seats starting from this one
    var row = seat.row;
    var startNum = seat.number;
    var rowSeats = seats.filter(function (s) { return s.row === row; });

    var toSelect = [];
    for (var i = 0; i < quantity; i++) {
      var nextSeatId = row + (startNum + i);
      var nextSeat = rowSeats.find(function (s) { return s.id === nextSeatId; });
      if (nextSeat && nextSeat.status === "available") {
        toSelect.push(nextSeatId);
      } else {
        break;
      }
    }

    // Try contiguous select first
    if (toSelect.length === quantity) {
      setSelectedSeats(toSelect);
      setQuantity(toSelect.length);
    } else {
      // Fallback: select single clicked seat
      var fallback = [id];
      setSelectedSeats(fallback);
      setQuantity(1);
    }
  }

  function selectBestSeats() {
    if (bestSeats && bestSeats.length > 0) {
      var availableBest = bestSeats.filter(function(id) {
        var s = seats.find(function(st) { return st.id === id; });
        return s && s.status === "available";
      });
      // Pick up to quantity from available recommended seats
      var toSelect = availableBest.slice(0, quantity);
      
      // If we don't have enough best seats, try to add adjacent ones
      if (toSelect.length < quantity && toSelect.length > 0) {
        var countNeeded = quantity - toSelect.length;
        var added = selectAdditionalSeats(toSelect, countNeeded);
        toSelect = toSelect.concat(added);
      }
      
      if (toSelect.length > 0) {
        setSelectedSeats(toSelect);
        setQuantity(toSelect.length);
      }
    }
  }

  var children = [];
  var screenColor = screen ? screen.color : "#0A84FF";
  var screenName = screen ? screen.name : "Screen";
  var screenLabel = screenName + (screenNumber ? " \u2014 " + screenNumber.label : "");

  // ─── Premium Cinema Screen (District-style) ───
  children.push(
    React.createElement("div", { className: "cinema-screen-wrapper", key: "cinema-screen" },
      React.createElement("div", { className: "projector-rays", style: { 
        "--screen-color-fade": screenColor + "14"
      } }),
      React.createElement("div", { className: "cinema-screen-frame", style: { 
        "--screen-color": screenColor,
        "--screen-color-shadow": screenColor + "44"
      } }),
      React.createElement("div", { className: "cinema-screen-label" }, "Screen facing this way")
    )
  );

  // ─── Quantity Stepper Control (Apple HIG WatchOS/iOS design style) ───
  children.push(
    React.createElement("div", { className: "quantity-selector-container", key: "qty-select" },
      React.createElement("span", { className: "qty-label" }, "Seats to Select"),
      React.createElement("div", { className: "qty-stepper" },
        React.createElement("button", { 
          className: "qty-btn", 
          disabled: quantity <= 1,
          onClick: function () { handleQuantityChange(quantity - 1); } 
        }, "\u2212"),
        React.createElement("span", { className: "qty-value" }, quantity),
        React.createElement("button", { 
          className: "qty-btn", 
          disabled: quantity >= 10,
          onClick: function () { handleQuantityChange(quantity + 1); } 
        }, "+")
      )
    )
  );

  // ─── Best Seat Suggestion Banner ───
  if (bestSeats && bestSeats.length > 0) {
    children.push(
      React.createElement("div", { className: "best-seat-banner", key: "best-seats" },
        React.createElement("div", { className: "best-seat-content" },
          React.createElement("div", { className: "best-seat-icon" }, "\u2605"),
          React.createElement("div", null,
            React.createElement("span", { className: "best-seat-title" }, "Recommended Seats"),
            React.createElement("span", { className: "best-seat-desc" }, "Best view \u00b7 " + bestSeats.join(", "))
          )
        ),
        React.createElement("button", { className: "best-seat-btn", onClick: selectBestSeats }, "Select")
      )
    );
  }

  // ─── Section Labels ───
  children.push(
    React.createElement("div", { className: "seat-section-label", key: "section-label" },
      React.createElement("span", null, rows[0] + " \u2014 " + rows[2] + " \u00b7 PREMIUM"),
      React.createElement("span", null, rows[3] + " \u2014 " + rows[6] + " \u00b7 CLASSIC")
    )
  );

  // ─── Seat Rows ───
  rows.forEach(function (row, rowIndex) {
    var rowSeats = seats.filter(function (s) { return s.row === row; });
    var leftSeats = rowSeats.slice(0, 6);
    var rightSeats = rowSeats.slice(6);

    function renderSeat(seat, seatIndex, offset) {
      var isSelected = selectedSeats.indexOf(seat.id) !== -1;
      var isBest = bestSeats && bestSeats.indexOf(seat.id) !== -1 && !isSelected;
      var delay = (rowIndex * 70) + ((seatIndex + offset) * 25);

      var seatClass = "seat ";
      if (seat.status === "booked") { seatClass += "booked"; }
      else if (isSelected) { seatClass += "selected"; }
      else if (isBest) { seatClass += "available best-suggested"; }
      else { seatClass += "available"; }
      if (animated) { seatClass += " seat-pop"; }

      var inlineStyle = { animationDelay: delay + "ms" };

      return React.createElement("div", {
        key: seat.id,
        className: seatClass,
        style: inlineStyle,
        onClick: function () { if (seat.status !== "booked") handleClick(seat.id); },
        title: seat.id + (isBest ? " (Recommended)" : "")
      },
        // Selected → animated movie poster (hero image only, no text)
        isSelected && posterUrl
          ? React.createElement("div", { 
              className: "seat-poster-thumb",
              style: { 
                backgroundImage: "url('" + posterUrl + "')",
                backgroundSize: "cover",
                backgroundPosition: "center 15%"
              }
            })
          : React.createElement("span", { className: "seat-number" }, seat.number)
      );
    }

    // Row divider between premium & classic
    if (rowIndex === 3) {
      children.push(
        React.createElement("div", { key: "divider", className: "seat-section-divider" })
      );
    }

    children.push(
      React.createElement("div", {
        key: row,
        className: "seat-row" + (animated ? " seat-row-animated" : ""),
        style: { animationDelay: (rowIndex * 70) + "ms" }
      },
        React.createElement("span", { className: "row-label" }, row),
        React.createElement("div", { className: "seats seat-section-left" },
          leftSeats.map(function (seat, i) { return renderSeat(seat, i, 0); })
        ),
        React.createElement("div", { className: "seat-aisle" }),
        React.createElement("div", { className: "seats seat-section-right" },
          rightSeats.map(function (seat, i) { return renderSeat(seat, i, 6); })
        ),
        React.createElement("span", { className: "row-label" }, row)
      )
    );
  });

  // ─── Legend ───
  children.push(
    React.createElement("div", { className: "seat-legend", key: "legend" },
      React.createElement("span", null,
        React.createElement("span", { className: "legend-box available" }), " Available"
      ),
      React.createElement("span", null,
        React.createElement("span", { className: "legend-box selected" }), " Selected"
      ),
      React.createElement("span", null,
        React.createElement("span", { className: "legend-box booked" }), " Sold"
      ),
      React.createElement("span", null,
        React.createElement("span", { className: "legend-box best-suggested" }), " Recommended"
      )
    )
  );

  // ─── Price Strip ───
  if (screen) {
    var pricePerSeat = getScreenPrice(screen);
    children.push(
      React.createElement("div", { className: "seat-price-strip", key: "price-strip" },
        React.createElement("span", { style: { fontWeight: 600 } }, screenName),
        React.createElement("span", { style: { color: "var(--primary)", fontWeight: "700" } }, "\u20B9" + pricePerSeat + " / seat"),
        selectedSeats.length > 0 && React.createElement("div", { style: { display: "flex", alignItems: "center", gap: "8px" } },
          React.createElement("span", { style: { color: "#30D158", fontWeight: "700" } },
            selectedSeats.length + " seats \u00b7 \u20B9" + (selectedSeats.length * pricePerSeat)
          ),
          React.createElement("button", {
            style: {
              border: "none",
              background: "rgba(255, 69, 58, 0.15)",
              color: "#FF453A",
              padding: "4px 12px",
              borderRadius: "980px",
              fontSize: "0.72rem",
              fontWeight: "700",
              cursor: "pointer"
            },
            onClick: function () { setSelectedSeats([]); }
          }, "Clear")
        )
      )
    );
  }

  return React.createElement("div", { className: "seat-map-container" }, children);
}
