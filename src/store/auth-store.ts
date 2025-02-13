import { type JwtPayload, jwtDecode } from 'jwt-decode';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

type AuthStoreState = {
  token: Token | null;

  // TODO: REMOVE THESE
  userHasSubscription: boolean;
};

type AuthStoreActions = {
  setToken: (encodedToken: string) => Token['decoded'];
  clearToken: () => void;
  setUserHasSubscription: (hasSubscription: boolean) => void;
};

type Token = {
  encoded: string;
  decoded: {
    userId: string;
    role: 'admin' | 'user';
  };
};

type AuthStore = AuthStoreState & AuthStoreActions;

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      token: null,
      userHasSubscription: false,
      setToken: (encodedToken) => {
        const decoded = jwtDecode<JwtPayload & Token['decoded']>(encodedToken);
        console.log('Decoded Token: ', decoded);
        set({ token: { encoded: encodedToken, decoded } });
        return decoded;
      },
      clearToken: () => set({ token: null }),

      setUserHasSubscription: (value) => {
        set({ userHasSubscription: value });
      },
    }),
    {
      name: 'auth-store',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

/*
export const useAuthStore = create<AuthStore>((set) => ({
  token: null,
  userHasSubscription: false,
  setToken: (encodedToken) => {
    const decoded = jwtDecode<JwtPayload & Token['decoded']>(encodedToken);
    console.log('Decoded Token: ', decoded);
    set({ token: { encoded: encodedToken, decoded } });
    return decoded;
  },
  clearToken: () => set({ token: null }),

  setUserHasSubscription: (value) => {
    set({ userHasSubscription: value });
  },
}));
*/
