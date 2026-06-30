function Ticket3D(props) {
  var booking = props.booking;
  var onClose = props.onClose;

  var cardRef = React.useRef(null);
  var coordState = React.useState({ x: 0, y: 0 });
  var coords = coordState[0], setCoords = coordState[1];
  var scanState = React.useState(false);
  var scanned = scanState[0], setScanned = scanState[1];

  function handleMouseMove(e) {
    if (!cardRef.current) return;
    var rect = cardRef.current.getBoundingClientRect();
    var width = rect.width;
    var height = rect.height;
    var mouseX = e.clientX - rect.left - width / 2;
    var mouseY = e.clientY - rect.top - height / 2;
    
    // Normalize tilt angle limits (-12 to 12 deg)
    var rX = -(mouseY / (height / 2)) * 12;
    var rY = (mouseX / (width / 2)) * 12;
    setCoords({ x: rX, y: rY });

    // Set custom CSS properties on card for spotlight glow overlay
    var percentX = Math.round((e.clientX - rect.left) / width * 100);
    var percentY = Math.round((e.clientY - rect.top) / height * 100);
    cardRef.current.style.setProperty('--mouse-x', percentX + '%');
    cardRef.current.style.setProperty('--mouse-y', percentY + '%');
  }

  function handleMouseLeave() {
    setCoords({ x: 0, y: 0 });
  }

  var tid = booking.id ? (typeof booking.id === 'string' && booking.id.startsWith("CB-") ? booking.id : "CB-" + booking.id) : "CB-" + Date.now();
  var title = (booking.movie && booking.movie.title) || (typeof booking.movie === 'string' ? booking.movie : "Movie Title");
  var showtime = booking.showtime || "07:00 PM";
  var theatre = booking.theatre || "PVR Cinema";
  var district = booking.district || "Vijayawada";
  var screenName = booking.screen ? (booking.screen.name || "IMAX") : "IMAX";
  var screenColor = booking.screen ? (booking.screen.color || "#0A84FF") : "#0A84FF";
  var seats = (booking.seats && booking.seats.join(", ")) || "A1, A2";
  var total = booking.total || 0;
  var dateStr = booking.date || new Date().toLocaleDateString();

  var cardStyle = {
    transform: "rotateX(" + coords.x + "deg) rotateY(" + coords.y + "deg)",
    transition: coords.x === 0 && coords.y === 0 ? "all 0.5s cubic-bezier(0.25, 0.8, 0.25, 1)" : "none"
  };

  // Generate offline SVG QR code grid
  function renderSvgQrCode(dataStr) {
    var size = 21;
    var rects = [];
    
    function drawSquare(x, y, w, h) {
      return React.createElement("rect", {
        key: x + "-" + y,
        x: x, y: y, width: w, height: h,
        fill: scanned ? "var(--green)" : "var(--text)"
      });
    }

    // Top-Left Finder
    rects.push(React.createElement("path", {
      key: "tl-finder",
      d: "M 0,0 H 7 V 7 H 0 Z M 1,1 V 6 H 6 V 1 Z M 2,2 H 5 V 5 H 2 Z",
      fill: scanned ? "var(--green)" : "var(--text)"
    }));
    // Top-Right Finder
    rects.push(React.createElement("path", {
      key: "tr-finder",
      d: "M 14,0 H 21 V 7 H 14 Z M 15,1 V 6 H 20 V 1 Z M 16,2 H 19 V 5 H 16 Z",
      fill: scanned ? "var(--green)" : "var(--text)"
    }));
    // Bottom-Left Finder
    rects.push(React.createElement("path", {
      key: "bl-finder",
      d: "M 0,14 H 7 V 21 H 0 Z M 1,15 V 20 H 6 V 15 Z M 2,16 H 5 V 19 H 2 Z",
      fill: scanned ? "var(--green)" : "var(--text)"
    }));

    var seed = 0;
    for (var i = 0; i < dataStr.length; i++) {
      seed += dataStr.charCodeAt(i);
    }
    
    for (var r = 0; r < size; r++) {
      for (var c = 0; c < size; c++) {
        if ((r < 8 && c < 8) || (r < 8 && c > 12) || (r > 12 && c < 8)) continue;
        var val = Math.sin(seed + r * 17 + c * 31);
        if (val > 0.3) {
          rects.push(drawSquare(c, r, 1, 1));
        }
      }
    }

    return React.createElement("svg", {
      viewBox: "0 0 21 21",
      width: "100",
      height: "100",
      style: { background: "transparent", transition: "all 0.3s ease" }
    }, rects);
  }

  return React.createElement("div", { className: "ticket-modal-overlay", onClick: onClose },
    React.createElement("div", {
      className: "ticket-modal-content",
      onClick: function (e) { e.stopPropagation(); }
    },
      React.createElement("button", { className: "ticket-close-btn", onClick: onClose }, "✕"),
      React.createElement("div", { className: "ticket-modal-header" },
        React.createElement("h4", null, "🎟️ Interactive 3D Entry Pass"),
        React.createElement("p", null, "Tilt card with mouse. Click QR to simulate entry scan verification.")
      ),
      
      React.createElement("div", { className: "ticket-perspective-wrapper" },
        React.createElement("div", {
          ref: cardRef,
          className: "ticket-3d-card" + (scanned ? " ticket-scanned" : ""),
          style: cardStyle,
          onMouseMove: handleMouseMove,
          onMouseLeave: handleMouseLeave,
          onClick: function () { setScanned(!scanned); }
        },
          /* Main Ticket body */
          React.createElement("div", { className: "ticket-3d-main" },
            React.createElement("div", { className: "ticket-logo" }, "CINEBOOK ENTRY PASS"),
            React.createElement("div", { className: "ticket-movie-title" }, title),
            
            React.createElement("div", { className: "ticket-meta-grid" },
              React.createElement("div", null,
                React.createElement("div", { className: "ticket-meta-label" }, "THEATRE"),
                React.createElement("div", { className: "ticket-meta-val" }, theatre)
              ),
              React.createElement("div", null,
                React.createElement("div", { className: "ticket-meta-label" }, "CITY"),
                React.createElement("div", { className: "ticket-meta-val" }, district)
              ),
              React.createElement("div", null,
                React.createElement("div", { className: "ticket-meta-label" }, "EXPERIENCE"),
                React.createElement("span", { 
                  className: "ticket-screen-badge", 
                  style: { backgroundColor: screenColor, display: "inline-block", padding: "2px 8px", borderRadius: "980px", color: "#fff", fontSize: "0.65rem", fontWeight: "700", textTransform: "uppercase" } 
                }, screenName)
              ),
              React.createElement("div", null,
                React.createElement("div", { className: "ticket-meta-label" }, "SHOWTIME"),
                React.createElement("div", { className: "ticket-meta-val" }, showtime)
              ),
              React.createElement("div", null,
                React.createElement("div", { className: "ticket-meta-label" }, "DATE"),
                React.createElement("div", { className: "ticket-meta-val" }, dateStr)
              ),
              React.createElement("div", null,
                React.createElement("div", { className: "ticket-meta-label" }, "SEATS"),
                React.createElement("div", { className: "ticket-meta-val" }, seats)
              )
            ),
            
            React.createElement("div", { className: "ticket-barcode-wrap" },
              React.createElement("div", { className: "ticket-barcode" }),
              React.createElement("div", { className: "ticket-id-display" }, tid)
            )
          ),
          
          /* Dotted line divider */
          React.createElement("div", { className: "ticket-dotted-line" },
            React.createElement("div", { className: "ticket-notch top" }),
            React.createElement("div", { className: "ticket-notch bottom" })
          ),
          
          /* Ticket stub */
          React.createElement("div", { className: "ticket-3d-stub" },
            React.createElement("div", { className: "ticket-qr-container" },
              renderSvgQrCode(tid)
            ),
            React.createElement("div", { className: "ticket-stub-details" },
              React.createElement("div", { className: "ticket-meta-label" }, "PRICE"),
              React.createElement("div", { className: "ticket-price-val" }, "₹" + total.toFixed(2)),
              React.createElement("div", { className: "ticket-scan-status" }, 
                scanned ? "🟢 VERIFIED" : "👉 CLICK QR"
              )
            )
          )
        )
      )
    )
  );
}

