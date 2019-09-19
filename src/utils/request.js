import axios from 'axios';
import config from '../../config';
import { Message } from 'element-ui';
import store from '../store';
import router from '../router';

const server = axios.create({
    baseURL: process.env.NODE_ENV === 'production' ? config.build.BASE_URL : config.dev.BASE_URL, // url = base url + request url
    timeout: 5000 // request timeout
});

server.interceptors.request.use(config => {
    if (store.state.user.token) {
        config.headers['X-Token'] = store.state.user.token;
    }
    return config;
}, error => {
    console.log(error);
    return Promise.reject(error);
});

server.interceptors.response.use(response => {
    const res = response.data;
    if (res.code === 50014) {
        Message({
            message: res.msg || 'Error',
            type: 'error',
            duration: 5 * 1000
        });
        store.dispatch('user/logout').then(() => {
            router.push('/login');
        });
        return Promise.reject(new Error(res.msg));
    } else if (res.code === 1) {
        Message({
            message: res.msg || 'Error',
            type: 'error',
            duration: 5 * 1000
        });
        return Promise.reject(new Error(res.msg));
    } else {
        return res;
    }
});

export default server;
