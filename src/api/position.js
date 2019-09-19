import request from '../utils/request';

export const find = query => (request({
    url: '/position/find',
    method: 'get',
    params: query
}));

export const batchChangeStatus = data => (request({
    url: '/position/batchchangestatus',
    method: 'post',
    data
}));
export const add = data => (request({
    url: '/position/add',
    method: 'post',
    data
}));
export const update = data => (request({
    url: '/position/update',
    method: 'post',
    data
}));