<template>
  <q-page padding>
    <div class="row fit row justify-between">
      <div class="col-12">
        <div class="BlockContent">
          <!-- <h5 class="mainTitle">使用者帳號管理</h5> -->
          <div class="row justify-between items-center mainTitle">
            <span class="text-h5 q-my-0">使用者帳號管理</span>
            <q-btn class="btn q-px-xl" color="warning" label="新增使用者" unelevated rounded @click="userWindow = true" />
          </div>
          <div class="filterBlock q-gutter-md">
            <q-select color="warning" size="lg" v-model="merchantValue" :options="merchantList" label="商戶" rounded
              outlined />
            <q-input class="q-mb-sm" v-model="userId" label="使用者名稱" size="18px" rounded outlined>
              <template v-slot:prepend><q-icon name="search" /></template>
            </q-input>
            <q-btn class="btn" color="grey-4" label="清除條件" rounded unelevated @click="clearFilter" size="1rem" />
            <q-btn class="btn" color="warning" label="搜尋" rounded @click="loadUser" size="1rem" />
          </div>
          <div class="OrderTableBlock q-my-lg">
            <q-table class="OrderTable" :rows="rows" :columns="columns" :row-key="rows.name"
              v-model:pagination="pagination" :rows-per-page-options="[10, 25, 50]"
              no-data-label="I didn't find anything for you" :loading="isLoading" @request="loadUser" flat>
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
                  <div class="text-h6">使用者</div>
                </q-card-section>
                <q-card-section class="q-pt-none">
                  <!-- <div v-html="generateTable(selected_row)"></div> -->
                  <!-- {{ generateTable(selected_row) }} -->
                  <!-- 這邊顯示詳細資料 -->
                  <q-list separator>
                    <!-- <q-item v-for="(item, key) in selected_row" :key="item.value">
                      <q-item-section><q-item-label>{{ UserColumn[key] }}</q-item-label></q-item-section>
                      <q-item-section side><q-item-label> {{ item }}</q-item-label></q-item-section>
                    </q-item> -->
                    <q-input v-for="(item, key) in selected_row" :key="item.value" v-model="selected_row[key]"
                      :label="userColumn[key]" :readonly="readonly"></q-input>
                  </q-list>
                </q-card-section>
                <q-card-actions align="right">
                  <q-btn flat :label="updateButton" color="primary" @click="updateUser(selected_row)" />
                  <q-btn flat label="關閉" color="primary" @click="cancelUpdate()" v-close-popup />
                </q-card-actions>
              </q-card>
            </q-dialog>
          </div>
          <!-- <q-btn color="warning" text-color="black" label="下載交易紀錄" size="lg" class="q-px-xl" rounded /> -->
        </div>
      </div>
    </div>
    <q-dialog v-model="userWindow" persistent>
      <q-card style="min-width: 500px">
        <q-card-section>
          <div class="text-h6">填寫使用者資料</div>
        </q-card-section>
        <q-card-section class="q-pt">
          <q-input v-for="( item, key ) in newUser " :key="key" v-model="newUser[key]"
            :label="userColumn[key]"></q-input>
        </q-card-section>
        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="取消" v-close-popup></q-btn>
          <q-btn flat label="新增" v-close-popup @click="registUser(newUser)"></q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>

