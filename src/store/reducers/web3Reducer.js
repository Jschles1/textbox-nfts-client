import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    currentAccount: '',
    network: '',
};

const web3Slice = createSlice({
    name: 'web3',
    initialState,
    reducers: {
        setCurrentAccount(state, action) {
            state.currentAccount = action.payload;
        },
        setNetwork(state, action) {
            state.network = action.payload;
        },
    },
});

export const { setCurrentAccount, setNetwork } = web3Slice.actions;

export default web3Slice.reducer;
