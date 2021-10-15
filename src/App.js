import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { NFTStorage } from 'nft.storage';
import './styles/App.css';
import twitterLogo from './assets/twitter-logo.svg';
import myEpicNft from './util/TextBox.json';
import AssetGenerator from './util/AssetGenerator';

// Constants
const TWITTER_HANDLE = '_buildspace';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;
const TOTAL_MINT_COUNT = 250;
const CONTRACT_ADDRESS = '0x5eEfe27A02f5cCF9797524ef09232fA217e52b9A';

/*
    TODO:
    - Redeploy contract
    - Add placeholder image for optimistic UI
    - Query contract to see if NFT name is already minted
    - Add page for showing all mints
    - Add FAQ section
*/

const App = () => {
    const [contract, setContract] = useState(null);
    const [currentAccount, setCurrentAccount] = useState('');
    const [loading, setLoading] = useState(false);
    const [isMinted, setIsMinted] = useState(false);
    const [openSeaLink, setOpenSeaLink] = useState('');
    const [error, setError] = useState('');
    const [network, setNetwork] = useState('');

    const connectContract = () => {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, myEpicNft.abi, signer);
        setContract(connectedContract);

        provider.on('network', (newNetwork, oldNetwork) => {
            console.log('network', newNetwork, oldNetwork);
            setNetwork(newNetwork.name);
            // When a Provider makes its initial connection, it emits a "network"
            // event with a null oldNetwork along with the newNetwork. So, if the
            // oldNetwork exists, it represents a changing network
            if (oldNetwork) {
                window.location.reload();
            }
        });
    };

    const checkIfWalletIsConnected = async () => {
        /*
         * First make sure we have access to window.ethereum
         */
        const { ethereum } = window;

        if (!ethereum) {
            console.log('Make sure you have metamask!');
            return;
        } else {
            console.log('We have the ethereum object', ethereum);
        }

        // connect chain ID
        let chainId = await ethereum.request({ method: 'eth_chainId' });
        console.log('Connected to chain ' + chainId);

        // String, hex code of the chainId of the Rinkebey test network
        const rinkebyChainId = '0x4';
        if (chainId !== rinkebyChainId) {
            alert('Please connect a wallet on the Rinkeby test network!');
            return;
        }

        /*
         * Check if we're authorized to access the user's wallet
         */
        const accounts = await ethereum.request({ method: 'eth_accounts' });

        /*
         * User can have multiple authorized accounts, we grab the first one if its there!
         */
        if (accounts.length !== 0) {
            const account = accounts[0];
            console.log('Found an authorized account:', account);
            setCurrentAccount(account);
            connectContract();
        } else {
            console.log('No authorized account found');
        }
    };

    const connectWallet = async () => {
        try {
            const { ethereum } = window;

            if (!ethereum) {
                alert('Get MetaMask!');
                return;
            }

            // connect chain ID
            let chainId = await ethereum.request({ method: 'eth_chainId' });
            console.log('Connected to chain ' + chainId);

            // String, hex code of the chainId of the Rinkebey test network
            const rinkebyChainId = '0x4';
            if (chainId !== rinkebyChainId) {
                alert('Please connect a wallet on the Rinkeby test network!');
                return;
            }

            /*
             * Fancy method to request access to account.
             */
            const accounts = await ethereum.request({
                method: 'eth_requestAccounts',
            });

            /*
             * Boom! This should print out public address once we authorize Metamask.
             */
            console.log('Connected', accounts[0]);
            setCurrentAccount(accounts[0]);
            connectContract();
        } catch (error) {
            console.log(error);
        }
    };

    const askContractToMintNft = async () => {
        try {
            const { ethereum } = window;

            if (ethereum && !!contract) {
                const totalMints = await contract.getTotalNFTsMinted();

                if (totalMints >= TOTAL_MINT_COUNT) {
                    setError("Sorry! Maximum amount of NFT's minted!");
                    setIsMinted(false);
                    return;
                }

                setLoading(true);
                setIsMinted(false);

                const key = process.env.REACT_APP_NFT_STORAGE_KEY;
                console.log('key', key);

                const asset = await AssetGenerator.generate(contract.address);
                console.log('generated asset', asset);

                const ipfsClient = new NFTStorage({
                    token: process.env.REACT_APP_NFT_STORAGE_KEY,
                });
                const metadata = await ipfsClient.store(asset);
                console.log('metadata', metadata);
                // our smart contract already prefixes URIs with "ipfs://", so we remove it before calling the `makeAnEpicNFT` function
                const metadataURI = metadata.url.replace(/^ipfs:\/\//, '');

                console.log('Going to pop wallet now to pay gas...');
                let nftTxn = await contract.makeAnEpicNFT(metadataURI);

                console.log('Mining...please wait.');
                await nftTxn.wait();

                setLoading(false);
                setIsMinted(true);
                setError('');
                setOpenSeaLink(`https://testnets.opensea.io/assets/${CONTRACT_ADDRESS}/${totalMints}`);

                console.log(`Mined, see transaction: https://rinkeby.etherscan.io/tx/${nftTxn.hash}`);
            } else {
                console.log("Ethereum object doesn't exist!");
            }
        } catch (error) {
            setLoading(false);
            setIsMinted(false);
            console.error('Error minting NFT: ', error);
        }
    };

    /*
     * This runs our function when the page loads.
     */
    useEffect(() => {
        checkIfWalletIsConnected();
    }, []);

    // Render Methods
    const renderNotConnectedContainer = () => (
        <button onClick={connectWallet} className="cta-button connect-wallet-button">
            Connect to Wallet
        </button>
    );

    /*
     * We want the "Connect to Wallet" button to dissapear if they've already connected their wallet!
     */
    const renderMintUI = () => {
        const isRinkeby = network === 'rinkeby';
        return isRinkeby ? (
            <button onClick={askContractToMintNft} className="cta-button connect-wallet-button" disabled={loading}>
                {loading ? 'Mining...' : 'Mint NFT'}
            </button>
        ) : error ? (
            <p className="sub-text">{error}</p>
        ) : (
            <p className="sub-text">You must be on the Rinkeby network!</p>
        );
    };

    return (
        <div className="App">
            <div className="container">
                <div className="header-container">
                    <p className="header gradient-text">John's NFT Collection (Beta)</p>
                    <p className="sub-text">Click "Mint NFT" to generate your own unique NFT!</p>
                    {currentAccount !== '' ? renderMintUI() : renderNotConnectedContainer()}
                    {isMinted && (
                        <p className="sub-text">
                            NFT Minted! View your NFT{' '}
                            <a target="_blank" rel="noopener noreferrer" href={openSeaLink}>
                                here
                            </a>
                            .
                        </p>
                    )}
                </div>
                <div className="footer-container">
                    <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
                    <a
                        className="footer-text"
                        href={TWITTER_LINK}
                        target="_blank"
                        rel="noopener noreferrer"
                    >{`built on @${TWITTER_HANDLE}`}</a>
                </div>
            </div>
        </div>
    );
};

export default App;
