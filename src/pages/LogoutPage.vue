<template>
  <div></div>
</template>

<script>
import { defineComponent } from "vue";
import { useUserStore } from "../stores";
export default defineComponent({
  name: "LogoutPage",
  setup() {
    useUserStore().logout();
    return {};
  },
});
</script>
