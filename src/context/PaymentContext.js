var PaymentCtx = React.createContext();

function PaymentProvider(props) {
  var methodState = React.useState(null);
  var paymentMethod = methodState[0], setPaymentMethod = methodState[1];
  var cardState = React.useState(null);
  var selectedCard = cardState[0], setSelectedCard = cardState[1];
  var otpState = React.useState({ verified: false, attempts: 0, otp: "" });
  var otpStatus = otpState[0], setOtpStatus = otpState[1];
  var transState = React.useState(null);
  var transactionId = transState[0], setTransactionId = transState[1];

  function generateOtp() {
    return String(Math.floor(100000 + Math.random() * 900000));
  }

  function resetPayment() {
    setPaymentMethod(null);
    setSelectedCard(null);
    setOtpStatus({ verified: false, attempts: 0, otp: "" });
    setTransactionId(null);
  }

  var value = {
    paymentMethod: paymentMethod, setPaymentMethod: setPaymentMethod,
    selectedCard: selectedCard, setSelectedCard: setSelectedCard,
    otpStatus: otpStatus, setOtpStatus: setOtpStatus,
    transactionId: transactionId, setTransactionId: setTransactionId,
    generateOtp: generateOtp,
    resetPayment: resetPayment,
  };

  return React.createElement(PaymentCtx.Provider, { value: value }, props.children);
}

function usePayment() {
  return React.useContext(PaymentCtx);
}
