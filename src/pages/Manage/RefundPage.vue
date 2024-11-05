<template>
  <q-page padding>
    <div class="row fit row justify-between">
      <div class="col-12">
        <div class="BlockContent">
          <h5 class="mainTitle">商戶退款紀錄查詢</h5>
          <!-- <q-input v-model="text" label="依用戶名稱或電子郵件搜尋" bottom-slots rounded outlined>
            <template v-slot:prepend><q-icon name="search" /></template>
<template v-slot:append><q-icon v-if="text !== ''" name="close" @click="text = ''"
                class="cursor-pointer" /></template>
<template v-slot:after>
              <q-btn color="warning" text-color="black" label="下載月結單" size="lg" class="q-px-xl" rounded />
            </template>
</q-input> -->
          <div class="filterBlock q-gutter-md">
            <!-- <h5>篩選</h5> -->
            <!-- <q-btn color="warning" label="清除條件" size="lg" class="q-px-xl" rounded unelevated outline
              @click="clearFilter" /> -->
            <q-input v-model="customId" label="訂單編號" rounded outlined>
              <template v-slot:prepend><q-icon name="search" /></template>
            </q-input>
            <q-btn-dropdown class="col q-mb-sm" color="warning" size="lg" rounded outline menu-self="top middle">
              <template v-slot:label>
                <div class="text-subtitle1 row items-center no-wrap">
                  <div class="text-center">建立時間</div>
                </div>
              </template>
              <div class="row no-wrap q-pa-md">
                <div class="col-12">
                  <!-- <div class="text-h6 q-mb-sm">日期</div>
                  <q-option-group :options="dateOptions" type="radio" v-model="dateGroup" />
                  <q-separator class="q-my-lg" /> -->
                  <div class="text-subtitle1 q-pb-md">日期區間</div>
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
            <q-select class="col" color="warning" size="lg" v-model="merchantValue" use-input :options="actualMerchant"
              v-show="showMerchantSelect" @filter="filterFn" label="商戶" rounded outlined />
            <q-select class="col" color="warning" size="lg" v-model="orderTypeValue" :options="orderType" label="類型"
              rounded outlined />
            <q-select class="col" color="warning" size="lg" v-model="orderStateValue" :options="orderStatus" label="狀態"
              rounded outlined />
            <q-btn class="btn" color="grey-4" label="清除條件" rounded unelevated @click="clearFilter" size="1rem" />
            <q-btn class="btn" color="warning" label="搜尋" rounded @click="loadOrders" size="1rem" />
          </div>
          <div class="OrderTableBlock q-my-lg">
            <q-table class="OrderTable" title="商戶退款紀錄" :rows="rows" :columns="columns" :row-key="rows.name"
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
                <q-btn color="primary" icon-right="archive" label="下載退款紀錄" no-caps @click="exportTable" />
              </template>
            </q-table>
            <q-dialog v-model="showDetail">
              <q-card>
                <q-card-section>
                  <div class="text-h6">退款詳細資料</div>
                </q-card-section>
                <q-card-section class="q-pt-none">
                  <q-list separator>
                    <q-item v-for="(item, key) in rowHandler(selected_row)" :key="item.value">
                      <q-item-section><q-item-label>{{ orderColumn[key] }}</q-item-label></q-item-section>
                      <q-item-section side><q-item-label> {{ item }}</q-item-label></q-item-section>
                    </q-item>
                  </q-list>
                </q-card-section>
                <q-card-actions align="right">
                  <q-btn flat label="更新銀行退款狀態" color="primary" @click="checkRefund(selected_row)"
                    v-show="refundPermission" />
                  <q-btn flat label="關閉" color="primary" @click="showDetail = false" v-close-popup />
                </q-card-actions>
              </q-card>
            </q-dialog>
            <q-dialog v-model="remitPrompt" persistent>
              <q-card style="min-width: 350px">
                <q-card-section>
                  <div class="text-h6">請輸入匯款交易序號</div>
                </q-card-section>
                <q-card-section class="q-pt-none">
                  <q-input dense v-model="remitTrxId" autofocus />
                </q-card-section>
                <q-card-actions align="right" class="text-primary">
                  <q-btn flat label="取消" v-close-popup @click="cancelRefund()" />
                  <q-btn flat label="送出" v-close-popup @click="doRefund(selected_row)" />
                </q-card-actions>
              </q-card>
            </q-dialog>
          </div>
          <!-- <q-btn color="warning" text-color="black" label="下載交易紀錄" size="lg" class="q-px-xl" rounded /> -->
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>

