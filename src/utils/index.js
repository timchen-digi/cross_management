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
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].value === id) {
      return arr[i].label;
    }
  }
}

// TODO: API取商戶清單
import { ref } from 'vue'
export const MerchantList = ref([
  { label: '數位鎏', value: '142864983000001' },
  { label: '五七國際', value: '183062446000001' },
  { label: 'Waffo', value: '332715810000001' },
  { label: 'Airwallex', value: '391440300000001' }
])
