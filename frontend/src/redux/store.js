import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import mediaReducer from './slices/mediaSlice';
import notificationReducer from './slices/notificationSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    media: mediaReducer,
    notifications: notificationReducer,
  },
});

export default store;
