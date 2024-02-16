<template>
  <q-page padding>
    <!-- content -->
    <div class="row fit row justify-between">
      <div class="col-md-7 col-12">
        <div class="row justify-between">
          <div class="col-6">
            <q-btn class="cardBTN" align="between" outline>
              <div class="row justify-between items-center BTNTxt">
                <q-icon left size="2em" name="add_circle" /> 連結銀行帳戶
              </div>
              <q-icon right size="30px" name="chevron_right" />
            </q-btn>
          </div>
          <div class="col-6">
            <q-btn class="cardBTN" align="between" outline>
              <div class="row justify-between items-center BTNTxt">
                <q-icon left size="2em" name="add_circle" /> 連結信用卡
              </div>
              <q-icon right size="30px" name="chevron_right" color="lightGrey" />
            </q-btn>
          </div>
        </div>
        <div class="BlockContent">
          <h5 class="Title">Digiflow帳戶</h5>
          <q-btn class="AccountList btn-fixed-width" align="between"
            :class="link === 'digiAccount' ? 'AccountListActive' : ''" @click="link = 'digiAccount'" unelevated>
            <div class="CardInfo">
              <div class="CardThumb">
                <img :src="DigiAccound.img" alt="DIGIFlow" />
              </div>
              <div class="CardTxt">
                <h5>Digiflow帳戶餘額</h5>
                <p>可用餘額: <span class="price">NT$ {{ toThousands(DigiAccound.balance) }}</span></p>
              </div>
            </div>
            <q-icon right size="30px" name="chevron_right" color="lightGrey" />
          </q-btn>
        </div>
        <div class="BlockContent">
          <h5 class="Title">已綁定的卡片</h5>
          <q-btn v-for="(BindCard, index) in  BindCard" :key="index" class="AccountList btn-fixed-width" align="between"
            :class="link === index ? 'AccountListActive' : ''" @click="link = index" unelevated>
            <div class="CardInfo">
              <div class="CardThumb">
                <img :src="BindCard.img" alt="信用卡1" />
              </div>
              <div class="CardTxt">
                <h5>{{ BindCard.type == 'credit' ? '信用卡' : BindCard.type == 'bank' ? '銀行帳戶' : '不明類型' }}</h5>
                <p>{{ BindCard.cardNum }}</p>
              </div>
            </div>
            <q-icon right size="30px" name="chevron_right" color="lightGrey" />
          </q-btn>
        </div>
      </div>
      <div class="col-md-5 col-12 q-px-md">
        <div class="BlockContent">
          <h5 class="mainTitle"><img src="src/assets/logos/DigiFlow_logoOnly.svg" alt="DigiFlow" class="TitleLogo">帳戶餘額
          </h5>
          <div class="balanceBlock">
            <h5>NT$ <span class="price">{{ toThousands(DigiAccound.balance) }}</span></h5>
            <p class="Remark">*以最新貨幣轉換匯率估算</p>
          </div>
          <div class="row justify-end q-my-md">
            <q-btn color="warning" size="18px" class="q-px-xl text-black" label="提現" unelevated rounded />
          </div>
          <div class="currency">
            <q-list class="rounded-borders" style="max-width: 100%" bordered separator>

              <q-item class="q-py-md" v-for="(BindCurrency, index) in  BindCurrency" :key="index">
                <q-item-section center class="col-1">
                  <q-avatar size="md">
                    <img :src="BindCurrency.img">
                  </q-avatar>
                </q-item-section>

                <q-item-section center>
                  <q-item-label lines="1" class="row justify-between">
                    <span class="text-weight-medium">{{ BindCurrency.name }}
                      <q-chip v-if="BindCurrency.type == 'default'" color="warning" size="xs" label="預設" outline></q-chip>
                    </span>
                    <span class="text-grey-8">{{ BindCurrency.symbol }} {{ toThousands(BindCurrency.balance) }}</span>
                  </q-item-label>
                </q-item-section>

                <q-item-section center side>
                  <div class="text-grey-8 q-gutter-xs">
                    <q-btn size="12px" flat dense round icon="more_vert" v-if="BindCurrency.type != 'default'">
                      <q-menu auto-close square :offset="[0, 5]">
                        <q-list>
                          <q-item clickable>
                            <q-item-section class="text-subtitle1">設為預設</q-item-section>
                          </q-item>
                          <q-item clickable>
                            <q-item-section class="text-red">刪除貨幣</q-item-section>
                          </q-item>
                        </q-list>
                      </q-menu>
                    </q-btn>
                  </div>
                </q-item-section>
              </q-item>

            </q-list>

            <div class="row justify-end q-my-md">
              <q-btn color="warning" size="18px" class="q-px-xl text-black" label="新增幣別" unelevated rounded />
            </div>
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>
<script>
import { ref } from 'vue'
import { toThousands } from 'src/utils/index.js'

