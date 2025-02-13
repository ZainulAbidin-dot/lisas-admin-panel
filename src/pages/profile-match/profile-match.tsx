import MatchBar from './MatchBar';
import SwipeCardComponent from './SwipeCardComponent';

export const ProfileMatchPage = () => {
  return (
    <div className="flex flex-grow justify-between bg-gray-200">
      <MatchBar />
      <div className="flex flex-col w-full items-center p-4">
        <div className="w-full p-6 overflow-hidden">
          <SwipeCardComponent />
        </div>
        <div className="w-full md:w-[65%] p-4 text-white text-center text-[#042920] text-[24px] md:text-[30px] rounded-2xl mb-4">
          Congratulations! You’ve Got 53+ New <br /> Matches with Shared
          Interests!
        </div>
      </div>
    </div>
  );
};
