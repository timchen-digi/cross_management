<template>
  <q-page class="flex flex-center">
    <div class="q-pa-md" style="width: 60%">
      <div class="text-h4">▍登入</div>
      <br />
      <q-form @submit="login">
        <div class="text-h6">電子郵件 或 手機號碼</div>
        <div class="q-gutter-md">
          <q-input filled v-model="account" label="" stack-label />
          <div class="text-h6">密碼</div>
          <q-input v-model="password" label="" type="password" />
          <!-- <q-input v-model="password" filled :type="isPwd ? 'password' : 'text'">
          <template v-slot:append>
            <q-icon
              :name="isPwd ? 'visibility_off' : 'visibility'"
              class="cursor-pointer"
              @click="isPwd = !isPwd"
            />
          </template>
        </q-input> -->
          <!-- <q-input label="驗證碼" v-model="verify" stack-label>
            <template v-slot:control>
              <div class="self-center full-width no-outline" tabindex="0"></div>
            </template>
          </q-input> -->
          <q-btn
            style="width: 100%"
            color="amber"
            text-color="black"
            rounded
            label="登入"
            type="submit"
          />
          <q-separator />
          <q-btn
            style="width: 100%"
            color="black"
            text-color="white"
            rounded
            label="註冊"
            to="/Login/Register"
          />
        </div>
      </q-form>
    </div>
  </q-page>
</template>

<script>
import { defineComponent } from "vue";
import { useUserStore } from "../stores";
export default defineComponent({
  name: "LoginPage",
  methods: {
    login() {
      // 假設這裡進行登入驗證，成功後將資料保存至 Pinia
      var username = "";
      if (this.account == "digiflow") {
        username = "數位鎏測試商戶";
      } else if (this.account == "admin") {
        username = "後台系統管理員";
      } else {
        alert("使用者名稱或密碼錯誤");
        return;
      }
      const authStore = useUserStore();
      authStore.setUser(username);
      // 假設登入成功後導航至其他頁面
      this.$router.push("/Merchant");
    },
  },
  data() {
    return {
      account: "",
      password: "",
    };
  },
});
</script>
