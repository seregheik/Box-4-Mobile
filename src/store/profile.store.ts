import { create } from 'zustand';
import { AgentProfile } from '@/services/agent.service';

interface ProfileState {
  profile: AgentProfile | null;
  setProfile: (profile: AgentProfile | null) => void;
  updateProfileData: (data: Partial<AgentProfile>) => void;
}

export const useProfileStore = create<ProfileState>((set) => ({
  profile: null,
  setProfile: (profile) => set({ profile }),
  updateProfileData: (data) => set((state) => ({
    profile: state.profile ? { ...state.profile, ...data } : null,
  })),
}));
