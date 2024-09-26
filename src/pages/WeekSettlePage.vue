<template>
  <q-page padding>
    <div class="row justify-between">
      <div class="col-12">
        <div class="BlockContent">
          <h5 class="mainTitle">商戶周結檔下載</h5>
          <div class="filterBlock q-gutter-md">
            <!--<h5>篩選</h5>-->
            <q-input class="q-mb-sm" v-model="SettleDate" label="日期" size="18px" rounded outlined>
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                    <q-date v-model="SettleDate">
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="Close" color="warning" flat />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
            <q-btn class="btn" color="grey-4" label="清除條件" rounded unelevated @click="clearFilter" size="1rem" />
            <q-btn class="btn" color="warning" label="搜尋" rounded @click="loadOrders" size="1rem" />
          </div>
          <div class="OrderTableBlock q-my-lg">
            <q-table class="OrderTable" title="" :rows="rows" :columns="columns" :row-key="rows.name"
              v-model:pagination="pagination" :rows-per-page-options="[10, 25, 50]"
              no-data-label="I didn't find anything for you" :loading="isLoading" @request="loadOrders" flat>
              <template v-slot:no-data="">
                <div class="noData">
                  <h5>查無紀錄</h5>
                  <p>請嘗試使用其他條件篩選</p>
                </div>
              </template>
              <template v-slot:body="props">
                <q-tr class="cursor-pointer" :props="props" @click="checkDetail(props.row)">
                  <q-td v-for="col in props.cols" :key="col.name" :props="props">
                    {{ col.value }}
                  </q-td>
                </q-tr>
              </template>
              <template v-slot:loading>
                <q-inner-loading showing color="primary" />
              </template>
              <template v-slot:top-right>
                <q-btn color="primary" icon-right="archive" label="周結檔下載" no-caps @click="exportTable" />
              </template>
            </q-table>
          </div>
          <!-- <q-btn color="warning" text-color="black" label="下載交易紀錄" size="lg" class="q-px-xl" rounded /> -->
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>

import { ref } from 'vue'
import { toThousands, getMerchantName, FixNumrber } from 'src/utils/index.js'
import dataTable from 'src/components/DataTable.vue';
import { useUserStore, useMerchantStore } from "../stores";
import { api } from 'boot/axios'
import { exportFile, useQuasar } from 'quasar'
const orderType = [
  "", "信用卡分期", "信用卡一般", "銀聯卡", "ApplePay", "GooglePay", "SamsungPay", "虛擬帳號", "EACH", "超商繳費", "電信代收", "點數代收"
]
const orderStatus = [
  "訂單退款", "訂單取消", "訂單逾期", "未付款", "已付款", "已付款(金額有誤)"
]
// 網頁跟csv檔案共用
const columns = [
  {
    name: "SettleDate", label: "結算日期", field: "SettleDate", align: 'right',
    format: (v) => (v.substring(0, 4) + '.' + v.substring(4, 6) + '.' + v.substring(6, 8))
  },
  // {
  //   name: "MerchantId", label: "商戶", field: "MerchantId", align: 'left', sortable: true,
  //   format: (v) => (getMerchantName(v, MerchantList.value))
  // },
  {
    name: "Type", label: "通路", field: "Type", align: 'center',
    format: (v) => (orderType[v])
  },
  {
    name: "CaptureAmount",
    label: "日收款金額",
    field: "CaptureAmount",
    format: (val) => (toThousands(val)),
    align: 'right'
  },
  {
    name: "Fee",
    label: "日通路手續費",
    field: "Fee",
    format: (val) => (FixNumrber(val)),
    align: 'right'
  },
  {
    name: "RefundAmount",
    label: "日退款金額",
    field: "RefundAmount",
    format: (val) => (toThousands(val)),
    align: 'right'
  },
  {
    name: "RefundAmount",
    label: "日退款手續費",
    field: "RefundAmount",
    format: (val) => (FixNumrber(val * 0.01)),
    align: 'right'
  },
  // {
  //   name: "ExchangeNumber",
  //   label: "外幣匯款編號",
  //   field: "ExchangeNumber",
  //   align: 'center'
  // },
];
const OrderColumn = {
  Id: '流水編號',
  TxId: '原始交易ID',
  MerchantId: '特店編號',
  SettleDate: '結算日期',
  Type: '通路類型',
  CaptureAmount: '日收款金額',
  Fee: '日通路手續費',
  RefundAmount: '日退款金額',
  RefundAmount: '日退款手續費',
  ExchangeNumber: '外幣匯款編號'
}

