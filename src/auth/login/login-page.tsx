import Image01 from '@/assets/images/image01.jpg';
import { Card, CardContent } from '@/components/ui/card';

import { LoginForm } from './login-form';

export function LoginPage() {
  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100 md:items-center md:justify-center">
      <Card className="flex w-full max-w-7xl flex-col overflow-hidden rounded-none bg-slate-100 p-4 shadow-lg md:flex-row md:rounded-2xl">
        <div className="h-80 w-full flex-grow md:h-auto md:w-1/2">
          <img
            src={Image01}
            alt="Elderly couple reading"
            className="h-full w-full rounded-lg object-cover"
          />
        </div>
        <CardContent className="flex w-full flex-col px-0 py-8 md:w-1/2 md:px-8">
          <LoginForm />
        </CardContent>
      </Card>
    </div>
  );
}
