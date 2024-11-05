import { useUserStore } from "../stores";
const routes = [
  {
    path: "/Management",
    component: () => import("layouts/MainLayout.vue"),
    meta: { title: '[測試]數位鎏聚合支付管理後台' },
    children: [
      { path: "", component: () => import("pages/Manage/HomePage.vue") }, // 首頁
      { path: "Home", component: () => import("pages/Manage/HomePage.vue") },
      { path: "Index", component: () => import("pages/Manage/HomePage.vue") },
      { path: "Merchant", component: () => import("pages/Manage/MerchantPage.vue") }, // 商戶管理
      { path: "Terminal", component: () => import("pages/Manage/TerminalPage.vue") }, // 商戶管理
      { path: "WeekSettle", component: () => import("pages/Manage/WeekSettlePage.vue") }, // 商戶管理
      { path: "ApiLog", component: () => import("pages/SystemManage/ApiLogPage.vue") }, // 商戶API交易紀錄
      { path: "DigiflowLog", component: () => import("pages/SystemManage/DigiflowLogPage.vue") }, // 系統API交易紀錄
      { path: "BatchLog", component: () => import("pages/SystemManage/BatchLogPage.vue") }, // 批次作業日誌
      { path: "User", component: () => import("pages/SystemManage/UserPage.vue") }, // 員工帳號管理
      { path: "UserLog", component: () => import("pages/SystemManage/UserLogPage.vue") }, // 員工操作紀錄
      { path: "Maintain", component: () => import("pages/SystemManage/MaintainPage.vue") }, // 維運計畫
      { path: "SetPwd", component: () => import("pages/AccountManage/SetPwdPage.vue") }, // 變更密碼
      { path: "Order", component: () => import("pages/Manage/OrderPage.vue") }, // 訂單紀錄
      { path: "Refund", component: () => import("pages/Manage/RefundPage.vue") }, // 訂單紀錄
      { path: "Backfill", component: () => import("pages/Manage/BackFillPage.vue") }, // AML資料補登
      { path: "Logout", component: () => import("pages/LogoutPage.vue") }, // 登出
      //{ path: "Alarm", component: () => import("pages/AlarmPage.vue") }, // 警示帳戶查詢
      //{ path: "Settle", component: () => import("pages/SettlePage.vue") }, // 商戶對帳查詢
      //{ path: "Order", component: () => import("pages/OrderPage.vue") }, // 商戶帳務查詢
      //{ path: "Discound", component: () => import("pages/DiscoundPage.vue") }, // 商戶帳務查詢
      //{ path: "Stock", component: () => import("pages/StockPage.vue") }, // 庫存管理
      //{ path: "Wallet", component: () => import("pages/WalletPage.vue") },
      //{ path: "Pay", component: () => import("pages/PayPage.vue") },
      //{ path: "Checkout", component: () => import("pages/PayPageCheckout.vue") },
      //{ path: "Confirm", component: () => import("pages/PayPageConfirm.vue") },

    ],
  },
  {
    path: "/Login",
    component: () => import("layouts/LoginLayout.vue"),
    meta: { title: '[測試]數位鎏聚合支付管理後台' },
    children: [
      { path: "", component: () => import("pages/LoginPage.vue") },
      { path: "Register", component: () => import("pages/RegisterPage.vue") },
      { path: "PreRegister", component: () => import("pages/register/PreRegisterPage.vue") },
      { path: "CheckRegister", component: () => import("pages/register/CheckRegisterPage.vue") },
    ],
  },
  {
    path: "/Pay",
    component: () => import("layouts/PayLayout.vue"),
    meta: { title: '[測試]數位鎏線上付款網站' },
    children: [
      { path: "Index", component: () => import("pages/Pay/NewPayPage.vue") }, // 付款_自選付款方式
      //{ path: "Index", component: () => import("pages/Pay/PayPage.vue") }, // 付款_信用卡
      { path: "Bank", component: () => import("pages/Pay/BankPayPage.vue") }, // 付款_虛擬帳號
      { path: "Result", component: () => import("pages/Pay/ResultPage.vue") }, // 商戶後台
    ],
  },
  {
    path: "/Point",
    component: () => import("layouts/PointLayout.vue"),
    meta: { title: '[測試]數位鎏線上付款網站' },
    children: [
      { path: "", component: () => import("pages/Point/IndexPage.vue") },
      { path: "Index", component: () => import("pages/Point/IndexPage.vue") },
      { path: "QA", component: () => import("pages/Point/QAPage.vue") }, //常見問題
      { path: "Privacy", component: () => import("pages/Point/PrivacyPage.vue") }, //隱私權
      { path: "About", component: () => import("pages/Point/AboutPage.vue") }, //關於我們
      { path: "Agree", component: () => import("pages/Point/AgreePage.vue") }, //同意書
      { path: "Contact", component: () => import("pages/Point/ContactPage.vue") }, //線上客服
      { path: "DigiPoint", component: () => import("pages/Point/DigiPointPage.vue") },
      { path: "GameList", component: () => import("pages/Point/GameListPage.vue") }, //合作遊戲
      { path: "PaymentConfirm", component: () => import("pages/Point/PaymentConfirmPage.vue") },
      { path: "PaymentDone", component: () => import("pages/Point/PaymentDonePage.vue") }
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
