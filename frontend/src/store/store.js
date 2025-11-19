// store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './AuthSlice';
import expenseReducer from './ExpenseSlice';
import themeReducer from './ThemeSlice';
import premiumReducer from './PremiumSlice'

const store = configureStore({
  reducer: {
    auth: authReducer,
    expenses: expenseReducer,
    theme: themeReducer,
    premium: premiumReducer
  },
});

export default store;
