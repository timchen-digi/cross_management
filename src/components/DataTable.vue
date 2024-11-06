<template>
  <div v-if="title" class="text-h5 q-mb-xs">{{ title }}</div>
  <div class="q-my-md row">
    <q-table class="OrderTable" :rows="rows" :columns="columns" :row-key="rows.name" v-model:pagination="pagination"
      :rows-per-page-options="[10, 25, 50]" no-data-label="I didn't find anything for you" :filter="filter"
      :loading="isLoading" flat>
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
    <q-dialog v-model="alert">
      <q-card>
        <q-card-section>
          <div class="text-h6">訂單詳細資料</div>
        </q-card-section>
        <q-card-section class="q-pt-none">
          <div v-html="generateTable(selected_row)"></div>
          <!-- {{ generateTable(selected_row) }} -->
          <!-- 這邊顯示詳細資料 -->
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="關閉" color="primary" @click="alert = false" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
  <!-- <div v-if="rows.length >= 10" class="row justify-center q-mt-md">
    <q-pagination v-model="pagination.page" :max="pagesNumber" :max-pages="8" direction-links flat color="grey"
      active-color="warning" gutter="md" />
  </div> -->
  <div v-if="label" class="row justify-center q-my-md">
    <q-btn color="warning" size="18px" class="q-px-xl text-black" :label="label" to="/Management/Order" unelevated
      rounded />
  </div>
</template>

<script>

import { ref, computed } from 'vue'

export default {
  name: "DataTable",
  props: {
    showBottom: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      required: true,
    },
    label: {
      type: String,
      default: "",
    },
    link: {
      type: String,
      default: "#",
    },
    source: {
      type: String,
    },
    filter: {
      type: String,
      default: ""
    },
    columns: {
      type: Array
    },
    rows: {
      type: Array
    },
    isLoading: {
      type: Boolean,
      default: false
    }
  },
  setup(props) {
    //console.log(props.rows);
    //console.log(props.columns);
    const pagination = ref({
      sortBy: 'desc',
      descending: true,
      page: 1,
      rowsPerPage: 10
    })
    function checkDetail(row) {
      this.selected_row = row;
      this.alert = true;
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
    return {
      pagination,
      pagesNumber: computed(() => Math.ceil(props.rows.length / pagination.value.rowsPerPage)),
      alert: ref(false),
      selected_row: ref({}),
      checkDetail,
      generateTable
    }
  },
};
</script>

<style lang="sass">
.OrderTable
  width: 100%

  .q-table__top,
  thead tr:first-child th
    color: #FFF
    background-color: #738A94

.q-pagination__middle > .q-btn
  width: 30px
  height: 30px
  border-radius: 50%

.q-btn:before
  box-shadow: none

.noData
  width: 100%
  min-height: 300px
  color: #333
  text-align: center
  position: relative
  top: 30%

  h5
    width: 100%
    font-size: 1.4rem
    font-weight: 600
    margin: 0 0 1rem 0
  p
    width: 100%
</style>