function MyBookings() {
  var ctx = useBooking();
  var localBookings = ctx.bookings;
  var javaBookings = [];
  try {
    var jb = JSON.parse(localStorage.getItem("javaBookings") || "[]");
    javaBookings = jb;
  } catch (e) {}

  var allBookings = localBookings.concat(javaBookings);
  allBookings.sort(function (a, b) { return b.id - a.id; });

  var activeTicketState = React.useState(null);
  var activeTicket = activeTicketState[0], setActiveTicket = activeTicketState[1];

  return React.createElement("div", { className: "my-bookings" },
    React.createElement("h2", null, "My Bookings"),
    allBookings.length === 0
      ? React.createElement("p", { className: "no-bookings" }, "No bookings yet. Book your first movie!")
      : React.createElement("div", { className: "bookings-list" }, allBookings.map(function (b) {
          return React.createElement("div", { 
            key: b.id, 
            className: "booking-card",
            onClick: function() { setActiveTicket(b); }
          },
            React.createElement("div", { className: "booking-header" },
              React.createElement("h3", null, (b.movie && b.movie.title) || (typeof b.movie === 'string' ? b.movie : "Movie")),
              React.createElement("span", { className: "booking-date" }, b.date || "")
            ),
            React.createElement("div", { className: "booking-details" },
              b.theatre && React.createElement("p", null, b.theatre + " \u00b7 " + (b.district || "")),
              b.screen && React.createElement("div", { style: { display: "flex", alignItems: "center", gap: "6px", marginBottom: "6px" } },
                React.createElement("span", { className: "ticket-screen-badge", style: { backgroundColor: b.screen.color } }, b.screen.name)
              ),
              React.createElement("p", null, (b.showtime || "")),
              React.createElement("p", null, "Seats: " + ((b.seats && b.seats.join(", ")) || "")),
              React.createElement("p", null, (b.paymentMethod || "Counter")),
              b.cardInfo && React.createElement("p", null, "Card: " + b.cardInfo),
              React.createElement("p", { className: "booking-total" }, "\u20B9" + ((b.total && b.total.toFixed(2)) || "0.00"))
            )
          );
        })),
    activeTicket && React.createElement(Ticket3D, { 
      booking: activeTicket, 
      onClose: function() { setActiveTicket(null); } 
    })
  );
}
