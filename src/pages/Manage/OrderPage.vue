<template>
  <q-page padding>
    <div class="row justify-between">
      <div class="col-12">
        <div class="BlockContent">
          <h5 class="mainTitle">商戶交易紀錄查詢</h5>
          <!-- <q-input v-model="text" label="依用戶名稱或電子郵件搜尋" bottom-slots rounded outlined>
            <template v-slot:prepend><q-icon name="search" /></template>
<template v-slot:append><q-icon v-if="text !== ''" name="close" @click="text = ''"
                            class="cursor-pointer" /></template>
<template v-slot:after>
                          <q-btn color="warning" text-color="black" label="下載月結單" size="lg" class="q-px-xl" rounded />
                        </template>
</q-input> -->
          <div class="filterBlock q-gutter-md">
            <!--<h5>篩選</h5>-->
            <q-input class="q-mb-sm" v-model="customId" label="訂單編號" size="18px" rounded outlined>
              <template v-slot:prepend><q-icon name="search" /></template>
            </q-input>
            <q-btn-dropdown class="q-mb-sm" color="warning" size="lg" rounded outline menu-self="top middle">
              <template v-slot:label>
                <div class="text-subtitle1 row items-center no-wrap">
                  <div class="text-center">日期區間</div>
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
                    <q-input filled v-model="dateEnd" mask="date" :rules="['date']" class="DateInput" setToday>
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
            <q-select class="col" color="warning" v-model="merchantValue" use-input :options="actualMerchant"
              v-show="showMerchantSelect" @filter="filterFn" label="商戶" rounded outlined />
            <q-select class="col" color="warning" v-model="orderTypeValue" :options="orderType" label="類型" rounded
              outlined />
            <q-select class="col" color="warning" v-model="orderStateValue" :options="orderStatus" label="狀態" rounded
              outlined />
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
                <q-btn color="primary" icon-right="archive" label="下載交易紀錄" no-caps @click="exportTable" />
              </template>
            </q-table>
            <q-dialog v-model="showDetail">
              <q-card>
                <q-card-section>
                  <div class="text-h6">訂單詳細資料</div>
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
                  <q-btn flat label="人工退款" color="secondary" @click="showRefundWindow(selected_row)"
                    v-show="refundPermission" />
                  <q-btn flat label="關閉" color="primary" @click="showDetail = false" v-close-popup />
                </q-card-actions>
              </q-card>
            </q-dialog>
            <q-dialog v-model="refundPrompt" persistent>
              <q-card style="min-width: 350px">
                <q-card-section>
                  <div class="text-h6">請輸入退款資訊</div>
                </q-card-section>
                <q-card-section class="q-pt-none">
                  <q-input dense v-model="rCustomId" label="訂單編號" readonly />
                  <q-input dense v-model="rAmount" label="退款金額(元)" autofocus :rules="[val => !!val || '此欄位必填']" />
                  <q-input dense v-model="rUserID" label="身分證字號" :rules="[val => val.length == 10 || '身分證有誤']" />
                  <q-input dense v-model="rBranch" label="分行代碼" :rules="[val => !!val || '此欄位必填']" />
                  <q-input dense v-model="rVAccount" label="入帳帳號" :rules="[val => !!val || '此欄位必填']" />
                  <q-input dense v-model="rRemark" label="退款原因" :rules="[val => val.length <= 10 || '上限10個字']" />
                </q-card-section>
                <q-card-actions align="right" class="text-primary">
                  <q-btn flat label="取消" v-close-popup @click="cancelRefund()" />
                  <q-btn flat label="確認退款" color="secondary" v-close-popup @click="doRefund(selected_row)" />
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

