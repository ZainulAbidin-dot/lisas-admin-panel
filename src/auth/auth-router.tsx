import { Route, Routes } from 'react-router';

import { CreateProfilePage } from './create/create-profile-page';
import { LoginPage } from './login/login-page';

export function AuthRouter() {
  return (
    <Routes>
      <Route index element={<LoginPage />} />
      <Route path="login" element={<LoginPage />} />
      <Route path="register" element={<CreateProfilePage />} />
    </Routes>
  );
}
