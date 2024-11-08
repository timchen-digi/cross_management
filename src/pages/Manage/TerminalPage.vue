<template>
  <q-page padding>
    <div class="row fit row justify-between">
      <div class="col-12">
        <div class="BlockContent">

          <div class="row justify-between items-center mainTitle">
            <span class="text-h5 q-my-0">商品管理</span>
            <q-btn class="btn q-px-xl" color="warning" label="新增品項" unelevated rounded @click="terminalWindow = true" />
          </div>

          <div class="filterBlock q-gutter-md">
            <!-- <q-select color="warning" size="lg" v-model="StatusValue" :options="StatusList" label="終端狀態" rounded
              outlined /> -->
            <q-select class="col" color="warning" v-model="MerchantValue" use-input :options="actualMerchant"
              v-show="showMerchantSelect" @filter="filterFn" label="商戶" rounded outlined />
            <q-btn class="q-py-md" color="grey-4" label="清除條件" rounded unelevated @click="clearFilter" size="1rem" />
            <q-btn class="q-py-md" color="warning" label="搜尋" rounded @click="loadOrders" size="1rem" />
          </div>

          <div class="OrderTableBlock q-my-lg">
            <q-table class="OrderTable" title="商品清單" :rows="rows" :columns="columns" :row-key="rows.name"
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
            <q-dialog v-model="showDetail">
              <q-card>
                <q-card-section>
                  <div class="text-h6">商品基本資料</div>
                </q-card-section>
                <q-card-section class="q-pt-none">
                  <q-list separator>
                    <q-item v-for="(item, key) in rowHandler(selected_row)" :key="item.value">
                      <q-item-section><q-item-label>{{ TerminalColumn[key] }}</q-item-label></q-item-section>
                      <q-item-section side><q-item-label> {{ item }}</q-item-label></q-item-section>
                    </q-item>
                  </q-list>
                </q-card-section>
                <q-card-section>
                  <div class="text-h6">商品支付資料</div>
                </q-card-section>
                <q-card-section class="q-pt-none">
                  <q-list separator>
                    <q-item v-for="(item, key) in TerminalPayment" :key="item.value">
                      <q-item-section><q-item-label>{{ TerminalColumn[key] }}</q-item-label></q-item-section>
                      <q-item-section side><q-item-label> {{ item }}</q-item-label></q-item-section>
                    </q-item>
                  </q-list>
                </q-card-section>
                <q-card-actions align="right">
                  <q-btn flat label="關閉" color="primary" @click="showDetail = false" v-close-popup />
                </q-card-actions>
              </q-card>
            </q-dialog>
          </div>
        </div>
      </div>
    </div>
    <q-dialog v-model="terminalWindow" persistent>
      <q-card style="min-width: 500px">
        <q-card-section>
          <div class="text-h6">填寫上架品項資料</div>
        </q-card-section>
        <q-card-section class="q-pt">
          <q-input v-for="(item, key) in newTerminal" :key="key" v-model="newTerminal[key]"
            :label="TerminalColumn[key]"></q-input>
        </q-card-section>
        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="取消" v-close-popup></q-btn>
          <q-btn flat label="新增" v-close-popup @click="registTerminal(newTerminal)"></q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>
<script>

import { ref } from 'vue'
import { useMerchantStore, useUserStore } from "../../stores";
import { api } from 'boot/axios'
import { exportFile, useQuasar } from 'quasar'

