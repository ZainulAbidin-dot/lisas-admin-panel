import { useEffect, useState } from 'react';

import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import type { Stripe } from '@stripe/stripe-js';

import useAxiosPrivate from '@/auth/_hooks/use-axios-private.ts';

import stripe from '../../assets/images/stripe.jpg';
import CheckoutForm from './checkout-form.tsx';

const STRIPE_PUBLISHABLE_KEY = process.env.VITE_STRIPE_PUBLISHABLE_KEY!;

const Checkout = () => {
  const [clientSecret, setClientSecret] = useState('');
  const [stripePromise, setStripePromise] =
    useState<Promise<Stripe | null> | null>(null);

  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    setStripePromise(loadStripe(STRIPE_PUBLISHABLE_KEY));
  }, []);

  useEffect(() => {
    const abortController = new AbortController();
    axiosPrivate
      .post('/stripe/create-payment-intent', {
        priceId: 'monthly',
        abortController: abortController,
      })
      .then((response) => {
        console.log(response.data);
        const { clientSecret } = response.data.data;
        setClientSecret(clientSecret);
      })
      .catch((error) => {
        console.log(error);
      });
    return () => {
      abortController.abort();
    };
  }, [axiosPrivate]);

  const [timeLeft, setTimeLeft] = useState({
    days: 3,
    hours: 22,
    minutes: 29,
    seconds: 57,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        const newTime = { ...prev };
        if (newTime.seconds > 0) newTime.seconds--;
        else {
          newTime.seconds = 59;
          if (newTime.minutes > 0) newTime.minutes--;
          else {
            newTime.minutes = 59;
            if (newTime.hours > 0) newTime.hours--;
            else {
              newTime.hours = 23;
              if (newTime.days > 0) newTime.days--;
            }
          }
        }
        return { ...newTime };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-[fit-content] flex flex-col md:flex-row justify-center px-6 py-8 bg-gray-100">
      {/* Left Side - Form */}
      <div className="w-full md:w-1/2">
        <h2 className="text-2xl font-bold text-gray-800 mb-10">
          Connect with a new friend or your money back
        </h2>

        <div className="flex justify-start items-center gap-3">
          <div className="w-1/2 mb-4">
            <label className="block text-gray-600 text-sm font-bold">
              Name on Card
            </label>
            <input
              type="text"
              placeholder="E.g. John Doe"
              className="w-full p-2 border rounded-md"
            />
          </div>

          <div className="w-1/2 mb-4">
            <label className="block text-gray-600 text-sm font-bold">
              Email Address
            </label>
            <input
              type="email"
              placeholder="E.g. john@doe.com"
              className="w-full p-2 border rounded-md"
            />
          </div>
        </div>

        <label className="mb-2 block text-gray-600 text-sm font-bold mt-4">
          Credit / Debit Card *
        </label>
        <div className="flex flex-col md:flex-row justify-start items-center gap-3">
          <div className="mb-4 w-full md:flex-grow-2">
            {clientSecret && stripePromise && (
              <Elements stripe={stripePromise} options={{ clientSecret }}>
                <CheckoutForm />
              </Elements>
            )}
          </div>
        </div>

        <div className="my-8 flex justify-start space-x-4">
          <img src={stripe} alt="Visa" className="" />
        </div>
      </div>

      {/* Right Side - Timer & Benefits */}
      <div className="w-full md:w-1/2 px-6 text-center">
        <div className="flex justify-center space-x-2 text-lg font-bold text-white bg-black px-4 py-2 rounded-lg">
          <span>{String(timeLeft.days).padStart(2, '0')} DAYS</span>
          <span>{String(timeLeft.hours).padStart(2, '0')} HRS</span>
          <span>{String(timeLeft.minutes).padStart(2, '0')} MINS</span>
          <span>{String(timeLeft.seconds).padStart(2, '0')} SECS</span>
        </div>

        <h3 className="my-12 text-xl font-bold text-gray-700">
          Why You Should Complete Your Payment Now:
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col items-center gap-3">
            <div>✅</div>
            <div>
              <strong>Access to 10,000+ People</strong>
            </div>
            <div>
              Connect with incredible individuals instantly. Your information is
              stored securely and can be deleted anytime. If you don’t connect,
              we refund your money.
            </div>
          </div>
          <div className="flex flex-col items-center gap-3">
            <div>✅</div>
            <div>
              <strong>Secure & Private</strong>
            </div>
            <div>
              Connect with incredible individuals instantly. Your information is
              stored securely and can be deleted anytime. If you don’t connect,
              we refund your money.
            </div>
          </div>
          <div className="flex flex-col items-center gap-3">
            <div>✅</div>
            <div>
              <strong>Connect with Like-minded People</strong>
            </div>
            <div>
              Connect with incredible individuals instantly. Your information is
              stored securely and can be deleted anytime. If you don’t connect,
              we refund your money.
            </div>
          </div>
          <div className="flex flex-col items-center gap-3">
            <div>✅</div>
            <div>
              <strong>Money-Back Guarantee</strong>
            </div>
            <div>
              Connect with incredible individuals instantly. Your information is
              stored securely and can be deleted anytime. If you don’t connect,
              we refund your money.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
