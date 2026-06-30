function MovieDetail(props) {
  var movie = null;
  var allMovies = MOVIES.slice();
  try { var u = JSON.parse(localStorage.getItem("userMovies") || "[]"); allMovies = allMovies.concat(u); } catch (e) {}
  for (var i = 0; i < allMovies.length; i++) { if (String(allMovies[i].id) === props.id) { movie = allMovies[i]; break; } }

  if (!movie) {
    return React.createElement("div", { className: "movie-detail" }, React.createElement("p", null, "Movie not found."));
  }

  var ctx = useBooking();
  var selectedDistrictState = React.useState("");
  var selDistrict = selectedDistrictState[0], setSelDistrict = selectedDistrictState[1];
  var selectedTheatreState = React.useState("");
  var selTheatre = selectedTheatreState[0], setSelTheatre = selectedTheatreState[1];
  var selectedScreenState = React.useState(null);
  var selScreen = selectedScreenState[0], setSelScreen = selectedScreenState[1];
  var selectedShowtimeState = React.useState("");
  var selShowtime = selectedShowtimeState[0], setSelShowtime = selectedShowtimeState[1];
  var selectedScreenNumState = React.useState(null);
  var selScreenNum = selectedScreenNumState[0], setSelScreenNum = selectedScreenNumState[1];
  // Generate random screen numbers once per theatre+screen combo
  var screenNumbersRef = React.useRef(null);

  function selectDistrict(d) {
    setSelDistrict(d);
    setSelTheatre("");
    setSelScreen(null);
    setSelShowtime("");
    setSelScreenNum(null);
    screenNumbersRef.current = null;
  }

  function selectTheatre(t) {
    setSelTheatre(t);
    setSelScreen(null);
    setSelShowtime("");
    setSelScreenNum(null);
    screenNumbersRef.current = null;
  }

  function selectScreen(scr) {
    setSelScreen(scr);
    setSelShowtime("");
    setSelScreenNum(null);
    // Generate random screen numbers for this theatre+screen
    var hash = 0;
    var key = selTheatre + scr.id;
    for (var i = 0; i < key.length; i++) {
      hash = ((hash << 5) - hash) + key.charCodeAt(i);
      hash = hash & hash;
    }
    hash = Math.abs(hash);
    var numScreens = 2 + (hash % 4); // 2 to 5 screens
    var screens = [];
    for (var j = 0; j < numScreens; j++) {
      screens.push({
        number: j + 1,
        label: scr.name + " - Screen " + (j + 1),
        capacity: [120, 180, 250, 320, 150, 200][(hash + j) % 6],
        aisle: ["Left", "Center", "Right"][(hash + j) % 3]
      });
    }
    screenNumbersRef.current = screens;
  }

  function selectScreenNum(num) {
    setSelScreenNum(num);
    setSelShowtime("");
  }

  function bookNow() {
    if (!selShowtime || !selScreen || !selTheatre || !selDistrict || !selScreenNum) return;
    ctx.setSelectedMovie(movie);
    ctx.setSelectedShowtime(selShowtime);
    ctx.setSelectedTheatre(selTheatre);
    ctx.setSelectedDistrict(selDistrict);
    ctx.setSelectedScreen(selScreen);
    ctx.setSelectedScreenNumber(selScreenNum);
    window.location.hash = "#/booking";
  }

  var districts = movie.districts || [];

  return React.createElement("div", { className: "movie-detail" },
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
        marginBottom: "24px",
        padding: "0" 
      },
      onClick: function() { 
        window.location.hash = "#/"; 
      }
    }, "\u2039 Back"),
    React.createElement("div", { className: "movie-detail-header" },
      React.createElement("img", { className: "movie-detail-poster", src: movie.poster, alt: movie.title, onError: function (e) { e.target.style.display = "none"; } }),
      React.createElement("div", { className: "movie-detail-info" },
        React.createElement("h1", null, movie.title),
        React.createElement("p", { className: "movie-meta" }, movie.genre + " \u00b7 " + (movie.language || "Telugu") + " \u00b7 " + movie.rating + "/10"),
        React.createElement("p", { className: "movie-description" }, movie.description)
      )
    ),

    // Step 1: Select District
    districts.length > 0 && React.createElement("div", { className: "screen-selection-section" },
      React.createElement("h2", null, "Select Your District"),
      React.createElement("div", { className: "showtime-grid" },
        districts.map(function (d) {
          return React.createElement("button", {
            key: d,
            className: "showtime-chip" + (selDistrict === d ? " selected" : ""),
            onClick: function () { selectDistrict(d); }
          }, d);
        })
      )
    ),

    // Step 2: Select Theatre
    selDistrict && React.createElement("div", { className: "screen-selection-section" },
      React.createElement("h2", null, "Select Theatre in " + selDistrict),
      React.createElement("div", { className: "theatre-screen-cards" },
        ((movie.theatres && movie.theatres[selDistrict]) || []).map(function (theatreName) {
          var screens = getTheatreScreens(theatreName);
          var isSelected = selTheatre === theatreName;
          return React.createElement("div", {
            key: theatreName,
            className: "theatre-screen-card" + (isSelected ? " selected" : ""),
            style: isSelected ? { borderColor: "var(--primary)", background: "rgba(10, 132, 255, 0.03)" } : {}
          },
            React.createElement("h3", null,
              theatreName,
              React.createElement("span", { className: "theatre-district-tag" }, selDistrict)
            ),
            React.createElement("div", { style: { fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "8px" } },
              "Available screens: " + screens.map(function (s) { return s.icon + " " + s.name; }).join("  \u2022  ")
            ),
            React.createElement("button", {
              className: "showtime-chip" + (isSelected ? " selected" : ""),
              onClick: function () { selectTheatre(theatreName); },
              style: { marginTop: "4px" }
            }, isSelected ? "\u2713 Selected" : "Select This Theatre")
          );
        })
      )
    ),

    // Step 3: Select Screen Experience
    selTheatre && React.createElement("div", { className: "screen-selection-section" },
      React.createElement("h2", null, "Choose Screen Experience"),
      React.createElement("div", { className: "screen-chips" },
        getTheatreScreens(selTheatre).map(function (scr) {
          var price = getScreenPrice(scr);
          var isSelected = selScreen && selScreen.id === scr.id;
          return React.createElement("div", {
            key: scr.id,
            className: "screen-chip" + (isSelected ? " selected" : ""),
            onClick: function () { selectScreen(scr); }
          },
            scr.priceMultiplier >= 2.0 && React.createElement("span", {
              className: "screen-chip-badge",
              style: { backgroundColor: scr.color }
            }, "Premium"),
            React.createElement("span", { className: "screen-chip-icon" }, scr.icon),
            React.createElement("span", { className: "screen-chip-name", style: { color: scr.color } }, scr.name),
            React.createElement("span", { className: "screen-chip-price" }, "\u20B9" + price + "/seat")
          );
        })
      )
    ),

    // Step 4: Pick Screen Number
    selScreen && screenNumbersRef.current && React.createElement("div", { className: "screen-selection-section" },
      React.createElement("h2", null, "Pick a Screen"),
      React.createElement("div", { className: "screen-number-grid" },
        screenNumbersRef.current.map(function (sn) {
          var isSelected = selScreenNum && selScreenNum.number === sn.number;
          return React.createElement("div", {
            key: sn.number,
            className: "screen-number-card" + (isSelected ? " selected" : ""),
            onClick: function () { selectScreenNum(sn); }
          },
            React.createElement("div", { className: "screen-number-icon" }, selScreen.icon),
            React.createElement("div", { className: "screen-number-label" }, sn.label),
            React.createElement("div", { className: "screen-number-meta" },
              React.createElement("span", null, sn.capacity + " seats"),
              React.createElement("span", null, "\u2022"),
              React.createElement("span", null, sn.aisle + " Aisle")
            ),
            isSelected && React.createElement("div", { className: "screen-number-check" }, "\u2713")
          );
        })
      )
    ),

    // Step 5: Select Showtime
    selScreenNum && React.createElement("div", { className: "screen-selection-section" },
      React.createElement("h2", null, "Pick a Showtime"),
      React.createElement("div", { className: "showtime-grid" },
        movie.showtimes.map(function (st) {
          return React.createElement("button", {
            key: st,
            className: "showtime-chip" + (selShowtime === st ? " selected" : ""),
            onClick: function () { setSelShowtime(st); }
          }, st);
        })
      )
    ),

    // Book Button
    selShowtime && React.createElement("div", { className: "screen-selection-section", style: { textAlign: "center" } },
      React.createElement("div", { className: "booking-screen-info" },
        React.createElement("span", null, selTheatre),
        React.createElement("span", { className: "booking-screen-badge", style: { backgroundColor: selScreen.color } }, selScreen.name),
        React.createElement("span", null, selScreenNum.label),
        React.createElement("span", null, selShowtime),
        React.createElement("span", { className: "booking-screen-price" }, "\u20B9" + getScreenPrice(selScreen) + "/seat")
      ),
      React.createElement("button", {
        className: "btn-primary",
        onClick: bookNow,
        style: { padding: "14px 48px", fontSize: "1.1rem", borderRadius: "10px", background: "var(--primary)", color: "#fff", border: "none", cursor: "pointer", fontWeight: "700" }
      }, "Select Seats \u2192")
    ),

    // District Ratings Table
    movie.districts && React.createElement("div", { className: "screen-selection-section" },
      React.createElement("h2", null, "District Ratings"),
      React.createElement("div", { className: "vue-ratings-table" },
        React.createElement("table", { className: "ratings-table" },
          React.createElement("thead", null, React.createElement("tr", null,
            React.createElement("th", null, "District"),
            React.createElement("th", null, "Rating"),
            React.createElement("th", null, "Stars")
          )),
          React.createElement("tbody", null, movie.districts.map(function (d) {
            var r = movie.ratingsByDistrict && movie.ratingsByDistrict[d] || movie.rating;
            var stars = "";
            for (var s = 0; s < Math.round(r); s++) stars += "\u2605";
            return React.createElement("tr", { key: d },
              React.createElement("td", null, d),
              React.createElement("td", null, r),
              React.createElement("td", null, stars)
            );
          }))
        )
      )
    )
  );
}
