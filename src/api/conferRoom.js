import request from '../utils/request';

export const add = data => (request({
    url: '/conferroom/add',
    method: 'post',
    data
}));

export const find = query => (request({
    url: '/conferroom/find',
    method: 'get',
    params: query
}));
export const batchChangeStatus = data => (request({
    url: '/conferroom/batchchangestatus',
    method: 'post',
    data
}));
export const update = data => (request({
    url: '/conferroom/update',
    method: 'post',
    data
}));