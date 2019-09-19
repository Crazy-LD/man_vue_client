import { find, batchChangeStatus, add, update } from '../../api/position';
import { statusDic } from '../../utils/dictionary';
const position = {
    namespaced: true,
    state: {
        positions: []
    },
    mutations: {
        SET_POSITIONS(state, positions) {
            state.positions = positions;
        }
    },
    actions: {
        find({ commit }, query) {
            return new Promise((resolve, reject) => {
                find(query).then(response => {
                    const { data } = response;
                    commit('SET_POSITIONS', data);
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
                    let result = [...state.positions];
                    for (const item of result) {
                        if (ids.some(id => id === item._id)) {
                            item.status = status;
                            item.statusName = statusDic[status];
                        }
                    }
                    commit('SET_POSITIONS', result);
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
                    commit('SET_POSITIONS', [...state.positions, data]);
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
                    const result = JSON.parse(JSON.stringify(state.positions));
                    const index = result.findIndex(item => item._id === _id);
                    result[index] = data;
                    commit('SET_POSITIONS', result);
                    resolve();
                }).catch((e) => {
                    reject(e);
                });
            });
        }
    }
};
export default position;