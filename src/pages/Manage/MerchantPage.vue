<template>
  <q-page padding>
    <div class="row fit row justify-between">
      <div class="col-12">
        <div class="BlockContent">

          <div class="row justify-between items-center mainTitle">
            <span class="text-h5 q-my-0">商戶管理</span>
            <q-btn class="btn q-px-xl" color="warning" label="新增商戶" unelevated rounded @click="merchantWindow = true" />
          </div>

          <div class="filterBlock q-gutter-md">
            <q-select color="warning" size="lg" v-model="statusValue" :options="statusList" label="商戶狀態" rounded
              outlined />
            <q-btn class="q-py-md" color="grey-4" label="清除條件" rounded unelevated @click="clearFilter" size="1rem" />
            <q-btn class="q-py-md" color="warning" label="搜尋" rounded @click="loadOrders" size="1rem" />
          </div>

          <div class="OrderTableBlock q-my-lg">
            <q-table class="OrderTable" title="商戶清單" :rows="rows" :columns="columns" :row-key="rows.name"
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
                  <div class="text-h6">商戶基本資料</div>
                </q-card-section>
                <q-card-section class="q-pt-none">
                  <q-list separator>
                    <q-item v-for="(item, key) in rowHandler(selected_row)" :key="item.value">
                      <q-item-section><q-item-label>{{ merchantColumn[key] }}</q-item-label></q-item-section>
                      <q-item-section side><q-item-label> {{ item }}</q-item-label></q-item-section>
                    </q-item>
                  </q-list>
                </q-card-section>
                <q-card-section>
                  <div class="text-h6">商戶帳務資料</div>
                </q-card-section>
                <q-card-section class="q-pt-none">
                  <q-list separator>
                    <q-item v-for="(item, key) in merchantAccount" :key="item.value">
                      <q-item-section><q-item-label>{{ merchantColumn[key] }}</q-item-label></q-item-section>
                      <q-item-section side><q-item-label> {{ item }}</q-item-label></q-item-section>
                    </q-item>
                  </q-list>
                  <q-btn color="accent" @click="getApiInfo(selected_row)" icon="vpn_key">取得API金鑰</q-btn>
                  <br><br>
                  <q-btn color="accent" @click="getApplyPaymentService(selected_row)" icon="credit_card">信用卡支付資訊</q-btn>
                  <br><br>
                  <q-btn color="accent" @click="getApplyService(selected_row)" icon="payments">支付渠道資訊</q-btn>
                </q-card-section>
                <q-card-actions align="right">
                  <q-btn flat label="OK" color="primary" @click="showDetail = false" v-close-popup />
                </q-card-actions>
              </q-card>
            </q-dialog>
          </div>
        </div>
      </div>
    </div>
    <q-dialog v-model="merchantWindow" persistent>
      <q-card style="min-width: 500px">
        <q-card-section>
          <div class="text-h6">填寫商戶基本資料</div>
        </q-card-section>
        <q-card-section class="q-pt">
          <q-input v-for="(item, key) in newMerchant" :key="key" v-model="newMerchant[key]"
            :label="merchantColumn[key]"></q-input>
        </q-card-section>
        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="取消" v-close-popup></q-btn>
          <q-btn flat label="新增" v-close-popup @click="registMerchant(newMerchant)"></q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>

