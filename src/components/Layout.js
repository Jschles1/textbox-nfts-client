import React from 'react';
import { Box } from '@chakra-ui/layout';

const Layout = ({ children }) => (
    <Box maxW="1440px" p={4} mx="auto" bgColor="#0d1116">
        {children}
    </Box>
);

export default Layout;
