<template>
  <q-page>
    <div class="row">
      <h5 class="mainTitle q-px-md">API紀錄查詢</h5>
    </div>
  </q-page>
</template>
<script>
import { ref } from 'vue'
import dataTable from "src/components/DataTable.vue";
import { api } from 'boot/axios'
import { useQuasar } from 'quasar'
export default {
  name: "ApiLogPage",
  methods: {},
  components: {
  },
  data() {
  },
  setup() {
    const apiLogData = ref({});
    const $q = useQuasar()
    function loadData() {
      api.post('/log/GetMerchantLog', {
        Start: 0,
        PageSize: 3
      }, {
        headers: {}
      })
        .then((response) => {
          console.log(response.data);
          apiLogData.value = response.data
          $q.notify(response.data);
        })
        .catch(function (error) {
          // handle error
          //console.log(error);
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
    loadData();
    return {
      filter: ref('filter'),
      apiLogData,
      loadData
    }
  },
};
</script>
