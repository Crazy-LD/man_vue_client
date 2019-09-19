import Cookies from 'js-cookie';
import { register, login, getUserInfo, reset, find, update, add, batchChangeStatus, changePermissions } from '../../api/user';
import { statusDic } from '../../utils/dictionary';

const user = {
    namespaced: true,
    state: {
        token: Cookies.get('automenuToken'),
        status: 0,
        classifiedGradeId: 0,
        roleIds: [],
        _id: '',
        username: '',
        entryTime: '',
        name: '',
        sex: '男',
        email: '',
        phone: '',
        departmentId: '',
        positionId: '',
        users: [] // 所有的用户,用于用户管理使用
    },
    mutations: {
        SET_STATUS: (state, status) => {
            state.status = status;
        },
        SET_CLASSIFIEDGRADEID: (state, classifiedGradeId) => {
            state.classifiedGradeId = classifiedGradeId;
        },
        SET_ROLEIDS: (state, roleIds) => {
            state.roleIds = roleIds;
        },
        SET_ID: (state, _id) => {
            state._id = _id;
        },
        SET_USERNAME: (state, username) => {
            state.username = username;
        },
        SET_ENTRYTIME: (state, entryTime) => {
            state.entryTime = entryTime;
        },
        SET_TOKEN: (state, token) => {
            state.token = token;
        },
        SET_NAME: (state, name) => {
            state.name = name;
        },
        SET_SEX: (state, sex) => {
            state.sex = sex;
        },
        SET_EMAIL: (state, email) => {
            state.email = email;
        },
        SET_PHONE: (state, phone) => {
            state.phone = phone;
        },
        SET_DEPARTMENTID: (state, departmentId) => {
            state.departmentId = departmentId;
        },
        SET_POSITIONID: (state, positionId) => {
            state.positionId = positionId;
        },
        SET_USERS: (state, users) => {
            state.users = users;
        }
    },
    actions: {
        register({ commit }, userInfo) {
            return new Promise((resolve, reject) => {
                register(userInfo).then(response => {
                    const { data } = response;
                    commit('SET_TOKEN', data.token);
                    Cookies.set('automenuToken', data.token);
                    resolve();
                }).catch(e => {
                    reject(e);
                });
            });
        },
        getUserInfo({ commit }) {
            return new Promise((resolve, reject) => {
                getUserInfo().then(response => {
                    const { user } = response.data;
                    commit('SET_STATUS', user.status);
                    commit('SET_CLASSIFIEDGRADEID', user.classifiedGradeId);
                    commit('SET_ROLEIDS', user.roleIds);
                    commit('SET_ID', user._id);
                    commit('SET_USERNAME', user.username);
                    commit('SET_ENTRYTIME', user.entryTime);
                    commit('SET_NAME', user.name);
                    commit('SET_SEX', user.sex);
                    commit('SET_EMAIL', user.email);
                    commit('SET_PHONE', user.phone);
                    commit('SET_DEPARTMENTID', user.departmentId);
                    commit('SET_POSITIONID', user.positionId);
                    resolve(response);
                }).catch(e => {
                    reject(e);
                });
            });
        },
        login({ commit }, userInfo) {
            return new Promise((resolve, reject) => {
                login(userInfo).then(response => {
                    const { data } = response;
                    commit('SET_TOKEN', data.token);
                    Cookies.set('automenuToken', data.token);
                    resolve();
                }).catch(e => {
                    reject(e);
                });
            });
        },
        logout({ commit }) {
            return new Promise(resolve => {
                commit('SET_TOKEN', '');
                commit('permission/SET_PERMISSIONS', [], { root: true });
                Cookies.remove('automenuToken');
                resolve();
            });
        },
        reset({ commit }, data) {
            return new Promise((resolve, reject) => {
                reset(data).then(() => {
                    commit('SET_TOKEN', '');
                    commit('permission/SET_PERMISSIONS', [], { root: true });
                    Cookies.remove('automenuToken');
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
                    commit('SET_USERS', data);
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
                    const result = JSON.parse(JSON.stringify(state.users));
                    const index = result.findIndex(item => item._id === _id);
                    result[index] = data;
                    commit('SET_USERS', result);
                    resolve();
                }).catch((e) => {
                    reject(e);
                });
            });
        },
        add({ commit, state }, data) {
            return new Promise((resolve, reject) => {
                add(data).then(response => {
                    const { data } = response;
                    commit('SET_USERS', [...state.users, data]);
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
                    let result = [...state.users];
                    for (const item of result) {
                        if (ids.some(id => id === item._id)) {
                            item.status = status;
                            item.statusName = statusDic[status];
                        }
                    }
                    commit('SET_USERS', result);
                    resolve(response);
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
                    const result = JSON.parse(JSON.stringify(state.users));
                    const index = result.findIndex(item => item._id === _id);
                    result[index] = data;
                    commit('SET_USERS', result);
                    resolve();
                }).catch((e) => {
                    reject(e);
                });
            });
        },
    }
};
export default user;