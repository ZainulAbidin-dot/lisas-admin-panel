import { Route, Routes } from 'react-router';

import { LoginForm } from './components/login-form';
import { RegisterForm } from './components/register-form';
import { Layout } from './layout';

export function AuthRouter() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<LoginForm />} />
        <Route path="login" element={<LoginForm />} />
        <Route path="register" element={<RegisterForm />} />
      </Route>
    </Routes>
  );
}
