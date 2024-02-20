<template>
  <div v-if="title" class="text-h5 q-mb-xs">{{ title }}</div>
  <div class="q-my-md row">
    <q-table class="OrderTable" :rows="rows" :columns="columns" :row-key="rows.name" v-model:pagination="pagination"
      :rows-per-page-options="[0]" no-data-label="I didn't find anything for you" :filter="filter" flat
      :hide-bottom="rows.length <= 0 ? false : true">

      <template v-slot:no-data="">
        <div class="noData">
          <h5>查無交易明細</h5>
          <p>請嘗試使用其他條件篩選</p>
        </div>
      </template>

    </q-table>
  </div>
  <div v-if="rows.length >= 10" class="row justify-center q-mt-md">
    <q-pagination v-model="pagination.page" :max="pagesNumber" size="sm" direction-links flat color="grey"
      active-color="warning" gutter="md" />
  </div>
  <div v-if="label" class="row justify-center q-my-md">
    <q-btn color="warning" size="18px" class="q-px-xl text-black" :label="label" to="/History" unelevated rounded />
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
    }
  },
  setup(props) {
    const pagination = ref({
      sortBy: 'desc',
      descending: true,
      page: 1,
      rowsPerPage: 10
    })

    return {
      pagination,
      pagesNumber: computed(() => Math.ceil(props.rows.length / pagination.value.rowsPerPage))
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
