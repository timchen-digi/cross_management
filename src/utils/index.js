// API取商戶清單
import { ref } from 'vue'
import { api } from 'boot/axios'
import { useUserStore, useMerchantStore } from "../stores";
// async function GetAllMerchant() {
//   api.get('/Merchant/GetList')
//     .then((response) => {
//       console.log(response.data);
//       resolveComponent()
//     })
//     .catch(function (error) {
//       console.log(error);
//     })
// }
//export const MerchantList = ref(GetAllMerchant());

export const MerchantList = ref([
  { label: '數位鎏', value: '142864983000001' },
  { label: '五七國際', value: '183062446000001' },
  { label: 'Waffo', value: '332715810000001' },
  { label: 'Airwallex', value: '391440300000001' }
])

//數字千分位
export const toThousands = (num) => {
  var result = "",
    counter = 0;
  num = (num || 0).toString();
  for (var i = num.length - 1; i >= 0; i--) {
    counter++;
    result = num.charAt(i) + result;
    if (!(counter % 3) && i != 0) {
      result = "," + result;
    }
  }
  return result;
};
export function GetMerchantName(id, arr) {
  //console.log(arr);
  if (!arr) {
    console.log("FETCH");
    const MerchantStore = useMerchantStore();
    arr = MerchantStore.MerchantMap;
    console.log(arr);
  }
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].value === id) {
      return arr[i].label;
    }
  }
}
export function GetStaticMerchantName(id) {
  api.get('/Merchant/GetList')
    .then((response) => {
      console.log(response.data);
      arr = response.data;
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].value === id) {
          return arr[i].label;
        }
      }
    })
    .catch(function (error) {
      console.log(error);
      return []
    })
}

export function FixNumrber(num) {
  return (Math.round(num * 100) / 100).toFixed(4);
}


export const getSHA256Hash = async (input) => {
  const textAsBuffer = new TextEncoder().encode(input);
  const hashBuffer = await window.crypto.subtle.digest("SHA-256", textAsBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hash = hashArray
    .map((item) => item.toString(16).padStart(2, "0"))
    .join("");
  return hash;
};

// 取import function
// import sha256 from 'crypto-js/sha256';
import AES from 'crypto-js/aes';
export function enc(obj) {
  const AESKey = "87654321876543218765432187654321".padEnd(32, '1');
  let timestamp = new Date().getTime();
  obj['Timestamp'] = timestamp;
  const ciphertext = AES.encrypt(JSON.stringify(obj), AESKey).toString();
  return ciphertext;
}

export function GetBatchName(batchId) {
  switch (batchId) {
    case '01': return '每日結算'
    case '02': return '撥款清算'
    case '03': return '額度重置'
    case '04': return '發票開立'
    case '05': return '補發通知'
    default: return ''
  }
};
