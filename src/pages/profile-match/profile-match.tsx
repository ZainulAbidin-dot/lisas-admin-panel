import SwipeCardComponent from './SwipeCardComponent';
import { AppSidebar } from './SideBar';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

const ProfileMatchContent = () => {
  return (
    <div className='flex w-full justify-between bg-gray-200'>
      <div className='w-1/6'>
        <AppSidebar />
      </div>
      <div className="flex flex-col w-5/6 items-center p-4">
        <div className="w-full md:w-[65%] p-4 text-white text-center bg-[#042920] text-[24px] md:text-[30px] rounded-2xl shadow-md mb-4">
          Congratulations! You’ve Got 53+ New <br /> Matches with Shared Interests!
        </div>
        <div className="w-full p-6 overflow-hidden">
          <SwipeCardComponent />
        </div>
      </div>
    </div>
  );
};

export const ProfileMatch = () => {
  return (
    <SidebarProvider>
      <SidebarTrigger />
      <ProfileMatchContent />
    </SidebarProvider>
  );
};
