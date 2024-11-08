<template>
  <div class="q-my-md">
    <div class="text-subtitle1">營業登記類別</div>
    <div class="inputGroup q-mb-lg">
      <q-btn-toggle v-model="taxType" color="grey" toggle-color="warning" :options="tax_option" size="15px" no-caps
        unelevated rounded />
    </div>


    <div class="inputContent" v-if="taxType == 0">

      <div class="inputGroup">
        <div class="text-subtitle1">企業名稱：</div>
        <q-input color="warning" v-model="businessName" rounded outlined placeholder="顯示予付款用戶的商店名稱"
          :rules="[val => !!val || '此欄位必填']" />
      </div>

      <div class="inputGroup">
        <div class="text-subtitle1">{{ tax_option[taxType].slot }}</div>
        <q-input color="warning" v-model="UBN" rounded outlined :rules="[checkTaxInfo]">
        </q-input>
      </div>

      <div class="inputGroup">
        <div class="text-subtitle1">實收資本額</div>
        <q-input color="warning" v-model="capital" rounded outlined placeholder="" :rules="[val => !!val || '此欄位必填']" />
      </div>

      <div class="inputGroup">
        <div class="text-subtitle1">{{ tax_option[taxType].ext_data2 }}</div>
        <q-input v-model="address" rounded outlined />
      </div>

      <div class="inputGroup">
        <div class="text-subtitle1">核准設立日期</div>
        <q-input color="warning" v-model="registerDate" rounded outlined placeholder="YYYY-MM-DD"
          :rules="[val => !!val || '此欄位必填']" />
      </div>

      <div class="inputGroup">
        <div class="text-subtitle1">商戶類別代碼(MCC code)</div>
        <q-input color="warning" v-model="mcc" rounded outlined placeholder="4位數MCC，若不確定請留空" />
      </div>

      <div class="inputGroup">
        <div class="text-subtitle1 q-mt-md">販售商品說明</div>
        <q-input color="warning" v-model="productDesc" rounded outlined placeholder="簡述販賣商品內容" />
      </div>

      <div class="inputGroup">
        <div class="text-subtitle1">營業登記文件：<q-btn label="了解上傳登記文件" color="primary" @click="companyDocLog = true" flat />
        </div>
        <div class="row items-center q-py-md">
          <div v-for="(fileField, index) in fileFields.companyDocs" :key="index" class="col-lg-2 col-4">
            <q-file v-model="fileField.file" label="" @input="onFileChange('companyDocs', index, $event)" filled
              accept="image/*, application/pdf" class="fileField q-gutter-sm">
              <template v-slot:label>
                <q-icon name="attach_file" size="xl" />
              </template>
              <template v-slot:file>
                <img v-if="fileField.previewUrl" :src="fileField.previewUrl" alt="Image Preview"
                  style="width: 80px; height: 80px" />
              </template>
              <template v-slot:append v-if="index !== 0">
                <q-btn class="removeFileField" icon="close" color="negative" size="xs"
                  @click="removeFileField('companyDocs', index)" v-if="index !== 0" round />
              </template>
            </q-file>
          </div>
          <q-btn class="addBtn col-lg-2 col-4" color="warning" @click="addFileField('companyDocs')" icon="add" />
        </div>

        <q-dialog v-model="companyDocLog" medium>
          <q-card>
            <q-card-section class="row items-center q-pb-none">
              <div class="text-h6">營業登記文件上傳說明</div>
              <q-space />
              <q-btn icon="close" flat round dense v-close-popup />
            </q-card-section>

            <q-card-section>
              <ul style="margin:20px 0px;line-height:30px;">
                <li>請上傳主管機關核發之公司登記核准函或公司登記表</li>
                <li>
                  若文件中無揭露企業統一編號，請附上「<span style="color:red;">統一編號編配書</span>」，以免審核失敗
                  <div style="font-size:14px;color:#999999">(如財團法人登記證書、人民團體立案證書、社團法人登記證書/立案證書、機構設立登記證書......等)</div>
                </li>
                <li>欲加註浮水印，請使用「<span style="color:red;">僅限數位鎏金流申請使用</span>」字樣，勿添加其他文字以免審核失敗</li>
                <li>若非單頁文件，建議合併為單一PDF檔</li>
                <li>支援檔案格式為PDF、JPG、JPEG、PNG</li>
                <li>單個檔案大小不超過 <span class="fileSize">5M</span></li>
                <li>若上傳檔案為圖片格式，每張圖片解析度建議為 96 dpi</li>
              </ul>
              <div style="background:#F5F5F5;padding:20px;border-radius:5px;">
                接受以下文件：
                <div>
                  <ul id="can_upload_comfile_list">
                    <li>公司登記核准函</li>
                    <li>商業登記抄本</li>
                    <li>人民團體立案證書</li>
                    <li>公司登記表</li>
                    <li>法人登記證書</li>
                    <li>設立核准函</li>
                    <li>商業登記核准函</li>
                    <li>統一編號編配書</li>
                    <li>機構設立登記證書</li>
                  </ul>
                  <div style="clear:both;"></div>
                </div>
              </div>
            </q-card-section>
          </q-card>
        </q-dialog>

      </div>

    </div>

    <div class="inputContent" v-if="taxType == 1">

      <div class="inputGroup">
        <div class="text-subtitle1">{{ tax_option[taxType].ext_data }}</div>
        <q-input v-model="businessName" rounded outlined />
      </div>

      <div class="inputGroup">
        <div class="text-subtitle1">{{ tax_option[taxType].slot }}</div>
        <q-input color="warning" v-model="UBN" rounded outlined :rules="[val => !!val || '此欄位必填']" />
      </div>

      <div class="inputGroup">
        <div class="text-subtitle1">身分證發證日期</div>
        <q-input color="warning" v-model="registerDate" rounded outlined placeholder="民國 年 月 日"
          :rules="[val => !!val || '此欄位必填']" />
      </div>

      <div class="inputGroup">
        <div class="text-subtitle1">身分證發證地點：</div>
        <div class="q-gutter-md row">
          <q-select v-model="idLocate" :options="locationOptions" style="width: 200px" outlined rounded />
          <q-select v-model="idType" :options="applyReason" style="width: 200px" outlined rounded />
        </div>
      </div>

      <div class="inputGroup">
        <div class="text-subtitle1">出生年月日</div>
        <q-input color="warning" v-model="registerDate" rounded outlined placeholder="YYYY-MM-DD"
          :rules="[val => !!val || '此欄位必填']" />
      </div>

      <div class="inputGroup">
        <div class="text-subtitle1">身分證圖片：<q-btn label="了解身分證圖片上傳" color="primary" @click="IdCardLog = true" flat />
        </div>
        <div class="row items-center q-py-md">
          <div v-for="(fileField, index) in fileFields.bizBossIdCard" :key="index" class="col-lg-2 col-4">
            <q-file v-model="fileField.file" label="" @input="onFileChange('bizBossIdCard', index, $event)" filled
              accept="image/*, application/pdf" class="fileField q-gutter-sm">
              <template v-slot:label>
                <q-icon name="attach_file" size="xl" />
              </template>
              <template v-slot:file>
                <img v-if="fileField.previewUrl" :src="fileField.previewUrl" alt="Image Preview"
                  style="width: 80px; height: 80px" />
              </template>
              <template v-slot:append v-if="index !== 0">
                <q-btn class="removeFileField" icon="close" color="negative" size="xs"
                  @click="removeFileField('bizBossIdCard', index)" v-if="index !== 0" round />
              </template>
            </q-file>
          </div>
          <q-btn class="addBtn col-lg-2 col-4" color="warning" @click="addFileField('bizBossIdCard')" icon="add" />
        </div>

        <q-dialog v-model="IdCardLog" medium>
          <q-card>
            <q-card-section class="row items-center q-pb-none">
              <div class="text-h6">身分證圖片上傳說明</div>
              <q-space />
              <q-btn icon="close" flat round dense v-close-popup />
            </q-card-section>

            <q-card-section>
              <div class="modal-body">
                <div style="display:flex;justify-content:space-between;">
                  <div style="width:48%;display:inline-block;">
                    <img src="/register/idcard_front.jpg" style="width:100%;height:auto;" alt="身分證正面">
                    <div style="text-align:center;margin-top:10px;">
                      <i class="fa fa-solid fa-caret-up" style="margin-right:5px;"></i>身分證正面
                    </div>
                  </div>
                  <div style="width:48%;display:inline-block;">
                    <img src="/register/idcard_back.jpg" style="width:100%;height:auto;" alt="身分證反面">
                    <div style="text-align:center;margin-top:10px;">
                      <i class="fa fa-solid fa-caret-up" style="margin-right:5px;"></i>身分證反面
                    </div>
                  </div>
                </div>
                <ul style="list-style-position:inside;margin:20px 0px;line-height:30px;">
                  <li>請上傳身分證正面一張、反面一張</li>
                  <li>圖片格式為JPG、JPEG、PNG</li>
                  <li>單張圖片檔案大小不超過 <span class="fileSize">5M</span></li>
                  <li>每張圖片解析度為 96dpi</li>
                </ul>
                <div style="background:#F5F5F5;padding:8px;">
                  欲加註浮水印，請使用「<span style="color:red;">僅限數位鎏金流申請使用</span>」字樣，勿添加其他文字以免審核失敗。
                </div>
              </div>
            </q-card-section>
          </q-card>
        </q-dialog>

      </div>

      <div class="inputGroup">
        <div class="text-subtitle1">健保卡圖片：<q-btn label="了解健保卡圖片上傳" color="primary" @click="HealthCardLog = true" flat />
        </div>
        <div class="row items-center q-py-md">
          <div v-for="(fileField, index) in fileFields.bizBossHealthCard" :key="index" class="col-lg-2 col-4">
            <q-file v-model="fileField.file" label="" @input="onFileChange('bizBossHealthCard', index, $event)" filled
              accept="image/*, application/pdf" class="fileField q-gutter-sm">
              <template v-slot:label>
                <q-icon name="attach_file" size="xl" />
              </template>
              <template v-slot:file>
                <img v-if="fileField.previewUrl" :src="fileField.previewUrl" alt="Image Preview"
                  style="width: 80px; height: 80px" />
              </template>
            </q-file>
          </div>
        </div>

        <q-dialog v-model="HealthCardLog" medium>
          <q-card>
            <q-card-section class="row items-center q-pb-none">
              <div class="text-h6">健保卡圖片上傳說明</div>
              <q-space />
              <q-btn icon="close" flat round dense v-close-popup />
            </q-card-section>

            <q-card-section>
              <div class="modal-body">
                <div style="display:flex;justify-content:space-between;">
                  <div style="width:48%;display:inline-block;">
                    <img src="/register/HealthCard.jpg" style="width:100%;height:auto;" alt="健保卡正面">
                    <div style="text-align:center;margin-top:10px;">
                      <i class="fa fa-solid fa-caret-up" style="margin-right:5px;"></i>健保卡正面
                    </div>
                  </div>
                </div>
                <ul style="list-style-position:inside;margin:20px 0px;line-height:30px;">
                  <li>請上傳身分證正面一張、反面一張</li>
                  <li>圖片格式為JPG、JPEG、PNG</li>
                  <li>單張圖片檔案大小不超過 <span class="fileSize">5M</span></li>
                  <li>每張圖片解析度為 96dpi</li>
                </ul>
                <div style="background:#F5F5F5;padding:8px;">
                  欲加註浮水印，請使用「<span style="color:red;">僅限數位鎏金流申請使用</span>」字樣，勿添加其他文字以免審核失敗。
                </div>
              </div>
            </q-card-section>
          </q-card>
        </q-dialog>

      </div>

      <!--<div class="inputGroup">
            <div class="text-subtitle1">英文營業名稱</div>
            <q-input color="warning" v-model="businessNameEn" rounded outlined placeholder="顯示於信用卡帳單的商店名稱"
              :rules="[val => !!val || '此欄位必填']" />
          </div>-->

    </div>

    <div class="inputContent">
      <div class="inputGroup">
        <div class="text-subtitle1">是否有實體店鋪</div>
        <div class="q-gutter-sm">
          <q-radio v-model="entityShop" val="entity" label="有實體店鋪" />
          <q-radio v-model="entityShop" val="unentity" label="無實體店鋪" />
        </div>
      </div>

      <div class="inputGroup" v-if="entityShop == 'entity'">
        <div class="text-subtitle1">店鋪地址：</div>
        <q-input color="warning" v-model="regName" rounded outlined :rules="[val => !!val || '此欄位必填']" />
      </div>
      <div class="inputGroup" v-if="entityShop == 'entity' || entityShop == 'unentity'">
        <div class="text-subtitle1">線上商店網址：</div>
        <q-input v-model="storeLink" rounded outlined
          :rules="[entityShop == 'unentity' ? val => !!val || '此欄位必填' : true]" />
      </div>
    </div>

  </div>

  <div class="q-my-md" v-if="taxType == 0">
    <h5 class="MainTitle">企業代表人資料</h5>
    <div class="inputContent">
      <div class="text-subtitle1">此欄位將進行身分證領補換資料驗證，請正確填寫。</div>
      <div class="text-subtitle1">&nbsp;</div>
      <div class="inputGroup">
        <div class="text-subtitle1">企業代表人姓名</div>
        <q-input color="warning" v-model="leaderName" rounded outlined placeholder=""
          :rules="[val => !!val || '此欄位必填']" />
      </div>
      <div class="inputGroup">
        <div class="text-subtitle1">代表人身分證字號</div>
        <q-input color="warning" v-model="leaderId" rounded outlined :rules="[val => !!val || '此欄位必填']" />
      </div>
      <div class="inputGroup">
        <div class="text-subtitle1">身分證發證日期</div>
        <q-input v-model="idYear" outlined rounded placeholder="民國 年 月 日" :rules="[val => !!val || '此欄位必填']" />
      </div>
      <div class="inputGroup">
        <div class="text-subtitle1">身分證發證地點：</div>
        <div class="q-gutter-md row">
          <q-select v-model="idLocate" :options="locationOptions" style="width: 200px;" dense outlined rounded />
          <q-select v-model="idType" :options="applyReason" style="width: 200px;" dense outlined rounded />
        </div>
      </div>
    </div>

    <div class="inputGroup">
      <div class="text-subtitle1">身分證圖片：<q-btn label="了解身分證圖片上傳" color="primary" @click="companyIdCardLog = true"
          flat />
      </div>
      <div class="row items-center q-py-md">
        <div v-for="(fileField, index) in fileFields.bizBossIdCard" :key="index" class="col-lg-2 col-4">
          <q-file v-model="fileField.file" label="" @input="onFileChange('bizBossIdCard', index, $event)" filled
            accept="image/*, application/pdf" class="fileField q-gutter-sm">
            <template v-slot:label>
              <q-icon name="attach_file" size="xl" />
            </template>
            <template v-slot:file>
              <img v-if="fileField.previewUrl" :src="fileField.previewUrl" alt="Image Preview"
                style="width: 80px; height: 80px" />
            </template>
            <template v-slot:append v-if="index !== 0">
              <q-btn class="removeFileField" icon="close" color="negative" size="xs"
                @click="removeFileField('bizBossIdCard', index)" v-if="index !== 0" round />
            </template>
          </q-file>
        </div>
        <q-btn class="addBtn col-lg-2 col-4" color="warning" @click="addFileField('bizBossIdCard')" icon="add" />
      </div>

      <q-dialog v-model="companyIdCardLog" medium>
        <q-card>
          <q-card-section class="row items-center q-pb-none">
            <div class="text-h6">身分證圖片上傳說明</div>
            <q-space />
            <q-btn icon="close" flat round dense v-close-popup />
          </q-card-section>

          <q-card-section>
            <div class="modal-body">
              <div style="display:flex;justify-content:space-between;">
                <div style="width:48%;display:inline-block;">
                  <img src="/register/idcard_front.jpg" style="width:100%;height:auto;" alt="身分證正面">
                  <div style="text-align:center;margin-top:10px;">
                    <i class="fa fa-solid fa-caret-up" style="margin-right:5px;"></i>身分證正面
                  </div>
                </div>
                <div style="width:48%;display:inline-block;">
                  <img src="/register/idcard_back.jpg" style="width:100%;height:auto;" alt="身分證反面">
                  <div style="text-align:center;margin-top:10px;">
                    <i class="fa fa-solid fa-caret-up" style="margin-right:5px;"></i>身分證反面
                  </div>
                </div>
              </div>
              <ul style="list-style-position:inside;margin:20px 0px;line-height:30px;">
                <li>請上傳身分證正面一張、反面一張</li>
                <li>圖片格式為JPG、JPEG、PNG</li>
                <li>單張圖片檔案大小不超過 <span class="fileSize">5M</span></li>
                <li>每張圖片解析度為 96dpi</li>
              </ul>
              <div style="background:#F5F5F5;padding:8px;">
                欲加註浮水印，請使用「<span style="color:red;">僅限數位鎏金流申請使用</span>」字樣，勿添加其他文字以免審核失敗。
              </div>
            </div>
          </q-card-section>
        </q-card>
      </q-dialog>

    </div>

  </div>

  <div class="q-my-md">
    <h5 class="MainTitle">聯絡人資料</h5>
    <div class="inputContent">
      <div class="inputGroup">
        <div class="text-subtitle1">聯絡人姓名</div>
        <q-input color="warning" v-model="contactName" rounded outlined placeholder=""
          :rules="[val => !!val || '此欄位必填']" />
      </div>
      <div class="inputGroup">
        <div class="text-subtitle1">電子郵件</div>
        <q-input color="warning" v-model="email" type="email" rounded outlined placeholder=""
          :rules="[val => !!val || '此欄位必填']" />
      </div>
      <div class="inputGroup">
        <div class="text-subtitle1">連絡電話</div>
        <div class="q-gutter-md row items-start">
          <q-select v-model="phonePrefix" :options="['+886', '+86', '+852', '+1']" style="width: 120px;" outlined
            rounded dense />
          <q-input v-model="phoneNum" placeholder="請輸入手機號碼" type="tel" style="width: 250px;" outlined rounded dense
            :rules="[val => !!val || '此欄位必填']" />
        </div>
      </div>
      <div class="inputGroup">
        <div class="text-subtitle1">{{ tax_option[taxType].ext_data2 }}</div>
        <q-input v-model="address" rounded outlined :rules="[val => !!val || '此欄位必填']" />
      </div>
      <div class="inputGroup">
        <div class="text-subtitle1">註冊pin碼 (查詢進度由此Pin碼驗證登入)</div>
        <q-input v-model="pinCode" placeholder="更新註冊資料使用，留空將由系統自動產生" rounded outlined />
      </div>
      <div class="inputGroup">
        <div class="text-subtitle1">介紹人</div>
        <q-input color="warning" v-model="inviter" rounded outlined placeholder="自動帶入" disabled />
      </div>
    </div>
    <div class="checkTerms">
      <div class="inputGroup VerificationCode">
        <div class="text-subtitle1 Title">驗證碼</div>
        <q-input v-model="verify" bottom-slots rounded outlined dense style="max-width: 400px;">
          <template v-slot:control>
            <div class="self-center full-width no-outline" tabindex="0"></div>
          </template>
          <template v-slot:after>
            <Sidentify :identifyCode="identifyCode" />
            <q-icon class="refresh" name="refresh" @click="refreshIdentifyCode" size="md" />
          </template>
        </q-input>
      </div>
      <q-list>
        <q-item tag="label" manual-focus v-ripple="{ color: 'warning' }">
          <q-item-section avatar>
            <q-checkbox color="warning" v-model="agreeRight" />
          </q-item-section>
          <q-item-section>
            <q-item-label>我已閱讀並且同意 數位鎏金融服務的 <a href="#">服務條款</a></q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </div>
    <div class="BtnGroup">
      <q-btn color="warning" text-color="black" label="註冊" size="lg" rounded @click="regClick" />
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import Sidentify from "/src/utils/identify.vue"
import { api } from 'boot/axios'
import { useQuasar } from 'quasar'

