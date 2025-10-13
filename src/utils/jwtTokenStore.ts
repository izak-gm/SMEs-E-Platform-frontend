import { create } from "zustand";
import { persist } from "zustand/middleware";

type JwtTokenState = {
  jwtToken: string | null;
  setJwtToken: (newJwtToken: string) => void;
  clearJwtToken: () => void;
};

export const useJwtTokenStore = create<JwtTokenState>()(
  persist(
    (set) => ({
      jwtToken: null,
      setJwtToken: (newJwtToken) => set({ jwtToken: newJwtToken }),
      clearJwtToken: () => set({ jwtToken: null }),
    }),
    { name: "jwt" }
  )
);
