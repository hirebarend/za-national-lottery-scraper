function convertJackpotRawToJackpot(jackpotRaw) {
  const regExp = new RegExp(/^R(.+)$/);

  const regExpExecArray = regExp.exec(jackpotRaw);

  if (!regExpExecArray) {
    return null;
  }

  return parseFloat(regExpExecArray[1].replace(/,/g, ""));
}

function convertTimestampRawToTimestamp(timestampRaw) {
  const regExp = new RegExp(/^<span>.*<\/span><br>(.*)$/);

  const regExpExecArray = regExp.exec(timestampRaw);

  if (!regExpExecArray) {
    return null;
  }

  const timestamp = new Date(Date.parse(`${regExpExecArray[1]}`)).getTime();

  return timestamp - new Date().getTimezoneOffset() * 60000;
}

module.exports = { convertJackpotRawToJackpot, convertTimestampRawToTimestamp };
