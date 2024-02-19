<template>
  <q-page padding>
    <div class="row fit row justify-between">
      <div class="col-md-4 col-12">
        <q-card class="my-card q-py-md q-mb-md" bordered>
          <div class="BlockContent">
            <h5 class="mainTitle q-px-md">Digiflow帳戶</h5>
            <div class="balanceBlock">
              <h5>
                NT$ <span class="price">{{ toThousands("12314465") }}</span>
              </h5>
              <p class="Remark">*以最新貨幣轉換匯率估算</p>
            </div>
            <div class="currency">
              <q-list
                class="rounded-borders"
                style="max-width: 100%"
                bordered
                separator
              >
                <q-item
                  class="q-py-md"
                  v-for="(BindCurrency, index) in BindCurrency"
                  :key="index"
                >
                  <q-item-section center class="col-1">
                    <q-avatar size="md">
                      <img :src="BindCurrency.img" />
                    </q-avatar>
                  </q-item-section>

                  <q-item-section center>
                    <q-item-label lines="1" class="row justify-between">
                      <span class="text-weight-medium"
                        >{{ BindCurrency.name }}
                        <q-chip
                          v-if="BindCurrency.type == 'default'"
                          color="warning"
                          size="xs"
                          label="預設"
                          outline
                        ></q-chip>
                      </span>
                      <span class="text-grey-8"
                        >{{ BindCurrency.symbol }}
                        {{ toThousands(BindCurrency.balance) }}</span
                      >
                    </q-item-label>
                  </q-item-section>

                  <q-item-section center side>
                    <div class="text-grey-8 q-gutter-xs">
                      <q-btn
                        size="12px"
                        flat
                        dense
                        round
                        icon="more_vert"
                        v-if="BindCurrency.type != 'default'"
                      >
                        <q-menu auto-close square :offset="[0, 5]">
                          <q-list>
                            <q-item
                              clickable
                              @click="setDefaultCurrency(index)"
                            >
                              <q-item-section class="text-subtitle1"
                                >設為預設</q-item-section
                              >
                            </q-item>
                            <q-item clickable>
                              <q-item-section class="text-red"
                                >刪除貨幣</q-item-section
                              >
                            </q-item>
                          </q-list>
                        </q-menu>
                      </q-btn>
                    </div>
                  </q-item-section>
                </q-item>
              </q-list>

              <div class="row justify-center q-my-md">
                <q-btn
                  color="warning"
                  size="18px"
                  class="q-px-xl text-black"
                  label="提領"
                  unelevated
                  rounded
                />
              </div>
            </div>
          </div>
        </q-card>

        <q-card class="my-card q-pa-md q-mb-md" bordered>
          <div class="BlockContent">
            <h5 class="Title">已綁定的卡片/帳戶</h5>
            <q-btn
              v-for="(BindCard, index) in BindCard"
              :key="index"
              class="AccountList btn-fixed-width"
              align="between"
              :class="link === index ? 'AccountListActive' : ''"
              @click="link = index"
              unelevated
            >
              <div class="CardInfo">
                <div class="CardThumb">
                  <img :src="BindCard.img" alt="信用卡1" />
                </div>
                <div class="CardTxt">
                  <h5>
                    {{
                      BindCard.type == "credit"
                        ? "信用卡"
                        : BindCard.type == "bank"
                        ? "銀行帳戶"
                        : "不明類型"
                    }}
                  </h5>
                  <p>{{ BindCard.cardNum }}</p>
                </div>
              </div>
              <q-icon right size="30px" name="chevron_right" color="#b5b5b5" />
            </q-btn>

            <div class="row justify-center q-my-md">
              <q-btn
                color="warning"
                size="18px"
                class="q-px-xl text-black"
                label="管理"
                unelevated
                rounded
              />
            </div>
          </div>
        </q-card>
      </div>
      <div class="col-md-8 col-12 q-pl-md">
        <div class="row justify-between">
          <div class="col-6">
            <q-list class="rounded-borders">
              <q-item clickable class="cardBTN" to="/Pay">
                <q-item-section avatar center>
                  <q-icon size="lg" name="near_me" color="warning" />
                </q-item-section>
                <q-item-section center>
                  <q-item-label class="Title">付款</q-item-label>
                  <q-item-label caption>透過支付連結，輕鬆付款</q-item-label>
                </q-item-section>

                <q-item-section center side>
                  <q-icon name="chevron_right" color="green" />
                </q-item-section>
              </q-item>
            </q-list>
          </div>
          <div class="col-6">
            <q-list class="rounded-borders">
              <q-item clickable class="cardBTN">
                <q-item-section avatar center>
                  <q-icon size="lg" name="add_circle" color="warning" />
                </q-item-section>

                <q-item-section center>
                  <q-item-label class="Title">新增帳戶/卡片</q-item-label>
                  <q-item-label caption>立即連結您的銀行或信用卡</q-item-label>
                </q-item-section>

                <q-item-section center side>
                  <q-icon name="chevron_right" color="green" />
                </q-item-section>
              </q-item>
            </q-list>
          </div>
        </div>

        <q-card class="my-card q-my-md">
          <q-card-section class=" q-pa-0">
            <div class="text-h5 q-mb-xs">近期活動</div>
            <div class="q-my-md row">
              <q-table class="recentlyTable col-12" flat :rows="rows" :columns="columns" hide-bottom />
              <DataTable
                title="近期活動"
                label="查看交易明細"
                link="/History"
                :showBottom="false"
              />
            </div>
            <div class="row justify-center q-my-md">
              <q-btn color="warning" size="18px" class="q-px-xl text-black" label="查看交易明細" to="/History" unelevated
                rounded />
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>
<script>


