import React from 'react';
import { Flex, Text, Skeleton } from '@chakra-ui/react';
import CollectionItem from '../components/CollectionItem';
import { useGetMintedNFTsQuery } from '../store/api/mintedNFTsApi';

const CONTRACT_ADDRESS = '0xeE2AA996B91154c1cbbc132CC26b9A108F32EAbc';

const Collection = () => {
    const { data, error, isLoading } = useGetMintedNFTsQuery(CONTRACT_ADDRESS);

    if (error) {
        return <Text>{error}</Text>;
    }

    const collectionItems = data?.assets.map((item) => (
        <CollectionItem
            key={item.name}
            name={item.name}
            owner={item.owner.address}
            href={item.permalink}
            image={item.image_url}
        />
    ));

    return (
        <Skeleton startColor="#394a60" endColor="#121f2f" isLoaded={!isLoading}>
            <Text
                textAlign="center"
                fontWeight="bold"
                fontSize="50px"
                m={0}
                bgGradient="linear(43deg, #4158D0 0%, #C850C0 46%, #FFCC70 100%)"
                bgClip="text"
                mb={4}
            >
                The Current Textbox NFT Collection
            </Text>
            <Flex flexWrap="wrap" justifyContent="start">
                {collectionItems}
            </Flex>
        </Skeleton>
    );
};

export default Collection;
