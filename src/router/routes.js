const Management = { template: "<div>管理後臺</div>" };

const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      { path: "Wallet", component: () => import("pages/WalletPage.vue") },
      { path: "Merchant", component: () => import("pages/MerchantPage.vue") },
      { path: "Pay", component: () => import("pages/PayPage.vue") },
      { path: "Home", component: () => import("pages/HomePage.vue") },
      { path: "History", component: () => import("pages/HistoryPage.vue") },
    ],
  },
  {
    path: "/Login",
    component: () => import("layouts/LoginLayout.vue"),
    children: [
      { path: "Index", component: () => import("pages/LoginPage.vue") },
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
