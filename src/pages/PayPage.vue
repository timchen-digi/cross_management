<template>
  <q-page padding>
    <!-- content -->
    <div class="row">
      <div id="parent" class="fit row justify-between" style="overflow: hidden">
        <div class="col-8">
          <div class="text-h4">&nbsp;&nbsp;支付</div>
          <q-input
            rounded
            outlined
            v-model="text"
            label="姓名、用戶名、電子郵件、手機"
          >
            <template v-slot:prepend>
              <q-icon name="search" />
            </template>
          </q-input>
          <br />
          <q-btn
            color="amber"
            text-color="black"
            rounded
            icon-right="send"
            label="下一步"
          />
          <br /><br /><br />
        </div>
        <div class="col-4" style="overflow: auto; padding-left: 1cap">
          <div class="text-h4">&nbsp;&nbsp;聯絡人</div>
          <q-input rounded outlined v-model="text" label="搜尋">
            <template v-slot:prepend>
              <q-icon name="search" />
            </template>
          </q-input>
          <div class="q-pa-md q-gutter-sm">
            <q-item-section>
              <q-item-label class="text-h6">聯絡人1</q-item-label>
              <q-item-label caption>abcdefg@gmail.com</q-item-label>
            </q-item-section>
            <q-separator />
            <q-item-section>
              <q-item-label class="text-h6">聯絡人2</q-item-label>
              <q-item-label caption>abcdefg@gmail.com</q-item-label>
            </q-item-section>
            <q-separator />
            <q-item-section>
              <q-item-label class="text-h6">聯絡人3</q-item-label>
              <q-item-label caption>abcdefg@gmail.com</q-item-label>
            </q-item-section>
            <q-separator />
            <q-item-section>
              <q-item-label class="text-h6">聯絡人4</q-item-label>
              <q-item-label caption>abcdefg@gmail.com</q-item-label>
            </q-item-section>
          </div>
          <br />
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
export default {
  name: "WalletPage",
};
</script>
