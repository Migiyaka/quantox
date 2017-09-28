import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

import server from './modules/serverModule.js';
import app from './modules/appModule.js';

const store = new Vuex.Store({
    modules: {
        server,
        app
    }
});

export default store;