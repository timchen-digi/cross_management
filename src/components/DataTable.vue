<template>
  <q-card class="my-card" bordered>
    <q-card-section>
      <div class="text-h5 q-mb-xs">{{ title }}</div>
      <div>
        <q-table
          class="my-sticky-header-table"
          flat
          bordered
          :rows="rows"
          :columns="columns"
          :hide-bottom="!showBottom"
        />
      </div>
      <q-card-actions align="center">
        <q-btn
          color="amber"
          text-color="black"
          rounded
          :label="label"
          :to="link"
        />
      </q-card-actions>
    </q-card-section>
  </q-card>
</template>

<script>
import { defineComponent } from "vue";
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
        { name: "name", required: true, label: "日期", field: "date" },
        { name: "calories", label: "類型", field: "type" },
        { name: "fat", label: "用戶名稱", field: "name" },
        { name: "carbs", label: "狀態", field: "state" },
        {
          name: "protein",
          label: "手續費",
          field: "fee",
          format: (val) => `$${val} NTD`,
        },
        {
          name: "sodium",
          label: "淨額",
          field: "amt",
          format: (val) => `$${val} NTD`,
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
