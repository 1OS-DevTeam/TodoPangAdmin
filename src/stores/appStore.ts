import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

type SidebarTab = "dashboard" | "users" | "categories" | "challenges";

export interface AppStore {
  sidebarTab: SidebarTab;
  toastState: any;
  setToastState: (target: any) => void;

  setSidebarTab: (target: SidebarTab) => void;
}

const useAppStore = create<AppStore>()(
  devtools(
    immer((set) => ({
      sidebarTab: "dashboard",
      toastState: {
        isOpen: false,
        type: "general",
        title: "",
        message: "",
      },

      setSidebarTab: (target) => {
        set((state) => {
          state.sidebarTab = target;
        });
      },
      setToastState: (target) => {
        set((state) => {
          state.toastState = target;
        });
      },
    }))
  )
);

export default useAppStore;
