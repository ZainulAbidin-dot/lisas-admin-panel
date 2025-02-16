import { BrowserRouter, Route, Routes } from 'react-router-dom';

import PersistLogin from '@/auth/_components/persist-login';
import RequireAuth from '@/auth/_components/require-auth';
import { AuthRouter } from '@/auth/auth-router';
import { AppLayout } from '@/components/shared/app-layout';
import { Toaster } from '@/components/ui/sonner';
import { ChatPage } from '@/pages/chat/chat-page';
import { ProfileMatchPage } from '@/pages/profile-match/profile-match';
import { Subscription } from '@/pages/subscription/subscription';

import { DashboardPage } from './pages/dashboard/dashboard-page';
import { ManageSubscription } from './pages/subscription/manage-subscription';

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth/*" element={<AuthRouter />} />

        <Route element={<AppLayout />}>
          {/* Persist Login */}
          <Route element={<PersistLogin />}>
            <Route element={<RequireAuth requireSubscription={false} />}>
              <Route path="/" element={<ProfileMatchPage />} />
            </Route>

            <Route element={<RequireAuth requireSubscription={false} />}>
              <Route path="/pricings" element={<Subscription />} />
            </Route>

            <Route element={<RequireAuth requireSubscription={true} />}>
              <Route path="/dashboard" element={<DashboardPage />} />
            </Route>

            <Route element={<RequireAuth requireSubscription={true} />}>
              <Route path="/chat/*" element={<ChatPage />} />
            </Route>

            <Route element={<RequireAuth requireSubscription={true} />}>
              <Route
                path="/manage-subscription"
                element={<ManageSubscription />}
              />
            </Route>
          </Route>
          {/* Persist Login end */}
        </Route>
      </Routes>
      <Toaster />
    </BrowserRouter>
  );
}
