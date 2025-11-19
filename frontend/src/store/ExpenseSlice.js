// expenseSlice.js

import { createSlice } from '@reduxjs/toolkit';

export const expenseSlice = createSlice({
  name: 'expenses',
  initialState: {
    expenses: [],
    total: 0
  },
  reducers: {
    setExpenses: (state, action) => {
      state.expenses = action.payload;
    },
    setTotal: (state, action) => {
      state.total = action.payload;
    },
    addExpense: (state, action) => {
      state.expenses.push(action.payload);
    },
    deleteExpense: (state, action) => {
      state.expenses = state.expenses.filter(expense => expense._id !== action.payload);
    },
    updateExpense: (state, action) => {
      state.expenses = state.expenses.map(expense =>
        expense._id === action.payload.id ? { ...expense, ...action.payload.updatedExpense } : expense
      );
    }
  }
});

export const { setExpenses, setTotal, addExpense, deleteExpense, updateExpense } = expenseSlice.actions;

export default expenseSlice.reducer;
