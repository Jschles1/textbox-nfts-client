import React from 'react';
import { Box, Image, Link } from '@chakra-ui/react';
import truncateEthAddress from 'truncate-eth-address';

const CollectionItem = ({ image, name, owner, href }) => {
    return (
        <Box
            maxW="sm"
            borderWidth="1px"
            borderRadius="lg"
            overflow="hidden"
            flexBasis="19%"
            mb={4}
            boxShadow="sm"
            borderColor="#394a60"
            mr="1%"
        >
            <Link href={href} target="_blank">
                <Image src={image} alt={name} />
            </Link>

            <Box p={6} bgColor="#121f2f">
                {/* <Box display="flex" alignItems="baseline">
                    <Badge borderRadius="full" px="2" colorScheme="teal">
                        New
                    </Badge>
                    <Box
                        color="gray.500"
                        fontWeight="semibold"
                        letterSpacing="wide"
                        fontSize="xs"
                        textTransform="uppercase"
                        ml="2"
                    >
                        {name}
                    </Box>
                </Box> */}

                <Link
                    display="block"
                    mt="1"
                    fontWeight="semibold"
                    as="h4"
                    lineHeight="tight"
                    isTruncated
                    target="_blank"
                >
                    {name}
                </Link>

                <Box whiteSpace="nowrap">
                    Owner: &nbsp;
                    <Link
                        href={`https://testnets.opensea.io/${owner}`}
                        color="gray.600"
                        isTruncated
                        textOverflow="ellipsis"
                        display="inline-block"
                        maxW="145px"
                        verticalAlign="top"
                        target="_blank"
                    >
                        {truncateEthAddress(owner)}
                    </Link>
                </Box>

                {/* <Box display="flex" mt="2" alignItems="center">
                    {Array(5)
                        .fill('')
                        .map((_, i) => (
                            <StarIcon key={i} color={i < property.rating ? 'teal.500' : 'gray.300'} />
                        ))}
                    <Box as="span" ml="2" color="gray.600" fontSize="sm">
                        {property.reviewCount} reviews
                    </Box>
                </Box> */}
            </Box>
        </Box>
    );
};

export default CollectionItem;
