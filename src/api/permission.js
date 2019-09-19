import request from '../utils/request';

export const getPermissionOps = () => (request({
    url: '/permission/getpermissionops',
    method: 'get'
}));
