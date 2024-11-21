<template>
  <q-header elevated class="header">
    <q-toolbar class="Toolbar text-white">
      <q-btn flat @click="drawer = !drawer" icon="menu" v-show="showMerchantSelect" />
      <img src="~assets/logos/DigiFlow_logo_White.svg" class="mainLOGO" />
      <q-tabs v-model="tab" inline-label class="tabs" indicator-color="warning">
        <!-- <q-route-tab name="home" label="首頁" to="/Home" /> -->
        <q-route-tab name="merchant" label="商戶管理" to="/Management/Merchant" v-show="showMerchantSelect" />
        <q-route-tab name="merchant" label="商品管理" to="/Management/Terminal" v-show="showMerchantSelect" />
        <!-- <q-route-tab name="pay" label="付款" to="/Pay" />
        <q-route-tab name="wallet" label="錢包" to="/Wallet" /> -->
        <q-route-tab name="history" label="交易紀錄" to="/Management/Order" />
        <q-route-tab name="refund" label="退款交易紀錄" to="/Management/Refund" />
        <q-route-tab name="refund" label="商戶周結檔下載" to="/Management/WeekSettle" />
      </q-tabs>
      <q-space />
      <!-- <q-btn class="q-mx-md" icon="notifications" round>
        <q-badge floating color="red">{{ notify.length }}</q-badge>
        <q-menu auto-close :offset="[0, 5]">
          <q-toolbar class="shadow-2">
            <q-toolbar-title>通知({{ notify.length }})</q-toolbar-title>
          </q-toolbar>
          <q-list separator>
            <q-item clickable v-for="(notify, index) in notify" :key="index" class="q-py-md">
              <q-item-section>
                <q-item-label>{{ notify.Title }}</q-item-label>
                <q-item-label class="notifyContent" caption>
                  {{ notify.detail }}
                  <br />
                  <q-btn v-if="notify.link" color="warning" size="md" class="q-mt-md" outline rounded>查看詳情</q-btn>
                </q-item-label>
              </q-item-section>
              <q-item-section side top>
                <q-item-label caption>5分鐘前</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </q-btn> -->
      <q-tabs shrink>
        <q-item-section color="warning">{{ username }}</q-item-section>
      </q-tabs>
      <q-tabs>
        <q-btn color="warning" size="md" class="q-mt-md" icon="logout" outline rounded
          @click="$router.replace('/Management/Logout')">登出</q-btn>
      </q-tabs>
      <!-- <q-tabs shrink>
        <q-btn round>
          <q-avatar>
            <img src="/src/assets/User/UserAvatar_01.png" />
          </q-avatar>
          <q-menu auto-close square :offset="[0, 5]" round>
            <q-list separator>
              <q-item>
                <q-item-section color="warning">{{ username }}</q-item-section>
              </q-item>
              <q-item clickable>
                <q-item-section color="warning">帳戶設定</q-item-section>
              </q-item>
              <q-item clickable>
                <q-item-section color="warning">安全性設定</q-item-section>
              </q-item>
              <q-item clickable>
                <q-item-section color="warning">隱私權設定</q-item-section>
              </q-item>
              <q-item clickable @click="logout">
                <q-item-section color="warning">登出</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
      </q-tabs> -->
    </q-toolbar>
  </q-header>
  <q-drawer v-model="drawer" show-if-above=false :width="300" :breakpoint="500" bordered
    :class="$q.dark.isActive ? 'bg-grey-9' : 'bg-grey-3'">
    <q-scroll-area class="fit">
      <my-q-menu />
    </q-scroll-area>
  </q-drawer>
</template>

<script>
import { ref } from "vue";
import { useUserStore } from "../stores";
import MyQMenu from "./LeftMenu.vue";
const user = useUserStore();
const showMerchantSelect = ref(user.merchantId == "");
const menuList = [
  {
    label: "帳號管理",
    separator: true,
  },
  {
    label: "系統管理",
    separator: true,
    children: [
      {
        label: "員工操作紀錄",
        path: "/#",
      },
      {
        label: "批次作業日誌",
        path: "/#",
      },
      {
        label: "API交易紀錄",
        path: "/#",
      },
      {
        label: "維運計畫",
        path: "/#",
      },
    ],
  },
  {
    label: "客戶管理",
    separator: true,
  },
  {
    label: "銀行代收管理",
    separator: true,
  },
  {
    label: "超商代收管理",
    separator: true,
  },
  {
    label: "物流管理",
    separator: true,
  },
  {
    label: "帳務管理",
    separator: true,
  },
];
export default {
  name: "HerderComp",
  components: {
    MyQMenu,
  },
  data() {
    const user = useUserStore();
    return {
      username: user.username,
      notify: [
        {
          Title: "您的帳戶變更",
          detail:
            "您已於2024/01/30從您帳戶餘額中提領 NT$ 34,567至您綁定的 銀行帳戶5678 ，您可透過「交易活動」查詢詳細明細資訊。",
          link: "",
        },
        {
          Title: "您的帳戶變更",
          detail:
            "您已於2024/01/30從您帳戶餘額中提領 NT$ 34,567至您綁定的 銀行帳戶5678 ，您可透過「交易活動」查詢詳細明細資訊。",
          link: "123",
        },
        {
          Title: "您的帳戶變更",
          detail:
            "您已於2024/01/30從您帳戶餘額中提領 NT$ 34,567至您綁定的 銀行帳戶5678 ，您可透過「交易活動」查詢詳細明細資訊。",
          link: "",
        },
        {
          Title: "您的帳戶變更",
          detail:
            "您已於2024/01/30從您帳戶餘額中提領 NT$ 34,567至您綁定的 銀行帳戶5678 ，您可透過「交易活動」查詢詳細明細資訊。",
          link: "",
        },
      ],
    };
  },
  setup() {
    return {
      link: ref("setting"),
      tab: ref("merchant"),
      drawer: ref(false),
      //miniState: ref(true),
      menuList,
      showMerchantSelect,
      logout() {
        useUserStore().logout();
      },
    };
  },
};
</script>

<style lang="sass" scoped>
.header
  .Toolbar
    max-width: 1200px
    margin: 0 auto
    .tabs
      .q-tab
        padding: 20px 15px

  .mainLOGO
    margin-right: 25px

.notifyContent
  max-width: 250px
.my-menu-link
  color: white
  background: #F2C037

@media screen and (max-width: 576px)
  .mainLOGO
    display: none

</style>
