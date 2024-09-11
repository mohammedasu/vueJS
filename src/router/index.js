import Vue from 'vue'
import VueRouter from 'vue-router'
import VueMeta from 'vue-meta'
import routes from './routes'
var CryptoJS = require("crypto-js");
Vue.use(VueRouter);
Vue.use(VueMeta, {
  keyName: 'page',
})
const router = new VueRouter({
  routes,
  mode: 'history',
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  },
});

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.authRequired)) {
    if (localStorage.getItem('token') != null) {
    if (JSON.parse(CryptoJS.AES.decrypt(localStorage.getItem('token'), process.env.VUE_APP_ENCRYPTION_KEY).toString(CryptoJS.enc.Utf8)).token == null) {
      next({
      name: 'login',
        params: { nextUrl: to.fullPath }
      });
    } 
    else if(JSON.parse(CryptoJS.AES.decrypt(localStorage.getItem('token'), process.env.VUE_APP_ENCRYPTION_KEY).toString(CryptoJS.enc.Utf8)).role == 'superadmin'){
      next();
    } else if((JSON.parse(CryptoJS.AES.decrypt(localStorage.getItem('token'), process.env.VUE_APP_ENCRYPTION_KEY).toString(CryptoJS.enc.Utf8)).permissions == null || JSON.parse(CryptoJS.AES.decrypt(localStorage.getItem('token'), process.env.VUE_APP_ENCRYPTION_KEY).toString(CryptoJS.enc.Utf8)).permissions == '')) {
      next('/permission-denied');
    } else {
      if (to.matched.some((record) => record.meta.permission)) {
        let authorized = userHasPermission(to.meta.permission);
        if (authorized) {
          next();
        } else {
          next('/permission-denied');
        }
      } else {
        next();
      }
    }
  }else {
    if (to.name === 'login') 
        return next();
      next('/');
  }
  } else if (to.matched.some((record) => record.meta.guest)) {
      if (localStorage.getItem('token') == null) {
        if (to.name === 'login') 
          return next();
        next('/');
    } else if((JSON.parse(CryptoJS.AES.decrypt(localStorage.getItem('token'), process.env.VUE_APP_ENCRYPTION_KEY).toString(CryptoJS.enc.Utf8)).permissions == null || JSON.parse(CryptoJS.AES.decrypt(localStorage.getItem('token'), process.env.VUE_APP_ENCRYPTION_KEY).toString(CryptoJS.enc.Utf8)).permissions == '')){
        if (to.name === 'permission-denied') 
          return next();
        next('/permission-denied');
    } else {
      if (to.name === 'permission-denied') 
        return next();
      else if (to.name === 'login') 
        return next({ name: "dashboard" });
      next({ name: "dashboard" });
    }
  } else {
    next();
  }
});
function userHasPermission(requirePermission) {
  
  if(JSON.parse(CryptoJS.AES.decrypt(localStorage.getItem('token'), process.env.VUE_APP_ENCRYPTION_KEY).toString(CryptoJS.enc.Utf8)).role != 'superadmin'){
    let permissions = JSON.parse(CryptoJS.AES.decrypt(localStorage.getItem('token'), process.env.VUE_APP_ENCRYPTION_KEY).toString(CryptoJS.enc.Utf8)).permissions;
    if(permissions != '' && permissions != null) {
      if (permissions.indexOf(requirePermission) === -1) return false;
      else return true;
    } else {
      return false;
    }
  } else {
    return true;
  }
}
export default router
