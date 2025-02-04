import { Outlet } from 'react-router-dom';

import { Footer } from './footer';
import { Navbar } from './navbar';

export const AppLayout = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex flex-1 flex-col">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};
