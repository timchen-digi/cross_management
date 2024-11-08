<template>
  <div class="footer">

    <div class="footerContent">
      <div class="row justify-center items-center q-py-lg">
        <div class="col-6 LOGOBlock">
          <a href="https://www.newebpay.com/" target="_blank">
            <img src="~assets/logos/DigiFlow_logo.svg" style="width:100%" class="footerLOGO">
          </a>
        </div>
        <div class="col-6 InfoBlock">
          <div class="footer_right">
            <ul>
              <li>服務時間：週一至週五 上午9:00 ~ 下午18:00</li>
              <li>客服電話：02-7728-9155 客服傳真：02-2543-3505</li>
              <li>客服信箱：<a href="mailto:cs@digiflowtech.com">cs@digiflowtech.com</a></li>
            </ul>
          </div>
        </div>
      </div>

    </div>

    <div class="copyright">Digiflow tech. ©2024</div>



  </div>

</template>

<script>
export default {
  name: "FooterComp"
};
</script>

<style lang="sass" scoped>
.footer
  background: #E5E5E5

  .footerContent
    max-width: 1200px
    margin: 0 auto

    .LOGOBlock
      text-align: right
      padding: 0 1rem

      .footerLOGO
        max-width: 250px

    .InfoBlock
      padding: 0 1rem

      ul
        list-style: none
        padding-left: 0

  .copyright
    width: 100%
    color: #bcbcbc
    font-size: 13px
    background: #464646
    text-align: center
    padding: 5px 0
    font-weight: 300
</style>
