<template>
  <div class="footer">
    <!--
    <q-toolbar class="Toolbar">
      <img src="~assets/logos/DigiFlow_logo.svg" />
      <q-space />
      <q-tabs shrink>
        <q-tab name="contact" label="聯絡我們" to="/" />
        <q-tab name="qa" label="常見問題" to="/" />
        <q-tab name="privacy" label="隱私權聲明" to="/" />
        <q-tab name="cookie" label="Cookie" to="/" />
        <q-tab name="legal" label="法律同意書" to="/" />
      </q-tabs>
    </q-toolbar>
    -->
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
  .Toolbar
    color: #333
    max-width: 1200px
    margin: 0 auto
    padding: 10px 0
  .copyright
    color: #bcbcbc
    font-size: 13px
    background: #464646
    text-align: center
    padding: 5px 0
    font-weight: 300
</style>
