const Management = { template: "<div>管理後臺</div>" };
import { useUserStore } from "../stores";
const routes = [
  {
    path: "/Management",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      { path: "", component: () => import("pages/HomePage.vue") },
      { path: "Index", component: () => import("pages/HomePage.vue") },
      { path: "Wallet", component: () => import("pages/WalletPage.vue") },
      { path: "Merchant", component: () => import("pages/MerchantPage.vue") }, // 商戶管理
      { path: "ApiLog", component: () => import("pages/ApiLogPage.vue") }, // 銀行API交易紀錄
      { path: "Pay", component: () => import("pages/PayPage.vue") },
      { path: "Checkout", component: () => import("pages/PayPageCheckout.vue") },
      { path: "Confirm", component: () => import("pages/PayPageConfirm.vue") },
      { path: "Home", component: () => import("pages/HomePage.vue") }, // 首頁
      { path: "History", component: () => import("pages/HistoryPage.vue") }, // 員工操作紀錄
      { path: "Logout", component: () => import("pages/LogoutPage.vue") }, // 登出
      //{ path: "Alarm", component: () => import("pages/AlarmPage.vue") }, // 警示帳戶查詢
      //{ path: "Settle", component: () => import("pages/SettlePage.vue") }, // 商戶對帳查詢
      //{ path: "Order", component: () => import("pages/OrderPage.vue") }, // 商戶帳務查詢
      //{ path: "Discound", component: () => import("pages/DiscoundPage.vue") }, // 商戶帳務查詢
      //{ path: "Stock", component: () => import("pages/StockPage.vue") }, // 庫存管理
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
  {
    path: "/Pay",
    component: () => import("layouts/PayLayout.vue"),
    children: [
      { path: "Index", component: () => import("pages/Pay/PayPage.vue") }, // 付款_信用卡
      { path: "Bank", component: () => import("pages/Pay/BankPayPage.vue") }, // 付款_虛擬帳號
      { path: "Result", component: () => import("pages/Pay/ResultPage.vue") }, // 商戶後台
      //{ path: "Backend", component: () => import("pages/Pay/BackendPage.vue") }, // 商戶後台
    ],
    //  http://localhost:9000/#/Pay/Index
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
