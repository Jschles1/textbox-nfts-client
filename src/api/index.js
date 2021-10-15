const domain = 'https://rinkeby-api.opensea.io/api/v1';

const makeApiRequest = async (url, method, params) => {
    const httpMethod = method || 'GET';

    let response;

    try {
        if (httpMethod === 'GET') {
            response = await fetch(url);
        } else {
            response = await fetch(url, {
                method: httpMethod,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(params),
            });
        }

        const responseData = await response.json();

        return responseData;
    } catch (e) {
        console.error('API Error: ', e);
    }
};

const api = {
    getNFTCollection: (contractAddress) => makeApiRequest(`${domain}/assets?asset_contract_address=${contractAddress}`),
};

export default api;
