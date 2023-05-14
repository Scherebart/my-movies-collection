import { createApp, ref, watch } from "vue";

import App from "./App.vue";

const app = createApp(App);

app.config.errorHandler = function (err, instance, info) {
  console.error("Uncaught error", err);
};

const LOCAL_STORAGE_JWT_TOKEN = "jwtToken";
let savedJwtToken = null;
if (window.localStorage) {
  savedJwtToken = localStorage.getItem(LOCAL_STORAGE_JWT_TOKEN);
}
const jwtToken = ref(savedJwtToken);
app.provide("jwtToken", jwtToken);
watch(
  jwtToken,
  () => {
    if (window.localStorage) {
      if (jwtToken.value) {
        localStorage.setItem(LOCAL_STORAGE_JWT_TOKEN, jwtToken.value);
      } else {
        localStorage.removeItem(LOCAL_STORAGE_JWT_TOKEN);
      }
    }
  },
  { immediate: false }
);

app.mount("#app");
