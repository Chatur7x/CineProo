function AdminMovie() {
  var formState = React.useState({ title: "", genre: "Action", language: "Telugu", rating: "8.0", poster: "", description: "" });
  var form = formState[0], setForm = formState[1];
  var districtState = React.useState({});
  var districtSelections = districtState[0], setDistrictSelections = districtState[1];
  var theatreState = React.useState({});
  var theatreData = theatreState[0], setTheatreData = theatreState[1];
  var showtimeState = React.useState([]);
  var showtimes = showtimeState[0], setShowtimes = showtimeState[1];
  var msgState = React.useState("");
  var msg = msgState[0], setMsg = msgState[1];

  function updateForm(field, value) {
    var f = {};
    for (var k in form) if (form.hasOwnProperty(k)) f[k] = form[k];
    f[field] = value;
    setForm(f);
  }

  function toggleDistrict(d) {
    var ds = {};
    for (var k in districtSelections) if (districtSelections.hasOwnProperty(k)) ds[k] = districtSelections[k];
    ds[d] = !ds[d];
    setDistrictSelections(ds);
    if (!ds[d]) {
      var td = {};
      for (var k2 in theatreData) if (theatreData.hasOwnProperty(k2)) td[k2] = theatreData[k2];
      delete td[d];
      setTheatreData(td);
    }
  }

  function updateTheatreData(district, val) {
    var td = {};
    for (var k in theatreData) if (theatreData.hasOwnProperty(k)) td[k] = theatreData[k];
    td[district] = val;
    setTheatreData(td);
  }

  function addShowtime() {
    setShowtimes(showtimes.concat([""]));
  }

  function updateShowtime(idx, val) {
    var st = showtimes.slice();
    st[idx] = val;
    setShowtimes(st);
  }

  function removeShowtime(idx) {
    var st = showtimes.slice();
    st.splice(idx, 1);
    setShowtimes(st);
  }

  function addMovie() {
    if (!form.title || !form.poster) {
      setMsg("Please fill Title and Poster URL at minimum.");
      return;
    }
    var selectedDistricts = [];
    for (var d in districtSelections) {
      if (districtSelections.hasOwnProperty(d) && districtSelections[d]) selectedDistricts.push(d);
    }
    if (selectedDistricts.length === 0) {
      setMsg("Please select at least one district.");
      return;
    }
    var theatres = {};
    var ratings = {};
    for (var i = 0; i < selectedDistricts.length; i++) {
      var di = selectedDistricts[i];
      theatres[di] = theatreData[di] ? theatreData[di].split(",").map(function (s) { return s.trim(); }).filter(function (s) { return s; }) : [];
      ratings[di] = parseFloat(form.rating) || 8.0;
    }
    var validShowtimes = showtimes.filter(function (s) { return s.trim(); });

    var newMovie = {
      id: Date.now(),
      title: form.title,
      genre: form.genre,
      language: form.language,
      rating: parseFloat(form.rating) || 8.0,
      poster: form.poster,
      description: form.description,
      districts: selectedDistricts,
      theatres: theatres,
      ratingsByDistrict: ratings,
      showtimes: validShowtimes.length > 0 ? validShowtimes : ["10:00 AM", "1:00 PM", "4:00 PM", "7:00 PM"]
    };
    try {
      var existing = JSON.parse(localStorage.getItem("userMovies") || "[]");
      existing.push(newMovie);
      localStorage.setItem("userMovies", JSON.stringify(existing));
      setMsg("Movie '" + form.title + "' added successfully! Go to Home to see it.");
      setForm({ title: "", genre: "Action", language: "Telugu", rating: "8.0", poster: "", description: "" });
      setDistrictSelections({});
      setTheatreData({});
      setShowtimes([]);
    } catch (e) {
      setMsg("Error saving movie: " + e.message);
    }
  }

  return React.createElement("div", { className: "admin-movie-page" },
    React.createElement("h2", null, "Add New Movie"),
    msg && React.createElement("p", { className: "admin-msg" }, msg),
    React.createElement("div", { className: "admin-form" },
      React.createElement("label", null, "Movie Title"),
      React.createElement("input", { value: form.title, onChange: function (e) { updateForm("title", e.target.value); }, placeholder: "e.g., Hanu-Man" }),
      React.createElement("label", null, "Genre"),
      React.createElement("select", { value: form.genre, onChange: function (e) { updateForm("genre", e.target.value); } }, ["Action", "Sci-Fi", "Sports", "Thriller", "Comedy", "Crime", "Drama", "Romance"].map(function (g) { return React.createElement("option", { key: g, value: g }, g); })),
      React.createElement("label", null, "Language"),
      React.createElement("select", { value: form.language, onChange: function (e) { updateForm("language", e.target.value); } }, ["Telugu", "Tamil", "Hindi", "Kannada", "Malayalam", "English"].map(function (l) { return React.createElement("option", { key: l, value: l }, l); })),
      React.createElement("label", null, "Rating (0-10)"),
      React.createElement("input", { type: "number", min: "0", max: "10", step: "0.1", value: form.rating, onChange: function (e) { updateForm("rating", e.target.value); } }),
      React.createElement("label", null, "Poster URL"),
      React.createElement("input", { value: form.poster, onChange: function (e) { updateForm("poster", e.target.value); }, placeholder: "https://..." }),
      form.poster && React.createElement("img", { className: "poster-preview", src: form.poster, alt: "Preview", onError: function (e) { e.target.style.display = "none"; } }),
      React.createElement("label", null, "Description"),
      React.createElement("textarea", { value: form.description, onChange: function (e) { updateForm("description", e.target.value); }, placeholder: "Movie description..." }),
      React.createElement("label", null, "Districts (select where this movie is playing)"),
      React.createElement("div", { className: "district-checkboxes" }, DISTRICTS.map(function (d) {
        return React.createElement("label", { key: d, className: "district-check-label" },
          React.createElement("input", { type: "checkbox", checked: !!districtSelections[d], onChange: function () { toggleDistrict(d); } }),
          d
        );
      })),
      Object.keys(districtSelections).filter(function (d) { return districtSelections[d]; }).length > 0 && React.createElement("div", { className: "district-theatre-inputs" },
        React.createElement("h4", null, "Theatres per District (comma-separated)"),
        Object.keys(districtSelections).filter(function (d) { return districtSelections[d]; }).map(function (d) {
          return React.createElement("div", { key: d, className: "theatre-input-row" },
            React.createElement("label", null, d),
            React.createElement("input", { value: theatreData[d] || "", onChange: function (e) { updateTheatreData(d, e.target.value); }, placeholder: "Theatre1, Theatre2, ..." })
          );
        })
      ),
      React.createElement("label", null, "Showtimes"),
      showtimes.map(function (st, i) {
        return React.createElement("div", { key: i, className: "showtime-input-row" },
          React.createElement("input", { value: st, onChange: function (e) { updateShowtime(i, e.target.value); }, placeholder: "e.g., 10:00 AM" }),
          React.createElement("button", { className: "btn-remove-st", onClick: function () { removeShowtime(i); } }, "X")
        );
      }),
      React.createElement("button", { className: "btn-add-st", onClick: addShowtime }, "+ Add Showtime"),
      React.createElement("button", { className: "btn-submit-movie", onClick: addMovie }, "Add Movie")
    )
  );
}
