<template>
  <q-page padding>
    <!-- content -->
    <div class="row fit row justify-between">
      <div class="col-md-7 col-12">
        <div class="BlockContent">
          <h5 class="mainTitle">支付</h5>
          <q-input rounded outlined v-model="searchUserByPay" label="姓名、用戶名、電子郵件、手機">
            <template v-slot:prepend><q-icon name="search" /></template>
          </q-input>
          <div class="row justify-start q-my-md">
            <q-btn color="warning" text-color="black" label="下一頁" size="lg" class="q-mt-md q-px-xl" rounded />
          </div>
        </div>
      </div>
      <div class="col-md-5 col-12">
        <div class="BlockContent">
          <h5 class="mainTitle">聯絡人</h5>
          <q-input rounded outlined v-model="searchUser" label="搜尋">
            <template v-slot:prepend>
              <q-icon name="search" />
            </template>
          </q-input>
        </div>
        <div class="q-my-md">
          <q-list padding separator>
            <q-item class="q-py-md" clickable v-for="(contactUser, index) in contactUser" :key="index">
              <q-item-section top avatar>
                <q-avatar>
                  <img :src="contactUser.avatar">
                </q-avatar>
              </q-item-section>

              <q-item-section>
                <q-item-label>{{ contactUser.name }}</q-item-label>
                <q-item-label caption lines="2">{{ contactUser.mailAccount }}</q-item-label>
              </q-item-section>

              <q-item-section center side>
                <div class="text-grey-8 q-gutter-xs">
                  <q-btn size="12px" flat dense round icon="more_vert">
                    <q-menu auto-close square :offset="[0, 5]">
                      <q-list>
                        <q-item clickable>
                          <q-item-section class="text-subtitle1">支付款項</q-item-section>
                        </q-item>
                        <q-item clickable>
                          <q-item-section class="text-red">刪除聯絡人</q-item-section>
                        </q-item>
                      </q-list>
                    </q-menu>
                  </q-btn>
                </div>
              </q-item-section>
            </q-item>
          </q-list>

        </div>
        <br />
      </div>
    </div>
  </q-page>
</template>

<script>

import { ref } from 'vue'

export default {
  name: "WalletPage",
  data() {
    return {
      searchUser: ref(''),
      searchUserByPay: ref(''),
      contactUser: [
        {
          avatar: "/src/assets/User/UserAvatar_01.png",
          name: "User001",
          mailAccount: "abcdefg@gmail.com"
        }, {
          avatar: "/src/assets/User/UserAvatar_02.png",
          name: "User002",
          mailAccount: "abcdefg@gmail.com"
        }, {
          avatar: "/src/assets/User/UserAvatar_03.png",
          name: "User003",
          mailAccount: "abcdefg@gmail.com"
        }, {
          avatar: "/src/assets/User/UserAvatar_04.png",
          name: "User004",
          mailAccount: "abcdefg@gmail.com"
        }, {
          avatar: "/src/assets/User/UserAvatar_01.png",
          name: "User005",
          mailAccount: "abcdefg@gmail.com"
        }
      ]
    }
  }
};
</script>
