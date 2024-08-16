import { createPinia } from "pinia";
import { defineStore, acceptHMRUpdate } from "pinia";
const pinia = createPinia();
import { useRouter } from "vue-router";
export const useUserStore = defineStore({
  id: "user",
  state: () => ({
    username: window.localStorage.getItem("userName"),
    auth: window.localStorage.getItem("auth"),
    merchantId: window.localStorage.getItem("merchantId"),
  }),
  actions: {
    setUser(username) {
      this.username = username;
      window.localStorage.setItem("userName", this.username);
    },
    setToken(token) {
      window.localStorage.setItem("token", token);
    },
    setAuth(auth) {
      window.localStorage.setItem("auth", auth);
    },
    setMerchant(merchantId) {
      window.localStorage.setItem("merchantId", merchantId);
    },
    logout() {
      //alert("登出");
      this.$patch({
        username: "",
      });
      window.localStorage.setItem("merchantId", "");
      window.localStorage.setItem("token", "");
      window.localStorage.setItem("auth", "");
      //Router.push("Login");
      const router = useRouter();
      router.push("/#/Login");
    },
  },
});

export default pinia;
