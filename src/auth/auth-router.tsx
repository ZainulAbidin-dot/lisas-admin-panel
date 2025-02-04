import { Route, Routes } from 'react-router';

import { AuthLayout } from './auth-layout';
import { LoginForm } from './login/login-form';
import { RegisterForm } from './register/register-form';

export function AuthRouter() {
  return (
    <Routes>
      <Route path="/" element={<AuthLayout />}>
        <Route index element={<LoginForm />} />
        <Route path="login" element={<LoginForm />} />
        <Route path="register" element={<RegisterForm />} />
      </Route>
    </Routes>
  );
}
