import { create } from 'zustand';
import { User } from 'firebase/auth';

interface UserState {
    user: User | null;
    loading: boolean;
    userData: Record<string, unknown> | null; // Placeholder for Firestore profile data
    setUser: (user: User | null) => void;
    setLoading: (loading: boolean) => void;
    setUserData: (data: Record<string, unknown> | null) => void;
}

export const useUserStore = create<UserState>((set) => ({
    user: null,
    loading: true,
    userData: null,
    setUser: (user) => set({ user }),
    setLoading: (loading) => set({ loading }),
    setUserData: (data) => set({ userData: data }),
}));
