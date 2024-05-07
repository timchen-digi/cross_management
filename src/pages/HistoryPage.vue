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
import { useUserStore } from "../stores";
import { api } from 'boot/axios'
import { useQuasar } from 'quasar'
const orderType = [
  "", "信用卡分期", "信用卡一般", "銀聯卡", "ApplePay", "GooglePay", "SamsungPay", "虛擬帳號", "EACH", "超商繳費", "電信代收", "點數代收"
]
const orderStatus = [
  "訂單退款", "訂單取消", "訂單逾期", "未付款", "已付款", "已付款(金額有誤)"
]
const columns = [
  { name: "MerchantId", label: "商戶", field: "MerchantId", align: 'left', sortable: true },
  { name: "TerminalId", label: "終端", field: "TerminalId", align: 'left', sortable: true },
  {
    name: "CreateTime", label: "日期", field: "CreateTime", align: 'left',
    format: (val) => (val.slice(0, 10)), sortable: true
  },
  {
    name: "Type", label: "類型", field: "Type", align: 'center',
    format: (v) => (orderType[v]), sortable: true
  },
  { name: "OrderNO", label: "交易編號", field: "OrderNO", align: 'center', sortable: true },
  { name: "CustomId", label: "訂單編號", field: "CustomId", align: 'center', sortable: true },
  {
    name: "Status", label: "狀態", field: "Status", align: 'center',
    format: (v) => (orderStatus[v + 3]), sortable: true
  },
  {
    name: "OrderAmount",
    label: "訂單金額",
    field: "OrderAmount",
    //format: (val) => (toThousands(val)),
    align: 'center', sortable: true
  },
  { name: "PayAmount", label: "支付金額", field: "PayAmount", align: 'center', sortable: true },

  {
    name: "Fee",
    label: "手續費",
    field: "Fee",
    align: 'right', sortable: true
  },
];
export default {
  name: "HistoryPage",
  components: {
    dataTable
  },
  setup() {
    const $q = useQuasar()
    const rows = ref([]);
    function loadOrders() {
      api.post('/Order/Query', {
        Start: 0,
        PageSize: 99,
        MerchantId: 142864983000001
      }, {
        headers: {}
      })
        .then((response) => {
          console.log(response.data);
          if (response.data.completeFlag) {
            rows.value = response.data.records
          }
        })
        .catch(function (error) {
          // handle error
          //console.log(error);
          $q.notify({
            color: 'warning',
            message: "連線失敗 " + error,
            position: "center",
            multiLine: true,
            actions: [
              { icon: 'close', color: 'white', round: true, handler: () => { /* ... */ } }
            ]
          });
        })
    }
    loadOrders();
    return {
      loadOrders,
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