const OrderStateValue = ref(null);
const OrderTypeValue = ref(null);
const MerchantValue = ref(null);
const SettleDate = ref('');
var prevMonday = new Date();
prevMonday.setDate(prevMonday.getDate() - (prevMonday.getDay() + 6) % 7);
prevMonday.setDate(prevMonday.getDate() - 7);
SettleDate.value = prevMonday.toISOString().slice(0, 10).replace(/-/g, "/");
//console.log(SettleDate)
const pagination = ref({
  sortBy: 'desc',
  descending: true,
  page: 1,
  rowsPerPage: 10,
  rowsNumber: 10
})
const MerchantList = ref([])
const actualMerchant = ref([])
export default {
  name: "WeekSettlePage",
  components: {
    //dataTable
  },
  setup() {
    const $q = useQuasar()
    const rows = ref([]);
    const sum = ref();
    const loginUser = useUserStore();
    const merchantStore = useMerchantStore()
    merchantStore.getMerchantMap().then(res => {
      MerchantList.value = res
      actualMerchant.value = MerchantList
    }).catch(function (err) {
      console.log(err)
    })
    const isLoading = ref(false);
    function clearFilter() {
      OrderStateValue.value = null;
      OrderTypeValue.value = null;
      MerchantValue.value = null;
      //dateStart.value = '';
      //dateEnd.value = '';
      SettleDate.value = '';
      //customId.value = '';
    }
    function loadOrders(props) {
      var query = {
        MerchantId: loginUser.merchantId,
        AuthToken: loginUser.token
      }
      if (SettleDate.value) {
        //query.sSettleDate = SettleDate.value.replaceAll('/', '-');
        //query.SettleDate = SettleDate.value.replaceAll('/', '');
        query.PlanDisburseDate = SettleDate.value.replaceAll('/', '');
      } else {
        //alert("請輸入日期");
        //return;
        // 必填
      }
      isLoading.value = true;
      api.post('/Settle/WeekQuery', query, {
        headers: {}
      })
        .then((response) => {
          //console.log(response.data);
          if (response.data.completeFlag) {
            for (var i = 0; i < response.data.count; i++) {
              if (response.data.records[i]) {
                // 閘道交易編號 = 數位鎏帳單編號處理
                // 從前端作比較快
                //response.data.records[i].OrderNO = 'V' + response.data.records[i].CreateTime.replaceAll('-', '').substring(0, 8) + response.data.records[i].Id.padStart(11, '0')
              }
            }
            sum.value = response.data.summary
            rows.value = response.data.records
            //console.log(sum.value)
          }
          isLoading.value = false;
        })
        .catch(function (error) {
          // handle error
          //console.log(error);
          isLoading.value = false;
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
    function checkDetail(row) {
      this.selected_row = row;
      this.showDetail = true;
    }
    function wrapCsvValue(val, formatFn, row) {
      let formatted = formatFn !== void 0
        ? formatFn(val, row)
        : val

      formatted = formatted === void 0 || formatted === null
        ? ''
        : String(formatted)

      formatted = formatted.split('"').join('""')
      /**
       * Excel accepts \n and \r in strings, but some other CSV parsers do not
       * Uncomment the next two lines to escape new lines
       */
      // .split('\n').join('\\n')
      // .split('\r').join('\\r')

      return `"${formatted}"`
    }
    function rowHandler(rows) {
      // clone
      let returnRow = { ...rows }
      returnRow.Type = orderType[rows.Type]
      returnRow.Status = orderStatus[rows.Status + 3]
      returnRow.CreateTime = returnRow.CreateTime.replace('T', ' ')
      returnRow.UpdateTime = returnRow.UpdateTime.replace('T', ' ')
      returnRow.FeeRate = parseFloat(returnRow.FeeRate * 0.0001) + '%'
      returnRow.Fee = parseFloat(returnRow.Fee * 100).toFixed(2)
      //delete returnRow.Id
      delete returnRow.RuleId
      delete returnRow.TxId
      delete returnRow.CurrencyId
      // 依付款方式移除不需要的欄位
      // if (Object.prototype.hasOwnProperty.call(returnRow, 'BankBranch')) {
      //   returnRow.BankBranch = 'ESUNTWTP'
      // }
      // console.log('new:')
      // console.log(rows)
      return returnRow
    }
    function exportTable() {
      // naive encoding to csv format
      var merchantName = getMerchantName(loginUser.merchantId, MerchantList.value)
      if (merchantName == null) {
        merchantName = ""
      }
      const fileName = "商戶周結檔_" + merchantName + ".csv"
      var content = [columns.map(col => wrapCsvValue(col.label))].concat(
        rows.value.map(row => columns.map(col => wrapCsvValue(
          typeof col.field === 'function'
            ? col.field(row)
            : row[col.field === void 0 ? col.name : col.field],
          col.format,
          row
        )).join(','))
      ).join('\r\n')
      // sum row
      content = content + "\r\n,總計:,\"" + toThousands(sum.value.CaptureAmount) + "\","
        + Math.round(sum.value.Fee) + "," + sum.value.RefundAmount + ","
        + Math.round(sum.value.RefundAmount * 0.01) + ",\r\n"

      // utf-8 BOM
      const status = exportFile(
        fileName,
        '\ufeff' + content,
        'text/csv'
      )
      if (status !== true) {
        $q.notify({
          color: 'warning',
          message: "下載失敗 " + error,
          position: "center",
          multiLine: true,
          actions: [
            { icon: 'close', color: 'white', round: true, handler: () => { /* ... */ } }
          ]
        })
      }
    }
    function filterFn(val, update) {
      if (val === '') {
        update(() => {
          actualMerchant.value = MerchantList.value
        })
        return
      }
      update(() => {
        const needle = val.toLowerCase()
        //actualMerchant.value = MerchantList.value.filter(v => v.label.toLowerCase().indexOf(needle) > -1)
        // 用商戶名或商戶編號過濾
        actualMerchant.value = MerchantList.value.filter(v => { return (v.label.toLowerCase().indexOf(needle) > -1 || v.value.indexOf(needle) > -1) })
      })
    }
    return {
      loadOrders,
      exportTable,
      checkDetail,
      //generateTable,
      clearFilter,
      filterFn,
      rowHandler,
      OrderColumn,
      showDetail: ref(false),
      model: ref(null),
      OrderStateValue,
      OrderTypeValue,
      dateGroup: ref(null),
      SettleDate,
      orderType,
      orderStatus,
      MerchantValue,
      //MerchantList,
      actualMerchant,
      columns,
      rows,
      sum,
      isLoading,
      pagination
    }
  }
};
</script>
