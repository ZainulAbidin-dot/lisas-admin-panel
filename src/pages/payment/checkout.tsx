import { useEffect, useState } from 'react';

import { useNavigate } from 'react-router-dom';

import { useAuthStore } from '@/store/auth-store';

import stripe from '../../assets/images/stripe.jpg';

const Checkout = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 3,
    hours: 22,
    minutes: 29,
    seconds: 57,
  });
  const { setUserHasSubscription } = useAuthStore();
  const navigate = useNavigate();

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

  const handleClick = () => {
    setUserHasSubscription(true);
    navigate('/');
  };

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

        <label className="block text-gray-600 text-sm font-bold mt-4">
          Credit / Debit Card *
        </label>
        <div className="flex flex-col md:flex-row justify-start items-center gap-3">
          <div className="mb-4 w-full md:flex-grow-2">
            <label className="block text-gray-600 text-sm">Card Number</label>
            <div className="flex justify-start gap-2 bg-white p-2 border rounded-md">
              {Array.from({ length: 4 }).map((_, index) => (
          <input
            key={index}
            type="tel"
            maxLength={4}
            placeholder="1234"
            className="w-1/4 md:w-1/6 text-left outline-none"
            required
            pattern="[0-9]{4}"
            onInput={(e) => {
              const target = e.target as HTMLInputElement;
              if (
                target.value.length === 4 &&
                target.nextElementSibling
              ) {
                (target.nextElementSibling as HTMLInputElement).focus();
              }
            }}
          />
              ))}
            </div>
          </div>

          <div className="mb-4 w-full md:flex-grow">
            <label className="block text-gray-600 text-sm">
              Expiration Date
            </label>
            <div className="flex bg-white border rounded-md p-2 gap-2">
              <select
          className="text-left outline-none appearance-none px-1 w-1/2 md:w-auto"
          required
              >
          <option value="">MM</option>
          {Array.from({ length: 12 }, (_, i) => (
            <option key={i + 1} value={String(i + 1).padStart(2, '0')}>
              {String(i + 1).padStart(2, '0')}
            </option>
          ))}
              </select>
              <div>/</div>
              <select
          className="text-left outline-none appearance-none px-1 w-1/2 md:w-auto"
          required
              >
          <option value="">YY</option>
          {Array.from(
            { length: 10 },
            (_, i) => new Date().getFullYear() + i
          ).map((year) => (
            <option key={year} value={year.toString().slice(2)}>
              {year.toString().slice(2)}
            </option>
          ))}
              </select>
            </div>
          </div>

          <div className="mb-4 w-full md:flex-grow">
            <label className="block text-gray-600 text-sm">Security Code</label>
            <input
              type="tel"
              maxLength={3}
              placeholder="CVC"
              className="w-full p-2 border rounded-md"
              required
            />
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-gray-600 text-sm">Country</label>
          <select className="w-full p-2 border rounded-md">
            <option>Pakistan</option>
            <option>USA</option>
            <option>UK</option>
            <option>India</option>
          </select>
        </div>

        <button
          className=" bg-orange-500 text-white p-3 rounded-none font-bold text-lg hover:bg-orange-600"
          onClick={handleClick}
        >
          Claim My Membership for $99 Now!
        </button>

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
