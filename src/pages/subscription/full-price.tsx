const FullPriceSubscription = () => {
  return (
    <div className="flex flex-col justify-center items-center py-4 px-14">
      {/* FullPriceSubscription Plans */}
      <div className="grid md:grid-cols-2 gap-6 mt-6">
        <div>
          <p className="text-sm font-bold">Select a plan</p>
          <div className="text-center border border-orange-500 rounded-md my-4 p-4">
            <h3 className="text-xl font-bold mb-2">Monthly</h3>
            <p className="text-gray-700 mb-2">$12/m</p>
          </div>
          <div className="border rounded-lg bg-white shadow-md">
            <ul className="text-gray-600 p-6 text-sm">
              <li>✅ Unlimited likes</li>
              <li>✅ See who Likes You</li>
              <li>✅ Unlimited Rewinds</li>
              <li>✅ 1 free Boost per month</li>
              <li>✅ 5 free Super Likes per week</li>
              <li>✅ Passport - Match & chat worldwide</li>
            </ul>
            <button className="my-4 bg-gradient-to-tr from-[#000] to-[#999] text-white font-bold px-4 py-1 rounded-full w-full shadow-[-0px_-0px_20px_20px_rgba(255,255,255,1)]">
              Subscribed
            </button>
            <ul className="text-gray-600 p-6 text-sm">
              <li>✅ 1 free Boost per month</li>
              <li>✅ 5 free Super Likes per week</li>
              <li>✅ Passport - Match & chat worldwide</li>
            </ul>
          </div>
        </div>

        <div>
          <p className="text-sm font-bold">Select a plan</p>
          <div className="text-center border border-2 border-orange-500 rounded-md my-4 p-4">
            <h3 className="text-xl font-bold mb-2">Yearly (Save 30%)</h3>
            <p className="text-gray-700 mb-2">$99/Year</p>
          </div>
          <div className="border rounded-lg bg-white shadow-md">
            <ul className="text-gray-600 p-6 text-sm">
              <li>✅ Unlimited likes</li>
              <li>✅ See who Likes You</li>
              <li>✅ Unlimited Rewinds</li>
              <li>✅ 1 free Boost per month</li>
              <li>✅ 5 free Super Likes per week</li>
              <li>✅ Passport - Match & chat worldwide</li>
            </ul>
            <button className="my-4 bg-gradient-to-tr from-[#fa4737] to-orange-400 text-white font-bold px-4 py-1 rounded-full w-full shadow-[-0px_-0px_20px_20px_rgba(255,255,255,1)]">
              Upgrade
            </button>
            <ul className="text-gray-600 p-6 text-sm">
              <li>✅ 1 free Boost per month</li>
              <li>✅ 5 free Super Likes per week</li>
              <li>✅ Passport - Match & chat worldwide</li>
            </ul>
          </div>
        </div>
      </div>

      <button className="my-4 bg-gradient-to-tr from-[#fa4737] to-orange-400 text-white font-bold px-14 py-1 rounded-full w-[fit-content] shadow-[-0px_-0px_20px_20px_rgba(255,255,255,1)]">
        Cancel Subscription
      </button>

      {/* CTA */}
      {/* <div className="mt-4 flex space-x-4">
            <button className="bg-blue-500 text-white px-6 py-2 rounded-md">
            Sign up
            </button>
            <button className="bg-gray-300 text-gray-800 px-6 py-2 rounded-md">
            Continue
            </button>
        </div> */}
    </div>
  );
};

export default FullPriceSubscription;
