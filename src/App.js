import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import Navbar from './components/Navbar';
import Layout from './components/Layout';

import Home from './pages/Home';
import Collection from './pages/Collection';

/*
    TODO:
    - Add placeholder image for optimistic UI
    - Add page for showing all mints
    - Add FAQ section
*/

const App = () => {
    return (
        <Router>
            <Navbar />
            <Layout>
                <Switch>
                    <Route exact path="/" component={Home} />
                    <Route exact path="/collection" component={Collection} />
                </Switch>
            </Layout>
        </Router>
    );
};

export default App;
