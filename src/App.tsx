import { BrowserRouter, Route, Routes } from 'react-router-dom';

import PersistLogin from '@/auth/_components/persist-login';
import RequireAuth from '@/auth/_components/require-auth';
import { AuthRouter } from '@/auth/auth-router';
import { AppLayout } from '@/components/shared/app-layout';
import { Toaster } from '@/components/ui/sonner';
import { ChatPage } from '@/pages/chat/chat-page';
import { ProfileMatchPage } from '@/pages/profile-match/profile-match';
import Subscription from '@/pages/subscription/subscription';

import Checkout from './pages/payment/checkout';
import { ShowProfilePage as ShowProfile } from './pages/profile/show/show-profile-page';

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth/*" element={<AuthRouter />} />

        <Route path="/" element={<AppLayout />}>
          {/* Persist Login */}
          <Route element={<PersistLogin />}>
            {/* Require Auth */}
            <Route element={<RequireAuth />}>
              <Route index element={<ProfileMatchPage />} />

              {/* Profile Routes */}
              <Route path="profile">
                <Route path="show" element={<ShowProfile />} />

                <Route path="find-match" element={<ProfileMatchPage />} />
              </Route>
              {/* Profile Routes End */}

              <Route path="/chat/*" element={<ChatPage />} />

              <Route path="/pricings" element={<Subscription />} />

              <Route path="/checkout" element={<Checkout />} />
            </Route>
            {/* Require Auth End */}
          </Route>
          {/* Persist Login end */}
        </Route>

        {/* Testing Components */}
      </Routes>
      <Toaster />
    </BrowserRouter>
  );
}
