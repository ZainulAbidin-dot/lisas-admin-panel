import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { AuthRouter } from './auth/auth-router';
import { AppLayout } from './components/shared/layout';
import PreferencePage from './pages/preference';

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/*" element={<AppLayout />}>
          <Route index element={<h1>Hello World</h1>} />
          <Route path="auth/*" element={<AuthRouter />} />
          <Route path="preference" element={<PreferencePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
