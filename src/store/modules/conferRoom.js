import { add, find, batchChangeStatus, update } from '../../api/conferRoom';
import { statusDic } from '../../utils/dictionary';
const conferRoom = {
    namespaced: true,
    state: {
        conferRooms: []
    },
    mutations: {
        SET_CONFERROOMS(state, conferRooms) {
            state.conferRooms = conferRooms;
        }
    },
    actions: {
        add({ commit, state }, data) {
            return new Promise((resolve, reject) => {
                add(data).then(response => {
                    const { data } = response;
                    commit('SET_CONFERROOMS', [...state.conferRooms, data]);
                    resolve();
                }).catch(() => {
                    reject();
                });
            });
        },
        find({ commit }, query) {
            return new Promise((resolve, reject) => {
                find(query).then(response => {
                    const { data } = response;
                    commit('SET_CONFERROOMS', data);
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
                    let result = JSON.parse(JSON.stringify(state.conferRooms));
                    for (const item of result) {
                        if (ids.some(id => id === item._id)) {
                            item.status = status;
                            item.statusName = statusDic[status];
                        }
                    }
                    commit('SET_CONFERROOMS', result);
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
                    const { _id } = dtoData;
                    const result = JSON.parse(JSON.stringify(state.conferRooms));
                    const index = result.findIndex(item => item._id === _id);
                    result[index] = data;
                    commit('SET_CONFERROOMS', result);
                    resolve();
                }).catch((e) => {
                    reject(e);
                });
            });
        }
    }
};
export default conferRoom;