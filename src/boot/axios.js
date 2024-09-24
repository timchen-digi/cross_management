import { boot } from "quasar/wrappers";
import axios from "axios";

// 後端路徑
// 從quasar.config.js設定

let api;
let pointApi;
if (process.env.DEV) {
  api = axios.create({ baseURL: process.env.API_BASE_DEV });
  pointApi = axios.create({ baseURL: process.env.POINT_API_BASE_DEV });
}
else {
  api = axios.create({ baseURL: process.env.API_BASE_PROD });
  pointApi = axios.create({ baseURL: process.env.POINT_API_BASE_PROD });
}
export default boot(({ app }) => {
  // for use inside Vue files (Options API) through this.$axios and this.$api

  app.config.globalProperties.$axios = axios;
  // ^ ^ ^ this will allow you to use this.$axios (for Vue Options API form)
  //       so you won't necessarily have to import axios in each vue file

  app.config.globalProperties.$api = api;
  // ^ ^ ^ this will allow you to use this.$api (for Vue Options API form)
  //       so you can easily perform requests against your app's API
});

export { axios, api, pointApi };
