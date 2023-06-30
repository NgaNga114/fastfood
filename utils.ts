export function timeDifference(current: any, previous: any) {
  var msPerMinute = 60 * 1000;
  var msPerHour = msPerMinute * 60;
  var msPerDay = msPerHour * 24;
  var msPerMonth = msPerDay * 30;
  var msPerYear = msPerDay * 365;

  var elapsed = current - previous;

  if (elapsed < msPerMinute) {
    return Math.round(elapsed / 1000) + "секунд назад";
  } else if (elapsed < msPerHour) {
    return Math.round(elapsed / msPerMinute) + " минут назад";
  } else if (elapsed < msPerDay) {
    return Math.round(elapsed / msPerHour) + "час назад";
  } else if (elapsed < msPerMonth) {
    return Math.round(elapsed / msPerDay) + " день назад";
  } else if (elapsed < msPerYear) {
    return Math.round(elapsed / msPerMonth) + "месяц назад";
  } else {
    return Math.round(elapsed / msPerYear) + " год назад";
  }
}
