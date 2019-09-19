import { add, getDepartOps, batchChangeStatus, update, find } from '../../api/department';
import { statusDic } from '../../utils/dictionary';

const department = {
    namespaced: true,
    state: {
        departments: [],
        departOps: []
    },
    mutations: {
        SET_DEPARTMENTS(state, departments) {
            state.departments = departments;
        },
        SET_DEPARTOPS(state, departOps) {
            state.departOps = departOps;
        }
    },
    actions: {
        add({ commit, state }, data) {
            return new Promise((resolve, reject) => {
                add(data).then(response => {
                    const { data } = response;
                    commit('SET_DEPARTMENTS', [...state.departments, data.department]);
                    commit('SET_DEPARTOPS', data.departmentOpt.departmentOptions);
                    resolve();
                }).catch(() => {
                    reject();
                });
            });
        },
        getDepartOps({ commit }) {
            return new Promise((resolve, reject) => {
                getDepartOps().then(response => {
                    const { data } = response;
                    commit('SET_DEPARTOPS', data.departmentOptions);
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
                    let result = [...state.departments];
                    for (const item of result) {
                        if (ids.some(id => id === item._id)) {
                            item.status = status;
                            item.statusName = statusDic[status];
                        }
                    }
                    commit('SET_DEPARTMENTS', result);
                    resolve(response);
                }).catch((e) => {
                    reject(e);
                });
            });
        },
        update({ commit, state }, dtoData) {
            return new Promise((resolve, reject) => {
                update(dtoData).then(response => {
                    const { data } = response;
                    commit('SET_DEPARTOPS', data.departmentOpt.departmentOptions);

                    const { _id } = dtoData;
                    const result = [...state.departments];
                    const index = result.findIndex(item => item._id === _id);
                    result[index] = data.department;
                    commit('SET_DEPARTMENTS', result);
                    resolve();
                }).catch((e) => {
                    reject(e);
                });
            });
        },
        find({ commit }, query) {
            return new Promise((resolve, reject) => {
                find(query).then(response => {
                    const { data } = response;
                    commit('SET_DEPARTMENTS', data);
                    resolve();
                }).catch(() => {
                    reject();
                });
            });
        },
    }
};
export default department;