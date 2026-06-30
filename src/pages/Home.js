function Home() {
  var searchState = React.useState("");
  var search = searchState[0], setSearch = searchState[1];
  var genreState = React.useState("All");
  var genre = genreState[0], setGenre = genreState[1];
  var districtState = React.useState("All");
  var district = districtState[0], setDistrict = districtState[1];
  var langState = React.useState("All");
  var lang = langState[0], setLang = langState[1];

  var allMovies = MOVIES.slice();
  try {
    var userMovies = JSON.parse(localStorage.getItem("userMovies") || "[]");
    allMovies = allMovies.concat(userMovies);
  } catch (e) {}

  var genres = ["All"];
  var languages = ["All"];
  allMovies.forEach(function (m) {
    if (genres.indexOf(m.genre) === -1) genres.push(m.genre);
    if (languages.indexOf(m.language) === -1) languages.push(m.language);
  });

  var filtered = allMovies.filter(function (m) {
    var ms = m.title.toLowerCase().indexOf(search.toLowerCase()) !== -1;
    var mg = genre === "All" || m.genre === genre;
    var ml = lang === "All" || m.language === lang;
    var md = district === "All" || (m.districts && m.districts.indexOf(district) !== -1);
    return ms && mg && ml && md;
  });

  return React.createElement("div", { className: "home-page" },
    React.createElement("div", { className: "hero" },
      React.createElement("h1", null, "Book Your Movie Tickets"),
      React.createElement("p", null, "Browse the latest movies across Andhra Pradesh & Telangana districts")
    ),
    React.createElement("div", { className: "filters" },
      React.createElement("input", { className: "search-input", placeholder: "Search movies...", value: search, onChange: function (e) { setSearch(e.target.value); } }),
      React.createElement("select", { className: "genre-select", value: genre, onChange: function (e) { setGenre(e.target.value); } }, genres.map(function (g) { return React.createElement("option", { key: g, value: g }, g); })),
      React.createElement("select", { className: "district-select", value: district, onChange: function (e) { setDistrict(e.target.value); } },
        [["All", "All Districts"]].concat(DISTRICTS.map(function (d) { return [d, d]; })).map(function (pair) { return React.createElement("option", { key: pair[0], value: pair[0] }, pair[1]); })
      ),
      React.createElement("select", { className: "lang-select", value: lang, onChange: function (e) { setLang(e.target.value); } }, languages.map(function (l) { return React.createElement("option", { key: l, value: l }, l); }))
    ),
    filtered.length === 0
      ? React.createElement("p", { className: "no-results" }, "No movies found. Try a different search or filter.")
      : React.createElement("div", { className: "movies-grid" }, filtered.map(function (m) { return React.createElement(MovieCard, { key: m.id, movie: m }); }))
  );
}
