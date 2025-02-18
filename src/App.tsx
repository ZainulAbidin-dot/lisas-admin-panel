import { BrowserRouter, Route, Routes } from 'react-router-dom';

import PersistLogin from '@/auth/_components/persist-login';
import RequireAuth from '@/auth/_components/require-auth';
import { AuthRouter } from '@/auth/auth-router';
import { Toaster } from '@/components/ui/sonner';
import { ChatLayout } from '@/pages/chat/chat-page';
import { ProfileMatchPage } from '@/pages/profile-match/profile-match';
import { Subscription } from '@/pages/subscription/subscription';

import { SocketProvider } from './context/socket-context';
import { ChatSection } from './pages/chat/_components/chat-main-area';
import { NoChatSelected } from './pages/chat/_components/no-chat-selected';
import { DashboardPage } from './pages/dashboard/dashboard-page';
import { ManageSubscription } from './pages/subscription/manage-subscription';

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth/*" element={<AuthRouter />} />

        <Route element={<PersistLogin />}>
          <Route element={<SocketProvider />}>
            <Route element={<RequireAuth requireSubscription={false} />}>
              <Route path="/" element={<ProfileMatchPage />} />
            </Route>

            <Route element={<RequireAuth requireSubscription={false} />}>
              <Route path="/dashboard" element={<DashboardPage />} />
            </Route>

            <Route element={<RequireAuth requireSubscription={false} />}>
              <Route path="/chat" element={<ChatLayout />}>
                <Route index element={<NoChatSelected />} />
                <Route path=":matchId" element={<ChatSection />} />
              </Route>
            </Route>

            <Route element={<RequireAuth requireSubscription={true} />}>
              <Route
                path="/manage-subscription"
                element={<ManageSubscription />}
              />
            </Route>
          </Route>

          <Route element={<RequireAuth requireSubscription={false} />}>
            <Route path="/pricings" element={<Subscription />} />
          </Route>
        </Route>
      </Routes>
      <Toaster />
    </BrowserRouter>
  );
}