export default {
  name: "RegisterPage",
  components: {
    Sidentify
  },
  data() {
    return {
      identifyCode: "", //密碼登入圖形驗證碼
      identifyCodes: "1234567890abcdefghizklmnopqrstuvwxyz", //生成圖形驗證碼依據
      fileFields: {
        companyDocs: [
          { file: null, previewUrl: null } // 初始化一個文件欄位
        ],
        bizBossIdCard: [
          { file: null, previewUrl: null } // 初始化一個文件欄位
        ],
        bizBossHealthCard: [
          { file: null, previewUrl: null } // 初始化一個文件欄位
        ]
      },
      locationOptions: ['北市', '高市', '新北市', '中市', '南市', '桃市',
        '北縣', '宜縣', '桃縣', '竹縣', '苗縣', '中縣', '彰縣', '投縣', '雲縣', '嘉縣', '南縣', '高縣', '屏縣',
        '東縣', '花縣', '澎縣', '基市', '竹市', '嘉市', '連江', '金門'],
      applyReason: [
        { label: '請選擇', value: '0' },
        { label: '初發', value: '1' },
        { label: '補發', value: '2' },
        { label: '換發', value: '3' },
      ]
    }
  },
  setup() {
    function CheckInput() {
      var msg = "";
      var type = taxType.value;
      if (UBN.value == "") msg += tax_option[type].slot + ", ";
      if (regName.value == "") msg += tax_option[type].ext_data + ", ";
      if (regName.value == "") msg += tax_option[type].ext_data2 + ", ";
      if (businessName.value == "") msg += "營業名稱, ";
      if (contactName.value == "") msg += "聯絡人, ";
      if (email.value == "") msg += "電子郵件, ";
      if (phoneNum.value == "") msg += "連絡電話, ";
      if (leaderName.value == "") msg += "企業代表人姓名, ";
      if (registerDate.value == "") msg += "核准設立日期, ";
      if (capital.value == "") msg += "實收資本額, ";
      if (msg != "") msg = "請填寫" + msg.substring(0, msg.length - 2) + "欄位";
      return msg;
    }
    function regClick(e, go) {
      // 各欄位皆必填
      var alertMessage = CheckInput();
      if (alertMessage != "") {
        $q.notify({
          type: 'warning',
          message: alertMessage,
          position: "center",
        });
        return;
      }
      if (!agreeRight.value) {
        $q.notify({
          type: 'warning',
          message: "請閱讀並同意服務條款",
          position: "center",
        });
        return;
      }
      const sendObject = {
        UBN: UBN.value,
        Type: 1,
        RegistName: regName.value,
        BusinessName: businessName.value,
        RegistAddress: address.value,
        BusinessAddress: address.value,
        ContactName: contactName.value,
        ContactMobile: phoneNum.value,
        ContactMail: email.value,
        SelectPayment: payment_select.value
      };
      console.log(sendObject);
      //return;
      // 打往後端
      // 預註冊
      alert("開發中");
      return;
      api.post('/Merchant/Preregister', sendObject, {
        headers: {}
      })
        .then((response) => {
          console.log(response.data);
          $q.notify({
            message: "已送出註冊，請至信箱確認",
            type: 'positive',
            position: "center"
          });
        })
        .catch(function (error) {
          // handle error
          $q.notify({
            type: 'negative',
            message: "連線失敗 " + error,
            position: "center",
          });
        })
    }
    const $q = useQuasar()
    function checkTaxInfo(val) {

      if (val.length != 8) {
        // 統編必須是8碼
        return ('統編長度為8碼');
      }
      // 財政部API查詢公司登記
      api.get('https://eip.fia.gov.tw/OAI/api/businessRegistration/' + val)
        .then((response) => {
          companyInfo.value = response.data;
          console.log(response.data);
          regName.value = companyInfo.value.businessNm;
          address.value = companyInfo.value.businessAddress;
          return true;
        })
        .catch(function (error) {
          console.log(error.config);
          $q.notify({
            message: "查無此統編",
            position: "center",
            type: 'negative',
            actions: [
              { icon: 'close', color: 'white', round: true, handler: () => { /* ... */ } }
            ]
          });
        });
    }
    return {
      regClick,
      checkTaxInfo,
      companyInfo: ref(null),
      email: ref(""),
      phonePrefix: ref("+886"),
      phoneNum: ref(""),
      password: ref(""),
      UBN: ref(""),
      regName: ref(""),
      businessName: ref(""),
      address: ref(""),
      contactName: ref(""),
      leaderName: ref(""),
      inviter: ref(""),
      registerDate: ref(""),
      capital: ref(""),
      leaderId: ref(""),
      leaderDate: ref(""),
      idLocate: ref("請選擇"),
      idType: ref("請選擇"),
      idYear: ref(""),
      idMonth: ref(1),
      idDate: ref(1),
      isPwd: ref(true),
      confirmPassword: ref(""),
      isConfirmPwd: ref(true),
      verify: ref(""),
      agreeRight: ref(false),
      taxType: ref(0),
      payment_select: ref(['P10']),
      pinCode: ref(""),
      isSuccess: true,
      entityShop: ref('entity'),
      companyDocLog: ref(false),
      companyIdCardLog: ref(false),
      IdCardLog: ref(false),
      HealthCardLog: ref(false),
      mcc: ref(''),
      productDesc: ref(''),
      storeLink: ref(''),
      tax_option: [
        { label: '工商登記', value: 0, slot: '統一編號', ext_data: '電商網址', ext_data2: '營業登記地址' },
        { label: '個人戶', value: 1, slot: '身分證字號', ext_data: '姓名', ext_data2: '聯絡人地址' }
      ]
    }
  },
  methods: {
    // 刷新验证码
    refreshIdentifyCode() {
      this.identifyCode = "";
      this.makeIdentifyCode(4);
    },
    // 生成4位数的随机验证码
    makeIdentifyCode(l) {
      for (let i = 0; i < l; i++) {
        this.identifyCode +=
          this.identifyCodes[this.randomNum(0, this.identifyCodes.length)];
      }
    },
    // 生成单个验证码
    randomNum(min, max) {
      return Math.floor(Math.random() * (max - min) + min);
    },
    addFileField(type) {
      // 添加一個新的文件欄位
      this.fileFields[type].push({ previewUrl: null, file: null, fileName: null });
    },
    removeFileField(type, index) {
      if (index === 0) {
        return;
      }
      // 移除指定的文件欄位
      this.fileFields[type].splice(index, 1);
    },
    onFileChange(type, index, event) {
      if (event && event.target && event.target.files && event.target.files.length > 0) {
        const file = event.target.files[0];
        this.fileFields[type][index].file = file;

        // 判斷文件格式
        if (file.type.startsWith("image/")) {
          // 是圖片則生成預覽 URL
          this.fileFields[type][index].isImage = true;
          this.fileFields[type][index].previewUrl = URL.createObjectURL(file);
          this.fileFields[type][index].fileName = null;
        } else if (file.type === "application/pdf") {
          // 是 PDF 則顯示文件名稱
          this.fileFields[type][index].isImage = false;
          this.fileFields[type][index].previewUrl = null;
          this.fileFields[type][index].fileName = file.name;
        } else {
          // 清除欄位（不是圖片也不是 PDF）
          this.fileFields[type][index].previewUrl = null;
          this.fileFields[type][index].fileName = null;
        }
      } else {
        console.error("未找到文件，請檢查 QFile 的事件綁定");
      }
    }
  },
  mounted() {
    // 初始化验证码
    this.identifyCode = "";
    this.makeIdentifyCode(4);
  }
};

