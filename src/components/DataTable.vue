<template>
  <q-card class="my-card q-my-md">
    <q-card-section class="q-pa-0">
      <div class="text-h5 q-mb-xs">{{ title }}</div>
      <div class="q-my-md row">
        <q-table
          class="recentlyTable col-12"
          flat
          bordered
          :rows="rows"
          :columns="columns"
          :hide-bottom="!showBottom"
        />
      </div>
      <div class="row justify-center q-my-md">
        <q-btn
          color="warning"
          size="18px"
          class="q-px-xl text-black"
          :label="label"
          :to="link"
          unelevated
          rounded
        />
      </div>
    </q-card-section>
  </q-card>
</template>

<script>
import { defineComponent } from "vue";
import { toThousands } from "src/utils/index.js";
export default defineComponent({
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
    },
    columns: {
      default: [
        {
          name: "name",
          required: true,
          label: "日期",
          field: "date",
          align: "left",
        },
        { name: "calories", label: "類型", field: "type", align: "center" },
        { name: "fat", label: "用戶名稱", field: "name", align: "center" },
        { name: "carbs", label: "狀態", field: "state", align: "center" },
        {
          name: "protein",
          label: "手續費",
          field: "fee",
          format: (val) => `NTD$ ${toThousands(val)}`,
          align: "center",
        },
        {
          name: "sodium",
          label: "淨額",
          field: "amt",
          format: (val) => `NTD$ ${toThousands(val)}`,
          align: "right",
        },
      ],
    },
    rows: {
      default: [
        {
          date: "2024/02/06",
          type: "收款",
          name: "Digiflow tech.",
          state: "已付款",
          fee: 15,
          amt: 5678,
        },
        {
          date: "2024/02/06",
          type: "收款",
          name: "Digiflow tech.",
          state: "已提領",
          fee: 1,
          amt: 89,
        },
        {
          date: "2024/02/06",
          type: "收款",
          name: "Digiflow tech.",
          state: "已退款",
          fee: 5,
          amt: 100,
        },
        {
          date: "2024/02/06",
          type: "收款",
          name: "Digiflow tech.",
          state: "已完成",
          fee: 1,
          amt: 10,
        },
        {
          date: "2024/02/06",
          type: "收款",
          name: "Digiflow tech.",
          state: "已完成",
          fee: 0,
          amt: 200,
        },
      ],
    },
  },
});
</script>
