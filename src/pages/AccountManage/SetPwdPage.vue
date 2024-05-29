<template>
  <q-page padding>
    <h5 class="mainTitle">變更密碼</h5>
    <div class="inputContent">
      <div class="inputGroup">
        <div class="text-subtitle1">舊密碼</div>
        <q-input color="warning" v-model="password" :type="isPwd ? 'password' : 'text'" rounded outlined>
          <template v-slot:append>
            <q-icon :name="isPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer" @click="isPwd = !isPwd" />
          </template>
        </q-input>
      </div>
      <div class="inputGroup">
        <div class="text-subtitle1">新密碼</div>
        <q-input color="warning" v-model="oldPwd" type="password" rounded outlined>
          <template v-slot:append>
            <q-icon :name="isPwd2 ? 'visibility_off' : 'visibility'" class="cursor-pointer" @click="isPwd2 = !isPwd2" />
          </template>
        </q-input>
      </div>
      <div class="inputGroup">
        <div class="text-subtitle1">再次輸入新密碼</div>
        <q-input color="warning" v-model="password2" :type="isPwd2 ? 'password' : 'text'" rounded outlined>
        </q-input>
      </div>
    </div>
    <div class="BtnGroup">
      <q-btn color="warning" text-color="black" label="確認變更" @click="login" size="lg" rounded />
    </div>
  </q-page>
</template>

<script>
import { ref } from "vue";
export default {
  name: "SetPwdPage",
  data() {
    return {
      oldPwd: "",
      password: "",
      password2: "",
      isPwd: ref(true),
      isPwd2: ref(true),
    }
  },
  methods: {
    login() {
      alert("開發中");
    }
  }
}
</script>

<style lang="sass">
.inputContent
  margin: 30px 0
  .inputGroup
    margin-bottom: 1rem
.BtnGroup
  margin-top: 40px
  .q-btn
    width: 100%
</style>
