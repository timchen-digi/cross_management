<template>
  <q-page padding>
    <h5 class="mainTitle">變更密碼</h5>
    <div class="inputContent">
      <div class="inputGroup">
        <div class="text-subtitle1">舊密碼</div>
        <q-input color="warning" v-model="oldPwd" :type="isPwd ? 'password' : 'text'" rounded outlined>
          <template v-slot:append>
            <q-icon :name="isPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer" @click="isPwd = !isPwd" />
          </template>
        </q-input>
      </div>
      <div class="inputGroup">
        <div class="text-subtitle1">新密碼</div>
        <q-input color="warning" v-model="password" :type="isPwd2 ? 'password' : 'text'" rounded outlined>
          <template v-slot:append>
            <q-icon :name="isPwd2 ? 'visibility_off' : 'visibility'" class="cursor-pointer" @click="isPwd2 = !isPwd2" />
          </template>
        </q-input>
      </div>
      <div class="inputGroup">
        <div class="text-subtitle1">再次輸入新密碼</div>
        <q-input color="warning" v-model="password2" :type="isPwd2 ? 'password' : 'text'" rounded outlined>
          <template v-slot:append>
            <q-icon :name="isPwd2 ? 'visibility_off' : 'visibility'" class="cursor-pointer" @click="isPwd2 = !isPwd2" />
          </template>
        </q-input>
      </div>
    </div>
    <div class="BtnGroup">
      <q-btn color="warning" text-color="black" label="確認變更" @click="resetPwd" size="lg" rounded />
    </div>
  </q-page>
</template>

<script>
import { ref } from "vue";
import { useUserStore } from "../../stores";
import { getSHA256Hash } from 'src/utils/index.js'
import { api } from 'boot/axios'
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
    resetPwd() {
      if (this.password != this.oldPwd) {
        alert("新密碼不可與舊密碼相同");
        return;
      }
      if (this.password != this.password2) {
        alert("兩次新密碼不同");
        return;
      }
      const authStore = useUserStore();
      getSHA256Hash(this.oldPwd).then(hashPwd => {
        getSHA256Hash(this.password).then(hashPwd2 => {
          api.post('/User/ChangePassword', {
            userId: authStore.userId,
            pswd: hashPwd,
            pswd2: hashPwd2
          }).then(response => {
            console.log(response);
            if (response.data.completeFlag == true) {
              // 成功變更
              $q.notify({
                message: "使用者密碼已變更",
                position: "center",
                multiLine: true,
                actions: [
                  { icon: 'close', color: 'white', round: true, handler: () => { /* ... */ } }
                ]
              });
              //TODO: 重新登入
              return;
            }
            else {
              alert("使用者名稱或密碼錯誤");
              return;
            }
          }).catch(function (error) {
            // handle error
            console.log(error);
            alert("使用者名稱或密碼錯誤");
          })
        })
      });
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