import { ref, onMounted } from 'vue'
import { toThousands, getMerchantName } from 'src/utils/index.js'
import dataTable from 'src/components/DataTable.vue';
import { useUserStore, useMerchantStore } from "../../stores";
import { api } from 'boot/axios'
import { exportFile, useQuasar } from 'quasar'
const orderType = [
  "", "信用卡分期", "信用卡一般", "銀聯卡", "ApplePay", "GooglePay", "SamsungPay", "虛擬帳號", "EACH", "超商繳費", "電信代收", "點數代收"
]
const orderStatus = [
  "訂單退款", "訂單取消", "訂單逾期", "未付款", "已付款", "已付款(金額有誤)"
]
const merchantStore = useMerchantStore();
const columns = [
  {
    name: "MerchantId", label: "商戶", field: "MerchantId", align: 'left', sortable: true,
    format: (v) => (getMerchantName(v, merchantStore.merchantMap))
  },
  //{ name: "TerminalId", label: "終端", field: "TerminalId", align: 'left', sortable: true },
  {
    name: "CreateTime", label: "交易時間", field: "CreateTime", align: 'left',
    format: (val) => (val.replace('T', ' ')), sortable: true
  },
  {
    name: "Type", label: "支付通路", field: "Type", align: 'center',
    format: (v) => (orderType[v]), sortable: true
  },
  { name: "OrderNO", label: "閘道交易編號", field: "OrderNO", align: 'center', sortable: true },
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
  { name: "PayAmount", label: "交易金額", field: "PayAmount", align: 'center', sortable: true },
  { name: "RefundAmount", label: "退款金額", field: "RefundAmount", align: 'center', sortable: true },
  {
    name: "CancelTime", label: "退款時間", field: "CancelTime", align: 'left',
    format: (val) => (val.replace('T', ' ')), sortable: true
  },
];
const orderColumn = {
  Id: '交易ID',
  TxId: '原始交易ID',
  MerchantId: '特店編號',
  TerminalId: '終端編號',
  OrderNO: '數位鎏訂單編號',
  CustomId: '商戶訂單編號',
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
const refundPrompt = ref(false);
const rAmount = ref(0);
const rUserID = ref("");
const rBranch = ref("");
const rVAccount = ref("");
const rCustomId = ref("");
const rRemark = ref("");
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
  name: "OrderPage",
  components: {
    //dataTable
  },
  setup() {
    const $q = useQuasar()
    const rows = ref([]);
    const loginUser = useUserStore();
    const showMerchantSelect = (loginUser.merchantId == "");
    const refundPermission = loginUser.getPermission("Refund");
    const isLoading = ref(false);
    const merchantStore = useMerchantStore();
    merchantStore.getMerchantMap().then(res => {
      merchantList.value = res
      actualMerchant.value = merchantList
      //console.log(actualMerchant.value)
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
        AuthToken: loginUser.token
      }
      if (orderStateValue.value) {
        query.Status = orderStatus.indexOf(orderStateValue.value) - 3;
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
      if (loginUser.merchantId != "") {
        query.MerchantId = loginUser.merchantId;
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
      api.post('/Order/Query', query, {
        headers: {}
      })
        .then((response) => {
          //console.log(response.data);
          if (response.data.completeFlag) {
            for (var i = 0; i < response.data.count; i++) {
              if (response.data.records[i]) {
                // 閘道交易編號 = 數位鎏帳單編號處理
                // 從前端作比較快
                if (response.data.records[i].Type == 7) {
                  // V2024111300000022499
                  response.data.records[i].OrderNO = 'V' + response.data.records[i].CreateTime.replaceAll('-', '').substring(0, 8) + response.data.records[i].TxId.padStart(11, '0')
                }
                if (response.data.records[i].Type == 9) {
                  // DIG20241112000000012
                  response.data.records[i].OrderNO = 'DIG' + response.data.records[i].CreateTime.replaceAll('-', '').substring(0, 8) + response.data.records[i].TxId.padStart(9, '0')
                }
              }
            }
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
      // clone
      let returnRow = { ...rows }
      returnRow.Type = orderType[rows.Type]
      returnRow.Status = orderStatus[rows.Status + 3]
      returnRow.CreateTime = returnRow.CreateTime.replace('T', ' ')
      returnRow.UpdateTime = returnRow.UpdateTime.replace('T', ' ')
      returnRow.FeeRate = parseFloat(returnRow.FeeRate * 0.0001) + '%'
      returnRow.Fee = parseFloat(returnRow.Fee * 100).toFixed(2)

      delete returnRow.FeeRate
      delete returnRow.Fee
      delete returnRow.Id

      delete returnRow.RuleId
      delete returnRow.TxId
      delete returnRow.CurrencyId

      delete returnRow.CancelTrxId
      delete returnRow.CaptureTrxId
      delete returnRow.ExtData
      delete returnRow.AutoCapture
      delete returnRow.CaptureTime
      delete returnRow.BuyerID
      delete returnRow.BuyerName
      if (returnRow.BuyerMobile != "") {
        returnRow.BuyerMobile = ""
      }
      else {
        delete returnRow.BuyerMobile
      }
      if (returnRow.IPAddress == "") {
        delete returnRow.IPAddress
      }

      // 依付款方式移除不需要的欄位
      //信用卡
      if (rows.Type == 1 || rows.Type == 2 || rows.Type == 3) {
        delete returnRow.VirtualBank
        delete returnRow.VirtualAccount
        delete returnRow.RemitCode
        delete returnRow.RemitAccount

        delete returnRow.CVStoreId
        delete returnRow.StoreCode1
        delete returnRow.StoreCode2
        delete returnRow.StoreCode3
      }
      //虛擬帳號
      if (rows.Type == 7) {
        delete returnRow.CardholderVerifyType
        delete returnRow.CardNo
        delete returnRow.Issuer
        delete returnRow.CardBrand
        delete returnRow.AcquirerBank
        delete returnRow.Onus
        delete returnRow.Installment

        delete returnRow.CVStoreId
        delete returnRow.StoreCode1
        delete returnRow.StoreCode2
        delete returnRow.StoreCode3
      }
      //EACH
      if (rows.Type == 8) {
        delete returnRow.VirtualBank
        delete returnRow.VirtualAccount
        delete returnRow.RemitCode
        delete returnRow.RemitAccount

        delete returnRow.CardholderVerifyType
        delete returnRow.CardNo
        delete returnRow.Issuer
        delete returnRow.CardBrand
        delete returnRow.AcquirerBank
        delete returnRow.Onus
      }
      delete returnRow.AnnualFee
      // if (Object.prototype.hasOwnProperty.call(returnRow, 'BankBranch')) {
      //   returnRow.BankBranch = 'ESUNTWTP'
      // }
      // console.log('new:')
      // console.log(rows)
      return returnRow
    }
    function exportTable() {
      // naive encoding to csv format
      const fileName = "商戶交易紀錄.csv"
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
    function filterFn(val, update) {
      if (val === '') {
        update(() => {
          actualMerchant.value = merchantList.value
        })
        return
      }
      update(() => {
        const needle = val.toLowerCase()
        //console.log(merchantList.value);
        //actualMerchant.value = MerchantList.value.filter(v => v.label.toLowerCase().indexOf(needle) > -1)
        // 用商戶名或商戶編號過濾
        actualMerchant.value = merchantList.value.filter(v => { return (v.label.toLowerCase().indexOf(needle) > -1 || v.value.indexOf(needle) > -1) })
      })
    }
    function showRefundWindow(order) {
      console.log(order.Status);
      console.log(orderStatus[order.Status + 3])
      if (orderStatus[order.Status + 3] == "已付款") {
        rCustomId.value = order.CustomId;
        rAmount.value = 0;
        refundPrompt.value = true;
      }
      else if (orderStatus[order.Status + 3] == "已付款(金額有誤)") {
        rCustomId.value = order.CustomId;
        rAmount.value = order.PayAmount;
        refundPrompt.value = true;
      }
      else {
        $q.notify({
          message: "帳單狀態不允許退款",
          position: "center"
        });
        return;
      }
    }
    function cancelRefund() {
      rAmount.value = 0;
      rUserID.value = "";
      rBranch.value = "";
      rVAccount.value = "";
      rRemark.value = "";
    }
    function doRefund(row) {
      // send api
      console.log(row);
      const rOrder = {
        AuthToken: loginUser.token,
        MID: row.MerchantId,
        CID: rCustomId.value,
        TID: row.TerminalId,
        TransNO: row.OrderNO,
        UserID: rUserID.value,
        Branch: rBranch.value,
        VAccount: rVAccount.value,
        Amount: rAmount.value * 100,
        Remark: rRemark.value
      }
      console.log(rOrder);
      //return;
      api.post('/Order/ManuallyRefund', rOrder).then((response) => {
        //console.log(response.data);
        if (response.data.completeFlag) {
          cancelRefund();
          $q.notify({
            message: "退款狀態已更新",
            position: "center",
            actions: [
              { icon: 'close', color: 'white', round: true, handler: () => { /* ... */ } }
            ]
          });
        }
        else {
          cancelRefund();
          var errorMessage = response.data.summary;
          console.log(errorMessage.Message);
          var msg = "退款失敗。 " + errorMessage.Message
          $q.notify({
            color: 'warning',
            message: msg,
            position: "center",
            multiLine: true,
            actions: [
              { icon: 'close', color: 'white', round: true, handler: () => { /* ... */ } }
            ]
          });
        }
      })
        .catch(function (error) {
          cancelRefund();
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
      // 清除狀態
    }
    //console.log(loginUser);
    if (loginUser.getReload()) {
      loginUser.setReload(false);
      location.reload();
    }
    loadOrders({
      sortBy: 'desc',
      descending: true,
      page: 1,
      rowsPerPage: 10,
      rowsNumber: 10,
      MerchantId: loginUser.merchantId,
      AuthToken: loginUser.token
    });
    return {
      loadOrders,
      exportTable,
      checkDetail,
      //generateTable,
      clearFilter,
      filterFn,
      rowHandler,
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
      merchantValue,
      actualMerchant,
      showMerchantSelect,
      refundPermission,
      showRefundWindow,
      refundPrompt,
      rAmount,
      rUserID,
      rBranch,
      rVAccount,
      rCustomId,
      rRemark,
      cancelRefund,
      doRefund,
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
