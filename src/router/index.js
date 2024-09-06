import { route } from "quasar/wrappers";
import {
  createRouter,
  createMemoryHistory,
  createWebHistory,
  createWebHashHistory,
} from "vue-router";
import routes from "./routes";
import { useUserStore } from "../stores";
/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default route(function (/* { store, ssrContext } */) {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : process.env.VUE_ROUTER_MODE === "history"
      ? createWebHistory
      : createWebHashHistory;

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,

    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createHistory(process.env.VUE_ROUTER_BASE),
  });
  // 檢查登入狀態
  const loginUser = useUserStore();
  var home = process.env.deployPath || '';
  Router.beforeEach((to, from, next) => {
    console.log("to.fullPath: ", to.fullPath);
    console.log("to.path: ", to.path);
    console.log("to.href: ", to.href);
    // 標題
    document.title = to.meta.title || '數位鎏聚合支付管理後台';
    if (to.path.startsWith("/Pay")) {
      next();
    }
    if (to.path.startsWith("/Point")) {
      next();
    }
    if (!to.path.startsWith("/Login") && !loginUser.username) {
      if (!to.path.includes('/Pay/') && !to.path.includes('/Point/')) {
        alert("請先登入");
        next("/Login");
      }
    } else {
      next();
    }
  });
  return Router;
});
