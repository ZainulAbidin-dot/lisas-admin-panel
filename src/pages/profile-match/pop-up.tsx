import { useState } from 'react';

import { X } from 'lucide-react';
import { Link } from 'react-router-dom';

import image from '../../assets/images/image01.jpg';

const PopUp = () => {
  const [isOpen, setIsOpen] = useState(true);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-2xl shadow-lg w-80 relative border-2 border-red-400">
        {/* Close Button */}
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-2 right-2 bg-red-500 rounded-full p-1 shadow-md"
        >
          <X className="w-4 h-4 text-white" />
        </button>

        {/* Image */}
        <img
          src={image}
          alt="Group Conversation"
          className="w-full h-36 object-cover rounded-2xl"
        />

        {/* Text Content */}
        <div className="text-center mt-4">
          <h2 className="text-xl font-bold px-6">It's time to connect!</h2>
          <p className="text-gray-600">
            Finding people most <br /> relevant to you!
          </p>
        </div>

        {/* Button */}
        <div className="flex justify-center my-4">
          <Link
            to="/pricings"
            className="bg-gradient-to-tr from-red-500 to-orange-500 text-white py-1 px-10 rounded-full text-lg font-semibold hover:bg-red-600"
          >
            View Pricing
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PopUp;
