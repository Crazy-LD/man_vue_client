import request from '../utils/request';

export const add = data => (request({
    url: '/department/add',
    method: 'post',
    data
}));

export const getDepartOps = () => (request({
    url: '/department/getdepartops',
    method: 'get'
}));


export const batchChangeStatus = data => (request({
    url: '/department/batchchangestatus',
    method: 'post',
    data
}));

export const update = data => (request({
    url: '/department/update',
    method: 'post',
    data
}));

export const find = query => (request({
    url: '/department/find',
    method: 'get',
    params: query
}));