import { useAuthStore } from '@/store/auth-store';

export function HomePage() {
  const { token } = useAuthStore();
  return (
    <div className="flex-grow flex flex-col gap-4 justify-center items-center">
      <h1 className="text-4xl font-bold">Hello World</h1>
      <p className="text-lg">This is the home page</p>
      <pre className="mt-4 p-4 bg-gray-100 rounded-lg">
        {JSON.stringify(token?.decoded, null, 2)}
      </pre>
    </div>
  );
}
