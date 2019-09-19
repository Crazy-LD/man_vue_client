const app = {
    namespaced: true,
    state: {
        isCollapse: false
    },
    mutations: {
        SET_ISCOLLAPSE(state, isCollapse) {
            state.isCollapse = isCollapse;
        }
    }
};

export default app;