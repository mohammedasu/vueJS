import Vue from "vue";
import App from "./App.vue";
import BootstrapVue from "bootstrap-vue";
import VueApexCharts from "vue-apexcharts";
import Vuelidate from "vuelidate";
import VueSweetalert2 from "vue-sweetalert2";
import VueMask from "v-mask";
import * as VueGoogleMaps from "vue2-google-maps";
import VueYoutube from "vue-youtube";
import axios from "axios";
import vco from "v-click-outside";
import router from "./router";
import store from "@/state/store";
import i18n from "./i18n";
import "@/assets/scss/app.scss";
var CryptoJS = require("crypto-js");
Vue.config.productionTip = false;
Vue.use(VueYoutube);
Vue.use(BootstrapVue);
Vue.use(vco);
Vue.use(Vuelidate);
Vue.use(VueSweetalert2);
Vue.use(VueMask);
Vue.use(require("vue-chartist"));
Vue.use(VueGoogleMaps, {
   load: {
      key: "google-api-key",
      libraries: "places",
   },
   installComponents: true,
});
Vue.directive("can", function (el, binding) {
   if (localStorage.getItem('token') != null) {
      const permissions = JSON.parse(CryptoJS.AES.decrypt(localStorage.getItem('token'), process.env.VUE_APP_ENCRYPTION_KEY).toString(CryptoJS.enc.Utf8)).permissions;
      if (permissions && permissions.indexOf(binding.value) === -1)
         el.style.display = "none";
   }
});
Vue.mixin({
   methods: {
      can: (key) => {
         if (localStorage.getItem('token') != null) {
            const permissions = JSON.parse(CryptoJS.AES.decrypt(localStorage.getItem('token'), process.env.VUE_APP_ENCRYPTION_KEY).toString(CryptoJS.enc.Utf8)).permissions;
            if (permissions.includes(key)) {
               return true;
            } else {
               return false;
            }
         }
      },
   },
});
Vue.component("apexchart", VueApexCharts);

if(process.env.VUE_APP_ENV == "local") {
   axios.defaults.baseURL = "http://127.0.0.1:8000/api";
} else if(process.env.VUE_APP_ENV == "development") {
   axios.defaults.baseURL = "https://devadmin-api.mymedisage.com/api";
} else if(process.env.VUE_APP_ENV == "staging") {
   axios.defaults.baseURL = "https://stagingadmin-api.mymedisage.com/api";
} else if(process.env.VUE_APP_ENV == "production") {
   axios.defaults.baseURL = "https://admin-api.mymedisage.com/api";
}


new Vue({
   router,
   store,
   i18n,
   render: (h) => h(App),
}).$mount("#app");

axios.interceptors.request.use((config) => {
   let token = '';
   if(localStorage.getItem('token') != '' && localStorage.getItem('token') != null){
      token = JSON.parse(CryptoJS.AES.decrypt(localStorage.getItem('token'), process.env.VUE_APP_ENCRYPTION_KEY).toString(CryptoJS.enc.Utf8)).token;
   }
   config.headers["Authorization"] = `Bearer ${token}`;
   config.headers["Cache-Control"] = `no-cache`;
   config.headers["Pragma"] = `no-cache`;
   return config;
});