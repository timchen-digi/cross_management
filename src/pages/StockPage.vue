<template>
  <q-page>
    <q-card class="my-card q-py-md q-mb-md" bordered>
      <div class="BlockContent">
        <h5 class="mainTitle q-px-md">庫存管理</h5>
        <div class="balanceBlock">
          <div class="filterBlock q-gutter-md">
            <q-input v-model="text" label="依商品名稱搜尋" rounded outlined>
              <template v-slot:prepend><q-icon name="search" /></template>
              <template v-slot:append><q-icon v-if="text !== ''" name="close" @click="text = ''"
                  class="cursor-pointer" /></template>
            </q-input>
            <q-select size="lg" v-model="SaleState" :options="['選擇狀態', '上架中', '已下架']" label="狀態" rounded outlined />
            <q-select size="lg" v-model="StockState" :options="['選擇庫存', '有庫存', '無庫存']" label="庫存數量" rounded outlined />
            <q-btn color="warning" icon="search" size="18px" class="q-px-xl text-black" label="搜尋" rounded>
            </q-btn>
          </div>
        </div>
        <div class="row justify-center q-my-md">
          <q-btn color="warning" icon="add_circle_outline" size="18px" class="q-px-xl text-black" label="新增商品"
            unelevated rounded />
        </div>
        <div class="currency">
          <q-list class="rounded-borders" style="max-width: 100%" bordered separator>
            <q-item class="q-py-md" v-for="(StockList, index) in StockList" :key="index">
              <q-item-section center class="col-1">
                <img :src="StockList.img" style="max-width:50%" />
              </q-item-section>
              <q-item-section>
                <q-item-label lines="1" class="row justify-between">
                  <span class="text-weight-medium">{{ StockList.name }}
                    <!-- <q-chip color="warning" size="xs" label="預設" outline></q-chip> -->
                  </span>
                  <q-chip square>
                    <q-avatar :color="StockList.color" text-color="white">{{ StockList.symbol }}</q-avatar>
                    {{ StockList.stock }}
                  </q-chip>
                </q-item-label>
              </q-item-section>
              <q-item-section>

              </q-item-section>
              <q-item-section center side>
                <div class="text-grey-8 q-gutter-xs">
                  <q-btn size="18px" color="secondary" icon="edit" class="q-px-xl text-black" label="編輯" unelevated
                    rounded />
                </div>
              </q-item-section>
            </q-item>
          </q-list>


        </div>
      </div>
    </q-card>
  </q-page>
</template>

<script>
import { ref } from 'vue'
import { toThousands } from 'src/utils/index.js'
import dataTable from "components/DataTable.vue";


export default {
  name: "HomePage",
  methods: {},
  components: {},
  setup() {
    // 從資料庫撈庫存
    const StockList = ref([
      {
        img: "src/assets/Product/P1.jpg",
        name: "MyCard點數卡1000元",
        color: "green",
        symbol: "在庫",
        price: 1000,
        stock: 2000,
      },
      {
        img: "src/assets/Product/P2.png",
        name: "MyCard點數卡500元",
        color: "green",
        symbol: "在庫",
        price: 500,
        stock: 500,
      },
      {
        img: "src/assets/Product/P3.webp",
        name: "上架商品A",
        color: "green",
        symbol: "在庫",
        price: 400,
        stock: 15,
      },
      {
        img: "src/assets/Product/P3.webp",
        name: "上架商品B",
        color: "red",
        symbol: "缺貨",
        price: 350,
        stock: 0,
      },
    ],
    );
    return {
      StockList,
      SaleState: ref('選擇狀態'),
      StockState: ref('選擇庫存'),
    };
  }
}

</script>
<style lang="sass">
.filterBlock
  display: flex
  flex-wrap: nowrap
  align-items: center
  margin: 20px 0

</style>
