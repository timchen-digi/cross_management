import { createPinia } from "pinia";
import { defineStore, acceptHMRUpdate } from "pinia";
import Router from "../router";
const pinia = createPinia();

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
    logout() {
      //alert("登出");
      this.$patch({
        username: "",
      });
      window.localStorage.setItem("userName", "");
      //Router.push("Login");
      window.location.href = "/Login";
    },
  },
});

export default pinia;
