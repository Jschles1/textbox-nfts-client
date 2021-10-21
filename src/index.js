import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { ChakraProvider } from '@chakra-ui/react';
import theme from '@chakra-ui/theme';

import App from './App';
import store from './store';

const customTheme = {
    ...theme,
    styles: {
        ...theme.styles,
        global: (props) => ({
            ...theme.styles.global,
            body: {
                ...theme.styles.global.body,
                bg: '#0d1116',
                color: 'white',
            },
        }),
    },
};

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
