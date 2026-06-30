function MovieCard(props) {
  var movie = props.movie;
  return React.createElement("div", { className: "movie-card", onClick: function () { window.location.hash = "#/movie/" + movie.id; } },
    React.createElement("div", { className: "movie-card-poster" },
      React.createElement("img", {
        src: movie.poster,
        alt: movie.title,
        onError: function (e) {
          e.target.onerror = null;
          e.target.src = "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='220' height='300'><rect fill='%23333' width='220' height='300'/><text fill='%23999' font-size='14' text-anchor='middle' x='110' y='150'>No Poster</text></svg>";
        }
      })
    ),
    React.createElement("div", { className: "movie-card-info" },
      React.createElement("h3", null, movie.title),
      movie.language && React.createElement("span", { className: "movie-lang" }, movie.language),
      React.createElement("span", { className: "movie-genre" }, movie.genre),
      React.createElement("span", { className: "movie-rating" }, "\u2B50 " + movie.rating + "/10")
    )
  );
}
