<template>
  <q-page padding>
    <!-- content -->
    <div class="row">
      <div id="parent" class="fit row justify-between" style="overflow: hidden">
        <div class="col-4 q-px-xs">
          <q-card class="my-card q-mb-md" bordered>
            <q-card-section>

              <div class="BlockContent">
                <h5 class="mainTitle q-px-md">商戶基本資料</h5>
                <q-list separator>
                  <q-item>
                    <q-item-section>
                      <q-item-label>商戶名稱</q-item-label>
                    </q-item-section>
                    <q-item-section side>
                      <q-item-label>{{ merchantData.businessName }}</q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-item>
                    <q-item-section>
                      <q-item-label>商戶代碼</q-item-label>
                    </q-item-section>
                    <q-item-section side>
                      <q-item-label>{{ merchantData.merchantId }}</q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-item>
                    <q-item-section>
                      <q-item-label>狀態</q-item-label>
                    </q-item-section>
                    <q-item-section side>
                      <q-item-label>開通</q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-item>
                    <q-item-section>
                      <q-item-label>負責人</q-item-label>
                    </q-item-section>
                    <q-item-section side>
                      <q-item-label>{{ merchantData.bossName }}</q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-item>
                    <q-item-section>
                      <q-item-label>銀行代碼</q-item-label>
                    </q-item-section>
                    <q-item-section side>
                      <q-item-label>{{ merchantData.bankBranch }}</q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-item>
                    <q-item-section>
                      <q-item-label>帳戶</q-item-label>
                    </q-item-section>
                    <q-item-section side>
                      <q-item-label>{{ merchantData.bankAccount }}</q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
              </div>
              <div class="row justify-center q-my-md">
                  <q-btn color="warning" size="18px" class="q-px-xl text-black" label="商戶資料更新" @click="loadData" unelevated rounded />
                </div>
            </q-card-section>
          </q-card>
          <q-card class="my-card q-mb-md" bordered>
            <q-card-section>

              <div class="BlockContent">
                <h5 class="Title">已綁定的卡片/帳戶</h5>
                <q-btn v-for="(BindCard, index) in  BindCard" :key="index" class="AccountList btn-fixed-width"
                  align="between" :class="link === index ? 'AccountListActive' : ''" @click="link = index" unelevated>
                  <div class="CardInfo">
                    <div class="CardThumb">
                      <img :src="BindCard.img" alt="信用卡1" />
                    </div>
                    <div class="CardTxt">
                      <h5>{{ BindCard.type == 'credit' ? '信用卡' : BindCard.type == 'bank' ? '銀行帳戶' : '不明類型' }}</h5>
                      <p>{{ BindCard.cardNum }}</p>
                    </div>
                  </div>
                  <q-icon right size="30px" name="chevron_right" color="#b5b5b5" />
                </q-btn>

                <div class="row justify-center q-my-md">
                  <q-btn color="warning" size="18px" class="q-px-xl text-black" label="管理" unelevated rounded />
                </div>
              </div>

            </q-card-section>
          </q-card>
        </div>
        <div class="col-8 q-px-xs">
          <q-card class="my-card">
            <q-card-section class=" q-pa-0">
              <dataTable title="近期活動" label="查看交易明細" link="/History" :rows="rows" :columns="columns" :filter="filter"
                :showBottom="false" />
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>
  </q-page>
</template>
<script>

import { ref } from 'vue'
import { useUserStore } from "../stores";
import dataTable from "src/components/DataTable.vue";
import { toThousands } from 'src/utils/index.js'
import { api } from 'boot/axios'
import { useQuasar } from 'quasar'

const columns = [
  { name: "name", required: true, label: "日期", field: "date", align: 'left' },
  { name: "calories", label: "類型", field: "type", align: 'center' },
  { name: "fat", label: "用戶名稱", field: "name", align: 'center' },
  { name: "carbs", label: "狀態", field: "state", align: 'center' },
  {
    name: "protein",
    label: "手續費",
    field: "fee",
    format: (val) => `NTD$ ${toThousands(val)}`,
    align: 'center'
  },
  {
    name: "sodium",
    label: "淨額",
    field: "amt",
    format: (val) => `NTD$ ${toThousands(val)}`,
    align: 'right'
  },
];

const rows = [];

export default {
  name: "MerchantPage",
  components: {
    dataTable
  },
  data() {
    return {
      link: ref(''),
      merchantList: [
        {
          Title: '商戶名稱',
          content: '測試收款商戶0001',
        }, {
          Title: '商戶編號',
          content: '000123456',
        }
      ],
      BindCard: [
        {
          img: '/src/assets/CardImg/CardImg.png',
          type: 'credit',
          cardNum: '****-3456'
        }, {
          img: '/src/assets/CardImg/CardImg_02.png',
          type: 'bank',
          cardNum: '****-5678'
        }, {
          img: '/src/assets/CardImg/CardImg_02.png',
          type: 'order',
          cardNum: '****-5678'
        }
      ]
    }
  },
  setup() {
    const user = useUserStore();
    const username = user.username;
    const merchantData = ref({});
    const $q = useQuasar()
    function loadData () {
    api.get('/Merchant/Get',{
      params: {
        id: 183062446000001
      }})
      .then((response) => {
        console.log(response.data);
        merchantData.value = response.data
      })
      .catch(function (error) {
        // handle error
        //console.log(error);
        $q.notify({
          color: 'warning',
          message:"連線失敗 "+error,
          position: "center",
          multiLine: true,
          actions: [
            { icon: 'close', color: 'white', round: true, handler: () => { /* ... */ } }
          ]
        });
      })
    }
    loadData();
    return {
      filter: ref('filter'),
      toThousands,
      rows,
      columns,
      username,
      merchantData,
      loadData
    }
  },
};
</script>

<style lang="sass">
.AccountList
  width: 100%
  color: #FCB335
  justify-content: space-between
  padding: 1rem
  border: 1px solid #dfdfdf
  border-radius: 8px
  margin: 0 0 8px 0

  .CardInfo
      width: auto
      display: flex
      align-items: center
      color: #333

      i
        color: #B5B5B5

      .CardThumb
        width: 100px
        height: 65px
        border: 1px solid #dfdfdf
        border-radius: 5px
        display: flex
        justify-content: center
        align-items: center

        img
          max-width: 100%

      .CardTxt
        width: calc(100% - 100px)
        text-align: left
        margin-left: 10px

        h5
          font-size: 1.3rem
          font-weight: 600
          margin: 0

        p
          font-size: 1rem
          margin: 0
          display: flex
          justify-content: space-between

.AccountListActive
  border: 3px solid #FCB335
</style>
