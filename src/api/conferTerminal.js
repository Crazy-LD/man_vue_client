import request from '../utils/request';

export const add = data => (request({
    url: '/conferterminal/add',
    method: 'post',
    data
}));

export const find = query => (request({
    url: '/conferterminal/find',
    method: 'get',
    params: query
}));
export const batchChangeStatus = data => (request({
    url: '/conferterminal/batchchangestatus',
    method: 'post',
    data
}));
export const update = data => (request({
    url: '/conferterminal/update',
    method: 'post',
    data
}));