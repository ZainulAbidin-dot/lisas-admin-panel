import { BrowserRouter, Route, Routes } from 'react-router-dom';

import PersistLogin from './auth/_components/persist-login';
import RequireAuth from './auth/_components/require-auth';
import { AuthRouter } from './auth/auth-router';
import { AppLayout } from './components/shared/app-layout';
import { Toaster } from './components/ui/sonner';
import { CreateProfilePage } from './pages/create-profile-page/create-profile-page';
import { HomePage } from './pages/home';
import { ProfileMatch } from './pages/profile-match/profile-match';

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="auth/*" element={<AuthRouter />} />

        <Route path="/*" element={<AppLayout />}>
          <Route element={<PersistLogin />}>
            <Route element={<RequireAuth />}>
              <Route index element={<HomePage />} />
              <Route path="profile/create" element={<CreateProfilePage />} />
              <Route path="profile/find-match" element={<ProfileMatch />} />
            </Route>
          </Route>
        </Route>
      </Routes>
      <Toaster />
    </BrowserRouter>
  );
}
