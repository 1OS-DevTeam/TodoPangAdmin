import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { persist } from "zustand/middleware";

type SidebarTab = "dashboard" | "users" | "categories" | "challenges";

export interface AppStore {
  me: {
    name: string;
    email: string;
  };
  sidebarTab: SidebarTab;
  toastState: any;

  setMe: (target: { name: string; email: string }) => void;
  setToastState: (target: any) => void;
  setSidebarTab: (target: SidebarTab) => void;
}

const useAppStore = create<AppStore>()(
  devtools(
    persist(
      immer((set) => ({
        me: {
          name: "",
          email: "",
        },
        sidebarTab: "dashboard",
        toastState: {
          isOpen: false,
          type: "general",
          title: "",
          message: "",
        },

        setMe: (target) => {
          set((state) => {
            state.me = target;
          });
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
      })),
      {
        name: "app-storage",
        partialize: (state) => ({
          me: state.me,
          sidebarTab: state.sidebarTab,
        }),
      }
    )
  )
);

export default useAppStore;
