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
import { UserDetail } from './pages/users/user-detail/user-detail';
import { UserList } from './pages/users/user-list';

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth/*" element={<AuthRouter />} />

        <Route element={<PersistLogin />}>
          <Route element={<SocketProvider />}>
            <Route element={<RequireAuth />}>
              <Route path="/" element={<UserList />} />

              <Route path="/users" element={<UserList />} />

              <Route path="/user-detail/:id" element={<UserDetail />} />

              <Route path="/subscription" element={<SubscriptionList />} />

              <Route path="/chat" element={<ChatLayout />}>
                <Route index element={<NoChatSelected />} />
                <Route path=":matchId" element={<ChatSection />} />
              </Route>
            </Route>

            <Route element={<RequireAuth />}>
              <Route path="/dashboard" element={<DashboardPage />} />
            </Route>

            <Route element={<RequireAuth />}>
              <Route path="/chat" element={<ChatLayout />}>
                <Route index element={<NoChatSelected />} />
                <Route path=":matchId" element={<ChatSection />} />
              </Route>
            </Route>
          </Route>
        </Route>
      </Routes>
      <Toaster />
    </BrowserRouter>
  );
}
