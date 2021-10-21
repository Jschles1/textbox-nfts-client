import { configureStore } from '@reduxjs/toolkit';
import web3Reducer from './reducers/web3Reducer';
import { mintedNFTsApi } from './api/mintedNFTsApi';

export const createStoreWithSaga = () => {
    const store = configureStore({
        reducer: {
            web3: web3Reducer,
            [mintedNFTsApi.reducerPath]: mintedNFTsApi.reducer,
        },
        middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(mintedNFTsApi.middleware),
    });
    return store;
};

const store = createStoreWithSaga();

export default store;
