import { BrowserRouter, Route, Routes } from 'react-router-dom';

import PersistLogin from '@/auth/_components/persist-login';
import RequireAuth from '@/auth/_components/require-auth';
import { AuthRouter } from '@/auth/auth-router';
import { AppLayout } from '@/components/shared/app-layout';
import { Toaster } from '@/components/ui/sonner';
import { ChatPage } from '@/pages/chat/chat-page';
import { HomePage } from '@/pages/home';
import { ProfileMatchPage } from '@/pages/profile-match/profile-match';
import { CreateProfilePage } from '@/pages/profile/create/create-profile-page';
import { ShowProfilePage } from '@/pages/profile/show/show-profile-page';
import Subscription from '@/pages/subscription/subscription';

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="auth/*" element={<AuthRouter />} />

        <Route path="/" element={<AppLayout />}>
          {/* Persist Login */}
          <Route element={<PersistLogin />}>
            {/* Require Auth */}
            <Route element={<RequireAuth />}>
              <Route index element={<HomePage />} />

              {/* Profile Routes */}
              <Route path="profile">
                {/* <Route path="create" element={<CreateProfilePage />} /> */}
                <Route path="find-match" element={<ProfileMatchPage />} />
                <Route path="show" element={<ShowProfilePage />} />
              </Route>
              {/* Profile Routes End */}
            </Route>
            {/* Require Auth End */}
          </Route>
          {/* Persist Login end */}

          <Route path="create" element={<CreateProfilePage />} />
          <Route path="/chat/*" element={<ChatPage />} />
          <Route path="/subscription" element={<Subscription />} />
        </Route>

        {/* Testing Components */}
      </Routes>
      <Toaster />
    </BrowserRouter>
  );
}
