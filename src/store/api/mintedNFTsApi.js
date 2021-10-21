import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const mintedNFTsApi = createApi({
    reducerPath: 'mintedNFTs',
    baseQuery: fetchBaseQuery({ baseUrl: 'https://rinkeby-api.opensea.io/api/v1' }),
    endpoints: (builder) => ({
        getMintedNFTs: builder.query({
            query: (contractAddress) => `/assets?asset_contract_address=${contractAddress}`,
        }),
    }),
});

export const { useGetMintedNFTsQuery } = mintedNFTsApi;
