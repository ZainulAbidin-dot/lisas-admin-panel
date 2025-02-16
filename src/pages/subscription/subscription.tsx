import { useEffect, useState } from 'react';

import { AxiosError } from 'axios';
import { toast } from 'sonner';

import useAxiosPrivate from '@/auth/_hooks/use-axios-private';
import { ButtonWithLoader } from '@/components/composed/button-with-loader';
import { useAuthStore } from '@/store/auth-store';

import image from '../../assets/images/image01.jpg';

export function Subscription() {
  const { timeLeft } = useCountdown();

  const { getCheckoutPage, waitingFor } = useSubscription();

  return (
    <div className="flex flex-col md:flex-row">
      <div className="w-full md:w-2/3">
        <img
          src={image}
          alt="Subscription Offer"
          className="w-full min-h-[100%]"
        />
      </div>

      <div className="min-h-screen flex flex-col items-center justify-center py-4 px-2 md:px-14">
        <h2 className="text-2xl text-center font-bold text-gray-800 mb-4">
          You've been selected for a 30% premium discount!
        </h2>

        {/* Countdown Timer */}
        <div className="flex space-x-2 text-lg font-bold text-white bg-black px-4 py-2 rounded-lg">
          <span>{String(timeLeft.days).padStart(2, '0')} DAYS</span>
          <span>{String(timeLeft.hours).padStart(2, '0')} HRS</span>
          <span>{String(timeLeft.minutes).padStart(2, '0')} MINS</span>
          <span>{String(timeLeft.seconds).padStart(2, '0')} SECS</span>
        </div>

        <p className="mt-4 font-bold text-xl text-center text-gray-600">
          See who likes you and match with them instantly with Lisa’s Friend.
        </p>

        {/* Subscription Plans */}
        <p className="mt-6 text-md font-bold">Select a plan</p>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <div className="text-center border-2 border-orange-500 rounded-md my-4 p-4">
              <h3 className="text-xl font-bold mb-2">Monthly</h3>
              <p className="text-gray-700 mb-2">$12/m</p>
            </div>
            <div className="border rounded-lg bg-white shadow-md">
              <ul className="text-gray-600 p-6 text-sm">
                <li>✔ Unlimited likes</li>
                <li>✔ See who Likes You</li>
                <li>✔ Unlimited Rewinds</li>
                <li>✔ 1 free Boost per month</li>
                <li>✔ 5 free Super Likes per week</li>
                <li>✔ Passport - Match & chat</li>
              </ul>
              <div className="flex justify-center">
                <ButtonWithLoader
                  variant="gradient"
                  isLoading={waitingFor === 'monthly'}
                  loadingText="Subscribing..."
                  initialText="Continue"
                  disabled={waitingFor !== null}
                  onClick={() => getCheckoutPage('monthly')}
                  className="w-full"
                >
                  Continue
                </ButtonWithLoader>
              </div>
              <ul className="text-gray-600 p-6 text-sm">
                <li>✔ 1 free Boost per month</li>
                <li>✔ 5 free Super Likes per week</li>
                <li>✔ Passport - Match & chat</li>
              </ul>
            </div>
          </div>

          <div>
            <div className="text-center border-2 border-orange-500 rounded-md my-4 p-4">
              <h3 className="text-xl font-bold mb-2">Yearly (Save 30%)</h3>
              <p className="text-gray-700 mb-2">$99/Year</p>
            </div>
            <div className="border rounded-lg bg-white shadow-md">
              <ul className="text-gray-600 p-6 text-sm">
                <li>✔ Unlimited likes</li>
                <li>✔ See who Likes You</li>
                <li>✔ Unlimited Rewinds</li>
                <li>✔ 1 free Boost per month</li>
                <li>✔ 5 free Super Likes per week</li>
                <li>✔ Passport - Match & chat</li>
              </ul>
              <div className="flex justify-center">
                <ButtonWithLoader
                  variant="gradient"
                  isLoading={waitingFor === 'yearly'}
                  loadingText="Subscribing..."
                  initialText="Continue"
                  disabled={waitingFor !== null}
                  onClick={() => getCheckoutPage('yearly')}
                  className="w-full"
                >
                  Continue
                </ButtonWithLoader>
              </div>
              <ul className="text-gray-600 p-6 text-sm">
                <li>✔ 1 free Boost per month</li>
                <li>✔ 5 free Super Likes per week</li>
                <li>✔ Passport - Match & chat</li>
              </ul>
            </div>
          </div>
        </div>

        <p className="mt-6 font-bold  text-xl text-center">
          Connect with a new friend or your money back.
        </p>
      </div>
    </div>
  );
}

function useCountdown() {
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

    return () => {
      clearInterval(timer);
    };
  }, []);

  return { timeLeft };
}

function useSubscription() {
  const axiosPrivate = useAxiosPrivate();
  const { clearToken } = useAuthStore();

  const [waitingFor, setWaitingFor] = useState<'monthly' | 'yearly' | null>(
    null
  );

  async function getCheckoutPage(priceId: 'monthly' | 'yearly') {
    if (waitingFor) return;
    try {
      setWaitingFor(priceId);

      const response = await axiosPrivate.post('/stripe/checkout', {
        priceId,
      });

      console.log('Checkout Response: ', response.data);

      const url = response.data.data.url;

      clearToken();

      window.location.href = url;
    } catch (error) {
      console.error('Login Error: ', error);
      const errorMessage =
        error instanceof AxiosError
          ? error?.response?.data?.message || error?.message || 'Unknown Error'
          : 'Unknown Error';
      toast.error(errorMessage);
    } finally {
      setWaitingFor(null);
    }
  }

  return { getCheckoutPage, waitingFor };
}
