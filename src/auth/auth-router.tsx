import { Route, Routes } from 'react-router';

import { LoginPage } from './login/login-page';
import { RequestPasswordReset } from './password-reset/request-password-reset';
import { ResetPassword } from './password-reset/reset-password';

export function AuthRouter() {
  return (
    <Routes>
      <Route index element={<LoginPage />} />
      <Route path="login" element={<LoginPage />} />
      <Route path="request-password-reset" element={<RequestPasswordReset />} />
      <Route path="reset-password" element={<ResetPassword />} />
    </Routes>
  );
}
