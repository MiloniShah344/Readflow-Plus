import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UiState {
  isAddBookModalOpen: boolean;
  isLogModalOpen: boolean;
  selectedBookId: string | null;
  sidebarOpen: boolean;
}

const initialState: UiState = {
  isAddBookModalOpen: false,
  isLogModalOpen: false,
  selectedBookId: null,
  sidebarOpen: true,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    openAddBookModal: (state) => {
      state.isAddBookModalOpen = true;
    },
    closeAddBookModal: (state) => {
      state.isAddBookModalOpen = false;
    },
    openLogModal: (state, action: PayloadAction<string | null>) => {
      state.isLogModalOpen = true;
      state.selectedBookId = action.payload;
    },
    closeLogModal: (state) => {
      state.isLogModalOpen = false;
      state.selectedBookId = null;
    },
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
  },
});

export const {
  openAddBookModal,
  closeAddBookModal,
  openLogModal,
  closeLogModal,
  toggleSidebar,
} = uiSlice.actions;
export default uiSlice.reducer;