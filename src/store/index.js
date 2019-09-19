import Vue from 'vue';
import Vuex from 'vuex';
import app from './modules/app';
import user from './modules/user';
import permission from './modules/permission';
import department from './modules/department';
import role from './modules/role';
import position from './modules/position';
import conferRoom from './modules/conferRoom';
import conferTerminal from './modules/conferTerminal';
import getters from './getters';

Vue.use(Vuex);

const store = new Vuex.Store({
    modules: {
        app,
        user,
        permission,
        department,
        role,
        position,
        conferRoom,
        conferTerminal
    },
    getters,
    state: {
        number: 0
    }
});


export default store;