</script>

<style lang="sass">

.inputContent
  margin: 30px 0

  .inputGroup
    margin-bottom: 1rem

.SeparatorTxt
  width: 100%
  height: 40px
  display: flex
  justify-content: space-between
  align-items: center
  margin: 10px auto

  .line
    height: 2px
    flex-grow: 1
    background-color: #dfdfdf

  .text
    margin: 0 5px

.BtnGroup
  display: flex
  margin-top: 40px
  justify-content: center

  .q-btn
    width: 100%
    max-width: 400px

.VerificationCode
  flex: 0 0 auto

  .Title
    width: 100%

  .refresh
    cursor: pointer

  canvas
    vertical-align: sub

.checkTerms
  display: grid
  justify-content: center

  a
    color: #fcb335

.fileField
  width: 100%
  aspect-ratio: 1.2 / 1

.q-field__label
  left: 50%
  top: 50%
  transform: translate(-50%, -50%) !important
  z-index: -1

.q-field__control
  height: 100% !important

.q-field__native
  justify-content: center
  align-items: center

.removeFileField
    position: absolute
    right: 10px
    top: 10px

.q-field__native span
  transform: translateX(-10px)

.addBtn
  width: 100%
  max-width: 200px
  aspect-ratio: 1.4 / 1
  i
    color: #333

</style>
