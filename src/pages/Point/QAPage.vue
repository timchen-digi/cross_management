<template>
  <div class="BannerBlock">
    <div class="row mainBanner">
      <div class="BannerTitle col-lg-6 col-12">
        <div>
          <h1 class="mainTitle">常見問題</h1>
          <p class="subTitle">為您找出常見的問題與解答</p>
        </div>
      </div>
    </div>
  </div>
  <div class="mainContent">
    <div class="PointBlock">
      <div class="QABlock">
        <ul>
          <li>
            <p class="QA_Title"><i class="fas fa-question-circle"></i> 交易成功後錢已經被扣了，遊戲中沒看到交易完成結果？被扣的錢要怎麼辦？</p>
            <ul class="SubContent" style="display: block;">
              <li>申請遊戲補充交易紀錄,
                請您提供以下資料：姓名、連絡手機、遊戲或服務名稱、帳號、伺服器名稱、遊戲角色名稱、註明須處理的事項，將資料以E-MAIL、傳真、郵寄等方式提供給客服，客服人員將與廠商申請補充交易紀錄，約需1-3個工作天(不含假日)
                等待遊戲方回復處理結果。</li>
            </ul>
          </li>
          <li>
            <p class="QA_Title"><i class="fas fa-question-circle"></i> 遊戲購買後可以取消交易嗎？</p>
            <ul class="SubContent">
              <li>各遊戲方或服務品項規定不同，亦可能有不同的退款手續費規定，建議您先向遊戲方確認是否可取消交易。客服於收到遊戲方通知後，協助您處理取消交易相關作業。</li>
            </ul>
          </li>
          <li>
            <p class="QA_Title"><i class="fas fa-question-circle"></i> 什麼時候會收到發票？</p>
            <ul class="SubContent">
              <li>
                在數位鎏網站線上使用轉帳交易、信用卡付款完成境內交易，賣家將在確認收款後，以E-mail方式為您寄出電子發票開立通知。提醒您，未提供E-mail的付款人，我們將把發票開給賣家預設的受捐贈機關或團體並感謝您的愛心。
              </li>
            </ul>
          </li>
          <li>
            <p class="QA_Title"><i class="fas fa-question-circle"></i> 該如何索取發票？</p>
            <ul class="SubContent">
              <li>根據財政部令 台財稅字第 0952400194 號
                訂定之「電子發票實施作業要點」之第十九條：依網路購物開立統一發票交付非營業人作業規定，發票不主動寄送。在確認收到您的款項之後，數位鎏會E-mail寄出開立發票通知。若您有索取紙本發票或補發需求，也可以透過E-mail索取紙本發票，將由客服人員為您服務。
                提醒您，請務必正確填寫您的姓名、寄件地址資料，若資料不完整導致發票無法送達，我們將把發票開給賣家預設的受捐贈機關或團體。</li>
            </ul>
          </li>
          <li>
            <p class="QA_Title"><i class="fas fa-question-circle"></i> 發票中獎說明</p>
            <ul class="SubContent">
              <li>依據財政部的統一發票領獎注意事項說明，每逢單月的二十五日將會開出前兩個月份統一發票的中獎號碼。使用共通性載具(手機條碼或自然人憑證)、數位鎏會員載具之消費者：
                當電子發票中獎時，財政部電子發票整合平台將會自動通知您。未使用共通性載具之消費者： 當電子發票中獎時，我們將依據交易時所填寫的個人資料，郵遞寄出紙本發票到您的地址。
                提醒您，請務必正確填寫您的姓名、寄件地址資料，以保障您的個人權益！</li>
            </ul>
          </li>
          <li>
            <p class="QA_Title"><i class="fas fa-question-circle"></i> 購買失敗仍被扣款該如何處理?</p>
            <ul class="SubContent">
              <li>
                申請退款，請您備妥以下資料：「退款帳號的存摺封面影本(請務必註明銀行名稱及銀行的分行名稱，資料請務必清晰)、姓名、連絡手機、通訊地址、交易序號、交易時間、交易金額、遊戲或服務名稱、註明辦理退款」，將資料以E-MAIL、傳真、郵寄等方式提供給客服中心，客服人員確認交易狀態可退款後，將為您進行後續退款處理，約需3-5個工作天(不含假日)。
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  </div>

</template>
<script>
export default {
  name: "PrivacyComponent",
  mounted() {
    // $('.QA_Title').click(function () {
    //   $(this).next('.SubContent').slideDown();
    //   $(this).parents('li').siblings().find('.SubContent').slideUp();
    // });
  },
  methods: {},
  components: {
  },
  data() {
  },
  setup() {
    return {
    }
  },
};
</script>
<style lang="sass" scoped>
.BannerBlock
  background-image: url(src/assets/banner/MainBanner_QA.jpg)
</style>
