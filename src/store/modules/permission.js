
import { constantRoutesMap, asyncRoutesMap } from '../../router';
import { getPermissionOps } from '../../api/permission';
import { deepClone } from '../../utils';

function hasPermission(permissions, route) {
    if (route.meta && route.meta.permission) {
        return permissions.some(permission => route.meta.permission.includes(permission));
    } else {
        return true;
    }
}

const permission = {
    namespaced: true,
    state: {
        routes: constantRoutesMap,
        addRoutes: [],
        permissionOps: [],
        permissions: [], // 当前用户的权限列表
    },
    mutations: {
        SET_ROUTES(state, routes) {
            state.routes = [...constantRoutesMap, ...routes];
            state.addRoutes = routes;
        },
        SET_PERMISSIONOPS(state, permissionOps) {
            state.permissionOps = permissionOps;
        },
        SET_PERMISSIONS(state, permissions) {
            state.permissions = permissions;
        }
    },
    actions: {
        generateRoutes({ commit }, permissions) {
            return new Promise((resolve) => {
                commit('SET_PERMISSIONS', permissions);
                const tempAsyncRoutes = deepClone(asyncRoutesMap);
                // const tempAsyncRoutes = JSON.parse(JSON.stringify(asyncRoutesMap)); 该方式会使路由相关的页面报错，原因未知
                const routes = tempAsyncRoutes.filter(route => {
                    if (hasPermission(permissions, route)) {
                        if (route.children && route.children.length > 0 && !route.noDropMenu) {
                            route.children = route.children.filter(r => {
                                return hasPermission(permissions, r);
                            });
                        }
                        return true;
                    }
                    return false;

                });
                commit('SET_ROUTES', routes);
                resolve(routes);
            });

        },
        getPermissionOps({ commit }) {
            return new Promise((resolve, reject) => {
                getPermissionOps().then(response => {
                    const { data } = response;
                    commit('SET_PERMISSIONOPS', data.permissionOptions);
                    resolve();
                }).catch(() => {
                    reject();
                });
            });
        }
    }
};
export default permission;