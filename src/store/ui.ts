import { create } from "zustand";

interface SidebarState {
  collapse: boolean;
  toggleCollapse: () => void;
  openCollapse: () => void;
  closeCollapse: () => void;
}

export const useSidebarCollapse = create<SidebarState>((set) => ({
  collapse: false,
  toggleCollapse: () => set((state) => ({ collapse: !state.collapse })),
  openCollapse: () => set({ collapse: false }),
  closeCollapse: () => set({ collapse: true }),
}));

// footer height
interface FooterHeightState {
  height: number;
  setHeight: (height: number) => void;
}
export const useFooterHeight = create<FooterHeightState>((set) => ({
  height: 180,
  setHeight: (height: number) => set({ height }),
}));

