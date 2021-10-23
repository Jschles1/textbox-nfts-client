import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import theme from '@chakra-ui/theme';

import App from './App';
import store from './store';

const customTheme = extendTheme({
    ...theme,
    styles: {
        ...theme.styles,
        global: (props) => ({
            ...theme.styles.global,
            body: {
                ...theme.styles.global.body,
                bg: '#0d1116',
                color: 'white',
                overflowX: 'hidden',
            },
        }),
    },
    colors: {
        main: {
            100: '#0d1116',
            200: '#121f2f',
            300: '#394a60',
        },
    },
});

ReactDOM.render(
    <React.StrictMode>
        <ChakraProvider theme={customTheme}>
            <Provider store={store}>
                <App />
            </Provider>
        </ChakraProvider>
    </React.StrictMode>,
    document.getElementById('root')
);
