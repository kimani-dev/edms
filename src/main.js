import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import vuetify from "./plugins/vuetify";
import moment from "vue-moment";

// pinia store
import { createPinia, PiniaVuePlugin } from "pinia";
import { createPersistedStatePlugin } from "pinia-plugin-persistedstate-2";

Vue.config.productionTip = false;
Vue.use(moment);
Vue.use(PiniaVuePlugin);
Vue.component("pdf-viewer", import("@/components/PdfViewer.vue"));

const pinia = createPinia();
pinia.use(createPersistedStatePlugin());

new Vue({
  router,
  vuetify,
  pinia,
  render: (h) => h(App),
}).$mount("#app");
