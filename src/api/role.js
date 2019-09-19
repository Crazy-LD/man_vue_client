import request from '../utils/request';

export const find = query => (request({
    url: '/role/find',
    method: 'get',
    params: query
}));

export const batchChangeStatus = data => (request({
    url: '/role/batchchangestatus',
    method: 'post',
    data
}));
export const add = data => (request({
    url: '/role/add',
    method: 'post',
    data
}));

export const update = data => (request({
    url: '/role/update',
    method: 'post',
    data
}));

export const changePermissions = data => (request({
    url: '/role/changepermissions',
    method: 'post',
    data
}));