var root = ReactDOM.createRoot(document.getElementById("root"));
root.render(React.createElement(PaymentProvider, null,
  React.createElement(BookingProvider, null,
    React.createElement(App, null)
  )
));
