<template>
  <q-page padding>
    <div class="row fit row justify-between">
      <div class="col-12">
        <div class="BlockContent">
          <h5 class="mainTitle">系統API紀錄查詢</h5>
          <div class="filterBlock q-gutter-md">
            <q-input v-model="requestDate" mask="date" class="DateInput" label="日期" color="warning" outlined rounded>
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                    <q-date v-model="requestDate">
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="Close" color="warning" flat />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
            <q-select color="warning" size="lg" v-model="apiNameValue" :options="apiNameList" label="API名稱" rounded
              outlined />
            <q-select color="warning" size="lg" v-model="businessResultValue" :options="businessResultList" label="執行結果"
              rounded outlined />
            <q-btn class="btn" color="grey-4" label="清除條件" rounded unelevated @click="clearFilter" size="1rem" />
            <q-btn class="btn" color="warning" label="搜尋" rounded @click="loadOrders" size="1rem" />
          </div>
          <div class="OrderTableBlock q-my-lg">
            <q-table class="OrderTable" :rows="rows" :columns="columns" :row-key="rows.name"
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
            </q-table>
            <q-dialog v-model="showDetail" full-width>
              <q-card>
                <q-card-section>
                  <div class="text-h6">API詳細資料</div>
                </q-card-section>
                <q-card-section class="q-pt-none">
                  <!-- 這邊顯示詳細資料 -->
                  <q-list separator>
                    <q-item v-for="(item, key) in selected_row" :key="item.value">
                      <q-item-section><q-item-label>{{ apiLogColumn[key] }}</q-item-label></q-item-section>
                      <q-item-section side><q-item-label> {{ item }}</q-item-label></q-item-section>
                    </q-item>
                  </q-list>
                </q-card-section>
                <q-card-actions align="right">
                  <q-btn flat label="OK" color="primary" @click="showDetail = false" v-close-popup />
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
const apiNameList = [
  { label: '虛擬帳號取號', value: 'DigiflowVA' },
  { label: '商戶資訊查詢', value: 'DigiflowQuery' },
  { label: '發票開立', value: 'InvoiceCreate' },
  { label: '發票折讓', value: 'InvoiceAllowance' }
]
const businessResultList = [
  { label: '成功', value: 'Y' },
  { label: '失敗', value: 'N' },
  { label: '全選', value: '' }
]
const columns = [
  // { name: "MerchantId", label: "商戶", field: "MerchantId", align: 'left', sortable: true},
  // { name: "TerminalId", label: "終端", field: "TerminalId", align: 'left', sortable: true },
  { name: "CreateTime", label: "時間", field: "RequestTime", align: 'left', sortable: true, format: (v) => (v.replaceAll('T', ' ').replaceAll('-', '/')) },
  { name: "ApiName", label: "API名稱", field: "ApiName", align: 'left', sortable: true },
  { name: "BusinessRecord", label: "執行結果", field: "BusinessResult", align: 'left', sortable: true, format: (v) => (v == "Y" ? "成功" : "失敗") },
  { name: "ProcessSecond", label: "處理耗時", field: "ProcessSecond", align: 'right', sortable: true, format: (v) => ((v / 1000).toFixed(2)) },
  { name: "ErrorCode", label: "錯誤代碼", field: "ErrorCode", align: 'left', sortable: true },
  { name: "ErrorMessage", label: "錯誤訊息", field: "ErrorMessage", align: 'left', sortable: false }
];
const apiLogColumn = {
  RowId: '紀錄序號',
  RequestDate: '請求日期',
  ApServer: '伺服器ID',
  MerchantId: '商戶ID',
  TermainlId: '終端ID',
  ApiName: 'API名稱',
  BusinessRecord: '業務紀錄',
  BusinessRecordId: '業務紀錄ID',
  ClientIp: '客戶端IP',
  ServiceUrl: '服務端網址',
  RequestTime: '接收請求時間',
  RequestHead: '請求電文頭',
  RequestMessage: '請求電文內容',
  ResponseTime: '回覆時間',
  ResponseMessage: '回覆電文內容',
  ProcessSecond: '處理耗時(ms)',
  ErrorCode: '錯誤代碼',
  ErrorMessage: '錯誤訊息',
  Exception: '系統異常紀錄',
  Key1: '相關主鍵1',
  Key2: '相關主鍵2',
  Key3: '相關主鍵3',
  BusinessResult: '業務執行結果'
}
const merchantValue = ref(null);
const apiNameValue = ref(null);
const businessResultValue = ref(null);
const requestDate = ref('');
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
  name: "ApiLogPage",
  components: {
    //dataTable
  },
  setup() {
    const $q = useQuasar();
    const rows = ref([]);
    const loginUser = useUserStore();
    const isLoading = ref(false);
    const merchantStore = useMerchantStore()
    merchantStore.getMerchantMap().then(res => {
      merchantList.value = res
      actualMerchant.value = merchantList
    }).catch(function (err) {
      console.log(err)
    })
    function clearFilter() {
      merchantValue.value = null;
      apiNameValue.value = null;
      businessResultValue.value = '';
      requestDate.value = '';
    }
    function loadOrders(props) {

      const { page, rowsPerPage, sortBy, descending } = props.pagination ? props.pagination : pagination.value
      var query = {
        Start: (page - 1) * pagination.value.rowsPerPage,
        PageSize: rowsPerPage,
        AuthToken: loginUser.token
      }
      if (merchantValue.value) {
        query.MerchantId = merchantValue.value.value;
      }
      if (apiNameValue.value) {
        query.ApiName = apiNameValue.value.value;
      }
      if (businessResultValue.value) {
        if (businessResultValue.value != "") {
          query.BusinessResult = businessResultValue.value.value;
        }
      }
      if (requestDate.value != "") {
        query.RequestDate = requestDate.value.replaceAll('/', '');
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
      api.post('/MerchantLog/Digiflow', query, {
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
    loadOrders({
      sortBy: 'desc',
      descending: true,
      page: 1,
      rowsPerPage: 10,
      rowsNumber: 10,
      AuthToken: loginUser.token
    });
    return {
      loadOrders,
      checkDetail,
      clearFilter,
      showDetail: ref(false),
      apiLogColumn,
      merchantValue,
      apiNameValue,
      businessResultValue,
      apiNameList,
      businessResultList,
      model: ref(null),
      dateGroup: ref(null),
      requestDate,
      merchantList,
      columns,
      rows,
      isLoading,
      pagination
    }
  }
};
</script>
