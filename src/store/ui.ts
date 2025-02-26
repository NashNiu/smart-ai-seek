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


interface RightSidebarState {
  isRightSidebarOpen: boolean;
  toggleRightSidebar: () => void;
  openRightSidebar: () => void;
  closeRightSidebar: () => void;
  fileInfo: {
    name: string;
    url: string;
  };
  setFileInfo: (fileInfo: { name: string; url: string }) => void;
}

export const useRightSidebar = create<RightSidebarState>((set) => ({
  isRightSidebarOpen: false,
  toggleRightSidebar: () => set((state) => ({ isRightSidebarOpen: !state.isRightSidebarOpen })),
  openRightSidebar: () => set({ isRightSidebarOpen: true }),
  closeRightSidebar: () => set({ isRightSidebarOpen: false }),
  fileInfo: {
    name: "",
    url: "",
  },
  setFileInfo: (fileInfo: { name: string; url: string }) => set({ fileInfo }),
}));

