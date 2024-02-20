<template>
  <q-page padding>
    <div class="row fit row justify-between">
      <div class="col-12">
        <div class="BlockContent q-pr-lg">
          <h5 class="mainTitle">查詢交易活動</h5>
          <q-input v-model="text" label="依用戶名稱或電子郵件搜尋" bottom-slots rounded outlined>
            <template v-slot:prepend><q-icon name="search" /></template>
            <template v-slot:append><q-icon v-if="text !== ''" name="close" @click="text = ''"
                class="cursor-pointer" /></template>
            <template v-slot:after>
              <q-btn color="warning" text-color="black" label="下載月結單" size="lg" class="q-px-xl" rounded />
            </template>
          </q-input>
          <div class="filterBlock q-gutter-md">
            <h5>篩選</h5>
            <q-btn color="warning" label="全部" size="lg" class="q-px-xl" rounded unelevated outline />

            <q-btn-dropdown color="warning" class="q-px-xl" label="日期區間" size="lg" rounded outline>
              <div class="row no-wrap q-pa-md">
                <div class="col-12">
                  <div class="text-h6 q-mb-sm">日期</div>
                  <q-option-group :options="dateOptions" type="radio" v-model="dateGroup" />
                  <q-separator class="q-my-lg" />
                  <div class="text-h6 q-mb-sm">日期區間</div>
                  <div class="DateRange">
                    <q-input filled v-model="dateStart" mask="date" :rules="['date']" class="DateInput">
                      <template v-slot:append>
                        <q-icon name="event" class="cursor-pointer">
                          <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                            <q-date v-model="dateStart">
                              <div class="row items-center justify-end">
                                <q-btn v-close-popup label="Close" color="warning" flat />
                              </div>
                            </q-date>
                          </q-popup-proxy>
                        </q-icon>
                      </template>
                    </q-input>
                    <div class="DateSpace">-</div>
                    <q-input filled v-model="dateEnd" mask="date" :rules="['date']" class="DateInput">
                      <template v-slot:append>
                        <q-icon name="event" class="cursor-pointer">
                          <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                            <q-date v-model="dateEnd">
                              <div class="row items-center justify-end">
                                <q-btn v-close-popup label="Close" color="primary" flat />
                              </div>
                            </q-date>
                          </q-popup-proxy>
                        </q-icon>
                      </template>
                    </q-input>
                  </div>
                </div>
              </div>
            </q-btn-dropdown>

            <q-select color="warning" size="lg" v-model="OrderTypeState" :options="OrderTypeOptions" label="類型" rounded
              outlined />

            <q-select color="warning" size="lg" v-model="OrderState" :options="OrderStateOptions" label="狀態" rounded
              outlined />

          </div>
          <div class="OrderTableBlock q-my-lg">
            <dataTable title="" label="" link="/History" :rows="rows" :columns="columns" :showBottom="false" />
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>

import { ref } from 'vue'
import { toThousands } from 'src/utils/index.js'
import dataTable from 'src/components/DataTable.vue';

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
  }, {
    date: "2024/02/06",
    type: "收款",
    name: "Digiflow tech.",
    state: "已提領",
    fee: 1,
    amt: 89,
  }, {
    date: "2024/02/06",
    type: "收款",
    name: "Digiflow tech.",
    state: "已退款",
    fee: 5,
    amt: 100,
  }, {
    date: "2024/02/06",
    type: "收款",
    name: "Digiflow tech.",
    state: "已完成",
    fee: 1,
    amt: 10,
  }, {
    date: "2024/02/06",
    type: "收款",
    name: "Digiflow tech.",
    state: "已完成",
    fee: 0,
    amt: 200,
  }, {
    date: "2024/02/06",
    type: "收款",
    name: "Digiflow tech.",
    state: "已完成",
    fee: 0,
    amt: 200,
  }, {
    date: "2024/02/06",
    type: "收款",
    name: "Digiflow tech.",
    state: "已完成",
    fee: 0,
    amt: 200,
  }, {
    date: "2024/02/06",
    type: "收款",
    name: "Digiflow tech.",
    state: "已完成",
    fee: 0,
    amt: 200,
  }, {
    date: "2024/02/06",
    type: "收款",
    name: "Digiflow tech.",
    state: "已完成",
    fee: 0,
    amt: 200,
  }, {
    date: "2024/02/06",
    type: "收款",
    name: "Digiflow tech.",
    state: "已完成",
    fee: 0,
    amt: 200,
  }, {
    date: "2024/02/06",
    type: "收款",
    name: "Digiflow tech.",
    state: "已完成",
    fee: 0,
    amt: 200,
  }, {
    date: "2024/02/06",
    type: "收款",
    name: "Digiflow tech.",
    state: "已完成",
    fee: 0,
    amt: 200,
  }, {
    date: "2024/02/06",
    type: "收款",
    name: "Digiflow tech.",
    state: "已完成",
    fee: 0,
    amt: 200,
  }, {
    date: "2024/02/06",
    type: "收款",
    name: "Digiflow tech.",
    state: "已完成",
    fee: 0,
    amt: 200,
  },
];

export default {
  name: "HistoryPage",
  components: {
    dataTable
  },
  setup() {

    return {
      text: ref(''),
      model: ref(null),
      OrderState: ref(null),
      OrderTypeState: ref(null),
      dateGroup: ref(null),
      dateStart: ref('2019/02/01'),
      dateEnd: ref('2019/02/01'),
      OrderStateOptions: [
        '交易中', '已完成', '已提領', '已退款', '處理中', '已取消'
      ],
      OrderTypeOptions: [
        '付款', '提領', '取消'
      ],
      dateOptions: [
        { label: '本月', value: 'month', color: 'warning' },
        { label: '上個月', value: 'lastMonth', color: 'warning' },
        { label: '最近三個月', value: 'season', color: 'warning' },
        { label: '今年', value: 'year', color: 'warning' },
        { label: '去年', value: 'lastYear', color: 'warning' }
      ],
      columns,
      rows
    }
  }
};
</script>

<style lang="sass">

.filterBlock
  display: flex
  flex-wrap: nowrap
  align-items: center
  margin: 20px 0

  h5
    margin: 0 10px 0 0

  button, .q-field
    min-width: 130px
    margin: 0 5px

    span
      color: #333

  .q-field--outlined .q-field__control:before
    border: 1px solid #fcb335
  .q-field__label
    color: #333

.DateRange
  display: inline-flex
  align-items: baseline

  .DateSpace
    width: 20px
    text-align: center

  .DateInput
    width: calc(50% - 20px)
    max-width: 200px


</style>