import { toThousands } from 'src/utils/index.js'
import { ref } from 'vue'

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

const rows = [
  {
    date: "2024/02/06",
    type: "收款",
    name: "Digiflow tech.",
    state: "已付款",
    fee: 15,
    amt: 5678,
  },
  {
    date: "2024/02/06",
    type: "收款",
    name: "Digiflow tech.",
    state: "已提領",
    fee: 1,
    amt: 89,
  },
  {
    date: "2024/02/06",
    type: "收款",
    name: "Digiflow tech.",
    state: "已退款",
    fee: 5,
    amt: 100,
  },
  {
    date: "2024/02/06",
    type: "收款",
    name: "Digiflow tech.",
    state: "已完成",
    fee: 1,
    amt: 10,
  },
  {
    date: "2024/02/06",
    type: "收款",
    name: "Digiflow tech.",
    state: "已完成",
    fee: 0,
    amt: 200,
  },
];

import { toThousands } from "src/utils/index.js";
import { ref } from "vue";
import DataTable from "components/DataTable.vue";

export default {
  name: "HomePage",
  methods: {},
  components: {
    DataTable,
  },
  data() {
    return {
      link: ref(''),
      DigiAccound: {
        img: "/src/assets/logos/DigiFlow_logoOnly.svg",
        type: "digiflow",
        balance: 20240206,
      },
      BindCard: [
        {
          img: "/src/assets/CardImg/CardImg.png",
          type: "credit",
          cardNum: "****-3456",
        },
        {
          img: "/src/assets/CardImg/CardImg_02.png",
          type: "bank",
          cardNum: "****-5678",
        },
        {
          img: "/src/assets/CardImg/CardImg_02.png",
          type: "order",
          cardNum: "****-5678",
        },
      ],
    };
  },
  setup() {
    const BindCurrency = ref([
      {
        img: "src/assets/currency/Flag_Tw.svg",
        name: "TWD",
        type: "default",
        symbol: "NT$",
        balance: 20240206,
      },
      {
        img: "src/assets/currency/Flag_Cn.svg",
        name: "RMB",
        type: "natural",
        symbol: "¥",
        balance: 121234,
      },
      {
        img: "src/assets/currency/Flag_US.svg",
        name: "USD",
        type: "natural",
        symbol: "$",
        balance: 1999,
      },
      {
        img: "src/assets/currency/Flag_JP.svg",
        name: "JPY",
        type: "natural",
        symbol: "¥",
        balance: 651234,
      },
    ]);
    return {
      toThousands,
      BindCurrency,
      setDefaultCurrency(idx) {
        //console.log(idx);
        //console.log(BindCurrency.value);
        BindCurrency.value.forEach((e) => {
          e.type = "natural";
        });
        BindCurrency.value[idx].type = "default";
      },
    };
  },
};
</script>
<style lang="sass">
.cardBTN
  color: #FCB335
  width: calc(100% - 4px)
  height: 100px
  margin: 0 2px
  border: 2px solid
  border-radius: 8px

  .Title
    color: #333333
    font-size: 1.2rem
    font-weight: 600

  i
    color: #B5B5B5

  .BTNTxt
    color:#333
    font-size: 1.2rem

    i
      color: #FCB335

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

.balanceBlock
  background: #F9EAD6
  padding: 1rem
  border-radius: 0

  h5
    display: flex
    justify-content: space-between
    margin: 1rem 0

    .price
      font-size: 2rem
      font-weight: 600

  .Remark
    font-size: 0.9rem
    text-align: right


.AccountListActive
  border: 3px solid #FCB335

.recentlyTable

  .q-table__top,
  .q-table__bottom,
  thead tr:first-child th
    color: #FFF
    background-color: #738A94

  thead tr th
    position: sticky
    z-index: 1

  thead tr:first-child th
    top: 0
</style>
