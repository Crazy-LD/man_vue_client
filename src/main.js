import Vue from 'vue';
import App from './App.vue';
import router, { resetRouter } from './router';
import store from './store';
import 'normalize.css/normalize.css';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import NProgress from 'nprogress'; // Pregress
import 'nprogress/nprogress.css';// Progress 进度条 样式
import './styles';
import './assets/iconfont/iconfont';
import permissionDir from './directive/permission';
// 注册全局的指令v-permission
Vue.directive('permission', permissionDir);
Vue.use(ElementUI);

Vue.config.productionTip = false;

const whiteList = ['/login', '/register'];

router.beforeEach((to, from, next) => {
  NProgress.start();
  if (store.state.user.token) {
    if (to.path === '/login') {
      next({ path: '/' });
      NProgress.done();
    } else {
      if (store.state.permission.permissions.length === 0) {
        store.dispatch('user/getUserInfo').then((response) => {
          const { permissions } = response.data;
          store.dispatch('permission/generateRoutes', permissions).then(routes => {
            // 首先应该重置路由，将动态路由置空
            resetRouter();
            router.addRoutes(routes);
            next(to.path);
          });
        }).catch(err => {
          console.log(err);
        });
      } else {
        next();
      }
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next();
    } else {
      next('/login');
      NProgress.done(); // 在hash模式下 改变手动改变hash 重定向回来 不会触发afterEach 暂时hack方案 ps：history模式下无问题，可删除该行！
    }
  }
});

router.afterEach(() => {
  NProgress.done();
});

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
