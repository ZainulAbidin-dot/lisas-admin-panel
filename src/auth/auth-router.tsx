import { Route, Routes } from 'react-router';

import { CreateProfilePage } from './create/create-profile-page';
import { LoginForm } from './login/login-form';

export function AuthRouter() {
  return (
    <Routes>
      <Route index element={<LoginForm />} />
      <Route path="login" element={<LoginForm />} />
      <Route path="register" element={<CreateProfilePage />} />
    </Routes>
  );
}
