import React from 'react';
import { Box } from '@chakra-ui/layout';

const Layout = ({ children }) => (
    <Box maxW="1440px" p={4} mx="auto" bgColor="main.100">
        {children}
    </Box>
);

export default Layout;
