import { create } from 'zustand';

interface UIState {
  isSidebarOpen: boolean;
  searchQuery: string;
  selectedCategory: string | null;
  toggleSidebar: () => void;
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (category: string | null) => void;
}

export const useUIStore = create<UIState>((set) => ({
  isSidebarOpen: false,
  searchQuery: '',
  selectedCategory: null,
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  setSearchQuery: (query: string) => set({ searchQuery: query }),
  setSelectedCategory: (category: string | null) => set({ selectedCategory: category }),
}));
