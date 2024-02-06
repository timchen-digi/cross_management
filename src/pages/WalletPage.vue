<template>
  <q-page padding>
    <!-- content -->
    <div class="row">
      <div id="parent" class="fit row justify-between" style="overflow: hidden">
        <div class="col-8">
          <br />
          <div id="newlink" class="row justify-between" style="padding: 0.5cap">
            <div class="col-6">
              <q-card
                class="card-create"
                style="margin: 0.5cap; padding: 0.2cap"
                bordered
              >
                <q-card-section>
                  <div class="text-h5">
                    <q-icon
                      class="text-orange"
                      name="add_circle"
                    />&nbsp;連結銀行帳戶<q-icon
                      class="text-gray"
                      name="navigate_next"
                    />
                  </div>
                </q-card-section>
              </q-card>
            </div>
            <div class="col-6">
              <q-card
                class="card-create"
                style="margin: 0.5cap; padding: 0.2cap"
                bordered
              >
                <q-card-section>
                  <div class="text-h5">
                    <q-icon
                      class="text-orange"
                      name="add_circle"
                    />&nbsp;連結信用卡<q-icon
                      class="text-gray"
                      name="keyboard_arrow_right"
                    />
                  </div>
                </q-card-section>
              </q-card>
            </div>
          </div>
          <br />
          <div class="text-h5">&nbsp;&nbsp;Digiflow帳戶</div>
          <br />
          <div>
            <q-card class="card-create" bordered style="margin: 1cap">
              <q-card-section horizontal>
                <img
                  alt="帳戶logo"
                  src="~assets/digiflow.jpeg"
                  style="width: 5%; height: 5%; margin: 1cap"
                />
                <div>
                  <div class="text-h6">Digiflow帳戶餘額</div>
                  <div class="text-subtitle2">
                    可用餘額:&nbsp;&nbsp;NT$ 20240206
                  </div>
                </div>
              </q-card-section>
            </q-card>
          </div>
          <br />
          <div class="text-h5">&nbsp;&nbsp;已綁定的卡片</div>
          <div>
            <q-card class="card-create" style="margin: 1cap">
              <q-card-section horizontal>
                <img
                  alt="credit card"
                  src="~assets/credit-card.png"
                  style="width: 10%; height: 5%; margin: 1cap"
                />
                <div>
                  <div class="text-h6">信用卡</div>
                  <div class="text-subtitle2">****-3456</div>
                </div>
              </q-card-section>
            </q-card>
            <q-card class="card-create" style="margin: 1cap">
              <q-card-section horizontal>
                <img
                  alt="credit card"
                  src="~assets/credit-card.png"
                  style="width: 10%; height: 5%; margin: 1cap"
                />
                <div>
                  <div class="text-h6">信用卡</div>
                  <div class="text-subtitle2">****-3456</div>
                </div>
              </q-card-section>
            </q-card>
          </div>
        </div>
        <div class="col-4" style="overflow: auto; padding-left: 1cap">
          <div class="text-h4">&nbsp;&nbsp;帳戶餘額</div>

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
