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