export default {

  data() {
    return {
      toThousands,
      DigiAccound: {
        img: '/src/assets/logos/DigiFlow_logoOnly.svg',
        type: 'digiflow',
        balance: 20240206
      },
      BindCard: [
        {
          img: '/src/assets/CardImg/CardImg.png',
          type: 'credit',
          cardNum: '****-3456'
        }, {
          img: '/src/assets/CardImg/CardImg_02.png',
          type: 'bank',
          cardNum: '****-5678'
        }, {
          img: '/src/assets/CardImg/CardImg_02.png',
          type: 'order',
          cardNum: '****-5678'
        }
      ],
      BindCurrency: [
        {
          img: 'src/assets/currency/Flag_Tw.svg',
          name: 'TWD',
          type: 'default',
          symbol: 'NT$',
          balance: 20240206
        }, {
          img: 'src/assets/currency/Flag_Cn.svg',
          name: 'RMB',
          type: 'natural',
          symbol: '¥',
          balance: 121234
        }, {
          img: 'src/assets/currency/Flag_US.svg',
          name: 'USD',
          type: 'natural',
          symbol: '$',
          balance: 1999
        }, {
          img: 'src/assets/currency/Flag_JP.svg',
          name: 'JPY',
          type: 'natural',
          symbol: '¥',
          balance: 651234
        }
      ]
    }
  },
  setup() {

    const isActive = ref(false)

    const simp = (a) => {
      console.log(a)
      isActive.value = true
    }

    return {
      simp,
      link: ref('digiAccount')
    }

  }
};

</script>

<style lang="sass">

.cardBTN
  color: #FCB335
  width: calc(100% - 4px)
  height: 100px
  margin: 0 2px
  border: 2px solid
  border-radius: 8px

  i
    color: #B5B5B5

  .BTNTxt
    color:#333
    font-size: 1.2rem

    i
      color: #FCB335

.balanceBlock
  background: #F9EAD6
  padding: 1rem
  border-radius: 8px

  h5
    display: flex
    justify-content: space-between
    margin: 1rem 0

    .price
      font-size: 2rem
      font-weight: 600

  .Remark
    font-size: 0.9rem
    text-align: right

.AccountList
  width: 100%
  color: #FCB335
  justify-content: space-between
  padding: 1rem
  border: 1px solid #dfdfdf
  border-radius: 8px
  margin: 0 0 8px 0

  .CardInfo
    width: auto
    display: flex
    align-items: center
    color: #333

    i
      color: #B5B5B5

    .CardThumb
      width: 100px
      height: 65px
      border: 1px solid #dfdfdf
      border-radius: 5px
      display: flex
      justify-content: center
      align-items: center

      img
        max-width: 100%

    .CardTxt
      width: calc(100% - 100px)
      text-align: left
      margin-left: 10px

      h5
        font-size: 1.3rem
        font-weight: 600
        margin: 0

      p
        font-size: 1rem
        margin: 0
        display: flex
        justify-content: space-between

.AccountListActive
  border: 3px solid #FCB335


</style>
