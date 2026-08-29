import { create } from 'zustand';

export interface AddListingState {
  currentStep: number;
  formData: {
    title: string;
    category: string;
    price: string;
    bedrooms: string;
    bathrooms: string;
    balconies: string;
    total_rooms: string;
    address: string;
    latitude: string;
    longitude: string;
    facilities: string[];
    status: string;
    is_published: boolean;
  };
  photos: string[];
  
  // Actions
  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  updateFormData: (data: Partial<AddListingState['formData']>) => void;
  setPhotos: (photos: string[]) => void;
  resetForm: () => void;
}

const initialFormData = {
  title: '',
  category: '',
  price: '',
  bedrooms: '',
  bathrooms: '',
  balconies: '',
  total_rooms: '',
  address: '',
  latitude: '',
  longitude: '',
  facilities: [],
  status: 'active',
  is_published: true,
};

export const useAddListingStore = create<AddListingState>((set) => ({
  currentStep: 1,
  formData: initialFormData,
  photos: [],
  
  setStep: (step) => set({ currentStep: step }),
  nextStep: () => set((state) => ({ currentStep: Math.min(state.currentStep + 1, 3) })),
  prevStep: () => set((state) => ({ currentStep: Math.max(state.currentStep - 1, 1) })),
  updateFormData: (data) => set((state) => ({ 
    formData: { ...state.formData, ...data } 
  })),
  setPhotos: (photos) => set({ photos }),
  resetForm: () => set({ currentStep: 1, formData: initialFormData, photos: [] }),
}));
