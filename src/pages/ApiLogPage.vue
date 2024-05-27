<template>
  <q-page padding>
    <div class="row fit row justify-between">
      <div class="col-12">
        <div class="BlockContent q-pr-lg">
          <h5 class="mainTitle">API紀錄查詢</h5>
          <div class="filterBlock q-gutter-md">
            <q-input filled v-model="RequestDate" mask="date" class="DateInput" label="日期">
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                    <q-date v-model="RequestDate">
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="Close" color="warning" flat />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
            <q-select color="warning" size="lg" v-model="MerchantValue" :options="MerchantList" label="商戶" rounded
              outlined />
            <q-select color="warning" size="lg" v-model="ApiNameValue" :options="ApiNameList" label="API名稱" rounded
              outlined />
            <q-select color="warning" size="lg" v-model="BusinessResultValue" :options="BusinessResultList" label="執行結果"
              rounded outlined />
            <q-btn color="warning" text-color="black" label="搜尋" size="lg" class="q-px-xl" rounded
              @click="loadOrders" />
          </div>
          <div class="filterBlock q-gutter-md">
            <q-btn color="warning" label="清除條件" size="lg" class="q-px-xl" rounded unelevated outline
              @click="clearFilter" />
          </div>
          <div class="OrderTableBlock q-my-lg">
            <q-table class="OrderTable" title="商戶API紀錄" :rows="rows" :columns="columns" :row-key="rows.name"
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
                  <div class="text-h6">API詳細資料</div>
                </q-card-section>
                <q-card-section class="q-pt-none">
                  <div v-html="generateTable(selected_row)"></div>
                  <!-- {{ generateTable(selected_row) }} -->
                  <!-- 這邊顯示詳細資料 -->
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
import { toThousands } from 'src/utils/index.js'
import dataTable from 'src/components/DataTable.vue';
import { useUserStore } from "../stores";
import { api } from 'boot/axios'
import { exportFile, useQuasar } from 'quasar'
const ApiNameList = [
  { label: '建立訂單', value: 'Create' },
  { label: '付款通知', value: 'Notify' },
  { label: '訂單查詢', value: 'Query' }
]
const BusinessResultList = [
  { label: '成功', value: 'Y' },
  { label: '失敗', value: 'N' },
  { label: '全選', value: '' }
]
const columns = [
  { name: "MerchantId", label: "商戶", field: "MerchantId", align: 'left', sortable: true },
  // { name: "TerminalId", label: "終端", field: "TerminalId", align: 'left', sortable: true },
  { name: "CreateTime", label: "時間", field: "RequestTime", align: 'left', sortable: true, format: (v) => (v.replaceAll('T', ' ').replaceAll('-', '/')) },
  { name: "ApiName", label: "API名稱", field: "ApiName", align: 'left', sortable: true },
  { name: "BusinessRecord", label: "執行結果", field: "BusinessRecord", align: 'left', sortable: true, format: (v) => (v == "Y" ? "成功" : "失敗") },
  { name: "ErrorCode", label: "錯誤代碼", field: "ErrorCode", align: 'left', sortable: true },
  { name: "ErrorMessage", label: "錯誤訊息", field: "ErrorMessage", align: 'left', sortable: false }
];
const MerchantValue = ref(null);
const ApiNameValue = ref(null);
const BusinessResultValue = ref(null);
const RequestDate = ref('');
const pagination = ref({
  sortBy: 'desc',
  descending: true,
  page: 1,
  rowsPerPage: 10,
  rowsNumber: 10
})
export default {
  name: "ApiLogPage",
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
    function loadOrders(props) {

      const { page, rowsPerPage, sortBy, descending } = props.pagination ? props.pagination : pagination.value
      var query = {
        Start: (page - 1) * pagination.value.rowsPerPage,
        PageSize: rowsPerPage,
        //MerchantId: 142864983000001
      }
      if (MerchantValue.value) {
        query.MerchantId = MerchantValue.value.value;
      }
      if (ApiNameValue.value) {
        query.ApiName = ApiNameValue.value.value;
      }
      if (BusinessResultValue.value) {
        if (BusinessResultValue.value != "") {
          query.BusinessResult = BusinessResultValue.value.value;
        }
      }
      if (RequestDate.value != "") {
        query.RequestDate = RequestDate.value.replaceAll('/', '');
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
      api.post('/MerchantLog/Query', query, {
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
      showDetail: ref(false),
      MerchantValue,
      ApiNameValue,
      BusinessResultValue,
      ApiNameList,
      BusinessResultList,
      model: ref(null),
      dateGroup: ref(null),
      RequestDate,

      MerchantList: [
        { label: '數位鎏', value: '142864983000001' },
        { label: '五七國際', value: '183062446000001' },
        { label: 'Waffo', value: '332715810000001' },
        { label: 'Airwallex', value: '391440300000001' }
      ],
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
