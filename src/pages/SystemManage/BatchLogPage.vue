<template>
  <q-page padding>
    <div class="row fit row justify-between">
      <div class="col-12">
        <div class="BlockContent">
          <h5 class="mainTitle">批次作業日誌查詢</h5>
          <div class="filterBlock q-gutter-md">
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
            <q-dialog v-model="showDetail">
              <q-card>
                <q-card-section>
                  <div class="text-h6">批次作業詳細資料</div>
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
import { toThousands, GetBatchName } from 'src/utils/index.js'
import { useUserStore, useMerchantStore } from "../../stores";
import { api } from 'boot/axios'
import { exportFile, useQuasar } from 'quasar'
const apiNameList = [
  { label: '建立訂單', value: 'Create' },
  { label: '付款通知', value: 'Notify' },
  { label: '訂單查詢', value: 'Query' },
  { label: '退款', value: 'Refund' },
  { label: '退款查詢', value: 'QueryRefund' },
  { label: '日終檔下載', value: 'Reconciliation' }
]
const businessResultList = [
  { label: '成功', value: 'Y' },
  { label: '失敗', value: 'N' },
  { label: '全選', value: '' }
]
const columns = [
  { name: "BatchId", label: "批次作業編號", field: "BatchId", align: 'left', sortable: true, format: (v) => (GetBatchName(v)) },
  { name: "Success", label: "執行結果", field: "Success", align: 'left', sortable: true, format: (v) => (v == "Y" ? "成功" : "失敗") },
  { name: "StartTime", label: "開始時間", field: "StartTime", align: 'left', sortable: true, format: (v) => (v.replaceAll('T', ' ').replaceAll('-', '/')) },
  { name: "EndTime", label: "結束時間", field: "EndTime", align: 'left', sortable: true, format: (v) => (v.replaceAll('T', ' ').replaceAll('-', '/')) },
];
const apiLogColumn = {
  RowId: '紀錄序號',
  BatchId: '批次作業編號',
  ApServer: '伺服器ID',
  Success: '執行結果',
  Log: '執行紀錄',
  StartTime: '開始時間',
  EndTime: '結束時間',
}
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
  name: "BatchLogPage",
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
    }
    function loadOrders(props) {
      const { page, rowsPerPage, sortBy, descending } = props.pagination ? props.pagination : pagination.value
      var query = {
        Start: (page - 1) * pagination.value.rowsPerPage,
        PageSize: rowsPerPage,
        AuthToken: loginUser.token
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
      api.post('/MerchantLog/QueryBatch', query, {
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
      //generateTable,
      clearFilter,
      //GetBatchName,
      showDetail: ref(false),
      apiLogColumn,
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
