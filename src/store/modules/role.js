import { find, batchChangeStatus, add, update, changePermissions } from '../../api/role';
import { statusDic } from '../../utils/dictionary';
const role = {
    namespaced: true,
    state: {
        roles: []
    },
    mutations: {
        SET_ROLES(state, roles) {
            state.roles = roles;
        }
    },
    actions: {
        find({ commit }, query) {
            return new Promise((resolve, reject) => {
                find(query).then(response => {
                    const { data } = response;
                    commit('SET_ROLES', data);
                    resolve();
                }).catch(() => {
                    reject();
                });
            });
        },
        batchChangeStatus({ commit, state }, dtoData) {
            return new Promise((resolve, reject) => {
                batchChangeStatus(dtoData).then(response => {
                    const { ids, status } = dtoData;
                    let result = [...state.roles];
                    for (const item of result) {
                        if (ids.some(id => id === item._id)) {
                            item.status = status;
                            item.statusName = statusDic[status];
                        }
                    }
                    commit('SET_ROLES', result);
                    resolve(response);
                }).catch((e) => {
                    reject(e);
                });
            });
        },
        add({ commit, state }, data) {
            return new Promise((resolve, reject) => {
                add(data).then(response => {
                    const { data } = response;
                    commit('SET_ROLES', [...state.roles, data]);
                    resolve();
                }).catch(() => {
                    reject();
                });
            });
        },
        update({ commit, state }, dtoData) {
            return new Promise((resolve, reject) => {
                update(dtoData).then(response => {
                    const { data } = response;
                    const { _id } = dtoData;
                    const result = JSON.parse(JSON.stringify(state.roles));
                    const index = result.findIndex(item => item._id === _id);
                    result[index] = data;
                    commit('SET_ROLES', result);
                    resolve();
                }).catch((e) => {
                    reject(e);
                });
            });
        },
        changePermissions({ commit, state }, dtoData) {
            return new Promise((resolve, reject) => {
                changePermissions(dtoData).then(response => {
                    const { data } = response;
                    const { _id } = dtoData;
                    const result = JSON.parse(JSON.stringify(state.roles));
                    const index = result.findIndex(item => item._id === _id);
                    result[index] = data;
                    commit('SET_ROLES', result);
                    resolve();
                }).catch((e) => {
                    reject(e);
                });
            });
        }
    }
};
export default role;