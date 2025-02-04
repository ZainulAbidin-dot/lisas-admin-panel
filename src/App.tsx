import { BrowserRouter, Route, Routes } from 'react-router-dom';

import PersistLogin from './auth/_components/persist-login';
import RequireAuth from './auth/_components/require-auth';
import { AuthRouter } from './auth/auth-router';
import { AppLayout } from './components/shared/app-layout';
import { Toaster } from './components/ui/sonner';
import { HomePage } from './pages/home';
import PreferencePage from './pages/preference';

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="auth/*" element={<AuthRouter />} />

        <Route path="/*" element={<AppLayout />}>
          <Route element={<PersistLogin />}>
            <Route element={<RequireAuth />}>
              <Route index element={<HomePage />} />
              <Route path="preference" element={<PreferencePage />} />
            </Route>
          </Route>
        </Route>
      </Routes>
      <Toaster />
    </BrowserRouter>
  );
}
