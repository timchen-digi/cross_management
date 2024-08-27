import { createPinia } from "pinia";
import { api } from 'boot/axios'
import { defineStore, acceptHMRUpdate } from "pinia";
const pinia = createPinia();
import { useRouter } from "vue-router";
export const useUserStore = defineStore({
  id: "user",
  // 存取使用者資料
  state: () => ({
    username: window.localStorage.getItem("userName"),
    auth: window.localStorage.getItem("auth"),
    merchantId: window.localStorage.getItem("merchantId"),
    token: window.localStorage.getItem("token"),
    userId: window.localStorage.getItem("userId"),
  }),
  actions: {
    setReload(reload) {
      this.needReload = reload;
    },
    getReload() {
      return this.needReload;
    },
    setUserState(user) {
      this.username = user.UserName;
      this.token = user.Token;
      this.auth = user.isAdmin;
      this.merchantId = user.MerchantId;
      this.userId = user.UserId
      //避免重新整理後登入資料丟失
      window.localStorage.setItem("userName", this.username);
      window.localStorage.setItem("token", this.token);
      window.localStorage.setItem("auth", this.auth);
      window.localStorage.setItem("merchantId", this.merchantId);
      window.localStorage.setItem("userId", this.userId);
      // 登入後須重新渲染頁面
      this.needReload = true;
    },
    logout() {
      //alert("登出");
      this.setUserState({
        UserName: "",
        Token: "",
        isAdmin: "",
        MerchantId: ""
      });
      //Router.push("Login");
      const router = useRouter();
      router.push("/#/Login");
    },
  },
});

export const useMerchant = defineStore('merchants', {
  state: () => ({
    merchantMap: ref(null),
  }),
  actions: {
    async getMerchantMap() {
      let res = await api.get('/Merchant/GetList');
      console.log(res.data);
      merchantMap.value = res.data;
    },
  },
})

export const useMerchantStore = () => {
  const innerStore = defineStore({
    id: "merchant",
    state: () => ({
      merchantMap: null,
    }),

    actions: {
      asyncList() {
        //console.info("asyncList");
        api.get('/Merchant/GetList').then((response) => {
          this.merchantMap = response.data;
        })
      },
    },
  });
  const s = innerStore();
  if (s.counter == null) {
    s.asyncList();
  }
  return s;
};

export default pinia;
