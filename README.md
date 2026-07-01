# CineBook — Movie Ticket Booking System

```
               ┌────────────────────────────────────────────────────────┐
               │              CINEBOOK WEB FRAMEWORK                    │
               │         React SPA Host (Hash Route Navigation)         │
               └────────────────────────────────────────────────────────┘
```

```
 Home → Filters (District/Language/Search/Genre)
   ↓
 MovieDetail → Select District → Theatre → Experience → Screen → Showtime
   ↓
 Seat Map (3D curved screen, stepper, recommended seats)
   ↓
 Booking Confirm → Payment (Counter / Card) → OTP Verify
   ↓
 MyBookings (3D tickets, QR barcode, scan-to-verify)
```

## Algorithm: Optimal Seating Suggestion Engine

The seating layout identifies the "sweet spot" for audio-visual alignment (center columns 4–9, rows D–E):

```javascript
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
```
