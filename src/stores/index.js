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
    role: window.localStorage.getItem("role"),
  }),
  actions: {
    setReload(reload) {
      this.needReload = reload;
    },
    getReload() {
      return this.needReload;
    },
    getPermission(action) {
      const permissionList = [];
      for (let i = 0; i < 10; i++) {
        permissionList.push((this.role & (1 << i)) !== 0);
      }
      // console.log(this.role);
      // console.log(permissionList);
      if (action == "Account") return permissionList[0];
      if (action == "Order") return permissionList[1];
      if (action == "Merchant") return permissionList[2];
      if (action == "Refund") return permissionList[3];
      if (action == "ChangePassword") return permissionList[4];
      if (action == "System") return permissionList[5];
      return false;
    },
    setUserState(user) {
      //console.log(user)
      this.username = user.UserName;
      this.token = user.Token;
      this.auth = user.isAdmin;
      this.merchantId = user.MerchantId;
      this.userId = user.UserId;
      this.role = user.Role;
      //避免重新整理後登入資料丟失
      window.localStorage.setItem("userName", this.username);
      window.localStorage.setItem("token", this.token);
      window.localStorage.setItem("auth", this.auth);
      window.localStorage.setItem("merchantId", this.merchantId);
      window.localStorage.setItem("userId", this.userId);
      window.localStorage.setItem("role", this.role);
      // 登入後須重新渲染頁面
      this.needReload = true;
    },
    logout() {
      //alert("登出");
      this.setUserState({
        UserName: "",
        Token: "",
        isAdmin: "",
        MerchantId: "",
        role: ""
      });
      //Router.push("Login");
      const router = useRouter();
      router.push("/#/Login");
    },
  },
});

export const useMerchantStore = defineStore({
  id: 'merchant',
  state: () => ({
    merchantList: []
  }),
  actions: {
    async setMerchantList() {
      console.log('Query Merchant List')
      // 避免重複取
      var res = await api.get('/Merchant/GetList')
      // 不處理例外狀況?
      res.data.forEach(e => {
        if (!this.merchantList.includes(e)) {
          this.merchantList.push(e)
        }
      })
    },
    async getMerchantMap() {
      if (this.merchantList.length == 0) {
        await this.setMerchantList()
      } else {
        console.log('Get Merchant List From Local')
      }
      return this.merchantList
    }
  },
})

export default pinia;
