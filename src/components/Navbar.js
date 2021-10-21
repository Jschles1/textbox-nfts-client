import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link as ReactRouterLink, useLocation } from 'react-router-dom';
import {
    Flex,
    Text,
    Stack,
    Link,
    Box,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
} from '@chakra-ui/react';
import { CopyIcon, ExternalLinkIcon } from '@chakra-ui/icons';
import truncateEthAddress from 'truncate-eth-address';
import Button from '../components/Button';
import { getContract } from '../util/helpers';

import { setCurrentAccount } from '../store/reducers/web3Reducer';

const NavLink = ({ href, children }) => {
    const location = useLocation();
    const isCurrentPage = location.pathname === href;
    return (
        <Link
            as={ReactRouterLink}
            to={href}
            fontWeight={isCurrentPage ? 'bold' : 'normal'}
            _focus={{
                boxShadow: 'none',
            }}
        >
            {children}
        </Link>
    );
};

const Navbar = () => {
    const dispatch = useDispatch();
    const currentAccount = useSelector((state) => state.web3.currentAccount);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const checkIfWalletIsConnected = async () => {
        /*
         * First make sure we have access to window.ethereum
         */
        const { ethereum } = window;

        if (!ethereum) {
            alert('Please install Metamask to use this app.');
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
            dispatch(setCurrentAccount(account));
            getContract(dispatch);
        } else {
            console.log('No authorized account found');
        }
    };

    const connectWallet = async () => {
        try {
            const { ethereum } = window;

            if (!ethereum) {
                alert('Please install Metamask to use this app.');
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
            dispatch(setCurrentAccount(accounts[0]));
            getContract(dispatch);
        } catch (error) {
            console.log(error);
        }
    };

    const onAddressClick = () => {
        setIsModalOpen(true);
    };

    const onCopyAddress = () => {
        navigator.clipboard.writeText(currentAccount);
    };

    const onModalClose = () => {
        setIsModalOpen(false);
    };

    const onChangeAccount = async () => {
        if (window.ethereum) {
            await window.ethereum.request({
                method: 'wallet_requestPermissions',
                params: [
                    {
                        eth_accounts: {},
                    },
                ],
            });
            onModalClose();
        }
    };

    useEffect(() => {
        checkIfWalletIsConnected();
    }, []);

    const accountAddress = truncateEthAddress(currentAccount);

    return (
        <>
            <Flex
                bgColor="main.200"
                width="100%"
                p={2}
                h="60px"
                alignItems="center"
                boxShadow="sm"
                borderWidth="1px"
                borderColor="main.300"
            >
                <Flex maxW="1440px" justifyContent="space-between" alignItems="center" width="100%" mx="auto" px={4}>
                    <Text
                        fontSize="lg"
                        bgGradient="linear(43deg, #4158D0 0%, #C850C0 46%, #FFCC70 100%)"
                        bgClip="text"
                        fontWeight="bold"
                    >
                        Textbox NFT
                    </Text>

                    <Stack direction="row" alignItems="center" spacing={8}>
                        <NavLink href="/">Home</NavLink>

                        <NavLink href="/collection">Collection</NavLink>

                        {currentAccount !== '' ? (
                            <Box
                                bgGradient="linear(43deg, #4158D0 0%, #C850C0 46%, #FFCC70 100%)"
                                p={0.5}
                                borderRadius="100px"
                            >
                                <Link
                                    display="block"
                                    as="button"
                                    py={2}
                                    px={3}
                                    bgColor="main.200"
                                    borderRadius="100px"
                                    _focus={{
                                        boxShadow: 'none',
                                    }}
                                    _hover={{
                                        textDecoration: 'none',
                                        backgroundColor: 'main.100',
                                    }}
                                    onClick={onAddressClick}
                                >
                                    {accountAddress}
                                </Link>
                            </Box>
                        ) : (
                            <Button type="connect" onClick={connectWallet}>
                                Connect Wallet
                            </Button>
                        )}
                    </Stack>
                </Flex>
            </Flex>

            <Modal isOpen={isModalOpen} onClose={onModalClose} borderWidth="1px" borderColor="main.300">
                <ModalOverlay />
                <ModalContent borderWidth="1px" borderColor="main.300">
                    <ModalCloseButton />
                    <ModalBody
                        py={12}
                        bgColor="main.100"
                        borderTopRightRadius="lg"
                        borderTopLeftRadius="lg"
                        textAlign="center"
                    >
                        <Text fontSize="24px" fontWeight="bold" mb={4}>
                            Your Wallet:
                        </Text>

                        <Text
                            fontSize="24px"
                            fontWeight="bold"
                            bgGradient="linear(43deg, #4158D0 0%, #C850C0 46%, #FFCC70 100%)"
                            bgClip="text"
                            mb={4}
                        >
                            {truncateEthAddress(currentAccount)}
                        </Text>

                        <Stack direction="row" mx="auto" justifyContent="center" spacing={8}>
                            <Link
                                display="block"
                                href={`https://rinkeby.etherscan.io/address/${currentAccount}`}
                                target="_blank"
                                _focus={{
                                    boxShadow: 'none',
                                }}
                                fontSize="sm"
                                color="gray.600"
                            >
                                View on Etherscan &nbsp;
                                <ExternalLinkIcon />
                            </Link>

                            <Link
                                as="button"
                                display="block"
                                onClick={onCopyAddress}
                                target="_blank"
                                _focus={{
                                    boxShadow: 'none',
                                }}
                                fontSize="sm"
                                color="gray.600"
                            >
                                Copy Address &nbsp;
                                <CopyIcon />
                            </Link>
                        </Stack>
                    </ModalBody>

                    <ModalFooter
                        bgColor="main.200"
                        borderBottomRadius="lg"
                        borderBottomLeftRadius="lg"
                        textAlign="center"
                    >
                        <Button onClick={onChangeAccount}>Change Account</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};

export default Navbar;
