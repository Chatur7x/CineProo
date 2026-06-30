function App() {
  var routeState = React.useState(window.location.hash || "#/");
  var route = routeState[0], setRoute = routeState[1];

  React.useEffect(function () {
    function handler() { setRoute(window.location.hash || "#/"); }
    window.addEventListener("hashchange", handler);
    return function () { window.removeEventListener("hashchange", handler); };
  }, []);

  var match = route.match(/^#\/movie\/(\d+)$/);
  var page;

  if (route === "#/" || route === "") {
    page = React.createElement(Home, null);
  } else if (match) {
    page = React.createElement(MovieDetail, { id: match[1] });
  } else if (route === "#/booking") {
    page = React.createElement(BookingPage, null);
  } else if (route === "#/confirm") {
    page = React.createElement(ConfirmPage, null);
  } else if (route === "#/payment") {
    page = React.createElement(Payment, null);
  } else if (route === "#/card-form") {
    page = React.createElement('div', { id: 'vue-card-form-root' });
  } else if (route === "#/otp") {
    page = React.createElement(OtpVerify, null);
  } else if (route === "#/payment-done") {
    page = React.createElement(PaymentDone, null);
  } else if (route === "#/my-bookings") {
    page = React.createElement(MyBookings, null);
  } else if (route === "#/add-movie") {
    page = React.createElement(AdminMovie, null);
  } else if (route === "#/python-audit") {
    page = React.createElement(PythonAudit, null);
  } else if (route === "#/java-checker") {
    page = React.createElement('div', { id: 'vue-java-checker-root' });
  } else {
    page = React.createElement(Home, null);
  }

  return React.createElement(React.Fragment, null,
    React.createElement(Navbar, null),
    page
  );
}