import { ref } from 'vue'
import { toThousands } from 'src/utils/index.js'
import dataTable from 'src/components/DataTable.vue';
import { useUserStore } from "../../stores";
import { api } from 'boot/axios'
import { exportFile, useQuasar } from 'quasar'
const statusList = [
  { label: '銷戶', value: '-4' },
  { label: '退件', value: '-3' },
  { label: '停權', value: '-2' },
  { label: '申請中', value: '-1' },
  { label: '待放行', value: '0' },
  { label: '停用', value: '1' },
  { label: '啟用', value: '2' }
]
const columns = [
  { name: "MerchantId", label: "商戶ID", field: "MerchantId", align: 'left', sortable: true },
  { name: "UBN", label: "統編", field: "UBN", align: 'left', sortable: true },
  { name: "RegistName", label: "註冊名稱", field: "RegistName", align: 'left', sortable: true },
  { name: "BusinessName", label: "營業名稱", field: "BusinessName", align: 'left', sortable: true },
  { name: "Status", label: "狀態", field: "Status", align: 'left', sortable: true, format: (v) => (statusList[v + 4].label) }
];
const statusValue = ref(null);
const pagination = ref({
  sortBy: 'desc',
  descending: true,
  page: 1,
  rowsPerPage: 10,
  rowsNumber: 10
})
const merchantColumn = {
  MerchantId: '商戶ID',
  UBN: '統編/身分證號',
  Type: '註冊類型',
  RegistName: '登記名稱/姓名',
  BusinessName: '營業名稱',
  EnglishName: '英文名稱',
  RegistAddress: '事業登記地址/戶籍地址',
  BusinessAddress: '營業地址',
  BillMail: '帳務電子郵件',
  BossName: '負責人姓名',
  BossSID: '負責人身分證號',
  ContactName: '聯絡人姓名',
  ContactMobile: '聯絡人手機',
  ContactTel: '聯絡人市話',
  ContactMail: '聯絡人電子郵件',
  BankBranch: '收款銀行分行',
  BankAccount: '收款銀行帳號',
  Mcc: '營業種類(MCC)',
  AnnualFee: '年費',
  InvoiceEnable: '開立發票',
  OpenDate: '開通日',
  Status: '狀態',
  UpdateTime: '更新時間',
  CreateTime: '建立時間',
  tranLimit: '單筆交易限額',
  dailyLimit: '日交易限額',
  monthlyLimit: '月交易限額',
  refundQuota: '退款額度'
}
const merchantAccount = ref({
  AnnualFee: 0,
  dailyLimit: -1,
  monthlyLimit: -1,
  tranLimit: -1,
  refundQuota: -1
})
const newMerchant = ref({
  MerchantId: '',
  UBN: '',
  Type: 2,
  RegistName: '',
  BusinessName: '',
  EnglishName: '',
  RegistAddress: '',
  BusinessAddress: '',
  BillMail: '',
  BossName: '',
  BossSID: '',
  ContactName: '',
  ContactMobile: '',
  ContactTel: '',
  ContactMail: '',
  BankBranch: '',
  BankAccount: '',
  Mcc: '',
  AnnualFee: 0,
  InvoiceEnable: false
})
export default {
  name: "MerchantPage",
  components: {
    //dataTable
  },
  setup() {
    const $q = useQuasar()
    const rows = ref([]);
    const loginUser = useUserStore();
    const isLoading = ref(false);
    function clearFilter() {
      MerchantValue.value = null;
      ApiNameValue.value = null;
      BusinessResultValue.value = '';
      RequestDate.value = '';
    }
    function registMerchant(merchant) {
      // for (var i in newMerchant.value) {
      //   console.log(i + i.value);
      // }
      // 檢查輸入(必填/格式)
      //console.log(merchant.MerchantId);
      api.post('/Merchant/Create', merchant, {
        headers: {}
      })
        .then((response) => {
          //console.log(response.data);
          if (response.data.completeFlag) {
            $q.notify({
              type: 'positive',
              message: "金鑰已複製至剪貼簿",
              position: "center",
            })
          } else {
            $q.notify({
              type: 'negative',
              message: "商戶建立失敗",
              position: "center",
            })
          }
        })
        .catch(function (error) {
          $q.notify({
            type: 'negative',
            message: "商戶建立失敗" + error,
            position: "center",
          })
        })
    }
    function getAccountInfo(obj) {
      merchantAccount.value.AnnualFee = 0
      merchantAccount.value.dailyLimit = -1
      merchantAccount.value.monthlyLimit = -1
      merchantAccount.value.tranLimit = -1
      merchantAccount.value.refundQuota = -1
      var query = {
        MerchantId: obj['MerchantId']
      }
      api.post('/Merchant/GetPaymentLimit', query, {
        headers: {}
      })
        .then((response) => {
          var record = response.data
          if (record != undefined) {
            merchantAccount.value.dailyLimit = record.dailyLimit
            merchantAccount.value.monthlyLimit = record.monthlyLimit
            merchantAccount.value.tranLimit = record.tranLimit
            merchantAccount.value.refundQuota = record.refundQuota
          }
          //console.log(merchantAccount.value)
        })
        .catch(function (error) {
          console.log(error);
        })
    }
    function getApiInfo(obj) {
      var query = {
        MerchantId: obj['MerchantId']
      }
      api.post('/Merchant/QueryApiSetting', query, {
        headers: {}
      })
        .then((response) => {
          //console.log(response.data);
          if (response.data.completeFlag) {
            var apiKey = response.data.records[0].Key;
            //console.log(apiKey);
            //alert(apiKey);
            navigator.clipboard.writeText(apiKey).then(() => $q.notify({
              type: 'positive',
              message: "金鑰已複製至剪貼簿",
              position: "center",
            }))
          }
        })
        .catch(function (error) {
          console.log(error);
        })
    }
    // 取得商戶
    function getApplyPaymentService(obj) {
      var query = {
        MerchantId: obj['MerchantId']
      }
      api.post('/Merchant/QueryApplyPaymentService', query, {
        headers: {}
      })
        .then((response) => {
          //console.log(response.data);
          if (response.data.completeFlag) {
            var record = response.data.records[0];
            //console.log(record);
            //alert(apiKey);
            $q.notify({
              type: 'positive',
              message: record,
              position: "center",
            })
          }
        })
        .catch(function (error) {
          console.log(error);
        })
    }
    function rowHandler(rows) {
      let returnRow = { ...rows }
      delete returnRow.BillMail
      delete returnRow.AnnualFee
      returnRow.CreateTime = returnRow.CreateTime.replace('T', ' ')
      returnRow.UpdateTime = returnRow.UpdateTime.replace('T', ' ')
      if (returnRow.BankBranch == '') {
        //跨境模式
        returnRow.BankBranch = 'ESUNTWTP'
      }
      if (returnRow.Mcc == '5816') {
        returnRow.Mcc = '5816-線上遊戲'
      }
      returnRow.Status = statusList[returnRow.Status + 4].label
      if (returnRow.Type == 3) {
        returnRow.Type = '境外'
      } else if (rows.Type == 2) {
        returnRow.Type = '法人'
      } else if (rows.Type == 1) {
        returnRow.Type = '個人'
      }
      return returnRow
    }
    function getApplyService(obj) {
      var query = {
        MerchantId: obj['MerchantId'],
      }
      api.post('/Merchant/QueryApplyService', query, {
        headers: {}
      })
        .then((response) => {
          //console.log(response.data);
          if (response.data.completeFlag) {
            var record = response.data.records[0];
            //console.log(record);
            //alert(apiKey);
            $q.notify({
              type: 'positive',
              message: record,
              position: "center",
            })
          }
        })
        .catch(function (error) {
          console.log(error);
        })
    }
    function loadOrders(props) {
      const { page, rowsPerPage, sortBy, descending } = props.pagination ? props.pagination : pagination.value
      var query = {
        Start: (page - 1) * pagination.value.rowsPerPage,
        PageSize: rowsPerPage,
        AuthToken: loginUser.token
      }
      if (statusValue.value) {
        query.Status = statusValue.value.value;
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
      api.post('/Merchant/Query', query, {
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
      getAccountInfo(row)
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
      getApiInfo,
      registMerchant,
      rowHandler,
      getApplyPaymentService,
      merchantColumn,
      merchantAccount,
      showDetail: ref(false),
      merchantWindow: ref(false),
      newMerchant,
      statusValue,
      statusList,
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
