import { create } from 'zustand';
import { IVehicle } from '../types/index.js';

interface CompareState {
  vehicles: IVehicle[];
  addToCompare: (vehicle: IVehicle) => void;
  removeFromCompare: (id: string) => void;
  clearCompare: () => void;
}

export const useCompareStore = create<CompareState>((set) => ({
  vehicles: [],
  addToCompare: (vehicle) =>
    set((state) => {
      if (state.vehicles.some((v) => v._id === vehicle._id)) return state;
      if (state.vehicles.length >= 3) return state;
      return { vehicles: [...state.vehicles, vehicle] };
    }),
  removeFromCompare: (id) =>
    set((state) => ({
      vehicles: state.vehicles.filter((v) => v._id !== id),
    })),
  clearCompare: () => set({ vehicles: [] }),
}));
