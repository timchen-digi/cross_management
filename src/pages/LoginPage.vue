<template>
  <q-page class="flex flex-center">
    <div class="q-pa-md" style="width: 60%">
      <div class="text-h4">▍登入</div>
      <br />
      <div class="text-h6">電子郵件 或 手機號碼</div>
      <div class="q-gutter-md">
        <q-input filled v-model="account" label="" stack-label> </q-input>
        <div class="text-h6">密碼</div>
        <q-input v-model="password" filled :type="isPwd ? 'password' : 'text'">
          <template v-slot:append>
            <q-icon
              :name="isPwd ? 'visibility_off' : 'visibility'"
              class="cursor-pointer"
              @click="isPwd = !isPwd"
            />
          </template>
        </q-input>
        <q-input label="驗證碼" v-model="verify" stack-label>
          <template v-slot:control>
            <div class="self-center full-width no-outline" tabindex="0"></div>
          </template>
        </q-input>
        <q-btn
          style="width: 100%"
          color="amber"
          text-color="black"
          rounded
          label="登入"
          to="/Merchant"
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
    </div>
  </q-page>
</template>

<script>
import { defineComponent } from "vue";
import { ref } from "vue";
export default defineComponent({
  name: "LoginPage",
  setup() {
    return {
      password: ref(""),
      isPwd: ref(true),
      account: ref(""),
      verify: ref(""),
    };
  },
});
</script>
