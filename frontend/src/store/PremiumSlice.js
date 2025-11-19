import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    isPremium: false,
};

const premiumSlice = createSlice({
    name: 'premium',
    initialState,
    reducers: {
        activatePremium(state) {
            state.isPremium = true;
        },
        // deactivatePremium(state) {
        //     state.isPremium = false;
        // },
    },
});

export const { activatePremium, deactivatePremium } = premiumSlice.actions;
export default premiumSlice.reducer;
