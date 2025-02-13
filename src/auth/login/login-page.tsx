import Image01 from '@/assets/images/image01.jpg';
import { cn } from '@/lib/utils';

import { LoginForm } from './login-form';

export function LoginPage() {
  return (
    <div
      className={cn(
        'h-screen bg-gradient-to-br from-blue-100 to-purple-100',
        'flex items-center flex-col md:flex-row md:justify-center',
        'relative'
      )}
    >
      <div
        className={
          'h-auto max-h-96 w-full md:h-screen md:max-h-full md:w-1/2 flex-grow'
        }
      >
        <img
          src={Image01}
          alt="Elderly couple reading"
          className="h-full w-full rounded-lg object-cover"
        />
      </div>
      <div className="flex flex-col px-4 py-8 md:px-8 w-full md:w-1/2">
        <LoginForm />
      </div>
    </div>
  );
}
