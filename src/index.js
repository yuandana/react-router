import CreateReactRouterConfiguration from './create-react-router-configuration.js';

class RouterX {
    constructor(__config) {
        this.__config = __config;
        this.__beforeEachCache = null;
        this.__afterEachCache = null;
        this.__onUpdateCache = null;
        this.__config = {};
    }

    /**
     *
     */
    get reactRouter() {
        const {
            __config,
            __beforeEachCache,
            __afterEachCache,
            __onUpdateCache
        } = this;
        return CreateReactRouterConfiguration(
            __config,
            __beforeEachCache,
            __afterEachCache,
            __onUpdateCache
        );
    }

    beforeEach(callback) {
        this.__beforeEachCache = callback;
    }

    afterEach(callback) {
        this.__afterEachCache = callback;
    }

    onUpdate(callback) {
        this.__onUpdateCache = callback;
    }
}

export default RouterX;
