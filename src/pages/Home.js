import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { NFTStorage } from 'nft.storage';
import { Box, Flex, Image, Link, Text } from '@chakra-ui/react';
import Button from '../components/Button';
import twitterLogo from '../assets/twitter-logo.svg';
import AssetGenerator from '../util/AssetGenerator';
import { getContract } from '../util/helpers';

// Constants
const TWITTER_HANDLE = '_buildspace';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;
const TOTAL_MINT_COUNT = 250;
const CONTRACT_ADDRESS = '0xeE2AA996B91154c1cbbc132CC26b9A108F32EAbc';

const SubText = (props) => (
    <Text {...props} fontSize="25px">
        {props.children}
    </Text>
);

const Home = () => {
    const dispatch = useDispatch();
    const currentAccount = useSelector((state) => state.web3.currentAccount);
    const network = useSelector((state) => state.web3.network);

    const [loading, setLoading] = useState(false);
    const [isMinted, setIsMinted] = useState(false);
    const [openSeaLink, setOpenSeaLink] = useState('');
    const [error, setError] = useState('');

    const askContractToMintNft = async () => {
        try {
            const { ethereum } = window;
            const contract = getContract(dispatch);

            if (ethereum && !!contract) {
                const totalMints = await contract.getTotalNFTsMinted();

                if (totalMints >= TOTAL_MINT_COUNT) {
                    setError("Sorry! Maximum amount of NFT's minted!");
                    setIsMinted(false);
                    return;
                }

                setLoading(true);
                setIsMinted(false);

                const asset = await AssetGenerator.generate(contract.address);

                const ipfsClient = new NFTStorage({
                    token: process.env.REACT_APP_NFT_STORAGE_KEY,
                });
                const metadata = await ipfsClient.store(asset);
                // our smart contract already prefixes URIs with "ipfs://", so we remove it before calling the `makeAnEpicNFT` function
                const metadataURI = metadata.url.replace(/^ipfs:\/\//, '');

                console.log('metadata URI', metadataURI);

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
     * We want the "Connect to Wallet" button to dissapear if they've already connected their wallet!
     */
    const renderMintUI = () => {
        const isRinkeby = network === 'rinkeby';
        return isRinkeby ? (
            <>
                <SubText mb={8}>Click "Mint NFT" to generate your own unique NFT!</SubText>
                <Button onClick={askContractToMintNft} disabled={loading} type="mint">
                    {loading ? 'Mining...' : 'Mint NFT'}
                </Button>
            </>
        ) : error ? (
            <SubText>{error}</SubText>
        ) : (
            <SubText color="red">
                This application only works if you are connected to the Rinkeby network.
                <br />
                Please switch to the Rinkeby network to mint an NFT.
            </SubText>
        );
    };

    const renderNotConnectedUI = () => <SubText>To get started, Please connect your MetaMask wallet.</SubText>;

    return (
        <Box height="100vh" textAlign="center">
            <Flex height="100%" direction="column" justifyContent="space-between">
                <Box pt="30px">
                    <Text
                        fontWeight="bold"
                        fontSize="50px"
                        m={0}
                        bgGradient="linear(43deg, #4158D0 0%, #C850C0 46%, #FFCC70 100%)"
                        bgClip="text"
                    >
                        John's NFT Collection (Beta)
                    </Text>
                    {currentAccount !== '' ? renderMintUI() : renderNotConnectedUI()}
                    {isMinted && (
                        <SubText mt={8}>
                            NFT Minted! View your NFT{' '}
                            <Link target="_blank" rel="noopener noreferrer" href={openSeaLink}>
                                here
                            </Link>
                            .
                        </SubText>
                    )}
                </Box>
                <Flex justifyContent="center" alignItems="center" pb="30px">
                    <Image width="35px" height="35px" alt="Twitter Logo" src={twitterLogo} />
                    <Link
                        fontSize="16px"
                        fontWeight="bold"
                        color="white"
                        href={TWITTER_LINK}
                        target="_blank"
                        rel="noopener noreferrer"
                    >{`built on @${TWITTER_HANDLE}`}</Link>
                </Flex>
            </Flex>
        </Box>
    );
};

export default Home;
