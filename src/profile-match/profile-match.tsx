import React from 'react';
import SwipeCardComponent from './SwipeCardComponent';

export const ProfileMatch = () => {
  return (
    <div className="flex flex-col items-center p-4 bg-gray-100">
      <div className="w-full md:w-[85%] p-4 mb-4 text-white text-center bg-[#042920] text-[24px] md:text-[60px] rounded-2xl shadow-md">
        Congratulations! You’ve Got 53+ New <br /> Matches with Shared Interests!
      </div>
      <div className="w-full p-6 bg-white rounded-lg shadow-md">
        <SwipeCardComponent />
      </div>
    </div>
  );
};