import { ref } from 'vue'
import { toThousands, getMerchantName, getSHA256Hash } from 'src/utils/index.js'
import { useUserStore, useMerchantStore } from "../../stores";
import { api } from 'boot/axios'
import { exportFile, useQuasar } from 'quasar'
const StatustList = [
  { label: '啟用', value: '1' },
  { label: '禁用', value: '0' },
  { label: '全選', value: '' }
]
const columns = [
  {
    name: "MerchantId", label: "商戶", field: "MerchantId", align: 'left', sortable: true,
    format: (v) => (getMerchantName(v, merchantList.value))
  },
  // { name: "TerminalId", label: "終端", field: "TerminalId", align: 'left', sortable: true },
  { name: "UserId", label: "使用者ID", field: "UserId", align: 'left', sortable: true },
  { name: "Name", label: "姓名", field: "Name", align: 'left', sortable: true },
  { name: "Mail", label: "電子郵件", field: "Mail", align: 'left', sortable: true },
  { name: "Mobile", label: "手機號碼", field: "Mobile", align: 'left', sortable: true },
  {
    name: "CreateTime", label: "建立時間", field: "CreateTime", align: 'left',
    format: (val) => (val.replace('T', ' ')), sortable: true
  }
];
const userColumn = {
  MerchantId: '商戶',
  UserId: '使用者ID',
  Name: '姓名',
  Mail: '電子郵件',
  Mobile: '手機號碼',
  Role: '角色',
  Status: '狀態',
  CreateTime: '建立時間',
  UpdateTime: '更新時間',
  Hash: '登入密碼'
  //BusinessRecord: '業務紀錄',
}
const readonly = ref(true);
const updateButton = ref("更新");
const merchantValue = ref(null);
const userId = ref(null);
const BusinessResultValue = ref(null);
//const RequestDate = ref('');
const pagination = ref({
  sortBy: 'desc',
  descending: true,
  page: 1,
  rowsPerPage: 10,
  rowsNumber: 10
})
const newUser = ref({
  MerchantId: '',
  UserId: '',
  Name: '',
  Mail: '',
  Mobile: '',
  Hash: '',
})
const merchantList = ref([])
const actualMerchant = ref([])
export default {
  name: "UserPage",
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
      userId.value = null;
      //BusinessResultValue.value = '';
      //RequestDate.value = '';
    }
    function loadUser(props) {
      const { page, rowsPerPage, sortBy, descending } = props.pagination ? props.pagination : pagination.value
      var query = {
        Start: (page - 1) * pagination.value.rowsPerPage,
        PageSize: rowsPerPage,
        AuthToken: loginUser.token
      }
      if (merchantValue.value) {
        query.MerchantId = merchantValue.value.value;
      }
      if (userId.value) {
        query.UserId = userId.value;
      }
      // if (BusinessResultValue.value) {
      //   if (BusinessResultValue.value != "") {
      //     query.BusinessResult = BusinessResultValue.value.value;
      //   }
      // }
      if (sortBy) {
        query.SortField = sortBy;
      }
      if (descending) {
        query.SortDir = "DESC";
      } else {
        query.SortDir = "ASC";
      }

      isLoading.value = true;
      api.post('/User/Query', query, {
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
    function cancelUpdate() {
      this.showDetail = false;
      readonly.value = false;
    }
    function updateUser(user) {
      if (updateButton.value == "更新") {
        console.log(user);
        console.log(user.UserId);
        readonly.value = false;
        updateButton.value = "確認更新";
      }
      else if (updateButton.value == "確認更新") {
        console.log(user);
        console.log(user.UserId);
        readonly.value = true;
        // send api
        api.post('/User/Update', user, {
          headers: {}
        }).then((response) => {
          console.log(response.data);
          $q.notify({
            message: "使用者資料已更新",
            position: "center",
            multiLine: true,
            actions: [
              { icon: 'close', color: 'white', round: true, handler: () => { /* ... */ } }
            ]
          });
          updateButton.value = "更新";
        })
          .catch(function (error) {
            // handle error
            console.log(error);
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
    }
    function registUser(user) {
      getSHA256Hash(user.Hash).then(hashPwd => {
        user.Hash = hashPwd;
        api.post('/User/Create', user, {
          headers: {}
        }).then((response) => {
          console.log(response.data);
          loadUser({
            sortBy: 'desc',
            descending: true,
            page: 1,
            rowsPerPage: 10,
            rowsNumber: 10,
            AuthToken: loginUser.token
          });
        })
          .catch(function (error) {
            // handle error
            console.log(error);
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
      });
    }

    loadUser({
      sortBy: 'desc',
      descending: true,
      page: 1,
      rowsPerPage: 10,
      rowsNumber: 10,
      AuthToken: loginUser.token
    });
    return {
      checkDetail,
      clearFilter,
      updateUser,
      cancelUpdate,
      registUser,
      loadUser,
      readonly,
      updateButton,
      showDetail: ref(false),
      userWindow: ref(false),
      newUser,
      userColumn,
      merchantValue,
      userId: userId,
      model: ref(null),
      dateGroup: ref(null),
      merchantList,
      columns,
      rows,
      isLoading,
      pagination
    }
  }
};
</script>
