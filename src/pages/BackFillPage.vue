<template>
  <q-page padding>
    <div class="row justify-between">
      <div class="col-12">
        <div class="BlockContent">
          <h5 class="mainTitle">交易AML資料補登</h5>
          <div class="filterBlock q-gutter-md">
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
            </q-table>
            <q-dialog v-model="showUpload" persistent>
              <q-card>
                <q-card-section class="q-pt">
                  <q-uploader label="AML資料上傳" color="purple" :max-file-size="20000000" square flat :factory="uploadFn"
                    multiple bordered />
                </q-card-section>
                <q-card-actions align="right" class="text-primary">
                  <q-btn flat label="關閉" v-close-popup></q-btn>
                </q-card-actions>
              </q-card>
            </q-dialog>
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>

import { ref, onMounted } from 'vue'
import { toThousands, getMerchantName } from 'src/utils/index.js'
import dataTable from 'src/components/DataTable.vue';
import { useUserStore, useMerchantStore } from "../stores";
import { api } from 'boot/axios'
import { exportFile, useQuasar } from 'quasar'
import { useRoute } from "vue-router";
const orderType = [
  "", "信用卡分期", "信用卡一般", "銀聯卡", "ApplePay", "GooglePay", "SamsungPay", "虛擬帳號", "EACH", "超商繳費", "電信代收", "點數代收"
]
const orderStatus = [
  "訂單退款", "訂單取消", "訂單逾期", "未付款", "已付款", "已付款(金額有誤)"
]
const columns = [
  {
    name: "MerchantId", label: "商戶", field: "MerchantId", align: 'left', sortable: true,
    format: (v) => (getMerchantName(v, merchantStore.merchantMap))
  },
  //{ name: "TerminalId", label: "終端", field: "TerminalId", align: 'left', sortable: true },
  {
    name: "CreateTime", label: "建立時間", field: "CreateTime", align: 'left',
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
  }
];
const orderColumn = {
  Id: '交易ID',
  TxId: '原始交易ID',
  MerchantId: '特店編號',
  TerminalId: '終端編號',
  OrderNO: '帳單源帳單編號',
  CustomId: '商戶訂單編號',
  Type: '類型',
  OrderId: '訂單交易ID',
  OrderNO: '訂單金額',
  Status: '訂單狀態',
  UpdateTime: '更新時間',
  CreateTime: '建立時間',
}


const orderStateValue = ref(null);
const orderTypeValue = ref(null);
const merchantValue = ref(null);
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
  name: "HistoryPage",
  components: {
    //dataTable
  },
  setup() {
    const $q = useQuasar()
    const OrderNo = useRoute().query.OrderNo
    const CustomId = useRoute().query.CustomId
    const rows = ref([]);
    const loginUser = useUserStore();
    const merchantStore = useMerchantStore()
    merchantStore.getMerchantMap().then(res => {
      merchantList.value = res
      actualMerchant.value = merchantList
    }).catch(function (err) {
      console.log(err)
    })
    const showMerchantSelect = (loginUser.merchantId == "");
    const isLoading = ref(false);
    const selected_file = '';
    const check_if_document_upload = false;
    function uploadFn(file) {
      // console.log(file)
      // 可一次上傳多檔
      // 上傳檔案這段要特別處理，直接傳到EC區
      const uploadAddress = 'https://EC.domain/cross/api/Order/BackfillDetail'
      // const uploadAddress = '/Order/BackfillDetail'
      api.post(uploadAddress, file, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'AuthToken': loginUser.token
        }
      })
        .then(response => {
          //console.log(response);
          if (response.data.completeFlag) {
            alert("檔案已上傳")
            this.showUpload = true
          }
        }).catch(function (error) {
          console.log(error);
        })
    }

    function loadOrders(props) {
      const { page, rowsPerPage, sortBy, descending } = props.pagination ? props.pagination : pagination.value
      var query = {
        Start: (page - 1) * pagination.value.rowsPerPage,
        PageSize: rowsPerPage,
        // 測試區不做驗證
        AuthToken: loginUser.token,
        CustomId: CustomId
      }
      if (merchantValue.value) {
        query.MerchantId = merchantValue.value.value;
      }
      if (loginUser.merchantId != "") {
        query.MerchantId = loginUser.merchantId;
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
      api.post('/Order/QueryDeclaration', query, {
        headers: {}
      })
        .then((response) => {
          //console.log(response.data);
          if (response.data.completeFlag) {
            for (var i = 0; i < response.data.count; i++) {
              if (response.data.records[i]) {
                // 閘道交易編號 = 數位鎏帳單編號處理
                // 從前端作比較快
                response.data.records[i].OrderNO = 'V' + response.data.records[i].CreateTime.replaceAll('-', '').substring(0, 8) + response.data.records[i].Id.padStart(11, '0')
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
      this.showUpload = true;
    }

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
    });
    return {
      loadOrders,
      checkDetail,
      uploadFn,
      check_if_document_upload,
      selected_file,
      orderColumn,
      showUpload: ref(false),
      customId,
      orderStateValue,
      orderTypeValue,
      orderType,
      orderStatus,
      merchantValue,
      //MerchantList,
      actualMerchant,
      columns,
      rows,
      isLoading,
      pagination
    }
  }
};
</script>
