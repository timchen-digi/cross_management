<template>
  <q-page padding>
    <!-- content -->
    <div class="row">
      <div id="parent" class="fit row justify-between" style="overflow: hidden">
        <div class="col-4 q-pa-xs">
          <q-card class="my-card q-mb-md" bordered>
            <q-card-section>
              <div class="text-h5 q-mb-xs">商戶基本資料</div>
              <q-separator />
              <div class="text">商戶名稱: {{ username }}</div>
              <q-separator />
              <div class="text">商戶編號: 123456789</div>
              <q-separator />
              <q-card-actions align="center">
                <q-btn
                  style="width: 60%"
                  color="amber"
                  text-color="black"
                  rounded
                  label="編輯"
                />
              </q-card-actions>
            </q-card-section>
          </q-card>
          <q-card class="my-card q-mb-md" bordered>
            <q-card-section>
              <div class="text-h5 q-mb-xs">已綁定收款帳戶</div>
              <q-separator />
              <q-card-section horizontal>
                <img
                  alt="credit card"
                  src="~assets/CardImg/CardImg.png"
                  style="width: 20%; height: 5%; margin: 1cap"
                />
                <div>
                  <div class="text-h6">玉山銀行</div>
                  <div class="text-subtitle2">****-****-3456</div>
                </div>
              </q-card-section>
              <q-separator />
              <q-card-actions align="center">
                <q-btn
                  style="width: 60%"
                  color="amber"
                  text-color="black"
                  rounded
                  label="管理"
                  to="/Wallet"
                />
              </q-card-actions>
            </q-card-section>
          </q-card>
        </div>
        <div class="col-8 q-pa-xs">
          <DataTable
            title="近期活動"
            label="查看交易明細"
            link="/History"
            :showBottom="false"
          />
        </div>
      </div>
    </div>
  </q-page>
</template>
<script>
import { defineComponent } from "vue";
import { useUserStore } from "../stores";
import DataTable from "components/DataTable.vue";
export default defineComponent({
  name: "MerchantPage",
  components: {
    DataTable,
  },
  setup() {
    const user = useUserStore();
    const username = user.username;
    return { username };
  },
});
</script>