const StatusList = [
  { label: '待開通', value: '0' },
  { label: '已開通', value: '1' },
  { label: '停用', value: '2' }
]
const RatingList = [
  { label: '普遍級', value: '1' },
  { label: '保護級', value: '2' },
  { label: '輔導12', value: '3' },
  { label: '輔導15', value: '4' },
  { label: '限制級', value: '5' }
]
const columns = [
  { name: "MerchantId", label: "商戶ID", field: "MerchantId", align: 'left', sortable: true },
  { name: "TerminalId", label: "品項ID", field: "TerminalId", align: 'left', sortable: true },
  { name: "TerminalName", label: "顯示名稱", field: "TerminalName", align: 'left', sortable: true },
  { name: "Status", label: "狀態", field: "Status", align: 'left', sortable: true, format: (v) => (StatusList[v].label) }
];
const MerchantValue = ref(null);
const StatusValue = ref(null);
const pagination = ref({
  sortBy: 'desc',
  descending: true,
  page: 1,
  rowsPerPage: 10,
  rowsNumber: 10
})
const TerminalColumn = {
  TerminalId: '品項編號',
  MerchantId: '特店編號',
  TerminalName: '顯示名稱',
  OfficialUrl: '官方網址',
  PictureName: '圖片檔名',
  PCUrl: '下載網址-PC',
  iOSUrl: '下載網址-iOS',
  AndroidUrl: '下載網址-Android',
  VAccountTypeId: '虛擬帳號檢核種類編號',
  Status: '狀態',
  Rating: '分級',
  UpdateTime: '更新時間',
  CreateTime: '建立時間',
  InvoiceEnable: '開立發票',
  PaymentTypeId: '支付方式編號'
}
const TerminalPayment = ref({
  // MerchantId: 0,
  // TerminalId: 0,
  PaymentTypeId: 1,
  Status: '啟用',
  InvoiceEnable: '啟用'
})
const newTerminal = ref({
  //MerchantId: '',
  TerminalId: '',
  TerminalName: '',
  OfficialUrl: '',
  Rating: '',
  PCUrl: '',
  iOSUrl: '',
  AndroidUrl: '',
  //VAccountTypeId: '',
  //Status: 0,
  //InvoiceEnable: false,
  //PaymentTypeId: 0
})
const MerchantList = ref([])
const actualMerchant = ref([])
export default {
  name: "TerminalPage",
  components: {
    //dataTable
  },
  setup() {
    const $q = useQuasar()
    const rows = ref([]);
    const loginUser = useUserStore();
    const showMerchantSelect = ref(loginUser.merchantId == "");
    const isLoading = ref(false);
    const merchantStore = useMerchantStore();
    merchantStore.getMerchantMap().then(res => {
      MerchantList.value = res
      actualMerchant.value = res
    }).catch(function (err) {
      console.log(err)
    })
    function clearFilter() {
      MerchantValue.value = null;
    }
    function registTerminal(terminal) {
      terminal.MerchantId = loginUser.MerchantId
      terminal.Status = 1
      terminal.Rating = 1
      terminal.PaymentTypeId = 1
      terminal.InvoiceEnable = false
      console.log(terminal)
      // 檢查輸入(必填/格式)
      //console.log(terminal.TerminalId);
      api.post('/Terminal/Create', terminal, {
        headers: { AuthToken: loginUser.token }
      })
        .then((response) => {
          //console.log(response.data);
          if (response.data.completeFlag) {
            $q.notify({
              type: 'positive',
              message: "商品項已建立",
              position: "center",
            })
          } else {
            $q.notify({
              type: 'negative',
              message: "商品項建立失敗",
              position: "center",
            })
          }
        })
        .catch(function (error) {
          $q.notify({
            type: 'negative',
            message: "商品項建立失敗" + error,
            position: "center",
          })
        })
    }
    function getTerminalPaymentInfo(obj) {
      var query = {
        TerminalId: obj['TerminalId'],
        MerchantId: loginUser.merchantId
        //MerchantId: obj['TerminalId']
      }
      // api.post('/Terminal/GetPaymentType', query, {
      //   headers: {}
      // })
      //   .then((response) => {
      //     var record = response.data
      //     if (record != undefined) {
      //       TerminalPayment.value.MerchantId = record.MerchantId
      //       TerminalPayment.value.TerminalId = record.TerminalId
      //       TerminalPayment.value.PaymentTypeId = record.PaymentTypeId
      //       TerminalPayment.value.Status = record.Status
      //       TerminalPayment.value.InvoiceEnable = record.InvoiceEnable
      //     }
      //     console.log(TerminalPayment.value)
      //   })
      //   .catch(function (error) {
      //     console.log(error);
      //   })
    }
    function rowHandler(rows) {
      let returnRow = { ...rows }
      returnRow.CreateTime = returnRow.CreateTime.replace('T', ' ')
      returnRow.UpdateTime = returnRow.UpdateTime.replace('T', ' ')
      returnRow.Status = StatusList[returnRow.Status].label
      returnRow.Rating = RatingList[returnRow.Rating - 1].label
      return returnRow
    }
    function loadTerminals(props) {
      const { page, rowsPerPage, sortBy, descending } = props.pagination ? props.pagination : pagination.value
      var query = {
        Start: (page - 1) * pagination.value.rowsPerPage,
        PageSize: rowsPerPage,
        AuthToken: loginUser.token
      }
      if (MerchantValue.value) {
        query.MerchantId = MerchantValue.value.value;
      }
      if (StatusValue.value) {
        query.Status = StatusValue.value.value;
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
      api.post('/Terminal/Query', query, {
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
      this.selected_row = row
      this.showDetail = true
      getTerminalPaymentInfo(row)
    }
    function filterFn(val, update) {
      // actualMerchant.value = MerchantStore.MerchantMap;
      // MerchantList.value = MerchantStore.MerchantMap;
      // console.log("actualMerchant")
      // console.log(actualMerchant.value);
      // console.log("MerchantList")
      // console.log(MerchantList.value);
      if (val === '') {
        update(() => {
          actualMerchant.value = MerchantList.value
        })
        return
      }
      update(() => {
        const needle = val.toLowerCase()
        console.log(MerchantList.value);
        //actualMerchant.value = MerchantList.value.filter(v => v.label.toLowerCase().indexOf(needle) > -1)
        // 用商戶名或商戶編號過濾
        actualMerchant.value = MerchantList.value.filter(v => { return (v.label.toLowerCase().indexOf(needle) > -1 || v.value.indexOf(needle) > -1) })
      })
    }
    loadTerminals({
      sortBy: 'desc',
      descending: true,
      page: 1,
      rowsPerPage: 10,
      rowsNumber: 10,
      AuthToken: loginUser.token
    });
    return {
      loadOrders: loadTerminals,
      checkDetail,
      clearFilter,
      //getApiInfo,
      registTerminal,
      rowHandler,
      //getApplyPaymentService,
      TerminalColumn,
      TerminalPayment,
      filterFn,
      MerchantValue,
      actualMerchant,
      showMerchantSelect,
      showDetail: ref(false),
      terminalWindow: ref(false),
      newTerminal,
      StatusValue,
      StatusList,
      model: ref(null),
      dateGroup: ref(null),
      columns,
      rows,
      isLoading,
      pagination
    }
  }
};
</script>
