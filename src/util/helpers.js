import { ethers } from 'ethers';
import myEpicNft from './TextBox.json';
import { setNetwork, setCurrentAccount } from '../store/reducers/web3Reducer';
import config from '../config';

const { CONTRACT_ADDRESS } = config;

export const getWeb3Provider = (dispatch) => {
    const { ethereum } = window;
    const provider = new ethers.providers.Web3Provider(ethereum, 'any');

    provider.on('network', (newNetwork, oldNetwork) => {
        // When a Provider makes its initial connection, it emits a "network"
        // event with a null oldNetwork along with the newNetwork. So, if the
        // oldNetwork exists, it represents a changing network
        if (oldNetwork) {
            provider.removeAllListeners();
            window.location.reload();
        } else {
            dispatch(setNetwork(newNetwork.name));
        }
    });

    ethereum.on('accountsChanged', async () => {
        const accounts = await provider.listAccounts();
        dispatch(setCurrentAccount(accounts[0] ? accounts[0] : ''));
    });

    return provider;
};

export const getContract = (dispatch) => {
    const provider = getWeb3Provider(dispatch);
    const signer = provider.getSigner();
    const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, myEpicNft.abi, signer);
    return connectedContract;
};
