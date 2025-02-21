import { BrowserRouter, Route, Routes } from 'react-router-dom';

import PersistLogin from '@/auth/_components/persist-login';
import RequireAuth from '@/auth/_components/require-auth';
import { AuthRouter } from '@/auth/auth-router';
import { Toaster } from '@/components/ui/sonner';
import { ChatLayout } from '@/pages/chat/chat-page';

import { SocketProvider } from './context/socket-context';
import { ChatSection } from './pages/chat/_components/chat-main-area';
import { NoChatSelected } from './pages/chat/_components/no-chat-selected';
import { DashboardPage } from './pages/dashboard/dashboard-page';
import { SubscriptionList } from './pages/subscription-list/subscription-list';
import { UserList } from './pages/users/user-list';
import UserDetail from './pages/users/user-detail';
import SubscriptionDetail from './pages/subscription-list/subscription-detail';

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth/*" element={<AuthRouter />} />

        <Route element={<PersistLogin />}>
          <Route element={<SocketProvider />}>
            <Route element={<RequireAuth requireSubscription={false} />}>
              <Route path="/subscription" element={<SubscriptionList />} />
              <Route path="/subscription-detail/:id" element={<SubscriptionDetail />} />
              <Route path="/" element={<UserList />} />
              <Route path="/users" element={<UserList />} />
              <Route path="/user-detail/:id" element={<UserDetail />} />
              {/* <Route path="/" element={<ProfileMatchPage />} /> */}
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
              {/* <Route
                path="/manage-subscription"
                element={<ManageSubscription />}
              /> */}
            </Route>
          </Route>

          <Route element={<RequireAuth requireSubscription={false} />}>
            {/* <Route path="/pricings" element={<Subscription />} /> */}
          </Route>
        </Route>
      </Routes>
      <Toaster />
    </BrowserRouter>
  );
}
