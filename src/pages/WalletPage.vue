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
            :class="cardLink === 'digiAccount' ? 'AccountListActive' : ''"
            @click="cardLink = 'digiAccount', tab = 'digiAccount'" unelevated>
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
            :class="link === index ? 'AccountListActive' : ''" @click="cardLink = index, tab = BindCard.type + index"
            unelevated>
            <div class="CardInfo">
              <div class="CardThumb">
                <img :src="BindCard.img" alt="信用卡1" />
              </div>
              <div class="CardTxt">
                <h5>{{ BindCard.type == 'credit' ? '信用卡' : BindCard.type == 'bank' ? '銀行帳戶' : '不明類型' }}</h5>
                <p>{{ BindCard.origin }}<span class="price">{{ BindCard.cardNum }}</span> </p>
              </div>
            </div>
            <q-icon right size="30px" name="chevron_right" color="lightGrey" />
          </q-btn>
        </div>
      </div>
      <div class="col-md-5 col-12 q-px-md">
        <div class="BlockContent">
          <q-tab-panels v-model="tab" animated swipeable vertical transition-prev="jump-up" transition-next="jump-up">
            <q-tab-panel name="digiAccount">
              <h5 class="mainTitle"><img src="src/assets/logos/DigiFlow_logoOnly.svg" alt="DigiFlow"
                  class="TitleLogo">帳戶餘額
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
                          <q-chip v-if="BindCurrency.type == 'default'" color="warning" size="xs" label="預設"
                            outline></q-chip>
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
            </q-tab-panel>
            <q-tab-panel v-for="(BindCard, index) in  BindCard" :key="index" :name="BindCard.type + index">

              <div>
                <h5 class="mainTitle">您已綁定的 {{ BindCard.type == 'credit' ? '信用卡' : BindCard.type == 'bank' ? '銀行帳戶' :
                  '不明類型' }}</h5>
                <div class="CardInfoDetail">
                  <div class="CardImg">
                    <img :src="BindCard.img" alt="信用卡1" />
                  </div>
                  <div class="CardTxt">
                    <p class="nickname">
                      <q-input label="卡片暱稱" v-model="BindCard.nickName" />
                    </p>
                    <div class="origin row justify-between">
                      <div class="cardState">
                        <span class="Tag">
                          {{ BindCard.type == 'credit' ? '信用卡' : BindCard.type == 'bank' ? '銀行帳戶' : '未知類型' }}
                        </span>
                        {{ BindCard.origin }}
                      </div>
                      <p class="price">{{ BindCard.cardNum }}</p>
                    </div>
                    <div class="billAdd"> <q-input label="帳單地址" v-model="BindCard.billAdd" /></div>
                    <div class="row justify-end q-my-xl">
                      <q-btn color="warning" size="18px" class="q-px-xl q-mr-sm" label="移除卡片" rounded outline />
                      <q-btn color="warning" size="18px" class="q-px-xl text-black" label="編輯卡片" rounded />
                    </div>
                  </div>
                </div>
              </div>

            </q-tab-panel>
          </q-tab-panels>

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
          cardNum: '****-3456',
          nickName: '卡片暱稱卡片暱稱',
          origin: 'VISA',
          deadline: '03/2030',
          billAdd: ''
        }, {
          img: '/src/assets/CardImg/CardImg_02.png',
          type: 'bank',
          cardNum: '****-5678',
          nickName: '卡片暱稱卡片暱稱',
          origin: '(808) 玉山銀行',
          deadline: '09/2035',
          billAdd: ''
        }, {
          img: '/src/assets/CardImg/CardImg.png',
          type: '信用卡',
          cardNum: '****-1234',
          nickName: '卡片暱稱卡片暱稱',
          origin: 'mastercaed',
          deadline: '-',
          billAdd: ''
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

    //console.log(tab)

    return {
      simp,
      cardLink: ref('digiAccount'),
      tab: ref('digiAccount')
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
    width: calc(100% - 50px)
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
      width: 100%
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


.CardInfoDetail
    width: 100%
    display: flex
    flex-wrap: wrap
    align-items: center
    color: #333

    .CardImg
      width: 100%
      margin-bottom: 20px
      img
        max-width: 100%

    .CardTxt
      width: 100%
      h5
        margin: 0 0 1rem 0

      .origin
        width: 100%

        .cardState

          .Tag
            color: #777777
            padding: 2px 10px
            border:1px solid $warning
            border-radius: 20px
            margin-right: 5px
</style>
