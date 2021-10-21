import React from 'react';
import { Button, keyframes } from '@chakra-ui/react';

const CustomButton = ({ type, onClick, children }) => {
    const gradient =
        type === 'mint' ? 'linear(43deg, #4158D0 0%, #C850C0 46%, #FFCC70 100%)' : 'linear(to-l, #a200d6, #ff6fdf)';

    const gradientAnimation = keyframes`
        0% {
            background-position: 0% 50%;
        }
        50% {
            background-position: 100% 50%;
        }
        100% {
            background-position: 0% 50%;
        }
    `;

    const animation = `${gradientAnimation} 4s ease infinite`;

    return (
        <Button
            display="block"
            variant="outline"
            onClick={onClick}
            bgGradient={gradient}
            bgSize="200% 200%"
            animation={animation}
            border={0}
            h="45px"
            mx="auto"
            width="auto"
            px="40px"
            borderRadius="100px"
            cursor="pointer"
            fontSize="16px"
            fontWeight="bold"
            color="white"
            _hover={{
                bgGradient: gradient,
                bgSize: '200% 200%',
                animation: animation,
            }}
        >
            {children}
        </Button>
    );
};

export default CustomButton;
