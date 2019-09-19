import request from '../utils/request';
export const register = data => (request({
    url: '/user/register',
    method: 'post',
    data
}));

export const login = data => (request({
    url: '/user/login',
    method: 'post',
    withCredentials: true,
    data
}));

export const getUserInfo = () => (request({
    url: '/user/getuserinfo',
    method: 'get'
}));

export const reset = data => (request({
    url: '/user/reset',
    method: 'post',
    data
}));

export const find = query => (request({
    url: '/user/find',
    method: 'get',
    params: query
}));

export const update = data => (request({
    url: '/user/update',
    method: 'post',
    data
}));
export const add = data => (request({
    url: '/user/add',
    method: 'post',
    data
}));
export const batchChangeStatus = data => (request({
    url: '/user/batchchangestatus',
    method: 'post',
    data
}));
export const changePermissions = data => (request({
    url: '/user/changepermissions',
    method: 'post',
    data
}));