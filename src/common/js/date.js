let formatTime = function (timeStamp, fmt) {
  let date = new Date(timeStamp);
  let fmtMap = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds()
  };
  if ((/(y+)/).test(fmt)) {
    fmt = fmt.replace(RegExp.$1, String(date.getFullYear()).substr(4 - RegExp.$1.length));
  }
  for (let key in fmtMap) {
    if (new RegExp(`(${key})`).test(fmt)) {
      let str = String(fmtMap[key]);

      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : _padZero(str));
    }
  }
  return fmt;
};

function _padZero (str) {
  return ('00' + str).substr(str.length);
};

export default formatTime;
