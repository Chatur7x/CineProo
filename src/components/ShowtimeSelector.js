function ShowtimeSelector(props) {
  var ctx = useBooking();
  var showtimes = props.showtimes;
  return React.createElement("div", { className: "showtime-selector" },
    React.createElement("h3", null, "Select Showtime"),
    React.createElement("div", { className: "showtime-buttons" },
      showtimes.map(function (time) {
        return React.createElement("button", {
          key: time,
          className: "showtime-btn" + (ctx.selectedShowtime === time ? " active" : ""),
          onClick: function () { ctx.setSelectedShowtime(time); }
        }, time);
      })
    )
  );
}
