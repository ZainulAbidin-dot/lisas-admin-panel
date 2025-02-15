import {
  PaymentElement,
  useElements,
  useStripe,
} from '@stripe/react-stripe-js';

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();

  const CLIENT_URL = process.env.VITE_CLIENT_URL;
  if (!CLIENT_URL)
    return <div>Please add client url to env. use port forwarding</div>;

  interface ConfirmPaymentResult {
    error?: {
      message?: string;
    };
  }

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    // We don't want to let default form submission happen here,
    // which would refresh the page.
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js hasn't yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    const result: ConfirmPaymentResult = await stripe.confirmPayment({
      //`Elements` instance that was used to create the Payment Element
      elements,
      confirmParams: {
        return_url: CLIENT_URL,
      },
    });

    if (result.error) {
      // Show error to your customer (for example, payment details incomplete)
      console.log(result.error.message);
    } else {
      // Your customer will be redirected to your `return_url`. For some payment
      // methods like iDEAL, your customer will be redirected to an intermediate
      // site first to authorize the payment, then redirected to the `return_url`.
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      <button
        className=" bg-orange-500 text-white p-3 rounded-none font-bold text-lg hover:bg-orange-600"
        disabled={!stripe || !elements}
      >
        Claim My Membership for $99 Now!
      </button>
    </form>
  );
};

export default CheckoutForm;
