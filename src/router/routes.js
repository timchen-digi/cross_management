const Management = { template: "<div>管理後臺</div>" };
import { useUserStore } from "../stores";
const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      { path: "/", component: () => import("pages/HomePage.vue") },
      { path: "Wallet", component: () => import("pages/WalletPage.vue") },
      { path: "Merchant", component: () => import("pages/MerchantPage.vue") },
      { path: "Pay", component: () => import("pages/PayPage.vue") },
      {
        path: "Checkout",
        component: () => import("pages/PayPageCheckout.vue"),
      },
      { path: "Confirm", component: () => import("pages/PayPageConfirm.vue") },
      { path: "Home", component: () => import("pages/HomePage.vue") },
      { path: "History", component: () => import("pages/HistoryPage.vue") },
      { path: "Logout", component: () => import("pages/LogoutPage.vue") },
    ],
  },
  {
    path: "/Login",
    component: () => import("layouts/LoginLayout.vue"),
    children: [
      { path: "", component: () => import("pages/LoginPage.vue") },
      { path: "Register", component: () => import("pages/RegisterPage.vue") },
    ],
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
