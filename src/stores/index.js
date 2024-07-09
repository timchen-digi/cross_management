import { createPinia } from "pinia";
import { defineStore, acceptHMRUpdate } from "pinia";
const pinia = createPinia();
import { useRouter } from "vue-router";
export const useUserStore = defineStore({
  id: "user",
  state: () => ({
    username: window.localStorage.getItem("userName"),
    isAdmin: true,
  }),
  actions: {
    setUser(username) {
      this.username = username;
      window.localStorage.setItem("userName", this.username);
    },
    setToken(token) {
      window.localStorage.setItem("token", token);
    },
    logout() {
      //alert("登出");
      this.$patch({
        username: "",
      });
      window.localStorage.setItem("userName", "");
      //Router.push("Login");
      const router = useRouter();
      router.push("/#/Login");
    },
  },
});

export default pinia;
