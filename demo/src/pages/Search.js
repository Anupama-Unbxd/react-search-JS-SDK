import React, { useState, useContext } from 'react';
import UnbxdSearchWrapper from '@unbxd-ui/react-search-sdk';
import { Route, useHistory, useLocation } from 'react-router-dom';
import Strings from './Strings';
import Balls from './Balls';
import Accessories from './Accessories';
import Grips from './Grips';
import Home from './Home';
import { ProductTypeContext } from '../context';
import { searchConfigurations } from '../config';
import MobileModal from '../components/MobileModal';
import SearchBar from '../components/SearchBar';
import { scrollTop } from '../utils';

export const getCategoryId = () => {
    if (window.UnbxdAnalyticsConf && window.UnbxdAnalyticsConf['page']) {
        return encodeURIComponent(window.UnbxdAnalyticsConf['page']);
    }
};

export const LoaderComponent = () => {
    return (
        <div className="overlay">
            <div className="overlay__inner">
                <div className="overlay__content">
                    <span className="spinner" />
                </div>
            </div>
        </div>
    );
};

export const ErrorComponent = () => {
    return <div>Something went wrong.</div>;
};

const Search = () => {
    const { productType, setProductType } = useContext(ProductTypeContext);
    const [refreshId, setRefreshId] = useState(1);
    const [showFilters, setShowFilters] = useState(false);
    const [configs, setConfigs] = useState(searchConfigurations);
    const routeHistory = useHistory();
    const routeLocation = useLocation();

    const handleClose = () => setShowFilters(false);
    const handleShow = () => setShowFilters(true);

    const handleChange = () => {
        setConfigs({
            ...searchConfigurations,
            defaultFilters: { flag: 'article' }
        });
    };

    const handleRouteChange = (searchObj, hash, refreshId) => {
        scrollTop();
        const { state = {} } = searchObj;
        const { responseObj = {} } = state;
        const { redirect = {} } = responseObj;
        const { type = '', value } = redirect;
        const urlParams = searchObj.getQueryParams();
        // check if it is the home page and we don't have any query params on the url.
        // return false to ensure sdk makes no further search calls
        if (
            routeLocation.pathname === '/' &&
            Object.keys(urlParams).length === 0 &&
            refreshId
        ) {
            return false;
        } else if (
            // check for redirects
            type === 'url' &&
            typeof value === 'string' &&
            value.length > 0
        ) {
            // if hash already exists, to retain the current state, push on history
            if (routeLocation.pathname === '/' && routeLocation.hash) {
                routeHistory.push(value);
            } else {
                routeHistory.replace(value);
            }
            return true;
        } else {
            // if hash already exists, to retain the current state, push on history
            if (routeLocation.hash && routeHistory.action !== 'POP') {
                routeHistory.push(`${routeLocation.pathname}#${hash}`);
            } else if (hash) {
                routeHistory.replace(`${routeLocation.pathname}#${hash}`);
            }
            return true;
        }
    };

    return (
        <UnbxdSearchWrapper
            siteKey="prod-wexphotovideo12641621579820"
            apiKey="b75cd508567ce3307238189e00592ae5"
            getCategoryId={getCategoryId}
            searchConfigurations={configs}
            productType={productType}
            refreshId={refreshId}
            loaderComponent={<LoaderComponent />}
            errorComponent={<ErrorComponent />}
            onRouteChange={handleRouteChange}
        >
            <MobileModal showFilters={showFilters} handleClose={handleClose} />
            <SearchBar
                onProductTypeChange={setProductType}
                productType={productType}
                handleShow={handleShow}
                refreshId={refreshId}
                setRefreshId={setRefreshId}
            />
            <button type="button" onClick={handleChange}>
                change
            </button>
            <Route exact path="/">
                <Home setRefreshId={setRefreshId} />
            </Route>
            <Route exact path="/strings">
                <Strings />
            </Route>
            <Route exact path="/balls">
                <Balls />
            </Route>
            <Route exact path="/accessories">
                <Accessories />
            </Route>
            <Route path="/grips">
                <Grips />
            </Route>
        </UnbxdSearchWrapper>
    );
};

export default Search;
