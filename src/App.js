import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import Navbar from './components/Navbar';
import Layout from './components/Layout';

const Home = React.lazy(() => import('./pages/Home'));
const Collection = React.lazy(() => import('./pages/Collection'));

/*
    TODO:
    - Add placeholder image for optimistic UI
    - Add FAQ section
*/

const App = () => {
    return (
        <React.Suspense fallback={<>...</>}>
            <Router>
                <Navbar />
                <Layout>
                    <Switch>
                        <Route exact path="/" component={Home} />
                        <Route exact path="/collection" component={Collection} />
                    </Switch>
                </Layout>
            </Router>
        </React.Suspense>
    );
};

export default App;
