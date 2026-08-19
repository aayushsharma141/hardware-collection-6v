import { create } from "zustand";
import { ConsultationContext } from "./ConsultationContext";

type ConsultationStore = {
  isOpen: boolean;
  context: ConsultationContext | null;
  openDrawer: (context: ConsultationContext) => void;
  closeDrawer: () => void;
};

export const useConsultationStore = create<ConsultationStore>((set) => ({
  isOpen: false,
  context: null,
  openDrawer: (context) => set({ isOpen: true, context }),
  closeDrawer: () => set({ isOpen: false }),
}));
