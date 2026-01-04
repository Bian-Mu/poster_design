import { create } from 'zustand';
import type { CanvasElement } from '../types';

interface CanvasStore {
  elements: CanvasElement[];
  selectedId: string | null;
  canvasSize: { width: number; height: number };
  
  // Actions
  addElement: (element:  CanvasElement) => void;
  updateElement: (id:  string, updates: Partial<CanvasElement>) => void;
  deleteElement: (id: string) => void;
  selectElement: (id: string | null) => void;
  reorderElements: (id: string, direction: 'up' | 'down' | 'top' | 'bottom') => void;
  clearCanvas: () => void;
  getSelectedElement: () => CanvasElement | undefined;
}

export const useCanvasStore = create<CanvasStore>((set, get) => ({
  elements: [],
  selectedId: null,
  canvasSize: { width: 800, height: 600 },

  addElement: (element) =>
    set((state) => ({
      elements: [...state.elements, { ...element, zIndex: state.elements.length }],
    })),

  updateElement: (id, updates) =>
    set((state) => ({
      elements: state.elements. map((el) =>
        el.id === id ? { ...el, ...updates } : el
      ),
    })),

  deleteElement: (id) =>
    set((state) => ({
      elements: state.elements.filter((el) => el.id !== id),
      selectedId: state.selectedId === id ? null :  state.selectedId,
    })),

  selectElement: (id) => set({ selectedId: id }),

  reorderElements: (id, direction) =>
    set((state) => {
      const elements = [... state.elements];
      const index = elements.findIndex((el) => el.id === id);
      if (index === -1) return state;

      const element = elements[index];
      
      switch (direction) {
        case 'up':
          if (index < elements.length - 1) {
            [elements[index], elements[index + 1]] = [elements[index + 1], elements[index]];
          }
          break;
        case 'down':
          if (index > 0) {
            [elements[index], elements[index - 1]] = [elements[index - 1], elements[index]];
          }
          break;
        case 'top':
          elements.splice(index, 1);
          elements.push(element);
          break;
        case 'bottom':
          elements.splice(index, 1);
          elements.unshift(element);
          break;
      }

      // 重新分配 zIndex
      return {
        elements: elements.map((el, idx) => ({ ...el, zIndex: idx })),
      };
    }),

  clearCanvas: () => set({ elements: [], selectedId: null }),

  getSelectedElement: () => {
    const { elements, selectedId } = get();
    return elements.find((el) => el.id === selectedId);
  },
}));