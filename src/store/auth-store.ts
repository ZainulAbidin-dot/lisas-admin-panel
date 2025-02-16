import { type JwtPayload, jwtDecode } from 'jwt-decode';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

type AuthStoreState = {
  token: Token | null;
};

type AuthStoreActions = {
  setToken: (encodedToken: string) => Token['decoded'];
  clearToken: () => void;
};

type Token = {
  encoded: string;
  decoded: {
    userId: string;
    role: 'admin' | 'user';
    hasActiveSubscription: boolean;
  };
};

type AuthStore = AuthStoreState & AuthStoreActions;

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      token: null,
      setToken: (encodedToken) => {
        const decoded = jwtDecode<JwtPayload & Token['decoded']>(encodedToken);
        console.log('Decoded Token: ', decoded);
        set({ token: { encoded: encodedToken, decoded } });
        return decoded;
      },
      clearToken: () => set({ token: null }),
    }),
    {
      name: 'auth-store',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