import { ref } from 'vue'
import { toThousands, getMerchantName } from 'src/utils/index.js'
import { useUserStore, useMerchantStore } from "../../stores";
import { api } from 'boot/axios'
import { exportFile, useQuasar } from 'quasar'
const remitPrompt = ref(false);
const remitTrxId = ref("");
const orderType = [
  "", "信用卡分期", "信用卡一般", "銀聯卡", "ApplePay", "GooglePay", "SamsungPay", "虛擬帳號", "EACH", "超商繳費", "電信代收", "點數代收"
]
const orderStatus = [
  "退款中", "退款成功", "退款失敗"
]
const columns = [
  {
    name: "MerchantId", label: "商戶", field: "MerchantId", align: 'left', sortable: true,
    format: (v) => (getMerchantName(v, merchantList.value))
  },
  { name: "TerminalId", label: "終端", field: "TerminalId", align: 'left', sortable: true },
  {
    name: "CreateTime", label: "日期", field: "CreateTime", align: 'left',
    format: (val) => (val.slice(0, 10)), sortable: true
  },
  {
    name: "Type", label: "類型", field: "Type", align: 'center',
    format: (v) => (orderType[v]), sortable: true
  },
  { name: "RefundCustomId", label: "退款訂單編號", field: "RefundCustomId", align: 'center', sortable: true },
  { name: "CustomId", label: "訂單編號", field: "CustomId", align: 'center', sortable: true },
  {
    name: "Status", label: "狀態", field: "Status", align: 'center',
    format: (v) => (orderStatus[v]), sortable: true
  },
  {
    name: "RefundAmount",
    label: "退款金額",
    field: "RefundAmount",
    //format: (val) => (toThousands(val)),
    align: 'center', sortable: true
  },
  {
    name: "RefundFee",
    label: "退款手續費",
    field: "RefundFee",
    align: 'right', sortable: true
  },
];
const orderColumn = {
  Id: '交易ID',
  TxId: '原始交易ID',
  MerchantId: '特店編號',
  TerminalId: '終端編號',
  OrderNO: '數位鎏訂單編號',
  CustomId: '商戶訂單編號',
  RefundCustomId: '商戶退款編號',
  RefundAmount: '退款金額',
  RefundFee: '退款手續費',
  RemitTrxId: '匯款交易序號',
  InBankBranch: '入帳銀行分行',
  InAccount: '入帳帳號',
  RefundSettleDate: '退款結算日',
  RefundTime: '退款時間',
  Remark: '備註',
  Type: '類型',
  CurrencyId: '幣別編號',
  OrderAmount: '訂單金額',
  PayAmount: '交易金額',
  OrderDesc: '訂單說明',
  ExpiryTime: '付款期限',
  BuyerName: '消費者姓名',
  BuyerID: '身分證/統一編號',
  BuyerMobile: '消費者手機號碼',
  BuyerMail: '消費者電子郵件信箱',
  IPAddress: 'IP位址',
  CardholderVerifyType: '持卡人驗證方式',
  Installment: '分期期數',
  ExtData: '商戶額外資訊',
  PaymentTime: '付款時間',
  AcquirerBank: '收單銀行',
  Onus: '自行交易',
  Issuer: '信用卡發卡行',
  CardBrand: '信用卡別',
  CardNo: '卡號末四碼',
  AutoCapture: '是否自動請款',
  VirtualBank: '虛擬帳號轉入銀行',
  VirtualAccount: '虛擬帳號',
  RemitCode: '轉出款分行代碼',
  RemitAccount: '轉出款銀行帳號',
  CVStoreId: '超商編號',
  StoreCode1: '超商繳款第一段條碼',
  StoreCode2: '超商繳款第二段條碼',
  StoreCode3: '超商繳款第三段條碼',
  CardNo: '卡號末四碼',
  CancelTime: '撤銷時間',
  CancelTrxId: '撤銷交易ID',
  CaptureTime: '請款時間',
  CaptureAmount: '對付款人請款金額',
  CaptureTrxId: '請款交易ID',
  RefundAmount: '退款給付款人金額',
  RefundCount: '退款次數',
  CaptureSettleDate: '請款結算日',
  RuleId: '手續費計算規則ID',
  FeeRate: '交易手續費率',
  Fee: '代收交易手續費',
  Status: '訂單狀態',
  UpdateTime: '更新時間',
  CreateTime: '建立時間',
}
const orderStateValue = ref(null);
const orderTypeValue = ref(null);
const merchantValue = ref(null);
const dateStart = ref('');
const dateEnd = ref('');
const customId = ref('');
const pagination = ref({
  sortBy: 'desc',
  descending: true,
  page: 1,
  rowsPerPage: 10,
  rowsNumber: 10
})
const merchantList = ref([])
const actualMerchant = ref([])
export default {
  name: "RefundPage",
  components: {
    //dataTable
  },
  setup() {
    const $q = useQuasar()
    const rows = ref([]);
    const isLoading = ref(false);
    const loginUser = useUserStore();
    const showMerchantSelect = (loginUser.merchantId == "");
    const refundPermission = loginUser.getPermission("Refund");
    const merchantStore = useMerchantStore()
    merchantStore.getMerchantMap().then(res => {
      merchantList.value = res
      actualMerchant.value = merchantList.value
    }).catch(function (err) {
      console.log(err)
    })
    function clearFilter() {
      orderStateValue.value = null;
      orderTypeValue.value = null;
      merchantValue.value = null;
      dateStart.value = '';
      dateEnd.value = '';
      customId.value = '';
    }
    function loadOrders(props) {

      const { page, rowsPerPage, sortBy, descending } = props.pagination ? props.pagination : pagination.value
      var query = {
        Start: (page - 1) * pagination.value.rowsPerPage,
        PageSize: rowsPerPage,
        MerchantId: loginUser.merchantId,
        // 測試區不做驗證
        AuthToken: loginUser.token
      }
      if (orderStateValue.value) {
        //query.Status = orderStatus.indexOf(OrderStateValue.value) - 3;
        query.Status = orderStatus.indexOf(orderStateValue.value);
      }
      if (orderTypeValue.value) {
        query.Type = orderType.indexOf(orderTypeValue.value);
      }
      if (customId.value != "") {
        query.CustomId = customId.value;
      }
      if (merchantValue.value) {
        query.MerchantId = merchantValue.value.value;
      }
      if (dateStart.value) {
        query.sCreateTime = dateStart.value.replaceAll('/', '-');
      } else {
        query.sCreateTime = "";
      }
      if (dateEnd.value) {
        query.eCreateTime = dateEnd.value.replaceAll('/', '-');
      } else {
        query.eCreateTime = "";
      }
      if (sortBy) {
        query.SortField = sortBy;
      }
      if (descending) {
        query.SortDir = "DESC";
      } else {
        query.SortDir = "ASC";
      }

      isLoading.value = true;
      api.post('/Order/QueryRefund', query, {
        headers: {}
      })
        .then((response) => {
          //console.log(response.data);
          if (response.data.completeFlag) {
            rows.value = response.data.records
            pagination.value.rowsNumber = response.data.count
            pagination.value.page = page
            pagination.value.rowsPerPage = rowsPerPage
            pagination.value.sortBy = sortBy
            pagination.value.descending = descending
            // handle sortBy
            if (sortBy) {
              const sortFn = sortBy === 'desc'
                ? (descending
                  ? (a, b) => (a.name > b.name ? -1 : a.name < b.name ? 1 : 0)
                  : (a, b) => (a.name > b.name ? 1 : a.name < b.name ? -1 : 0)
                )
                : (descending
                  ? (a, b) => (parseFloat(b[sortBy]) - parseFloat(a[sortBy]))
                  : (a, b) => (parseFloat(a[sortBy]) - parseFloat(b[sortBy]))
                )
              rows.value.sort(sortFn)
            }
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
      let returnRow = { ...rows }
      // delete returnRow.BillMail
      // delete returnRow.AnnualFee
      returnRow.CreateTime = returnRow.CreateTime.replace('T', ' ')
      returnRow.UpdateTime = returnRow.UpdateTime.replace('T', ' ')
      if (returnRow.RefundTime != "") {
        returnRow.RefundTime = returnRow.RefundTime.substring(0, 4) + '-' + returnRow.RefundTime.substring(4, 6) + '-' + returnRow.RefundTime.substring(6, 8)
          + " " + returnRow.RefundTime.substring(8, 10) + ":" + returnRow.RefundTime.substring(10, 12) + ":" + returnRow.RefundTime.substring(12, 14)
      }
      if (returnRow.RemitTrxId == "") {
        delete returnRow.RemitTrxId;
      }
      // if (returnRow.BankBranch == '') {
      //   //跨境模式
      //   returnRow.BankBranch = 'ESUNTWTP'
      // }
      // if (returnRow.Mcc == '5816') {
      //   returnRow.Mcc = '5816-線上遊戲'
      // }
      // returnRow.Status = StatusList[returnRow.Status + 4].label
      // if (returnRow.Type == 3) {
      //   returnRow.Type = '境外'
      // } else if (rows.Type == 2) {
      //   returnRow.Type = '法人'
      // } else if (rows.Type == 1) {
      //   returnRow.Type = '個人'
      // }
      return returnRow
    }
    function exportTable() {
      // naive encoding to csv format
      const fileName = "商戶退款紀錄.csv"
      const content = [columns.map(col => wrapCsvValue(col.label))].concat(
        rows.value.map(row => columns.map(col => wrapCsvValue(
          typeof col.field === 'function'
            ? col.field(row)
            : row[col.field === void 0 ? col.name : col.field],
          col.format,
          row
        )).join(','))
      ).join('\r\n')
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
    function checkRefund(order) {
      if (order["Status"] != 0) {
        $q.notify({
          color: 'warning',
          message: "僅可處理退款中交易",
          position: "center",
          multiLine: true
        });
        return
      }
      remitPrompt.value = true;
    }
    function doRefund(order) {
      //console.log(order);
      console.log(remitTrxId.value);
      //console.log(this.RemitTrxId);
      // send api
      // 插入操作人資料
      let refundOrder = { ...order }
      refundOrder["AuthToken"] = loginUser.AuthToken;
      refundOrder["RemitTrxId"] = remitTrxId.value;
      //console.log(refundOrder);
      remitPrompt.value = false;
      remitTrxId.value = "";
      api.post('/Order/CheckRefund', refundOrder).then((response) => {
        //console.log(response.data);
        if (response.data.completeFlag) {
          $q.notify({
            message: "退款狀態已更新",
            position: "center",
            multiLine: true,
            // actions: [
            //   { icon: 'close', color: 'white', round: true, handler: () => { /* ... */ } }
            // ]
          });
        }
        else {
          var errorMessage = response.data.summary;
          $q.notify({
            color: 'warning',
            message: errorMessage,
            position: "center"
          });
        }
      })
        .catch(function (error) {
          console.log(error);
          $q.notify({
            color: 'warning',
            message: "操作失敗 " + error,
            position: "center",
            multiLine: true,
            actions: [
              { icon: 'close', color: 'white', round: true, handler: () => { /* ... */ } }
            ]
          });
        })
    }
    function cancelRefund() {
      this.remitTrxId.value = "";
    }
    function filterFn(val, update) {
      if (val === '') {
        update(() => {
          actualMerchant.value = merchantList.value
        })
        return
      }
      update(() => {
        const needle = val.toLowerCase()
        //actualMerchant.value = MerchantList.value.filter(v => v.label.toLowerCase().indexOf(needle) > -1)
        // 用商戶名或商戶編號過濾
        actualMerchant.value = merchantList.value.filter(v => { return (v.label.toLowerCase().indexOf(needle) > -1 || v.value.indexOf(needle) > -1) })
        //console.log(actualMerchant.value)
      })
    }
    loadOrders({
      sortBy: 'desc',
      descending: true,
      page: 1,
      rowsPerPage: 10,
      rowsNumber: 10,
      // 測試區不做驗證
      AuthToken: loginUser.token
    });
    return {
      loadOrders,
      exportTable,
      checkDetail,
      rowHandler,
      clearFilter,
      checkRefund,
      doRefund,
      cancelRefund,
      orderColumn,
      showDetail: ref(false),
      customId,
      model: ref(null),
      orderStateValue,
      orderTypeValue,
      dateGroup: ref(null),
      dateStart,
      dateEnd,
      orderType,
      orderStatus,
      filterFn,
      merchantValue,
      merchantList,
      actualMerchant,
      showMerchantSelect,
      remitPrompt,
      remitTrxId,
      refundPermission,
      dateOptions: [
        { label: '本月', value: 'month', color: 'warning' },
        { label: '上個月', value: 'lastMonth', color: 'warning' },
        { label: '最近三個月', value: 'season', color: 'warning' },
        { label: '今年', value: 'year', color: 'warning' },
        { label: '去年', value: 'lastYear', color: 'warning' }
      ],
      columns,
      rows,
      isLoading,
      pagination
    }
  }
};
</script>
