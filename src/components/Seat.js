function Seat(props) {
  var seat = props.seat;
  var isSelected = props.isSelected;
  var onSelect = props.onSelect;
  var cls = "seat " + (seat.status === "booked" ? "booked" : isSelected ? "selected" : "available");
  return React.createElement("div", {
    className: cls,
    onClick: function () { if (seat.status !== "booked") onSelect(seat.id); },
    title: seat.id
  }, seat.number);
}
