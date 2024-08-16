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
            <q-select class="col" color="warning" size="lg" v-model="MerchantValue" use-input :options="actualMerchant"
              v-show="showMerchantSelect" @filter="filterFn" label="商戶" rounded outlined />
            <q-select class="col" color="warning" size="lg" v-model="OrderTypeValue" :options="orderType" label="類型"
              rounded outlined />
            <q-select class="col" color="warning" size="lg" v-model="OrderStateValue" :options="orderStatus" label="狀態"
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
import { toThousands, GetMerchantName, MerchantList } from 'src/utils/index.js'
import dataTable from 'src/components/DataTable.vue';
import { useUserStore } from "../stores";
import { api } from 'boot/axios'
import { exportFile, useQuasar } from 'quasar'
const orderType = [
  "", "信用卡分期", "信用卡一般", "銀聯卡", "ApplePay", "GooglePay", "SamsungPay", "虛擬帳號", "EACH", "超商繳費", "電信代收", "點數代收"
]
const orderStatus = [
  "退款處理中", "退款成功", "退款失敗"
]
const columns = [
  {
    name: "MerchantId", label: "商戶", field: "MerchantId", align: 'left', sortable: true,
    format: (v) => (GetMerchantName(v, MerchantList.value))
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
const OrderStateValue = ref(null);
const OrderTypeValue = ref(null);
const MerchantValue = ref(null);
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
const showMerchantSelect = (window.localStorage.getItem("merchantId") == "");
const actualMerchant = ref(MerchantList.value)
export default {
  name: "HistoryPage",
  components: {
    //dataTable
  },
  setup() {
    const $q = useQuasar()
    const rows = ref([]);
    const isLoading = ref(false);
    function clearFilter() {
      OrderStateValue.value = null;
      OrderTypeValue.value = null;
      MerchantValue.value = null;
      dateStart.value = '';
      dateEnd.value = '';
      customId.value = '';
    }
    function loadOrders(props) {

      const { page, rowsPerPage, sortBy, descending } = props.pagination ? props.pagination : pagination.value
      var query = {
        Start: (page - 1) * pagination.value.rowsPerPage,
        PageSize: rowsPerPage,
        MerchantId: window.localStorage.getItem("merchantId"),
        // 測試區不做驗證
        AuthToken: window.localStorage.getItem("token")
      }
      if (OrderStateValue.value) {
        query.Status = orderStatus.indexOf(OrderStateValue.value) - 3;
      }
      if (OrderTypeValue.value) {
        query.Type = orderType.indexOf(OrderTypeValue.value);
      }
      if (customId.value != "") {
        query.CustomId = customId.value;
      }
      if (MerchantValue.value) {
        query.MerchantId = MerchantValue.value.value;
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
    loadOrders({
      sortBy: 'desc',
      descending: true,
      page: 1,
      rowsPerPage: 10,
      rowsNumber: 10,
      // 測試區不做驗證
      AuthToken: window.localStorage.getItem("token")
    });
    return {
      loadOrders,
      exportTable,
      checkDetail,
      generateTable,
      clearFilter,
      showDetail: ref(false),
      customId,
      model: ref(null),
      OrderStateValue,
      OrderTypeValue,
      dateGroup: ref(null),
      dateStart,
      dateEnd,
      orderType,
      orderStatus,
      filterFn,
      MerchantValue,
      MerchantList,
      actualMerchant,
      showMerchantSelect,
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
