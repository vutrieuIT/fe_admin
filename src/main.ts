import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

import "primevue/resources/themes/saga-blue/theme.css";
import "/node_modules/primeflex/primeflex.min.css";
import "primeicons/primeicons.css";
import PrimeVue from "primevue/config";
import ToastService from "primevue/toastservice";
import ApiUtils from "./util/apiUtil";
import mitt from "mitt";

ApiUtils.init(
  process.env.VUE_APP_SERVER_URL
    ? process.env.VUE_APP_SERVER_URL
    : "http://localhost:8001"
);
const eventBus = mitt();

const app = createApp(App);
app.use(router);
app.use(PrimeVue);
app.use(ToastService);
app.provide("eventBus", eventBus);
app.mount("#app");
