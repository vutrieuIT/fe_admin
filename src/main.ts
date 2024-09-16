import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

import "primevue/resources/themes/saga-blue/theme.css";
import "/node_modules/primeflex/primeflex.min.css";
import "primeicons/primeicons.css";
import PrimeVue from "primevue/config";
import ToastService from "primevue/toastservice";
import ConfirmationService from "primevue/confirmationservice";
import ApiUtils from "./util/apiUtil";
import mitt from "mitt";

declare global {
  interface Window {
    __API_URL__: string;
    __API_PREDICT_URL__: string;
  }
}

console.log("API URL: ", window.__API_URL__);

ApiUtils.init(
  window.__API_URL__ ? window.__API_URL__ : "http://localhost:8001"
);
const eventBus = mitt();

const app = createApp(App);
app.use(router);
app.use(PrimeVue);
app.use(ToastService);
app.use(ConfirmationService);
app.provide("eventBus", eventBus);
app.mount("#app");
