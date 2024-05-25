import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

import "primevue/resources/themes/saga-blue/theme.css";
import "/node_modules/primeflex/primeflex.min.css";
import PrimeVue from "primevue/config";
import ApiUtils from "./util/apiUtil";

ApiUtils.init("http://localhost:3000");

const app = createApp(App);
app.use(router);
app.use(PrimeVue);
app.mount("#app");
