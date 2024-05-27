<template>
  <div>
    <q-list>
      <my-q-menu-item :my-router="menuList" :init-level="0" />
    </q-list>
  </div>
</template>

<script>
import MyQMenuItem from "./MenuItem.vue";

export default {
  name: "my-q-menu",
  components: { MyQMenuItem },
  data() {
    return {
      menuList: [
        {
          label: "我的帳號",
          children: [
            {
              label: "變更密碼",
              path: "/",
            },
            {
              label: "登出",
              path: "/Management/Logout",
            },
          ],
        },
        {
          label: "系統管理",
          children: [
            {
              label: "員工帳號管理",
              path: "/",
            },
            {
              label: "員工操作紀錄",
              path: "/",
            },
            {
              label: "批次作業日誌",
              path: "/",
            },
            {
              label: "API紀錄查詢",
              path: "/Management/ApiLog",
            },
            {
              label: "維運計畫",
              path: "/",
            },
          ],
        },
        {
          label: "客戶管理",
        },
        {
          label: "銀行代收管理",
          children: [
            {
              label: "信用卡大特店資訊",
              path: "/",
            },
            {
              label: "信用卡BIN管理",
              path: "/",
            },
            {
              label: "銀行虛擬帳號管理",
              path: "/",
            },
            {
              label: "虛擬帳號交易查詢",
              path: "/",
            },
          ],
        },
        {
          label: "超商代收管理",
        },
        {
          label: "物流管理",
          children: [
            {
              label: "物流維護",
              path: "/",
            },
            {
              label: "物流API介接管理",
              path: "/",
            },
            {
              label: "物流訂單管理",
              path: "/",
            },
            {
              label: "正物流管理",
              path: "/",
            },
            {
              label: "逆物流管理",
              path: "/",
            },
            {
              label: "異常處理",
              path: "/",
            },
          ],
        },
        {
          label: "帳務管理",
          children: [
            {
              label: "牌告匯率查詢/維護",
              path: "/",
            },
            {
              label: "虛擬帳號代收對帳單",
              path: "/",
            },
            {
              label: "繳費代碼代收對帳單",
              path: "/",
            },
            {
              label: "外匯待撥款查詢",
              path: "/",
            },
            {
              label: "外匯已撥款查詢",
              path: "/",
            },
          ],
        },
      ],
    };
  },
};
</script>
