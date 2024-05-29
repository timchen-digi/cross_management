<template>
  <q-page padding>
    <div class="row fit row justify-between">
      <div class="col-12">
        <div class="BlockContent q-pr-lg">
          <h5 class="mainTitle">商戶管理</h5>
          <q-btn color="accent" label="新增商戶" size="lg" class="q-px-xl" rounded unelevated outline
            @click="merchantWindow = true" />
          <div class="filterBlock q-gutter-md">
            <q-select color="warning" size="lg" v-model="StatusValue" :options="StatusList" label="商戶狀態" rounded
              outlined />
            <q-btn color="warning" text-color="black" label="搜尋" size="lg" class="q-px-xl" rounded
              @click="loadOrders" />
            <q-btn color="warning" label="清除條件" size="lg" class="q-px-xl" rounded unelevated outline
              @click="clearFilter" />
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
                  <div class="text-h6">商戶詳細資料</div>
                </q-card-section>
                <q-card-section class="q-pt-none">
                  <!-- <div v-html="generateTable(selected_row)"></div> -->
                  <!-- {{ generateTable(selected_row) }} -->
                  <!-- 這邊顯示詳細資料 -->
                  <q-list separator>
                    <q-item v-for="(item, key) in selected_row" :key="item.value">
                      <q-item-section><q-item-label>{{ MerchantColumn[key] }}</q-item-label></q-item-section>
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
            :label="MerchantColumn[key]"></q-input>
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
import { useUserStore } from "../stores";
import { api } from 'boot/axios'
import { exportFile, useQuasar } from 'quasar'
const StatusList = [
  { label: '停用', value: '1' },
  { label: '啟用', value: '2' },
  { label: '停用', value: '0' }
]
const columns = [
  { name: "MerchantId", label: "商戶ID", field: "MerchantId", align: 'left', sortable: true },
  { name: "UBN", label: "統編", field: "UBN", align: 'left', sortable: true },
  { name: "RegistName", label: "註冊名稱", field: "RegistName", align: 'left', sortable: true },
  { name: "BusinessName", label: "營業名稱", field: "BusinessName", align: 'left', sortable: true },
  { name: "Status", label: "狀態", field: "Status", align: 'left', sortable: true, format: (v) => (v == "2" ? "啟用" : "暫時停用") }
];
const StatusValue = ref(null);
const pagination = ref({
  sortBy: 'desc',
  descending: true,
  page: 1,
  rowsPerPage: 10,
  rowsNumber: 10
})
const MerchantColumn = {
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
  OpenDate: '開通日',
  Status: '狀態',
  UpdateTime: '更新時間',
  CreateTime: '建立時間',
}
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
  AnnualFee: 0
})
export default {
  name: "MerchantPage",
  components: {
    //dataTable
  },
  setup() {
    const $q = useQuasar()
    const rows = ref([]);
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
      console.log(merchant.MerchantId);
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
            console.log(apiKey);
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
            console.log(record);
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
    function getApplyService(obj) {
      var query = {
        MerchantId: obj['MerchantId']
      }
      api.post('/Merchant/QueryApplyService', query, {
        headers: {}
      })
        .then((response) => {
          //console.log(response.data);
          if (response.data.completeFlag) {
            var record = response.data.records[0];
            console.log(record);
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
      this.selected_row = row;
      this.showDetail = true;
    }
    function generateTable(obj) {
      // 不安全，待改
      var htmlcode = "<table><tr>";
      Object.keys(obj).forEach(function (k) {
        //console.log(k + ' - ' + obj[k]);
        htmlcode = htmlcode + "<th>" + k + "</th><th>" + obj[k] + "</th>";
        htmlcode = htmlcode + "</tr><tr>";
      });
      htmlcode = htmlcode + "</tr></table>"
      return htmlcode;
    }
    loadOrders({
      sortBy: 'desc',
      descending: true,
      page: 1,
      rowsPerPage: 10,
      rowsNumber: 10
    });
    return {
      loadOrders,
      checkDetail,
      generateTable,
      clearFilter,
      getApiInfo,
      registMerchant,
      MerchantColumn,
      showDetail: ref(false),
      merchantWindow: ref(false),
      newMerchant,
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
