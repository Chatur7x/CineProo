var BookingCtx = React.createContext();

function BookingProvider(props) {
  var state = React.useState(null);
  var selectedMovie = state[0], setSelectedMovie = state[1];
  var timeState = React.useState("");
  var selectedShowtime = timeState[0], setSelectedShowtime = timeState[1];
  var seatsState = React.useState([]);
  var selectedSeats = seatsState[0], setSelectedSeats = seatsState[1];
  var bookingsState = React.useState([]);
  var bookings = bookingsState[0], setBookings = bookingsState[1];
  var genState = React.useState(function () { return generateSeats(); });
  var seats = genState[0], setSeats = genState[1];
  var theatreState = React.useState("");
  var selectedTheatre = theatreState[0], setSelectedTheatre = theatreState[1];
  var districtState = React.useState("");
  var selectedDistrict = districtState[0], setSelectedDistrict = districtState[1];
  var screenState = React.useState(null);
  var selectedScreen = screenState[0], setSelectedScreen = screenState[1];
  var screenNumState = React.useState(null);
  var selectedScreenNumber = screenNumState[0], setSelectedScreenNumber = screenNumState[1];

  function confirmBooking() {
    var pricePerSeat = selectedScreen ? getScreenPrice(selectedScreen) : PRICE_PER_SEAT;
    var taxPerSeat = selectedScreen ? getScreenTax(selectedScreen) : TAX_PER_SEAT;
    var subtotal = selectedSeats.length * pricePerSeat;
    var tax = selectedSeats.length * taxPerSeat;
    var booking = {
      id: Date.now(),
      movie: selectedMovie,
      showtime: selectedShowtime,
      theatre: selectedTheatre,
      district: selectedDistrict,
      screen: selectedScreen,
      screenNumber: selectedScreenNumber,
      seats: selectedSeats.slice(),
      subtotal: subtotal,
      tax: tax,
      total: subtotal + tax,
      date: new Date().toLocaleDateString(),
    };
    setBookings(function (prev) { return prev.concat([booking]); });
    setSeats(function (prev) {
      return prev.map(function (s) {
        return selectedSeats.indexOf(s.id) !== -1 ? { id: s.id, row: s.row, number: s.number, status: "booked" } : s;
      });
    });
    setSelectedSeats([]);
    setSelectedShowtime("");
    setSelectedTheatre("");
    setSelectedDistrict("");
    setSelectedScreen(null);
    setSelectedScreenNumber(null);
  }

  var value = {
    selectedMovie: selectedMovie, setSelectedMovie: setSelectedMovie,
    selectedShowtime: selectedShowtime, setSelectedShowtime: setSelectedShowtime,
    selectedSeats: selectedSeats, setSelectedSeats: setSelectedSeats,
    bookings: bookings, setBookings: setBookings,
    seats: seats, setSeats: setSeats,
    selectedTheatre: selectedTheatre, setSelectedTheatre: setSelectedTheatre,
    selectedDistrict: selectedDistrict, setSelectedDistrict: setSelectedDistrict,
    selectedScreen: selectedScreen, setSelectedScreen: setSelectedScreen,
    selectedScreenNumber: selectedScreenNumber, setSelectedScreenNumber: setSelectedScreenNumber,
    confirmBooking: confirmBooking,
    PRICE_PER_SEAT: PRICE_PER_SEAT,
    TAX_PER_SEAT: TAX_PER_SEAT,
  };

  return React.createElement(BookingCtx.Provider, { value: value }, props.children);
}

function useBooking() {
  return React.useContext(BookingCtx);
}
